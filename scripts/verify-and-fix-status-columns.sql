-- Script SQL pour vérifier et corriger les colonnes status dans toutes les tables
-- À exécuter dans Supabase SQL Editor

-- ============================================
-- PARTIE 1 : VÉRIFICATION DE L'ÉTAT ACTUEL
-- ============================================

-- Vérifier quelles tables ont une colonne status
SELECT 
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'status'
AND table_schema = 'public'
AND table_name IN ('accommodations', 'events', 'places', 'articles', 'team_members', 'walks')
ORDER BY table_name;

-- Compter les fiches par statut dans chaque table (seulement si la colonne existe)
DO $$
BEGIN
  -- Cette section sera exécutée après l'ajout des colonnes
  RAISE NOTICE 'Vérification initiale des colonnes status...';
  RAISE NOTICE 'Les comptages seront affichés après l''ajout des colonnes.';
END $$;

-- ============================================
-- PARTIE 2 : AJOUT DES COLONNES STATUS
-- ============================================

-- Accommodations
ALTER TABLE accommodations 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

COMMENT ON COLUMN accommodations.status IS 'Statut de publication: draft, published, archived';

-- Events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

COMMENT ON COLUMN events.status IS 'Statut de publication: draft, published, archived';

-- Places
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

COMMENT ON COLUMN places.status IS 'Statut de publication: draft, published, archived';

-- Articles (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
    
    COMMENT ON COLUMN articles.status IS 'Statut de publication: draft, published, archived';
  END IF;
END $$;

-- Team Members (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    ALTER TABLE team_members 
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
    
    COMMENT ON COLUMN team_members.status IS 'Statut de publication: draft, published, archived';
  END IF;
END $$;

-- ============================================
-- PARTIE 3 : MISE À JOUR DES DONNÉES EXISTANTES
-- ============================================

-- Mettre toutes les fiches existantes sans statut en 'published'
UPDATE accommodations 
SET status = 'published' 
WHERE status IS NULL OR status = '';

UPDATE events 
SET status = 'published' 
WHERE status IS NULL OR status = '';

UPDATE places 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- Articles (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    UPDATE articles 
    SET status = 'published' 
    WHERE status IS NULL OR status = '';
  END IF;
END $$;

-- Team Members (si la table existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    UPDATE team_members 
    SET status = 'published' 
    WHERE status IS NULL OR status = '';
  END IF;
END $$;

-- ============================================
-- PARTIE 4 : AJOUT DES CONTRAINTES
-- ============================================

-- Accommodations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_status_accommodations'
  ) THEN
    ALTER TABLE accommodations 
    ADD CONSTRAINT check_status_accommodations 
    CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_status_events'
  ) THEN
    ALTER TABLE events 
    ADD CONSTRAINT check_status_events 
    CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Places
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_status_places'
  ) THEN
    ALTER TABLE places 
    ADD CONSTRAINT check_status_places 
    CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Articles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'check_status_articles'
    ) THEN
      ALTER TABLE articles 
      ADD CONSTRAINT check_status_articles 
      CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
  END IF;
END $$;

-- Team Members
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'check_status_team_members'
    ) THEN
      ALTER TABLE team_members 
      ADD CONSTRAINT check_status_team_members 
      CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
  END IF;
END $$;

-- ============================================
-- PARTIE 5 : MISE À JOUR DES RLS POLICIES
-- ============================================

-- Accommodations - Lecture publique (seulement published)
DROP POLICY IF EXISTS "Public can view published accommodations" ON accommodations;
CREATE POLICY "Public can view published accommodations"
ON accommodations FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Accommodations - Admin peut tout voir
DROP POLICY IF EXISTS "Admins can manage all accommodations" ON accommodations;
CREATE POLICY "Admins can manage all accommodations"
ON accommodations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Events - Lecture publique (seulement published)
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events"
ON events FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Events - Admin peut tout voir
DROP POLICY IF EXISTS "Admins can manage all events" ON events;
CREATE POLICY "Admins can manage all events"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Places - Lecture publique (seulement published)
DROP POLICY IF EXISTS "Public can view published places" ON places;
CREATE POLICY "Public can view published places"
ON places FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Places - Admin peut tout voir
DROP POLICY IF EXISTS "Admins can manage all places" ON places;
CREATE POLICY "Admins can manage all places"
ON places FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Articles - Lecture publique (seulement published)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Public can view published articles" ON articles';
    EXECUTE 'CREATE POLICY "Public can view published articles"
    ON articles FOR SELECT
    TO anon, authenticated
    USING (status = ''published'')';
    
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all articles" ON articles';
    EXECUTE 'CREATE POLICY "Admins can manage all articles"
    ON articles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)';
  END IF;
