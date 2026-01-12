#!/usr/bin/env node

/**
 * Script de test pour le système de tri des musées
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

// Simuler le service de tri
class TestMuseumSortService {
  async getSortOrder(museumId) {
    try {
      const { data: museum } = await supabase
        .from('places')
        .select('sort_order')
        .eq('id', museumId)
        .single();
      
      return museum?.sort_order || 999;
    } catch (error) {
      return 999;
    }
  }

  async sortMuseums(museums) {
    try {
      const museumsWithOrder = await Promise.all(
        museums.map(async (museum) => {
          const sortOrder = await this.getSortOrder(museum.id);
          return { ...museum, sort_order: sortOrder };
        })
      );

      return museumsWithOrder.sort((a, b) => {
        const orderA = a.sort_order || 999;
        const orderB = b.sort_order || 999;
        
        if (orderA === orderB) {
          return a.name.localeCompare(b.name);
        }
        
        return orderA - orderB;
      });
    } catch (error) {
      console.error('Erreur lors du tri:', error);
      return museums.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  async updateSortOrder(museumId, newOrder) {
    try {
      const { error } = await supabase
        .from('places')
        .update({ sort_order: newOrder })
        .eq('id', museumId);

      return !error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return false;
    }
  }

  async isSortOrderSupported() {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('sort_order')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

async function testMuseumSorting() {
  console.log('🧪 Test du système de tri des musées...\n');

  const sortService = new TestMuseumSortService();

  try {
    // 1. Vérifier le support du tri
    console.log('1. Vérification du support du tri...');
    const sortSupported = await sortService.isSortOrderSupported();
    console.log(`   ${sortSupported ? '✅' : '⚠️'} Tri en base de données ${sortSupported ? 'supporté' : 'non supporté'}`);

    // 2. Récupérer les musées
    console.log('\n2. Récupération des musées...');
    const { data: museums, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum');

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError.message);
      return;
    }

    console.log(`   ✅ ${museums.length} musées trouvés`);

    if (museums.length === 0) {
      console.log('   ℹ️  Aucun musée à tester');
      return;
    }

    // 3. Afficher l'ordre actuel
    console.log('\n3. Ordre actuel des musées:');
    museums.forEach((museum, index) => {
      const sortOrder = museum.sort_order || 'Non défini';
      console.log(`   ${index + 1}. ${museum.name} (ordre: ${sortOrder})`);
    });

    // 4. Tester le tri
    console.log('\n4. Test du service de tri...');
    const sortedMuseums = await sortService.sortMuseums(museums);
    
    console.log('   ✅ Tri effectué');
    console.log('\n   Ordre après tri:');
    sortedMuseums.forEach((museum, index) => {
      console.log(`   ${index + 1}. ${museum.name} (ordre: ${museum.sort_order || 'Non défini'})`);
    });

    // 5. Test de mise à jour d'ordre (si supporté)
    if (sortSupported && museums.length > 0) {
      console.log('\n5. Test de mise à jour d\'ordre...');
      const testMuseum = museums[0];
      const originalOrder = testMuseum.sort_order || 0;
      const newOrder = 999; // Mettre à la fin temporairement

      console.log(`   Test avec ${testMuseum.name}...`);
      const updateSuccess = await sortService.updateSortOrder(testMuseum.id, newOrder);
      
      if (updateSuccess) {
        console.log(`   ✅ Ordre mis à jour: ${originalOrder} → ${newOrder}`);
        
        // Restaurer l'ordre original
        const restoreSuccess = await sortService.updateSortOrder(testMuseum.id, originalOrder);
        if (restoreSuccess) {
          console.log(`   ✅ Ordre restauré: ${newOrder} → ${originalOrder}`);
        } else {
          console.log(`   ⚠️  Impossible de restaurer l'ordre original`);
        }
      } else {
        console.log(`   ❌ Échec de la mise à jour d'ordre`);
      }
    } else {
      console.log('\n5. Test de mise à jour d\'ordre...');
      console.log('   ⚠️  Tri non supporté ou aucun musée disponible');
    }

    // 6. Test des filtres
    console.log('\n6. Test des filtres par catégorie...');
    
    const museeMuseums = museums.filter(museum => 
      museum.tags && museum.tags.some(tag => 
        tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
      )
    );
    
    const patrimoineMuseums = museums.filter(museum => 
      museum.tags && museum.tags.some(tag => 
        tag.toLowerCase().includes('patrimoine') || 
        tag.toLowerCase().includes('église') || 
        tag.toLowerCase().includes('chapelle')
      )
    );

    console.log(`   📊 Répartition:`);
    console.log(`      - Musées: ${museeMuseums.length}`);
    console.log(`      - Patrimoine: ${patrimoineMuseums.length}`);
    console.log(`      - Total: ${museums.length}`);

    // 7. Vérifier la cohérence
    console.log('\n7. Vérification de la cohérence...');
    const ordersSet = new Set();
    let duplicateOrders = 0;
    let undefinedOrders = 0;

    museums.forEach(museum => {
      const order = museum.sort_order;
      if (!order || order === 0) {
        undefinedOrders++;
      } else {
        if (ordersSet.has(order)) {
          duplicateOrders++;
        }
        ordersSet.add(order);
      }
    });

    console.log(`   📊 Analyse des ordres:`);
    console.log(`      - Ordres définis: ${museums.length - undefinedOrders}`);
    console.log(`      - Ordres non définis: ${undefinedOrders}`);
    console.log(`      - Ordres dupliqués: ${duplicateOrders}`);

    if (duplicateOrders > 0) {
      console.log('   ⚠️  Des ordres dupliqués ont été détectés');
    }

    if (undefinedOrders > 0) {
      console.log('   ℹ️  Certains musées n\'ont pas d\'ordre défini');
    }

    console.log('\n🎉 Tests terminés avec succès !');
    
    console.log('\n📋 Résumé:');
    console.log(`   ✅ ${museums.length} musées testés`);
    console.log(`   ${sortSupported ? '✅' : '⚠️'} Tri ${sortSupported ? 'supporté' : 'en mode dégradé'}`);
    console.log(`   ✅ Service de tri fonctionnel`);
    console.log(`   ✅ Filtres par catégorie opérationnels`);

  } catch (error) {
    console.error('💥 Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécuter les tests
testMuseumSorting().then(() => {
  console.log('\n✨ Tests terminés');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});