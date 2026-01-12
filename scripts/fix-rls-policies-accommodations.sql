-- ===================================
-- FIX RLS POLICIES - Hébergements
-- Permet aux utilisateurs authentifiés (même anonymes) de modifier les hébergements
-- ===================================

-- 1. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Public read published accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can read all accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can insert accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can update accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can delete accommodations" ON accommodations;

-- 2. Créer de nouvelles politiques plus permissives pour l'admin

-- Lecture publique des hébergements publiés
CREATE POLICY "Public can read published accommodations" 
ON accommodations FOR SELECT 
USING (status = 'published');

-- Lecture complète pour les utilisateurs authentifiés (y compris anonymes)
CREATE POLICY "Authenticated users can read all accommodations" 
ON accommodations FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insertion pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert accommodations" 
ON accommodations FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update accommodations" 
ON accommodations FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete accommodations" 
ON accommodations FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Vérifier que RLS est activé
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- 4. Afficher les politiques actives
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
WHERE tablename = 'accommodations'
ORDER BY policyname;

-- 5. Test de fonctionnement
SELECT 
    'TEST RLS' as section,
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count
FROM accommodations;