#!/usr/bin/env node

/**
 * Script pour ajouter les équipements et gammes de prix manquants
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

// Données des équipements et prix par hébergement
const accommodationExtras = {
  'la-loge-bed-breakfast': {
    amenities: ['Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€'
  },
  'au-sentier-chauchaut': {
    amenities: ['WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€'
  },
  'la-maison-dacote': {
    amenities: ['WiFi', 'Parking', 'Jardin', 'Barbecue', 'Vélos disponibles'],
    price_range: '€€€'
  },
  'au-champ-du-bouillon': {
    amenities: ['Spa privatif', 'WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€€'
  },
  'les-greniers-du-moulin': {
    amenities: ['Ferme bio', 'Produits locaux', 'WiFi', 'Parking', 'Jardin', 'Barbecue'],
    price_range: '€€€'
  },
  'levasion-yacht': {
    amenities: ['Yacht amarré', 'Bord de l\'eau', 'WiFi', 'Terrasse sur l\'eau'],
    price_range: '€€€€'
  },
  'moulin-du-domissart': {
    amenities: ['Moulin historique', 'Wellness', 'Barbecue', 'WiFi', 'Parking', 'Ménage inclus'],
    price_range: '€€€€'
  },
  'chez-les-kikis': {
    amenities: ['Centre-ville', 'Monuments historiques', 'Activités sportives', 'WiFi', 'Parking'],
    price_range: '€€'
  },
  'on-dirait-le-sud': {
    amenities: ['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€€'
  }
};

async function addMissingAmenitiesAndPrices() {
  console.log('🏠 Ajout des équipements et gammes de prix...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [accommodationId, extras] of Object.entries(accommodationExtras)) {
    try {
      console.log(`🔧 Mise à jour: ${accommodationId}...`);
      
      const { error } = await supabase
        .from('accommodations')
        .update({
          amenities: extras.amenities,
          price_range: extras.price_range,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodationId);

      if (error) {
        console.error(`❌ Erreur pour ${accommodationId}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${accommodationId} mis à jour (${extras.amenities.length} équipements, prix: ${extras.price_range})`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${accommodationId}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la mise à jour:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total traité: ${Object.keys(accommodationExtras).length}`);

  // Vérification finale
  console.log('\n🔍 Vérification des données ajoutées...');
  const { data: finalData, error: finalError } = await supabase
    .from('accommodations')
    .select('id, name, amenities, price_range')
    .order('name');

  if (finalError) {
    console.error('❌ Erreur lors de la vérification:', finalError.message);
  } else {
    console.log('\n📋 État final des équipements et prix:');
    finalData.forEach((acc, index) => {
      const amenitiesCount = acc.amenities ? acc.amenities.length : 0;
      const priceRange = acc.price_range || 'Non définie';
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   🏠 Équipements: ${amenitiesCount} ${amenitiesCount > 0 ? '✅' : '❌'}`);
      console.log(`   💰 Prix: ${priceRange} ${priceRange !== 'Non définie' ? '✅' : '❌'}`);
      if (acc.amenities && acc.amenities.length > 0) {
        console.log(`   📝 Liste: ${acc.amenities.join(', ')}`);
      }
      console.log('');
    });
  }
}

// Exécution du script
addMissingAmenitiesAndPrices()
  .then(() => {
    console.log('🎉 Ajout des équipements et prix terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });