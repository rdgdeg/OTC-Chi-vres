#!/usr/bin/env node

/**
 * Script de vérification complète des hébergements
 * Vérifie que toutes les données sont correctement intégrées
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

async function verifyAccommodations() {
  console.log('🔍 Vérification complète des hébergements...\n');

  // Récupérer tous les hébergements
  const { data: accommodations, error } = await supabase
    .from('accommodations')
    .select('*')
    .order('name');

  if (error) {
    console.error('❌ Erreur lors de la récupération:', error.message);
    return;
  }

  console.log(`📊 Total des hébergements: ${accommodations.length}\n`);

  // Statistiques par type
  const typeStats = accommodations.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  console.log('📈 Répartition par type:');
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log('');

  // Statistiques par village
  const villageStats = accommodations.reduce((acc, item) => {
    acc[item.village] = (acc[item.village] || 0) + 1;
    return acc;
  }, {});

  console.log('🏘️ Répartition par village:');
  Object.entries(villageStats).forEach(([village, count]) => {
    console.log(`  ${village}: ${count}`);
  });
  console.log('');

  // Vérification des champs obligatoires
  console.log('✅ Vérification des champs obligatoires:');
  let missingFields = 0;

  accommodations.forEach((acc, index) => {
    const issues = [];
    
    if (!acc.name) issues.push('nom manquant');
    if (!acc.description) issues.push('description manquante');
    if (!acc.address) issues.push('adresse manquante');
    if (!acc.phone) issues.push('téléphone manquant');
    if (!acc.email) issues.push('email manquant');
    if (!acc.lat || !acc.lng) issues.push('coordonnées manquantes');
    if (!acc.features || acc.features.length === 0) issues.push('caractéristiques manquantes');

    if (issues.length > 0) {
      console.log(`❌ ${acc.name}: ${issues.join(', ')}`);
      missingFields++;
    }
  });

  if (missingFields === 0) {
    console.log('✅ Tous les champs obligatoires sont remplis');
  } else {
    console.log(`❌ ${missingFields} hébergements ont des champs manquants`);
  }
  console.log('');

  // Vérification des images
  console.log('🖼️ Vérification des images:');
  let missingImages = 0;

  accommodations.forEach((acc) => {
    const hasFeature = !!acc.featured_image;
    const hasGallery = acc.gallery_images && acc.gallery_images.length > 0;
    
    if (!hasFeature || !hasGallery) {
      console.log(`❌ ${acc.name}: ${!hasFeature ? 'image principale manquante' : ''} ${!hasGallery ? 'galerie manquante' : ''}`);
      missingImages++;
    }
  });

  if (missingImages === 0) {
    console.log('✅ Toutes les images sont présentes');
  } else {
    console.log(`❌ ${missingImages} hébergements ont des images manquantes`);
  }
  console.log('');

  // Détail de chaque hébergement
  console.log('📋 Détail des hébergements:\n');
  accommodations.forEach((acc, index) => {
    console.log(`${index + 1}. ${acc.name}`);
    console.log(`   🏷️ Type: ${acc.type} | 👥 Capacité: ${acc.capacity} personnes`);
    console.log(`   📍 ${acc.address} (${acc.village})`);
    console.log(`   🗺️ Coordonnées: ${acc.lat}, ${acc.lng}`);
    console.log(`   📞 ${acc.phone} | ✉️ ${acc.email}`);
    if (acc.website) console.log(`   🌐 ${acc.website}`);
    if (acc.facebook) console.log(`   📘 Facebook`);
    console.log(`   🖼️ Image principale: ${acc.featured_image ? '✅' : '❌'}`);
    console.log(`   🖼️ Galerie: ${acc.gallery_images ? acc.gallery_images.length : 0} images`);
    console.log(`   ⭐ Caractéristiques: ${acc.features ? acc.features.length : 0}`);
    console.log(`   🏠 Équipements: ${acc.amenities ? acc.amenities.length : 0}`);
    console.log(`   💰 Gamme de prix: ${acc.price_range || 'Non définie'}`);
    console.log(`   📊 Statut: ${acc.status}`);
    console.log('');
  });

  // Résumé final
  console.log('🎯 Résumé de la vérification:');
  console.log(`✅ Hébergements total: ${accommodations.length}`);
  console.log(`✅ Hébergements publiés: ${accommodations.filter(a => a.status === 'published').length}`);
  console.log(`✅ Avec coordonnées: ${accommodations.filter(a => a.lat && a.lng).length}`);
  console.log(`✅ Avec images: ${accommodations.filter(a => a.featured_image && a.gallery_images?.length > 0).length}`);
  console.log(`✅ Avec caractéristiques: ${accommodations.filter(a => a.features?.length > 0).length}`);
  
  const allComplete = accommodations.every(acc => 
    acc.name && acc.description && acc.address && acc.phone && acc.email && 
    acc.lat && acc.lng && acc.featured_image && acc.gallery_images?.length > 0 &&
    acc.features?.length > 0
  );
  
  console.log(`\n${allComplete ? '🎉' : '⚠️'} État général: ${allComplete ? 'COMPLET' : 'INCOMPLET'}`);
}

// Exécution du script
verifyAccommodations()
  .then(() => {
    console.log('\n✅ Vérification terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });