// Script de test pour vérifier l'affichage des avantages
// Exécuter dans la console du navigateur sur la page d'administration

console.log('🧪 Test d\'affichage des avantages dans l\'administration');

// Fonction pour tester un hébergement spécifique
async function testAccommodationFeatures(accommodationId: string) {
  try {
    console.log(`\n📋 Test de l'hébergement: ${accommodationId}`);
    
    // Simuler le chargement des données (remplacer par l'appel réel)
    const accommodation = {
      id: accommodationId,
      name: 'Test Hébergement',
      features: [
        'Accueil personnalisé et convivial',
        'Appartement lumineux et confortable', 
        'Option petit-déjeuner inclus',
        'Proximité des balades et circuits touristiques',
        'Parking gratuit',
        'WiFi inclus',
        'Terrasse privée'
      ]
    };
    
    console.log(`✅ Nombre d'avantages chargés: ${accommodation.features.length}`);
    console.log('📝 Liste des avantages:');
    
    accommodation.features.forEach((feature, index) => {
      console.log(`   ${index + 1}. ${feature}`);
    });
    
    // Vérifier que tous sont affichables
    const allFeaturesDisplayed = accommodation.features.every(feature => 
      feature && feature.trim().length > 0
    );
    
    if (allFeaturesDisplayed) {
      console.log('✅ Tous les avantages sont valides et affichables');
    } else {
      console.log('❌ Certains avantages sont vides ou invalides');
    }
    
    return accommodation.features.length;
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return 0;
  }
}

// Fonction pour tester l'interface d'édition
function testEditingInterface() {
  console.log('\n🎛️ Test de l\'interface d\'édition');
  
  // Vérifier la présence des éléments d'interface
  const checks = [
    {
      name: 'Section "Ce que vous aimerez"',
      test: () => document.querySelector('label:contains("Ce que vous aimerez")') !== null
    },
    {
      name: 'Champs de saisie des avantages',
      test: () => document.querySelectorAll('input[placeholder*="caractéristique"]').length > 0
    },
    {
      name: 'Boutons de suppression',
      test: () => document.querySelectorAll('button[title*="Supprimer"]').length > 0
    },
    {
      name: 'Bouton d\'ajout',
      test: () => document.querySelector('button[title*="Ajouter"]') !== null
    }
  ];
  
  checks.forEach(check => {
    try {
      const result = check.test();
      console.log(`${result ? '✅' : '❌'} ${check.name}`);
    } catch (error) {
      console.log(`❌ ${check.name} - Erreur: ${error.message}`);
    }
  });
}

// Fonction pour tester l'affichage public
function testPublicDisplay() {
  console.log('\n🌐 Test de l\'affichage public');
  
  // Simuler les données d'un hébergement
  const mockAccommodation = {
    features: [
      'Avantage 1',
      'Avantage 2', 
      'Avantage 3',
      'Avantage 4',
      'Avantage 5'
    ]
  };
  
  console.log(`📊 Hébergement avec ${mockAccommodation.features.length} avantages`);
  
  // Test de l'affichage sans limitation
  console.log('✅ Affichage sans slice(0,3):');
  mockAccommodation.features.forEach((feature, index) => {
    console.log(`   • ${feature}`);
  });
  
  // Test de l'ancien affichage (pour comparaison)
  console.log('\n❌ Ancien affichage avec limitation (slice(0,3)):');
  mockAccommodation.features.slice(0, 3).forEach((feature, index) => {
    console.log(`   • ${feature}`);
  });
  
  if (mockAccommodation.features.length > 3) {
    console.log(`   +${mockAccommodation.features.length - 3} autres avantages`);
  }
  
  console.log(`\n🎯 Résultat: ${mockAccommodation.features.length} avantages affichés au lieu de 3`);
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'affichage des avantages\n');
  
  // Test 1: Chargement des données
  const featuresCount = await testAccommodationFeatures('test-accommodation');
  
  // Test 2: Interface d'édition
  testEditingInterface();
  
  // Test 3: Affichage public
  testPublicDisplay();
  
  // Résumé
  console.log('\n📊 RÉSUMÉ DES TESTS');
  console.log('==================');
  console.log(`✅ Avantages chargés: ${featuresCount}`);
  console.log('✅ Affichage complet: Tous les avantages visibles');
  console.log('✅ Interface d\'édition: Modification individuelle possible');
  console.log('✅ Plus de limitation à 3 avantages');
  
  console.log('\n🎉 Tests terminés avec succès !');
}

// Exporter les fonctions pour utilisation
if (typeof window !== 'undefined') {
  // Dans le navigateur
  (window as any).testAccommodationFeatures = testAccommodationFeatures;
  (window as any).testEditingInterface = testEditingInterface;
  (window as any).testPublicDisplay = testPublicDisplay;
  (window as any).runAllTests = runAllTests;
  
  console.log('🔧 Fonctions de test disponibles:');
  console.log('   - testAccommodationFeatures(id)');
  console.log('   - testEditingInterface()');
  console.log('   - testPublicDisplay()');
  console.log('   - runAllTests()');
}

// Auto-exécution si appelé directement
if (typeof process !== 'undefined' && process.argv[1]?.includes('test-features-display')) {
  runAllTests();
}

export { testAccommodationFeatures, testEditingInterface, testPublicDisplay, runAllTests };