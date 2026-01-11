#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

// Données complètes selon le contenu fourni par l'utilisateur
const completeAccommodationsData = [
  {
    id: 'la-loge-bed-breakfast',
    name: 'La Loge Bed & Breakfast',
    slug: 'la-loge-bed-breakfast-vaudignies',
    description: 'Séjournez dans un appartement chaleureux au cœur du hameau de Vaudignies. Profitez d\'un cadre cosy et lumineux avec option petit-déjeuner, idéal pour découvrir Chièvres et ses villages environnants.',
    excerpt: 'Appartement chaleureux au cœur de Vaudignies avec option petit-déjeuner',
    type: 'bed_breakfast',
    capacity: 4,
    bedrooms: 2,
    beds_description: '2 à 4 personnes',
    address: 'Rue de Ladeuze, 1 – Vaudignies',
    village: 'Vaudignies',
    phone: '0472 65 32 01',
    email: 'laloge@outlook.be',
    website: null,
    facebook: 'https://www.facebook.com/laloge',
    features: [
      'Accueil personnalisé et convivial',
      'Appartement lumineux et confortable',
      'Option petit-déjeuner inclus',
      'Proximité des balades et circuits touristiques'
    ],
    featured_image: 'https://picsum.photos/id/1001/600/400',
    status: 'published'
  },
  {
    id: 'au-sentier-chauchaut',
    name: 'Au sentier Chauchaut',
    slug: 'au-sentier-chauchaut-chievres',
    description: 'Séjournez dans une ancienne ferme du XIXᵉ siècle rénovée avec soin pour allier confort moderne et charme authentique. Profitez d\'un moment de calme et de l\'accueil chaleureux de M. et Mme Ost‑Nasdrovisky.',
    excerpt: 'Ancienne ferme du XIXᵉ siècle rénovée avec charme authentique',
    type: 'bed_breakfast',
    capacity: 5,
    bedrooms: 2,
    beds_description: '3 à 5 personnes',
    address: 'Sentier Chauchaut, 1',
    village: 'Chièvres',
    phone: '0473 96 11 94',
    email: 'ostchr1968@gmail.com',
    website: 'https://www.ausentierchauchaut.com',
    facebook: null,
    features: [
      'Maison chargée d\'histoire, atmosphère authentique',
      'Chambres confortables',
      'Proximité des balades, du patrimoine et des circuits touristiques',
      'À deux pas de Pairi Daiza et des villes d\'art comme Mons et Tournai'
    ],
    featured_image: 'https://picsum.photos/id/1002/600/400',
    status: 'published'
  },
  {
    id: 'la-maison-dacote',
    name: 'La Maison d\'à côté',
    slug: 'la-maison-dacote-tongre-saint-martin',
    description: 'Partie d\'une ancienne ferme rénovée datant de 1872, ce gîte 3 épis allie calme et confort au cœur de la campagne chiévroise. Idéal pour les familles ou petits groupes, il offre des moments de repos et des découvertes naturelles à pied ou à vélo, sur le GR 121 ou le RAVeL à proximité.',
    excerpt: 'Gîte 3 épis dans une ancienne ferme de 1872, calme et confort',
    type: 'gite',
    capacity: 5,
    bedrooms: 2,
    beds_description: '5 personnes (2 chambres)',
    address: 'Rue Emile Daubechies, 4',
    village: 'Tongre-Saint-Martin',
    phone: '0474 78 71 99',
    email: 'winieckimic@gmail.com',
    website: 'https://www.lamaisondacote.be',
    facebook: null,
    features: [
      'Gîte spacieux et confortable pour 5 personnes',
      'Tranquillité et cadre champêtre',
      'Balades à pied ou à vélo sur le GR 121 et le RAVeL',
      'À quelques minutes en voiture du célèbre Parc Pairi Daiza'
    ],
    featured_image: 'https://picsum.photos/id/1003/600/400',
    status: 'published'
  },
  {
    id: 'au-champ-du-bouillon',
    name: 'Au Champ du Bouillon',
    slug: 'au-champ-du-bouillon-tongre-notre-dame',
    description: 'Séjournez dans ce gîte tout confort, parfait pour une escapade tranquille en couple ou en petit groupe. Profitez d\'un cadre paisible et d\'un espace bien-être privatif pour un séjour détente au cœur de la campagne chiévroise.',
    excerpt: 'Gîte tout confort avec espace bien-être privatif',
    type: 'gite',
    capacity: 4,
    bedrooms: 2,
    beds_description: '2 à 4 personnes',
    address: 'Rue de la Ladrerie, 12',
    village: 'Tongre-Notre-Dame',
    phone: '0498 07 00 85',
    email: 'rogejoh@hotmail.com',
    website: null,
    facebook: 'https://www.facebook.com/profile.php?id=100064563347866',
    features: [
      'Confort moderne dans un cadre rural',
      'Espace bien-être privatif pour se relaxer',
      'Proximité des balades et circuits touristiques',
      'Accueil chaleureux et personnalisé'
    ],
    featured_image: 'https://picsum.photos/id/1004/600/400',
    status: 'published'
  },
  {
    id: 'les-greniers-du-moulin',
    name: 'Les Greniers du Moulin',
    slug: 'les-greniers-du-moulin-grosage',
    description: 'Séjournez dans ce gîte à la ferme et découvrez l\'authenticité de la campagne chiévroise. Avec un élevage de vaches Jersey sur place et un petit magasin fermier ouvert le samedi, vous pourrez profiter d\'un cadre naturel et goûter aux produits locaux. Idéal pour les familles ou groupes d\'amis, ce gîte spacieux est parfait pour se détendre et explorer les environs.',
    excerpt: 'Gîte à la ferme avec élevage de vaches Jersey et magasin fermier',
    type: 'gite',
    capacity: 8,
    bedrooms: 3,
    beds_description: '8 personnes (3 chambres, 7 lits)',
    address: 'Rue des Héros de Roumont, 26',
    village: 'Grosage',
    phone: '0478 45 94 19',
    email: 'lafermedumoulin@skynet.be',
    website: null,
    facebook: 'https://www.facebook.com/profile.php?id=61552163278202',
    features: [
      'Gîte spacieux pour 8 personnes',
      'Ambiance authentique dans une ferme bio',
      'Proximité des sentiers de randonnée et balades à vélo',
      'Magasin à la ferme avec produits locaux (uniquement le samedi)'
    ],
    featured_image: 'https://picsum.photos/id/1005/600/400',
    status: 'published'
  },
  {
    id: 'levasion-yacht',
    name: 'L\'Évasion',
    slug: 'levasion-yacht-ladeuze',
    description: 'Vivez une expérience unique en séjournant sur un yacht amarré à Ladeuze. Ce gîte insolite combine confort et originalité pour un séjour inoubliable au fil de l\'eau, idéal pour les familles ou petits groupes.',
    excerpt: 'Séjour insolite sur un yacht amarré à Ladeuze',
    type: 'unusual',
    capacity: 6,
    bedrooms: 3,
    beds_description: '6 personnes (3 chambres : 2 lits doubles, 1 lit superposé)',
    address: 'Rue Grande Drève',
    village: 'Ladeuze',
    phone: '0491 86 58 09',
    email: 'evasionyacht@hotmail.com',
    website: null,
    facebook: 'https://www.facebook.com/evasionyacht',
    features: [
      'Séjour insolite sur un yacht au calme',
      '3 chambres confortables pour 6 personnes',
      'Cadre charmant au bord de l\'eau',
      'Proximité des balades le long du RAVel'
    ],
    featured_image: 'https://picsum.photos/id/1006/600/400',
    status: 'published'
  },
  {
    id: 'moulin-du-domissart',
    name: 'Moulin du Domissart',
    slug: 'moulin-du-domissart-grosage',
    description: 'Bienvenue chez Aurore et Thomas, au Moulin du Domissart, un ancien moulin à eau du XVIᵉ siècle, restauré et transformé en 4 gîtes. Abritant d\'anciennes machines du moulin, vous aurez la sensation de séjourner dans un musée vivant. Plus qu\'un hébergement, c\'est un lieu apaisant et convivial, idéal pour les familles, groupes d\'amis ou team buildings professionnels. Bercé par le ruissellement de l\'eau, le Moulin du Domissart offre un cadre parfait pour promenades, escapades nature et découvertes de la campagne chiévroise. Un espace bien-être et un barbecue à disposition sont également disponibles pour des moments de détente et de convivialité.',
    excerpt: 'Ancien moulin à eau du XVIᵉ siècle transformé en 4 gîtes avec espace bien-être',
    type: 'gite',
    capacity: 24,
    bedrooms: 8,
    beds_description: '4 gîtes, jusqu\'à 24 personnes',
    address: 'Rue Puits à Leval, 27',
    village: 'Grosage',
    phone: '0477 13 22 99',
    email: 'info@moulin-a-eau.be',
    website: 'https://www.moulin-a-eau.be/',
    facebook: null,
    features: [
      'Cadre unique dans un moulin à eau historique du XVIᵉ siècle',
      'Capacité totale de 24 personnes répartie sur 4 gîtes',
      'Atmosphère apaisante, parfaite pour se ressourcer',
      'Proximité des balades, circuits touristiques et villages voisins',
      'Espace Wellness',
      'Ménage inclus'
    ],
    featured_image: 'https://picsum.photos/id/1007/600/400',
    status: 'published'
  },
  {
    id: 'chez-les-kikis',
    name: 'Chez les Kikis',
    slug: 'chez-les-kikis-chievres',
    description: 'Ce gîte rural tout confort, situé en contrebas de la Tour de Gavre et de l\'église St Martin de Chièvres, vous offre une escapade reposante au cœur de la ville. Idéal pour un couple ou une petite famille, il est également à proximité de la Casa des Aviateurs, pour profiter de paddle, laser game et mini foot.',
    excerpt: 'Gîte rural au pied des monuments historiques de Chièvres',
    type: 'gite',
    capacity: 3,
    bedrooms: 1,
    beds_description: '2 adultes + 1 adulte dans canapé-lit ou 2 petits enfants',
    address: 'Rue Royale, 28C',
    village: 'Chièvres',
    phone: '068 65 78 18',
    email: 'chezleskiki@gmail.com',
    website: null,
    facebook: null,
    features: [
      'Gîte cosy et confortable pour 2 à 3 personnes',
      'Cadre calme, au pied des monuments historiques de Chièvres',
      'Proximité des activités sportives et ludiques de la Casa des Aviateurs',
      'Idéal pour une escapade familiale ou reposante'
    ],
    featured_image: 'https://picsum.photos/id/1008/600/400',
    status: 'published'
  },
  {
    id: 'on-dirait-le-sud',
    name: 'On dirait le sud…',
    slug: 'on-dirait-le-sud-ladeuze',
    description: 'Profitez d\'un séjour convivial et reposant dans cette chambre d\'hôtes chaleureuse. Idéal pour familles ou petits groupes, ce lieu charmant vous permettra de découvrir Ladeuze et la campagne chiévroise en toute tranquillité.',
    excerpt: 'Chambre d\'hôtes chaleureuse avec piscine extérieure',
    type: 'bed_breakfast',
    capacity: 4,
    bedrooms: 2,
    beds_description: '4 personnes (2 chambres : "Tintin" avec 2 lits simples, "Doux Repos" avec 1 lit double)',
    address: 'Rue de la Gare, 11B',
    village: 'Ladeuze',
    phone: '0477 99 59 27',
    email: 'duquesnereal@hotmail.be',
    website: null,
    facebook: null,
    features: [
      '2 chambres confortables pour 4 personnes',
      'Piscine extérieure pour se rafraîchir',
      'Petit déjeuner fabuleux préparé par le chef Réal',
      'Ambiance chaleureuse et accueillante',
      'Proximité des balades, circuits touristiques et villages voisins'
    ],
    featured_image: 'https://picsum.photos/id/1009/600/400',
    status: 'published'
  }
];

