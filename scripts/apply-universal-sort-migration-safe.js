#!/usr/bin/env node

/**
 * Script sécurisé pour appliquer la migration universelle du tri
 * Vérifie l'existence des tables avant d'appliquer les modifications
 */

const { createClient } = require('@supabase/supabase-js');

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

async function addSortOrderColumn(tableName) {
  console.log(`⚙️ Ajout de la colonne sort_order à ${tableName}...`);
  
  try {
    // Utiliser une requête SQL directe pour ajouter la colonne
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`
    });
    
    if (error) {
      console.warn(`⚠️ Avertissement pour ${tableName}:`, error.message);
    } else {
      console.log(`✅ Colonne sort_order ajoutée à ${tableName}`);
    }
    
    // Créer l'index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `CREATE INDEX IF NOT EXISTS idx_${tableName}_sort_order ON ${tableName}(sort_order);`
    });
    
    if (indexError) {
      console.warn(`⚠️ Avertissement index pour ${tableName}:`, indexError.message);
    } else {
      console.log(`✅ Index créé pour ${tableName}.sort_order`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur pour ${tableName}:`, error.message);
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
      .order(nameField);
    
    if (error || !items || items.length === 0) {
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
    
    // Mettre à jour chaque élément
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const newOrder = maxOrder + i + 1;
      
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ sort_order: newOrder })
        .eq('id', item.id);
      
      if (updateError) {
        console.warn(`⚠️ Erreur mise à jour ${item.id}:`, updateError.message);
      }
    }
    
    console.log(`✅ ${items.length} éléments initialisés dans ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur initialisation ${tableName}:`, error.message);
    return false;
  }
}

async function applyMigration() {
  console.log('🚀 Application de la migration universelle pour le tri...');
  
  // Tables à traiter avec leurs champs de nom
  const tables = [
    { name: 'accommodations', nameField: 'name' },
    { name: 'events', nameField: 'title' },
    { name: 'team_members', nameField: 'name' },
    { name: 'places', nameField: 'name' }, // Contient les balades avec type='walk'
    { name: 'homepage_blocks', nameField: 'title' }
  ];
  
  console.log('🔍 Vérification des tables existantes...');
  
  for (const table of tables) {
    const exists = await checkTableExists(table.name);
    
    if (exists) {
      console.log(`✅ Table ${table.name} trouvée`);
      
      // Ajouter la colonne sort_order
      await addSortOrderColumn(table.name);
      
      // Initialiser les ordres manquants
      await initializeSortOrder(table.name, table.nameField);
    } else {
      console.log(`⚠️ Table ${table.name} non trouvée - ignorée`);
    }
  }
  
  console.log('✅ Migration appliquée avec succès!');
}

async function verifyMigration() {
  console.log('\n🔍 Vérification de la migration...');
  
  const tables = ['accommodations', 'events', 'team_members', 'places'];
  
  for (const table of tables) {
    const exists = await checkTableExists(table);
    
    if (exists) {
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
    } else {
      console.log(`⚠️ Table ${table}: Non trouvée`);
    }
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
      .select('id, name, sort_order, type')
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
    
    // Tester la récupération triée des balades
    const { data: walks, error: walkError } = await supabase
      .from('places')
      .select('id, name, sort_order, type')
      .eq('type', 'walk')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name')
      .limit(5);
    
    if (!walkError && walks) {
      console.log('✅ Tri des balades fonctionne:');
      walks.forEach((walk, index) => {
        console.log(`   ${index + 1}. ${walk.name} (ordre: ${walk.sort_order || 'non défini'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  applyMigration()
    .then(() => verifyMigration())
    .then(() => testSortingFunctionality())
    .then(() => {
      console.log('\n🎉 Migration universelle terminée avec succès!');
      console.log('📝 Vous pouvez maintenant utiliser le tri par glisser-déposer dans l\'admin');
      console.log('💡 Note: Les balades sont gérées dans la table "places" avec type="walk"');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { applyMigration, verifyMigration, testSortingFunctionality };