#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

// Contenu exact fourni par l'utilisateur
const expectedAccommodations = [
  {
    name: 'La Loge Bed & Breakfast',
    village: 'Vaudignies',
    type: 'bed_breakfast',
    capacity: 4, // "2 à 4 personnes"
    address: 'Rue de Ladeuze, 1 – Vaudignies',
    phone: '0472 65 32 01',
    email: 'laloge@outlook.be',
    facebook: 'Page Facebook',
    description: 'Séjournez dans un appartement chaleureux au cœur du hameau de Vaudignies. Profitez d\'un cadre cosy et lumineux avec option petit-déjeuner, idéal pour découvrir Chièvres et ses villages environnants.',
    features: [
      'Accueil personnalisé et convivial',
      'Appartement lumineux et confortable',
      'Option petit-déjeuner inclus',
      'Proximité des balades et circuits touristiques'
    ]
  },
  {
    name: 'Au sentier Chauchaut',
    village: 'Chièvres',
    type: 'bed_breakfast',
    capacity: 5, // "3 à 5 personnes"
    address: 'Sentier Chauchaut, 1',
    phone: '0473 96 11 94',
    email: 'ostchr1968@gmail.com',
    website: 'www.ausentierchauchaut.com',
    description: 'Séjournez dans une ancienne ferme du XIXᵉ siècle rénovée avec soin pour allier confort moderne et charme authentique. Profitez d\'un moment de calme et de l\'accueil chaleureux de M. et Mme Ost‑Nasdrovisky.',
    features: [
      'Maison chargée d\'histoire, atmosphère authentique',
      'Chambres confortables',
      'Proximité des balades, du patrimoine et des circuits touristiques',
      'À deux pas de Pairi Daiza et des villes d\'art comme Mons et Tournai'
    ]
  },
  {
    name: 'La Maison d\'à côté',
    village: 'Tongre-Saint-Martin',
    type: 'gite',
    capacity: 5, // "5 personnes (2 chambres)"
    bedrooms: 2,
    address: 'Rue Emile Daubechies, 4',
    phone: '0474 78 71 99',
    email: 'winieckimic@gmail.com',
    website: 'www.lamaisondacote.be',
    description: 'Partie d\'une ancienne ferme rénovée datant de 1872, ce gîte 3 épis allie calme et confort au cœur de la campagne chiévroise. Idéal pour les familles ou petits groupes, il offre des moments de repos et des découvertes naturelles à pied ou à vélo, sur le GR 121 ou le RAVeL à proximité.',
    features: [
      'Gîte spacieux et confortable pour 5 personnes',
      'Tranquillité et cadre champêtre',
      'Balades à pied ou à vélo sur le GR 121 et le RAVeL',
      'À quelques minutes en voiture du célèbre Parc Pairi Daiza'
    ]
  },
  {
    name: 'Au Champ du Bouillon',
    village: 'Tongre-Notre-Dame',
    type: 'gite',
    capacity: 4, // "2 à 4 personnes"
    address: 'Rue de la Ladrerie, 12',
    phone: '0498 07 00 85',
    email: 'rogejoh@hotmail.com',
    facebook: 'https://www.facebook.com/profile.php?id=100064563347866',
    description: 'Séjournez dans ce gîte tout confort, parfait pour une escapade tranquille en couple ou en petit groupe. Profitez d\'un cadre paisible et d\'un espace bien-être privatif pour un séjour détente au cœur de la campagne chiévroise.',
    features: [
      'Confort moderne dans un cadre rural',
      'Espace bien-être privatif pour se relaxer',
      'Proximité des balades et circuits touristiques',
      'Accueil chaleureux et personnalisé'
    ]
  },
  {
    name: 'Les Greniers du Moulin',
    village: 'Grosage',
    type: 'gite',
    capacity: 8, // "8 personnes (3 chambres, 7 lits)"
    bedrooms: 3,
    address: 'Rue des Héros de Roumont, 26',
    phone: '0478 45 94 19',
    email: 'lafermedumoulin@skynet.be',
    facebook: 'https://www.facebook.com/profile.php?id=61552163278202',
    description: 'Séjournez dans ce gîte à la ferme et découvrez l\'authenticité de la campagne chiévroise. Avec un élevage de vaches Jersey sur place et un petit magasin fermier ouvert le samedi, vous pourrez profiter d\'un cadre naturel et goûter aux produits locaux. Idéal pour les familles ou groupes d\'amis, ce gîte spacieux est parfait pour se détendre et explorer les environs.',
    features: [
      'Gîte spacieux pour 8 personnes',
      'Ambiance authentique dans une ferme bio',
      'Proximité des sentiers de randonnée et balades à vélo',
      'Magasin à la ferme avec produits locaux (uniquement le samedi)'
    ]
  },
  {
    name: 'L\'Évasion',
    village: 'Ladeuze',
    type: 'unusual', // "Gîte sur un yacht"
    capacity: 6, // "6 personnes (3 chambres : 2 lits doubles, 1 lit superposé)"
    bedrooms: 3,
    address: 'Rue Grande Drève',
    phone: '0491 86 58 09',
    email: 'evasionyacht@hotmail.com',
    facebook: 'Page Facebook',
    description: 'Vivez une expérience unique en séjournant sur un yacht amarré à Ladeuze. Ce gîte insolite combine confort et originalité pour un séjour inoubliable au fil de l\'eau, idéal pour les familles ou petits groupes.',
    features: [
      'Séjour insolite sur un yacht au calme',
      '3 chambres confortables pour 6 personnes',
      'Cadre charmant au bord de l\'eau',
      'Proximité des balades le long du RAVel'
    ]
  },
  {
    name: 'Moulin du Domissart',
    village: 'Grosage',
    type: 'gite',
    capacity: 24, // "4 gîtes, jusqu'à 24 personnes"
    address: 'Rue Puits à Leval, 27',
    phone: '0477 13 22 99', // Premier numéro
    phone2: '0478 79 23 26', // Deuxième numéro
    email: 'info@moulin-a-eau.be',
    website: 'https://www.moulin-a-eau.be/',
    description: 'Bienvenue chez Aurore et Thomas, au Moulin du Domissart, un ancien moulin à eau du XVIᵉ siècle, restauré et transformé en 4 gîtes. Abritant d\'anciennes machines du moulin, vous aurez la sensation de séjourner dans un musée vivant. Plus qu\'un hébergement, c\'est un lieu apaisant et convivial, idéal pour les familles, groupes d\'amis ou team buildings professionnels. Bercé par le ruissellement de l\'eau, le Moulin du Domissart offre un cadre parfait pour promenades, escapades nature et découvertes de la campagne chiévroise. Un espace bien-être et un barbecue à disposition sont également disponibles pour des moments de détente et de convivialité.',
    features: [
      'Cadre unique dans un moulin à eau historique du XVIᵉ siècle',
      'Capacité totale de 24 personnes répartie sur 4 gîtes',
      'Atmosphère apaisante, parfaite pour se ressourcer',
      'Proximité des balades, circuits touristiques et villages voisins',
      'Espace Wellness',
      'Ménage inclus'
    ]
  },
  {
    name: 'Chez les Kikis',
    village: 'Chièvres',
    type: 'gite',
    capacity: 3, // "2 adultes + 1 adulte dans canapé-lit ou 2 petits enfants"
    address: 'Rue Royale, 28C',
    phone: '068 65 78 18',
    phone2: '0497 31 12 04', // "après 18h00"
    email: 'chezleskiki@gmail.com',
    description: 'Ce gîte rural tout confort, situé en contrebas de la Tour de Gavre et de l\'église St Martin de Chièvres, vous offre une escapade reposante au cœur de la ville. Idéal pour un couple ou une petite famille, il est également à proximité de la Casa des Aviateurs, pour profiter de paddle, laser game et mini foot.',
    features: [
      'Gîte cosy et confortable pour 2 à 3 personnes',
      'Cadre calme, au pied des monuments historiques de Chièvres',
      'Proximité des activités sportives et ludiques de la Casa des Aviateurs',
      'Idéal pour une escapade familiale ou reposante'
    ]
  },
  {
    name: 'On dirait le sud…',
    village: 'Ladeuze',
    type: 'bed_breakfast',
    capacity: 4, // "4 personnes (2 chambres : "Tintin" avec 2 lits simples, "Doux Repos" avec 1 lit double)"
    bedrooms: 2,
    address: 'Rue de la Gare, 11B',
    phone: '0477 99 59 27',
    phone2: '0478 35 89 57',
    email: 'duquesnereal@hotmail.be',
    description: 'Profitez d\'un séjour convivial et reposant dans cette chambre d\'hôtes chaleureuse. Idéal pour familles ou petits groupes, ce lieu charmant vous permettra de découvrir Ladeuze et la campagne chiévroise en toute tranquillité.',
    features: [
      '2 chambres confortables pour 4 personnes',
      'Piscine extérieure pour se rafraîchir',
      'Petit déjeuner fabuleux préparé par le chef Réal',
      'Ambiance chaleureuse et accueillante',
      'Proximité des balades, circuits touristiques et villages voisins'
    ]
  }
];

