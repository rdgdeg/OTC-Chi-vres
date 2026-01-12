#!/usr/bin/env node

/**
 * DIAGNOSTIC - Différence entre Frontend (5) et Admin (9) hébergements
 * 
 * Ce script vérifie :
 * 1. Le nombre total d'hébergements en base
 * 2. Le nombre d'hébergements publiés
 * 3. Les données exactes retournées par chaque requête
 * 4. Les filtres appliqués côté frontend
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

console.log('🔍 DIAGNOSTIC - Synchronisation Hébergements Frontend vs Admin');
console.log('================================================================\n');

async function diagnosticAccommodations() {
  try {
    // 1. Vérifier le total en base
    console.log('1️⃣ VÉRIFICATION TOTALE EN BASE');
    console.log('--------------------------------');
    
    const { data: allData, error: allError } = await supabase
      .from('accommodations')
      .select('id, name, type, status, slug, village, excerpt, featured_image, created_at')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Erreur lors de la récupération totale:', allError);
      return;
    }

    console.log(`📊 Total hébergements en base: ${allData.length}`);
    
    // Grouper par statut
    const byStatus = allData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Répartition par statut:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });
    console.log();

    // 2. Requête Frontend (utilisateurs publics)
    console.log('2️⃣ REQUÊTE FRONTEND (Utilisateurs Publics)');
    console.log('--------------------------------------------');
    
    const { data: frontendData, error: frontendError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (frontendError) {
      console.error('❌ Erreur requête frontend:', frontendError);
      return;
    }

    console.log(`📊 Hébergements retournés (Frontend): ${frontendData.length}`);
    console.log('📋 Liste des hébergements frontend:');
    frontendData.forEach((acc, index) => {
      console.log(`   ${index + 1}. ${acc.name} (${acc.type}) - ${acc.village || 'Village non défini'}`);
    });
    console.log();

    // 3. Requête Admin (utilisateurs authentifiés)
    console.log('3️⃣ REQUÊTE ADMIN (Utilisateurs Authentifiés)');
    console.log('----------------------------------------------');
    
    const { data: adminData, error: adminError } = await supabase
      .from('accommodations')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.error('❌ Erreur requête admin:', adminError);
      return;
    }

    console.log(`📊 Hébergements retournés (Admin): ${adminData.length}`);
    console.log('📋 Liste des hébergements admin:');
    adminData.forEach((acc, index) => {
      const statusIcon = acc.status === 'published' ? '✅' : 
                        acc.status === 'draft' ? '📝' : '📦';
      console.log(`   ${index + 1}. ${acc.name} (${acc.type}) - ${acc.status} ${statusIcon} - ${acc.village || 'Village non défini'}`);
    });
    console.log();

    // 4. Identifier les différences
    console.log('4️⃣ ANALYSE DES DIFFÉRENCES');
    console.log('---------------------------');
    
    const frontendIds = new Set(frontendData.map(acc => acc.id));
    const adminIds = new Set(adminData.map(acc => acc.id));
    
    // Hébergements dans admin mais pas dans frontend
    const missingInFrontend = adminData.filter(acc => !frontendIds.has(acc.id));
    
    if (missingInFrontend.length > 0) {
      console.log(`❌ Hébergements manquants au frontend (${missingInFrontend.length}):`);
      missingInFrontend.forEach((acc, index) => {
        console.log(`   ${index + 1}. ${acc.name}`);
        console.log(`      - Type: ${acc.type}`);
        console.log(`      - Status: ${acc.status}`);
        console.log(`      - Village: ${acc.village || 'Non défini'}`);
        console.log(`      - Slug: ${acc.slug || 'Non défini'}`);
        console.log(`      - Excerpt: ${acc.excerpt ? 'Défini' : 'Non défini'}`);
        console.log(`      - Image: ${acc.featured_image ? 'Définie' : 'Non définie'}`);
        console.log(`      - Créé le: ${new Date(acc.created_at).toLocaleDateString('fr-FR')}`);
        console.log();
      });
    } else {
      console.log('✅ Aucun hébergement manquant identifié');
    }

    // 5. Vérifier les hébergements publiés spécifiquement
    console.log('5️⃣ VÉRIFICATION HÉBERGEMENTS PUBLIÉS');
    console.log('-------------------------------------');
    
    const publishedInAdmin = adminData.filter(acc => acc.status === 'published');
    console.log(`📊 Hébergements publiés selon admin: ${publishedInAdmin.length}`);
    console.log(`📊 Hébergements publiés selon frontend: ${frontendData.length}`);
    
    if (publishedInAdmin.length !== frontendData.length) {
      console.log('⚠️  ANOMALIE DÉTECTÉE: Le nombre d\'hébergements publiés diffère!');
      
      const publishedAdminIds = new Set(publishedInAdmin.map(acc => acc.id));
      const publishedMissing = publishedInAdmin.filter(acc => !frontendIds.has(acc.id));
      
      if (publishedMissing.length > 0) {
        console.log(`❌ Hébergements publiés manquants au frontend (${publishedMissing.length}):`);
        publishedMissing.forEach((acc, index) => {
          console.log(`   ${index + 1}. ${acc.name} - ${acc.type} - ${acc.village}`);
        });
      }
    } else {
      console.log('✅ Cohérence entre admin et frontend pour les hébergements publiés');
    }

    // 6. Test de requête directe avec politiques RLS
    console.log('\n6️⃣ TEST POLITIQUES RLS');
    console.log('------------------------');
    
    // Test sans authentification (comme le frontend public)
    const supabasePublic = createClient(supabaseUrl, supabaseKey);
    
    const { data: publicData, error: publicError } = await supabasePublic
      .from('accommodations')
      .select('id, name, status')
      .eq('status', 'published');

    if (publicError) {
      console.log('❌ Erreur requête publique (RLS):', publicError.message);
    } else {
      console.log(`📊 Hébergements accessibles publiquement (RLS): ${publicData.length}`);
      if (publicData.length !== frontendData.length) {
        console.log('⚠️  Les politiques RLS pourraient causer le problème!');
      }
    }

    // 7. Recommandations
    console.log('\n7️⃣ RECOMMANDATIONS');
    console.log('-------------------');
    
    if (missingInFrontend.length > 0) {
      console.log('🔧 Actions recommandées:');
      console.log('1. Vérifier les politiques RLS avec le script fix-rls-policies-accommodations.sql');
      console.log('2. Vérifier les filtres supplémentaires dans pages/Accommodations.tsx');
      console.log('3. Contrôler la cohérence des données (slug, excerpt, images)');
      console.log('4. Tester la synchronisation avec le service unifié');
    } else {
      console.log('✅ Aucune action requise - Les données semblent cohérentes');
    }

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exécuter le diagnostic
diagnosticAccommodations();