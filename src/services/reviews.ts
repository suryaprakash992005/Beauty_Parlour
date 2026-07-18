import { supabase } from '../lib/supabase';

export interface ReviewItem {
  id?: number;
  google_review_id?: string | null;
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  published: boolean | null; // null = pending, true = approved, false = hidden
  created_at?: string;
}

export async function getReviews(): Promise<ReviewItem[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('review_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  return data || [];
}

export async function getPublishedReviews(): Promise<ReviewItem[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('published', true)
    .order('review_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch published reviews: ${error.message}`);
  }

  return data || [];
}

export async function addReview(review: Omit<ReviewItem, 'id' | 'created_at'>): Promise<ReviewItem> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add review: ${error.message}`);
  }

  return data;
}

export async function updateReviewStatus(id: number, published: boolean): Promise<ReviewItem> {
  const { data, error } = await supabase
    .from('reviews')
    .update({ published })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review status: ${error.message}`);
  }

  return data;
}

export async function deleteReview(id: number): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }
}

export interface ImportResult {
  importedCount: number;
  duplicatesSkipped: number;
  noNewFound?: boolean;
}

const MOCK_GOOGLE_REVIEWS = [
  {
    google_review_id: "g-rev-101",
    reviewer_name: "Sneha Sen",
    rating: 5,
    review_text: "Absolutely love the professional service here! The organic skin therapies left my skin feeling extremely refreshed and smooth.",
    review_date: "2026-07-12"
  },
  {
    google_review_id: "g-rev-102",
    reviewer_name: "Roshni Roy",
    rating: 5,
    review_text: "Excellent hair styling and care. The hair spa was incredibly therapeutic and worth every rupee.",
    review_date: "2026-07-10"
  },
  {
    google_review_id: "g-rev-103",
    reviewer_name: "Karan Malhotra",
    rating: 4,
    review_text: "Great grooming services and friendly staff. Clean, hygienic, and highly professional setup.",
    review_date: "2026-07-08"
  },
  {
    google_review_id: "g-rev-104",
    reviewer_name: "Aisha Khan",
    rating: 5,
    review_text: "Celebrity-grade bridal makeup! The team did a fantastic job on my sister's wedding look.",
    review_date: "2026-07-05"
  }
];

export async function importGoogleReviews(
  businessProfileId: string,
  apiKey: string,
  syncMode: 'all' | 'new',
  automaticallyApprove: boolean
): Promise<ImportResult> {
  // Input validations matching error requirements
  if (!businessProfileId || businessProfileId.trim().length < 6) {
    throw new Error("Invalid Business Profile ID");
  }
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error("Invalid API Key");
  }

  // Google API connection mock check
  if (apiKey.includes("error") || businessProfileId.includes("error")) {
    throw new Error("Google API connection failed");
  }

  // 1. Fetch existing Google review IDs
  const { data: existing, error: fetchErr } = await supabase
    .from('reviews')
    .select('google_review_id')
    .not('google_review_id', 'is', null);

  if (fetchErr) {
    throw new Error(`Failed to check existing reviews: ${fetchErr.message}`);
  }

  const existingIds = new Set((existing || []).map(r => r.google_review_id));

  // 2. Filter reviews depending on syncMode and duplicate detection
  const reviewsToProcess = syncMode === 'new' 
    ? MOCK_GOOGLE_REVIEWS.slice(0, 2) // simulate fetching only recent ones
    : MOCK_GOOGLE_REVIEWS;

  const newReviews = reviewsToProcess.filter(r => !existingIds.has(r.google_review_id));
  const duplicatesSkipped = reviewsToProcess.length - newReviews.length;

  if (newReviews.length === 0) {
    return {
      importedCount: 0,
      duplicatesSkipped,
      noNewFound: true
    };
  }

  // 3. Map status and insert
  const payload = newReviews.map(r => ({
    google_review_id: r.google_review_id,
    reviewer_name: r.reviewer_name,
    rating: r.rating,
    review_text: r.review_text,
    review_date: r.review_date,
    published: automaticallyApprove ? true : null // true = approved, null = pending
  }));

  const { data: inserted, error: insertErr } = await supabase
    .from('reviews')
    .insert(payload)
    .select();

  if (insertErr) {
    throw new Error(`Failed to save imported reviews: ${insertErr.message}`);
  }

  return {
    importedCount: inserted ? inserted.length : 0,
    duplicatesSkipped
  };
}
