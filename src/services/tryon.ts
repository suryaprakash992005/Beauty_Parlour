import { supabase } from '../lib/supabase';

export interface TryOnRecord {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  uploaded_image_url: string;
  generated_preview_url: string;
  selected_transformation_id: string;
  selected_transformation_name: string;
  booking_status: string; // e.g. 'Pending Review', 'Confirmed', 'Completed'
  appointment_date: string;
  appointment_time: string;
  created_at?: string;
}

export interface TransformationLook {
  id: string;
  name: string;
  desc: string;
  duration: string;
  price: string;
  stylist: string;
  colorRecommendation?: string;
  makeupPackage?: string;
  previewUrl: string;
  category: 'hair' | 'makeup' | 'skin';
}

export const TRANSFORMATION_LOOKS: TransformationLook[] = [
  {
    id: 'haircut',
    name: 'Precision Silhouette Cut',
    desc: 'A tailored, structural haircut designed to enhance your facial symmetry and natural hair flow.',
    duration: '45 Mins',
    price: '₹1,800',
    stylist: 'Farah Khan (Master Hair Architect)',
    previewUrl: 'https://images.unsplash.com/photo-1595959183075-c1d09e519826?w=600&q=80',
    category: 'hair'
  },
  {
    id: 'haircolor',
    name: 'Signature Balayage & Melt',
    desc: 'Custom hand-painted caramel highlights blended seamlessly with a luxury moisture gloss finish.',
    duration: '150 Mins',
    price: '₹4,500',
    stylist: 'Rohan Malhotra (Color Director)',
    colorRecommendation: 'Caramel Balayage / Hazelnut Bronze',
    previewUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80',
    category: 'hair'
  },
  {
    id: 'bridal',
    name: 'Royal HD Bridal Makeover',
    desc: 'High-definition airbrush makeup, premium contouring, and traditional hair styling.',
    duration: '180 Mins',
    price: '₹15,000',
    stylist: 'Zareen Taj (Senior Makeup Artist)',
    makeupPackage: 'Imperial HD Airbrush Pack',
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'reception',
    name: 'Dewy Reception Makeover',
    desc: 'Soft smokey eyes, high-gloss dewy skin, and elegant volumised styling.',
    duration: '120 Mins',
    price: '₹8,000',
    stylist: 'Zareen Taj (Senior Makeup Artist)',
    makeupPackage: 'Celebration Dewy Glow Pack',
    previewUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'party',
    name: 'Classic Cocktails Glam',
    desc: 'Ultra-glam makeup with defined winged eyes, bold red lips, and retro Hollywood waves.',
    duration: '90 Mins',
    price: '₹4,000',
    stylist: 'Pooja Roy (Glam Stylist)',
    makeupPackage: 'Glamorous Evening Pack',
    previewUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'natural',
    name: 'Glass-Skin Natural Glow',
    desc: 'Lightweight, breathable skin prep and micro-concealing for an effortless, fresh look.',
    duration: '60 Mins',
    price: '₹2,500',
    stylist: 'Pooja Roy (Glam Stylist)',
    makeupPackage: 'Organic Clean Skin Pack',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'korean',
    name: 'Korean Dewy Glass-Skin',
    desc: 'Ultralight cushion skin, straight brows, puppy eyeliner, and soft gradient lips.',
    duration: '75 Mins',
    price: '₹3,500',
    stylist: 'Min-Ji Kim (International Consultant)',
    makeupPackage: 'Seoul Glass Radiance Pack',
    previewUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'hd',
    name: 'HD Editorial Look',
    desc: 'Flawless airbrushed finish optimized for high-end studio photography and events.',
    duration: '90 Mins',
    price: '₹6,000',
    stylist: 'Zareen Taj (Senior Makeup Artist)',
    makeupPackage: 'Studio Editorial HD Pack',
    previewUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
    category: 'makeup'
  },
  {
    id: 'facial',
    name: 'Hydra-Glow Elixir Facial',
    desc: 'Deep exfoliation, lymphatic facial drainage, and specialized hydration serum infusion.',
    duration: '60 Mins',
    price: '₹3,000',
    stylist: 'Anjali Rao (Skin Therapist)',
    previewUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    category: 'skin'
  },
  {
    id: 'eyebrow',
    name: 'Precision Brow Sculpt',
    desc: 'Architectural brow mapping, organic brow tinting, and micro-shaping.',
    duration: '30 Mins',
    price: '₹800',
    stylist: 'Anjali Rao (Skin Therapist)',
    previewUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    category: 'skin'
  },
  {
    id: 'hairspa',
    name: 'Caviar Nourishing Hair Spa',
    desc: 'Intense micro-mist steam therapy, amino acid repair, and professional blow-dry glossing.',
    duration: '75 Mins',
    price: '₹2,200',
    stylist: 'Farah Khan (Master Hair Architect)',
    previewUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    category: 'hair'
  }
];

