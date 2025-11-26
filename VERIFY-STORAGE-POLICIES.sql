-- ===================================
-- VERIFY STORAGE POLICIES
-- ===================================
-- Execute this to check if your storage is properly configured

-- 1. Check if 'images' bucket exists
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'images';

-- Expected result:
-- id: images
-- public: true
-- file_size_limit: 5242880 (5MB) or null
-- allowed_mime_types: {image/*} or null

-- 2. Check existing policies on storage.objects
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- 3. Test if you can read from images bucket (should return empty array or files)
SELECT * FROM storage.objects WHERE bucket_id = 'images' LIMIT 5;

-- ===================================
-- MINIMAL FIX (if policies are missing)
-- ===================================
-- Only run these if the policies don't exist or are incorrect

-- If you see an error "policy already exists", it means they're already there
-- In that case, your storage should work!

-- If policies are missing, uncomment and run these:

/*
CREATE POLICY IF NOT EXISTS "images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "images_public_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "images_public_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "images_public_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
*/

-- ===================================
-- NOTES
-- ===================================
-- If you see "policy already exists" error, that's GOOD!
-- It means your storage policies are already configured.
-- 
-- Just make sure:
-- 1. The bucket 'images' exists and is PUBLIC
-- 2. You can see policies in the query results above
-- 3. Try uploading an image from the app
