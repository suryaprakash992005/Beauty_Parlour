import { supabase } from '../lib/supabase';

// ─── Helper: base64 string → Blob ───────────────────────────────────────────
function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) uInt8Array[i] = raw.charCodeAt(i);
  return new Blob([uInt8Array], { type: contentType });
}

// ─── Types ──────────────────────────────────────────────────────────────────
export interface HomepageBanner {
  smallHeading: string;
  mainHeading: string;
  subtitle: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  /** Primary image (legacy, kept for compatibility) */
  imageUrl: string;
  /** Ordered list of hero slide image URLs managed from Admin */
  slideUrls: string[];
}

// ─── Defaults ───────────────────────────────────────────────────────────────
const DEFAULT_SLIDE_URLS = [
  '/salon_green_theme_1.jpg',
  '/salon_green_theme_2.jpg',
  '/salon_green_theme_3.jpg',
];

const DEFAULT_BANNER: HomepageBanner = {
  smallHeading: 'Bespoke Hair Artistry',
  mainHeading: 'Transform Your Style With Professional Beauty Experts',
  subtitle: 'Luxury Beauty Experience',
  description:
    'Where premium style meets expert care. Experience the ultimate hair design, bridal cosmetics, nail artistry, and soothing spa therapies at Zha Aesthetic Salon.',
  primaryBtn: 'Book Appointment',
  secondaryBtn: 'Explore Services',
  imageUrl: '/salon_green_theme_1.jpg',
  slideUrls: DEFAULT_SLIDE_URLS,
};

// ─── Upload a single hero slide image to Supabase Storage ───────────────────
export async function uploadHeroAsset(fileOrBase64: File | string): Promise<string> {
  let fileBody: File | Blob;
  let fileExtension = 'jpg';

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      fileBody = base64ToBlob(fileOrBase64);
      const mime = fileOrBase64.split(';')[0].split(':')[1];
      fileExtension = mime.split('/')[1] || fileExtension;
    } else {
      return fileOrBase64; // already a URL
    }
  } else {
    fileBody = fileOrBase64;
    fileExtension = fileOrBase64.name.split('.').pop() || fileExtension;
  }

  const fileName = `hero_${Date.now()}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('hero')
    .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

  if (error) {
    if (
      error.message.includes('bucket') ||
      error.message.includes('not found') ||
      error.message.includes('does not exist')
    ) {
      throw new Error(
        "Storage bucket 'hero' was not found. Please create the 'hero' bucket in your Supabase console."
      );
    }
    throw new Error(`Failed to upload hero asset: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('hero').getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}

// ─── Delete a hero slide image from Supabase Storage ────────────────────────
export async function deleteHeroAsset(publicUrl: string): Promise<void> {
  try {
    // Extract the file path from the full public URL
    const url = new URL(publicUrl);
    // Path is everything after /storage/v1/object/public/hero/
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/hero\/(.+)$/);
    if (!match) return; // Not a Supabase storage URL — skip deletion

    const filePath = match[1];
    await supabase.storage.from('hero').remove([filePath]);
  } catch {
    // Ignore deletion errors (file may already be removed)
  }
}

// ─── Parse slide URLs from DB row ───────────────────────────────────────────
function parseSlideUrls(raw: unknown): string[] {
  if (Array.isArray(raw) && raw.length > 0) return raw as string[];
  if (typeof raw === 'string' && raw.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
    } catch {
      /* ignore */
    }
  }
  return [];
}

// ─── Fetch banner from DB ────────────────────────────────────────────────────
export async function getHomepageBanner(): Promise<HomepageBanner> {
  try {
    const { data, error } = await supabase
      .from('homepage_banner')
      .select('*')
      .order('id', { ascending: true })
      .limit(1);

    if (error) {
      if (error.message.includes('column') || error.code === '42703') {
        throw new Error(
          "Database column mismatch: The columns in the 'homepage_banner' table do not match the expected schema."
        );
      }
      throw error;
    }

    if (!data || data.length === 0) return DEFAULT_BANNER;

    const banner = data[0];
    const slideUrls = parseSlideUrls(banner.slide_urls);
    const primaryImage = banner.image_url || DEFAULT_BANNER.imageUrl;

    return {
      smallHeading: banner.top_label || DEFAULT_BANNER.smallHeading,
      mainHeading: banner.title || DEFAULT_BANNER.mainHeading,
      subtitle: banner.subtitle || DEFAULT_BANNER.subtitle,
      description: banner.description || DEFAULT_BANNER.description,
      primaryBtn: banner.primary_button || DEFAULT_BANNER.primaryBtn,
      secondaryBtn: banner.secondary_button || DEFAULT_BANNER.secondaryBtn,
      imageUrl: primaryImage,
      slideUrls: slideUrls.length > 0 ? slideUrls : DEFAULT_BANNER.slideUrls,
    };
  } catch (err: any) {
    console.error('Failed to get homepage banner:', err);
    if (err.message && (err.message.includes('column') || err.message.includes('relation'))) {
      throw err;
    }
    return DEFAULT_BANNER;
  }
}

// ─── Save banner (text + slide URLs) to DB ──────────────────────────────────
export async function updateHomepageBanner(banner: Partial<HomepageBanner>): Promise<HomepageBanner> {
  const { data: existingData, error: fetchError } = await supabase
    .from('homepage_banner')
    .select('id')
    .order('id', { ascending: true })
    .limit(1);

  if (fetchError) {
    if (fetchError.message.includes('column') || fetchError.code === '42703') {
      throw new Error(
        "Database column mismatch: The columns in the 'homepage_banner' table do not match the expected schema."
      );
    }
    throw fetchError;
  }

  // Store slide_urls as a JSON array; first slide also goes into image_url for legacy compatibility
  const slideUrlsArray = (banner.slideUrls && banner.slideUrls.length > 0)
    ? banner.slideUrls
    : (banner.imageUrl ? [banner.imageUrl] : DEFAULT_SLIDE_URLS);

  const payload = {
    top_label: banner.smallHeading,
    title: banner.mainHeading,
    subtitle: banner.subtitle,
    description: banner.description,
    primary_button: banner.primaryBtn,
    secondary_button: banner.secondaryBtn,
    image_url: slideUrlsArray[0] || banner.imageUrl,
    slide_urls: JSON.stringify(slideUrlsArray),
  };

  let result;
  if (existingData && existingData.length > 0) {
    const { data, error } = await supabase
      .from('homepage_banner')
      .update(payload)
      .eq('id', existingData[0].id)
      .select()
      .single();

    if (error) {
      if (error.message.includes('column') || error.code === '42703') {
        throw new Error(
          "Database column mismatch during update: Please check your 'homepage_banner' table columns."
        );
      }
      throw error;
    }
    result = data;
  } else {
    const { data, error } = await supabase
      .from('homepage_banner')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.message.includes('column') || error.code === '42703') {
        throw new Error(
          "Database column mismatch during insert: Please check your 'homepage_banner' table columns."
        );
      }
      throw error;
    }
    result = data;
  }

  const savedSlides = parseSlideUrls(result.slide_urls);

  return {
    smallHeading: result.top_label,
    mainHeading: result.title,
    subtitle: result.subtitle || '',
    description: result.description,
    primaryBtn: result.primary_button,
    secondaryBtn: result.secondary_button,
    imageUrl: result.image_url,
    slideUrls: savedSlides.length > 0 ? savedSlides : slideUrlsArray,
  };
}
