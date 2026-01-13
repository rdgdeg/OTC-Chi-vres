-- ===================================
-- MIGRATION MANUELLE ÉTAPE PAR ÉTAPE
-- Exécuter une commande à la fois
-- ===================================

-- ÉTAPE 1: Voir les contraintes actuelles
SELECT constraint_name, check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'accommodations';

-- ÉTAPE 2: Supprimer la contrainte CHECK (remplacer CONSTRAINT_NAME par le nom trouvé)
-- ALTER TABLE accommodations DROP CONSTRAINT accommodations_type_check;

-- ÉTAPE 3: Ajouter une nouvelle colonne
-- ALTER TABLE accommodations ADD COLUMN type_array text[];

-- ÉTAPE 4: Copier les données
-- UPDATE accommodations SET type_array = ARRAY[type] WHERE type IS NOT NULL;

-- ÉTAPE 5: Vérifier que ça marche
-- SELECT name, type, type_array FROM accommodations LIMIT 5;

-- ÉTAPE 6: Supprimer l'ancienne colonne
-- ALTER TABLE accommodations DROP COLUMN type;

-- ÉTAPE 7: Renommer la nouvelle colonne
-- ALTER TABLE accommodations RENAME COLUMN type_array TO type;

-- ÉTAPE 8: Vérification finale
-- SELECT name, type FROM accommodations LIMIT 5;