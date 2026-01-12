#!/usr/bin/env node

/**
 * DIAGNOSTIC - Problèmes de synchronisation pages et bannières
 * 
 * Ce script vérifie :
 * 1. Le nombre de pages en base vs affichées
 * 2. Les bannières et leur synchronisation
 * 3. Les problèmes de cache potentiels
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

console.log('🔍 DIAGNOSTIC - Problèmes de synchronisation pages et bannières');
console.log('================================================================\n');

async function diagnosePagesSync() {
  try {
    // 1. Vérifier les pages en base
    console.log('1️⃣ VÉRIFICATION DES PAGES EN BASE');
    console.log('----------------------------------');
    
    // Vérifier différentes tables qui pourraient contenir des pages
    const tables = [
      'page_content',
      'homepage_content', 
      'places',
      'accommodations',
      'experiences',
      'events',
      'articles'
    ];

    let totalPages = 0;
    const pagesByTable = {};

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' });

        if (!error && data) {
          pagesByTable[table] = {
            count: data.length,
            data: data.slice(0, 3) // Échantillon
          };
          totalPages += data.length;
          console.log(`📊 ${table}: ${data.length} éléments`);
        } else if (error) {
          console.log(`⚠️  ${table}: Table non accessible (${error.message})`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Erreur (${err.message})`);
      }
    }

    console.log(`\n📈 TOTAL ESTIMÉ: ${totalPages} éléments dans toutes les tables`);

    // 2. Vérifier spécifiquement les pages de contenu
    console.log('\n2️⃣ VÉRIFICATION PAGES DE CONTENU SPÉCIFIQUES');
    console.log('----------------------------------------------');

    // Vérifier page_content si elle existe
    if (pagesByTable.page_content) {
      console.log('📄 Contenu des pages (page_content):');
      pagesByTable.page_content.data.forEach((page, index) => {
        console.log(`   ${index + 1}. ${page.title || page.name || page.id}`);
        console.log(`      Slug: ${page.slug || 'Non défini'}`);
        console.log(`      Status: ${page.status || 'Non défini'}`);
        console.log(`      Modifié: ${page.updated_at ? new Date(page.updated_at).toLocaleDateString('fr-FR') : 'Non défini'}`);
        console.log();
      });
    }

    // 3. Vérifier les bannières/images
    console.log('3️⃣ VÉRIFICATION DES BANNIÈRES');
    console.log('------------------------------');

    // Vérifier dans homepage_content
    if (pagesByTable.homepage_content) {
      console.log('🖼️  Bannières page d\'accueil (homepage_content):');
      pagesByTable.homepage_content.data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title || item.section || item.id}`);
        if (item.image_url || item.featured_image) {
          console.log(`      Image: ${item.image_url || item.featured_image}`);
        }
        if (item.content) {
          const contentPreview = typeof item.content === 'string' 
            ? item.content.substring(0, 100) + '...'
            : JSON.stringify(item.content).substring(0, 100) + '...';
          console.log(`      Contenu: ${contentPreview}`);
        }
        console.log(`      Modifié: ${item.updated_at ? new Date(item.updated_at).toLocaleDateString('fr-FR') : 'Non défini'}`);
        console.log();
      });
    }

    // Vérifier dans page_content pour les bannières
    if (pagesByTable.page_content) {
      const pagesWithImages = pagesByTable.page_content.data.filter(page => 
        page.featured_image || page.banner_image || page.hero_image
      );
      
      if (pagesWithImages.length > 0) {
        console.log('🖼️  Pages avec bannières (page_content):');
        pagesWithImages.forEach((page, index) => {
          console.log(`   ${index + 1}. ${page.title || page.name}`);
          console.log(`      Image: ${page.featured_image || page.banner_image || page.hero_image}`);
          console.log(`      Modifié: ${page.updated_at ? new Date(page.updated_at).toLocaleDateString('fr-FR') : 'Non défini'}`);
          console.log();
        });
      }
    }

    // 4. Vérifier les politiques RLS
    console.log('4️⃣ VÉRIFICATION ACCÈS ET POLITIQUES');
    console.log('------------------------------------');

    // Test d'accès public vs authentifié pour chaque table
    for (const table of Object.keys(pagesByTable)) {
      try {
        // Test accès public
        const { data: publicData, error: publicError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (publicError) {
          console.log(`🔒 ${table}: Accès public BLOQUÉ (${publicError.message})`);
        } else {
          console.log(`✅ ${table}: Accès public OK (${publicData?.length || 0} éléments visibles)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Erreur d'accès (${err.message})`);
      }
    }

    // 5. Vérifier les modifications récentes
    console.log('\n5️⃣ VÉRIFICATION MODIFICATIONS RÉCENTES');
    console.log('---------------------------------------');

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const [tableName, tableInfo] of Object.entries(pagesByTable)) {
      if (tableInfo.data && tableInfo.data.length > 0) {
        const recentUpdates = tableInfo.data.filter(item => 
          item.updated_at && new Date(item.updated_at) > yesterday
        );

        if (recentUpdates.length > 0) {
          console.log(`🕒 ${tableName}: ${recentUpdates.length} modification(s) récente(s)`);
          recentUpdates.forEach(item => {
            console.log(`   - ${item.title || item.name || item.id} (${new Date(item.updated_at).toLocaleString('fr-FR')})`);
          });
        } else {
          console.log(`⏰ ${tableName}: Aucune modification récente`);
        }
      }
    }

    // 6. Recommandations
    console.log('\n6️⃣ DIAGNOSTIC ET RECOMMANDATIONS');
    console.log('----------------------------------');

    console.log('🔍 PROBLÈMES IDENTIFIÉS:');
    
    if (totalPages < 14) {
      console.log(`❌ Nombre de pages insuffisant: ${totalPages} trouvées vs 14 attendues`);
      console.log('   → Vérifier si toutes les tables sont accessibles');
      console.log('   → Vérifier les politiques RLS');
    } else {
      console.log(`✅ Nombre de pages cohérent: ${totalPages} éléments trouvés`);
    }

    // Vérifier les modifications récentes pour les bannières
    const hasRecentBannerUpdates = Object.values(pagesByTable).some(table => 
      table.data && table.data.some(item => 
        item.updated_at && new Date(item.updated_at) > yesterday &&
        (item.featured_image || item.banner_image || item.hero_image || item.image_url)
      )
    );

    if (!hasRecentBannerUpdates) {
      console.log('❌ Aucune modification récente de bannière détectée');
      console.log('   → Les modifications pourraient ne pas être sauvegardées');
      console.log('   → Vérifier les permissions d\'écriture');
    } else {
      console.log('✅ Modifications récentes de bannières détectées');
    }

    console.log('\n🛠️  ACTIONS RECOMMANDÉES:');
    console.log('1. Vider le cache du navigateur (Ctrl+F5)');
    console.log('2. Vérifier les politiques RLS pour toutes les tables');
    console.log('3. Tester les modifications en mode incognito');
    console.log('4. Vérifier les logs d\'erreur dans la console navigateur');
    console.log('5. Redémarrer le serveur de développement si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exécuter le diagnostic
diagnosePagesSync();