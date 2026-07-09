import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are missing. Check your local .env configuration.'
  );
}

// Check configuration status
export const isSupabaseConfigured = 
  supabaseUrl !== '' && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== '' && 
  !supabaseAnonKey.startsWith('placeholder');

// Initialize client
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

/**
 * Verify database connection health by executing a lightweight SELECT query.
 */
export async function verifyConnection() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return { connected: true, data };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || String(err)
    };
  }
}
