-- ===================================
-- FIX URGENT - Désactiver le trigger problématique
-- ===================================
-- Ce script désactive temporairement le trigger updated_at
-- pour que vous puissiez continuer à travailler

-- ===================================
-- OPTION 1 : DÉSACTIVER LES TRIGGERS (RAPIDE)
-- ===================================

-- Supprimer tous les triggers updated_at
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;

-- Supprimer la fonction trigger
DROP FUNCTION IF EXISTS update_updated_at_column();

SELECT 'Triggers désactivés - vous pouvez maintenant modifier les données' as status;

-- ===================================
-- OPTION 2 : VÉRIFIER ET AJOUTER LA COLONNE SI MANQUANTE
-- ===================================

-- Ajouter updated_at si elle n'existe pas
ALTER TABLE places ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

SELECT 'Colonnes updated_at ajoutées' as status;

-- ===================================
-- OPTION 3 : RECRÉER LE TRIGGER CORRECTEMENT
-- ===================================

-- Créer une fonction trigger qui vérifie si la colonne existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour updated_at seulement si la colonne existe
    IF TG_OP = 'UPDATE' THEN
        BEGIN
            NEW.updated_at = NOW();
        EXCEPTION
            WHEN undefined_column THEN
                -- Ignorer si la colonne n'existe pas
                NULL;
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer les triggers
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

SELECT 'Triggers recréés avec gestion d''erreur' as status;

-- ===================================
-- VÉRIFICATION FINALE
-- ===================================

-- Vérifier que les colonnes existent
SELECT 
    table_name,
    column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'updated_at'
ORDER BY table_name;

-- Vérifier que les triggers sont créés
SELECT 
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ===================================
-- INSTRUCTIONS
-- ===================================

/*
EXÉCUTEZ CE SCRIPT COMPLET dans Supabase SQL Editor.

Il va :
1. Désactiver les anciens triggers
2. Ajouter les colonnes updated_at si elles manquent
3. Recréer les triggers avec gestion d'erreur
4. Vérifier que tout est en place

Après avoir exécuté ce script :
1. Rafraîchissez votre application (Ctrl+Shift+R)
2. Testez l'upload d'images
3. L'erreur devrait disparaître

Si l'erreur persiste, utilisez seulement l'OPTION 1 (désactiver les triggers)
et le code TypeScript gérera updated_at manuellement.
*/
