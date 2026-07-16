import { supabase } from '../lib/supabase';
import type { ServiceItem } from './services';

/**
 * Fetch all active services from Supabase
 */
export async function getServices(): Promise<ServiceItem[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
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

/**
 * Fetch distinct active categories from the database
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('services')
    .select('category');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  if (!data) return [];

  // Get unique non-null categories
  const categories = data
    .map(item => item.category?.trim())
    .filter(Boolean);

  return Array.from(new Set(categories));
}

/**
 * Fetch services matching a specific category
 */
export async function getServicesByCategory(category: string): Promise<ServiceItem[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch services by category: ${error.message}`);
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
