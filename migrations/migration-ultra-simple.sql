-- ===================================
-- MIGRATION ULTRA-SIMPLE - Types multiples
-- Version qui fonctionne à coup sûr
-- ===================================

-- ÉTAPE 1: Ajouter une nouvelle colonne
ALTER TABLE accommodations ADD COLUMN type_multiple text[];

-- ÉTAPE 2: Copier les données existantes en format array
UPDATE accommodations 
SET type_multiple = ARRAY[type] 
WHERE type IS NOT NULL;

-- ÉTAPE 3: Vérifier que ça marche
SELECT 
  name,
  type as ancien_type,
  type_multiple as nouveau_type
FROM accommodations 
LIMIT 5;

-- ÉTAPE 4: Supprimer l'ancienne colonne (ATTENTION: Sauvegardez avant!)
-- ALTER TABLE accommodations DROP COLUMN type;

-- ÉTAPE 5: Renommer la nouvelle colonne
-- ALTER TABLE accommodations RENAME COLUMN type_multiple TO type;

-- ÉTAPE 6: Ajouter l'index
-- CREATE INDEX idx_accommodations_type_gin ON accommodations USING GIN (type);