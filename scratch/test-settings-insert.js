import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log("Inserting test row into settings table...");
  const payload = {
    salon_name: "ZHA Test Salon",
    logo_url: "https://example.com/logo.png",
    phone: "1234567890",
    email: "test@zhasalon.com",
    address: "Test Address, Mumbai",
    working_hours: "Mon–Fri: 9AM–8PM | Sat–Sun: 10AM–6PM",
    whatsapp: "1234567890",
    instagram: "zha_insta",
    facebook: "zha_fb",
    youtube: "zha_yt",
    google_maps: "https://maps.google.com"
  };

  const { data, error } = await supabase.from('settings').insert(payload).select();
  if (error) {
    console.error("Insert failed:", error);
  } else {
    console.log("Insert success!", data);
  }
}

testInsert();
