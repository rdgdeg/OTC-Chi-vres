#!/usr/bin/env node

/**
 * Script pour corriger les galeries d'images manquantes
 * Force l'ajout des galeries même si l'image principale existe
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

// Images par défaut par type d'hébergement
const defaultImages = {
  bed_breakfast: {
    featured: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ]
  },
  gite: {
    featured: 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ]
  },
  unusual: {
    featured: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ]
  }
};

// Images spécifiques pour certains hébergements
const specificImages = {
  'moulin-du-domissart': {
    featured: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ]
  },
  'les-greniers-du-moulin': {
    featured: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ]
  },
  'levasion-yacht': {
    featured: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ]
  },
  'on-dirait-le-sud': {
    featured: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ]
  }
};

async function fixGalleryImages() {
  console.log('🔧 Correction des galeries d\'images manquantes...\n');

  // Récupérer tous les hébergements
  const { data: accommodations, error: fetchError } = await supabase
    .from('accommodations')
    .select('id, name, type, featured_image, gallery_images');

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des hébergements:', fetchError.message);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const accommodation of accommodations) {
    try {
      console.log(`🖼️ Correction: ${accommodation.name}...`);
      
      // Déterminer les images à utiliser
      let images;
      if (specificImages[accommodation.id]) {
        images = specificImages[accommodation.id];
      } else {
        images = defaultImages[accommodation.type] || defaultImages.gite;
      }

      // Forcer la mise à jour des galeries
      const { error } = await supabase
        .from('accommodations')
        .update({
          gallery_images: images.gallery,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodation.id);

      if (error) {
        console.error(`❌ Erreur pour ${accommodation.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Galerie corrigée pour ${accommodation.name} (${images.gallery.length} images)`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${accommodation.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la correction:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total traité: ${accommodations.length}`);

  // Vérification finale
  console.log('\n🔍 Vérification des galeries corrigées...');
  const { data: finalData, error: finalError } = await supabase
    .from('accommodations')
    .select('id, name, featured_image, gallery_images')
    .order('name');

  if (finalError) {
    console.error('❌ Erreur lors de la vérification:', finalError.message);
  } else {
    console.log('\n📋 État final des images:');
    finalData.forEach((acc, index) => {
      const hasFeature = acc.featured_image ? '✅' : '❌';
      const galleryCount = acc.gallery_images ? acc.gallery_images.length : 0;
      console.log(`${index + 1}. ${acc.name}`);
      console.log(`   Image principale: ${hasFeature}`);
      console.log(`   Galerie: ${galleryCount} images ${galleryCount > 0 ? '✅' : '❌'}`);
      console.log('');
    });
  }
}

// Exécution du script
fixGalleryImages()
  .then(() => {
    console.log('🎉 Correction des galeries terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });