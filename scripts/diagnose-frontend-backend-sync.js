#!/usr/bin/env node

/**
 * Script de diagnostic pour vérifier la synchronisation frontend-backend
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

async function diagnoseFrontendBackendSync() {
  console.log('🔍 DIAGNOSTIC - Synchronisation Frontend-Backend');
  console.log('='.repeat(60));

  try {
    // 1. Vérifier les hébergements dans Supabase
    console.log('\n1. 📊 HÉBERGEMENTS DANS SUPABASE');
    console.log('-'.repeat(40));
    
    const { data: supabaseAccommodations, error: supabaseError } = await supabase
      .from('accommodations')
      .select('*')
      .order('name');

    if (supabaseError) {
      console.error('❌ Erreur Supabase:', supabaseError);
      return;
    }

    console.log(`📈 Total hébergements Supabase: ${supabaseAccommodations.length}`);
    
    supabaseAccommodations.forEach((acc, index) => {
      console.log(`   ${index + 1}. "${acc.name}" (${acc.type}) - Status: ${acc.status}`);
      console.log(`      ID: ${acc.id}`);
      console.log(`      Village: ${acc.village || 'Non défini'}`);
      console.log(`      Capacité: ${acc.capacity} personnes`);
      console.log(`      Image: ${acc.featured_image ? '✅ Oui' : '❌ Non'}`);
      console.log(`      Créé: ${new Date(acc.created_at).toLocaleDateString()}`);
      console.log('');
    });

    // 2. Vérifier les musées/patrimoine dans Supabase
    console.log('\n2. 🏛️ MUSÉES & PATRIMOINE DANS SUPABASE');
    console.log('-'.repeat(40));
    
    const { data: supabasePlaces, error: placesError } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum')
      .order('name');

    if (placesError) {
      console.log('⚠️ Table places non trouvée ou erreur:', placesError.message);
    } else {
      console.log(`📈 Total musées Supabase: ${supabasePlaces.length}`);
      
      supabasePlaces.forEach((place, index) => {
        console.log(`   ${index + 1}. "${place.name}"`);
        console.log(`      ID: ${place.id}`);
        console.log(`      Status: ${place.status || 'Non défini'}`);
        console.log('');
      });
    }

    // 3. Vérifier les blocs de page d'accueil
    console.log('\n3. 🏠 BLOCS PAGE D\'ACCUEIL DANS SUPABASE');
    console.log('-'.repeat(40));
    
    const { data: homepageBlocks, error: blocksError } = await supabase
      .from('homepage_blocks')
      .select('*')
      .order('sort_order');

    if (blocksError) {
      console.log('⚠️ Table homepage_blocks non trouvée:', blocksError.message);
    } else {
      console.log(`📈 Total blocs homepage: ${homepageBlocks.length}`);
      
      homepageBlocks.forEach((block, index) => {
        console.log(`   ${index + 1}. "${block.title}"`);
        console.log(`      Type: ${block.type}`);
        console.log(`      Actif: ${block.is_active ? '✅' : '❌'}`);
        console.log('');
      });
    }

    // 4. Analyser les problèmes de synchronisation
    console.log('\n4. 🔍 ANALYSE DES PROBLÈMES DE SYNCHRONISATION');
    console.log('-'.repeat(50));

    // Vérifier les hébergements publiés vs tous
    const publishedAccommodations = supabaseAccommodations.filter(acc => acc.status === 'published');
    console.log(`📊 Hébergements publiés: ${publishedAccommodations.length}/${supabaseAccommodations.length}`);
    
    if (publishedAccommodations.length < supabaseAccommodations.length) {
      console.log('⚠️ PROBLÈME: Certains hébergements ne sont pas publiés');
      const unpublished = supabaseAccommodations.filter(acc => acc.status !== 'published');
      unpublished.forEach(acc => {
        console.log(`   - "${acc.name}" (Status: ${acc.status})`);
      });
    }

    // Vérifier les images manquantes
    const withoutImages = supabaseAccommodations.filter(acc => !acc.featured_image);
    if (withoutImages.length > 0) {
      console.log(`⚠️ PROBLÈME: ${withoutImages.length} hébergements sans image`);
      withoutImages.forEach(acc => {
        console.log(`   - "${acc.name}"`);
      });
    }

    // 5. Recommandations
    console.log('\n5. 🎯 RECOMMANDATIONS POUR LA SYNCHRONISATION');
    console.log('-'.repeat(50));
    
    console.log('✅ ACTIONS À EFFECTUER:');
    
    if (publishedAccommodations.length < supabaseAccommodations.length) {
      console.log('• Publier tous les hébergements: UPDATE accommodations SET status = \'published\';');
    }
    
    if (withoutImages.length > 0) {
      console.log('• Ajouter des images aux hébergements sans image');
    }
    
    console.log('• Vérifier que le frontend utilise bien AccommodationService.getPublishedAccommodations()');
    console.log('• S\'assurer que les composants frontend rechargent les données après modification');
    console.log('• Implémenter un système de cache avec invalidation automatique');

    // 6. Test de récupération frontend
    console.log('\n6. 🧪 TEST DE RÉCUPÉRATION FRONTEND');
    console.log('-'.repeat(40));
    
    console.log('Test de la méthode getPublishedAccommodations():');
    const { data: frontendData, error: frontendError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');
      
    if (frontendError) {
      console.error('❌ Erreur frontend:', frontendError);
    } else {
      console.log(`✅ Frontend récupère: ${frontendData.length} hébergements`);
      
      if (frontendData.length !== publishedAccommodations.length) {
        console.log('❌ DIVERGENCE DÉTECTÉE!');
        console.log(`   Backend: ${supabaseAccommodations.length} total, ${publishedAccommodations.length} publiés`);
        console.log(`   Frontend: ${frontendData.length} récupérés`);
      } else {
        console.log('✅ Synchronisation OK pour les hébergements publiés');
      }
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le diagnostic
diagnoseFrontendBackendSync();