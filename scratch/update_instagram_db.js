import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Fetching settings...');
  const { data: settingsList, error: fetchErr } = await supabase.from('settings').select('*');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }
  
  if (settingsList && settingsList.length > 0) {
    const rowId = settingsList[0].id;
    console.log('Updating settings row ID:', rowId);
    const { data, error } = await supabase
      .from('settings')
      .update({ instagram: 'https://www.instagram.com/zha_aesthetic_salon/' })
      .eq('id', rowId)
      .select();
    
    if (error) {
      console.error('Update error:', error);
    } else {
      console.log('Success! Updated settings row:', data);
    }
  } else {
    console.log('No settings row found to update.');
  }
}

run();
