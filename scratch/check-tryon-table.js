import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking if virtual_try_ons table exists...");
  const { data, error } = await supabase.from('virtual_try_ons').select('*').limit(1);
  if (error) {
    console.error("virtual_try_ons check error:", error.message);
  } else {
    console.log("virtual_try_ons table exists!", data);
  }
}

check();
