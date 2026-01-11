#!/usr/bin/env node

/**
 * Script pour exécuter la correction SQL des hébergements
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

async function runAccommodationsFix() {
  console.log('🔧 Exécution de la correction SQL des hébergements...\n');

  try {
    // Lire le fichier SQL
    const sqlContent = readFileSync('migrations/fix-accommodations-complete.sql', 'utf8');
    
    // Diviser en requêtes individuelles (séparées par des lignes vides ou des commentaires)
    const queries = sqlContent
      .split(/(?=UPDATE accommodations SET|SELECT)/g)
      .filter(query => query.trim() && query.includes('UPDATE') || query.includes('SELECT'))
      .map(query => query.trim());

    console.log(`📝 ${queries.length} requêtes à exécuter\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      if (query.startsWith('UPDATE')) {
        // Extraire le nom de l'hébergement de la requête
        const match = query.match(/WHERE id = '([^']+)'/);
        const accommodationId = match ? match[1] : `requête ${i + 1}`;
        
        console.log(`📝 Mise à jour: ${accommodationId}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: query });
          
          if (error) {
            console.error(`❌ Erreur pour ${accommodationId}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ ${accommodationId} mis à jour avec succès`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Erreur inattendue pour ${accommodationId}:`, err.message);
          errorCount++;
        }
      } else if (query.startsWith('SELECT')) {
        console.log('\n🔍 Exécution de la vérification finale...');
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
          
          if (error) {
            console.error('❌ Erreur lors de la vérification:', error.message);
          } else {
            console.log('✅ Vérification réussie');
            if (data && data.length > 0) {
              console.log('\n📋 Résultats:');
              data.forEach((row, index) => {
                console.log(`${index + 1}. ${row.name} (${row.village})`);
                console.log(`   Type: ${row.type} | Capacité: ${row.capacity}`);
                console.log(`   Galerie: ${row.galerie}`);
                console.log(`   Équipements: ${row.equipements}`);
                console.log(`   Prix: ${row.prix}`);
                console.log('');
              });
            }
          }
        } catch (err) {
          console.error('❌ Erreur lors de la vérification:', err.message);
        }
      }
    }

    console.log('\n📊 Résumé de la correction:');
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📝 Total traité: ${successCount + errorCount}`);

  } catch (err) {
    console.error('💥 Erreur lors de la lecture du fichier SQL:', err.message);
    console.log('\n💡 Alternative: Exécutez les requêtes manuellement dans Supabase SQL Editor');
    console.log('📁 Fichier: migrations/fix-accommodations-complete.sql');
  }
}

// Fonction alternative si RPC n'est pas disponible
async function runAlternativeUpdate() {
  console.log('\n🔄 Tentative de mise à jour alternative...\n');

  const updates = [
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
    }
    // ... autres hébergements
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      console.log(`📝 Mise à jour alternative: ${update.name}...`);
      
      const { error } = await supabase
        .from('accommodations')
        .update({
          gallery_images: update.gallery_images,
          amenities: update.amenities,
          price_range: update.price_range,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.id);

      if (error) {
        console.error(`❌ Erreur pour ${update.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${update.name} mis à jour`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${update.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la mise à jour alternative:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
}

// Exécution du script
runAccommodationsFix()
  .then(() => {
    console.log('\n🎉 Correction terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    console.log('\n🔄 Tentative avec méthode alternative...');
    return runAlternativeUpdate();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale alternative:', error);
    process.exit(1);
  });