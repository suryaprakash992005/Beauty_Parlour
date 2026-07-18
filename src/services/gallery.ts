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

export interface GalleryItem {
  id?: number;
  title: string;
  category: string;
  url: string;
  beforeUrl?: string;
}

export async function uploadGalleryImage(fileOrBase64: File | string): Promise<string> {
  let fileBody: File | Blob;
  let fileExtension = 'jpg';
  
  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      fileBody = base64ToBlob(fileOrBase64);
      const mime = fileOrBase64.split(';')[0].split(':')[1];
      fileExtension = mime.split('/')[1] || 'jpg';
    } else {
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    fileExtension = fileOrBase64.name.split('.').pop() || 'jpg';
  }

  const fileName = `gallery_${Date.now()}.${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

  if (error) {
    throw new Error(`Failed to upload gallery image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    url: item.image_url || item.url,
    beforeUrl: item.before_image_url || item.beforeUrl
  }));
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      title: item.title,
      category: item.category,
      image_url: item.url,
      before_image_url: item.beforeUrl
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    url: data.image_url,
    beforeUrl: data.before_image_url
  };
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
