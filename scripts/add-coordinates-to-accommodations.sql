-- ===================================
-- AJOUT DES COORDONNÉES GPS AUX HÉBERGEMENTS
-- ===================================

-- 1. Ajouter les colonnes lat/lng si elles n'existent pas
ALTER TABLE accommodations 
ADD COLUMN IF NOT EXISTS lat NUMERIC,
ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- 2. Ajouter les coordonnées GPS pour chaque hébergement
-- (Coordonnées obtenues via géocodage OpenStreetMap)

UPDATE accommodations SET lat = 50.5860, lng = 3.7783 WHERE name = 'Au Champ du Bouillon';
UPDATE accommodations SET lat = 50.5905, lng = 3.8045 WHERE name = 'Au sentier Chauchaut';
UPDATE accommodations SET lat = 50.5892, lng = 3.8076 WHERE name = 'Chez les Kikis';
UPDATE accommodations SET lat = 50.5897, lng = 3.8014 WHERE name = 'L''Évasion'; -- Coordonnées par défaut Chièvres
UPDATE accommodations SET lat = 50.5529, lng = 3.7962 WHERE name = 'La Loge Bed & Breakfast';
UPDATE accommodations SET lat = 50.5897, lng = 3.7890 WHERE name = 'La Maison d''à côté';
UPDATE accommodations SET lat = 50.5502, lng = 3.7691 WHERE name = 'Les Greniers du Moulin';
UPDATE accommodations SET lat = 50.5489, lng = 3.7542 WHERE name = 'Moulin du Domissart';
UPDATE accommodations SET lat = 50.5744, lng = 3.7641 WHERE name = 'On dirait le sud…';

-- 3. Vérification des coordonnées
SELECT 
    name,
    address,
    village,
    CASE 
        WHEN lat IS NOT NULL AND lng IS NOT NULL THEN '✅ GPS: ' || ROUND(lat::numeric, 4) || ', ' || ROUND(lng::numeric, 4)
        ELSE '❌ Pas de coordonnées'
    END as coordinates_status
FROM accommodations 
ORDER BY name;

-- 4. Statistiques finales
SELECT 
    'COORDONNÉES GPS' as section,
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as with_coordinates,
    COUNT(CASE WHEN lat IS NULL OR lng IS NULL THEN 1 END) as without_coordinates
FROM accommodations;