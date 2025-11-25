-- ===================================
-- FIX STORAGE POLICIES - VisitChièvres.be
-- ===================================
-- Ce script configure le bucket Storage et ses politiques
-- À exécuter dans Supabase SQL Editor

-- ===================================
-- 1. CRÉER LE BUCKET (si n'existe pas)
-- ===================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- ===================================
-- 2. SUPPRIMER LES ANCIENNES POLITIQUES
-- ===================================

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- ===================================
-- 3. CRÉER LES NOUVELLES POLITIQUES
-- ===================================

-- Politique 1 : Lecture publique (SELECT)
CREATE POLICY "images_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Politique 2 : Upload public (INSERT)
-- ⚠️ Permissif pour dev - À sécuriser en production
CREATE POLICY "images_public_insert"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- Politique 3 : Update public (UPDATE)
-- ⚠️ Permissif pour dev - À sécuriser en production
CREATE POLICY "images_public_update"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Politique 4 : Delete public (DELETE)
-- ⚠️ Permissif pour dev - À sécuriser en production
CREATE POLICY "images_public_delete"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'images');

-- ===================================
-- 4. VÉRIFICATION
-- ===================================

-- Vérifier le bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'images';

-- Vérifier les politiques
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'images_%';

-- ===================================
-- 5. TESTER L'UPLOAD
-- ===================================

-- Après avoir exécuté ce script, testez :
-- 1. Aller dans Admin > Musées
-- 2. Éditer un musée
-- 3. Section "Galerie d'images"
-- 4. Cliquer "Ajouter" et uploader une image
-- 5. Vérifier qu'il n'y a pas d'erreur dans la console (F12)

-- ===================================
-- 6. STRUCTURE DES DOSSIERS
-- ===================================

-- Les images seront organisées ainsi :
-- images/
-- ├── museums/
-- │   ├── 1732547890-x7k9m2.jpg
-- │   └── ...
-- ├── restaurants/
-- │   └── ...
-- ├── accommodation/
-- │   └── ...
-- └── merchants/
--     └── ...

-- ===================================
-- 7. ALTERNATIVE : INTERFACE SUPABASE
-- ===================================

/*
Si ce script ne fonctionne pas, créez les politiques manuellement :

1. Aller sur https://supabase.com
2. Votre projet > Storage > images
3. Onglet "Policies"
4. Cliquer "New Policy"

POLITIQUE 1 - Lecture publique :
- Policy name: images_public_read
- Allowed operation: SELECT
- Target roles: public
- USING expression: bucket_id = 'images'

POLITIQUE 2 - Upload public :
- Policy name: images_public_insert
- Allowed operation: INSERT
- Target roles: public
- WITH CHECK expression: bucket_id = 'images'

POLITIQUE 3 - Update public :
- Policy name: images_public_update
- Allowed operation: UPDATE
- Target roles: public
- USING expression: bucket_id = 'images'
- WITH CHECK expression: bucket_id = 'images'

POLITIQUE 4 - Delete public :
- Policy name: images_public_delete
- Allowed operation: DELETE
- Target roles: public
- USING expression: bucket_id = 'images'
*/

-- ===================================
-- 8. SÉCURITÉ PRODUCTION
-- ===================================

/*
⚠️ IMPORTANT : Ces politiques sont TRÈS permissives !

Pour la production, remplacez par des politiques sécurisées :

-- Lecture publique (OK)
CREATE POLICY "images_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Upload authentifié uniquement
CREATE POLICY "images_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- Update/Delete pour admins uniquement
CREATE POLICY "images_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM admin_users)
)
WITH CHECK (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "images_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM admin_users)
);
*/

-- ===================================
-- 9. DÉPANNAGE
-- ===================================

/*
SI L'UPLOAD NE FONCTIONNE TOUJOURS PAS :

1. Vérifier la console navigateur (F12)
   - Chercher les erreurs en rouge
   - Noter le message d'erreur exact

2. Vérifier les variables d'environnement
   - .env.local doit contenir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
   - Redémarrer le serveur après modification

3. Vérifier le bucket
   - Supabase > Storage > Vérifier que "images" existe
   - Vérifier que "public" est coché

4. Tester l'upload manuellement
   - Supabase > Storage > images
   - Cliquer "Upload file"
   - Si ça ne marche pas ici non plus, c'est un problème de bucket

5. Vérifier les CORS
   - Supabase > Settings > API
   - Vérifier que votre domaine est autorisé

6. Consulter les logs
   - Supabase > Logs > API Logs
   - Chercher les erreurs liées à storage.objects
*/

-- ===================================
-- FIN DU SCRIPT
-- ===================================

-- Après avoir exécuté ce script :
-- 1. Rafraîchir votre application (Ctrl + Shift + R)
-- 2. Tester l'upload d'images
-- 3. Vérifier dans Supabase > Storage > images que les fichiers apparaissent
-- 4. Consulter GUIDE-GALERIE-IMAGES.md pour plus d'aide
