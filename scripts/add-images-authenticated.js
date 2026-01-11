#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping des images pour chaque hébergement
const imageMapping = {
  'la-loge-bed-breakfast': 'https://picsum.photos/id/1001/600/400',
  'au-sentier-chauchaut': 'https://picsum.photos/id/1002/600/400',
  'la-maison-dacote': 'https://picsum.photos/id/1003/600/400',
  'au-champ-du-bouillon': 'https://picsum.photos/id/1004/600/400',
  'les-greniers-du-moulin': 'https://picsum.photos/id/1005/600/400',
  'levasion-yacht': 'https://picsum.photos/id/1006/600/400',
  'moulin-du-domissart': 'https://picsum.photos/id/1007/600/400',
  'chez-les-kikis': 'https://picsum.photos/id/1008/600/400',
  'on-dirait-le-sud': 'https://picsum.photos/id/1009/600/400'
};

async function addImagesWithAuth() {
  try {
    console.log('🔐 Tentative d\'authentification...');
    
    // Essayer de s'authentifier avec un utilisateur test
    // Note: En production, vous devriez avoir un utilisateur admin configuré
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.log('⚠️ Authentification anonyme échouée, continuons sans auth:', authError.message);
    } else {
      console.log('✅ Authentification réussie');
    }
    
    console.log('🖼️ Ajout des images aux hébergements...');
    
    // Récupérer tous les hébergements
    const { data: accommodations, error: fetchError } = await supabase
      .from('accommodations')
      .select('id, name, slug, featured_image')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Erreur lors de la lecture:', fetchError);
      return;
    }
    
    console.log(`📋 ${accommodations.length} hébergements trouvés`);
    
    // Mettre à jour chaque hébergement avec son image
    let successCount = 0;
    for (const accommodation of accommodations) {
      const imageUrl = imageMapping[accommodation.id];
      
      if (imageUrl) {
        console.log(`🔄 Mise à jour de "${accommodation.name}"...`);
        
        // Essayer différentes approches
        try {
          // Approche 1: Update simple
          const { data: updateData, error: updateError } = await supabase
            .from('accommodations')
            .update({ featured_image: imageUrl })
            .eq('id', accommodation.id);
          
          if (updateError) {
            console.error(`❌ Erreur pour ${accommodation.name}:`, updateError);
          } else {
            console.log(`✅ Image ajoutée pour "${accommodation.name}"`);
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Exception pour ${accommodation.name}:`, error);
        }
      } else {
        console.log(`⚠️ Pas d'image trouvée pour "${accommodation.name}" (ID: ${accommodation.id})`);
      }
    }
    
    console.log(`\n📊 ${successCount} mises à jour effectuées`);
    
    // Vérification finale avec un délai
    console.log('⏳ Attente de 2 secondes avant vérification...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: updatedAccommodations, error: finalError } = await supabase
      .from('accommodations')
      .select('id, name, featured_image')
      .order('name');
    
    if (finalError) {
      console.error('❌ Erreur lors de la vérification:', finalError);
      return;
    }
    
    const withImages = updatedAccommodations.filter(a => a.featured_image).length;
    console.log(`\n📊 Résultat final: ${withImages}/${updatedAccommodations.length} hébergements ont une image`);
    
    updatedAccommodations.forEach(acc => {
      const hasImage = acc.featured_image ? '🖼️' : '❌';
      console.log(`  ${hasImage} ${acc.name}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

addImagesWithAuth();