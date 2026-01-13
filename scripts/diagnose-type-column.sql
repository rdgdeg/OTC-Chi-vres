-- ===================================
-- DIAGNOSTIC - Structure de la colonne type
-- Pour comprendre le problème avant la migration
-- ===================================

-- 1. Vérifier la structure de la table
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'accommodations' 
AND column_name = 'type';

-- 2. Vérifier les contraintes existantes
SELECT 
  constraint_name,
  constraint_type,
  check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'accommodations'
AND tc.constraint_type = 'CHECK';

-- 3. Voir les valeurs actuelles
SELECT 
  type,
  COUNT(*) as count
FROM accommodations 
GROUP BY type
ORDER BY count DESC;

-- 4. Voir quelques exemples de données
SELECT 
  id,
  name,
  type,
  pg_typeof(type) as type_of_type
FROM accommodations 
LIMIT 5;