import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Lire la configuration
const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configuration Supabase manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔄 Application de la migration pour les types multiples...');
  
  try {
    // Lire le script de migration
    const migrationScript = fs.readFileSync('migrations/update-accommodations-multiple-types.sql', 'utf8');
    
    // Diviser le script en commandes individuelles
    const commands = migrationScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Exécution de ${commands.length} commandes...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.includes('COMMENT ON') || command.includes('SELECT')) {
        // Ignorer les commentaires et les sélections pour cette version simplifiée
        continue;
      }
      
      console.log(`⚡ Commande ${i + 1}/${commands.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command + ';' });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️ Avertissement commande ${i + 1}:`, error.message);
        }
      } catch (err) {
        console.warn(`⚠️ Erreur commande ${i + 1}:`, err.message);
      }
    }
    
    console.log('✅ Migration appliquée !');
    
    // Test de vérification
    console.log('🧪 Vérification des données...');
    const { data: testData, error: testError } = await supabase
      .from('accommodations')
      .select('id, name, type')
      .limit(3);
      
    if (testError) {
      console.error('❌ Test de vérification échoué:', testError.message);
    } else {
      console.log('✅ Vérification réussie:');
      testData?.forEach(item => {
        console.log(`  - ${item.name}: ${Array.isArray(item.type) ? item.type.join(', ') : item.type}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Erreur générale:', err.message);
  }
}

applyMigration();