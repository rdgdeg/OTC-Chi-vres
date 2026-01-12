#!/usr/bin/env node

/**
 * Script pour appliquer automatiquement le fix RLS pour les hébergements
 * Nécessite une clé de service Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Clé de service (pas anon key)

console.log('🔧 APPLICATION DU FIX RLS - HÉBERGEMENTS');
console.log('='.repeat(50));

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL manquante dans .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.log('⚠️  SUPABASE_SERVICE_KEY manquante dans .env.local');
  console.log('');
  console.log('🔑 SOLUTION MANUELLE:');
  console.log('1. Allez sur https://supabase.com/dashboard');
  console.log('2. Sélectionnez votre projet');
  console.log('3. Allez dans SQL Editor');
  console.log('4. Copiez-collez le contenu de scripts/fix-rls-policies-accommodations.sql');
  console.log('5. Exécutez le script');
  console.log('');
  console.log('📄 Contenu du script à exécuter:');
  console.log('-'.repeat(40));
  
  try {
    const sqlContent = fs.readFileSync(
      path.join(process.cwd(), 'scripts/fix-rls-policies-accommodations.sql'), 
      'utf8'
    );
    console.log(sqlContent);
  } catch (error) {
    console.error('❌ Impossible de lire le fichier SQL:', error.message);
  }
  
  process.exit(0);
}

// Créer le client avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFix() {
  try {
    console.log('🔍 Vérification de la connexion...');
    
    // Test de connexion
    const { data, error } = await supabase
      .from('accommodations')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return;
    }
    
    console.log('✅ Connexion OK');
    console.log(`📊 ${data.count} hébergements trouvés`);
    
    console.log('\n🔧 Application des politiques RLS...');
    
    // Lire le script SQL
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), 'scripts/fix-rls-policies-accommodations.sql'), 
      'utf8'
    );
    
    // Exécuter le script (attention: ceci nécessite des privilèges élevés)
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql_query: sqlScript 
    });
    
    if (sqlError) {
      console.error('❌ Erreur lors de l\'exécution du script:', sqlError);
      console.log('\n💡 Veuillez appliquer le script manuellement dans Supabase Dashboard');
      return;
    }
    
    console.log('✅ Politiques RLS appliquées avec succès!');
    
    // Test de mise à jour
    console.log('\n🧪 Test de mise à jour...');
    const { data: testData, error: testError } = await supabase
      .from('accommodations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', 'au-champ-du-bouillon')
      .select()
      .single();
      
    if (testError) {
      console.error('❌ Test échoué:', testError);
    } else {
      console.log('✅ Test de mise à jour réussi!');
    }
    
    console.log('\n🎉 FIX RLS APPLIQUÉ AVEC SUCCÈS!');
    console.log('Vous pouvez maintenant modifier les hébergements dans l\'admin.');
    
  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

applyRLSFix();