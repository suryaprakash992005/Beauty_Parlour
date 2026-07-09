import { supabase } from '../lib/supabase';

// Helper to convert base64 image data to a Blob for upload
function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export interface HomepageBanner {
  smallHeading: string;
  mainHeading: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  imageUrl: string;
  videoUrl?: string;
}

export async function uploadHeroAsset(fileOrBase64: File | string, isVideo = false): Promise<string> {
  let fileBody: File | Blob;
  let fileExtension = isVideo ? 'mp4' : 'jpg';
  
  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      fileBody = base64ToBlob(fileOrBase64);
      const mime = fileOrBase64.split(';')[0].split(':')[1];
      fileExtension = mime.split('/')[1] || fileExtension;
    } else {
      return fileOrBase64;
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
    throw new Error(`Failed to upload hero asset: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('hero')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

const DEFAULT_BANNER: HomepageBanner = {
  smallHeading: 'Bespoke Hair Artistry',
  mainHeading: 'Transform Your Style With Professional Beauty Experts',
  description: 'Where premium style meets expert care. Experience the ultimate hair design, bridal cosmetics, nail artistry, and soothing spa therapies at ZHA Hair Saloon.',
  primaryBtn: 'Book Appointment',
  secondaryBtn: 'Explore Services',
  imageUrl: '/salon_green_theme_1.jpg',
};

export async function getHomepageBanner(): Promise<HomepageBanner> {
  try {
    const { data, error } = await supabase
      .from('homepage_banner')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      return DEFAULT_BANNER;
    }

    const banner = data[0];
    return {
      smallHeading: banner.small_heading || DEFAULT_BANNER.smallHeading,
      mainHeading: banner.main_heading || DEFAULT_BANNER.mainHeading,
      description: banner.description || DEFAULT_BANNER.description,
      primaryBtn: banner.primary_btn_text || DEFAULT_BANNER.primaryBtn,
      secondaryBtn: banner.secondary_btn_text || DEFAULT_BANNER.secondaryBtn,
      imageUrl: banner.hero_image_url || DEFAULT_BANNER.imageUrl,
      videoUrl: banner.hero_video_url || undefined
    };
  } catch {
    return DEFAULT_BANNER;
  }
}

export async function updateHomepageBanner(banner: Partial<HomepageBanner>): Promise<HomepageBanner> {
  const { data: existingData } = await supabase
    .from('homepage_banner')
    .select('id')
    .limit(1);

  const payload = {
    small_heading: banner.smallHeading,
    main_heading: banner.mainHeading,
    description: banner.description,
    primary_btn_text: banner.primaryBtn,
    secondary_btn_text: banner.secondaryBtn,
    hero_image_url: banner.imageUrl,
    hero_video_url: banner.videoUrl
  };

  let result;
  if (existingData && existingData.length > 0) {
    const { data, error } = await supabase
      .from('homepage_banner')
      .update(payload)
      .eq('id', existingData[0].id)
      .select()
      .single();

    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('homepage_banner')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    result = data;
  }

  return {
    smallHeading: result.small_heading,
    mainHeading: result.main_heading,
    description: result.description,
    primaryBtn: result.primary_btn_text,
    secondaryBtn: result.secondary_btn_text,
    imageUrl: result.hero_image_url,
    videoUrl: result.hero_video_url
  };
}
