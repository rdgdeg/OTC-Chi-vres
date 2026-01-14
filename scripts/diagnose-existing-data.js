/**
 * Script de diagnostic pour vérifier les données existantes dans la base
 * Affiche tous les champs disponibles pour chaque type de contenu
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function diagnoseData() {
  console.log('🔍 DIAGNOSTIC DES DONNÉES EXISTANTES\n');
  console.log('=' .repeat(80));

  // 1. Hébergements
  console.log('\n📍 HÉBERGEMENTS (accommodations)');
  console.log('-'.repeat(80));
  const { data: accommodations, error: accError } = await supabase
    .from('accommodations')
    .select('*')
    .limit(1);

  if (accError) {
    console.error('❌ Erreur:', accError.message);
  } else if (accommodations && accommodations.length > 0) {
    const item = accommodations[0];
    console.log(`✅ Exemple: ${item.name}`);
    console.log('\nChamps disponibles:');
    Object.keys(item).forEach(key => {
      const value = item[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      const preview = Array.isArray(value) 
        ? `[${value.length} items]` 
        : value !== null && value !== undefined 
          ? String(value).substring(0, 50) 
          : 'null';
      console.log(`  - ${key} (${type}): ${preview}`);
    });
  } else {
    console.log('⚠️  Aucun hébergement trouvé');
  }

  // 2. Événements
  console.log('\n\n📅 ÉVÉNEMENTS (events)');
  console.log('-'.repeat(80));
  const { data: events, error: evError } = await supabase
    .from('events')
    .select('*')
    .limit(1);

  if (evError) {
    console.error('❌ Erreur:', evError.message);
  } else if (events && events.length > 0) {
    const item = events[0];
    console.log(`✅ Exemple: ${item.name}`);
    console.log('\nChamps disponibles:');
    Object.keys(item).forEach(key => {
      const value = item[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      const preview = Array.isArray(value) 
        ? `[${value.length} items]` 
        : value !== null && value !== undefined 
          ? String(value).substring(0, 50) 
          : 'null';
      console.log(`  - ${key} (${type}): ${preview}`);
    });
  } else {
    console.log('⚠️  Aucun événement trouvé');
  }

  // 3. Places (restaurants, patrimoine, balades)
  console.log('\n\n🏛️  PLACES (restaurants, patrimoine, balades)');
  console.log('-'.repeat(80));
  const { data: places, error: plError } = await supabase
    .from('places')
    .select('*')
    .limit(3);

  if (plError) {
    console.error('❌ Erreur:', plError.message);
  } else if (places && places.length > 0) {
    places.forEach(item => {
      console.log(`\n✅ ${item.type}: ${item.name}`);
      console.log('Champs remplis:');
      Object.keys(item).forEach(key => {
        const value = item[key];
        if (value !== null && value !== undefined && value !== '') {
          const type = Array.isArray(value) ? 'array' : typeof value;
          const preview = Array.isArray(value) 
            ? `[${value.length} items]` 
            : String(value).substring(0, 50);
          console.log(`  - ${key} (${type}): ${preview}`);
        }
      });
    });
  } else {
    console.log('⚠️  Aucun lieu trouvé');
  }

  // 4. Résumé
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(80));
  
  const { count: accCount } = await supabase
    .from('accommodations')
    .select('*', { count: 'exact', head: true });
  
  const { count: evCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });
  
  const { count: plCount } = await supabase
    .from('places')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✅ Hébergements: ${accCount || 0}`);
  console.log(`✅ Événements: ${evCount || 0}`);
  console.log(`✅ Places: ${plCount || 0}`);
  
  console.log('\n✨ Diagnostic terminé!\n');
}

diagnoseData().catch(console.error);
