-- ===================================
-- Migration universelle pour le tri par glisser-déposer
-- Ajoute la colonne sort_order à toutes les tables nécessaires
-- ===================================

-- 1. Ajouter sort_order aux hébergements
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Vérifier si la table walks existe, sinon ignorer (les balades sont dans places)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') THEN
        ALTER TABLE walks ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'Table walks non trouvée - les balades sont probablement dans la table places';
    END IF;
END $$;

-- 3. Ajouter sort_order aux événements
ALTER TABLE events ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 4. Ajouter sort_order aux membres de l'équipe
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 5. Ajouter sort_order aux blocs de page d'accueil (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_blocks') THEN
        ALTER TABLE homepage_blocks ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 6. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_accommodations_sort_order ON accommodations(sort_order);
CREATE INDEX IF NOT EXISTS idx_events_sort_order ON events(sort_order);
CREATE INDEX IF NOT EXISTS idx_team_members_sort_order ON team_members(sort_order);

-- Index conditionnel pour walks (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') THEN
        CREATE INDEX IF NOT EXISTS idx_walks_sort_order ON walks(sort_order);
    END IF;
END $$;

-- Index conditionnel pour homepage_blocks
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_blocks') THEN
        CREATE INDEX IF NOT EXISTS idx_homepage_blocks_sort_order ON homepage_blocks(sort_order);
    END IF;
END $$;

-- 7. Initialiser les valeurs de sort_order pour les éléments existants

-- Hébergements
WITH numbered_accommodations AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM accommodations 
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE accommodations 
SET sort_order = numbered_accommodations.rn
FROM numbered_accommodations
WHERE accommodations.id = numbered_accommodations.id;

-- Balades (si table walks existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') THEN
        WITH numbered_walks AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
            FROM walks 
            WHERE sort_order IS NULL OR sort_order = 0
        )
        UPDATE walks 
        SET sort_order = numbered_walks.rn
        FROM numbered_walks
        WHERE walks.id = numbered_walks.id;
    END IF;
END $$;

-- Événements
WITH numbered_events AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, title) as rn
    FROM events 
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE events 
SET sort_order = numbered_events.rn
FROM numbered_events
WHERE events.id = numbered_events.id;

-- Membres de l'équipe
WITH numbered_team AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM team_members 
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE team_members 
SET sort_order = numbered_team.rn
FROM numbered_team
WHERE team_members.id = numbered_team.id;

-- Blocs de page d'accueil (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_blocks') THEN
        WITH numbered_blocks AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, title) as rn
            FROM homepage_blocks 
            WHERE sort_order IS NULL OR sort_order = 0
        )
        UPDATE homepage_blocks 
        SET sort_order = numbered_blocks.rn
        FROM numbered_blocks
        WHERE homepage_blocks.id = numbered_blocks.id;
    END IF;
END $$;

-- 8. Créer des triggers pour assigner automatiquement un sort_order aux nouveaux éléments

-- Trigger pour accommodations
CREATE OR REPLACE FUNCTION assign_sort_order_accommodations()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM accommodations;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_accommodations
    BEFORE INSERT ON accommodations
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_accommodations();

-- Trigger pour walks (si la table existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') THEN
        EXECUTE '
        CREATE OR REPLACE FUNCTION assign_sort_order_walks()
        RETURNS TRIGGER AS $func$
        BEGIN
            IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
                SELECT COALESCE(MAX(sort_order), 0) + 1 
                INTO NEW.sort_order 
                FROM walks;
            END IF;
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;

        CREATE TRIGGER trigger_assign_sort_order_walks
            BEFORE INSERT ON walks
            FOR EACH ROW
            EXECUTE FUNCTION assign_sort_order_walks();
        ';
    END IF;
END $$;

-- Trigger pour events
CREATE OR REPLACE FUNCTION assign_sort_order_events()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM events;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_events
    BEFORE INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_events();

-- Trigger pour team_members
CREATE OR REPLACE FUNCTION assign_sort_order_team_members()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1 
        INTO NEW.sort_order 
        FROM team_members;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_team_members
    BEFORE INSERT ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_team_members();

-- Trigger conditionnel pour homepage_blocks
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_blocks') THEN
        EXECUTE '
        CREATE OR REPLACE FUNCTION assign_sort_order_homepage_blocks()
        RETURNS TRIGGER AS $func$
        BEGIN
            IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
                SELECT COALESCE(MAX(sort_order), 0) + 1 
                INTO NEW.sort_order 
                FROM homepage_blocks;
            END IF;
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;

        CREATE TRIGGER trigger_assign_sort_order_homepage_blocks
            BEFORE INSERT ON homepage_blocks
            FOR EACH ROW
            EXECUTE FUNCTION assign_sort_order_homepage_blocks();
        ';
    END IF;
END $$;

-- 9. Commentaires pour documentation
COMMENT ON COLUMN accommodations.sort_order IS 'Ordre d''affichage des hébergements (plus petit = affiché en premier)';
COMMENT ON COLUMN events.sort_order IS 'Ordre d''affichage des événements (plus petit = affiché en premier)';
COMMENT ON COLUMN team_members.sort_order IS 'Ordre d''affichage des membres de l''équipe (plus petit = affiché en premier)';

-- Commentaires conditionnels
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') THEN
        EXECUTE 'COMMENT ON COLUMN walks.sort_order IS ''Ordre d''''affichage des balades (plus petit = affiché en premier)''';
    END IF;
END $$;

-- 10. Vérification finale
SELECT 
    'VERIFICATION MIGRATION UNIVERSELLE' as section,
    (SELECT COUNT(*) FROM accommodations WHERE sort_order > 0) as accommodations_with_sort,
    (SELECT COUNT(*) FROM events WHERE sort_order > 0) as events_with_sort,
    (SELECT COUNT(*) FROM team_members WHERE sort_order > 0) as team_with_sort,
    (SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walks') 
                 THEN (SELECT COUNT(*) FROM walks WHERE sort_order > 0)::text 
                 ELSE 'Table walks non trouvée' END) as walks_status;