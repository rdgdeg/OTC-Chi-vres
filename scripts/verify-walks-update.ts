/**
 * Script de vérification pour s'assurer que la mise à jour des balades s'est bien déroulée
 */

import { supabase } from '../services/supabaseClient';
import { WALKS } from '../data/mockData';

export const verifyWalksUpdate = async () => {
  console.log('🔍 Vérification de la mise à jour des balades...\n');

  try {
    // 1. Vérifier le nombre de balades
    const { data: walks, error: countError } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'walk');

    if (countError) {
      console.error('❌ Erreur lors de la récupération des balades:', countError);
      return false;
    }

    console.log(`📊 Nombre de balades dans la DB: ${walks?.length || 0}`);
    console.log(`📊 Nombre de balades attendues: ${WALKS.length}`);

    if (walks?.length !== WALKS.length) {
      console.error(`❌ Nombre incorrect de balades. Attendu: ${WALKS.length}, Trouvé: ${walks?.length}`);
      return false;
    }

    console.log('✅ Nombre de balades correct\n');

    // 2. Vérifier que toutes les balades attendues sont présentes
    const expectedIds = WALKS.map(w => w.id);
    const foundIds = walks?.map(w => w.id) || [];
    
    const missingIds = expectedIds.filter(id => !foundIds.includes(id));
    const extraIds = foundIds.filter(id => !expectedIds.includes(id));

    if (missingIds.length > 0) {
      console.error('❌ Balades manquantes:', missingIds);
      return false;
    }

    if (extraIds.length > 0) {
      console.warn('⚠️ Balades supplémentaires trouvées:', extraIds);
    }

    console.log('✅ Toutes les balades attendues sont présentes\n');

    // 3. Vérifier les champs requis
    const requiredFields = ['name', 'description', 'address', 'distance', 'duration', 'difficulty'];
    let fieldsOk = true;

    walks?.forEach((walk, index) => {
      requiredFields.forEach(field => {
        if (!walk[field]) {
          console.error(`❌ Balade "${walk.name}" (${walk.id}): champ "${field}" manquant`);
          fieldsOk = false;
        }
      });
    });

    if (!fieldsOk) {
      return false;
    }

    console.log('✅ Tous les champs requis sont présents\n');

    // 4. Vérifier les liens de téléchargement
    const walksWithDownloadUrl = walks?.filter(w => w.download_url) || [];
    console.log(`📥 Balades avec lien de téléchargement: ${walksWithDownloadUrl.length}`);

    walksWithDownloadUrl.forEach(walk => {
      console.log(`   • ${walk.name}: ${walk.download_url}`);
    });

    // 5. Vérifier le contenu de la page
    const { data: pageContent, error: pageError } = await supabase
      .from('page_content')
      .select('*')
      .eq('id', 'walks')
      .single();

    if (pageError) {
      console.error('❌ Erreur lors de la récupération du contenu de page:', pageError);
      return false;
    }

    if (!pageContent) {
      console.error('❌ Contenu de la page balades non trouvé');
      return false;
    }

    console.log('\n📄 Contenu de la page balades:');
    console.log(`   Titre: ${pageContent.hero_title}`);
    console.log(`   Sous-titre: ${pageContent.hero_subtitle}`);
    console.log(`   Intro: ${pageContent.intro_title}`);

    if (pageContent.hero_title !== 'Découvrir - Balades') {
      console.error('❌ Titre de page incorrect');
      return false;
    }

    console.log('✅ Contenu de la page correct\n');

    // 6. Résumé des balades par difficulté
    const difficulties = walks?.reduce((acc: any, walk) => {
      acc[walk.difficulty] = (acc[walk.difficulty] || 0) + 1;
      return acc;
    }, {}) || {};

    console.log('📈 Répartition par difficulté:');
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`   ${difficulty}: ${count} circuit(s)`);
    });

    console.log('\n🎉 Vérification terminée avec succès !');
    console.log('✅ Toutes les balades ont été correctement mises à jour');

    return true;

  } catch (error) {
    console.error('💥 Erreur lors de la vérification:', error);
    return false;
  }
};

// Fonction pour afficher un rapport détaillé
export const generateWalksReport = async () => {
  console.log('📋 RAPPORT DÉTAILLÉ DES BALADES');
  console.log('================================\n');

  try {
    const { data: walks, error } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'walk')
      .order('name');

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    walks?.forEach((walk, index) => {
      console.log(`${index + 1}. ${walk.name}`);
      console.log(`   ID: ${walk.id}`);
      console.log(`   📍 ${walk.address}`);
      console.log(`   📏 ${walk.distance} - ⏱️ ${walk.duration} - 🎯 ${walk.difficulty}`);
      console.log(`   🏷️ Tags: ${walk.tags?.join(', ') || 'Aucun'}`);
      
      if (walk.download_url) {
        console.log(`   🔗 Téléchargement: ${walk.download_url}`);
      }
      
      if (walk.document_url) {
        console.log(`   📄 Document: ${walk.document_url}`);
      }
      
      console.log(`   📝 Description: ${walk.description.substring(0, 100)}...`);
      console.log('');
    });

    console.log(`Total: ${walks?.length} balades dans la base de données`);

  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
  }
};

// Fonction pour comparer avec les données mockData
export const compareWithMockData = async () => {
  console.log('🔄 COMPARAISON AVEC LES DONNÉES MOCKDATA');
  console.log('========================================\n');

  try {
    const { data: dbWalks, error } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'walk');

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    const differences: string[] = [];

    WALKS.forEach(mockWalk => {
      const dbWalk = dbWalks?.find(w => w.id === mockWalk.id);
      
      if (!dbWalk) {
        differences.push(`❌ Balade "${mockWalk.name}" manquante dans la DB`);
        return;
      }

      // Comparer les champs principaux
      const fieldsToCompare = ['name', 'description', 'address', 'distance', 'duration', 'difficulty'];
      
      fieldsToCompare.forEach(field => {
        if (mockWalk[field as keyof typeof mockWalk] !== dbWalk[field]) {
          differences.push(`⚠️ ${mockWalk.name}: "${field}" différent (Mock: "${mockWalk[field as keyof typeof mockWalk]}" vs DB: "${dbWalk[field]}")`);
        }
      });
    });

    if (differences.length === 0) {
      console.log('✅ Toutes les données correspondent parfaitement !');
    } else {
      console.log('⚠️ Différences détectées:');
      differences.forEach(diff => console.log(`   ${diff}`));
    }

  } catch (error) {
    console.error('Erreur lors de la comparaison:', error);
  }
};