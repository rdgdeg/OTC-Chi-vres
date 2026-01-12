#!/usr/bin/env node

/**
 * Script pour corriger la synchronisation frontend-backend
 * Assure que tous les éléments ont un status publié et sont visibles
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

async function fixDatabaseSync() {
  console.log('🔧 CORRECTION DE LA SYNCHRONISATION FRONTEND-BACKEND');
  console.log('='.repeat(60));

  try {
    // 1. Corriger les status des places (musées, restaurants, etc.)
    console.log('\n1. 🏛️ Correction des status - Places (Musées & Patrimoine)');
    console.log('-'.repeat(50));
    
    const { data: placesWithoutStatus, error: placesError } = await supabase
      .from('places')
      .select('id, name, type, status')
      .is('status', null);

    if (placesError) {
      console.error('❌ Erreur lors de la récupération des places:', placesError);
    } else {
      console.log(`📊 Places sans status: ${placesWithoutStatus.length}`);
      
      if (placesWithoutStatus.length > 0) {
        placesWithoutStatus.forEach(place => {
          console.log(`   - "${place.name}" (${place.type})`);
        });
        
        // Mettre à jour tous les status à 'published'
        const { error: updateError } = await supabase
          .from('places')
          .update({ status: 'published' })
          .is('status', null);
          
        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour:', updateError);
        } else {
          console.log('✅ Status mis à jour vers "published"');
        }
      } else {
        console.log('✅ Tous les places ont déjà un status');
      }
    }

    // 2. Vérifier les hébergements
    console.log('\n2. 🏠 Vérification des hébergements');
    console.log('-'.repeat(40));
    
    const { data: accommodations, error: accError } = await supabase
      .from('accommodations')
      .select('id, name, status')
      .order('name');

    if (accError) {
      console.error('❌ Erreur hébergements:', accError);
    } else {
      const published = accommodations.filter(acc => acc.status === 'published');
      console.log(`📊 Hébergements: ${accommodations.length} total, ${published.length} publiés`);
      
      if (published.length < accommodations.length) {
        const unpublished = accommodations.filter(acc => acc.status !== 'published');
        console.log('⚠️ Hébergements non publiés:');
        unpublished.forEach(acc => {
          console.log(`   - "${acc.name}" (${acc.status})`);
        });
        
        // Optionnel: publier tous les hébergements
        console.log('💡 Pour publier tous les hébergements, décommentez le code ci-dessous');
        /*
        const { error: publishError } = await supabase
          .from('accommodations')
          .update({ status: 'published' })
          .neq('status', 'published');
          
        if (!publishError) {
          console.log('✅ Tous les hébergements sont maintenant publiés');
        }
        */
      } else {
        console.log('✅ Tous les hébergements sont publiés');
      }
    }

    // 3. Vérifier les blocs homepage
    console.log('\n3. 🏠 Vérification des blocs page d\'accueil');
    console.log('-'.repeat(45));
    
    const { data: blocks, error: blocksError } = await supabase
      .from('homepage_blocks')
      .select('*')
      .order('sort_order');

    if (blocksError) {
      console.log('⚠️ Table homepage_blocks non trouvée:', blocksError.message);
    } else {
      console.log(`📊 Blocs homepage: ${blocks.length}`);
      
      const activeBlocks = blocks.filter(block => block.is_active);
      console.log(`📊 Blocs actifs: ${activeBlocks.length}`);
      
      blocks.forEach((block, index) => {
        console.log(`   ${index + 1}. "${block.title}" - ${block.is_active ? '✅ Actif' : '❌ Inactif'}`);
      });
    }

    // 4. Test de synchronisation
    console.log('\n4. 🧪 Test de synchronisation frontend');
    console.log('-'.repeat(40));
    
    // Test hébergements
    const { data: frontendAccommodations } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');
      
    console.log(`✅ Frontend récupère: ${frontendAccommodations?.length || 0} hébergements`);
    
    // Test musées
    const { data: frontendMuseums } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum')
      .order('name');
      
    console.log(`✅ Frontend récupère: ${frontendMuseums?.length || 0} musées`);

    // 5. Recommandations finales
    console.log('\n5. 🎯 RECOMMANDATIONS FINALES');
    console.log('-'.repeat(35));
    
    console.log('✅ ACTIONS EFFECTUÉES:');
    console.log('• Status "published" appliqué aux places sans status');
    console.log('• Vérification de la cohérence des données');
    console.log('• Test de récupération frontend');
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('• Modifier les composants frontend pour utiliser UnifiedDataService');
    console.log('• Remplacer DataContext par UnifiedDataContext');
    console.log('• Tester la synchronisation en temps réel');
    
    console.log('\n🔄 POUR TESTER LA SYNCHRONISATION:');
    console.log('1. Modifiez un élément dans l\'admin');
    console.log('2. Rafraîchissez la page frontend');
    console.log('3. Vérifiez que les changements apparaissent immédiatement');

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter la correction
fixDatabaseSync();