-- ===================================
-- DIAGNOSTIC COMPLET SUPABASE
-- ===================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour diagnostiquer le problème updated_at

-- ===================================
-- 1. VÉRIFIER LES COLONNES
-- ===================================

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'places'
ORDER BY ordinal_position;

-- ===================================
-- 2. VÉRIFIER LES TRIGGERS
-- ===================================

SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'places';

-- ===================================
-- 3. VÉRIFIER LA FONCTION TRIGGER
-- ===================================

SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'update_updated_at_column';

-- ===================================
-- 4. COMPTER LES DONNÉES
-- ===================================

SELECT COUNT(*) as total_places FROM places;

-- ===================================
-- RÉSULTATS ATTENDUS
-- ===================================

/*
1. COLONNES :
   Vous devriez voir une colonne "updated_at" de type "timestamp with time zone"
   
2. TRIGGERS :
   Vous devriez voir "update_places_updated_at" avec BEFORE UPDATE
   
3. FONCTION :
   Vous devriez voir la fonction update_updated_at_column
   
4. DONNÉES :
   Si 0, vous devez initialiser la DB via l'Admin
*/
