#!/usr/bin/env node

/**
 * VÉRIFICATION - Répartition des hébergements par type
 * 
 * Ce script vérifie la répartition des 9 hébergements par type
 * pour comprendre pourquoi seulement 5 s'affichent sur l'onglet par défaut
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

console.log('🏠 VÉRIFICATION - Répartition des hébergements par type');
console.log('=====================================================\n');

async function checkAccommodationsByType() {
  try {
    // Récupérer tous les hébergements publiés
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('id, name, type, village, status')
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }

    console.log(`📊 Total hébergements publiés: ${accommodations.length}\n`);

    // Grouper par type
    const byType = accommodations.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    // Définir les types et leurs labels
    const typeLabels = {
      gite: 'Gîtes',
      bed_breakfast: 'Chambres d\'hôtes & B&B',
      hotel: 'Hôtels',
      camping: 'Campings',
      unusual: 'Hébergements insolites'
    };

    // Afficher la répartition
    console.log('📈 RÉPARTITION PAR TYPE:');
    console.log('========================');

    Object.entries(typeLabels).forEach(([type, label]) => {
      const items = byType[type] || [];
      const isDefault = type === 'gite';
      const icon = isDefault ? '🏠 (ONGLET PAR DÉFAUT)' : '🏨';
      
      console.log(`\n${icon} ${label}: ${items.length} hébergement(s)`);
      
      if (items.length > 0) {
        items.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.name} - ${item.village || 'Village non défini'}`);
        });
      } else {
        console.log('   (Aucun hébergement)');
      }
    });

    // Explication du problème
    console.log('\n🔍 EXPLICATION DU PROBLÈME:');
    console.log('============================');
    
    const giteCount = byType.gite?.length || 0;
    console.log(`• L'onglet par défaut "Gîtes" affiche ${giteCount} hébergement(s)`);
    console.log('• Les autres hébergements sont répartis dans les autres onglets');
    console.log('• L\'utilisateur doit cliquer sur les onglets pour voir tous les hébergements');
    
    if (giteCount === 5) {
      console.log('\n✅ CONFIRMATION: C\'est bien cela qui explique les 5 hébergements visibles par défaut!');
    }

    // Vérifier si tous les types sont représentés
    console.log('\n📋 RÉSUMÉ POUR L\'ADMIN:');
    console.log('=======================');
    
    let totalVisible = 0;
    Object.entries(typeLabels).forEach(([type, label]) => {
      const count = byType[type]?.length || 0;
      totalVisible += count;
      console.log(`• ${label}: ${count}`);
    });
    
    console.log(`• TOTAL: ${totalVisible} (doit correspondre aux 9 de l'admin)`);

    if (totalVisible === accommodations.length) {
      console.log('\n✅ COHÉRENCE CONFIRMÉE: Tous les hébergements sont bien présents, répartis par onglets');
    } else {
      console.log('\n❌ INCOHÉRENCE: Il manque des hébergements quelque part');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter la vérification
checkAccommodationsByType();