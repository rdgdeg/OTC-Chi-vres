-- Migration simplifiée pour ajouter le tri aux lieux (musées et patrimoine)
-- Version compatible avec les contraintes Supabase

-- 1. Ajouter la colonne sort_order si elle n'existe pas
ALTER TABLE places ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Créer un index pour améliorer les performances de tri
CREATE INDEX IF NOT EXISTS idx_places_sort_order ON places(type, sort_order);

-- 3. Initialiser les valeurs de sort_order pour les musées existants
-- Approche simple : assigner des valeurs séquentielles
DO $$
DECLARE
    museum_record RECORD;
    counter INTEGER := 1;
BEGIN
    -- Parcourir tous les musées dans l'ordre alphabétique
    FOR museum_record IN 
        SELECT id FROM places 
        WHERE type = 'museum' AND (sort_order IS NULL OR sort_order = 0)
        ORDER BY name
    LOOP
        UPDATE places 
        SET sort_order = counter 
        WHERE id = museum_record.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- 4. Commentaires pour documentation
COMMENT ON COLUMN places.sort_order IS 'Ordre d''affichage des éléments (plus petit = affiché en premier)';

-- 5. Vérification finale
SELECT 
    name, 
    sort_order,
    CASE 
        WHEN sort_order IS NULL OR sort_order = 0 THEN 'Non défini'
        ELSE 'Défini'
    END as status
FROM places 
WHERE type = 'museum' 
ORDER BY sort_order, name;