#!/usr/bin/env node

/**
 * Script pour découvrir la structure réelle de la base de données
 * Identifie les tables existantes avant d'appliquer les migrations
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

async function getTableInfo(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      return { exists: false, count: 0, sample: null };
    }
    
    return {
      exists: true,
      count: count || 0,
      sample: data?.[0] || null
    };
  } catch (error) {
    return { exists: false, count: 0, sample: null };
  }
}

async function discoverDatabase() {
  console.log('🔍 Découverte de la structure de la base de données...\n');
  
  // Tables potentielles à vérifier
  const potentialTables = [
    'accommodations',
    'places',
    'walks',
    'events',
    'team_members',
    'homepage_blocks',
    'homepage_content',
    'homepage_news',
    'homepage_favorites',
    'newsletter_subscriptions',
    'articles',
    'products',
    'page_content',
    'experiences',
    'media',
    'content_items',
    'audit_logs'
  ];
  
  const existingTables = [];
  
  console.log('📊 Vérification des tables...\n');
  
  for (const tableName of potentialTables) {
    const info = await getTableInfo(tableName);
    
    if (info.exists) {
      existingTables.push({
        name: tableName,
        count: info.count,
        sample: info.sample
      });
      
      console.log(`✅ ${tableName}: ${info.count} enregistrements`);
      
      // Afficher les colonnes de l'échantillon
      if (info.sample) {
        const columns = Object.keys(info.sample);
        console.log(`   📋 Colonnes: ${columns.join(', ')}`);
        
        // Vérifier si sort_order existe déjà
        if (columns.includes('sort_order')) {
          console.log(`   🔢 sort_order: DÉJÀ PRÉSENT`);
        } else {
          console.log(`   🔢 sort_order: À AJOUTER`);
        }
      }
      console.log('');
    } else {
      console.log(`❌ ${tableName}: N'existe pas`);
    }
  }
  
  console.log('\n📋 RÉSUMÉ DES TABLES EXISTANTES:');
  console.log('================================');
  
  existingTables.forEach(table => {
    console.log(`• ${table.name} (${table.count} enregistrements)`);
  });
  
  // Analyser les types dans la table places
  if (existingTables.find(t => t.name === 'places')) {
    console.log('\n🏛️ ANALYSE DE LA TABLE PLACES:');
    console.log('==============================');
    
    try {
      const { data: placeTypes } = await supabase
        .from('places')
        .select('type')
        .not('type', 'is', null);
      
      if (placeTypes) {
        const typeCount = {};
        placeTypes.forEach(place => {
          typeCount[place.type] = (typeCount[place.type] || 0) + 1;
        });
        
        Object.entries(typeCount).forEach(([type, count]) => {
          console.log(`• ${type}: ${count} éléments`);
        });
      }
    } catch (error) {
      console.log('❌ Erreur lors de l\'analyse des types de places');
    }
  }
  
  // Recommandations pour la migration
  console.log('\n💡 RECOMMANDATIONS POUR LA MIGRATION:');
  console.log('=====================================');
  
  const tablesToMigrate = existingTables.filter(table => 
    ['accommodations', 'places', 'events'].includes(table.name)
  );
  
  if (tablesToMigrate.length > 0) {
    console.log('✅ Tables principales trouvées pour le tri:');
    tablesToMigrate.forEach(table => {
      console.log(`   • ${table.name}`);
    });
  } else {
    console.log('⚠️ Aucune table principale trouvée pour le tri');
  }
  
  // Tables manquantes importantes
  const missingImportantTables = ['team_members', 'walks'].filter(table => 
    !existingTables.find(t => t.name === table)
  );
  
  if (missingImportantTables.length > 0) {
    console.log('\n⚠️ Tables manquantes (seront ignorées):');
    missingImportantTables.forEach(table => {
      console.log(`   • ${table}`);
    });
  }
  
  return existingTables;
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverDatabase()
    .then((tables) => {
      console.log('\n🎉 Découverte terminée!');
      console.log(`📊 ${tables.length} tables trouvées au total`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors de la découverte:', error);
      process.exit(1);
    });
}

export { discoverDatabase, checkTableExists, getTableInfo };