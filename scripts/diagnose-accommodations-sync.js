#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseSync() {
  try {
    console.log('🔍 DIAGNOSTIC - SYNCHRONISATION ADMIN ↔ PAGE PUBLIQUE');
    console.log('='.repeat(70));
    
    // 1. Récupérer TOUS les hébergements (comme l'admin)
    console.log('\n📋 HÉBERGEMENTS DANS L\'ADMIN (tous statuts)');
    const { data: allAccommodations, error: allError } = await supabase
      .from('accommodations')
      .select('*')
      .order('name');
    
    if (allError) {
      console.error('❌ Erreur admin:', allError);
      return;
    }
    
    console.log(`Total en base: ${allAccommodations.length}`);
    allAccommodations.forEach((acc, index) => {
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   📍 ${acc.address || 'Adresse manquante'}`);
      console.log(`   🏠 Type: ${acc.type || 'Type manquant'}`);
      console.log(`   👥 Capacité: ${acc.capacity || 'Capacité manquante'}`);
      console.log(`   📊 Statut: ${acc.status}`);
      console.log(`   🖼️ Image: ${acc.featured_image ? 'Présente' : 'Manquante'}`);
      console.log('');
    });
    
    // 2. Récupérer les hébergements PUBLIÉS (comme la page publique)
    console.log('\n🌐 HÉBERGEMENTS SUR LA PAGE PUBLIQUE (statut published)');
    const { data: publishedAccommodations, error: pubError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');
    
    if (pubError) {
      console.error('❌ Erreur page publique:', pubError);
      return;
    }
    
    console.log(`Total publiés: ${publishedAccommodations.length}`);
    publishedAccommodations.forEach((acc, index) => {
      console.log(`${index + 1}. ${acc.name} (${acc.type}, ${acc.capacity} pers.)`);
    });
    
    // 3. Analyser les différences
    console.log('\n🔍 ANALYSE DES DIFFÉRENCES');
    const unpublished = allAccommodations.filter(acc => acc.status !== 'published');
    if (unpublished.length > 0) {
      console.log(`⚠️ ${unpublished.length} hébergement(s) NON PUBLIÉS :`);
      unpublished.forEach(acc => {
        console.log(`   - ${acc.name} (statut: ${acc.status})`);
      });
    }
    
    // 4. Vérifier les champs essentiels pour la carte
    console.log('\n🗺️ VÉRIFICATION POUR LA CARTE');
    const withoutAddress = allAccommodations.filter(acc => !acc.address);
    const withoutCoords = allAccommodations.filter(acc => !acc.lat || !acc.lng);
    
    console.log(`Sans adresse: ${withoutAddress.length}`);
    withoutAddress.forEach(acc => console.log(`   - ${acc.name}`));
    
    console.log(`Sans coordonnées GPS: ${withoutCoords.length}`);
    console.log('Note: Coordonnées par défaut utilisées si manquantes');
    
    // 5. Vérifier les champs Type, Localisation, Capacité
    console.log('\n📝 VÉRIFICATION CHAMPS ESSENTIELS');
    allAccommodations.forEach(acc => {
      const hasType = acc.type ? '✅' : '❌';
      const hasAddress = acc.address ? '✅' : '❌';
      const hasCapacity = acc.capacity ? '✅' : '❌';
      
      console.log(`${acc.name}:`);
      console.log(`   ${hasType} Type: ${acc.type || 'MANQUANT'}`);
      console.log(`   ${hasAddress} Localisation: ${acc.address || 'MANQUANTE'}`);
      console.log(`   ${hasCapacity} Capacité: ${acc.capacity || 'MANQUANTE'}`);
    });
    
    // 6. Recommandations
    console.log('\n💡 RECOMMANDATIONS');
    if (unpublished.length > 0) {
      console.log('1. Publier les hébergements en statut "draft"');
    }
    if (withoutAddress.length > 0) {
      console.log('2. Ajouter les adresses manquantes');
    }
    console.log('3. Améliorer l\'éditeur pour mettre en évidence Type/Localisation/Capacité');
    console.log('4. Synchroniser l\'affichage admin ↔ page publique');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

diagnoseSync();