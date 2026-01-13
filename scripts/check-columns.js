import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkColumns() {
  const tables = ['accommodations', 'events', 'articles', 'products', 'page_content', 'experiences'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (!error && data && data[0]) {
        console.log(`${table}: ${Object.keys(data[0]).join(', ')}`);
      } else {
        console.log(`${table}: Aucune donnée ou erreur`);
      }
    } catch (e) {
      console.log(`${table}: Erreur - ${e.message}`);
    }
  }
}

checkColumns();