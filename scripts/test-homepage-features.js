import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testHomepageFeatures() {
  console.log('🧪 Test des fonctionnalités de la page d\'accueil...\n');

  // Test 1: Inscription newsletter
  console.log('📧 Test 1: Inscription newsletter');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: testEmail,
        name: 'Test User',
        source: 'test'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur inscription newsletter:', error.message);
    } else {
      console.log('✅ Inscription newsletter réussie:', data.email);
      
      // Nettoyer le test
      await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Données de test nettoyées');
    }
  } catch (err) {
    console.error('❌ Erreur test newsletter:', err.message);
  }

  // Test 2: Lecture du contenu de la page d'accueil
  console.log('\n🏠 Test 2: Contenu de la page d\'accueil');
  try {
    const { data: content, error } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Erreur lecture contenu:', error.message);
    } else {
      console.log(`✅ ${content.length} sections de contenu trouvées`);
      content.forEach(item => {
        console.log(`   - ${item.section}: ${item.title || 'Sans titre'}`);
      });
    }
  } catch (err) {
    console.error('❌ Erreur test contenu:', err.message);
  }

  // Test 3: Lecture des actualités
  console.log('\n📰 Test 3: Actualités');
  try {
    const { data: news, error } = await supabase
      .from('homepage_news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Erreur lecture actualités:', error.message);
    } else {
      console.log(`✅ ${news.length} actualités trouvées`);
      news.forEach(item => {
        console.log(`   - ${item.title} (${item.category})`);
      });
    }
  } catch (err) {
    console.error('❌ Erreur test actualités:', err.message);
  }

  // Test 4: Lecture des coups de cœur
  console.log('\n❤️  Test 4: Coups de cœur');
  try {
    const { data: favorites, error } = await supabase
      .from('homepage_favorites')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('❌ Erreur lecture coups de cœur:', error.message);
    } else {
      console.log(`✅ ${favorites.length} coups de cœur trouvés`);
      favorites.forEach(item => {
        console.log(`   - ${item.title}: ${item.description}`);
      });
    }
  } catch (err) {
    console.error('❌ Erreur test coups de cœur:', err.message);
  }

  // Test 5: Statistiques newsletter
  console.log('\n📊 Test 5: Statistiques newsletter');
  try {
    const { data: subscriptions, error } = await supabase
      .from('newsletter_subscriptions')
      .select('status, created_at');

    if (error) {
      console.error('❌ Erreur lecture statistiques:', error.message);
    } else {
      const stats = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'active').length,
        unsubscribed: subscriptions.filter(s => s.status === 'unsubscribed').length,
        bounced: subscriptions.filter(s => s.status === 'bounced').length
      };

      console.log('✅ Statistiques newsletter:');
      console.log(`   - Total: ${stats.total}`);
      console.log(`   - Actifs: ${stats.active}`);
      console.log(`   - Désabonnés: ${stats.unsubscribed}`);
      console.log(`   - Rebonds: ${stats.bounced}`);
    }
  } catch (err) {
    console.error('❌ Erreur test statistiques:', err.message);
  }

  console.log('\n🎉 Tests terminés !');
}

// Test des permissions RLS
async function testRLSPolicies() {
  console.log('\n🔒 Test des politiques RLS...');

  // Test lecture publique
  console.log('👥 Test lecture publique (sans authentification)');
  
  const publicTests = [
    { table: 'homepage_content', condition: 'is_active = true' },
    { table: 'homepage_news', condition: 'is_published = true' },
    { table: 'homepage_favorites', condition: 'is_active = true' }
  ];

  for (const test of publicTests) {
    try {
      const { data, error } = await supabase
        .from(test.table)
        .select('id')
        .limit(1);

      if (error) {
        console.error(`❌ ${test.table}: ${error.message}`);
      } else {
        console.log(`✅ ${test.table}: Lecture publique OK`);
      }
    } catch (err) {
      console.error(`❌ ${test.table}: ${err.message}`);
    }
  }
}

// Fonction principale
async function runTests() {
  console.log('🚀 Démarrage des tests des fonctionnalités page d\'accueil\n');
  
  await testHomepageFeatures();
  await testRLSPolicies();
  
  console.log('\n✨ Tous les tests sont terminés !');
  console.log('\n📋 Prochaines étapes :');
  console.log('1. Vérifiez que tous les tests sont ✅');
  console.log('2. Testez l\'interface admin dans le navigateur');
  console.log('3. Testez l\'inscription newsletter sur le site public');
  console.log('4. Vérifiez que le contenu s\'affiche correctement');
}

runTests().catch(console.error);