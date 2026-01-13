-- ===================================
-- MISE À JOUR - Types multiples pour hébergements
-- Permet à un hébergement d'avoir plusieurs types
-- ===================================

-- 1. Modifier la colonne type pour accepter un tableau de texte
ALTER TABLE accommodations 
ALTER COLUMN type TYPE text[] 
USING ARRAY[type];

-- 2. Mettre à jour les données existantes pour les convertir en tableau
UPDATE accommodations 
SET type = ARRAY[type::text] 
WHERE type IS NOT NULL 
AND NOT (type::text = ANY(type));

-- 3. Ajouter un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_accommodations_type_gin 
ON accommodations USING GIN (type);

-- 4. Créer une fonction pour rechercher par type
CREATE OR REPLACE FUNCTION search_accommodations_by_type(search_type text)
RETURNS TABLE (
  id text,
  name text,
  type text[],
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.type,
    a.status
  FROM accommodations a
  WHERE search_type = ANY(a.type)
  AND a.status = 'published'
  ORDER BY a.name;
END;
$$ LANGUAGE plpgsql;

-- 5. Créer une vue pour faciliter l'affichage des types
CREATE OR REPLACE VIEW accommodations_with_type_labels AS
SELECT 
  a.*,
  CASE 
    WHEN 'bed_breakfast' = ANY(a.type) THEN 'Bed & Breakfast'
    WHEN 'gite' = ANY(a.type) THEN 'Gîte'
    WHEN 'hotel' = ANY(a.type) THEN 'Hôtel'
    WHEN 'camping' = ANY(a.type) THEN 'Camping'
    WHEN 'unusual' = ANY(a.type) THEN 'Hébergement insolite'
    ELSE array_to_string(a.type, ', ')
  END as type_labels
FROM accommodations a;

-- 6. Vérifier les données
SELECT 
  'VERIFICATION' as section,
  COUNT(*) as total_accommodations,
  COUNT(CASE WHEN array_length(type, 1) > 1 THEN 1 END) as multi_type_count,
  COUNT(CASE WHEN array_length(type, 1) = 1 THEN 1 END) as single_type_count
FROM accommodations;

-- 7. Exemples de types multiples (optionnel - pour test)
-- UPDATE accommodations 
-- SET type = ARRAY['bed_breakfast', 'gite'] 
-- WHERE name ILIKE '%exemple%';

COMMENT ON COLUMN accommodations.type IS 'Types d''hébergement (tableau) : bed_breakfast, gite, hotel, camping, unusual';