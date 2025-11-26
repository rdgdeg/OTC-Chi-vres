-- ===================================
-- FIX STORAGE POLICIES FOR TEAM IMAGES
-- ===================================
-- Execute this in Supabase SQL Editor to ensure proper storage access

-- First, ensure the 'images' bucket exists
-- (This must be done in Supabase Dashboard > Storage if not already created)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access to images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Allow public read access to all images
CREATE POLICY "Public Access to images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow anyone to upload images (for development - tighten for production)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to update images (for development - tighten for production)
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Allow anyone to delete images (for development - tighten for production)
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- ===================================
-- VERIFICATION QUERIES
-- ===================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- ===================================
-- NOTES
-- ===================================
-- 1. Make sure the 'images' bucket is created in Supabase Dashboard > Storage
-- 2. Set the bucket as PUBLIC in the dashboard
-- 3. For production, replace "Anyone can" policies with proper authentication checks
-- 4. Example production policy:
--    CREATE POLICY "Authenticated users can upload"
--    ON storage.objects FOR INSERT
--    WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