async function updateCompleteData() {
  try {
    console.log('🔄 Mise à jour complète des hébergements...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const accommodationData of completeAccommodationsData) {
      try {
        console.log(`📝 Mise à jour de "${accommodationData.name}"...`);
        
        const { error } = await supabase
          .from('accommodations')
          .upsert(accommodationData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error(`❌ Erreur pour ${accommodationData.name}:`, error);
          errorCount++;
        } else {
          console.log(`✅ "${accommodationData.name}" mis à jour`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Exception pour ${accommodationData.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Résultat: ${successCount} succès, ${errorCount} erreurs`);
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const { data: finalData, error: finalError } = await supabase
      .from('accommodations')
      .select('id, name, featured_image, features, village, capacity, type')
      .order('name');
    
    if (finalError) {
      console.error('❌ Erreur lors de la vérification:', finalError);
      return;
    }
    
    console.log(`\n📋 État final:`);
    console.log(`Total: ${finalData.length}`);
    console.log(`Avec images: ${finalData.filter(a => a.featured_image).length}`);
    console.log(`Avec caractéristiques: ${finalData.filter(a => a.features && a.features.length > 0).length}`);
    
    finalData.forEach(acc => {
      const hasImage = acc.featured_image ? '🖼️' : '❌';
      const featuresCount = acc.features ? acc.features.length : 0;
      console.log(`  ${hasImage} ${acc.name} (${featuresCount} caractéristiques, ${acc.capacity} pers., ${acc.village})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

updateCompleteData();