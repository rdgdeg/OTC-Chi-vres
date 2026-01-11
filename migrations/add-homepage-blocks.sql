-- Migration pour ajouter les blocs éditables de la page d'accueil

-- Table pour les blocs de navigation éditables
CREATE TABLE IF NOT EXISTS homepage_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT,
    link_url VARCHAR(255),
    icon_name VARCHAR(100), -- nom de l'icône Lucide
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

-- Mise à jour du contenu hero pour la bannière d'accueil
UPDATE homepage_content 
SET 
    title = 'Bienvenue à Chièvres',
    subtitle = 'La cité des aviateurs vous accueille',
    content = 'Découvrez une commune riche en histoire, en traditions et en nature. Entre patrimoine exceptionnel et modernité, Chièvres vous invite à explorer ses trésors cachés.',
    image_url = 'https://picsum.photos/1920/800?grayscale',
    cta_text = 'Découvrir Chièvres',
    cta_url = '/musees'
WHERE section = 'hero';

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