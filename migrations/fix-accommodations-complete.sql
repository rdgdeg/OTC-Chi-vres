-- ===================================
-- CORRECTION COMPLÈTE DES HÉBERGEMENTS
-- Ajoute les galeries d'images, équipements et prix
-- ===================================

-- Mise à jour de La Loge Bed & Breakfast
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
  price_range = '€€',
  updated_at = NOW()
WHERE id = 'la-loge-bed-breakfast';

-- Mise à jour de Au sentier Chauchaut
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['WiFi', 'Parking', 'Jardin', 'Terrasse'],
  price_range = '€€',
  updated_at = NOW()
WHERE id = 'au-sentier-chauchaut';

-- Mise à jour de La Maison d'à côté
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['WiFi', 'Parking', 'Jardin', 'Barbecue', 'Vélos disponibles'],
  price_range = '€€€',
  updated_at = NOW()
WHERE id = 'la-maison-dacote';

-- Mise à jour de Au Champ du Bouillon
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Spa privatif', 'WiFi', 'Parking', 'Jardin', 'Terrasse'],
  price_range = '€€€',
  updated_at = NOW()
WHERE id = 'au-champ-du-bouillon';

-- Mise à jour de Les Greniers du Moulin
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Ferme bio', 'Produits locaux', 'WiFi', 'Parking', 'Jardin', 'Barbecue'],
  price_range = '€€€',
  updated_at = NOW()
WHERE id = 'les-greniers-du-moulin';

-- Mise à jour de L'Évasion (yacht)
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Yacht amarré', 'Bord de l''eau', 'WiFi', 'Terrasse sur l''eau'],
  price_range = '€€€€',
  updated_at = NOW()
WHERE id = 'levasion-yacht';

-- Mise à jour de Moulin du Domissart
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Moulin historique', 'Wellness', 'Barbecue', 'WiFi', 'Parking', 'Ménage inclus'],
  price_range = '€€€€',
  updated_at = NOW()
WHERE id = 'moulin-du-domissart';

-- Mise à jour de Chez les Kikis
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Centre-ville', 'Monuments historiques', 'Activités sportives', 'WiFi', 'Parking'],
  price_range = '€€',
  updated_at = NOW()
WHERE id = 'chez-les-kikis';

-- Mise à jour de On dirait le sud…
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
  price_range = '€€€',
  updated_at = NOW()
WHERE id = 'on-dirait-le-sud';

-- Vérification finale
SELECT 
  name,
  type,
  capacity,
  village,
  CASE 
    WHEN gallery_images IS NOT NULL AND array_length(gallery_images, 1) > 0 
    THEN array_length(gallery_images, 1)::text || ' images'
    ELSE 'Pas d''images'
  END as galerie,
  CASE 
    WHEN amenities IS NOT NULL AND array_length(amenities, 1) > 0 
    THEN array_length(amenities, 1)::text || ' équipements'
    ELSE 'Pas d''équipements'
  END as equipements,
  COALESCE(price_range, 'Prix non défini') as prix
FROM accommodations 
ORDER BY name;