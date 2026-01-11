#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

// Contenu attendu selon le texte fourni par l'utilisateur
const expectedContent = {
  'la-loge-bed-breakfast': {
    name: 'La Loge Bed & Breakfast',
    type: 'bed_breakfast',
    village: 'Vaudignies',
    capacity: 4,
    features: [
      'Accueil personnalisé et convivial',
      'Appartement lumineux et confortable', 
      'Option petit-déjeuner inclus',
      'Proximité des balades et circuits touristiques'
    ]
  },
  'au-sentier-chauchaut': {
    name: 'Au sentier Chauchaut',
    type: 'bed_breakfast',
    village: 'Chièvres',
    capacity: 5,
    features: [
      'Maison chargée d\'histoire, atmosphère authentique',
      'Chambres confortables',
      'Proximité des balades, du patrimoine et des circuits touristiques',
      'À deux pas de Pairi Daiza et des villes d\'art comme Mons et Tournai'
    ]
  },
  'moulin-du-domissart': {
    name: 'Moulin du Domissart',
    type: 'gite',
    village: 'Grosage',
    capacity: 24,
    features: [
      'Cadre unique dans un moulin à eau historique du XVIᵉ siècle',
      'Capacité totale de 24 personnes répartie sur 4 gîtes',
      'Atmosphère apaisante, parfaite pour se ressourcer',
      'Proximité des balades, circuits touristiques et villages voisins',
      'Espace Wellness',
      'Ménage inclus'
    ]
  }
};

async function verifyFinalState() {
  try {
    console.log('🔍 VÉRIFICATION FINALE DU SYSTÈME D\'HÉBERGEMENTS');
    console.log('='.repeat(60));
    
    // Récupérer tous les hébergements
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log(`\n📊 STATISTIQUES GÉNÉRALES`);
    console.log(`Total hébergements: ${accommodations.length}`);
    console.log(`Publiés: ${accommodations.filter(a => a.status === 'published').length}`);
    console.log(`Avec images: ${accommodations.filter(a => a.featured_image).length}`);
    console.log(`Avec caractéristiques: ${accommodations.filter(a => a.features && a.features.length > 0).length}`);
    
    console.log(`\n📋 VÉRIFICATION DÉTAILLÉE`);
    console.log('-'.repeat(60));
    
    let allCorrect = true;
    
    accommodations.forEach(acc => {
      const hasImage = acc.featured_image ? '🖼️' : '❌';
      const isPublished = acc.status === 'published' ? '✅' : '⏳';
      const featuresCount = acc.features ? acc.features.length : 0;
      const hasFeatures = featuresCount > 0 ? '✅' : '❌';
      
      console.log(`\n${acc.name}`);
      console.log(`  ${isPublished} Statut: ${acc.status}`);
      console.log(`  ${hasImage} Image: ${acc.featured_image ? 'Présente' : 'Manquante'}`);
      console.log(`  ${hasFeatures} Caractéristiques: ${featuresCount}`);
      console.log(`  📍 Village: ${acc.village || 'Non spécifié'}`);
      console.log(`  👥 Capacité: ${acc.capacity} personnes`);
      console.log(`  🏠 Type: ${acc.type}`);
      
      // Vérifier le contenu pour quelques hébergements clés
      if (expectedContent[acc.id]) {
        const expected = expectedContent[acc.id];
        const nameOk = acc.name === expected.name;
        const typeOk = acc.type === expected.type;
        const villageOk = acc.village === expected.village;
        const capacityOk = acc.capacity === expected.capacity;
        
        console.log(`  🎯 Contenu: ${nameOk && typeOk && villageOk && capacityOk ? '✅' : '❌'}`);
        
        if (!nameOk) console.log(`    ❌ Nom: attendu "${expected.name}", trouvé "${acc.name}"`);
        if (!typeOk) console.log(`    ❌ Type: attendu "${expected.type}", trouvé "${acc.type}"`);
        if (!villageOk) console.log(`    ❌ Village: attendu "${expected.village}", trouvé "${acc.village}"`);
        if (!capacityOk) console.log(`    ❌ Capacité: attendu ${expected.capacity}, trouvé ${acc.capacity}`);
        
        // Vérifier les caractéristiques
        if (acc.features && expected.features) {
          const missingFeatures = expected.features.filter(f => !acc.features.includes(f));
          if (missingFeatures.length > 0) {
            console.log(`    ❌ Caractéristiques manquantes: ${missingFeatures.length}`);
            allCorrect = false;
          } else {
            console.log(`    ✅ Toutes les caractéristiques présentes`);
          }
        }
      }
      
      if (!acc.featured_image) allCorrect = false;
    });
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 RÉSULTAT FINAL: ${allCorrect ? '✅ TOUT EST CORRECT' : '⚠️ IMAGES MANQUANTES'}`);
    
    if (!allCorrect) {
      console.log(`\n📝 ACTIONS REQUISES:`);
      console.log(`1. Exécuter le script SQL: scripts/add-images-manual.sql`);
      console.log(`2. Ou utiliser l'interface: add-images-admin.html`);
      console.log(`3. Vérifier l'admin: http://localhost:5173 (si serveur démarré)`);
    } else {
      console.log(`\n🎉 Le système d'hébergements est complet et fonctionnel!`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

verifyFinalState();