#!/usr/bin/env node

/**
 * Script de test pour la gestion de bannière
 * Vérifie que la bannière peut être lue et mise à jour
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

async function testBannerManagement() {
  console.log('🧪 Test de la gestion de bannière...\n');

  try {
    // 1. Vérifier l'existence de la table homepage_content
    console.log('1. Vérification de la table homepage_content...');
    const { data: tables, error: tablesError } = await supabase
      .from('homepage_content')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.error('❌ Erreur lors de l\'accès à la table:', tablesError.message);
      return;
    }
    console.log('✅ Table homepage_content accessible');

    // 2. Vérifier l'existence de l'entrée bannière
    console.log('\n2. Vérification de l\'entrée bannière...');
    const { data: banner, error: bannerError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'info-banner')
      .single();

    if (bannerError) {
      console.error('❌ Erreur lors de la récupération de la bannière:', bannerError.message);
      
      // Créer l'entrée si elle n'existe pas
      console.log('📝 Création de l\'entrée bannière...');
      const { data: newBanner, error: createError } = await supabase
        .from('homepage_content')
        .insert({
          id: 'info-banner',
          section: 'banner',
          title: 'Fermeture du bureau le 11 novembre (férié)',
          subtitle: 'Réouverture le 12 novembre à 9h',
          content: '',
          settings: {
            type: 'announcement',
            dismissible: true,
            showIcon: true
          },
          is_active: true,
          sort_order: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erreur lors de la création de la bannière:', createError.message);
        return;
      }
      
      console.log('✅ Bannière créée avec succès');
      console.log('📄 Données:', JSON.stringify(newBanner, null, 2));
    } else {
      console.log('✅ Bannière trouvée');
      console.log('📄 Données actuelles:', JSON.stringify(banner, null, 2));
    }

    // 3. Test de mise à jour
    console.log('\n3. Test de mise à jour de la bannière...');
    const testUpdate = {
      title: 'Test de mise à jour - ' + new Date().toLocaleTimeString(),
      subtitle: 'Ceci est un test automatique',
      settings: {
        type: 'info',
        dismissible: true,
        showIcon: true
      },
      is_active: true,
      updated_at: new Date().toISOString()
    };

    const { data: updatedBanner, error: updateError } = await supabase
      .from('homepage_content')
      .update(testUpdate)
      .eq('id', 'info-banner')
      .select();

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError.message);
      return;
    }

    console.log('✅ Bannière mise à jour avec succès');
    console.log('📄 Nouvelles données:', JSON.stringify(updatedBanner[0], null, 2));

    // 4. Test de lecture publique (sans authentification)
    console.log('\n4. Test de lecture publique...');
    const { data: publicBanner, error: publicError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('section', 'banner')
      .eq('is_active', true)
      .single();

    if (publicError) {
      console.error('❌ Erreur lors de la lecture publique:', publicError.message);
      return;
    }

    console.log('✅ Lecture publique réussie');
    console.log('📄 Données publiques:', JSON.stringify(publicBanner, null, 2));

    // 5. Restaurer les données originales
    console.log('\n5. Restauration des données originales...');
    const originalData = {
      title: 'Fermeture du bureau le 11 novembre (férié)',
      subtitle: 'Réouverture le 12 novembre à 9h',
      settings: {
        type: 'announcement',
        dismissible: true,
        showIcon: true
      },
      is_active: true,
      updated_at: new Date().toISOString()
    };

    const { error: restoreError } = await supabase
      .from('homepage_content')
      .update(originalData)
      .eq('id', 'info-banner');

    if (restoreError) {
      console.error('❌ Erreur lors de la restauration:', restoreError.message);
      return;
    }

    console.log('✅ Données originales restaurées');

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📋 Résumé:');
    console.log('   ✅ Table homepage_content accessible');
    console.log('   ✅ Entrée bannière présente');
    console.log('   ✅ Mise à jour fonctionnelle');
    console.log('   ✅ Lecture publique fonctionnelle');
    console.log('   ✅ Restauration réussie');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécuter les tests
testBannerManagement().then(() => {
  console.log('\n✨ Tests terminés');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});