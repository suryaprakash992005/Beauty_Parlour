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
  studioName: string; // mapped to salon_name
  logoUrl: string;    // mapped to logo_url
  phone: string;
  email: string;
  address: string;
  openHoursWeekdays: string; // combined/parsed from working_hours
  openHoursWeekends: string; // combined/parsed from working_hours
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  googleMaps: string; // mapped to google_maps
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
  studioName: 'Zha Aesthetic Salon',
  logoUrl: '/logo.jpg',
  phone: '+91 9688999188',
  email: 'suryasuryaprakash2005@gmail.com',
  address: '1st floor, MPS Traders Building, opposite to Taluka Office, Nehru Nagar, Mohanur, Tamil Nadu 637015',
  openHoursWeekdays: 'Mon–Fri: 9 AM – 9 PM',
  openHoursWeekends: 'Sat-Sun: 7 AM – 9 PM',
  whatsapp: '8270904659',
  instagram: 'https://www.instagram.com/zha_aesthetic_salon/',
  facebook: 'https://facebook.com/zhahairsaloon',
  youtube: 'https://youtube.com/zhahairsaloon',
  googleMaps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4842525791776!2d78.1382138!3d11.0643187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa3363e69a4fb1%3A0x2d0eca41c4df20aa!2sZha%20Aesthetic%20Salon%20-%20UNISEX!5e0!3m2!1sen!2sin!4v1721307180000'
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

    // Parse working_hours (format: "Weekdays | Weekends")
    const workingHoursStr = s.working_hours || '';
    let openHoursWeekdays = DEFAULT_SETTINGS.openHoursWeekdays;
    let openHoursWeekends = DEFAULT_SETTINGS.openHoursWeekends;
    if (workingHoursStr.includes('|')) {
      const parts = workingHoursStr.split('|').map((p: string) => p.trim());
      openHoursWeekdays = parts[0] || '';
      openHoursWeekends = parts[1] || '';
    } else if (workingHoursStr) {
      openHoursWeekdays = workingHoursStr;
      openHoursWeekends = '';
    }

    return {
      studioName: s.salon_name || DEFAULT_SETTINGS.studioName,
      logoUrl: s.logo_url || DEFAULT_SETTINGS.logoUrl,
      phone: s.phone || DEFAULT_SETTINGS.phone,
      email: s.email || DEFAULT_SETTINGS.email,
      address: s.address || DEFAULT_SETTINGS.address,
      openHoursWeekdays,
      openHoursWeekends,
      whatsapp: s.whatsapp || DEFAULT_SETTINGS.whatsapp,
      instagram: s.instagram || DEFAULT_SETTINGS.instagram,
      facebook: s.facebook || DEFAULT_SETTINGS.facebook,
      youtube: s.youtube || DEFAULT_SETTINGS.youtube,
      googleMaps: s.google_maps || DEFAULT_SETTINGS.googleMaps
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

  // Combine Weekdays and Weekends into working_hours string before saving
  let working_hours = undefined;
  if (settings.openHoursWeekdays !== undefined || settings.openHoursWeekends !== undefined) {
    const weekdays = settings.openHoursWeekdays || '';
    const weekends = settings.openHoursWeekends || '';
    working_hours = `${weekdays} | ${weekends}`;
  }

  const payload: any = {};
  if (settings.studioName !== undefined) payload.salon_name = settings.studioName;
  if (settings.logoUrl !== undefined) payload.logo_url = settings.logoUrl;
  if (settings.phone !== undefined) payload.phone = settings.phone;
  if (settings.email !== undefined) payload.email = settings.email;
  if (settings.address !== undefined) payload.address = settings.address;
  if (working_hours !== undefined) payload.working_hours = working_hours;
  if (settings.whatsapp !== undefined) payload.whatsapp = settings.whatsapp;
  if (settings.instagram !== undefined) payload.instagram = settings.instagram;
  if (settings.facebook !== undefined) payload.facebook = settings.facebook;
  if (settings.youtube !== undefined) payload.youtube = settings.youtube;
  if (settings.googleMaps !== undefined) payload.google_maps = settings.googleMaps;

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

  // Parse working_hours back to return to the caller
  const workingHoursStr = result.working_hours || '';
  let openHoursWeekdays = '';
  let openHoursWeekends = '';
  if (workingHoursStr.includes('|')) {
    const parts = workingHoursStr.split('|').map((p: string) => p.trim());
    openHoursWeekdays = parts[0] || '';
    openHoursWeekends = parts[1] || '';
  } else if (workingHoursStr) {
    openHoursWeekdays = workingHoursStr;
  }

  return {
    studioName: result.salon_name,
    logoUrl: result.logo_url,
    phone: result.phone,
    email: result.email,
    address: result.address,
    openHoursWeekdays,
    openHoursWeekends,
    whatsapp: result.whatsapp,
    instagram: result.instagram,
    facebook: result.facebook,
    youtube: result.youtube,
    googleMaps: result.google_maps
  };
}
