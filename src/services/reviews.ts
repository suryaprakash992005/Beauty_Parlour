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
