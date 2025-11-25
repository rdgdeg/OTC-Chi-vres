-- ===================================
-- MIGRATION SCRIPT - Ajouter les nouveaux champs
-- ===================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour ajouter les nouveaux champs aux tables existantes

-- Ajouter les nouveaux champs à la table places
ALTER TABLE places ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS "openingHours" TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS "practicalInfo" TEXT;

-- Vérifier que galleryImages existe déjà (normalement oui)
-- Si non, l'ajouter
ALTER TABLE places ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[] DEFAULT '{}';

-- ===================================
-- EXEMPLES DE DONNÉES POUR TESTER
-- ===================================

-- Exemple : Mettre à jour un musée existant avec les nouveaux champs
-- Remplacez 'museum-1' par l'ID réel de votre musée

/*
UPDATE places 
SET 
    email = 'contact@musee-chievres.be',
    facebook = 'https://facebook.com/musee.chievres',
    instagram = 'https://instagram.com/musee_chievres',
    "openingHours" = E'Mardi - Dimanche: 10h00 - 18h00\nFermé le lundi\nDernière entrée: 17h00',
    price = E'Adulte: 8€\nEnfant (6-12 ans): 5€\nGratuit -6 ans\nGroupe (10+): 6€/pers',
    "practicalInfo" = E'Parking gratuit disponible\nAccessible PMR\nVisites guidées sur réservation\nAudioguides disponibles en FR/NL/EN',
    "galleryImages" = ARRAY[
        'https://picsum.photos/id/1015/800/600',
        'https://picsum.photos/id/1016/800/600',
        'https://picsum.photos/id/1018/800/600'
    ]
WHERE id = 'museum-1';
*/

-- ===================================
-- VÉRIFICATION
-- ===================================

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'places' 
ORDER BY ordinal_position;

-- Compter les musées avec les nouveaux champs remplis
SELECT 
    COUNT(*) as total_museums,
    COUNT(email) as with_email,
    COUNT("openingHours") as with_hours,
    COUNT(price) as with_price,
    COUNT("practicalInfo") as with_info,
    COUNT(CASE WHEN array_length("galleryImages", 1) > 0 THEN 1 END) as with_gallery
FROM places 
WHERE type = 'museum';
