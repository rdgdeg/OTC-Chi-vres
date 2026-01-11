import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Vérification des variables d\'environnement...');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans votre .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTablesDirectly() {
  console.log('🚀 Création directe des tables pour la page d\'accueil...\n');

  const tables = [
    {
      name: 'newsletter_subscriptions',
      description: 'Table des abonnements newsletter',
      sql: `
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
          source TEXT DEFAULT 'website',
          tags TEXT[] DEFAULT '{}',
          metadata JSONB DEFAULT '{}',
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          unsubscribed_at TIMESTAMP WITH TIME ZONE,
          last_email_sent TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'homepage_content',
      description: 'Table du contenu de la page d\'accueil',
      sql: `
        CREATE TABLE IF NOT EXISTS homepage_content (
          id TEXT PRIMARY KEY,
          section TEXT NOT NULL,
          title TEXT,
          subtitle TEXT,
          content TEXT,
          image_url TEXT,
          cta_text TEXT,
          cta_url TEXT,
          settings JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          updated_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'homepage_news',
      description: 'Table des actualités de la page d\'accueil',
      sql: `
        CREATE TABLE IF NOT EXISTS homepage_news (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT,
          image_url TEXT,
          category TEXT DEFAULT 'Actualité',
          read_time TEXT DEFAULT '2 min',
          is_featured BOOLEAN DEFAULT false,
          is_published BOOLEAN DEFAULT true,
          published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          sort_order INTEGER DEFAULT 0,
          created_by TEXT,
          updated_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'homepage_favorites',
      description: 'Table des coups de cœur de la page d\'accueil',
      sql: `
        CREATE TABLE IF NOT EXISTS homepage_favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT NOT NULL,
          link_url TEXT,
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_by TEXT,
          updated_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  // Créer les tables une par une
  for (const table of tables) {
    try {
      console.log(`📝 Création de ${table.description}...`);
      
      // Utiliser une requête SQL directe
      const { error } = await supabase.rpc('exec_sql', { 
        sql: table.sql 
      });

      if (error) {
        console.error(`❌ Erreur ${table.name}:`, error.message);
        
        // Essayer une approche alternative si rpc échoue
        console.log(`⚠️  Tentative alternative pour ${table.name}...`);
        
        // Pour les tables simples, on peut essayer de les créer via l'API REST
        // Mais c'est limité, donc on affiche juste les instructions
        console.log(`📋 Veuillez exécuter manuellement dans l'éditeur SQL de Supabase :`);
        console.log(table.sql);
        console.log('---');
        
      } else {
        console.log(`✅ ${table.description} créée avec succès`);
      }
    } catch (err) {
      console.error(`❌ Erreur création ${table.name}:`, err.message);
    }
  }

  return true;
}

async function createIndexes() {
  console.log('\n📊 Création des index...');
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);',
    'CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);',
    'CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON homepage_content(section);',
    'CREATE INDEX IF NOT EXISTS idx_homepage_news_published ON homepage_news(is_published, published_at);',
    'CREATE INDEX IF NOT EXISTS idx_homepage_favorites_active ON homepage_favorites(is_active, sort_order);'
  ];

  for (const indexSql of indexes) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (error) {
        console.log(`⚠️  Index: ${error.message}`);
      } else {
        console.log('✅ Index créé');
      }
    } catch (err) {
      console.log(`⚠️  Index: ${err.message}`);
    }
  }
}

async function enableRLS() {
  console.log('\n🔒 Activation des politiques RLS...');
  
  const rlsCommands = [
    'ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE homepage_news ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE homepage_favorites ENABLE ROW LEVEL SECURITY;'
  ];

  for (const rlsSql of rlsCommands) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: rlsSql });
      if (error) {
        console.log(`⚠️  RLS: ${error.message}`);
      } else {
        console.log('✅ RLS activé');
      }
    } catch (err) {
      console.log(`⚠️  RLS: ${err.message}`);
    }
  }
}

