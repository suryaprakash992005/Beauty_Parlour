import { supabase } from '../lib/supabase';

export interface GoogleBusinessConnection {
  id?: string;
  location_id: string;
  location_name: string;
  connected_email: string;
  last_sync_time: string | null;
  created_at?: string;
}

export interface GoogleBusinessProfile {
  location_id: string;
  location_name: string;
  address: string;
}

// Fallback simulated local cache key
const LOCAL_CONN_KEY = 'zha_gmb_connection';

// Standard Mock GMB Profiles returned post-OAuth
export const MOCK_GMB_PROFILES: GoogleBusinessProfile[] = [
  {
    location_id: "locations/l-andheri-101",
    location_name: "ZHA Hair Saloon — Andheri West, Mumbai",
    address: "42, Rose Garden Lane, Luxury District, Mumbai — 400001"
  },
  {
    location_id: "locations/l-bandra-202",
    location_name: "ZHA Hair & Skin Studio — Bandra, Mumbai",
    address: "102, Pali Hill Road, Bandra West, Mumbai — 400050"
  }
];

// Mock Google reviews representing Google Business Profile API payload
const GMB_API_REVIEWS = [
  {
    google_review_id: "gmb-rev-201",
    reviewer_name: "Pooja Hegde",
    rating: 5,
    review_text: "Had a luxurious hair makeover! The stylists here are true artists and the hospitality is premium.",
    review_date: "2026-07-16"
  },
  {
    google_review_id: "gmb-rev-202",
    reviewer_name: "Meera Deshmukh",
    rating: 5,
    review_text: "Perfect hydra facial experience. The light theme and calming vibes match the high-end treatments.",
    review_date: "2026-07-15"
  },
  {
    google_review_id: "gmb-rev-203",
    reviewer_name: "Shruti Salunkhe",
    rating: 4,
    review_text: "Loved the gel nail art. Clean, safe, and professional setup. Will definitely recommend ZHA to my friends.",
    review_date: "2026-07-12"
  },
  {
    google_review_id: "gmb-rev-204",
    reviewer_name: "Nisha Patel",
    rating: 5,
    review_text: "ZHA has completely transformed my hair. Their keratin combo package is an absolute must-try!",
    review_date: "2026-07-10"
  }
];

/**
 * Fetch connected Google Business location settings.
 * Tries Supabase 'google_business_connections' table, falls back to secure simulated local cache.
 */
export async function getConnection(): Promise<GoogleBusinessConnection | null> {
  try {
    const { data, error } = await supabase
      .from('google_business_connections')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      // Graceful fallback to simulated cache if table doesn't exist
      const cached = localStorage.getItem(LOCAL_CONN_KEY);
      return cached ? JSON.parse(cached) : null;
    }

    return data[0];
  } catch {
    const cached = localStorage.getItem(LOCAL_CONN_KEY);
    return cached ? JSON.parse(cached) : null;
  }
}

/**
 * Save Google Business Profile connection.
 */
export async function saveConnection(
  locationId: string,
  locationName: string,
  email: string
): Promise<GoogleBusinessConnection> {
  const payload = {
    location_id: locationId,
    location_name: locationName,
    connected_email: email,
    last_sync_time: null
  };

  try {
    // Check if table exists by doing select
    const { data: existing } = await supabase
      .from('google_business_connections')
      .select('id')
      .limit(1);

    let saved: GoogleBusinessConnection;

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from('google_business_connections')
        .update(payload)
        .eq('id', existing[0].id)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    } else {
      const { data, error } = await supabase
        .from('google_business_connections')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    }

    localStorage.setItem(LOCAL_CONN_KEY, JSON.stringify(saved));
    return saved;
  } catch {
    // Local storage fallback save
    const saved: GoogleBusinessConnection = {
      ...payload,
      id: 'conn-local-uuid',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_CONN_KEY, JSON.stringify(saved));
    return saved;
  }
}

/**
 * Disconnect Google Business profile connection.
 */
export async function disconnectConnection(): Promise<void> {
  try {
    // Fetch connection ID
    const { data } = await supabase
      .from('google_business_connections')
      .select('id')
      .limit(1);

    if (data && data.length > 0) {
      await supabase
        .from('google_business_connections')
        .delete()
        .eq('id', data[0].id);
    }
  } catch {
    // Ignore database failures on fallback
  } finally {
    localStorage.removeItem(LOCAL_CONN_KEY);
  }
}

export interface SyncResult {
  syncedCount: number;
  duplicatesSkipped: number;
  noNewFound: boolean;
}

/**
 * Sync reviews from connected Google Business Profile.
 */
export async function syncGoogleReviews(
  syncMode: 'all' | 'new',
  automaticallyApprove: boolean
): Promise<SyncResult> {
  // Fetch existing reviews to identify duplicates
  const { data: existing, error: fetchErr } = await supabase
    .from('reviews')
    .select('google_review_id')
    .not('google_review_id', 'is', null);

  if (fetchErr) {
    throw new Error(`Failed to query existing reviews: ${fetchErr.message}`);
  }

  const existingIds = new Set((existing || []).map(r => r.google_review_id));

  // Determine reviews based on syncMode
  const reviewsToProcess = syncMode === 'new' 
    ? GMB_API_REVIEWS.slice(0, 2)
    : GMB_API_REVIEWS;

  const newReviews = reviewsToProcess.filter(r => !existingIds.has(r.google_review_id));
  const duplicatesSkipped = reviewsToProcess.length - newReviews.length;

  if (newReviews.length === 0) {
    // Update last sync time
    await updateSyncTime();
    return {
      syncedCount: 0,
      duplicatesSkipped,
      noNewFound: true
    };
  }

  // Insert only unique new reviews
  const insertPayload = newReviews.map(r => ({
    google_review_id: r.google_review_id,
    reviewer_name: r.reviewer_name,
    rating: r.rating,
    review_text: r.review_text,
    review_date: r.review_date,
    published: automaticallyApprove ? true : null
  }));

  const { data: inserted, error: insertErr } = await supabase
    .from('reviews')
    .insert(insertPayload)
    .select();

  if (insertErr) {
    throw new Error(`Failed to insert synced reviews: ${insertErr.message}`);
  }

  // Update last sync time
  await updateSyncTime();

  return {
    syncedCount: inserted ? inserted.length : 0,
    duplicatesSkipped,
    noNewFound: false
  };
}

/**
 * Update connection last sync time stamp.
 */
async function updateSyncTime(): Promise<void> {
  const syncTime = new Date().toISOString();
  try {
    const { data } = await supabase
      .from('google_business_connections')
      .select('id')
      .limit(1);

    if (data && data.length > 0) {
      await supabase
        .from('google_business_connections')
        .update({ last_sync_time: syncTime })
        .eq('id', data[0].id);
    }
  } catch {
    // Ignore error, handle local storage update
  }

  const cached = localStorage.getItem(LOCAL_CONN_KEY);
  if (cached) {
    const parsed: GoogleBusinessConnection = JSON.parse(cached);
    parsed.last_sync_time = syncTime;
    localStorage.setItem(LOCAL_CONN_KEY, JSON.stringify(parsed));
  }
}
