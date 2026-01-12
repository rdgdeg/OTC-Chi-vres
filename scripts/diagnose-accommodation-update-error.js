#!/usr/bin/env node

/**
 * Script de diagnostic pour l'erreur PGRST116 lors de la mise à jour des hébergements
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Définie' : '❌ Manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseAccommodationIssues() {
  console.log('🔍 DIAGNOSTIC - Erreur PGRST116 Hébergements');
  console.log('='.repeat(50));

  try {
    // 1. Vérifier la connexion à Supabase
    console.log('\n1. Test de connexion Supabase...');
    const { count, error: connectionError } = await supabase
      .from('accommodations')
      .select('*', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Erreur de connexion:', connectionError);
      return;
    }
    console.log('✅ Connexion Supabase OK');

    // 2. Compter les hébergements
    console.log('\n2. Nombre d\'hébergements dans la base...');
    console.log(`📊 Total hébergements: ${count || 0}`);

    if (count === 0) {
      console.log('⚠️  Aucun hébergement trouvé - la table est vide');
      console.log('💡 Solution: Exécuter les migrations pour créer les données initiales');
      return;
    }

    // 3. Lister tous les hébergements avec leurs IDs
    console.log('\n3. Liste des hébergements existants...');
    const { data: accommodations, error: listError } = await supabase
      .from('accommodations')
      .select('id, name, status, created_at')
      .order('name');

    if (listError) {
      console.error('❌ Erreur lors de la récupération:', listError);
      return;
    }

    console.log('📋 Hébergements trouvés:');
    accommodations.forEach((acc, index) => {
      console.log(`   ${index + 1}. ID: "${acc.id}" | Nom: "${acc.name}" | Status: ${acc.status}`);
    });

    // 4. Tester une mise à jour sur le premier hébergement
    if (accommodations.length > 0) {
      console.log('\n4. Test de mise à jour...');
      const testAccommodation = accommodations[0];
      console.log(`🧪 Test sur: "${testAccommodation.name}" (ID: ${testAccommodation.id})`);

      const { data: updateResult, error: updateError } = await supabase
        .from('accommodations')
        .update({ 
          updated_at: new Date().toISOString(),
          // Mise à jour mineure pour tester
          excerpt: 'Test de mise à jour - ' + new Date().toLocaleTimeString()
        })
        .eq('id', testAccommodation.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        console.log('🔍 Détails de l\'erreur:');
        console.log('   Code:', updateError.code);
        console.log('   Message:', updateError.message);
        console.log('   Détails:', updateError.details);
        console.log('   Hint:', updateError.hint);
      } else {
        console.log('✅ Mise à jour réussie!');
        console.log('📄 Résultat:', updateResult);
      }
    }

    // 5. Vérifier les politiques RLS
    console.log('\n5. Vérification des politiques RLS...');
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'accommodations' })
      .catch(() => {
        console.log('⚠️  Impossible de vérifier les politiques RLS (fonction non disponible)');
        return { data: null, error: null };
      });

    if (policyError) {
      console.log('⚠️  Erreur lors de la vérification des politiques:', policyError.message);
    } else if (policies) {
      console.log('📋 Politiques RLS actives:', policies.length);
    }

    // 6. Recommandations
    console.log('\n6. 🎯 RECOMMANDATIONS');
    console.log('='.repeat(30));
    
    if (count === 0) {
      console.log('• Exécuter: npm run migrate:accommodations');
      console.log('• Ou importer les données initiales');
    } else {
      console.log('• Vérifier que l\'ID utilisé dans l\'interface existe bien');
      console.log('• Contrôler les politiques RLS si l\'erreur persiste');
      console.log('• Vérifier l\'authentification de l\'utilisateur');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le diagnostic
diagnoseAccommodationIssues();