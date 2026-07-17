import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
  console.log("Listing storage buckets...");
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Failed to list buckets:", error.message);
  } else {
    console.log("Storage buckets:", data.map(b => ({ name: b.name, public: b.public })));
  }
}

checkBuckets();
