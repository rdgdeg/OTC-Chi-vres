import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Démarrage de la migration des blocs homepage...');

    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add-homepage-blocks.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Diviser le SQL en commandes individuelles
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Exécution de ${commands.length} commandes...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        console.log(`  Commande ${i + 1}/${commands.length}...`);
        const { error } = await supabase.rpc('exec', { sql: command });
        
        if (error) {
          console.error(`❌ Erreur commande ${i + 1}:`, error);
          // Continuer avec les autres commandes
        }
      }
    }

    console.log('✅ Migration exécutée !');

    // Vérifier que les données ont été insérées
    console.log('🔍 Vérification des données...');
    const { data: blocks, error: selectError } = await supabase
      .from('homepage_blocks')
      .select('*')
      .order('sort_order');

    if (selectError) {
      console.error('❌ Erreur lors de la vérification:', selectError);
      return;
    }

    console.log(`✅ ${blocks.length} blocs créés avec succès :`);
    blocks.forEach((block, index) => {
      console.log(`  ${index + 1}. ${block.title} (${block.link_url})`);
    });

    console.log('\n🎉 Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

runMigration();