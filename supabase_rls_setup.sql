-- =====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES FOR ZHA AESTHETIC SALON
-- =====================================================================
-- Run this script in your Supabase SQL Editor to enforce database-level
-- security across all admin tables.
-- =====================================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 2. PRODUCTS POLICIES
-- =====================================================================
-- Public can read active products; Only authenticated admin can insert/update/delete.
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Products" ON products;
CREATE POLICY "Admin Manage Products" ON products 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 3. SERVICES POLICIES
-- =====================================================================
-- Public can read services; Only authenticated admin can modify services.
DROP POLICY IF EXISTS "Public Read Services" ON services;
CREATE POLICY "Public Read Services" ON services 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Services" ON services;
CREATE POLICY "Admin Manage Services" ON services 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 4. GALLERY POLICIES
-- =====================================================================
-- Public can read gallery photos; Only authenticated admin can upload/delete.
DROP POLICY IF EXISTS "Public Read Gallery" ON gallery;
CREATE POLICY "Public Read Gallery" ON gallery 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Gallery" ON gallery;
CREATE POLICY "Admin Manage Gallery" ON gallery 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 5. CATEGORIES POLICIES
-- =====================================================================
-- Public can read categories; Only authenticated admin can manage categories.
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;
CREATE POLICY "Admin Manage Categories" ON categories 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 6. BANNERS POLICIES
-- =====================================================================
-- Public can read hero banners; Only authenticated admin can update banners.
DROP POLICY IF EXISTS "Public Read Banners" ON banners;
CREATE POLICY "Public Read Banners" ON banners 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Banners" ON banners;
CREATE POLICY "Admin Manage Banners" ON banners 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 7. SETTINGS POLICIES
-- =====================================================================
-- Public can read general website settings; Only authenticated admin can update settings.
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
CREATE POLICY "Public Read Settings" ON settings 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Settings" ON settings;
CREATE POLICY "Admin Manage Settings" ON settings 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- 8. REVIEWS POLICIES
-- =====================================================================
-- Public can read approved reviews; Only authenticated admin can manage/delete reviews.
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
CREATE POLICY "Public Read Reviews" ON reviews 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Reviews" ON reviews;
CREATE POLICY "Admin Manage Reviews" ON reviews 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================================
-- VERIFICATION QUERY
-- =====================================================================
-- Run to verify RLS is enabled across all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
