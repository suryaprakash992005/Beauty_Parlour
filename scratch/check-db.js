import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking settings table structure...");
  const { data: settings, error: sErr } = await supabase.from('settings').select('*').limit(1);
  if (sErr) {
    console.error("settings table error:", sErr);
  } else {
    console.log("settings row columns:", settings && settings[0] ? Object.keys(settings[0]) : "No settings row found");
    console.log("Full settings row:", settings);
  }
}

check();