async function createPolicies() {
  console.log('\n🛡️  Création des politiques de sécurité...');
  
  const policies = [
    `CREATE POLICY "Public read active homepage content" ON homepage_content FOR SELECT USING (is_active = true);`,
    `CREATE POLICY "Public read published news" ON homepage_news FOR SELECT USING (is_published = true);`,
    `CREATE POLICY "Public read active favorites" ON homepage_favorites FOR SELECT USING (is_active = true);`,
    `CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);`,
    `CREATE POLICY "Authenticated users can manage homepage content" ON homepage_content FOR ALL USING (auth.role() = 'authenticated');`,
    `CREATE POLICY "Authenticated users can manage news" ON homepage_news FOR ALL USING (auth.role() = 'authenticated');`,
    `CREATE POLICY "Authenticated users can manage favorites" ON homepage_favorites FOR ALL USING (auth.role() = 'authenticated');`,
    `CREATE POLICY "Authenticated users can manage newsletters" ON newsletter_subscriptions FOR ALL USING (auth.role() = 'authenticated');`
  ];

  for (const policySql of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policySql });
      if (error) {
        console.log(`⚠️  Politique: ${error.message}`);
      } else {
        console.log('✅ Politique créée');
      }
    } catch (err) {
      console.log(`⚠️  Politique: ${err.message}`);
    }
  }
}

