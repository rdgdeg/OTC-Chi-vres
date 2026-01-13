-- ===================================
-- MIGRATION SIMPLE - Types multiples (Version Ultra-Sécurisée)
-- ===================================

-- 1. Supprimer toutes les contraintes CHECK sur la colonne type
DO $$ 
DECLARE 
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
        WHERE tc.table_name = 'accommodations'
        AND cc.check_clause LIKE '%type%'
    LOOP
        EXECUTE 'ALTER TABLE accommodations DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
    END LOOP;
END $$;

-- 2. Créer une nouvelle colonne temporaire
ALTER TABLE accommodations ADD COLUMN type_new text[];

-- 3. Copier les données en convertissant en tableau
UPDATE accommodations 
SET type_new = ARRAY[type::text] 
WHERE type IS NOT NULL;

-- 4. Supprimer l'ancienne colonne
ALTER TABLE accommodations DROP COLUMN type;

-- 5. Renommer la nouvelle colonne
ALTER TABLE accommodations RENAME COLUMN type_new TO type;

-- 6. Ajouter l'index pour les performances
CREATE INDEX IF NOT EXISTS idx_accommodations_type_gin 
ON accommodations USING GIN (type);

-- 7. Vérification finale
SELECT 
  'MIGRATION TERMINÉE' as status,
  COUNT(*) as total_accommodations,
  COUNT(CASE WHEN array_length(type, 1) >= 1 THEN 1 END) as with_types,
  COUNT(CASE WHEN type IS NULL THEN 1 END) as without_types
FROM accommodations;

-- 8. Exemples de données
SELECT 
  name,
  type,
  array_length(type, 1) as nb_types
FROM accommodations 
WHERE type IS NOT NULL
LIMIT 5;