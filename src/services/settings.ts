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

export interface SalonSettings {
  studioName: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  openHoursWeekdays: string;
  openHoursWeekends: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export async function uploadLogo(fileOrBase64: File | string): Promise<string> {
  let fileBody: File | Blob;
  let fileExtension = 'png';
  
  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      fileBody = base64ToBlob(fileOrBase64);
      const mime = fileOrBase64.split(';')[0].split(':')[1];
      fileExtension = mime.split('/')[1] || 'png';
    } else {
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    fileExtension = fileOrBase64.name.split('.').pop() || 'png';
  }

  const fileName = `logo_${Date.now()}.${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('logo')
    .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

  if (error) {
    throw new Error(`Failed to upload logo image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('logo')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

const DEFAULT_SETTINGS: SalonSettings = {
  studioName: 'ZHA',
  logoUrl: '',
  phone: '+91 98765 43210',
  email: 'hello@zhahairsaloon.com',
  address: '42, Rose Garden Lane, Luxury District, Mumbai — 400001',
  openHoursWeekdays: 'Mon–Sat: 9 AM – 8 PM',
  openHoursWeekends: 'Sunday: 10 AM – 6 PM',
  whatsapp: '8270904659',
  instagram: 'https://instagram.com/zhahairsaloon',
  facebook: 'https://facebook.com/zhahairsaloon',
  youtube: 'https://youtube.com/zhahairsaloon',
};

export async function getSalonSettings(): Promise<SalonSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      return DEFAULT_SETTINGS;
    }

    const s = data[0];
    return {
      studioName: s.studio_name || DEFAULT_SETTINGS.studioName,
      logoUrl: s.logo_url || DEFAULT_SETTINGS.logoUrl,
      phone: s.phone || DEFAULT_SETTINGS.phone,
      email: s.email || DEFAULT_SETTINGS.email,
      address: s.address || DEFAULT_SETTINGS.address,
      openHoursWeekdays: s.open_hours_weekdays || DEFAULT_SETTINGS.openHoursWeekdays,
      openHoursWeekends: s.open_hours_weekends || DEFAULT_SETTINGS.openHoursWeekends,
      whatsapp: s.whatsapp || DEFAULT_SETTINGS.whatsapp,
      instagram: s.instagram || DEFAULT_SETTINGS.instagram,
      facebook: s.facebook || DEFAULT_SETTINGS.facebook,
      youtube: s.youtube || DEFAULT_SETTINGS.youtube
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSalonSettings(settings: Partial<SalonSettings>): Promise<SalonSettings> {
  const { data: existingData } = await supabase
    .from('settings')
    .select('id')
    .limit(1);

  const payload = {
    studio_name: settings.studioName,
    logo_url: settings.logoUrl,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    open_hours_weekdays: settings.openHoursWeekdays,
    open_hours_weekends: settings.openHoursWeekends,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
    facebook: settings.facebook,
    youtube: settings.youtube
  };

  let result;
  if (existingData && existingData.length > 0) {
    const { data, error } = await supabase
      .from('settings')
      .update(payload)
      .eq('id', existingData[0].id)
      .select()
      .single();

    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    result = data;
  }

  return {
    studioName: result.studio_name,
    logoUrl: result.logo_url,
    phone: result.phone,
    email: result.email,
    address: result.address,
    openHoursWeekdays: result.open_hours_weekdays,
    openHoursWeekends: result.open_hours_weekends,
    whatsapp: result.whatsapp,
    instagram: result.instagram,
    facebook: result.facebook,
    youtube: result.youtube
  };
}
