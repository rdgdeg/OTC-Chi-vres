-- ===================================
-- DIAGNOSTIC SIMPLE - Structure colonne type
-- ===================================

-- 1. Voir la structure de la colonne type
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'accommodations' 
AND column_name = 'type';

-- 2. Voir les valeurs actuelles
SELECT 
  type,
  COUNT(*) as count
FROM accommodations 
GROUP BY type
ORDER BY count DESC;

-- 3. Voir quelques exemples
SELECT 
  id,
  name,
  type
FROM accommodations 
LIMIT 5;