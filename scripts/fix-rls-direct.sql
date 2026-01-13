-- ===================================
-- FIX RLS POLICIES - Hébergements (Version Directe)
-- À exécuter directement dans l'éditeur SQL de Supabase
-- ===================================

-- 1. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Public read published accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can read all accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can insert accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can update accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can delete accommodations" ON accommodations;
DROP POLICY IF EXISTS "Public can read published accommodations" ON accommodations;

-- 2. Désactiver temporairement RLS pour nettoyer
ALTER TABLE accommodations DISABLE ROW LEVEL SECURITY;

-- 3. Réactiver RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- 4. Créer des politiques très permissives pour l'admin

-- Lecture publique des hébergements publiés
CREATE POLICY "Public can read published accommodations" 
ON accommodations FOR SELECT 
USING (status = 'published');

-- Accès complet pour tous les utilisateurs authentifiés (même anonymes)
CREATE POLICY "Full access for authenticated users" 
ON accommodations FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Vérifier les politiques actives
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

-- 6. Test de fonctionnement
SELECT 
    'TEST RLS' as section,
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count
FROM accommodations;