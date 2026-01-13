-- ===================================
-- CORRECTION ADMIN - Tables manquantes et authentification
-- ===================================

-- 0. VÉRIFIER ET AJOUTER LES COLONNES MANQUANTES À LA TABLE PLACES
-- Ajouter la colonne status si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'places' AND column_name = 'status') THEN
        ALTER TABLE places ADD COLUMN status TEXT DEFAULT 'published' 
        CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
END $$;

-- Ajouter downloadUrl si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'places' AND column_name = 'downloadUrl') THEN
        ALTER TABLE places ADD COLUMN "downloadUrl" TEXT;
    END IF;
END $$;

-- Ajouter documentUrl si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'places' AND column_name = 'documentUrl') THEN
        ALTER TABLE places ADD COLUMN "documentUrl" TEXT;
    END IF;
END $$;

-- Ajouter created_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'places' AND column_name = 'created_at') THEN
        ALTER TABLE places ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Ajouter updated_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'places' AND column_name = 'updated_at') THEN
        ALTER TABLE places ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 1. CRÉER LA TABLE WALKS (alias pour places de type walk)
-- Cette table est une vue pour simplifier l'accès aux balades
CREATE OR REPLACE VIEW walks AS
SELECT 
    id,
    name,
    description,
    COALESCE(address, '') as address,
    lat,
    lng,
    COALESCE(distance, '') as distance,
    COALESCE(duration, '') as duration,
    COALESCE(difficulty, '') as difficulty,
    COALESCE("downloadUrl", '') as "downloadUrl",
    COALESCE("documentUrl", '') as "documentUrl",
    COALESCE(phone, '') as phone,
    COALESCE(email, '') as email,
    COALESCE(website, '') as website,
    COALESCE(status, 'published') as status,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM places 
WHERE type = 'walk';

-- 2. CRÉER LA TABLE TEAM_MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    phone TEXT,
    photo_url TEXT,
    social_links JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ACTIVER RLS SUR TEAM_MEMBERS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 4. POLITIQUES RLS POUR TEAM_MEMBERS
-- Lecture publique pour les membres actifs
CREATE POLICY "Public read active team members" ON team_members 
FOR SELECT USING (is_active = true);

-- Accès complet pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users full access team members" ON team_members 
FOR ALL USING (auth.role() = 'authenticated');

-- 5. TRIGGER POUR UPDATED_AT SUR TEAM_MEMBERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at 
BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5.1. TRIGGER POUR UPDATED_AT SUR PLACES (si pas déjà existant)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_places_updated_at') THEN
        CREATE TRIGGER update_places_updated_at 
        BEFORE UPDATE ON places
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6. INSÉRER QUELQUES MEMBRES D'ÉQUIPE PAR DÉFAUT
INSERT INTO team_members (name, position, bio, display_order) VALUES
('Directeur Office de Tourisme', 'Directeur', 'Responsable de l''office de tourisme de Chièvres', 1),
('Agent d''accueil', 'Accueil et Information', 'Accueil des visiteurs et information touristique', 2),
('Responsable Communication', 'Communication', 'Gestion de la communication et des événements', 3)
ON CONFLICT (id) DO NOTHING;

-- 7. CRÉER UNE TABLE POUR LES SESSIONS ADMIN (alternative à l'auth anonyme)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. POLITIQUES POUR ADMIN_SESSIONS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin sessions access" ON admin_sessions 
FOR ALL USING (auth.role() = 'authenticated');

-- 9. FONCTION POUR CRÉER UNE SESSION ADMIN
CREATE OR REPLACE FUNCTION create_admin_session()
RETURNS TEXT AS $$
DECLARE
    session_token TEXT;
BEGIN
    -- Générer un token de session
    session_token := encode(gen_random_bytes(32), 'base64');
    
    -- Insérer la session
    INSERT INTO admin_sessions (session_token, expires_at)
    VALUES (session_token, NOW() + INTERVAL '24 hours');
    
    RETURN session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. FONCTION POUR VALIDER UNE SESSION ADMIN
CREATE OR REPLACE FUNCTION validate_admin_session(token TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_sessions 
        WHERE session_token = token 
        AND expires_at > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. NETTOYER LES SESSIONS EXPIRÉES
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. VÉRIFICATIONS FINALES
-- Vérifier que les tables existent
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('team_members', 'admin_sessions')
ORDER BY tablename;

-- Vérifier que la vue walks fonctionne
SELECT COUNT(*) as walks_count FROM walks;

-- Afficher les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('team_members', 'admin_sessions')
ORDER BY tablename, policyname;