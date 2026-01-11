-- Script de configuration complète pour les hébergements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_accommodation_views(accommodation_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE accommodations 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = accommodation_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Exécuter le script de migration des hébergements
\i migrations/add-accommodations-table.sql

-- 3. Vérifier que tout est en place
SELECT 
  'accommodations' as table_name,
  COUNT(*) as record_count
FROM accommodations
UNION ALL
SELECT 
  'media' as table_name,
  COUNT(*) as record_count  
FROM media
UNION ALL
SELECT
  'categories' as table_name,
  COUNT(*) as record_count
FROM categories;

-- 4. Afficher les hébergements créés
SELECT 
  id,
  name,
  type,
  village,
  capacity,
  status,
  created_at
FROM accommodations
ORDER BY created_at DESC;