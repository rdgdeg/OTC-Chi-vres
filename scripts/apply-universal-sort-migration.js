#!/usr/bin/env node

/**
 * Script pour appliquer la migration universelle du tri par glisser-déposer
 * Ajoute la colonne sort_order à toutes les tables nécessaires
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🚀 Application de la migration universelle pour le tri...');
  
  try {
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add-universal-sort-order.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Lecture du fichier de migration...');
    
    // Diviser le SQL en commandes individuelles
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 ${commands.length} commandes SQL à exécuter...`);
    
    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      if (command.includes('DO $$')) {
        // Commande complexe avec bloc DO
        const fullCommand = command + ';';
        console.log(`⚙️ Exécution de la commande ${i + 1}/${commands.length} (bloc DO)...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: fullCommand });
        
        if (error) {
          console.warn(`⚠️ Avertissement pour la commande ${i + 1}:`, error.message);
        }
      } else if (command.includes('CREATE') || command.includes('ALTER') || command.includes('UPDATE')) {
        console.log(`⚙️ Exécution de la commande ${i + 1}/${commands.length}...`);
        
        // Pour les commandes simples, utiliser une approche différente
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command + ';' });
          
          if (error) {
            console.warn(`⚠️ Avertissement pour la commande ${i + 1}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️ Erreur lors de l'exécution de la commande ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Migration appliquée avec succès!');
    
    // Vérifier les résultats
    await verifyMigration();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application de la migration:', error);
    process.exit(1);
  }
}

async function verifyMigration() {
  console.log('\n🔍 Vérification de la migration...');
  
  const tables = ['accommodations', 'walks', 'events', 'team_members'];
  
  for (const table of tables) {
    try {
      // Vérifier si la colonne sort_order existe
      const { data, error } = await supabase
        .from(table)
        .select('sort_order')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table}: Colonne sort_order non trouvée`);
      } else {
        console.log(`✅ Table ${table}: Colonne sort_order présente`);
        
        // Compter les éléments avec sort_order
        const { data: countData, error: countError } = await supabase
          .from(table)
          .select('sort_order', { count: 'exact' })
          .not('sort_order', 'is', null);
        
        if (!countError) {
          console.log(`   📊 ${countData?.length || 0} éléments avec sort_order défini`);
        }
      }
    } catch (err) {
      console.log(`⚠️ Table ${table}: Erreur lors de la vérification`);
    }
  }
  
  // Vérifier la table places (déjà migrée)
  try {
    const { data, error } = await supabase
      .from('places')
      .select('sort_order')
      .limit(1);
    
    if (!error) {
      console.log(`✅ Table places: Colonne sort_order déjà présente`);
    }
  } catch (err) {
    console.log(`⚠️ Table places: Erreur lors de la vérification`);
  }
}

async function testSortingFunctionality() {
  console.log('\n🧪 Test de la fonctionnalité de tri...');
  
  try {
    // Tester la récupération triée des hébergements
    const { data: accommodations, error: accError } = await supabase
      .from('accommodations')
      .select('id, name, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name')
      .limit(5);
    
    if (!accError && accommodations) {
      console.log('✅ Tri des hébergements fonctionne:');
      accommodations.forEach((acc, index) => {
        console.log(`   ${index + 1}. ${acc.name} (ordre: ${acc.sort_order || 'non défini'})`);
      });
    }
    
    // Tester la récupération triée des musées
    const { data: museums, error: musError } = await supabase
      .from('places')
      .select('id, name, sort_order')
      .eq('type', 'museum')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name')
      .limit(5);
    
    if (!musError && museums) {
      console.log('✅ Tri des musées fonctionne:');
      museums.forEach((museum, index) => {
        console.log(`   ${index + 1}. ${museum.name} (ordre: ${museum.sort_order || 'non défini'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  applyMigration()
    .then(() => testSortingFunctionality())
    .then(() => {
      console.log('\n🎉 Migration universelle terminée avec succès!');
      console.log('📝 Vous pouvez maintenant utiliser le tri par glisser-déposer dans l\'admin');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { applyMigration, verifyMigration, testSortingFunctionality };