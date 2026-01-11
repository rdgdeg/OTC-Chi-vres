-- ===================================
-- VISITCHIEVRES.BE - Enhanced Schema
-- Système complet de gestion office de tourisme
-- ===================================

-- 1. PROFILS UTILISATEURS
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    avatar TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AUDIT LOG (Traçabilité des modifications)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATÉGORIES (pour organiser le contenu)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT,
    "parentId" TEXT REFERENCES categories(id),
    "sortOrder" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TAGS (système de tags flexible)
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6B7280',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MÉDIAS (gestion centralisée des images/fichiers)
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID REFERENCES user_profiles(id),
    folder TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PLACES AMÉLIORÉE (avec relations)
DROP TABLE IF EXISTS places CASCADE;
CREATE TABLE places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    excerpt TEXT, -- Description courte
    address TEXT,
    type TEXT NOT NULL CHECK (type IN ('museum', 'restaurant', 'hotel', 'shop', 'walk', 'cafe', 'producer')),
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    
    -- Médias
    featured_image UUID REFERENCES media(id),
    gallery_images UUID[] DEFAULT '{}',
    
    -- Contact
    phone TEXT,
    email TEXT,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    
    -- Géolocalisation
    lat NUMERIC,
    lng NUMERIC,
    
    -- Spécifique aux balades
    distance TEXT,
    duration TEXT,
    difficulty TEXT CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),
    
    -- Spécifique aux musées/restaurants
    "openingHours" JSONB, -- Structure flexible pour les horaires
    price_range TEXT,
    "practicalInfo" TEXT,
    
    -- Métadonnées
    category_id TEXT REFERENCES categories(id),
    tag_ids TEXT[] DEFAULT '{}',
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    view_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Audit
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EXPÉRIENCES AMÉLIORÉES
DROP TABLE IF EXISTS experiences CASCADE;
CREATE TABLE experiences (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    excerpt TEXT,
    category TEXT NOT NULL CHECK (category IN ('adulte', 'enfant', 'teambuilding', 'famille')),
    price_text TEXT NOT NULL,
    price_amount NUMERIC,
    duration TEXT NOT NULL,
    max_participants INTEGER,
    min_age INTEGER,
    
    -- Médias
    featured_image UUID REFERENCES media(id),
    gallery_images UUID[] DEFAULT '{}',
    
    -- Contenu
    features TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    not_included TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    
    -- Métadonnées
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    tag_ids TEXT[] DEFAULT '{}',
    
    -- Audit
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ÉVÉNEMENTS AMÉLIORÉS
DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    excerpt TEXT,
    
    -- Dates et horaires
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_all_day BOOLEAN DEFAULT false,
    recurrence_rule TEXT, -- Pour les événements récurrents
    
    -- Lieu
    location TEXT NOT NULL,
    venue_id TEXT REFERENCES places(id),
    
    -- Catégorie et type
    category TEXT NOT NULL CHECK (category IN ('folklore', 'culture', 'sport', 'marché', 'conference', 'festival')),
    event_type TEXT DEFAULT 'public' CHECK (event_type IN ('public', 'private', 'members_only')),
    
    -- Médias
    featured_image UUID REFERENCES media(id),
    gallery_images UUID[] DEFAULT '{}',
    
    -- Informations pratiques
    price_text TEXT,
    price_amount NUMERIC,
    registration_required BOOLEAN DEFAULT false,
    registration_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    max_attendees INTEGER,
    
    -- Métadonnées
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'archived')),
    tag_ids TEXT[] DEFAULT '{}',
    
    -- Audit
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ARTICLES AMÉLIORÉS (Blog)
DROP TABLE IF EXISTS articles CASCADE;
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Contenu complet de l'article
    
    -- Médias
    featured_image UUID REFERENCES media(id),
    gallery_images UUID[] DEFAULT '{}',
    
    -- Publication
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    category_id TEXT REFERENCES categories(id),
    tag_ids TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Audit
    author_id UUID REFERENCES user_profiles(id),
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PRODUITS AMÉLIORÉS (Boutique)
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    
    -- Prix et stock
    price NUMERIC NOT NULL,
    compare_price NUMERIC, -- Prix barré
    cost_price NUMERIC, -- Prix de revient
    sku TEXT UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    track_stock BOOLEAN DEFAULT true,
    
    -- Médias
    featured_image UUID REFERENCES media(id),
    gallery_images UUID[] DEFAULT '{}',
    
    -- Catégorie et attributs
    category TEXT NOT NULL CHECK (category IN ('souvenir', 'livre', 'terroir', 'artisanat', 'textile')),
    weight NUMERIC,
    dimensions JSONB, -- {length, width, height}
    
    -- Métadonnées
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    tag_ids TEXT[] DEFAULT '{}',
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Audit
    created_by UUID REFERENCES user_profiles(id),
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CONTENU DES PAGES AMÉLIORÉ
DROP TABLE IF EXISTS page_content CASCADE;
CREATE TABLE page_content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    
    -- Contenu Hero
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image UUID REFERENCES media(id),
    hero_cta_text TEXT,
    hero_cta_url TEXT,
    
    -- Contenu principal
    intro_title TEXT,
    intro_text TEXT,
    content_blocks JSONB DEFAULT '[]', -- Blocs de contenu flexibles
    
    -- Métadonnées
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Audit
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- INDEXES POUR PERFORMANCE
-- ===================================

