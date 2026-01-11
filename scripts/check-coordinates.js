#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoordinates() {
  try {
    console.log('🔍 VÉRIFICATION DES COORDONNÉES GPS');
    console.log('='.repeat(50));
    
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('id, name, address, village, lat, lng, updated_at')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log(`📋 ${accommodations.length} hébergements trouvés\n`);
    
    accommodations.forEach((acc, index) => {
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   📍 Adresse: ${acc.address}`);
      console.log(`   🏘️ Village: ${acc.village || 'Non spécifié'}`);
      console.log(`   🗺️ Coordonnées: lat=${acc.lat || 'N/A'}, lng=${acc.lng || 'N/A'}`);
      console.log(`   🕒 Mis à jour: ${acc.updated_at}`);
      console.log('');
    });
    
    const withCoords = accommodations.filter(a => a.lat && a.lng).length;
    console.log(`📊 Résumé: ${withCoords}/${accommodations.length} hébergements ont des coordonnées GPS`);
    
    if (withCoords === 0) {
      console.log('\n⚠️ Aucune coordonnée trouvée. Problème possible:');
      console.log('1. Les colonnes lat/lng n\'existent pas dans la table');
      console.log('2. Les mises à jour n\'ont pas fonctionné');
      console.log('3. Problème de permissions RLS');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkCoordinates();