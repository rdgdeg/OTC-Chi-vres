#!/usr/bin/env node

/**
 * Script simple pour mettre à jour les hébergements un par un
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Données complètes pour chaque hébergement
const accommodationsUpdates = [
  {
    id: 'la-loge-bed-breakfast',
    name: 'La Loge Bed & Breakfast',
    gallery_images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    amenities: ['Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€'
  },
  {
    id: 'au-sentier-chauchaut',
    name: 'Au sentier Chauchaut',
    gallery_images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€'
  },
  {
    id: 'la-maison-dacote',
    name: 'La Maison d\'à côté',
    gallery_images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', 'Parking', 'Jardin', 'Barbecue', 'Vélos disponibles'],
    price_range: '€€€'
  },
  {
    id: 'au-champ-du-bouillon',
    name: 'Au Champ du Bouillon',
    gallery_images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    amenities: ['Spa privatif', 'WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€€'
  },
  {
    id: 'les-greniers-du-moulin',
    name: 'Les Greniers du Moulin',
    gallery_images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    amenities: ['Ferme bio', 'Produits locaux', 'WiFi', 'Parking', 'Jardin', 'Barbecue'],
    price_range: '€€€'
  },
  {
    id: 'levasion-yacht',
    name: 'L\'Évasion',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    amenities: ['Yacht amarré', 'Bord de l\'eau', 'WiFi', 'Terrasse sur l\'eau'],
    price_range: '€€€€'
  },
  {
    id: 'moulin-du-domissart',
    name: 'Moulin du Domissart',
    gallery_images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    amenities: ['Moulin historique', 'Wellness', 'Barbecue', 'WiFi', 'Parking', 'Ménage inclus'],
    price_range: '€€€€'
  },
  {
    id: 'chez-les-kikis',
    name: 'Chez les Kikis',
    gallery_images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    amenities: ['Centre-ville', 'Monuments historiques', 'Activités sportives', 'WiFi', 'Parking'],
    price_range: '€€'
  },
  {
    id: 'on-dirait-le-sud',
    name: 'On dirait le sud…',
    gallery_images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ],
    amenities: ['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€€'
  }
];

async function updateAccommodationsSimple() {
  console.log('🏠 Mise à jour simple des hébergements...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const accommodation of accommodationsUpdates) {
    try {
      console.log(`📝 Mise à jour: ${accommodation.name}...`);
      
      // Première tentative : mise à jour directe
      const { data, error } = await supabase
        .from('accommodations')
        .update({
          gallery_images: accommodation.gallery_images,
          amenities: accommodation.amenities,
          price_range: accommodation.price_range,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodation.id)
        .select('name');

      if (error) {
        console.error(`❌ Erreur pour ${accommodation.name}:`, error.message);
        
        // Deuxième tentative : mise à jour par étapes
        console.log(`🔄 Tentative par étapes pour ${accommodation.name}...`);
        
        // Étape 1: Galerie
        const { error: galleryError } = await supabase
          .from('accommodations')
          .update({ gallery_images: accommodation.gallery_images })
          .eq('id', accommodation.id);
        
        if (galleryError) {
          console.error(`  ❌ Erreur galerie:`, galleryError.message);
        } else {
          console.log(`  ✅ Galerie mise à jour`);
        }
        
        // Étape 2: Équipements
        const { error: amenitiesError } = await supabase
          .from('accommodations')
          .update({ amenities: accommodation.amenities })
          .eq('id', accommodation.id);
        
        if (amenitiesError) {
          console.error(`  ❌ Erreur équipements:`, amenitiesError.message);
        } else {
          console.log(`  ✅ Équipements mis à jour`);
        }
        
        // Étape 3: Prix
        const { error: priceError } = await supabase
          .from('accommodations')
          .update({ price_range: accommodation.price_range })
          .eq('id', accommodation.id);
        
        if (priceError) {
          console.error(`  ❌ Erreur prix:`, priceError.message);
          errorCount++;
        } else {
          console.log(`  ✅ Prix mis à jour`);
          successCount++;
        }
        
      } else {
        console.log(`✅ ${accommodation.name} mis à jour avec succès`);
        successCount++;
      }
      
      // Petite pause entre les mises à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${accommodation.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la mise à jour:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total traité: ${accommodationsUpdates.length}`);

  // Vérification finale
  console.log('\n🔍 Vérification finale...');
  const { data: finalData, error: finalError } = await supabase
    .from('accommodations')
    .select('name, gallery_images, amenities, price_range')
    .order('name');

  if (finalError) {
    console.error('❌ Erreur lors de la vérification:', finalError.message);
  } else {
    console.log('\n📋 État final des hébergements:');
    finalData.forEach((acc, index) => {
      const galleryCount = acc.gallery_images?.length || 0;
      const amenitiesCount = acc.amenities?.length || 0;
      const priceRange = acc.price_range || 'Non défini';
      
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   🖼️ Galerie: ${galleryCount} images ${galleryCount > 0 ? '✅' : '❌'}`);
      console.log(`   🏠 Équipements: ${amenitiesCount} ${amenitiesCount > 0 ? '✅' : '❌'}`);
      console.log(`   💰 Prix: ${priceRange} ${priceRange !== 'Non défini' ? '✅' : '❌'}`);
      console.log('');
    });
    
    // Statistiques finales
    const completeCount = finalData.filter(acc => 
      acc.gallery_images?.length > 0 && 
      acc.amenities?.length > 0 && 
      acc.price_range
    ).length;
    
    console.log(`🎯 Hébergements complets: ${completeCount}/${finalData.length}`);
    
    if (completeCount === finalData.length) {
      console.log('🎉 Tous les hébergements sont maintenant complets !');
    } else {
      console.log('⚠️ Certains hébergements nécessitent encore des ajustements');
    }
  }
}

// Exécution du script
updateAccommodationsSimple()
  .then(() => {
    console.log('\n✅ Mise à jour terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });