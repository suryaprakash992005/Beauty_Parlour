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

export interface ServiceItem {
  id?: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

export async function uploadServiceImage(fileOrBase64: File | string): Promise<string> {
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

  const fileName = `service_${Date.now()}.${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('services')
    .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

  if (error) {
    throw new Error(`Failed to upload service image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('services')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function getServices(): Promise<ServiceItem[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    duration: item.duration,
    description: item.description,
    imageUrl: item.image_url || item.imageUrl,
    active: item.active !== false
  }));
}

export async function addService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      description: service.description,
      image_url: service.imageUrl,
      active: service.active
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: data.price,
    duration: data.duration,
    description: data.description,
    imageUrl: data.image_url,
    active: data.active
  };
}

export async function updateService(id: number, service: Partial<ServiceItem>): Promise<ServiceItem> {
  const updatePayload: any = {};
  if (service.name !== undefined) updatePayload.name = service.name;
  if (service.category !== undefined) updatePayload.category = service.category;
  if (service.price !== undefined) updatePayload.price = service.price;
  if (service.duration !== undefined) updatePayload.duration = service.duration;
  if (service.description !== undefined) updatePayload.description = service.description;
  if (service.imageUrl !== undefined) updatePayload.image_url = service.imageUrl;
  if (service.active !== undefined) updatePayload.active = service.active;

  const { data, error } = await supabase
    .from('services')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: data.price,
    duration: data.duration,
    description: data.description,
    imageUrl: data.image_url,
    active: data.active
  };
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