async function verifyExactContent() {
  try {
    console.log('🔍 VÉRIFICATION DU CONTENU EXACT DES HÉBERGEMENTS');
    console.log('='.repeat(70));
    
    // Récupérer tous les hébergements de la base
    const { data: dbAccommodations, error } = await supabase
      .from('accommodations')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }
    
    console.log(`\n📊 COMPARAISON CONTENU FOURNI vs BASE DE DONNÉES`);
    console.log(`Hébergements attendus: ${expectedAccommodations.length}`);
    console.log(`Hébergements en base: ${dbAccommodations.length}`);
    
    let allCorrect = true;
    let foundCount = 0;
    
    expectedAccommodations.forEach((expected, index) => {
      console.log(`\n${index + 1}. ${expected.name}`);
      console.log('-'.repeat(50));
      
      // Chercher l'hébergement correspondant en base
      const dbAccommodation = dbAccommodations.find(db => 
        db.name === expected.name || 
        db.name.toLowerCase().includes(expected.name.toLowerCase().substring(0, 10))
      );
      
      if (!dbAccommodation) {
        console.log('❌ HÉBERGEMENT NON TROUVÉ EN BASE');
        allCorrect = false;
        return;
      }
      
      foundCount++;
      console.log('✅ Hébergement trouvé en base');
      
      // Vérifications détaillées
      const checks = [
        { field: 'Village', expected: expected.village, actual: dbAccommodation.village },
        { field: 'Type', expected: expected.type, actual: dbAccommodation.type },
        { field: 'Capacité', expected: expected.capacity, actual: dbAccommodation.capacity },
        { field: 'Adresse', expected: expected.address, actual: dbAccommodation.address },
        { field: 'Téléphone', expected: expected.phone, actual: dbAccommodation.phone },
        { field: 'Email', expected: expected.email, actual: dbAccommodation.email },
        { field: 'Site web', expected: expected.website, actual: dbAccommodation.website },
      ];
      
      if (expected.bedrooms) {
        checks.push({ field: 'Chambres', expected: expected.bedrooms, actual: dbAccommodation.bedrooms });
      }
      
      checks.forEach(check => {
        if (check.expected && check.actual) {
          const match = check.expected.toString().toLowerCase() === check.actual.toString().toLowerCase();
          console.log(`  ${match ? '✅' : '❌'} ${check.field}: ${match ? 'OK' : `Attendu "${check.expected}", trouvé "${check.actual}"`}`);
          if (!match) allCorrect = false;
        } else if (check.expected && !check.actual) {
          console.log(`  ❌ ${check.field}: Manquant (attendu "${check.expected}")`);
          allCorrect = false;
        } else if (check.actual) {
          console.log(`  ✅ ${check.field}: OK`);
        }
      });
      
      // Vérification de la description
      if (expected.description && dbAccommodation.description) {
        const descMatch = dbAccommodation.description.includes(expected.description.substring(0, 50));
        console.log(`  ${descMatch ? '✅' : '❌'} Description: ${descMatch ? 'OK' : 'Différente'}`);
        if (!descMatch) allCorrect = false;
      }
      
      // Vérification des caractéristiques
      if (expected.features && dbAccommodation.features) {
        const featuresMatch = expected.features.every(feature => 
          dbAccommodation.features.some(dbFeature => 
            dbFeature.toLowerCase().includes(feature.toLowerCase()) ||
            feature.toLowerCase().includes(dbFeature.toLowerCase())
          )
        );
        console.log(`  ${featuresMatch ? '✅' : '❌'} Caractéristiques: ${featuresMatch ? `${dbAccommodation.features.length} présentes` : 'Manquantes ou différentes'}`);
        
        if (!featuresMatch) {
          console.log(`    Attendues: ${expected.features.join(', ')}`);
          console.log(`    En base: ${dbAccommodation.features.join(', ')}`);
          allCorrect = false;
        }
      }
      
      // Vérification de l'image
      const hasImage = dbAccommodation.featured_image ? '✅' : '❌';
      console.log(`  ${hasImage} Image: ${dbAccommodation.featured_image ? 'Présente' : 'Manquante'}`);
      
      // Vérification du statut
      const isPublished = dbAccommodation.status === 'published' ? '✅' : '⚠️';
      console.log(`  ${isPublished} Statut: ${dbAccommodation.status}`);
    });
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🎯 RÉSULTAT DE LA VÉRIFICATION`);
    console.log(`Hébergements trouvés: ${foundCount}/${expectedAccommodations.length}`);
    console.log(`Contenu exact: ${allCorrect ? '✅ OUI' : '❌ NON - Corrections nécessaires'}`);
    
    if (foundCount === expectedAccommodations.length && allCorrect) {
      console.log(`\n🎉 PARFAIT ! Tous les hébergements sont présents avec le contenu exact.`);
    } else {
      console.log(`\n📝 ACTIONS REQUISES:`);
      if (foundCount < expectedAccommodations.length) {
        console.log(`- Ajouter les hébergements manquants`);
      }
      if (!allCorrect) {
        console.log(`- Corriger les informations différentes`);
        console.log(`- Utiliser l'admin pour modifier le contenu textuel`);
      }
    }
    
    // Vérification des images
    const withImages = dbAccommodations.filter(a => a.featured_image).length;
    console.log(`\n🖼️ IMAGES: ${withImages}/${dbAccommodations.length} hébergements ont une image`);
    if (withImages === 0) {
      console.log(`📝 Exécuter: scripts/add-images-manual.sql dans Supabase`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

verifyExactContent();