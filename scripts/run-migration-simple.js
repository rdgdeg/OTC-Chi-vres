#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec service role (pour bypasser RLS)
const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
// Note: En production, utilisez la service role key pour bypasser RLS
// Pour ce test, nous allons d'abord vérifier les données existantes
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentData() {
  try {
    console.log('🔍 Vérification des données actuelles...');
    
    // Vérifier les données existantes
    const { data: accommodations, error: fetchError } = await supabase
      .from('accommodations')
      .select('id, name, featured_image, status, features')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Erreur lors de la lecture:', fetchError);
      return;
    }
    
    console.log('\n📊 État actuel:');
    console.log(`Total hébergements: ${accommodations.length}`);
    console.log(`Avec images: ${accommodations.filter(a => a.featured_image).length}`);
    console.log(`Publiés: ${accommodations.filter(a => a.status === 'published').length}`);
    
    console.log('\n📋 Liste des hébergements:');
    accommodations.forEach(acc => {
      const hasImage = acc.featured_image ? '🖼️' : '❌';
      const status = acc.status === 'published' ? '✅' : '⏳';
      const featuresCount = acc.features ? acc.features.length : 0;
      console.log(`  ${hasImage} ${status} ${acc.name} (${featuresCount} caractéristiques)`);
    });
    
    // Vérifier si les données correspondent au contenu attendu
    const expectedAccommodations = [
      'La Loge Bed & Breakfast',
      'Au sentier Chauchaut', 
      'La Maison d\'à côté',
      'Au Champ du Bouillon',
      'Les Greniers du Moulin',
      'L\'Évasion',
      'Moulin du Domissart',
      'Chez les Kikis',
      'On dirait le sud…'
    ];
    
    console.log('\n🎯 Vérification du contenu:');
    expectedAccommodations.forEach(name => {
      const found = accommodations.find(acc => acc.name === name);
      if (found) {
        const hasImage = found.featured_image ? '🖼️' : '❌';
        const featuresOk = found.features && found.features.length > 0 ? '✅' : '❌';
        console.log(`  ✅ ${name} ${hasImage} ${featuresOk}`);
      } else {
        console.log(`  ❌ ${name} - MANQUANT`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkCurrentData();