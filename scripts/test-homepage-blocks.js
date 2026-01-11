import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testHomepageBlocks() {
  try {
    console.log('🚀 Test de la table homepage_blocks...');

    // Tester si la table existe en essayant de lire
    const { data, error } = await supabase
      .from('homepage_blocks')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Table homepage_blocks n\'existe pas encore:', error.message);
      console.log('\n📝 Veuillez exécuter cette migration SQL dans votre dashboard Supabase :');
      console.log('\n--- DÉBUT DE LA MIGRATION ---');
      
      const migrationSQL = `
-- Table pour les blocs de navigation éditables
CREATE TABLE IF NOT EXISTS homepage_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT,
    link_url VARCHAR(255),
    icon_name VARCHAR(100),
    background_color VARCHAR(50) DEFAULT '#f3f4f6',
    text_color VARCHAR(50) DEFAULT '#1f2937',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des blocs par défaut
INSERT INTO homepage_blocks (title, subtitle, description, image_url, link_url, icon_name, background_color, sort_order) VALUES
('Patrimoine & Histoire', 'Découvrez notre riche passé', 'Explorez nos musées, monuments historiques et sites emblématiques qui racontent l''histoire fascinante de Chièvres.', 'https://picsum.photos/id/1041/600/400', '/musees', 'MapPin', '#fef3c7', 1),
('Événements & festivités', 'Vivez nos traditions', 'Participez à nos événements culturels, festivités locales et découvrez le crossage, notre tradition unique.', 'https://picsum.photos/id/1042/600/400', '/agenda', 'Calendar', '#dbeafe', 2),
('Nature & balades', 'Respirez la nature', 'Parcourez nos sentiers de randonnée, découvrez notre patrimoine naturel et profitez de nos espaces verts.', 'https://picsum.photos/id/1043/600/400', '/balades', 'Mountain', '#dcfce7', 3),
('Saveurs locales', 'Goûtez nos spécialités', 'Découvrez notre gastronomie locale, nos producteurs et les restaurants qui mettent à l''honneur nos terroirs.', 'https://picsum.photos/id/1044/600/400', '/restaurants', 'Utensils', '#fce7f3', 4),
('Hébergements', 'Séjournez chez nous', 'Trouvez l''hébergement parfait : gîtes authentiques, chambres d''hôtes chaleureuses et plus encore.', 'https://picsum.photos/id/1045/600/400', '/hebergements', 'Bed', '#f0fdf4', 5);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_homepage_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_homepage_blocks_updated_at
    BEFORE UPDATE ON homepage_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_blocks_updated_at();

-- Politique RLS pour homepage_blocks
ALTER TABLE homepage_blocks ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Allow public read access to homepage_blocks" ON homepage_blocks
    FOR SELECT USING (true);

-- Politique d'écriture pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to manage homepage_blocks" ON homepage_blocks
    FOR ALL USING (auth.role() = 'authenticated');
`;
      
      console.log(migrationSQL);
      console.log('--- FIN DE LA MIGRATION ---\n');
      
      return;
    }

    console.log('✅ Table homepage_blocks existe !');
    console.log(`📊 ${data.length} blocs trouvés`);

    // Tester la lecture de tous les blocs
    const { data: allBlocks, error: allError } = await supabase
      .from('homepage_blocks')
      .select('*')
      .order('sort_order');

    if (allError) {
      console.error('❌ Erreur lors de la lecture:', allError);
      return;
    }

    console.log(`\n📋 Liste des blocs (${allBlocks.length}) :`);
    allBlocks.forEach((block, index) => {
      console.log(`  ${index + 1}. ${block.title}`);
      console.log(`     - Lien: ${block.link_url}`);
      console.log(`     - Couleur: ${block.background_color}`);
      console.log(`     - Actif: ${block.is_active ? '✅' : '❌'}`);
    });

    console.log('\n🎉 Test terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testHomepageBlocks();