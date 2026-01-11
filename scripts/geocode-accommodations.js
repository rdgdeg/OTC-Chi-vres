#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

// Géocodage via Nominatim (OpenStreetMap)
async function geocodeAddress(address, village) {
  try {
    const fullAddress = village ? `${address}, ${village}, Chièvres, Belgique` : `${address}, Chièvres, Belgique`;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    console.log(`   🔍 Recherche: ${fullAddress}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=be`
    );
    
    if (!response.ok) {
      throw new Error('Erreur API');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('   ❌ Erreur géocodage:', error.message);
    return null;
  }
}

async function geocodeAllAccommodations() {
  try {
    console.log('🗺️ GÉOCODAGE AUTOMATIQUE DES HÉBERGEMENTS');
    console.log('='.repeat(60));
    
    // Récupérer tous les hébergements
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('id, name, address, village, lat, lng')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log(`📋 ${accommodations.length} hébergements à géocoder`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const accommodation of accommodations) {
      console.log(`\n📍 ${accommodation.name}`);
      
      // Vérifier si déjà géocodé
      if (accommodation.lat && accommodation.lng) {
        console.log(`   ✅ Déjà géocodé: ${accommodation.lat.toFixed(4)}, ${accommodation.lng.toFixed(4)}`);
        skipCount++;
        continue;
      }
      
      if (!accommodation.address) {
        console.log(`   ⚠️ Pas d'adresse`);
        errorCount++;
        continue;
      }
      
      // Géocoder l'adresse
      const coords = await geocodeAddress(accommodation.address, accommodation.village);
      
      if (coords) {
        console.log(`   ✅ Trouvé: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        console.log(`   📍 ${coords.display_name}`);
        
        // Mettre à jour en base
        const { error: updateError } = await supabase
          .from('accommodations')
          .update({
            lat: coords.lat,
            lng: coords.lng,
            updated_at: new Date().toISOString()
          })
          .eq('id', accommodation.id);
        
        if (updateError) {
          console.log(`   ❌ Erreur mise à jour: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   💾 Sauvegardé en base`);
          successCount++;
        }
      } else {
        console.log(`   ❌ Adresse non trouvée`);
        
        // Utiliser les coordonnées par défaut de Chièvres
        const defaultCoords = { lat: 50.5897, lng: 3.8014 };
        
        const { error: updateError } = await supabase
          .from('accommodations')
          .update({
            lat: defaultCoords.lat,
            lng: defaultCoords.lng,
            updated_at: new Date().toISOString()
          })
          .eq('id', accommodation.id);
        
        if (!updateError) {
          console.log(`   🎯 Coordonnées par défaut appliquées`);
          successCount++;
        } else {
          errorCount++;
        }
      }
      
      // Pause pour respecter l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTATS DU GÉOCODAGE');
    console.log(`✅ Géocodés avec succès: ${successCount}`);
    console.log(`⏭️ Déjà géocodés: ${skipCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📍 Total: ${accommodations.length}`);
    
    // Vérification finale
    console.log('\n🔍 VÉRIFICATION FINALE');
    const { data: finalCheck, error: finalError } = await supabase
      .from('accommodations')
      .select('name, address, lat, lng')
      .order('name');
    
    if (!finalError) {
      finalCheck.forEach(acc => {
        const hasCoords = acc.lat && acc.lng ? '🗺️' : '❌';
        console.log(`${hasCoords} ${acc.name}: ${acc.lat ? acc.lat.toFixed(4) : 'N/A'}, ${acc.lng ? acc.lng.toFixed(4) : 'N/A'}`);
      });
    }
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('1. Tester la carte sur: http://localhost:5173/hebergements');
    console.log('2. Vérifier que tous les marqueurs s\'affichent');
    console.log('3. Les coordonnées sont maintenant disponibles dans l\'admin');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

geocodeAllAccommodations();