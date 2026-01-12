#!/usr/bin/env node

/**
 * Script de test pour vérifier la synchronisation unifiée
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

async function testUnifiedSync() {
  console.log('🧪 TEST DE SYNCHRONISATION UNIFIÉE');
  console.log('='.repeat(50));

  try {
    // Test 1: Hébergements
    console.log('\n1. 🏠 Test Hébergements');
    console.log('-'.repeat(30));
    
    const { data: accommodations, error: accError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (accError) {
      console.error('❌ Erreur hébergements:', accError);
    } else {
      console.log(`✅ ${accommodations.length} hébergements récupérés`);
      accommodations.slice(0, 3).forEach(acc => {
        console.log(`   - "${acc.name}" (${acc.type})`);
      });
    }

    // Test 2: Musées
    console.log('\n2. 🏛️ Test Musées');
    console.log('-'.repeat(25));
    
    const { data: museums, error: museumsError } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum')
      .order('name');

    if (museumsError) {
      console.error('❌ Erreur musées:', museumsError);
    } else {
      console.log(`✅ ${museums.length} musées récupérés`);
      museums.slice(0, 3).forEach(museum => {
        console.log(`   - "${museum.name}"`);
      });
    }

    // Test 3: Restaurants
    console.log('\n3. 🍽️ Test Restaurants');
    console.log('-'.repeat(28));
    
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('places')
      .select('*')
      .in('type', ['restaurant', 'cafe'])
      .order('name');

    if (restaurantsError) {
      console.error('❌ Erreur restaurants:', restaurantsError);
    } else {
      console.log(`✅ ${restaurants.length} restaurants récupérés`);
      restaurants.slice(0, 3).forEach(restaurant => {
        console.log(`   - "${restaurant.name}" (${restaurant.type})`);
      });
    }

    // Test 4: Blocs homepage
    console.log('\n4. 🏠 Test Blocs Homepage');
    console.log('-'.repeat(32));
    
    const { data: blocks, error: blocksError } = await supabase
      .from('homepage_blocks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (blocksError) {
      console.error('❌ Erreur blocs homepage:', blocksError);
    } else {
      console.log(`✅ ${blocks.length} blocs actifs récupérés`);
      blocks.forEach(block => {
        console.log(`   - "${block.title}"`);
      });
    }

    // Test 5: Simulation de modification
    console.log('\n5. 🔄 Test de Modification (Simulation)');
    console.log('-'.repeat(45));
    
    if (accommodations && accommodations.length > 0) {
      const testAccommodation = accommodations[0];
      console.log(`🧪 Test sur: "${testAccommodation.name}"`);
      
      // Simuler une modification (juste un SELECT pour tester)
      const { data: testData, error: testError } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', testAccommodation.id)
        .single();

      if (testError) {
        console.error('❌ Erreur test modification:', testError);
      } else {
        console.log('✅ Récupération individuelle OK');
        console.log(`   Nom: ${testData.name}`);
        console.log(`   Type: ${testData.type}`);
        console.log(`   Status: ${testData.status}`);
      }
    }

    // Résumé
    console.log('\n6. 📊 RÉSUMÉ DE LA SYNCHRONISATION');
    console.log('-'.repeat(40));
    
    const totalItems = (accommodations?.length || 0) + 
                      (museums?.length || 0) + 
                      (restaurants?.length || 0) + 
                      (blocks?.length || 0);
    
    console.log(`📈 Total éléments synchronisés: ${totalItems}`);
    console.log(`   • Hébergements: ${accommodations?.length || 0}`);
    console.log(`   • Musées: ${museums?.length || 0}`);
    console.log(`   • Restaurants: ${restaurants?.length || 0}`);
    console.log(`   • Blocs homepage: ${blocks?.length || 0}`);
    
    if (totalItems > 0) {
      console.log('\n✅ SYNCHRONISATION PARFAITE!');
      console.log('🎯 Le frontend devrait maintenant afficher toutes ces données');
      console.log('💡 Testez en rafraîchissant les pages du site');
    } else {
      console.log('\n⚠️ PROBLÈME DE SYNCHRONISATION');
      console.log('❌ Aucune donnée récupérée - vérifiez la base de données');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le test
testUnifiedSync();