async function insertInitialData() {
  console.log('\n📋 Insertion des données initiales...');

  // Données pour homepage_content
  const contentData = [
    {
      id: 'info-banner',
      section: 'banner',
      title: 'Fermeture du bureau le 11 novembre (férié)',
      subtitle: 'Réouverture le 12 novembre à 9h',
      content: '',
      settings: { type: 'announcement', dismissible: true, enabled: true }
    },
    {
      id: 'hero-main',
      section: 'hero',
      title: 'Bienvenue à Chièvres,',
      subtitle: 'la Cité des Aviateurs !',
      content: 'Suivez notre crosseur, emblème du crossage al\' tonne, et partez à la découverte d\'une ville riche en histoire, traditions et vie associative.',
      settings: { backgroundImage: 'https://picsum.photos/id/1047/1920/1080', videoUrl: '/videos/chievres-intro.mp4' }
    },
    {
      id: 'newsletter-section',
      section: 'newsletter',
      title: 'Inscrivez-vous à notre newsletter',
      subtitle: 'Restez connecté avec Chièvres ! Recevez nos actus, événements et bons plans directement dans votre boîte mail.',
      content: '',
      settings: { 
        buttonText: 'S\'inscrire', 
        successMessage: 'Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.', 
        errorMessage: 'Veuillez entrer une adresse email valide' 
      }
    }
  ];

  try {
    const { error: contentError } = await supabase
      .from('homepage_content')
      .upsert(contentData, { onConflict: 'id' });

    if (contentError) {
      console.error('❌ Erreur insertion contenu:', contentError.message);
    } else {
      console.log('✅ Contenu de base inséré');
    }
  } catch (err) {
    console.error('❌ Erreur contenu:', err.message);
  }

  // Données pour homepage_news
  const newsData = [
    {
      title: 'Ouverture de la nouvelle exposition au Musée de la Vie Rurale',
      excerpt: 'Découvrez "Artisans d\'autrefois", une exposition temporaire qui met en lumière les métiers traditionnels de notre région.',
      content: 'Une nouvelle exposition temporaire ouvre ses portes au Musée de la Vie Rurale...',
      image_url: 'https://picsum.photos/id/1051/400/300',
      category: 'Culture',
      read_time: '3 min',
      is_featured: true,
      sort_order: 1
    },
    {
      title: 'Festival du Crossage 2026 : Save the Date !',
      excerpt: 'Le traditionnel Festival du Crossage al\'tonne aura lieu le premier weekend de septembre. Préparez-vous à vivre une expérience unique !',
      content: 'Le Festival du Crossage revient pour une nouvelle édition...',
      image_url: 'https://picsum.photos/id/1052/400/300',
      category: 'Événement',
      read_time: '2 min',
      is_featured: true,
      sort_order: 2
    },
    {
      title: 'Nouveaux circuits de randonnée balisés',
      excerpt: 'Trois nouveaux parcours de découverte ont été aménagés pour vous faire découvrir les trésors cachés de notre campagne.',
      content: 'De nouveaux circuits de randonnée ont été créés...',
      image_url: 'https://picsum.photos/id/1053/400/300',
      category: 'Nature',
      read_time: '4 min',
      is_featured: false,
      sort_order: 3
    }
  ];

  try {
    const { error: newsError } = await supabase
      .from('homepage_news')
      .insert(newsData);

    if (newsError) {
      console.error('❌ Erreur insertion actualités:', newsError.message);
    } else {
      console.log('✅ Actualités de base insérées');
    }
  } catch (err) {
    console.error('❌ Erreur actualités:', err.message);
  }

  // Données pour homepage_favorites
  const favoritesData = [
    {
      title: 'Église Saint-Martin',
      description: 'Monument historique classé du XIIe siècle',
      image_url: 'https://picsum.photos/id/1041/600/400',
      link_url: '/musees',
      sort_order: 1
    },
    {
      title: 'Le Crossage al\'tonne',
      description: 'Tradition folklorique unique de Chièvres',
      image_url: 'https://picsum.photos/id/1042/600/400',
      link_url: '/crossage',
      sort_order: 2
    },
    {
      title: 'Château de Ladeuze',
      description: 'Patrimoine architectural remarquable',
      image_url: 'https://picsum.photos/id/1043/600/400',
      link_url: '/musees',
      sort_order: 3
    },
    {
      title: 'Sentiers de randonnée',
      description: 'Découvrez la nature environnante',
      image_url: 'https://picsum.photos/id/1044/600/400',
      link_url: '/balades',
      sort_order: 4
    },
    {
      title: 'Place Charles II',
      description: 'Cœur historique de la cité',
      image_url: 'https://picsum.photos/id/1045/600/400',
      link_url: '/musees',
      sort_order: 5
    },
    {
      title: 'Musée de la Vie Rurale',
      description: 'Plongez dans l\'histoire locale',
      image_url: 'https://picsum.photos/id/1046/600/400',
      link_url: '/musees',
      sort_order: 6
    }
  ];

  try {
    const { error: favoritesError } = await supabase
      .from('homepage_favorites')
      .insert(favoritesData);

    if (favoritesError) {
      console.error('❌ Erreur insertion coups de cœur:', favoritesError.message);
    } else {
      console.log('✅ Coups de cœur de base insérés');
    }
  } catch (err) {
    console.error('❌ Erreur coups de cœur:', err.message);
  }
}

async function verifyTables() {
  console.log('\n🔍 Vérification des tables créées...');
  
  const tables = ['newsletter_subscriptions', 'homepage_content', 'homepage_news', 'homepage_favorites'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: OK`);
      }
    } catch (err) {
      console.error(`❌ Table ${table}: ${err.message}`);
    }
  }
}

async function runMigration() {
  try {
    console.log('🎯 Migration simplifiée pour la page d\'accueil\n');
    
    await createTablesDirectly();
    await createIndexes();
    await enableRLS();
    await createPolicies();
    await insertInitialData();
    await verifyTables();
    
    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Vérifiez les tables dans votre dashboard Supabase');
    console.log('2. Testez l\'inscription à la newsletter sur le site');
    console.log('3. Utilisez l\'admin pour modifier le contenu de la page d\'accueil');
    console.log('4. Exécutez: npm run test:homepage');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    
    console.log('\n🔧 Instructions manuelles :');
    console.log('Si la migration automatique échoue, copiez-collez le contenu du fichier');
    console.log('migrations/add-newsletter-and-homepage-content-simple.sql');
    console.log('dans l\'éditeur SQL de votre dashboard Supabase.');
  }
}

runMigration();