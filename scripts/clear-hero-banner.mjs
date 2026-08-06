// Script: Clear image_url in DB + add slide_urls column if missing
// Run: node scripts/clear-hero-banner.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rkbxikbzjemccuppiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nxF6MOokvcq-UVSppvii5A_xRMVa8yY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🗑️  Clearing all hero banner images...\n');

  // ── 1. List ALL files in the hero storage bucket ─────────────────────────
  const { data: files, error: listErr } = await supabase.storage
    .from('hero')
    .list('', { limit: 1000 });

  if (listErr) {
    console.error('❌ Failed to list hero bucket files:', listErr.message);
    process.exit(1);
  }

  if (!files || files.length === 0) {
    console.log('ℹ️  Hero storage bucket is already empty.');
  } else {
    const paths = files.map(f => f.name);
    console.log(`Found ${paths.length} file(s):\n  `, paths.join('\n  '));

    const { error: delErr } = await supabase.storage.from('hero').remove(paths);

    if (delErr) {
      console.error('❌ Failed to delete files:', delErr.message);
      process.exit(1);
    }
    console.log(`\n✅ Deleted ${paths.length} file(s) from storage.\n`);
  }

  // ── 2. Clear image_url only (slide_urls column may not exist yet) ─────────
  const { data: existing } = await supabase
    .from('homepage_banner')
    .select('id')
    .order('id', { ascending: true })
    .limit(1);

  if (existing && existing.length > 0) {
    const { error: updErr } = await supabase
      .from('homepage_banner')
      .update({ image_url: null })
      .eq('id', existing[0].id);

    if (updErr) {
      console.error('❌ Failed to clear DB banner image_url:', updErr.message);
    } else {
      console.log('✅ Cleared image_url in homepage_banner table.\n');
    }
  } else {
    console.log('ℹ️  No homepage_banner row found in DB — nothing to clear.\n');
  }

  console.log('🎉 Done! You can now add fresh images from the Admin → Banner panel.');
  console.log('\n⚠️  REMINDER: Run this SQL in Supabase SQL Editor if not already done:');
  console.log('   ALTER TABLE homepage_banner ADD COLUMN IF NOT EXISTS slide_urls TEXT;');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
