#!/usr/bin/env node

/**
 * Script de test pour vérifier les corrections admin
 * Vérifie que les tables et vues nécessaires existent
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

async function testAdminFixes() {
  console.log('🔍 Test des corrections admin...\n');

  try {
    // 1. Tester la vue walks
    console.log('1. Test de la vue walks...');
    const { data: walks, error: walksError } = await supabase
      .from('walks')
      .select('*')
      .limit(1);

    if (walksError) {
      console.error('❌ Erreur vue walks:', walksError.message);
    } else {
      console.log('✅ Vue walks accessible');
    }

    // 2. Tester la table team_members
    console.log('\n2. Test de la table team_members...');
    const { data: team, error: teamError } = await supabase
      .from('team_members')
      .select('*')
      .limit(1);

    if (teamError) {
      console.error('❌ Erreur table team_members:', teamError.message);
    } else {
      console.log('✅ Table team_members accessible');
      console.log(`   Nombre de membres: ${team?.length || 0}`);
    }

    // 3. Tester la table admin_sessions
    console.log('\n3. Test de la table admin_sessions...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('*')
      .limit(1);

    if (sessionsError) {
      console.error('❌ Erreur table admin_sessions:', sessionsError.message);
    } else {
      console.log('✅ Table admin_sessions accessible');
    }

    // 4. Tester les fonctions admin
    console.log('\n4. Test des fonctions admin...');
    const { data: sessionToken, error: functionError } = await supabase
      .rpc('create_admin_session');

    if (functionError) {
      console.error('❌ Erreur fonction create_admin_session:', functionError.message);
    } else {
      console.log('✅ Fonction create_admin_session fonctionne');
      console.log(`   Token généré: ${sessionToken?.substring(0, 10)}...`);
    }

    // 5. Vérifier les colonnes de places
    console.log('\n5. Test des colonnes places...');
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('id, name, status, created_at, updated_at')
      .limit(1);

    if (placesError) {
      console.error('❌ Erreur colonnes places:', placesError.message);
    } else {
      console.log('✅ Colonnes places accessibles');
    }

    console.log('\n🎉 Tests terminés !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter les tests
testAdminFixes();