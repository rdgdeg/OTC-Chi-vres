#!/usr/bin/env node

/**
 * Script principal pour configurer complètement les hébergements
 * Exécute toutes les étapes nécessaires dans le bon ordre
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
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

function runScript(scriptPath, description) {
  console.log(`\n🚀 ${description}...`);
  console.log(`📄 Exécution: ${scriptPath}`);
  console.log('─'.repeat(50));
  
  try {
    execSync(`node ${scriptPath}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('─'.repeat(50));
    console.log(`✅ ${description} terminé avec succès\n`);
    return true;
  } catch (error) {
    console.log('─'.repeat(50));
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    return false;
  }
}

async function checkTableExists() {
  console.log('🔍 Vérification de l\'existence de la table accommodations...');
  
  const { data, error } = await supabase
    .from('accommodations')
    .select('count', { count: 'exact', head: true });
  
  if (error) {
    console.log('❌ Table accommodations n\'existe pas ou n\'est pas accessible');
    return false;
  }
  
  console.log('✅ Table accommodations existe et est accessible');
  return true;
}

async function setupCompleteAccommodations() {
  console.log('🏠 CONFIGURATION COMPLÈTE DES HÉBERGEMENTS');
  console.log('='.repeat(60));
  console.log('Ce script va configurer tous les hébergements de Chièvres');
  console.log('avec leurs données complètes, coordonnées et images.\n');

  // Étape 1: Vérifier la table
  const tableExists = await checkTableExists();
  if (!tableExists) {
    console.log('📋 Création de la table accommodations...');
    const success = runScript(
      'scripts/run-migration.js migrations/accommodations-simple.sql',
      'Création de la table accommodations'
    );
    if (!success) {
      console.error('💥 Impossible de créer la table. Arrêt du processus.');
      process.exit(1);
    }
  }

  // Étape 2: Mettre à jour avec les données complètes
  const step2Success = runScript(
    'scripts/update-accommodations-complete-data.js',
    'Mise à jour avec les données complètes'
  );
  
  if (!step2Success) {
    console.error('💥 Erreur lors de la mise à jour des données. Arrêt du processus.');
    process.exit(1);
  }

  // Étape 3: Ajouter les images par défaut
  const step3Success = runScript(
    'scripts/add-default-images-accommodations.js',
    'Ajout des images par défaut'
  );
  
  if (!step3Success) {
    console.warn('⚠️ Erreur lors de l\'ajout des images, mais on continue...');
  }

  // Étape 4: Vérification finale
  const step4Success = runScript(
    'scripts/verify-accommodations-complete.js',
    'Vérification finale des données'
  );

  // Résumé final
  console.log('🎯 RÉSUMÉ DE LA CONFIGURATION');
  console.log('='.repeat(60));
  console.log(`✅ Table accommodations: ${tableExists ? 'Existait déjà' : 'Créée'}`);
  console.log(`✅ Données complètes: ${step2Success ? 'Mises à jour' : 'Erreur'}`);
  console.log(`${step3Success ? '✅' : '⚠️'} Images par défaut: ${step3Success ? 'Ajoutées' : 'Erreur'}`);
  console.log(`✅ Vérification: ${step4Success ? 'Effectuée' : 'Erreur'}`);

  if (step2Success) {
    console.log('\n🎉 Configuration des hébergements terminée avec succès !');
    console.log('\n📋 Prochaines étapes recommandées:');
    console.log('1. Vérifier les hébergements dans l\'interface admin');
    console.log('2. Remplacer les images par défaut par de vraies photos');
    console.log('3. Ajuster les descriptions si nécessaire');
    console.log('4. Tester l\'affichage sur la page hébergements');
  } else {
    console.log('\n❌ Configuration incomplète. Vérifiez les erreurs ci-dessus.');
  }
}

// Exécution du script principal
setupCompleteAccommodations()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });