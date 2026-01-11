#!/usr/bin/env node

/**
 * Script pour corriger les hébergements avec authentification
 * Utilise l'authentification pour contourner les politiques RLS
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

// Données complètes des hébergements avec images et équipements
const accommodationsData = [
  {
    id: 'la-loge-bed-breakfast',
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
    gallery_images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ],
    amenities: ['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€€'
  }
];

async function authenticateAndUpdate() {
  console.log('🔐 Authentification et mise à jour des hébergements...\n');

  // Essayer de s'authentifier avec un utilisateur admin
  // Vous devrez remplacer ces valeurs par vos vraies données d'admin
  const adminEmail = 'admin@chievres.be'; // Remplacez par votre email admin
  const adminPassword = 'admin123'; // Remplacez par votre mot de passe admin

  console.log('🔑 Tentative d\'authentification...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });

  if (authError) {
    console.error('❌ Erreur d\'authentification:', authError.message);
    console.log('\n💡 Solutions alternatives:');
    console.log('1. Créez un utilisateur admin dans Supabase Auth');
    console.log('2. Utilisez la clé de service dans les variables d\'environnement');
    console.log('3. Modifiez temporairement les politiques RLS');
    return;
  }

  console.log('✅ Authentification réussie');
  console.log(`👤 Utilisateur: ${authData.user.email}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const accommodation of accommodationsData) {
    try {
      console.log(`📝 Mise à jour: ${accommodation.id}...`);
      
      const { data, error } = await supabase
        .from('accommodations')
        .update({
          gallery_images: accommodation.gallery_images,
          amenities: accommodation.amenities,
          price_range: accommodation.price_range,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodation.id)
        .select('name, gallery_images, amenities, price_range');

      if (error) {
        console.error(`❌ Erreur pour ${accommodation.id}:`, error.message);
        errorCount++;
      } else if (data && data.length > 0) {
        const updated = data[0];
        console.log(`✅ ${updated.name} mis à jour`);
        console.log(`   🖼️ Galerie: ${updated.gallery_images?.length || 0} images`);
        console.log(`   🏠 Équipements: ${updated.amenities?.length || 0}`);
        console.log(`   💰 Prix: ${updated.price_range}`);
        successCount++;
      } else {
        console.log(`⚠️ ${accommodation.id} - Aucune donnée retournée`);
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${accommodation.id}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la mise à jour:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total traité: ${accommodationsData.length}`);

  // Vérification finale
  console.log('\n🔍 Vérification finale...');
  const { data: finalData, error: finalError } = await supabase
    .from('accommodations')
    .select('name, gallery_images, amenities, price_range')
    .order('name');

  if (finalError) {
    console.error('❌ Erreur lors de la vérification:', finalError.message);
  } else {
    console.log('\n📋 État final:');
    finalData.forEach((acc, index) => {
      const galleryCount = acc.gallery_images?.length || 0;
      const amenitiesCount = acc.amenities?.length || 0;
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   🖼️ Galerie: ${galleryCount} images ${galleryCount > 0 ? '✅' : '❌'}`);
      console.log(`   🏠 Équipements: ${amenitiesCount} ${amenitiesCount > 0 ? '✅' : '❌'}`);
      console.log(`   💰 Prix: ${acc.price_range || 'Non défini'} ${acc.price_range ? '✅' : '❌'}`);
      console.log('');
    });
  }

  // Déconnexion
  await supabase.auth.signOut();
  console.log('🔓 Déconnexion effectuée');
}

// Exécution du script
authenticateAndUpdate()
  .then(() => {
    console.log('\n🎉 Mise à jour terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });