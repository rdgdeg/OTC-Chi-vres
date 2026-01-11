#!/usr/bin/env node

/**
 * Script de vérification rapide de l'état des hébergements
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

async function checkAccommodationsStatus() {
  console.log('🔍 Vérification rapide de l\'état des hébergements...\n');

  try {
    // Récupérer tous les hébergements
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('id, name, village, type, capacity, gallery_images, amenities, price_range, featured_image')
      .order('name');

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error.message);
      return;
    }

    if (!accommodations || accommodations.length === 0) {
      console.log('❌ Aucun hébergement trouvé dans la base de données');
      return;
    }

    console.log(`📊 Total des hébergements: ${accommodations.length}\n`);

    // Statistiques générales
    const stats = {
      total: accommodations.length,
      withGallery: accommodations.filter(a => a.gallery_images && a.gallery_images.length > 0).length,
      withAmenities: accommodations.filter(a => a.amenities && a.amenities.length > 0).length,
      withPrice: accommodations.filter(a => a.price_range).length,
      withFeaturedImage: accommodations.filter(a => a.featured_image).length
    };

    console.log('📈 Statistiques générales:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  Avec galerie: ${stats.withGallery}/${stats.total} ${stats.withGallery === stats.total ? '✅' : '❌'}`);
    console.log(`  Avec équipements: ${stats.withAmenities}/${stats.total} ${stats.withAmenities === stats.total ? '✅' : '❌'}`);
    console.log(`  Avec prix: ${stats.withPrice}/${stats.total} ${stats.withPrice === stats.total ? '✅' : '❌'}`);
    console.log(`  Avec image principale: ${stats.withFeaturedImage}/${stats.total} ${stats.withFeaturedImage === stats.total ? '✅' : '❌'}`);
    console.log('');

    // Détail par hébergement
    console.log('📋 Détail par hébergement:\n');
    accommodations.forEach((acc, index) => {
      const galleryCount = acc.gallery_images?.length || 0;
      const amenitiesCount = acc.amenities?.length || 0;
      const hasPrice = !!acc.price_range;
      const hasFeaturedImage = !!acc.featured_image;
      
      const isComplete = galleryCount > 0 && amenitiesCount > 0 && hasPrice && hasFeaturedImage;
      
      console.log(`${index + 1}. ${acc.name} (${acc.village}) ${isComplete ? '✅' : '❌'}`);
      console.log(`   Type: ${acc.type} | Capacité: ${acc.capacity} pers.`);
      console.log(`   🖼️ Image principale: ${hasFeaturedImage ? '✅' : '❌'}`);
      console.log(`   🖼️ Galerie: ${galleryCount} images ${galleryCount > 0 ? '✅' : '❌'}`);
      console.log(`   🏠 Équipements: ${amenitiesCount} ${amenitiesCount > 0 ? '✅' : '❌'}`);
      console.log(`   💰 Prix: ${acc.price_range || 'Non défini'} ${hasPrice ? '✅' : '❌'}`);
      console.log('');
    });

    // Résumé final
    const completeCount = accommodations.filter(acc => 
      acc.gallery_images?.length > 0 && 
      acc.amenities?.length > 0 && 
      acc.price_range &&
      acc.featured_image
    ).length;

    console.log('🎯 RÉSUMÉ FINAL:');
    console.log(`Hébergements complets: ${completeCount}/${accommodations.length}`);
    
    if (completeCount === accommodations.length) {
      console.log('🎉 Tous les hébergements sont complets !');
      console.log('✅ Votre système est prêt pour les visiteurs');
    } else {
      console.log('⚠️ Action requise pour finaliser les hébergements');
      console.log('📝 Utilisez le script SQL dans migrations/update-accommodations-only.sql');
      console.log('🔗 Ou suivez le guide: GUIDE-CORRECTION-MANUELLE-HEBERGEMENTS.md');
    }

  } catch (err) {
    console.error('💥 Erreur inattendue:', err.message);
  }
}

// Exécution du script
checkAccommodationsStatus()
  .then(() => {
    console.log('\n✅ Vérification terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });