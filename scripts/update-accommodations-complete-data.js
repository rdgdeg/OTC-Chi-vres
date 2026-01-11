#!/usr/bin/env node

/**
 * Script pour mettre à jour les hébergements avec les données complètes
 * Inclut les coordonnées, images, et informations détaillées
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

// Données complètes des hébergements
const accommodationsData = [
  {
    id: 'la-loge-bed-breakfast',
    name: 'La Loge Bed & Breakfast',
    description: 'Séjournez dans un appartement chaleureux au cœur du hameau de Vaudignies. Profitez d\'un cadre cosy et lumineux avec option petit-déjeuner, idéal pour découvrir Chièvres et ses villages environnants. L\'accueil convivial et la proximité des balades et circuits touristiques en font un lieu parfait pour un séjour reposant.',
    excerpt: 'Appartement chaleureux au cœur de Vaudignies, cadre cosy et lumineux, option petit-déjeuner',
    type: 'bed_breakfast',
    capacity: 4,
    bedrooms: 2,
    beds_description: '2 à 4 personnes',
    address: 'Rue de Ladeuze, 1 – Vaudignies (Chièvres)',
    village: 'Vaudignies',
    lat: 50.6089,
    lng: 3.8156,
    phone: '0472 65 32 01',
    email: 'laloge@outlook.be',
    facebook: 'https://www.facebook.com/laloge',
    features: [
      'Accueil personnalisé et convivial',
      'Appartement lumineux et confortable', 
      'Option petit-déjeuner inclus',
      'Proximité des balades et circuits touristiques'
    ],
    amenities: ['Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€',
    meta_title: 'La Loge Bed & Breakfast - Vaudignies | Hébergement Chièvres',
    meta_description: 'Appartement chaleureux avec petit-déjeuner à Vaudignies. Cadre cosy et lumineux, accueil convivial, proche des balades et circuits touristiques.'
  },
  {
    id: 'au-sentier-chauchaut',
    name: 'Au sentier Chauchaut',
    description: 'Séjournez dans une ancienne ferme du XIXᵉ siècle rénovée avec soin pour allier confort moderne et charme authentique. Profitez d\'un moment de calme et de l\'accueil chaleureux dans cette maison chargée d\'histoire. Idéalement située pour découvrir le patrimoine local et à proximité de Pairi Daiza ainsi que des villes d\'art comme Mons et Tournai.',
    excerpt: 'Ancienne ferme du XIXᵉ rénovée, confort moderne + charme authentique, accueil chaleureux',
    type: 'bed_breakfast',
    capacity: 5,
    bedrooms: 2,
    beds_description: '3 à 5 personnes',
    address: 'Sentier Chauchaut, 1 – Chièvres',
    village: 'Chièvres',
    lat: 50.5889,
    lng: 3.8089,
    phone: '0473 96 11 94',
    email: 'ostchr1968@gmail.com',
    website: 'https://www.ausentierchauchaut.com',
    features: [
      'Maison chargée d\'histoire, atmosphère authentique',
      'Chambres confortables',
      'Proximité des balades, du patrimoine et des circuits touristiques',
      'À deux pas de Pairi Daiza et des villes d\'art comme Mons et Tournai'
    ],
    amenities: ['WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€',
    meta_title: 'Au sentier Chauchaut - Chièvres | Chambre d\'hôtes authentique',
    meta_description: 'Ancienne ferme du XIXᵉ siècle rénovée à Chièvres. Confort moderne et charme authentique, proche Pairi Daiza, Mons et Tournai.'
  },
  {
    id: 'la-maison-dacote',
    name: 'La Maison d\'à côté',
    description: 'Partie d\'une ancienne ferme rénovée datant de 1872, ce gîte 3 épis allie calme et confort au cœur de la campagne chiévroise. Idéal pour les familles ou petits groupes, il offre des moments de repos et des découvertes naturelles à pied ou à vélo, sur le GR 121 ou le RAVeL à proximité. Un cadre champêtre parfait pour se ressourcer.',
    excerpt: 'Partie d\'une ferme rénovée (1872), gîte 3 épis, calme au cœur de la campagne, proche GR 121 et RAVeL',
    type: 'gite',
    capacity: 5,
    bedrooms: 2,
    beds_description: '5 personnes (2 chambres)',
    address: 'Rue Emile Daubechies, 4 – Tongre-Saint-Martin (Chièvres)',
    village: 'Tongre-Saint-Martin',
    lat: 50.5756,
    lng: 3.8234,
    phone: '0474 78 71 99',
    email: 'winieckimic@gmail.com',
    website: 'https://www.lamaisondacote.be',
    features: [
      'Gîte spacieux et confortable pour 5 personnes',
      'Tranquillité et cadre champêtre',
      'Balades à pied ou à vélo sur le GR 121 et le RAVeL',
      'À quelques minutes en voiture du célèbre Parc Pairi Daiza'
    ],
    amenities: ['WiFi', 'Parking', 'Jardin', 'Barbecue', 'Vélos disponibles'],
    price_range: '€€€',
    meta_title: 'La Maison d\'à côté - Tongre-Saint-Martin | Gîte 3 épis',
    meta_description: 'Gîte 3 épis dans ancienne ferme de 1872 à Tongre-Saint-Martin. Calme champêtre, proche GR 121, RAVeL et Pairi Daiza.'
  },
  {
    id: 'au-champ-du-bouillon',
    name: 'Au Champ du Bouillon',
    description: 'Séjournez dans ce gîte tout confort, parfait pour une escapade tranquille en couple ou en petit groupe. Profitez d\'un cadre paisible et d\'un espace bien-être privatif pour un séjour détente au cœur de la campagne chiévroise. L\'accueil personnalisé et la proximité des circuits touristiques en font un lieu idéal pour se ressourcer.',
    excerpt: 'Gîte tout confort, idéal pour une escapade calme, avec espace bien-être privatif',
    type: 'gite',
    capacity: 4,
    bedrooms: 2,
    beds_description: '2 à 4 personnes',
    address: 'Rue de la Ladrerie, 12 – Tongre-Notre-Dame (Chièvres)',
    village: 'Tongre-Notre-Dame',
    lat: 50.5823,
    lng: 3.8167,
    phone: '0498 07 00 85',
    email: 'rogejoh@hotmail.com',
    facebook: 'https://www.facebook.com/profile.php?id=100064563347866',
    features: [
      'Confort moderne dans un cadre rural',
      'Espace bien-être privatif pour se relaxer',
      'Proximité des balades et circuits touristiques',
      'Accueil chaleureux et personnalisé'
    ],
    amenities: ['Spa privatif', 'WiFi', 'Parking', 'Jardin', 'Terrasse'],
    price_range: '€€€',
    meta_title: 'Au Champ du Bouillon - Tongre-Notre-Dame | Gîte bien-être',
    meta_description: 'Gîte tout confort avec espace bien-être privatif à Tongre-Notre-Dame. Cadre rural paisible, parfait pour se détendre.'
  },
  {
    id: 'les-greniers-du-moulin',
    name: 'Les Greniers du Moulin',
    description: 'Séjournez dans ce gîte à la ferme et découvrez l\'authenticité de la campagne chiévroise. Avec un élevage de vaches Jersey sur place et un petit magasin fermier ouvert le samedi, vous pourrez profiter d\'un cadre naturel et goûter aux produits locaux. Idéal pour les familles ou groupes d\'amis, ce gîte spacieux est parfait pour se détendre et explorer les environs.',
    excerpt: 'Séjour à la ferme (vaches Jersey), cadre nature, magasin fermier le samedi, parfait groupes/familles',
    type: 'gite',
    capacity: 8,
    bedrooms: 3,
    beds_description: '8 personnes (3 chambres, 7 lits)',
    address: 'Rue des Héros de Roumont, 26 – Grosage (Chièvres)',
    village: 'Grosage',
    lat: 50.5945,
    lng: 3.7923,
    phone: '0478 45 94 19',
    email: 'lafermedumoulin@skynet.be',
    facebook: 'https://www.facebook.com/profile.php?id=61552163278202',
    features: [
      'Gîte spacieux pour 8 personnes',
      'Ambiance authentique dans une ferme bio',
      'Proximité des sentiers de randonnée et balades à vélo',
      'Magasin à la ferme avec produits locaux (uniquement le samedi)'
    ],
    amenities: ['Ferme bio', 'Produits locaux', 'WiFi', 'Parking', 'Jardin', 'Barbecue'],
    price_range: '€€€',
    meta_title: 'Les Greniers du Moulin - Grosage | Gîte à la ferme bio',
    meta_description: 'Gîte à la ferme avec vaches Jersey à Grosage. Cadre authentique, produits locaux, magasin fermier le samedi.'
  },
  {
    id: 'levasion-yacht',
    name: 'L\'Évasion',
    description: 'Vivez une expérience unique en séjournant sur un yacht amarré à Ladeuze. Ce gîte insolite combine confort et originalité pour un séjour inoubliable au fil de l\'eau, idéal pour les familles ou petits groupes. Profitez d\'un cadre charmant au bord de l\'eau et de la proximité des balades le long du RAVeL.',
    excerpt: 'Nuit sur un yacht amarré, expérience originale au fil de l\'eau, idéale familles/petits groupes',
    type: 'unusual',
    capacity: 6,
    bedrooms: 3,
    beds_description: '6 personnes (3 chambres : 2 lits doubles + 1 lit superposé)',
    address: 'Rue Grande Drève – Ladeuze (Chièvres)',
    village: 'Ladeuze',
    lat: 50.5912,
    lng: 3.8045,
    phone: '0491 86 58 09',
    email: 'evasionyacht@hotmail.com',
    facebook: 'https://www.facebook.com/evasionyacht',
    features: [
      'Séjour insolite sur un yacht au calme',
      '3 chambres confortables pour 6 personnes',
      'Cadre charmant au bord de l\'eau',
      'Proximité des balades le long du RAVeL'
    ],
    amenities: ['Yacht amarré', 'Bord de l\'eau', 'WiFi', 'Terrasse sur l\'eau'],
    price_range: '€€€€',
    meta_title: 'L\'Évasion - Ladeuze | Séjour insolite sur yacht',
    meta_description: 'Séjour unique sur yacht amarré à Ladeuze. Expérience insolite au fil de l\'eau, 3 chambres, proche RAVeL.'
  },
  {
    id: 'moulin-du-domissart',
    name: 'Moulin du Domissart',
    description: 'Bienvenue chez Aurore et Thomas, au Moulin du Domissart, un ancien moulin à eau du XVIᵉ siècle, restauré et transformé en 4 gîtes. Abritant d\'anciennes machines du moulin, vous aurez la sensation de séjourner dans un musée vivant. Plus qu\'un hébergement, c\'est un lieu apaisant et convivial, idéal pour les familles, groupes d\'amis ou team buildings professionnels. Bercé par le ruissellement de l\'eau, le Moulin du Domissart offre un cadre parfait pour promenades, escapades nature et découvertes de la campagne chiévroise.',
    excerpt: 'Moulin à eau du XVIe restauré, ambiance "musée vivant", idéal familles, groupes, team buildings',
    type: 'gite',
    capacity: 24,
    bedrooms: 8,
    beds_description: '4 gîtes, jusqu\'à 24 personnes (au total)',
    address: 'Rue Puits à Leval, 27 – Grosage (Chièvres)',
    village: 'Grosage',
    lat: 50.5934,
    lng: 3.7889,
    phone: '0477 13 22 99',
    email: 'info@moulin-a-eau.be',
    website: 'https://www.moulin-a-eau.be',
    features: [
      'Cadre unique dans un moulin à eau historique du XVIᵉ siècle',
      'Capacité totale de 24 personnes répartie sur 4 gîtes',
      'Atmosphère apaisante, parfaite pour se ressourcer',
      'Proximité des balades, circuits touristiques et villages voisins',
      'Espace Wellness',
      'Ménage inclus'
    ],
    amenities: ['Moulin historique', 'Wellness', 'Barbecue', 'WiFi', 'Parking', 'Ménage inclus'],
    price_range: '€€€€',
    meta_title: 'Moulin du Domissart - Grosage | Moulin historique XVIe siècle',
    meta_description: 'Ancien moulin à eau du XVIᵉ siècle transformé en 4 gîtes à Grosage. Cadre unique, wellness, jusqu\'à 24 personnes.'
  },
  {
    id: 'chez-les-kikis',
    name: 'Chez les Kikis',
    description: 'Ce gîte rural tout confort, situé en contrebas de la Tour de Gavre et de l\'église St Martin de Chièvres, vous offre une escapade reposante au cœur de la ville. Idéal pour un couple ou une petite famille, il est également à proximité de la Casa des Aviateurs, pour profiter de paddle, laser game et mini foot.',
    excerpt: 'Gîte tout confort, au pied de la Tour de Gavre et de l\'église St Martin, proche Casa des Aviateurs',
    type: 'gite',
    capacity: 3,
    bedrooms: 1,
    beds_description: '2 adultes + 1 adulte (canapé-lit) ou 2 petits enfants',
    address: 'Rue Royale, 28C – Chièvres',
    village: 'Chièvres',
    lat: 50.5889,
    lng: 3.8089,
    phone: '068 65 78 18',
    email: 'chezleskiki@gmail.com',
    features: [
      'Gîte cosy et confortable pour 2 à 3 personnes',
      'Cadre calme, au pied des monuments historiques de Chièvres',
      'Proximité des activités sportives et ludiques de la Casa des Aviateurs',
      'Idéal pour une escapade familiale ou reposante'
    ],
    amenities: ['Centre-ville', 'Monuments historiques', 'Activités sportives', 'WiFi', 'Parking'],
    price_range: '€€',
    meta_title: 'Chez les Kikis - Chièvres | Gîte au pied des monuments',
    meta_description: 'Gîte rural au pied de la Tour de Gavre et église St Martin à Chièvres. Proche Casa des Aviateurs, idéal couple/famille.'
  },
  {
    id: 'on-dirait-le-sud',
    name: 'On dirait le sud…',
    description: 'Profitez d\'un séjour convivial et reposant dans cette chambre d\'hôtes chaleureuse. Idéal pour familles ou petits groupes, ce lieu charmant vous permettra de découvrir Ladeuze et la campagne chiévroise en toute tranquillité. Avec sa piscine extérieure et son petit-déjeuner réputé, c\'est l\'endroit parfait pour se détendre.',
    excerpt: 'Chambre d\'hôtes conviviale, idéale familles/petits groupes, avec piscine extérieure et petit-déjeuner réputé',
    type: 'bed_breakfast',
    capacity: 4,
    bedrooms: 2,
    beds_description: '4 personnes (2 chambres : "Tintin" 2 lits simples + "Doux Repos" 1 lit double)',
    address: 'Rue de la Gare, 11B – Ladeuze (Chièvres)',
    village: 'Ladeuze',
    lat: 50.5912,
    lng: 3.8045,
    phone: '0477 99 59 27',
    email: 'duquesnereal@hotmail.be',
    features: [
      '2 chambres confortables pour 4 personnes',
      'Piscine extérieure pour se rafraîchir',
      'Petit déjeuner fabuleux préparé par le chef Réal',
      'Ambiance chaleureuse et accueillante',
      'Proximité des balades, circuits touristiques et villages voisins'
    ],
    amenities: ['Piscine extérieure', 'Petit-déjeuner', 'WiFi', 'Parking', 'Jardin'],
    price_range: '€€€',
    meta_title: 'On dirait le sud - Ladeuze | Chambre d\'hôtes avec piscine',
    meta_description: 'Chambre d\'hôtes chaleureuse avec piscine extérieure à Ladeuze. 2 chambres, petit-déjeuner réputé, ambiance conviviale.'
  }
];

async function updateAccommodations() {
  console.log('🚀 Mise à jour des hébergements avec les données complètes...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const accommodation of accommodationsData) {
    try {
      console.log(`📝 Mise à jour: ${accommodation.name}...`);
      
      const { data, error } = await supabase
        .from('accommodations')
        .update({
          name: accommodation.name,
          description: accommodation.description,
          excerpt: accommodation.excerpt,
          type: accommodation.type,
          capacity: accommodation.capacity,
          bedrooms: accommodation.bedrooms,
          beds_description: accommodation.beds_description,
          address: accommodation.address,
          village: accommodation.village,
          lat: accommodation.lat,
          lng: accommodation.lng,
          phone: accommodation.phone,
          email: accommodation.email,
          website: accommodation.website || null,
          facebook: accommodation.facebook || null,
          features: accommodation.features,
          amenities: accommodation.amenities,
          price_range: accommodation.price_range,
          meta_title: accommodation.meta_title,
          meta_description: accommodation.meta_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodation.id)
        .select();

      if (error) {
        console.error(`❌ Erreur pour ${accommodation.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${accommodation.name} mis à jour avec succès`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${accommodation.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la mise à jour:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📝 Total traité: ${accommodationsData.length}`);

  // Vérification finale
  console.log('\n🔍 Vérification des données mises à jour...');
  const { data: finalData, error: finalError } = await supabase
    .from('accommodations')
    .select('id, name, village, type, capacity, lat, lng, phone, email')
    .order('name');

  if (finalError) {
    console.error('❌ Erreur lors de la vérification:', finalError.message);
  } else {
    console.log('\n📋 Hébergements dans la base de données:');
    finalData.forEach((acc, index) => {
      console.log(`${index + 1}. ${acc.name} (${acc.village}) - ${acc.type} - ${acc.capacity} pers.`);
      console.log(`   📍 Coordonnées: ${acc.lat}, ${acc.lng}`);
      console.log(`   📞 ${acc.phone} | ✉️ ${acc.email}`);
      console.log('');
    });
  }
}

// Exécution du script
updateAccommodations()
  .then(() => {
    console.log('🎉 Mise à jour terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });