import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clé service pour les opérations admin

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Démarrage de la migration pour la page d\'accueil et newsletter...');

    // Lire le fichier de migration
    const migrationPath = path.join(process.cwd(), 'migrations', 'add-newsletter-and-homepage-content.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Diviser le SQL en commandes individuelles
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Exécution de ${commands.length} commandes SQL...`);

    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⏳ Commande ${i + 1}/${commands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.error(`❌ Erreur commande ${i + 1}:`, error.message);
            // Continuer avec les autres commandes
          } else {
            console.log(`✅ Commande ${i + 1} exécutée avec succès`);
          }
        } catch (err) {
          console.error(`❌ Erreur commande ${i + 1}:`, err.message);
        }
      }
    }

    // Vérifier que les tables ont été créées
    console.log('\n🔍 Vérification des tables créées...');
    
    const tables = [
      'newsletter_subscriptions',
      'homepage_content', 
      'homepage_news',
      'homepage_favorites'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`❌ Table ${table} non accessible:`, error.message);
      } else {
        console.log(`✅ Table ${table} créée et accessible`);
      }
    }

    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Vérifiez les tables dans votre dashboard Supabase');
    console.log('2. Testez l\'inscription à la newsletter sur le site');
    console.log('3. Utilisez l\'admin pour modifier le contenu de la page d\'accueil');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Fonction alternative si rpc n'est pas disponible
async function runMigrationDirect() {
  try {
    console.log('🚀 Exécution directe de la migration...');

    // Créer les tables une par une
    const tables = [
      {
        name: 'newsletter_subscriptions',
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
            updated_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ];

    for (const table of tables) {
      console.log(`📝 Création de la table ${table.name}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      
      if (error) {
        console.error(`❌ Erreur table ${table.name}:`, error.message);
      } else {
        console.log(`✅ Table ${table.name} créée`);
      }
    }

    console.log('🎉 Migration directe terminée !');

  } catch (error) {
    console.error('❌ Erreur migration directe:', error);
  }
}

// Exécuter la migration
console.log('🔧 Tentative de migration...');
runMigration().catch(() => {
  console.log('⚠️  Migration standard échouée, tentative directe...');
  runMigrationDirect();
});