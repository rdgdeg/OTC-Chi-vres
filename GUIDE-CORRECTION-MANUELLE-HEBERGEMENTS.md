# Guide de Correction Manuelle des Hébergements

## 🚨 Problème Identifié

Les scripts automatiques ne peuvent pas mettre à jour les hébergements à cause des politiques RLS (Row Level Security). Voici comment corriger cela manuellement.

## 🔧 Solution 1: Via l'Interface Supabase (Recommandé)

### Étape 1: Accéder à Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Allez dans **SQL Editor**

### Étape 2: Exécuter les Corrections SQL

**Option A: Script complet (recommandé)**
Copiez le contenu du fichier `migrations/update-accommodations-only.sql` et exécutez-le dans l'éditeur SQL.

**Option B: Script manuel**
Copiez et exécutez ce script SQL dans l'éditeur :

```sql
-- Correction complète des hébergements avec galeries, équipements et prix

-- La Loge Bed & Breakfast
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

-- Au sentier Chauchaut
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['WiFi', 'Parking', 'Jardin', 'Terrasse'],
  price_range = '€€'
WHERE id = 'au-sentier-chauchaut';

-- La Maison d'à côté
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['WiFi', 'Parking', 'Jardin', 'Barbecue', 'Vélos disponibles'],
  price_range = '€€€'
WHERE id = 'la-maison-dacote';

-- Au Champ du Bouillon
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Spa privatif', 'WiFi', 'Parking', 'Jardin', 'Terrasse'],
  price_range = '€€€'
WHERE id = 'au-champ-du-bouillon';

-- Les Greniers du Moulin
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Ferme bio', 'Produits locaux', 'WiFi', 'Parking', 'Jardin', 'Barbecue'],
  price_range = '€€€'
WHERE id = 'les-greniers-du-moulin';

-- L'Évasion (yacht)
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Yacht amarré', 'Bord de l''eau', 'WiFi', 'Terrasse sur l''eau'],
  price_range = '€€€€'
WHERE id = 'levasion-yacht';

-- Moulin du Domissart
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Moulin historique', 'Wellness', 'Barbecue', 'WiFi', 'Parking', 'Ménage inclus'],
  price_range = '€€€€'
WHERE id = 'moulin-du-domissart';

-- Chez les Kikis
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Centre-ville', 'Monuments historiques', 'Activités sportives', 'WiFi', 'Parking'],
  price_range = '€€'
WHERE id = 'chez-les-kikis';

-- On dirait le sud…
UPDATE accommodations SET
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
  ],
  amenities = ARRAY['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
  price_range = '€€€'
WHERE id = 'on-dirait-le-sud';
```

### Étape 3: Vérifier les Résultats

Exécutez cette requête pour vérifier :

```sql
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
```

## 🔧 Solution 2: Via l'Interface Admin de l'Application

Si vous préférez utiliser l'interface admin :

### Étape 1: Accéder à l'Admin
1. Allez sur votre site : `https://votre-site.vercel.app/admin`
2. Connectez-vous avec vos identifiants admin

### Étape 2: Modifier Chaque Hébergement
Pour chaque hébergement, ajoutez manuellement :

#### **La Loge Bed & Breakfast**
- **Galerie** : 3 images (utilisez l'upload ou les URLs fournies)
- **Équipements** : Petit-déjeuner, WiFi, Parking, Jardin
- **Prix** : €€

#### **Au sentier Chauchaut**
- **Galerie** : 3 images
- **Équipements** : WiFi, Parking, Jardin, Terrasse
- **Prix** : €€

#### **La Maison d'à côté**
- **Galerie** : 3 images
- **Équipements** : WiFi, Parking, Jardin, Barbecue, Vélos disponibles
- **Prix** : €€€

#### **Au Champ du Bouillon**
- **Galerie** : 3 images
- **Équipements** : Spa privatif, WiFi, Parking, Jardin, Terrasse
- **Prix** : €€€

#### **Les Greniers du Moulin**
- **Galerie** : 3 images
- **Équipements** : Ferme bio, Produits locaux, WiFi, Parking, Jardin, Barbecue
- **Prix** : €€€

#### **L'Évasion**
- **Galerie** : 3 images
- **Équipements** : Yacht amarré, Bord de l'eau, WiFi, Terrasse sur l'eau
- **Prix** : €€€€

#### **Moulin du Domissart**
- **Galerie** : 3 images
- **Équipements** : Moulin historique, Wellness, Barbecue, WiFi, Parking, Ménage inclus
- **Prix** : €€€€

#### **Chez les Kikis**
- **Galerie** : 3 images
- **Équipements** : Centre-ville, Monuments historiques, Activités sportives, WiFi, Parking
- **Prix** : €€

#### **On dirait le sud…**
- **Galerie** : 3 images
- **Équipements** : Piscine extérieure, Petit-déjeuner, WiFi, Parking, Jardin
- **Prix** : €€€

## 🔧 Solution 3: Corriger les Politiques RLS

Si vous voulez que les scripts fonctionnent, modifiez temporairement les politiques :

```sql
-- Désactiver temporairement RLS pour les mises à jour
ALTER TABLE accommodations DISABLE ROW LEVEL SECURITY;

-- Exécuter vos scripts de mise à jour
-- (relancer les scripts Node.js)

-- Réactiver RLS après les mises à jour
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
```

## ✅ Vérification Finale

Après avoir appliqué une des solutions, vérifiez que tout fonctionne :

1. **Page Hébergements** : `/hebergements`
2. **Détail d'un hébergement** : Cliquez sur une carte
3. **Interface Admin** : Vérifiez que vous pouvez modifier

## 📞 Support

Si vous rencontrez des difficultés :
1. Utilisez la **Solution 1** (SQL direct) - c'est la plus fiable
2. Les images par défaut sont temporaires - remplacez-les par de vraies photos
3. Tous les textes et informations sont déjà corrects

---

**🎯 Objectif** : Avoir les 9 hébergements complets avec galeries, équipements et prix pour une expérience utilisateur optimale.