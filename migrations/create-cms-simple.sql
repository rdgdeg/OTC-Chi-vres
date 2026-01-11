-- Migration simplifiée pour le CMS unifié
-- Version compatible avec toutes les versions de PostgreSQL/Supabase

-- 1. Créer la table media
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration REAL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  folder TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table content_items
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('place', 'accommodation', 'experience', 'event', 'article', 'product', 'page', 'block')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{"public": true, "roles": {}, "users": {}}',
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table content_versions
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content JSONB NOT NULL,
  change_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer la table content_media
CREATE TABLE IF NOT EXISTS content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  caption TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, media_id)
);

-- 6. Créer les indexes
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_created_by ON content_items(created_by);
CREATE INDEX IF NOT EXISTS idx_content_items_updated_at ON content_items(updated_at);

CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_version ON content_versions(content_id, version);

CREATE INDEX IF NOT EXISTS idx_content_media_content_id ON content_media(content_id);
CREATE INDEX IF NOT EXISTS idx_content_media_media_id ON content_media(media_id);
CREATE INDEX IF NOT EXISTS idx_content_media_position ON content_media(content_id, position);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 7. Créer la fonction pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Créer les triggers
DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Activer RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. Créer les politiques RLS (version simple)
-- Politique pour content_items - lecture publique
DROP POLICY IF EXISTS "content_public_read" ON content_items;
CREATE POLICY "content_public_read" ON content_items
    FOR SELECT USING (status = 'published');

-- Politique pour content_items - gestion par utilisateurs authentifiés
DROP POLICY IF EXISTS "content_auth_all" ON content_items;
CREATE POLICY "content_auth_all" ON content_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Politique pour media - lecture publique
DROP POLICY IF EXISTS "media_public_read" ON media;
CREATE POLICY "media_public_read" ON media
    FOR SELECT USING (true);

-- Politique pour media - gestion par utilisateurs authentifiés
DROP POLICY IF EXISTS "media_auth_all" ON media;
CREATE POLICY "media_auth_all" ON media
    FOR ALL USING (auth.role() = 'authenticated');

-- Politique pour content_versions - utilisateurs authentifiés
DROP POLICY IF EXISTS "versions_auth_all" ON content_versions;
CREATE POLICY "versions_auth_all" ON content_versions
    FOR ALL USING (auth.role() = 'authenticated');

-- Politique pour content_media - utilisateurs authentifiés
DROP POLICY IF EXISTS "content_media_auth_all" ON content_media;
CREATE POLICY "content_media_auth_all" ON content_media
    FOR ALL USING (auth.role() = 'authenticated');

-- Politique pour audit_logs - lecture seule pour authentifiés
DROP POLICY IF EXISTS "audit_auth_read" ON audit_logs;
CREATE POLICY "audit_auth_read" ON audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');