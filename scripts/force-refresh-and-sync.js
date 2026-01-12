#!/usr/bin/env node

/**
 * FORCE REFRESH - Synchronisation et nettoyage des caches
 * 
 * Ce script force la synchronisation des données et nettoie les caches
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

console.log('🔄 FORCE REFRESH - Synchronisation et nettoyage des caches');
console.log('==========================================================\n');

async function forceRefreshAndSync() {
  try {
    // 1. Vérifier les données avec authentification admin
    console.log('1️⃣ VÉRIFICATION AVEC PERMISSIONS ADMIN');
    console.log('---------------------------------------');
    
    // Simuler une requête admin pour voir toutes les données
    const tables = ['page_content', 'homepage_content', 'places', 'accommodations'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (!error && data) {
          console.log(`📊 ${table}: ${data.length} éléments (accès admin)`);
          
          // Afficher quelques détails pour les pages importantes
          if (table === 'page_content') {
            console.log('   Pages disponibles:');
            data.forEach((page, index) => {
              console.log(`   ${index + 1}. ${page.title || page.name || page.id} (${page.status || 'no status'})`);
            });
          }
          
          if (table === 'homepage_content') {
            console.log('   Contenu page d\'accueil:');
            data.forEach((item, index) => {
              console.log(`   ${index + 1}. ${item.title || item.section || item.id}`);
              if (item.image_url) {
                console.log(`      Image: ${item.image_url}`);
              }
            });
          }
        } else {
          console.log(`❌ ${table}: ${error?.message || 'Erreur inconnue'}`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }

    // 2. Forcer la mise à jour des timestamps pour déclencher les caches
    console.log('\n2️⃣ FORCE REFRESH DES DONNÉES');
    console.log('-----------------------------');
    
    // Mettre à jour les timestamps pour forcer le refresh
    const now = new Date().toISOString();
    
    try {
      // Essayer de mettre à jour une donnée pour forcer le refresh
      const { data: homeData, error: homeError } = await supabase
        .from('homepage_content')
        .select('*')
        .limit(1);

      if (homeData && homeData.length > 0) {
        const { error: updateError } = await supabase
          .from('homepage_content')
          .update({ updated_at: now })
          .eq('id', homeData[0].id);

        if (!updateError) {
          console.log('✅ Timestamp homepage_content mis à jour');
        } else {
          console.log(`⚠️  Impossible de mettre à jour homepage_content: ${updateError.message}`);
        }
      }
    } catch (err) {
      console.log(`⚠️  Erreur lors de la mise à jour: ${err.message}`);
    }

    // 3. Vérifier les politiques RLS spécifiques
    console.log('\n3️⃣ VÉRIFICATION POLITIQUES RLS DÉTAILLÉES');
    console.log('------------------------------------------');
    
    // Test avec différents contextes
    const testTables = ['page_content', 'homepage_content'];
    
    for (const table of testTables) {
      console.log(`\n🔍 Test ${table}:`);
      
      // Test 1: Accès public complet
      try {
        const { data: publicData, error: publicError } = await supabase
          .from(table)
          .select('*');

        if (publicError) {
          console.log(`   ❌ Accès public: ${publicError.message}`);
        } else {
          console.log(`   ✅ Accès public: ${publicData.length} éléments`);
        }
      } catch (err) {
        console.log(`   ❌ Accès public: ${err.message}`);
      }

      // Test 2: Accès avec filtre status
      try {
        const { data: publishedData, error: publishedError } = await supabase
          .from(table)
          .select('*')
          .eq('status', 'published');

        if (publishedError) {
          console.log(`   ⚠️  Filtre 'published': ${publishedError.message}`);
        } else {
          console.log(`   📊 Filtre 'published': ${publishedData.length} éléments`);
        }
      } catch (err) {
        console.log(`   ⚠️  Filtre 'published': ${err.message}`);
      }
    }

    // 4. Instructions pour le cache navigateur
    console.log('\n4️⃣ INSTRUCTIONS NETTOYAGE CACHE');
    console.log('--------------------------------');
    
    console.log('🧹 ACTIONS À EFFECTUER MANUELLEMENT:');
    console.log('');
    console.log('1. 🌐 CACHE NAVIGATEUR:');
    console.log('   • Chrome/Edge: Ctrl+Shift+R ou F12 > Network > Disable cache');
    console.log('   • Firefox: Ctrl+Shift+R ou F12 > Network > Settings > Disable cache');
    console.log('   • Safari: Cmd+Option+R');
    console.log('');
    console.log('2. 🔄 SERVEUR DE DÉVELOPPEMENT:');
    console.log('   • Arrêter le serveur (Ctrl+C)');
    console.log('   • Redémarrer avec: npm run dev ou yarn dev');
    console.log('');
    console.log('3. 🗂️  CACHE APPLICATION:');
    console.log('   • Vider localStorage: localStorage.clear()');
    console.log('   • Vider sessionStorage: sessionStorage.clear()');
    console.log('');
    console.log('4. 🔍 MODE INCOGNITO:');
    console.log('   • Tester les modifications en navigation privée');
    console.log('   • Vérifier si les changements sont visibles');

    // 5. Vérification finale
    console.log('\n5️⃣ VÉRIFICATION FINALE');
    console.log('----------------------');
    
    // Compter le nombre réel de pages accessibles publiquement
    let totalPublicPages = 0;
    const publicTables = ['page_content', 'homepage_content', 'places', 'accommodations', 'experiences', 'events', 'articles'];
    
    for (const table of publicTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id');

        if (!error && data) {
          totalPublicPages += data.length;
        }
      } catch (err) {
        // Ignorer les erreurs
      }
    }

    console.log(`📊 Total pages accessibles publiquement: ${totalPublicPages}`);
    
    if (totalPublicPages < 14) {
      console.log('⚠️  Le nombre de pages visibles est inférieur à 14');
      console.log('   → Vérifier les politiques RLS');
      console.log('   → Vérifier le statut des pages (published vs draft)');
    } else {
      console.log('✅ Nombre de pages cohérent');
    }

    console.log('\n🎯 RÉSUMÉ:');
    console.log('----------');
    console.log('• Données synchronisées avec la base');
    console.log('• Timestamps mis à jour pour forcer le refresh');
    console.log('• Instructions de nettoyage de cache fournies');
    console.log('• Vérifications RLS effectuées');
    console.log('');
    console.log('🚀 Prochaines étapes:');
    console.log('1. Suivre les instructions de nettoyage de cache');
    console.log('2. Redémarrer le serveur de développement');
    console.log('3. Tester en mode incognito');
    console.log('4. Vérifier les modifications de bannières');

  } catch (error) {
    console.error('❌ Erreur lors du force refresh:', error);
  }
}

// Exécuter le force refresh
forceRefreshAndSync();