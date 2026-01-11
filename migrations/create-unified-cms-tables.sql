-- Migration pour créer les tables du CMS unifié
-- À exécuter dans Supabase SQL Editor

-- Créer d'abord la table media si elle n'existe pas
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

-- Table principale pour tous les types de contenu
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

-- Table pour l'historique des versions
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content JSONB NOT NULL,
  change_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les relations contenu-média
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

-- Améliorer la table media existante si nécessaire (ces colonnes peuvent déjà exister)
DO $$ 
BEGIN
  -- Ajouter les colonnes seulement si elles n'existent pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'folder') THEN
    ALTER TABLE media ADD COLUMN folder TEXT DEFAULT 'general';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'tags') THEN
    ALTER TABLE media ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'metadata') THEN
    ALTER TABLE media ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- Améliorer la table audit_logs existante si nécessaire
DO $$ 
BEGIN
  -- Créer la table audit_logs si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    CREATE TABLE audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      changes JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
  
  -- Ajouter les colonnes seulement si elles n'existent pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'ip_address') THEN
    ALTER TABLE audit_logs ADD COLUMN ip_address INET;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'user_agent') THEN
    ALTER TABLE audit_logs ADD COLUMN user_agent TEXT;
  END IF;
END $$;

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_created_by ON content_items(created_by);
CREATE INDEX IF NOT EXISTS idx_content_items_updated_at ON content_items(updated_at);
CREATE INDEX IF NOT EXISTS idx_content_items_title_search ON content_items USING gin(to_tsvector('french', title));

CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_version ON content_versions(content_id, version);

CREATE INDEX IF NOT EXISTS idx_content_media_content_id ON content_media(content_id);
CREATE INDEX IF NOT EXISTS idx_content_media_media_id ON content_media(media_id);
CREATE INDEX IF NOT EXISTS idx_content_media_position ON content_media(content_id, position);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
CREATE INDEX IF NOT EXISTS idx_media_filename_search ON media USING gin(to_tsvector('french', original_name));

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à content_items
DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour l'audit automatique
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource,
            resource_id,
            changes,
            created_at
        ) VALUES (
            NEW.created_by,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id::TEXT,
            row_to_json(NEW),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource,
            resource_id,
            changes,
            created_at
        ) VALUES (
            NEW.updated_by,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id::TEXT,
            jsonb_build_object(
                'old', row_to_json(OLD),
                'new', row_to_json(NEW)
            ),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource,
            resource_id,
            changes,
            created_at
        ) VALUES (
            OLD.updated_by,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id::TEXT,
            row_to_json(OLD),
            NOW()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers d'audit
DROP TRIGGER IF EXISTS audit_content_items ON content_items;
CREATE TRIGGER audit_content_items
    AFTER INSERT OR UPDATE OR DELETE ON content_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_media ON media;
CREATE TRIGGER audit_media
    AFTER INSERT OR UPDATE OR DELETE ON media
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- RLS (Row Level Security) Policies
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;

-- Politiques pour la lecture publique du contenu publié
DROP POLICY IF EXISTS "Public content is viewable by everyone" ON content_items;
CREATE POLICY "Public content is viewable by everyone" ON content_items
    FOR SELECT USING (
        status = 'published' AND 
        (permissions->>'public')::boolean = true
    );

-- Politique pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated users can view all content" ON content_items;
CREATE POLICY "Authenticated users can view all content" ON content_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour les créateurs/éditeurs
DROP POLICY IF EXISTS "Users can insert their own content" ON content_items;
CREATE POLICY "Users can insert their own content" ON content_items
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own content" ON content_items;
CREATE POLICY "Users can update their own content" ON content_items
    FOR UPDATE USING (
        auth.uid() = created_by OR 
        auth.uid() = updated_by OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Admins can delete content" ON content_items;
CREATE POLICY "Admins can delete content" ON content_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Politiques pour content_versions
DROP POLICY IF EXISTS "Users can view content versions" ON content_versions;
CREATE POLICY "Users can view content versions" ON content_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content_items 
            WHERE id = content_versions.content_id 
            AND (
                created_by = auth.uid() OR 
                updated_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_id = auth.uid() 
                    AND role IN ('admin', 'super_admin')
                )
            )
        )
    );

DROP POLICY IF EXISTS "System can insert content versions" ON content_versions;
CREATE POLICY "System can insert content versions" ON content_versions
    FOR INSERT WITH CHECK (true);

-- Politiques pour content_media
DROP POLICY IF EXISTS "Users can view content media" ON content_media;
CREATE POLICY "Users can view content media" ON content_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content_items 
            WHERE id = content_media.content_id 
            AND (
                status = 'published' OR
                created_by = auth.uid() OR 
                updated_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_id = auth.uid() 
                    AND role IN ('admin', 'super_admin')
                )
            )
        )
    );

DROP POLICY IF EXISTS "Authenticated users can manage content media" ON content_media;
CREATE POLICY "Authenticated users can manage content media" ON content_media
    FOR ALL USING (auth.role() = 'authenticated');

