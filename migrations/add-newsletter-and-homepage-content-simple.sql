-- Migration simplifiée pour la gestion des newsletters et du contenu de la page d'accueil
-- Version sans dépendances aux tables utilisateurs

-- 1. Table pour les inscriptions newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website', -- website, admin, import, etc.
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}', -- Informations supplémentaires
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    last_email_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour le contenu dynamique de la page d'accueil
CREATE TABLE IF NOT EXISTS homepage_content (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL, -- 'banner', 'hero', 'news', 'favorites', 'newsletter'
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_url TEXT,
    settings JSONB DEFAULT '{}', -- Configuration spécifique à chaque section
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    updated_by TEXT, -- Simplifié en TEXT pour éviter les dépendances
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table pour les actualités de la page d'accueil
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
    created_by TEXT, -- Simplifié en TEXT
    updated_by TEXT, -- Simplifié en TEXT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table pour les coups de cœur de la page d'accueil
CREATE TABLE IF NOT EXISTS homepage_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_by TEXT, -- Simplifié en TEXT
    updated_by TEXT, -- Simplifié en TEXT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at);

CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON homepage_content(section);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON homepage_content(is_active);

CREATE INDEX IF NOT EXISTS idx_homepage_news_published ON homepage_news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_homepage_news_featured ON homepage_news(is_featured);

CREATE INDEX IF NOT EXISTS idx_homepage_favorites_active ON homepage_favorites(is_active, sort_order);

-- RLS Policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_favorites ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le contenu de la page d'accueil
CREATE POLICY "Public read active homepage content" ON homepage_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published news" ON homepage_news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active favorites" ON homepage_favorites FOR SELECT USING (is_active = true);

-- Insertion publique pour les newsletters
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- Gestion complète pour les utilisateurs authentifiés (simplifié)
CREATE POLICY "Authenticated users can manage homepage content" ON homepage_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage news" ON homepage_news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage favorites" ON homepage_favorites FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage newsletters" ON newsletter_subscriptions FOR ALL USING (auth.role() = 'authenticated');

-- Fonction pour mettre à jour updated_at (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON homepage_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_news_updated_at BEFORE UPDATE ON homepage_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_favorites_updated_at BEFORE UPDATE ON homepage_favorites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales pour le contenu de la page d'accueil
INSERT INTO homepage_content (id, section, title, subtitle, content, settings) VALUES
('info-banner', 'banner', 'Fermeture du bureau le 11 novembre (férié)', 'Réouverture le 12 novembre à 9h', '', '{"type": "announcement", "dismissible": true, "enabled": true}'),
('hero-main', 'hero', 'Bienvenue à Chièvres,', 'la Cité des Aviateurs !', 'Suivez notre crosseur, emblème du crossage al'' tonne, et partez à la découverte d''une ville riche en histoire, traditions et vie associative.', '{"backgroundImage": "https://picsum.photos/id/1047/1920/1080", "videoUrl": "/videos/chievres-intro.mp4"}'),
('newsletter-section', 'newsletter', 'Inscrivez-vous à notre newsletter', 'Restez connecté avec Chièvres ! Recevez nos actus, événements et bons plans directement dans votre boîte mail.', '', '{"buttonText": "S''inscrire", "successMessage": "Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.", "errorMessage": "Veuillez entrer une adresse email valide"}')
ON CONFLICT (id) DO NOTHING;

-- Données initiales pour les actualités
INSERT INTO homepage_news (title, excerpt, content, image_url, category, read_time, is_featured, sort_order) VALUES
('Ouverture de la nouvelle exposition au Musée de la Vie Rurale', 'Découvrez "Artisans d''autrefois", une exposition temporaire qui met en lumière les métiers traditionnels de notre région.', 'Une nouvelle exposition temporaire ouvre ses portes au Musée de la Vie Rurale...', 'https://picsum.photos/id/1051/400/300', 'Culture', '3 min', true, 1),
('Festival du Crossage 2026 : Save the Date !', 'Le traditionnel Festival du Crossage al''tonne aura lieu le premier weekend de septembre. Préparez-vous à vivre une expérience unique !', 'Le Festival du Crossage revient pour une nouvelle édition...', 'https://picsum.photos/id/1052/400/300', 'Événement', '2 min', true, 2),
('Nouveaux circuits de randonnée balisés', 'Trois nouveaux parcours de découverte ont été aménagés pour vous faire découvrir les trésors cachés de notre campagne.', 'De nouveaux circuits de randonnée ont été créés...', 'https://picsum.photos/id/1053/400/300', 'Nature', '4 min', false, 3);

-- Données initiales pour les coups de cœur
INSERT INTO homepage_favorites (title, description, image_url, link_url, sort_order) VALUES
('Église Saint-Martin', 'Monument historique classé du XIIe siècle', 'https://picsum.photos/id/1041/600/400', '/musees', 1),
('Le Crossage al''tonne', 'Tradition folklorique unique de Chièvres', 'https://picsum.photos/id/1042/600/400', '/crossage', 2),
('Château de Ladeuze', 'Patrimoine architectural remarquable', 'https://picsum.photos/id/1043/600/400', '/musees', 3),
('Sentiers de randonnée', 'Découvrez la nature environnante', 'https://picsum.photos/id/1044/600/400', '/balades', 4),
('Place Charles II', 'Cœur historique de la cité', 'https://picsum.photos/id/1045/600/400', '/musees', 5),
('Musée de la Vie Rurale', 'Plongez dans l''histoire locale', 'https://picsum.photos/id/1046/600/400', '/musees', 6);