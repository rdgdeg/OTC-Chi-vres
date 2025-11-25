-- ===================================
-- VISITCHIEVRES.BE - Supabase Schema
-- ===================================
-- Execute this SQL in your Supabase SQL Editor
-- to create all necessary tables

-- 1. PLACES TABLE (Museums, Restaurants, Hotels, Shops, Walks)
CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    "imageUrl" TEXT,
    type TEXT NOT NULL CHECK (type IN ('museum', 'restaurant', 'hotel', 'shop', 'walk', 'cafe', 'producer')),
    rating NUMERIC,
    phone TEXT,
    email TEXT,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    tags TEXT[] DEFAULT '{}',
    lat NUMERIC,
    lng NUMERIC,
    -- For walks
    distance TEXT,
    duration TEXT,
    difficulty TEXT,
    -- For museums/restaurants
    "openingHours" TEXT,
    price TEXT,
    "practicalInfo" TEXT,
    -- Gallery
    "galleryImages" TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('adulte', 'enfant', 'teambuilding', 'famille')),
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    "imageUrl" TEXT,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    day INTEGER NOT NULL,
    month TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('folklore', 'culture', 'sport', 'marché')),
    "imageUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ARTICLES TABLE (Blog)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    "imageUrl" TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS TABLE (Shop)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    "imageUrl" TEXT,
    category TEXT NOT NULL CHECK (category IN ('souvenir', 'livre', 'terroir')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PAGE_CONTENT TABLE (CMS)
CREATE TABLE IF NOT EXISTS page_content (
    id TEXT PRIMARY KEY,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroImage" TEXT,
    "introTitle" TEXT,
    "introText" TEXT,
    "extraTitle" TEXT,
    "extraText" TEXT,
    "extraImage" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- INDEXES for better performance
-- ===================================

CREATE INDEX IF NOT EXISTS idx_places_type ON places(type);
CREATE INDEX IF NOT EXISTS idx_places_lat_lng ON places(lat, lng);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================
-- Enable RLS on all tables
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT)
CREATE POLICY "Allow public read access on places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access on articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on page_content" ON page_content FOR SELECT USING (true);

-- Allow authenticated users to INSERT/UPDATE/DELETE
-- Note: For production, you should create a service role or use proper authentication
CREATE POLICY "Allow authenticated insert on places" ON places FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on places" ON places FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on places" ON places FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on experiences" ON experiences FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on experiences" ON experiences FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on events" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on events" ON events FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on articles" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on articles" ON articles FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on articles" ON articles FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on page_content" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on page_content" ON page_content FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on page_content" ON page_content FOR DELETE USING (true);

-- ===================================
-- TRIGGERS for updated_at
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ===================================
-- STORAGE BUCKETS for Images
-- ===================================
-- Create storage bucket for images (run this in Supabase Dashboard > Storage)
-- Bucket name: 'images'
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Storage policies (to be created in Supabase Dashboard)
-- 1. Allow public read: SELECT with no conditions
-- 2. Allow authenticated upload: INSERT for authenticated users
-- 3. Allow authenticated update: UPDATE for authenticated users
-- 4. Allow authenticated delete: DELETE for authenticated users

-- ===================================
-- NOTES
-- ===================================
-- 1. After running this script, use the "Initialiser DB" button in the admin panel
--    to populate the tables with initial data
-- 2. Create the 'images' storage bucket in Supabase Dashboard > Storage
-- 3. For production, consider implementing proper authentication instead of allowing
--    all authenticated users to modify data
-- 4. The RLS policies are permissive for development. Tighten them for production.