-- Fonction pour migrer les données existantes
CREATE OR REPLACE FUNCTION migrate_existing_data()
RETURNS void AS $$
BEGIN
    -- Migrer les hébergements
    INSERT INTO content_items (
        type, title, slug, status, content, metadata, seo, 
        created_by, updated_by, created_at, updated_at
    )
    SELECT 
        'accommodation'::text,
        name,
        slug,
        CASE 
            WHEN status = 'published' THEN 'published'::text
            WHEN status = 'archived' THEN 'archived'::text
            ELSE 'draft'::text
        END,
        jsonb_build_object(
            'description', description,
            'excerpt', excerpt,
            'type', type,
            'capacity', capacity,
            'bedrooms', bedrooms,
            'beds_description', beds_description,
            'address', address,
            'village', village,
            'lat', lat,
            'lng', lng,
            'phone', phone,
            'email', email,
            'website', website,
            'facebook', facebook,
            'featured_image', featured_image,
            'gallery_images', gallery_images,
            'features', features,
            'amenities', amenities,
            'price_range', price_range,
            'price_details', price_details,
            'check_in_time', check_in_time,
            'check_out_time', check_out_time,
            'house_rules', house_rules,
            'cancellation_policy', cancellation_policy,
            'available_from', available_from,
            'available_to', available_to,
            'min_stay', min_stay
        ),
        jsonb_build_object(
            'category', type,
            'tags', COALESCE(tag_ids, '{}'),
            'featured', COALESCE(rating > 4, false)
        ),
        jsonb_build_object(
            'title', meta_title,
            'description', meta_description
        ),
        (SELECT id FROM auth.users LIMIT 1), -- Premier utilisateur comme créateur par défaut
        (SELECT id FROM auth.users LIMIT 1),
        created_at,
        updated_at
    FROM accommodations
    WHERE NOT EXISTS (
        SELECT 1 FROM content_items 
        WHERE type = 'accommodation' AND title = accommodations.name
    );

    -- Migrer les lieux
    INSERT INTO content_items (
        type, title, slug, status, content, metadata, seo,
        created_by, updated_by, created_at, updated_at
    )
    SELECT 
        'place'::text,
        name,
        LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')),
        'published'::text,
        jsonb_build_object(
            'description', description,
            'address', address,
            'imageUrl', "imageUrl",
            'type', type,
            'rating', rating,
            'phone', phone,
            'email', email,
            'website', website,
            'facebook', facebook,
            'instagram', instagram,
            'twitter', twitter,
            'lat', lat,
            'lng', lng,
            'distance', distance,
            'duration', duration,
            'difficulty', difficulty,
            'downloadUrl', "downloadUrl",
            'documentUrl', "documentUrl",
            'openingHours', "openingHours",
            'price', price,
            'practicalInfo', "practicalInfo",
            'galleryImages', "galleryImages"
        ),
        jsonb_build_object(
            'category', type,
            'tags', COALESCE(tags, '{}')
        ),
        jsonb_build_object(),
        (SELECT id FROM auth.users LIMIT 1),
        (SELECT id FROM auth.users LIMIT 1),
        NOW(),
        NOW()
    FROM places
    WHERE NOT EXISTS (
        SELECT 1 FROM content_items 
        WHERE type = 'place' AND title = places.name
    );

    RAISE NOTICE 'Migration des données existantes terminée';
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration (décommentez si vous voulez migrer les données existantes)
-- SELECT migrate_existing_data();

-- Créer des vues pour faciliter les requêtes
CREATE OR REPLACE VIEW content_with_media AS
SELECT 
    ci.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', cm.id,
                'media_id', cm.media_id,
                'position', cm.position,
                'caption', cm.caption,
                'alt_text', cm.alt_text,
                'width', cm.width,
                'height', cm.height,
                'media', json_build_object(
                    'id', m.id,
                    'filename', m.filename,
                    'original_name', m.original_name,
                    'url', m.url,
                    'thumbnail_url', m.thumbnail_url,
                    'mime_type', m.mime_type,
                    'size', m.size,
                    'width', m.width,
                    'height', m.height
                )
            ) ORDER BY cm.position
        ) FILTER (WHERE cm.id IS NOT NULL),
        '[]'::json
    ) AS media_relations
FROM content_items ci
LEFT JOIN content_media cm ON ci.id = cm.content_id
LEFT JOIN media m ON cm.media_id = m.id
GROUP BY ci.id;

-- Fonction utilitaire pour recherche full-text
CREATE OR REPLACE FUNCTION search_content(
    search_query TEXT,
    content_type TEXT DEFAULT NULL,
    content_status TEXT DEFAULT 'published'
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    title TEXT,
    slug TEXT,
    status TEXT,
    content JSONB,
    metadata JSONB,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.id,
        ci.type,
        ci.title,
        ci.slug,
        ci.status,
        ci.content,
        ci.metadata,
        ts_rank(
            to_tsvector('french', ci.title || ' ' || COALESCE(ci.content->>'description', '')),
            plainto_tsquery('french', search_query)
        ) AS rank
    FROM content_items ci
    WHERE 
        (content_type IS NULL OR ci.type = content_type) AND
        (content_status IS NULL OR ci.status = content_status) AND
        (
            to_tsvector('french', ci.title || ' ' || COALESCE(ci.content->>'description', '')) 
            @@ plainto_tsquery('french', search_query)
        )
    ORDER BY rank DESC, ci.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMIT;