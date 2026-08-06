import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

export interface BannerSlide {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────
//  UPLOAD helper — stores image in the 'hero' Supabase bucket
// ─────────────────────────────────────────────────────────────

function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) uInt8Array[i] = raw.charCodeAt(i);
  return new Blob([uInt8Array], { type: contentType });
}

export async function uploadBannerImage(fileOrBase64: File | string): Promise<string> {
  let fileBody: File | Blob;
  let ext = 'jpg';

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      fileBody = base64ToBlob(fileOrBase64);
      const mime = fileOrBase64.split(';')[0].split(':')[1];
      ext = mime.split('/')[1] || ext;
    } else {
      return fileOrBase64; // already a URL
    }
  } else {
    fileBody = fileOrBase64;
    ext = fileOrBase64.name.split('.').pop() || ext;
  }

  const fileName = `slide_${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('hero')
    .upload(fileName, fileBody, { cacheControl: '31536000', upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from('hero').getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─────────────────────────────────────────────────────────────
//  READ slides (sorted by sort_order, only active)
// ─────────────────────────────────────────────────────────────

export async function getBannerSlides(): Promise<BannerSlide[]> {
  const { data, error } = await supabase
    .from('banner_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load slides: ${error.message}`);
  if (!data || data.length === 0) return [];

  return data.map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

// ─────────────────────────────────────────────────────────────
//  READ ALL slides (admin — includes inactive)
// ─────────────────────────────────────────────────────────────

export async function getAllBannerSlides(): Promise<BannerSlide[]> {
  const { data, error } = await supabase
    .from('banner_slides')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load slides: ${error.message}`);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

// ─────────────────────────────────────────────────────────────
//  ADD a new slide
// ─────────────────────────────────────────────────────────────

export async function addBannerSlide(imageUrl: string, sortOrder: number): Promise<BannerSlide> {
  const { data, error } = await supabase
    .from('banner_slides')
    .insert({ image_url: imageUrl, sort_order: sortOrder, is_active: true })
    .select()
    .single();

  if (error) throw new Error(`Failed to add slide: ${error.message}`);
  return { id: data.id, imageUrl: data.image_url, sortOrder: data.sort_order, isActive: data.is_active };
}

// ─────────────────────────────────────────────────────────────
//  DELETE a slide
// ─────────────────────────────────────────────────────────────

export async function deleteBannerSlide(id: number): Promise<void> {
  const { error } = await supabase.from('banner_slides').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete slide: ${error.message}`);
}

// ─────────────────────────────────────────────────────────────
//  UPDATE sort orders (reorder)
// ─────────────────────────────────────────────────────────────

export async function reorderBannerSlides(slides: { id: number; sortOrder: number }[]): Promise<void> {
  const updates = slides.map(({ id, sortOrder }) =>
    supabase.from('banner_slides').update({ sort_order: sortOrder }).eq('id', id)
  );
  const results = await Promise.all(updates);
  for (const { error } of results) {
    if (error) throw new Error(`Failed to reorder: ${error.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
//  TOGGLE active / inactive
// ─────────────────────────────────────────────────────────────

export async function toggleBannerSlide(id: number, isActive: boolean): Promise<void> {
  const { error } = await supabase.from('banner_slides').update({ is_active: isActive }).eq('id', id);
  if (error) throw new Error(`Failed to toggle slide: ${error.message}`);
}

// ─────────────────────────────────────────────────────────────
//  LEGACY exports — kept so existing AdminBanner import doesn't
//  break while we migrate. Remove after full migration.
// ─────────────────────────────────────────────────────────────
export type HomepageBanner = {
  smallHeading: string;
  mainHeading: string;
  subtitle: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  imageUrl: string;
};

export async function uploadHeroAsset(f: File | string) { return uploadBannerImage(f); }
export async function getHomepageBanner(): Promise<HomepageBanner> {
  return {
    smallHeading: 'ZHA Aesthetic Salon',
    mainHeading: 'Transform Your Style With Professional Beauty Experts',
    subtitle: 'Luxury Beauty Experience',
    description: 'Where premium style meets expert care.',
    primaryBtn: 'Book Appointment',
    secondaryBtn: 'Explore Services',
    imageUrl: '',
  };
}
export async function updateHomepageBanner() { return getHomepageBanner(); }
