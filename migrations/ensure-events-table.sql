-- ===================================
-- MIGRATION: Assurer la table events
-- ===================================

-- Créer la table events si elle n'existe pas
CREATE TABLE IF NOT EXISTS events (
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

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Vérifier et ajouter les colonnes manquantes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'excerpt') THEN
        ALTER TABLE events ADD COLUMN excerpt TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_all_day') THEN
        ALTER TABLE events ADD COLUMN is_all_day BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'recurrence_rule') THEN
        ALTER TABLE events ADD COLUMN recurrence_rule TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'venue_id') THEN
        ALTER TABLE events ADD COLUMN venue_id TEXT REFERENCES places(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_type') THEN
        ALTER TABLE events ADD COLUMN event_type TEXT DEFAULT 'public' CHECK (event_type IN ('public', 'private', 'members_only'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'featured_image') THEN
        ALTER TABLE events ADD COLUMN featured_image UUID REFERENCES media(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'gallery_images') THEN
        ALTER TABLE events ADD COLUMN gallery_images UUID[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'price_text') THEN
        ALTER TABLE events ADD COLUMN price_text TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'price_amount') THEN
        ALTER TABLE events ADD COLUMN price_amount NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_required') THEN
        ALTER TABLE events ADD COLUMN registration_required BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_url') THEN
        ALTER TABLE events ADD COLUMN registration_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'contact_email') THEN
        ALTER TABLE events ADD COLUMN contact_email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'contact_phone') THEN
        ALTER TABLE events ADD COLUMN contact_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'max_attendees') THEN
        ALTER TABLE events ADD COLUMN max_attendees INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'tag_ids') THEN
        ALTER TABLE events ADD COLUMN tag_ids TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'created_by') THEN
        ALTER TABLE events ADD COLUMN created_by UUID REFERENCES user_profiles(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'updated_by') THEN
        ALTER TABLE events ADD COLUMN updated_by UUID REFERENCES user_profiles(id);
    END IF;
END $$;

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

-- Activer RLS si pas déjà fait
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les événements
DROP POLICY IF EXISTS "Public read published events" ON events;
CREATE POLICY "Public read published events" ON events 
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can read all events" ON events;
CREATE POLICY "Authenticated users can read all events" ON events 
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
CREATE POLICY "Authenticated users can insert events" ON events 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
CREATE POLICY "Authenticated users can update events" ON events 
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;
CREATE POLICY "Authenticated users can delete events" ON events 
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour l'audit
DROP TRIGGER IF EXISTS audit_events_trigger ON events;
CREATE TRIGGER audit_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Insérer quelques événements d'exemple
INSERT INTO events (
    id, title, description, excerpt, start_date, end_date, is_all_day,
    location, category, event_type, price_text, registration_required,
    contact_email, status, created_at, updated_at
) VALUES 
(
    'event_folklore_2024_01',
    'Fête du Folklore de Chièvres',
    'Venez découvrir les traditions folkloriques de notre belle région lors de cette journée exceptionnelle. Au programme : danses traditionnelles, musique folklorique, artisanat local et spécialités culinaires. Un événement familial qui ravira petits et grands !',
    'Une journée dédiée aux traditions folkloriques de la région avec danses, musique et artisanat local.',
    '2024-07-15 10:00:00+02',
    '2024-07-15 22:00:00+02',
    false,
    'Grand-Place de Chièvres',
    'folklore',
    'public',
    'Gratuit',
    false,
    'folklore@chievres.be',
    'published',
    NOW(),
    NOW()
),
(
    'event_marche_2024_02',
    'Marché de Noël de Chièvres',
    'Le traditionnel marché de Noël de Chièvres vous accueille avec ses chalets décorés, ses produits artisanaux et ses délicieuses spécialités de saison. Ambiance chaleureuse garantie avec vin chaud, chocolat chaud et animations pour les enfants.',
    'Marché de Noël traditionnel avec chalets artisanaux et animations festives.',
    '2024-12-14 16:00:00+01',
    '2024-12-15 20:00:00+01',
    false,
    'Grand-Place de Chièvres',
    'marché',
    'public',
    'Gratuit',
    false,
    'marche@chievres.be',
    'published',
    NOW(),
    NOW()
),
(
    'event_culture_2024_03',
    'Concert de Musique Classique',
    'L\'Ensemble Baroque de Wallonie vous propose un concert exceptionnel dans le cadre magnifique de l\'église Saint-Martin. Au programme : œuvres de Bach, Vivaldi et Haendel interprétées sur instruments d\'époque.',
    'Concert de musique baroque dans l\'église Saint-Martin.',
    '2024-09-21 20:00:00+02',
    '2024-09-21 22:00:00+02',
    false,
    'Église Saint-Martin, Chièvres',
    'culture',
    'public',
    '15€ - Gratuit -12 ans',
    true,
    'culture@chievres.be',
    'published',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration events terminée avec succès !';
    RAISE NOTICE 'Table events créée/mise à jour avec tous les champs nécessaires';
    RAISE NOTICE 'Index et politiques RLS configurés';
    RAISE NOTICE 'Événements d''exemple ajoutés';
END $$;