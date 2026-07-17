import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
  const { data: logo, error: logoErr } = await supabase.storage.getBucket('logo');
  console.log("logo bucket:", logo, logoErr ? logoErr.message : "OK");

  const { data: branding, error: brandingErr } = await supabase.storage.getBucket('branding');
  console.log("branding bucket:", branding, brandingErr ? brandingErr.message : "OK");
}

checkBuckets();
