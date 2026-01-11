// Script de test pour les hébergements
// Exécuter avec : npx tsx scripts/test-accommodations.ts

import { AccommodationService } from '../services/accommodationService';

async function testAccommodations() {
  console.log('🏠 Test du système d\'hébergements...\n');

  try {
    // Test 1: Récupérer tous les hébergements
    console.log('1. Test de récupération des hébergements...');
    const accommodations = await AccommodationService.getPublishedAccommodations();
    console.log(`✅ ${accommodations.length} hébergements trouvés`);

    if (accommodations.length > 0) {
      const first = accommodations[0];
      console.log(`   Premier hébergement: ${first.name} (${first.type})`);
    }

    // Test 2: Recherche par slug
    if (accommodations.length > 0) {
      console.log('\n2. Test de récupération par slug...');
      const first = accommodations[0];
      const bySlug = await AccommodationService.getAccommodationBySlug(first.slug);
      
      if (bySlug) {
        console.log(`✅ Hébergement trouvé par slug: ${bySlug.name}`);
      } else {
        console.log('❌ Hébergement non trouvé par slug');
      }
    }

    // Test 3: Filtrage par type
    console.log('\n3. Test de filtrage par type...');
    const gites = await AccommodationService.getAccommodationsByType('gite');
    console.log(`✅ ${gites.length} gîtes trouvés`);

    const bedBreakfasts = await AccommodationService.getAccommodationsByType('bed_breakfast');
    console.log(`✅ ${bedBreakfasts.length} bed & breakfasts trouvés`);

    // Test 4: Filtrage par village
    console.log('\n4. Test de filtrage par village...');
    const chievres = await AccommodationService.getAccommodationsByVillage('Chièvres');
    console.log(`✅ ${chievres.length} hébergements à Chièvres`);

    const ladeuze = await AccommodationService.getAccommodationsByVillage('Ladeuze');
    console.log(`✅ ${ladeuze.length} hébergements à Ladeuze`);

    // Test 5: Filtrage par capacité
    console.log('\n5. Test de filtrage par capacité...');
    const smallAccommodations = await AccommodationService.getAccommodationsByCapacity(2, 4);
    console.log(`✅ ${smallAccommodations.length} hébergements pour 2-4 personnes`);

    const largeAccommodations = await AccommodationService.getAccommodationsByCapacity(6);
    console.log(`✅ ${largeAccommodations.length} hébergements pour 6+ personnes`);

    // Test 6: Recherche
    console.log('\n6. Test de recherche...');
    const searchResults = await AccommodationService.searchAccommodations('gîte');
    console.log(`✅ ${searchResults.length} résultats pour "gîte"`);

    // Test 7: Validation
    console.log('\n7. Test de validation...');
    const validAccommodation = {
      name: 'Test Hébergement',
      description: 'Description de test',
      type: 'gite' as const,
      capacity: 4,
      address: 'Rue de Test, 1'
    };
    
    const validationErrors = AccommodationService.validateAccommodation(validAccommodation);
    if (validationErrors.length === 0) {
      console.log('✅ Validation réussie pour un hébergement valide');
    } else {
      console.log('❌ Erreurs de validation:', validationErrors);
    }

    // Test 8: Génération de slug
    console.log('\n8. Test de génération de slug...');
    const slug = AccommodationService.generateSlug('La Maison d\'à Côté - Tongre');
    console.log(`✅ Slug généré: "${slug}"`);

    console.log('\n🎉 Tous les tests sont terminés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testAccommodations();
}

export { testAccommodations };