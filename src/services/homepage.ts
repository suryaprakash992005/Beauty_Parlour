import { supabase } from '../lib/supabase';

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
  id?: string;
  smallHeading: string;
  mainHeading: string;
  subtitle: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  imageUrl: string;
}

export async function uploadHeroAsset(fileOrBase64: File | string): Promise<string> {
  let fileBody: File | Blob;
  let fileExtension = 'jpg';
  
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

  const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('hero')
    .upload(fileName, fileBody, { cacheControl: '3600', upsert: true });

  if (error) {
    if (error.message.includes('bucket') || error.message.includes('not found') || error.message.includes('does not exist')) {
      throw new Error("Storage bucket 'hero' was not found. Please create the 'hero' bucket in your Supabase console.");
    }
    throw new Error(`Failed to upload hero asset: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('hero')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

const DEFAULT_BANNERS: HomepageBanner[] = [
  {
    id: 'default-1',
    smallHeading: 'Bespoke Aesthetic Artistry',
    mainHeading: 'Transform Your Style With Professional Beauty Experts',
    subtitle: 'Luxury Beauty Experience',
    description: 'Where premium style meets expert care. Experience the ultimate hair design, bridal cosmetics, nail artistry, and soothing spa therapies at ZHa Aesthetic Salon.',
    primaryBtn: 'Book Appointment',
    secondaryBtn: 'Explore Services',
    imageUrl: 'https://rkbxikbzjemccuppiuuu.supabase.co/storage/v1/object/public/hero/hero_1784208729302.webp',
  },
  {
    id: 'default-2',
    smallHeading: 'Celebrity Bridal Suite',
    mainHeading: 'Flawless HD Bridal Makeovers & Hair Artistry',
    subtitle: 'Unmatched Elegance For Your Big Day',
    description: 'Customized bridal grooming, airbrush makeup, and saree draping tailored for Indian brides in Mohanur & Namakkal.',
    primaryBtn: 'Plan Your Bridal Look',
    secondaryBtn: 'View Portfolio',
    imageUrl: '/salon_green_theme_2.jpg',
  },
  {
    id: 'default-3',
    smallHeading: 'Organic Skincare & Keratin Therapy',
    mainHeading: 'Nourish Your Hair & Glowing Skin',
    subtitle: 'Advanced Spa Treatments',
    description: 'Smooth frizz-free keratin hair treatments, hair botox, and rejuvenating hydra facials designed for ultimate shine.',
    primaryBtn: 'Explore Treatments',
    secondaryBtn: 'Book Facial',
    imageUrl: '/salon_green_theme_3.jpg',
  }
];

export async function getHomepageBanners(): Promise<HomepageBanner[]> {
  try {
    const { data, error } = await supabase
      .from('homepage_banner')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      if (error.message.includes('column') || error.code === '42703') {
        throw new Error("Database column mismatch: The columns in 'homepage_banner' do not match expected schema.");
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return DEFAULT_BANNERS;
    }

    return data.map(banner => ({
      id: banner.id,
      smallHeading: banner.top_label || 'ZHa Aesthetic Salon',
      mainHeading: banner.title || 'Transform Your Style',
      subtitle: banner.subtitle || 'Luxury Beauty Experience',
      description: banner.description || 'Where premium style meets expert care.',
      primaryBtn: banner.primary_button || 'Book Appointment',
      secondaryBtn: banner.secondary_button || 'Explore Services',
      imageUrl: banner.image_url || DEFAULT_BANNERS[0].imageUrl
    }));
  } catch (err: any) {
    console.error('Failed to get homepage banners:', err);
    return DEFAULT_BANNERS;
  }
}

export async function getHomepageBanner(): Promise<HomepageBanner> {
  const banners = await getHomepageBanners();
  return banners[0] || DEFAULT_BANNERS[0];
}

export async function addHomepageBanner(banner: HomepageBanner): Promise<HomepageBanner> {
  let finalImageUrl = banner.imageUrl;
  if (banner.imageUrl && banner.imageUrl.startsWith('data:')) {
    finalImageUrl = await uploadHeroAsset(banner.imageUrl);
  }

  const payload = {
    top_label: banner.smallHeading,
    title: banner.mainHeading,
    subtitle: banner.subtitle || banner.description,
    description: banner.description,
    primary_button: banner.primaryBtn,
    secondary_button: banner.secondaryBtn,
    image_url: finalImageUrl
  };

  const { data, error } = await supabase
    .from('homepage_banner')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create new banner: ${error.message}`);
  }

  return {
    id: data.id,
    smallHeading: data.top_label,
    mainHeading: data.title,
    subtitle: data.subtitle || '',
    description: data.description,
    primaryBtn: data.primary_button,
    secondaryBtn: data.secondary_button,
    imageUrl: data.image_url
  };
}

export async function updateHomepageBanner(banner: Partial<HomepageBanner> & { id?: string }): Promise<HomepageBanner> {
  let finalImageUrl = banner.imageUrl;
  if (banner.imageUrl && banner.imageUrl.startsWith('data:')) {
    finalImageUrl = await uploadHeroAsset(banner.imageUrl);
  }

  const payload = {
    top_label: banner.smallHeading,
    title: banner.mainHeading,
    subtitle: banner.subtitle || banner.description,
    description: banner.description,
    primary_button: banner.primaryBtn,
    secondary_button: banner.secondaryBtn,
    image_url: finalImageUrl
  };

  if (banner.id) {
    const { data, error } = await supabase
      .from('homepage_banner')
      .update(payload)
      .eq('id', banner.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      smallHeading: data.top_label,
      mainHeading: data.title,
      subtitle: data.subtitle || '',
      description: data.description,
      primaryBtn: data.primary_button,
      secondaryBtn: data.secondary_button,
      imageUrl: data.image_url
    };
  } else {
    // If no ID provided, update first row or insert
    const { data: existingData } = await supabase
      .from('homepage_banner')
      .select('id')
      .order('id', { ascending: true })
      .limit(1);

    if (existingData && existingData.length > 0) {
      const { data, error } = await supabase
        .from('homepage_banner')
        .update(payload)
        .eq('id', existingData[0].id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        smallHeading: data.top_label,
        mainHeading: data.title,
        subtitle: data.subtitle || '',
        description: data.description,
        primaryBtn: data.primary_button,
        secondaryBtn: data.secondary_button,
        imageUrl: data.image_url
      };
    } else {
      return addHomepageBanner(banner as HomepageBanner);
    }
  }
}

export async function deleteHomepageBanner(id: string): Promise<void> {
  const { error } = await supabase
    .from('homepage_banner')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete banner: ${error.message}`);
  }
}
