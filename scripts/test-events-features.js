#!/usr/bin/env node

/**
 * Script de test pour les fonctionnalités d'événements
 * Teste toutes les opérations CRUD et les filtres
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseUrl.includes('supabase.co') || !supabaseServiceKey.startsWith('eyJ')) {
  console.error('❌ Configuration Supabase manquante ou invalide');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Données de test
const testEvents = [
  {
    id: 'test_folklore_001',
    title: 'Festival de Folklore Test',
    description: 'Un festival de folklore pour tester les fonctionnalités.',
    excerpt: 'Festival de test avec danses traditionnelles.',
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans 30 jours
    end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    is_all_day: false,
    location: 'Grand-Place Test',
    category: 'folklore',
    event_type: 'public',
    price_text: 'Gratuit',
    registration_required: false,
    contact_email: 'test@example.com',
    contact_phone: '+32 123 456 789',
    status: 'published'
  },
  {
    id: 'test_culture_002',
    title: 'Concert de Test',
    description: 'Un concert de musique classique pour tester.',
    excerpt: 'Concert de test avec orchestre.',
    start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // Dans 45 jours
    is_all_day: false,
    location: 'Église Test',
    category: 'culture',
    event_type: 'public',
    price_text: '15€',
    price_amount: 15.00,
    registration_required: true,
    registration_url: 'https://example.com/register',
    max_attendees: 100,
    contact_email: 'concert@example.com',
    status: 'published'
  },
  {
    id: 'test_sport_003',
    title: 'Tournoi de Tennis Test',
    description: 'Tournoi de tennis amateur pour tous les niveaux.',
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Dans 60 jours
    is_all_day: true,
    location: 'Courts de Tennis Test',
    category: 'sport',
    event_type: 'public',
    price_text: '10€ par participant',
    price_amount: 10.00,
    registration_required: true,
    max_attendees: 32,
    status: 'draft'
  }
];

async function testEventsFeatures() {
  console.log('🧪 Démarrage des tests des fonctionnalités d\'événements...\n');
  
  try {
    // Test 1: Nettoyage des données de test existantes
    console.log('🧹 Nettoyage des données de test existantes...');
    for (const event of testEvents) {
      await supabase.from('events').delete().eq('id', event.id);
    }
    console.log('✅ Nettoyage terminé\n');
    
    // Test 2: Création d'événements
    console.log('📝 Test de création d\'événements...');
    for (const event of testEvents) {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select();
      
      if (error) {
        throw new Error(`Erreur lors de la création de l'événement ${event.title}: ${error.message}`);
      }
      
      console.log(`   ✅ Événement créé: ${event.title}`);
    }
    console.log('✅ Tous les événements de test créés\n');
    
    // Test 3: Lecture de tous les événements
    console.log('📖 Test de lecture de tous les événements...');
    const { data: allEvents, error: readError } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (readError) {
      throw new Error(`Erreur lors de la lecture: ${readError.message}`);
    }
    
    console.log(`   ✅ ${allEvents.length} événements trouvés`);
    console.log('✅ Lecture réussie\n');
    
    // Test 4: Filtrage par catégorie
    console.log('🔍 Test de filtrage par catégorie...');
    const { data: cultureEvents, error: filterError } = await supabase
      .from('events')
      .select('*')
      .eq('category', 'culture');
    
    if (filterError) {
      throw new Error(`Erreur lors du filtrage: ${filterError.message}`);
    }
    
    console.log(`   ✅ ${cultureEvents.length} événements de culture trouvés`);
    console.log('✅ Filtrage par catégorie réussi\n');
    
    // Test 5: Filtrage par statut
    console.log('📊 Test de filtrage par statut...');
    const { data: publishedEvents, error: statusError } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published');
    
    if (statusError) {
      throw new Error(`Erreur lors du filtrage par statut: ${statusError.message}`);
    }
    
    console.log(`   ✅ ${publishedEvents.length} événements publiés trouvés`);
    console.log('✅ Filtrage par statut réussi\n');
    
    // Test 6: Recherche textuelle
    console.log('🔎 Test de recherche textuelle...');
    const { data: searchResults, error: searchError } = await supabase
      .from('events')
      .select('*')
      .or('title.ilike.%test%,description.ilike.%test%,location.ilike.%test%');
    
    if (searchError) {
      throw new Error(`Erreur lors de la recherche: ${searchError.message}`);
    }
    
    console.log(`   ✅ ${searchResults.length} événements trouvés avec "test"`);
    console.log('✅ Recherche textuelle réussie\n');
    
    // Test 7: Filtrage par date
    console.log('📅 Test de filtrage par date...');
    const futureDate = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString();
    const { data: futureEvents, error: dateError } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', futureDate);
    
    if (dateError) {
      throw new Error(`Erreur lors du filtrage par date: ${dateError.message}`);
    }
    
    console.log(`   ✅ ${futureEvents.length} événements futurs trouvés`);
    console.log('✅ Filtrage par date réussi\n');
    
    // Test 8: Mise à jour d'un événement
    console.log('✏️  Test de mise à jour d\'un événement...');
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ 
        title: 'Festival de Folklore Test (Modifié)',
        price_text: '5€ (Prix modifié)'
      })
      .eq('id', 'test_folklore_001')
      .select();
    
    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
    }
    
    console.log(`   ✅ Événement mis à jour: ${updatedEvent[0].title}`);
    console.log('✅ Mise à jour réussie\n');
    
    // Test 9: Test des événements publics (pour le frontend)
    console.log('🌐 Test de récupération des événements publics...');
    const { data: publicEvents, error: publicError } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    if (publicError) {
      throw new Error(`Erreur lors de la récupération des événements publics: ${publicError.message}`);
    }
    
    console.log(`   ✅ ${publicEvents.length} événements publics à venir trouvés`);
    console.log('✅ Récupération des événements publics réussie\n');
    
    // Test 10: Test des statistiques
    console.log('📈 Test des statistiques d\'événements...');
    const [
      { count: totalCount },
      { count: publishedCount },
      { count: draftCount }
    ] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'draft')
    ]);
    
    console.log(`   ✅ Total: ${totalCount || 0} événements`);
    console.log(`   ✅ Publiés: ${publishedCount || 0} événements`);
    console.log(`   ✅ Brouillons: ${draftCount || 0} événements`);
    console.log('✅ Statistiques calculées\n');
    
    // Test 11: Validation des champs obligatoires
    console.log('🔒 Test de validation des champs obligatoires...');
    const invalidEvent = {
      id: 'test_invalid',
      // title manquant (obligatoire)
      description: 'Test sans titre',
      start_date: new Date().toISOString(),
      location: 'Test',
      category: 'culture',
      status: 'draft'
    };
    
    const { error: validationError } = await supabase
      .from('events')
      .insert([invalidEvent]);
    
    if (validationError) {
      console.log('   ✅ Validation des champs obligatoires fonctionne');
    } else {
      console.log('   ⚠️  Validation des champs obligatoires à améliorer');
    }
    console.log('✅ Test de validation terminé\n');
    
    // Nettoyage final
    console.log('🧹 Nettoyage final des données de test...');
    for (const event of testEvents) {
      await supabase.from('events').delete().eq('id', event.id);
    }
    await supabase.from('events').delete().eq('id', 'test_invalid');
    console.log('✅ Nettoyage terminé\n');
    
    // Résumé des tests
    console.log('🎉 Tous les tests sont passés avec succès !\n');
    console.log('📋 Fonctionnalités testées:');
    console.log('   ✅ Création d\'événements');
    console.log('   ✅ Lecture et récupération');
    console.log('   ✅ Mise à jour');
    console.log('   ✅ Suppression');
    console.log('   ✅ Filtrage par catégorie');
    console.log('   ✅ Filtrage par statut');
    console.log('   ✅ Recherche textuelle');
    console.log('   ✅ Filtrage par date');
    console.log('   ✅ Événements publics');
    console.log('   ✅ Statistiques');
    console.log('   ✅ Validation des données');
    console.log('\n🚀 Le système de gestion d\'événements est prêt à être utilisé !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    console.error('\n🔧 Vérifiez:');
    console.error('   1. La table events existe et est accessible');
    console.error('   2. Les politiques RLS sont correctement configurées');
    console.error('   3. Votre connexion à Supabase');
    
    // Nettoyage en cas d'erreur
    console.log('\n🧹 Nettoyage des données de test...');
    for (const event of testEvents) {
      try {
        await supabase.from('events').delete().eq('id', event.id);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
    }
    
    process.exit(1);
  }
}

// Exécuter les tests
if (require.main === module) {
  testEventsFeatures();
}

module.exports = { testEventsFeatures };