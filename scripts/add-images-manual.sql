-- ===================================
-- AJOUT MANUEL DES IMAGES AUX HÉBERGEMENTS
-- À exécuter dans le SQL Editor de Supabase
-- ===================================

-- Mise à jour des images pour chaque hébergement
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1001/600/400' WHERE id = 'la-loge-bed-breakfast';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1002/600/400' WHERE id = 'au-sentier-chauchaut';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1003/600/400' WHERE id = 'la-maison-dacote';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1004/600/400' WHERE id = 'au-champ-du-bouillon';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1005/600/400' WHERE id = 'les-greniers-du-moulin';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1006/600/400' WHERE id = 'levasion-yacht';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1007/600/400' WHERE id = 'moulin-du-domissart';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1008/600/400' WHERE id = 'chez-les-kikis';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1009/600/400' WHERE id = 'on-dirait-le-sud';

-- Vérification des résultats
SELECT 
    id,
    name,
    CASE 
        WHEN featured_image IS NOT NULL THEN '✅ Image présente'
        ELSE '❌ Image manquante'
    END as image_status,
    featured_image
FROM accommodations 
ORDER BY name;

-- Statistiques finales
SELECT 
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN featured_image IS NOT NULL THEN 1 END) as with_images,
    COUNT(CASE WHEN featured_image IS NULL THEN 1 END) as without_images
FROM accommodations;