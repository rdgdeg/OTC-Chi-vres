-- ===================================
-- MISE À JOUR - Types multiples pour hébergements (VERSION CORRIGÉE)
-- Permet à un hébergement d'avoir plusieurs types
-- ===================================

-- 1. Vérifier la structure actuelle
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'accommodations' AND column_name = 'type';

-- 2. Modifier la colonne type pour accepter un tableau de texte
-- Utiliser une conversion sécurisée
ALTER TABLE accommodations 
ALTER COLUMN type TYPE text[] 
USING CASE 
  WHEN type IS NULL THEN NULL
  ELSE ARRAY[type::text]
END;

-- 3. Vérifier que la conversion a fonctionné
SELECT 
  id, 
  name, 
  type,
  array_length(type, 1) as type_count
FROM accommodations 
LIMIT 5;

-- 4. Ajouter un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_accommodations_type_gin 
ON accommodations USING GIN (type);

-- 5. Créer une fonction pour rechercher par type
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

-- 6. Créer une vue pour faciliter l'affichage des types
CREATE OR REPLACE VIEW accommodations_with_type_labels AS
SELECT 
  a.*,
  array_to_string(
    ARRAY(
      SELECT 
        CASE t
          WHEN 'bed_breakfast' THEN 'Bed & Breakfast'
          WHEN 'gite' THEN 'Gîte'
          WHEN 'hotel' THEN 'Hôtel'
          WHEN 'camping' THEN 'Camping'
          WHEN 'unusual' THEN 'Hébergement insolite'
          ELSE t
        END
      FROM unnest(a.type) AS t
    ),
    ', '
  ) as type_labels
FROM accommodations a;

-- 7. Test de fonctionnement avec types multiples
-- Exemple : mettre un hébergement avec plusieurs types (optionnel)
-- UPDATE accommodations 
-- SET type = ARRAY['bed_breakfast', 'gite'] 
-- WHERE name ILIKE '%test%' OR name ILIKE '%exemple%'
-- LIMIT 1;

-- 8. Vérifier les données finales
SELECT 
  'VERIFICATION FINALE' as section,
  COUNT(*) as total_accommodations,
  COUNT(CASE WHEN array_length(type, 1) > 1 THEN 1 END) as multi_type_count,
  COUNT(CASE WHEN array_length(type, 1) = 1 THEN 1 END) as single_type_count,
  COUNT(CASE WHEN type IS NULL THEN 1 END) as null_type_count
FROM accommodations;

-- 9. Afficher quelques exemples
SELECT 
  name,
  type,
  array_length(type, 1) as nb_types
FROM accommodations 
WHERE type IS NOT NULL
ORDER BY name
LIMIT 10;

COMMENT ON COLUMN accommodations.type IS 'Types d''hébergement (tableau) : bed_breakfast, gite, hotel, camping, unusual';