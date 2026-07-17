import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUploads() {
  const content = new Blob(['test logo'], { type: 'text/plain' });

  console.log("Attempting upload to 'logo' bucket...");
  const { data: dataLogo, error: errLogo } = await supabase.storage
    .from('logo')
    .upload('test_upload.txt', content, { upsert: true });
  console.log("logo result:", dataLogo, errLogo ? errLogo.message : "Success!");

  console.log("Attempting upload to 'branding' bucket...");
  const { data: dataBranding, error: errBranding } = await supabase.storage
    .from('branding')
    .upload('test_upload.txt', content, { upsert: true });
  console.log("branding result:", dataBranding, errBranding ? errBranding.message : "Success!");
}

testUploads();
