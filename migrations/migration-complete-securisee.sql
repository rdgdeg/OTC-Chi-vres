-- ===================================
-- MIGRATION COMPLÈTE SÉCURISÉE
-- ===================================

-- Créer une nouvelle table temporaire avec la bonne structure
CREATE TABLE accommodations_new AS 
SELECT 
  id,
  name,
  slug,
  description,
  excerpt,
  ARRAY[type] as type,  -- Convertir directement en array
  capacity,
  bedrooms,
  beds_description,
  address,
  village,
  lat,
  lng,
  phone,
  email,
  website,
  facebook,
  featured_image,
  gallery_images,
  features,
  amenities,
  price_range,
  price_details,
  check_in_time,
  check_out_time,
  house_rules,
  cancellation_policy,
  available_from,
  available_to,
  min_stay,
  status,
  tag_ids,
  rating,
  view_count,
  meta_title,
  meta_description,
  created_at,
  updated_at
FROM accommodations;

-- Supprimer l'ancienne table
DROP TABLE accommodations;

-- Renommer la nouvelle table
ALTER TABLE accommodations_new RENAME TO accommodations;

-- Ajouter les contraintes et index
ALTER TABLE accommodations ADD PRIMARY KEY (id);
CREATE INDEX idx_accommodations_type_gin ON accommodations USING GIN (type);
CREATE INDEX idx_accommodations_status ON accommodations (status);
CREATE INDEX idx_accommodations_slug ON accommodations (slug);

-- Vérification finale
SELECT 
  'MIGRATION TERMINÉE' as status,
  COUNT(*) as total,
  COUNT(CASE WHEN array_length(type, 1) >= 1 THEN 1 END) as with_types
FROM accommodations;