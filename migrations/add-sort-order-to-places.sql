-- Migration pour ajouter le tri aux lieux (musées et patrimoine)
-- Ajoute un champ sort_order à la table places

-- 1. Ajouter la colonne sort_order
ALTER TABLE places ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Créer un index pour améliorer les performances de tri
CREATE INDEX IF NOT EXISTS idx_places_sort_order ON places(type, sort_order);

-- 3. Initialiser les valeurs de sort_order pour les éléments existants
-- Les musées et patrimoine auront un ordre basé sur leur nom pour commencer
WITH numbered_museums AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM places 
    WHERE type = 'museum' AND (sort_order IS NULL OR sort_order = 0)
)
UPDATE places 
SET sort_order = numbered_museums.rn
FROM numbered_museums
WHERE places.id = numbered_museums.id;

-- 4. Créer une fonction pour réorganiser automatiquement les éléments
CREATE OR REPLACE FUNCTION reorder_places_after_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Si sort_order n'est pas défini, le mettre à la fin
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM places 
        WHERE type = NEW.type;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Créer le trigger pour la fonction
DROP TRIGGER IF EXISTS trigger_reorder_places ON places;
CREATE TRIGGER trigger_reorder_places
    BEFORE INSERT OR UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION reorder_places_after_update();

-- 6. Fonction utilitaire pour réorganiser manuellement l'ordre
CREATE OR REPLACE FUNCTION reorder_places_by_type(place_type TEXT)
RETURNS void AS $$
DECLARE
    place_record RECORD;
    counter INTEGER := 1;
BEGIN
    -- Réorganiser tous les éléments d'un type donné
    FOR place_record IN 
        SELECT id FROM places 
        WHERE type = place_type 
        ORDER BY sort_order, created_at, name
    LOOP
        UPDATE places 
        SET sort_order = counter 
        WHERE id = place_record.id;
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 7. Commentaires pour documentation
COMMENT ON COLUMN places.sort_order IS 'Ordre d''affichage des éléments (plus petit = affiché en premier)';
COMMENT ON FUNCTION reorder_places_after_update() IS 'Assigne automatiquement un sort_order aux nouveaux éléments';
COMMENT ON FUNCTION reorder_places_by_type(TEXT) IS 'Réorganise l''ordre des éléments d''un type donné';

-- 8. Initialiser l'ordre pour les musées existants
SELECT reorder_places_by_type('museum');