END $$;

-- Team Members - Lecture publique (seulement published ET visible)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Public can view published team members" ON team_members';
    EXECUTE 'CREATE POLICY "Public can view published team members"
    ON team_members FOR SELECT
    TO anon, authenticated
    USING (status = ''published'' AND (is_visible IS NULL OR is_visible = true))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all team members" ON team_members';
    EXECUTE 'CREATE POLICY "Admins can manage all team members"
    ON team_members FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true)';
  END IF;
END $$;

-- ============================================
-- PARTIE 6 : CRÉATION D'INDEX POUR PERFORMANCE
-- ============================================

-- Index sur status pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_accommodations_status ON accommodations(status);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_places_status ON places(status);

-- Index composites pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_accommodations_status_village ON accommodations(status, village);
CREATE INDEX IF NOT EXISTS idx_events_status_start_date ON events(status, start_date);
CREATE INDEX IF NOT EXISTS idx_places_status_type ON places(status, type);

-- Articles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON articles(status, published_at);
  END IF;
END $$;

-- Team Members
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
    CREATE INDEX IF NOT EXISTS idx_team_members_status_sort_order ON team_members(status, sort_order);
  END IF;
END $$;

-- ============================================
-- PARTIE 7 : VÉRIFICATION FINALE
-- ============================================

-- Vérifier que toutes les tables ont maintenant une colonne status
SELECT 
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'status'
AND table_schema = 'public'
AND table_name IN ('accommodations', 'events', 'places', 'articles', 'team_members')
ORDER BY table_name;

-- Vérifier les contraintes
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name IN ('accommodations', 'events', 'places', 'articles', 'team_members')
AND tc.constraint_name LIKE '%status%'
ORDER BY tc.table_name;

-- Vérifier les index
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('accommodations', 'events', 'places', 'articles', 'team_members')
AND indexname LIKE '%status%'
ORDER BY tablename, indexname;

-- Compter les fiches par statut après mise à jour
DO $$
DECLARE
  acc_count INT;
  evt_count INT;
  plc_count INT;
BEGIN
  -- Compter seulement si les colonnes existent
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accommodations' AND column_name = 'status') THEN
    EXECUTE 'SELECT COUNT(*) FROM accommodations WHERE status = ''published''' INTO acc_count;
    RAISE NOTICE 'Accommodations publiés: %', acc_count;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
    EXECUTE 'SELECT COUNT(*) FROM events WHERE status = ''published''' INTO evt_count;
    RAISE NOTICE 'Events publiés: %', evt_count;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'places' AND column_name = 'status') THEN
    EXECUTE 'SELECT COUNT(*) FROM places WHERE status = ''published''' INTO plc_count;
    RAISE NOTICE 'Places publiés: %', plc_count;
  END IF;
END $$;

-- Vérifier qu'il n'y a plus de NULL
SELECT 
  'accommodations' as table_name,
  COUNT(*) as null_count
FROM accommodations
WHERE status IS NULL
UNION ALL
SELECT 'events', COUNT(*)
FROM events
WHERE status IS NULL
UNION ALL
SELECT 'places', COUNT(*)
FROM places
WHERE status IS NULL;

-- ============================================
-- RÉSUMÉ
-- ============================================

-- Afficher un résumé des modifications
DO $$
DECLARE
  acc_count INT;
  evt_count INT;
  plc_count INT;
BEGIN
  SELECT COUNT(*) INTO acc_count FROM accommodations WHERE status = 'published';
  SELECT COUNT(*) INTO evt_count FROM events WHERE status = 'published';
  SELECT COUNT(*) INTO plc_count FROM places WHERE status = 'published';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RÉSUMÉ DES MODIFICATIONS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Accommodations publiés: %', acc_count;
  RAISE NOTICE 'Events publiés: %', evt_count;
  RAISE NOTICE 'Places publiés: %', plc_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Colonnes status ajoutées: ✅';
  RAISE NOTICE 'Contraintes CHECK ajoutées: ✅';
  RAISE NOTICE 'RLS Policies mises à jour: ✅';
  RAISE NOTICE 'Index créés: ✅';
  RAISE NOTICE '========================================';
END $$;
