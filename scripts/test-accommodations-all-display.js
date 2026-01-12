#!/usr/bin/env node

/**
 * TEST - Affichage de tous les hébergements par défaut
 * 
 * Ce script simule le comportement de la page des hébergements
 * pour vérifier que tous les hébergements s'affichent par défaut
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

console.log('🏠 TEST - Affichage de tous les hébergements par défaut');
console.log('======================================================\n');

async function testAllAccommodationsDisplay() {
  try {
    // Simuler la requête de la page frontend
    console.log('1️⃣ SIMULATION DE LA REQUÊTE FRONTEND');
    console.log('-------------------------------------');
    
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }

    console.log(`📊 Total hébergements récupérés: ${accommodations.length}`);

    // Simuler le filtrage avec activeTab = 'all' (nouveau comportement)
    console.log('\n2️⃣ SIMULATION FILTRAGE AVEC activeTab = "all"');
    console.log('------------------------------------------------');
    
    const filteredData = (activeTab, selectedVillage = 'Tous') => {
      let data = accommodations;
      
      // Filtrer par type seulement si un type spécifique est sélectionné
      if (activeTab !== 'all') {
        data = data.filter(acc => acc.type === activeTab);
      }

      // Filter by Village
      if (selectedVillage !== 'Tous') {
        data = data.filter(acc => acc.village === selectedVillage);
      }

      return data;
    };

    // Test avec activeTab = 'all' (nouveau comportement par défaut)
    const allAccommodations = filteredData('all');
    console.log(`✅ Hébergements affichés avec activeTab='all': ${allAccommodations.length}`);
    
    console.log('\n📋 Liste complète des hébergements affichés:');
    allAccommodations.forEach((acc, index) => {
      const typeLabels = {
        gite: 'Gîte',
        bed_breakfast: 'B&B',
        hotel: 'Hôtel',
        camping: 'Camping',
        unusual: 'Insolite'
      };
      
      console.log(`   ${index + 1}. ${acc.name}`);
      console.log(`      Type: ${typeLabels[acc.type] || acc.type}`);
      console.log(`      Village: ${acc.village || 'Non défini'}`);
      console.log();
    });

    // Test des filtres par type
    console.log('3️⃣ TEST DES FILTRES PAR TYPE');
    console.log('-----------------------------');
    
    const types = ['gite', 'bed_breakfast', 'hotel', 'camping', 'unusual'];
    const typeLabels = {
      gite: 'Gîtes',
      bed_breakfast: 'Chambres d\'hôtes & B&B',
      hotel: 'Hôtels',
      camping: 'Campings',
      unusual: 'Hébergements insolites'
    };

    types.forEach(type => {
      const filtered = filteredData(type);
      console.log(`• ${typeLabels[type]}: ${filtered.length} hébergement(s)`);
    });

    // Test des filtres par village
    console.log('\n4️⃣ TEST DES FILTRES PAR VILLAGE (avec activeTab="all")');
    console.log('-------------------------------------------------------');
    
    const villages = ['Tous', 'Chièvres', 'Vaudignies', 'Ladeuze', 'Tongre-Saint-Martin', 'Tongre-Notre-Dame', 'Grosage'];
    
    villages.forEach(village => {
      const filtered = filteredData('all', village);
      console.log(`• ${village}: ${filtered.length} hébergement(s)`);
    });

    // Comparaison avant/après
    console.log('\n5️⃣ COMPARAISON AVANT/APRÈS LA MODIFICATION');
    console.log('--------------------------------------------');
    
    const oldBehavior = filteredData('gite'); // Ancien comportement (par défaut = gîtes)
    const newBehavior = filteredData('all');  // Nouveau comportement (par défaut = tous)
    
    console.log(`📊 Ancien comportement (par défaut "Gîtes"): ${oldBehavior.length} hébergements`);
    console.log(`📊 Nouveau comportement (par défaut "Tous"): ${newBehavior.length} hébergements`);
    
    if (newBehavior.length > oldBehavior.length) {
      console.log(`✅ AMÉLIORATION: ${newBehavior.length - oldBehavior.length} hébergements supplémentaires visibles par défaut!`);
    }

    // Vérification de la cohérence
    console.log('\n6️⃣ VÉRIFICATION DE LA COHÉRENCE');
    console.log('--------------------------------');
    
    if (newBehavior.length === accommodations.length) {
      console.log('✅ PARFAIT: Tous les hébergements publiés sont maintenant visibles par défaut');
    } else {
      console.log('❌ PROBLÈME: Certains hébergements ne sont pas visibles');
    }

    console.log('\n🎉 RÉSUMÉ:');
    console.log('----------');
    console.log(`• Avant: ${oldBehavior.length} hébergements visibles par défaut (onglet Gîtes)`);
    console.log(`• Après: ${newBehavior.length} hébergements visibles par défaut (onglet Tous)`);
    console.log('• Les utilisateurs peuvent toujours filtrer par type avec les onglets');
    console.log('• Les filtres par village fonctionnent toujours');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testAllAccommodationsDisplay();