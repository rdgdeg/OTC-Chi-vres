/**
 * Script pour mettre à jour spécifiquement les balades dans la base de données Supabase
 * Utilise les nouvelles données du brief client
 */

import { supabase } from '../services/supabaseClient';
import { WALKS } from '../data/mockData';

// Fonction pour convertir les données mockData au format Supabase (camelCase existant)
const convertWalkForDatabase = (walk: any) => {
  return {
    id: walk.id,
    name: walk.name,
    description: walk.description,
    address: walk.address,
    imageUrl: walk.imageUrl,
    type: walk.type,
    lat: walk.lat,
    lng: walk.lng,
    distance: walk.distance,
    duration: walk.duration,
    difficulty: walk.difficulty,
    downloadUrl: walk.downloadUrl, // Garder camelCase
    documentUrl: walk.documentUrl, // Garder camelCase
    tags: walk.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const updateWalksInDatabase = async () => {
  try {
    console.log('🚀 Début de la mise à jour des balades dans la base de données...');
    
    // 1. Supprimer toutes les anciennes balades
    const { error: deleteError } = await supabase
      .from('places')
      .delete()
      .eq('type', 'walk');
    
    if (deleteError) {
      console.error('❌ Erreur lors de la suppression des anciennes balades:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Anciennes balades supprimées');
    
    // 2. Convertir et insérer les nouvelles balades
    const walksForDatabase = WALKS.map(convertWalkForDatabase);
    
    const { error: insertError } = await supabase
      .from('places')
      .insert(walksForDatabase);
    
    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion des nouvelles balades:', insertError);
      throw insertError;
    }
    
    console.log('✅ Nouvelles balades insérées avec succès');
    
    // 3. Mettre à jour le contenu de la page balades (camelCase)
    const walksPageContent = {
      id: 'walks',
      heroTitle: 'Découvrir - Balades',
      heroSubtitle: 'Partez à la découverte de Chièvres et de ses campagnes ! Que ce soit à pied, à cheval ou à vélo, succombez au charme d\'un territoire riche en paysages, en patrimoine et en histoire.',
      heroImage: 'https://picsum.photos/id/1036/1920/600',
      introTitle: 'Cinq circuits soigneusement repérés',
      introText: 'Cinq circuits soigneusement repérés vous guident à travers moulins, rivières, hameaux pittoresques ou encore, les allées de la cité. Téléchargez votre tracé et préparez-vous à vivre une balade au grand air… vous ne serez pas déçus !',
      updated_at: new Date().toISOString()
    };
    
    const { error: pageError } = await supabase
      .from('page_content')
      .upsert(walksPageContent);
    
    if (pageError) {
      console.error('❌ Erreur lors de la mise à jour du contenu de la page:', pageError);
      throw pageError;
    }
    
    console.log('✅ Contenu de la page balades mis à jour');
    
    console.log('🎉 Mise à jour terminée avec succès !');
    
    return {
      success: true,
      message: 'Balades mises à jour avec succès dans la base de données',
      walksCount: WALKS.length
    };
    
  } catch (error) {
    console.error('💥 Erreur lors de la mise à jour:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour des balades',
      error: error
    };
  }
};

// Fonction pour vérifier les données avant mise à jour
export const verifyWalksData = () => {
  console.log('🔍 Vérification des données des balades...');
  
  const requiredFields = ['id', 'name', 'description', 'address', 'type', 'distance', 'duration', 'difficulty'];
  const issues: string[] = [];
  
  WALKS.forEach((walk, index) => {
    requiredFields.forEach(field => {
      if (!walk[field as keyof typeof walk]) {
        issues.push(`Balade ${index + 1} (${walk.name || 'Sans nom'}): champ '${field}' manquant`);
      }
    });
    
    if (walk.type !== 'walk') {
      issues.push(`Balade ${index + 1} (${walk.name}): type incorrect (${walk.type} au lieu de 'walk')`);
    }
  });
  
  if (issues.length > 0) {
    console.warn('⚠️ Problèmes détectés:', issues);
    return { valid: false, issues };
  }
  
  console.log('✅ Toutes les données sont valides');
  console.log(`📊 ${WALKS.length} balades prêtes à être synchronisées`);
  
  return { valid: true, count: WALKS.length };
};

// Fonction utilitaire pour afficher un résumé des balades
export const displayWalksSummary = () => {
  console.log('\n📋 RÉSUMÉ DES NOUVELLES BALADES:');
  console.log('================================');
  
  WALKS.forEach((walk, index) => {
    console.log(`${index + 1}. ${walk.name}`);
    console.log(`   📍 ${walk.address}`);
    console.log(`   📏 ${walk.distance} - ⏱️ ${walk.duration} - 🎯 ${walk.difficulty}`);
    if (walk.downloadUrl) {
      console.log(`   🔗 Lien: ${walk.downloadUrl}`);
    }
    if (walk.documentUrl) {
      console.log(`   📄 Document: ${walk.documentUrl}`);
    }
    console.log('');
  });
  
  console.log(`Total: ${WALKS.length} circuits de balades`);
};

// Fonction pour vérifier si les colonnes existent (camelCase)
export const checkDatabaseSchema = async () => {
  try {
    console.log('🔍 Vérification du schéma de la base de données...');
    
    const { data, error } = await supabase
      .from('places')
      .select('downloadUrl, documentUrl')
      .limit(1);
    
    if (error) {
      if (error.message.includes('downloadUrl') || error.message.includes('documentUrl')) {
        console.error('❌ Les colonnes downloadUrl et/ou documentUrl n\'existent pas dans la table places');
        console.log('💡 Veuillez exécuter le script de migration: migrations/add-walks-columns.sql');
        return { valid: false, needsMigration: true };
      }
      throw error;
    }
    
    console.log('✅ Schéma de la base de données correct');
    return { valid: true, needsMigration: false };
    
  } catch (error) {
    console.error('💥 Erreur lors de la vérification du schéma:', error);
    return { valid: false, needsMigration: true, error };
  }
};