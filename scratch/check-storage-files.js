import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  console.log("Checking logo bucket...");
  const { data: logoData, error: logoErr } = await supabase.storage.from('logo').list();
  if (logoErr) {
    console.error("logo bucket error:", logoErr.message);
  } else {
    console.log("logo bucket listing success! files:", logoData);
  }

  console.log("Checking branding bucket...");
  const { data: brandingData, error: brandingErr } = await supabase.storage.from('branding').list();
  if (brandingErr) {
    console.error("branding bucket error:", brandingErr.message);
  } else {
    console.log("branding bucket listing success! files:", brandingData);
  }
}

checkStorage();
