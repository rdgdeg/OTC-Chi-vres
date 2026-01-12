#!/usr/bin/env node

/**
 * Script pour exécuter la migration simplifiée du tri des lieux
 * Compatible avec les contraintes Supabase
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

async function runSimpleSortMigration() {
  console.log('🚀 Exécution de la migration simplifiée pour le tri des lieux...\n');

  try {
    // 1. Vérifier si la colonne sort_order existe déjà
    console.log('1. Vérification de la structure existante...');
    const { data: existingMuseums, error: checkError } = await supabase
      .from('places')
      .select('id, name, sort_order')
      .eq('type', 'museum')
      .limit(1);

    if (checkError && checkError.message.includes('column "sort_order" does not exist')) {
      console.log('   ⚠️  La colonne sort_order n\'existe pas en base de données');
      console.log('   💡 Le système utilisera le mode dégradé avec tri local');
    } else {
      console.log('   ✅ Colonne sort_order accessible');
    }

    // 2. Récupérer tous les musées
    console.log('\n2. Récupération des musées...');
    const { data: museums, error: fetchError } = await supabase
      .from('places')
      .select('id, name, sort_order, created_at')
      .eq('type', 'museum')
      .order('name');

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError.message);
      return;
    }

    console.log(`   ✅ ${museums.length} musées trouvés`);

    if (museums.length === 0) {
      console.log('   ℹ️  Aucun musée à traiter');
      return;
    }

    // 3. Initialiser les valeurs de sort_order
    console.log('\n3. Initialisation des valeurs de tri...');
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < museums.length; i++) {
      const museum = museums[i];
      const newSortOrder = i + 1;

      // Vérifier si le musée a déjà un ordre défini
      if (museum.sort_order && museum.sort_order > 0) {
        console.log(`   ℹ️  ${museum.name} -> ordre déjà défini (${museum.sort_order})`);
        continue;
      }

      try {
        const { error: updateError } = await supabase
          .from('places')
          .update({ sort_order: newSortOrder })
          .eq('id', museum.id);

        if (updateError) {
          console.log(`   ⚠️  Erreur ${museum.name}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ ${museum.name} -> ordre ${newSortOrder}`);
          successCount++;
        }
      } catch (error) {
        console.log(`   ❌ Exception ${museum.name}: ${error.message}`);
        errorCount++;
      }
    }

    // 4. Vérification finale
    console.log('\n4. Vérification finale...');
    const { data: finalMuseums, error: finalError } = await supabase
      .from('places')
      .select('id, name, sort_order')
      .eq('type', 'museum')
      .order('sort_order', { nullsLast: true });

    if (finalError) {
      console.log('   ⚠️  Impossible de vérifier les résultats:', finalError.message);
    } else {
      console.log('   📊 Ordre final des musées:');
      finalMuseums.forEach((museum, index) => {
        const order = museum.sort_order || 'Non défini';
        console.log(`      ${index + 1}. ${museum.name} (ordre: ${order})`);
      });
    }

    // 5. Résumé
    console.log('\n🎉 Migration terminée !');
    console.log('\n📋 Résumé:');
    console.log(`   ✅ ${successCount} musées mis à jour avec succès`);
    if (errorCount > 0) {
      console.log(`   ⚠️  ${errorCount} erreurs rencontrées`);
    }
    console.log(`   📊 ${museums.length} musées au total`);

    if (successCount > 0) {
      console.log('\n🎯 Prochaines étapes:');
      console.log('   1. L\'interface de tri est maintenant fonctionnelle');
      console.log('   2. Accédez à "Tri Musées & Patrimoine" dans l\'admin');
      console.log('   3. Utilisez le glisser-déposer pour réorganiser');
      console.log('   4. Les modifications seront visibles sur le site');
    } else if (errorCount > 0) {
      console.log('\n⚠️  Mode dégradé activé:');
      console.log('   1. Le tri fonctionne en mode local');
      console.log('   2. Les modifications sont temporaires');
      console.log('   3. L\'ordre alphabétique est utilisé par défaut');
    }

  } catch (error) {
    console.error('💥 Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
runSimpleSortMigration().then(() => {
  console.log('\n✨ Migration terminée');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});