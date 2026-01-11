-- ===================================
-- FIX UPDATED_AT TRIGGER
-- ===================================
-- Ce script corrige le trigger updated_at qui peut causer
-- l'erreur "record 'new' has no field 'updated_at'"

-- ===================================
-- 1. VÉRIFIER SI LA COLONNE EXISTE
-- ===================================

-- Vérifier que updated_at existe dans toutes les tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'updated_at'
ORDER BY table_name;

-- Si la colonne n'existe pas, l'ajouter :
-- ALTER TABLE places ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
-- ALTER TABLE page_content ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ===================================
-- 2. SUPPRIMER LES ANCIENS TRIGGERS
-- ===================================

DROP TRIGGER IF EXISTS update_places_updated_at ON places;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;

-- ===================================
-- 3. RECRÉER LA FONCTION TRIGGER
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si la colonne updated_at existe
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 4. RECRÉER LES TRIGGERS
-- ===================================

CREATE TRIGGER update_places_updated_at 
    BEFORE UPDATE ON places
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON experiences
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 5. VÉRIFICATION
-- ===================================

-- Lister tous les triggers
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ===================================
-- 6. TEST
-- ===================================

-- Tester avec une mise à jour simple
-- UPDATE places SET name = name WHERE id = (SELECT id FROM places LIMIT 1);

-- Vérifier que updated_at a été mis à jour
-- SELECT id, name, created_at, updated_at FROM places LIMIT 5;

-- ===================================
-- NOTES
-- ===================================

/*
POURQUOI CETTE ERREUR ?

L'erreur "record 'new' has no field 'updated_at'" peut survenir si :

1. La colonne updated_at n'existe pas dans la table
2. Le trigger essaie d'accéder à un champ qui n'est pas dans NEW
3. Il y a un conflit entre le trigger et les données envoyées

SOLUTION APPLIQUÉE :

1. Dans le code TypeScript (DataContext.tsx), on filtre maintenant
   les champs created_at et updated_at avant l'UPDATE
   
2. Le trigger se charge automatiquement de mettre à jour updated_at

3. Cela évite les conflits entre le code et le trigger

ALTERNATIVE :

Si vous ne voulez pas utiliser de triggers, vous pouvez :
1. Supprimer tous les triggers
2. Gérer updated_at manuellement dans le code TypeScript

Pour supprimer les triggers :
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
(répéter pour chaque table)

Puis dans le code :
const itemToUpdate = { 
  ...item, 
  updated_at: new Date().toISOString() 
};
*/

