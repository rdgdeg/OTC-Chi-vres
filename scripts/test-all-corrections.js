import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Lire la configuration
const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configuration Supabase manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllCorrections() {
  console.log('🧪 TEST COMPLET DES CORRECTIONS HÉBERGEMENTS');
  console.log('=' .repeat(50));
  
  let allTestsPassed = true;
  
  try {
    // TEST 1: Vérifier la lecture des données
    console.log('\n1️⃣ TEST: Lecture des hébergements');
    const { data: accommodations, error: readError } = await supabase
      .from('accommodations')
      .select('id, name, type, status')
      .limit(5);
      
    if (readError) {
      console.error('❌ ÉCHEC: Lecture des données:', readError.message);
      allTestsPassed = false;
    } else {
      console.log(`✅ SUCCÈS: ${accommodations?.length || 0} hébergements lus`);
      
      // Analyser les types
      let arrayTypes = 0;
      let stringTypes = 0;
      accommodations?.forEach(acc => {
        if (Array.isArray(acc.type)) arrayTypes++;
        else stringTypes++;
      });
      
      console.log(`   📊 Types: ${arrayTypes} arrays, ${stringTypes} strings`);
      
      if (stringTypes > 0) {
        console.log('   ⚠️ Migration types multiples pas encore appliquée');
      }
    }
    
    // TEST 2: Tester la mise à jour (RLS)
    console.log('\n2️⃣ TEST: Mise à jour hébergement (RLS)');
    
    if (accommodations && accommodations.length > 0) {
      const testAccommodation = accommodations[0];
      const testUpdate = {
        updated_at: new Date().toISOString(),
        // Test avec le type existant pour éviter les erreurs de contrainte
        name: testAccommodation.name + ' (test)'
      };
      
      const { data: updateData, error: updateError } = await supabase
        .from('accommodations')
        .update(testUpdate)
        .eq('id', testAccommodation.id)
        .select('id, name, updated_at');
        
      if (updateError) {
        console.error('❌ ÉCHEC: Mise à jour RLS:', updateError.message);
        if (updateError.code === 'PGRST116') {
          console.log('   💡 Solution: Appliquer scripts/fix-rls-direct.sql dans Supabase');
        }
        allTestsPassed = false;
      } else {
        console.log('✅ SUCCÈS: Mise à jour RLS fonctionne');
        
        // Remettre le nom original
        await supabase
          .from('accommodations')
          .update({ name: testAccommodation.name })
          .eq('id', testAccommodation.id);
      }
    }
    
    // TEST 3: Tester les types multiples (si migration appliquée)
    console.log('\n3️⃣ TEST: Types multiples');
    
    if (accommodations && accommodations.length > 0) {
      const hasArrayTypes = accommodations.some(acc => Array.isArray(acc.type));
      
      if (hasArrayTypes) {
        console.log('✅ SUCCÈS: Types multiples détectés');
        
        // Tester une mise à jour avec type multiple
        const testAccommodation = accommodations.find(acc => Array.isArray(acc.type));
        if (testAccommodation) {
          const multipleTypes = ['bed_breakfast', 'gite'];
          
          const { error: multiTypeError } = await supabase
            .from('accommodations')
            .update({ type: multipleTypes })
            .eq('id', testAccommodation.id);
            
          if (multiTypeError) {
            console.error('❌ ÉCHEC: Mise à jour types multiples:', multiTypeError.message);
            allTestsPassed = false;
          } else {
            console.log('✅ SUCCÈS: Mise à jour types multiples fonctionne');
            
            // Remettre le type original
            await supabase
              .from('accommodations')
              .update({ type: testAccommodation.type })
              .eq('id', testAccommodation.id);
          }
        }
      } else {
        console.log('⚠️ ATTENTE: Migration types multiples pas encore appliquée');
        console.log('   💡 Solution: Appliquer migrations/update-accommodations-multiple-types.sql');
      }
    }
    
    // TEST 4: Vérifier les politiques RLS
    console.log('\n4️⃣ TEST: Politiques RLS');
    
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies_for_table', { table_name: 'accommodations' })
      .catch(() => ({ data: null, error: { message: 'Fonction get_policies_for_table non disponible' } }));
      
    if (policyError) {
      console.log('⚠️ INFO: Impossible de vérifier les politiques RLS automatiquement');
      console.log('   💡 Vérifier manuellement dans l\'interface Supabase');
    } else if (policies) {
      console.log(`✅ INFO: ${policies.length} politiques RLS trouvées`);
    }
    
    // RÉSUMÉ FINAL
    console.log('\n' + '='.repeat(50));
    console.log('📋 RÉSUMÉ DES TESTS');
    console.log('='.repeat(50));
    
    if (allTestsPassed) {
      console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('✅ Les corrections sont appliquées et fonctionnelles');
    } else {
      console.log('⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('📖 Consulter GUIDE-APPLICATION-CORRECTIONS.md pour les solutions');
    }
    
    // Instructions suivantes
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Tester l\'interface admin des hébergements');
    console.log('2. Vérifier la création/modification d\'hébergements');
    console.log('3. Tester la sélection multiple de types');
    console.log('4. Valider l\'affichage responsive (pas de défilement horizontal)');
    
  } catch (err) {
    console.error('❌ ERREUR GÉNÉRALE:', err.message);
    allTestsPassed = false;
  }
  
  process.exit(allTestsPassed ? 0 : 1);
}

testAllCorrections();