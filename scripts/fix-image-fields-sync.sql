-- ============================================================================
-- FIX: Synchronisation des champs d'images entre admin et frontend
-- ============================================================================
-- Problème: Le modal admin utilise 'featured_image' mais la table places utilise 'imageUrl'
-- Solution: Standardiser sur 'imageUrl' pour toutes les tables
-- ============================================================================

BEGIN;

-- 1. Vérifier l'état actuel
DO $$
BEGIN
  RAISE NOTICE '🔍 Vérification des colonnes d''images...';
END $$;

-- 2. Pour la table places: S'assurer que imageUrl existe (déjà le cas)
-- Pas besoin de modification, la colonne existe déjà

-- 3. Pour la table accommodations: Vérifier si featured_image existe
DO $$
BEGIN
  -- Si featured_image existe dans accommodations, copier vers imageUrl
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accommodations' 
    AND column_name = 'featured_image'
  ) THEN
    RAISE NOTICE '✅ Colonne featured_image trouvée dans accommodations';
    
    -- Ajouter imageUrl si elle n'existe pas
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'accommodations' 
      AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE accommodations ADD COLUMN "imageUrl" TEXT;
      RAISE NOTICE '✅ Colonne imageUrl ajoutée à accommodations';
    END IF;
    
    -- Copier les données de featured_image vers imageUrl
    UPDATE accommodations 
    SET "imageUrl" = featured_image 
    WHERE featured_image IS NOT NULL AND ("imageUrl" IS NULL OR "imageUrl" = '');
    
    RAISE NOTICE '✅ Données copiées de featured_image vers imageUrl';
  ELSE
    RAISE NOTICE 'ℹ️  Colonne featured_image n''existe pas dans accommodations';
  END IF;
END $$;

-- 4. Pour la table events: Même traitement
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'featured_image'
  ) THEN
    RAISE NOTICE '✅ Colonne featured_image trouvée dans events';
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'events' 
      AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE events ADD COLUMN "imageUrl" TEXT;
      RAISE NOTICE '✅ Colonne imageUrl ajoutée à events';
    END IF;
    
    UPDATE events 
    SET "imageUrl" = featured_image 
    WHERE featured_image IS NOT NULL AND ("imageUrl" IS NULL OR "imageUrl" = '');
    
    RAISE NOTICE '✅ Données copiées de featured_image vers imageUrl dans events';
  END IF;
END $$;

-- 5. Pour la table articles: Même traitement
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' 
    AND column_name = 'featured_image'
  ) THEN
    RAISE NOTICE '✅ Colonne featured_image trouvée dans articles';
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'articles' 
      AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE articles ADD COLUMN "imageUrl" TEXT;
      RAISE NOTICE '✅ Colonne imageUrl ajoutée à articles';
    END IF;
    
    UPDATE articles 
    SET "imageUrl" = featured_image 
    WHERE featured_image IS NOT NULL AND ("imageUrl" IS NULL OR "imageUrl" = '');
    
    RAISE NOTICE '✅ Données copiées de featured_image vers imageUrl dans articles';
  END IF;
END $$;

-- 6. Pour la table team_members: Même traitement
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'team_members' 
    AND column_name = 'featured_image'
  ) THEN
    RAISE NOTICE '✅ Colonne featured_image trouvée dans team_members';
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'team_members' 
      AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE team_members ADD COLUMN "imageUrl" TEXT;
      RAISE NOTICE '✅ Colonne imageUrl ajoutée à team_members';
    END IF;
    
    UPDATE team_members 
    SET "imageUrl" = featured_image 
    WHERE featured_image IS NOT NULL AND ("imageUrl" IS NULL OR "imageUrl" = '');
    
    RAISE NOTICE '✅ Données copiées de featured_image vers imageUrl dans team_members';
  END IF;
END $$;

-- 7. Vérification finale
DO $$
DECLARE
  places_count INTEGER;
  accommodations_count INTEGER;
  events_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO places_count FROM places WHERE "imageUrl" IS NOT NULL;
  SELECT COUNT(*) INTO accommodations_count FROM accommodations WHERE "imageUrl" IS NOT NULL;
  SELECT COUNT(*) INTO events_count FROM events WHERE "imageUrl" IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE '📊 Résumé:';
  RAISE NOTICE '  - Places avec imageUrl: %', places_count;
  RAISE NOTICE '  - Accommodations avec imageUrl: %', accommodations_count;
  RAISE NOTICE '  - Events avec imageUrl: %', events_count;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Synchronisation terminée!';
END $$;

COMMIT;