-- Places
CREATE INDEX IF NOT EXISTS idx_places_type ON places(type);
CREATE INDEX IF NOT EXISTS idx_places_status ON places(status);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_location ON places(lat, lng);
CREATE INDEX IF NOT EXISTS idx_places_slug ON places(slug);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Articles
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Media
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Activer RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (contenu publié)
CREATE POLICY "Public read published places" ON places FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published experiences" ON experiences FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Public read published pages" ON page_content FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- Politiques pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can read all content" ON places FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read all experiences" ON experiences FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read all events" ON events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read all articles" ON articles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read all products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read all pages" ON page_content FOR SELECT USING (auth.role() = 'authenticated');

-- Politiques d'écriture (à affiner selon les rôles)
CREATE POLICY "Authenticated users can insert content" ON places FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update content" ON places FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete content" ON places FOR DELETE USING (auth.role() = 'authenticated');

-- Répéter pour les autres tables...
-- (Politiques similaires pour experiences, events, articles, products, page_content)

-- Profils utilisateurs (accès restreint)
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Audit log (lecture seule pour les admins)
CREATE POLICY "Authenticated users can read audit log" ON audit_log FOR SELECT USING (auth.role() = 'authenticated');

-- ===================================
-- TRIGGERS POUR AUDIT ET TIMESTAMPS
-- ===================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour l'audit log
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (user_id, table_name, record_id, action, old_values)
        VALUES (auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (user_id, table_name, record_id, action, old_values, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (user_id, table_name, record_id, action, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Appliquer les triggers d'audit
CREATE TRIGGER audit_places_trigger
    AFTER INSERT OR UPDATE OR DELETE ON places
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_experiences_trigger
    AFTER INSERT OR UPDATE OR DELETE ON experiences
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_articles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON articles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ===================================
-- DONNÉES INITIALES
-- ===================================

-- Catégories par défaut
INSERT INTO categories (id, name, description, color, icon) VALUES
('patrimoine', 'Patrimoine', 'Sites historiques et monuments', '#8B5CF6', 'landmark'),
('nature', 'Nature & Balades', 'Espaces verts et randonnées', '#10B981', 'tree-pine'),
('gastronomie', 'Gastronomie', 'Restaurants et spécialités locales', '#F59E0B', 'utensils'),
('hebergement', 'Hébergement', 'Hôtels et chambres d\'hôtes', '#3B82F6', 'bed'),
('commerce', 'Commerce', 'Boutiques et artisans', '#EF4444', 'shopping-bag'),
('culture', 'Culture', 'Événements et activités culturelles', '#EC4899', 'palette'),
('sport', 'Sport & Loisirs', 'Activités sportives et de loisirs', '#06B6D4', 'activity')
ON CONFLICT (id) DO NOTHING;

-- Tags par défaut
INSERT INTO tags (id, name, color) VALUES
('famille', 'Famille', '#10B981'),
('gratuit', 'Gratuit', '#3B82F6'),
('exterieur', 'Extérieur', '#10B981'),
('interieur', 'Intérieur', '#6B7280'),
('accessible', 'Accessible PMR', '#8B5CF6'),
('parking', 'Parking', '#F59E0B'),
('groupe', 'Groupe', '#EC4899'),
('reservation', 'Sur réservation', '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- ===================================
-- NOTES D'IMPLÉMENTATION
-- ===================================
-- 1. Exécuter ce script dans l'éditeur SQL de Supabase
-- 2. Configurer l'authentification Supabase (Email/Password)
-- 3. Créer le bucket 'media' dans Storage avec les bonnes politiques
-- 4. Implémenter les composants d'administration avec les nouveaux types
-- 5. Migrer les données existantes vers la nouvelle structure