const LOCAL_STORAGE_KEY = 'zha_virtual_try_ons';

/**
 * Client-side image brightness and resolution analysis.
 * Performs a canvas-based pixel calculation to verify proper lighting.
 */
export async function analyzeUploadedImage(base64Str: string): Promise<{
  success: boolean;
  error?: string;
  faceShape?: string;
  skinTone?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ success: true, faceShape: 'Oval', skinTone: 'Warm Sand' });
        return;
      }
      
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      
      const imgData = ctx.getImageData(0, 0, 100, 100);
      const data = imgData.data;
      
      let rSum = 0, gSum = 0, bSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
        gSum += data[i+1];
        bSum += data[i+2];
      }
      
      const pixelCount = data.length / 4;
      const avgBrightness = (rSum + gSum + bSum) / (pixelCount * 3);
      
      // Face detection simulation (check if image looks like a portrait, i.e. has skin tones or standard color distribution)
      // Throw error if image is extremely dark
      if (avgBrightness < 35) {
        resolve({ success: false, error: 'Image too dark. Please take a photo in a brighter, well-lit environment.' });
        return;
      }
      
      // Check if image is blurry (simplified check on contrast difference)
      let diff = 0;
      for (let i = 4; i < data.length; i += 4) {
        diff += Math.abs(data[i] - data[i-4]);
      }
      const avgContrast = diff / pixelCount;
      if (avgContrast < 5) {
        resolve({ success: false, error: 'Image appears blurry. Please upload a high-resolution, clear portrait.' });
        return;
      }

      // Simulate face shape and skin tones
      const shapes = ['Oval', 'Round', 'Heart', 'Square', 'Diamond'];
      const faceShape = shapes[Math.floor((rSum + gSum) % shapes.length)];
      
      let skinTone = 'Olive Bronze';
      if (rSum > gSum * 1.1) {
        skinTone = 'Warm Sand';
      } else if (rSum > gSum && rSum > bSum) {
        skinTone = 'Deep Caramel';
      } else if (bSum > gSum) {
        skinTone = 'Alabaster Ivory';
      } else {
        skinTone = 'Natural Honey';
      }

      resolve({
        success: true,
        faceShape,
        skinTone
      });
    };
    img.onerror = () => {
      resolve({ success: false, error: 'Invalid file format. Please upload a clear JPG, JPEG, or PNG photo.' });
    };
  });
}

/**
 * Fetch all Try-On bookings.
 * Tries Supabase 'virtual_try_ons', falls back to localStorage cache.
 */
export async function getTryOns(): Promise<TryOnRecord[]> {
  try {
    const { data, error } = await supabase
      .from('virtual_try_ons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }

    return data;
  } catch {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  }
}

/**
 * Save Virtual Try-On booking record.
 */
export async function saveTryOn(record: Omit<TryOnRecord, 'created_at'>): Promise<TryOnRecord> {
  const payload = {
    ...record,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('virtual_try_ons')
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw error;
    
    // Save to local storage cache alongside Supabase
    saveToLocalStorageCache(data);
    return data;
  } catch {
    const savedRecord: TryOnRecord = {
      ...payload,
      id: `tryon-${Date.now()}`
    };
    saveToLocalStorageCache(savedRecord);
    return savedRecord;
  }
}

function saveToLocalStorageCache(record: TryOnRecord) {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  const list: TryOnRecord[] = localData ? JSON.parse(localData) : [];
  list.unshift(record);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Update Try-On booking status (for Admin moderation).
 */
export async function updateTryOnStatus(id: string, status: string): Promise<void> {
  try {
    await supabase
      .from('virtual_try_ons')
      .update({ booking_status: status })
      .eq('id', id);
  } catch {
    // Ignore error, handle local storage update
  }

  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localData) {
    const list: TryOnRecord[] = JSON.parse(localData);
    const updated = list.map(r => r.id === id ? { ...r, booking_status: status } : r);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}
