#!/usr/bin/env node

/**
 * Génère les commandes SQL pour ajouter le tri aux tables existantes
 * Vous pourrez copier-coller ces commandes dans l'éditeur SQL de Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

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

async function generateMigrationSQL() {
  console.log('🚀 Génération des commandes SQL pour le tri...\n');
  
  const tables = [
    { name: 'accommodations', nameField: 'name' },
    { name: 'events', nameField: 'title' },
    { name: 'articles', nameField: 'title' },
    { name: 'products', nameField: 'name' },
    { name: 'page_content', nameField: 'heroTitle' },
    { name: 'experiences', nameField: 'title' }
  ];
  
  let sqlCommands = [];
  sqlCommands.push('-- ===================================');
  sqlCommands.push('-- Migration pour le tri par glisser-déposer');
  sqlCommands.push('-- Copiez et collez ces commandes dans l\'éditeur SQL de Supabase');
  sqlCommands.push('-- ===================================\n');
  
  for (const table of tables) {
    const exists = await checkTableExists(table.name);
    
    if (exists) {
      const hasColumn = await checkColumnExists(table.name, 'sort_order');
      
      if (!hasColumn) {
        console.log(`✅ ${table.name}: Génération des commandes SQL`);
        
        sqlCommands.push(`-- Table: ${table.name}`);
        sqlCommands.push(`ALTER TABLE ${table.name} ADD COLUMN sort_order INTEGER DEFAULT 0;`);
        sqlCommands.push(`CREATE INDEX idx_${table.name}_sort_order ON ${table.name}(sort_order);`);
        sqlCommands.push('');
        
        // Commande d'initialisation
        sqlCommands.push(`-- Initialiser les ordres pour ${table.name}`);
        sqlCommands.push(`WITH numbered_items AS (`);
        sqlCommands.push(`    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, ${table.nameField}) as rn`);
        sqlCommands.push(`    FROM ${table.name}`);
        sqlCommands.push(`    WHERE sort_order IS NULL OR sort_order = 0`);
        sqlCommands.push(`)`);
        sqlCommands.push(`UPDATE ${table.name}`);
        sqlCommands.push(`SET sort_order = numbered_items.rn`);
        sqlCommands.push(`FROM numbered_items`);
        sqlCommands.push(`WHERE ${table.name}.id = numbered_items.id;`);
        sqlCommands.push('');
        
      } else {
        console.log(`⚠️ ${table.name}: Colonne sort_order déjà présente`);
      }
    } else {
      console.log(`❌ ${table.name}: Table non trouvée`);
    }
  }
  
  // Ajouter les triggers
  sqlCommands.push('-- ===================================');
  sqlCommands.push('-- Triggers pour assigner automatiquement sort_order');
  sqlCommands.push('-- ===================================\n');
  
  for (const table of tables) {
    const exists = await checkTableExists(table.name);
    const hasColumn = await checkColumnExists(table.name, 'sort_order');
    
    if (exists && !hasColumn) {
      sqlCommands.push(`-- Trigger pour ${table.name}`);
      sqlCommands.push(`CREATE OR REPLACE FUNCTION assign_sort_order_${table.name}()`);
      sqlCommands.push(`RETURNS TRIGGER AS $$`);
      sqlCommands.push(`BEGIN`);
      sqlCommands.push(`    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN`);
      sqlCommands.push(`        SELECT COALESCE(MAX(sort_order), 0) + 1`);
      sqlCommands.push(`        INTO NEW.sort_order`);
      sqlCommands.push(`        FROM ${table.name};`);
      sqlCommands.push(`    END IF;`);
      sqlCommands.push(`    RETURN NEW;`);
      sqlCommands.push(`END;`);
      sqlCommands.push(`$$ LANGUAGE plpgsql;`);
      sqlCommands.push('');
      sqlCommands.push(`CREATE TRIGGER trigger_assign_sort_order_${table.name}`);
      sqlCommands.push(`    BEFORE INSERT ON ${table.name}`);
      sqlCommands.push(`    FOR EACH ROW`);
      sqlCommands.push(`    EXECUTE FUNCTION assign_sort_order_${table.name}();`);
      sqlCommands.push('');
    }
  }
  
  // Écrire le fichier SQL
  const fs = await import('fs');
  const sqlContent = sqlCommands.join('\n');
  fs.writeFileSync('migration-tri-universel.sql', sqlContent);
  
  console.log('\n📄 Fichier SQL généré: migration-tri-universel.sql');
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Ouvrez Supabase Dashboard');
  console.log('2. Allez dans SQL Editor');
  console.log('3. Copiez le contenu du fichier migration-tri-universel.sql');
  console.log('4. Exécutez les commandes SQL');
  console.log('\n✅ Le tri par glisser-déposer sera alors activé !');
  
  return sqlContent;
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMigrationSQL()
    .then(() => {
      console.log('\n🎉 Génération terminée!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

export { generateMigrationSQL };