-- ===================================
-- CORRECTION FINALE DES HÉBERGEMENTS
-- Ajout des images + corrections mineures
-- ===================================

-- 1. Ajouter les images à tous les hébergements
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1001/600/400' WHERE name = 'La Loge Bed & Breakfast';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1002/600/400' WHERE name = 'Au sentier Chauchaut';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1003/600/400' WHERE name = 'La Maison d''à côté';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1004/600/400' WHERE name = 'Au Champ du Bouillon';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1005/600/400' WHERE name = 'Les Greniers du Moulin';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1006/600/400' WHERE name = 'L''Évasion';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1007/600/400' WHERE name = 'Moulin du Domissart';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1008/600/400' WHERE name = 'Chez les Kikis';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1009/600/400' WHERE name = 'On dirait le sud…';

-- 2. Corriger les URLs des sites web (optionnel - les deux formats fonctionnent)
-- UPDATE accommodations SET website = 'www.ausentierchauchaut.com' WHERE name = 'Au sentier Chauchaut';
-- UPDATE accommodations SET website = 'www.lamaisondacote.be' WHERE name = 'La Maison d''à côté';

-- 3. Ajouter les numéros de téléphone secondaires dans la description si nécessaire
UPDATE accommodations 
SET description = description || ' Contact supplémentaire : 0478 79 23 26'
WHERE name = 'Moulin du Domissart' AND description NOT LIKE '%0478 79 23 26%';

UPDATE accommodations 
SET description = description || ' Contact après 18h00 : 0497 31 12 04'
WHERE name = 'Chez les Kikis' AND description NOT LIKE '%0497 31 12 04%';

UPDATE accommodations 
SET description = description || ' Contact supplémentaire : 0478 35 89 57'
WHERE name = 'On dirait le sud…' AND description NOT LIKE '%0478 35 89 57%';

-- 4. Vérification finale
SELECT 
    name,
    village,
    type,
    capacity,
    CASE 
        WHEN featured_image IS NOT NULL THEN '✅ Image présente'
        ELSE '❌ Image manquante'
    END as image_status,
    CASE 
        WHEN features IS NOT NULL AND array_length(features, 1) > 0 THEN '✅ ' || array_length(features, 1) || ' caractéristiques'
        ELSE '❌ Pas de caractéristiques'
    END as features_status,
    status
FROM accommodations 
ORDER BY name;

-- 5. Statistiques finales
SELECT 
    'RÉSUMÉ FINAL' as section,
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN featured_image IS NOT NULL THEN 1 END) as with_images,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
    COUNT(CASE WHEN features IS NOT NULL AND array_length(features, 1) > 0 THEN 1 END) as with_features
FROM accommodations;