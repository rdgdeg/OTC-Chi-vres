#!/usr/bin/env node

/**
 * Migration minimale pour le tri - ne traite que les tables existantes
 * Se concentre sur accommodations et places (les plus importantes)
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

async function checkColumnExists(tableName, columnName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .limit(1);
    return !error;
  } catch (error) {
    return false;
  }
}

async function addSortOrderToTable(tableName) {
  console.log(`⚙️ Traitement de la table ${tableName}...`);
  
  // Vérifier si la colonne existe déjà
  const columnExists = await checkColumnExists(tableName, 'sort_order');
  
  if (columnExists) {
    console.log(`✅ ${tableName}: Colonne sort_order déjà présente`);
    return true;
  }
  
  try {
    // Ajouter la colonne sort_order
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE ${tableName} ADD COLUMN sort_order INTEGER DEFAULT 0;`
    });
    
    if (alterError) {
      console.warn(`⚠️ ${tableName}: Erreur ajout colonne -`, alterError.message);
      return false;
    }
    
    console.log(`✅ ${tableName}: Colonne sort_order ajoutée`);
    
    // Créer l'index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `CREATE INDEX IF NOT EXISTS idx_${tableName}_sort_order ON ${tableName}(sort_order);`
    });
    
    if (indexError) {
      console.warn(`⚠️ ${tableName}: Erreur création index -`, indexError.message);
    } else {
      console.log(`✅ ${tableName}: Index créé`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ ${tableName}: Erreur -`, error.message);
    return false;
  }
}

async function initializeSortOrder(tableName, nameField = 'name') {
  console.log(`📊 Initialisation des ordres pour ${tableName}...`);
  
  try {
    // Récupérer les éléments sans sort_order
    const { data: items, error } = await supabase
      .from(tableName)
      .select(`id, ${nameField}, sort_order`)
      .or('sort_order.is.null,sort_order.eq.0')
      .order(nameField)
      .limit(100); // Limiter pour éviter les timeouts
    
    if (error) {
      console.warn(`⚠️ ${tableName}: Erreur récupération -`, error.message);
      return false;
    }
    
    if (!items || items.length === 0) {
      console.log(`✅ ${tableName}: Tous les éléments ont déjà un ordre`);
      return true;
    }
    
    console.log(`📝 ${items.length} éléments à initialiser dans ${tableName}`);
    
    // Obtenir le plus grand sort_order existant
    const { data: maxData } = await supabase
      .from(tableName)
      .select('sort_order')
      .not('sort_order', 'is', null)
      .order('sort_order', { ascending: false })
      .limit(1);
    
    const maxOrder = maxData?.[0]?.sort_order || 0;
    
    // Mettre à jour par petits lots
    const batchSize = 10;
    let successCount = 0;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      for (const item of batch) {
        const newOrder = maxOrder + successCount + 1;
        
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ sort_order: newOrder })
          .eq('id', item.id);
        
        if (!updateError) {
          successCount++;
        } else {
          console.warn(`⚠️ Erreur mise à jour ${item.id}:`, updateError.message);
        }
      }
      
      // Petite pause entre les lots
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ ${successCount}/${items.length} éléments initialisés dans ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur initialisation ${tableName}:`, error.message);
    return false;
  }
}

async function applyMinimalMigration() {
  console.log('🚀 Application de la migration minimale pour le tri...\n');
  
  // Tables essentielles à vérifier
  const coreTables = [
    { name: 'accommodations', nameField: 'name' },
    { name: 'places', nameField: 'name' },
    { name: 'events', nameField: 'title' }
  ];
  
  const processedTables = [];
  
  for (const table of coreTables) {
    const exists = await checkTableExists(table.name);
    
    if (exists) {
      console.log(`✅ Table ${table.name} trouvée`);
      
      const success = await addSortOrderToTable(table.name);
      if (success) {
        await initializeSortOrder(table.name, table.nameField);
        processedTables.push(table.name);
      }
    } else {
      console.log(`⚠️ Table ${table.name} non trouvée - ignorée`);
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  if (processedTables.length === 0) {
    console.log('❌ Aucune table n\'a pu être traitée');
    return false;
  }
  
  console.log(`✅ Migration appliquée avec succès sur ${processedTables.length} table(s):`);
  processedTables.forEach(table => console.log(`   • ${table}`));
  
  return true;
}

async function testMinimalSorting() {
  console.log('\n🧪 Test de la fonctionnalité de tri...\n');
  
  // Tester accommodations
  const accommodationsExists = await checkTableExists('accommodations');
  if (accommodationsExists) {
    try {
      const { data: accommodations, error } = await supabase
        .from('accommodations')
        .select('id, name, sort_order')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name')
        .limit(3);
      
      if (!error && accommodations) {
        console.log('✅ Tri des hébergements:');
        accommodations.forEach((acc, index) => {
          console.log(`   ${index + 1}. ${acc.name} (ordre: ${acc.sort_order || 'non défini'})`);
        });
      }
    } catch (error) {
      console.log('⚠️ Erreur test hébergements:', error.message);
    }
  }
  
  // Tester places (musées)
  const placesExists = await checkTableExists('places');
  if (placesExists) {
    try {
      const { data: museums, error } = await supabase
        .from('places')
        .select('id, name, sort_order, type')
        .eq('type', 'museum')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name')
        .limit(3);
      
      if (!error && museums) {
        console.log('✅ Tri des musées:');
        museums.forEach((museum, index) => {
          console.log(`   ${index + 1}. ${museum.name} (ordre: ${museum.sort_order || 'non défini'})`);
        });
      }
    } catch (error) {
      console.log('⚠️ Erreur test musées:', error.message);
    }
  }
  
  // Tester events
  const eventsExists = await checkTableExists('events');
  if (eventsExists) {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('id, title, sort_order')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('title')
        .limit(3);
      
      if (!error && events) {
        console.log('✅ Tri des événements:');
        events.forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.title} (ordre: ${event.sort_order || 'non défini'})`);
        });
      }
    } catch (error) {
      console.log('⚠️ Erreur test événements:', error.message);
    }
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  applyMinimalMigration()
    .then((success) => {
      if (success) {
        return testMinimalSorting();
      }
    })
    .then(() => {
      console.log('\n🎉 Migration minimale terminée!');
      console.log('📝 Le tri par glisser-déposer est maintenant disponible pour les tables existantes');
      console.log('💡 Utilisez d\'abord le script discover-database-structure.js pour voir toutes vos tables');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export { applyMinimalMigration, testMinimalSorting };