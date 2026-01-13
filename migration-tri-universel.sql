-- ===================================
-- Migration pour le tri par glisser-déposer
-- Copiez et collez ces commandes dans l'éditeur SQL de Supabase
-- ===================================

-- Table: accommodations
ALTER TABLE accommodations ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_accommodations_sort_order ON accommodations(sort_order);

-- Initialiser les ordres pour accommodations
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM accommodations
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE accommodations
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE accommodations.id = numbered_items.id;

-- Table: events
ALTER TABLE events ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_events_sort_order ON events(sort_order);

-- Initialiser les ordres pour events
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, title) as rn
    FROM events
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE events
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE events.id = numbered_items.id;

-- Table: articles
ALTER TABLE articles ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_articles_sort_order ON articles(sort_order);

-- Initialiser les ordres pour articles
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, title) as rn
    FROM articles
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE articles
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE articles.id = numbered_items.id;

-- Table: products
ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- Initialiser les ordres pour products
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM products
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE products
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE products.id = numbered_items.id;

-- Table: page_content
ALTER TABLE page_content ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_page_content_sort_order ON page_content(sort_order);

-- Initialiser les ordres pour page_content
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, "heroTitle") as rn
    FROM page_content
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE page_content
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE page_content.id = numbered_items.id;

-- Table: experiences
ALTER TABLE experiences ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_experiences_sort_order ON experiences(sort_order);

-- Initialiser les ordres pour experiences
WITH numbered_items AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, title) as rn
    FROM experiences
    WHERE sort_order IS NULL OR sort_order = 0
)
UPDATE experiences
SET sort_order = numbered_items.rn
FROM numbered_items
WHERE experiences.id = numbered_items.id;

-- ===================================
-- Triggers pour assigner automatiquement sort_order
-- ===================================

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

-- Trigger pour articles
CREATE OR REPLACE FUNCTION assign_sort_order_articles()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM articles;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_articles
    BEFORE INSERT ON articles
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_articles();

-- Trigger pour products
CREATE OR REPLACE FUNCTION assign_sort_order_products()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM products;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_products
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_products();

-- Trigger pour page_content
CREATE OR REPLACE FUNCTION assign_sort_order_page_content()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM page_content;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_page_content
    BEFORE INSERT ON page_content
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_page_content();

-- Trigger pour experiences
CREATE OR REPLACE FUNCTION assign_sort_order_experiences()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order = 0 THEN
        SELECT COALESCE(MAX(sort_order), 0) + 1
        INTO NEW.sort_order
        FROM experiences;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sort_order_experiences
    BEFORE INSERT ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION assign_sort_order_experiences();
