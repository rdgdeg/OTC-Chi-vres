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

async function applyMigrationDirect() {
  console.log('🔄 Application directe de la migration types multiples...');
  
  try {
    // 1. Vérifier la structure actuelle
    console.log('🔍 Vérification de la structure actuelle...');
    const { data: currentData, error: currentError } = await supabase
      .from('accommodations')
      .select('id, name, type')
      .limit(3);
      
    if (currentError) {
      console.error('❌ Erreur lors de la vérification:', currentError.message);
      return;
    }
    
    console.log('📊 Données actuelles:');
    currentData?.forEach(item => {
      console.log(`  - ${item.name}: ${Array.isArray(item.type) ? '[' + item.type.join(', ') + ']' : item.type} (${typeof item.type})`);
    });
    
    // 2. Tester une mise à jour avec type array
    console.log('🧪 Test de mise à jour avec type array...');
    
    if (currentData && currentData.length > 0) {
      const testItem = currentData[0];
      const newType = Array.isArray(testItem.type) ? testItem.type : [testItem.type];
      
      const { data: updateData, error: updateError } = await supabase
        .from('accommodations')
        .update({ 
          type: newType,
          updated_at: new Date().toISOString()
        })
        .eq('id', testItem.id)
        .select('id, name, type');
        
      if (updateError) {
        console.error('❌ Erreur lors du test de mise à jour:', updateError.message);
        
        // Si erreur RLS, afficher les instructions
        if (updateError.code === 'PGRST116') {
          console.log('\n🚨 ERREUR RLS DÉTECTÉE !');
          console.log('📋 INSTRUCTIONS POUR CORRIGER:');
          console.log('1. Ouvrir l\'interface Supabase (https://supabase.com/dashboard)');
          console.log('2. Aller dans SQL Editor');
          console.log('3. Copier-coller le contenu du fichier: scripts/fix-rls-direct.sql');
          console.log('4. Exécuter le script');
          console.log('5. Relancer cette migration\n');
        }
      } else {
        console.log('✅ Test de mise à jour réussi:', updateData);
      }
    }
    
    // 3. Vérifier si la colonne est déjà en format array
    console.log('🔍 Vérification du format des types...');
    const { data: allData, error: allError } = await supabase
      .from('accommodations')
      .select('id, name, type')
      .limit(10);
      
    if (allError) {
      console.error('❌ Erreur lors de la vérification complète:', allError.message);
      return;
    }
    
    let arrayCount = 0;
    let stringCount = 0;
    
    allData?.forEach(item => {
      if (Array.isArray(item.type)) {
        arrayCount++;
      } else {
        stringCount++;
      }
    });
    
    console.log(`📈 Résultats: ${arrayCount} en format array, ${stringCount} en format string`);
    
    if (stringCount > 0) {
      console.log('⚠️ Certains hébergements ont encore des types en format string');
      console.log('💡 La migration SQL complète doit être appliquée dans Supabase');
    } else {
      console.log('✅ Tous les types sont au format array !');
    }
    
  } catch (err) {
    console.error('❌ Erreur générale:', err.message);
  }
}

applyMigrationDirect();