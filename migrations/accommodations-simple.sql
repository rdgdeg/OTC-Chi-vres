-- ===================================
-- MIGRATION HÉBERGEMENTS - VERSION SIMPLIFIÉE
-- ===================================

-- 1. Créer la fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Créer la table accommodations
CREATE TABLE IF NOT EXISTS accommodations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT NOT NULL,
    excerpt TEXT,
    
    -- Type d'hébergement
    type TEXT NOT NULL CHECK (type IN ('bed_breakfast', 'gite', 'hotel', 'camping', 'unusual')),
    
    -- Capacité et chambres
    capacity INTEGER NOT NULL,
    bedrooms INTEGER,
    beds_description TEXT,
    
    -- Localisation
    address TEXT NOT NULL,
    village TEXT,
    lat NUMERIC,
    lng NUMERIC,
    
    -- Contact
    phone TEXT,
    email TEXT,
    website TEXT,
    facebook TEXT,
    
    -- Médias (URLs simples)
    featured_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    
    -- Caractéristiques
    features TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    
    -- Tarifs
    price_range TEXT,
    price_details TEXT,
    
    -- Informations pratiques
    check_in_time TEXT,
    check_out_time TEXT,
    house_rules TEXT[],
    cancellation_policy TEXT,
    
    -- Disponibilité
    available_from DATE,
    available_to DATE,
    min_stay INTEGER DEFAULT 1,
    
    -- Métadonnées
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    tag_ids TEXT[] DEFAULT '{}',
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    view_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Audit
    created_by TEXT,
    updated_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index
CREATE INDEX IF NOT EXISTS idx_accommodations_type ON accommodations(type);
CREATE INDEX IF NOT EXISTS idx_accommodations_status ON accommodations(status);
CREATE INDEX IF NOT EXISTS idx_accommodations_village ON accommodations(village);
CREATE INDEX IF NOT EXISTS idx_accommodations_capacity ON accommodations(capacity);
CREATE INDEX IF NOT EXISTS idx_accommodations_slug ON accommodations(slug);

-- 4. Activer RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS
CREATE POLICY "Public read published accommodations" ON accommodations FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can read all accommodations" ON accommodations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert accommodations" ON accommodations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update accommodations" ON accommodations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete accommodations" ON accommodations FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Créer le trigger pour updated_at
CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Créer la fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_accommodation_views(accommodation_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE accommodations 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = accommodation_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Insérer les données des hébergements
INSERT INTO accommodations (
    id, name, slug, description, excerpt, type, capacity, bedrooms, beds_description,
    address, village, phone, email, website, facebook, features, status
) VALUES 
(
    'la-loge-bed-breakfast',
    'La Loge Bed & Breakfast',
    'la-loge-bed-breakfast-vaudignies',
    'Séjournez dans un appartement chaleureux au cœur du hameau de Vaudignies. Profitez d''un cadre cosy et lumineux avec option petit-déjeuner, idéal pour découvrir Chièvres et ses villages environnants.',
    'Appartement chaleureux au cœur de Vaudignies avec option petit-déjeuner',
    'bed_breakfast',
    4,
    2,
    '2 à 4 personnes',
    'Rue de Ladeuze, 1 – Vaudignies',
    'Vaudignies',
    '0472 65 32 01',
    'laloge@outlook.be',
    NULL,
    'https://www.facebook.com/laloge',
    ARRAY['Accueil personnalisé et convivial', 'Appartement lumineux et confortable', 'Option petit-déjeuner inclus', 'Proximité des balades et circuits touristiques'],
    'published'
),
(
    'au-sentier-chauchaut',
    'Au sentier Chauchaut',
    'au-sentier-chauchaut-chievres',
    'Séjournez dans une ancienne ferme du XIXᵉ siècle rénovée avec soin pour allier confort moderne et charme authentique. Profitez d''un moment de calme et de l''accueil chaleureux de M. et Mme Ost‑Nasdrovisky.',
    'Ancienne ferme du XIXᵉ siècle rénovée avec charme authentique',
    'bed_breakfast',
    5,
    2,
    '3 à 5 personnes',
    'Sentier Chauchaut, 1',
    'Chièvres',
    '0473 96 11 94',
    'ostchr1968@gmail.com',
    'https://www.ausentierchauchaut.com',
    NULL,
    ARRAY['Maison chargée d''histoire, atmosphère authentique', 'Chambres confortables', 'Proximité des balades, du patrimoine et des circuits touristiques', 'À deux pas de Pairi Daiza et des villes d''art comme Mons et Tournai'],
    'published'
),
(
    'la-maison-dacote',
    'La Maison d''à côté',
    'la-maison-dacote-tongre-saint-martin',
    'Partie d''une ancienne ferme rénovée datant de 1872, ce gîte 3 épis allie calme et confort au cœur de la campagne chiévroise. Idéal pour les familles ou petits groupes, il offre des moments de repos et des découvertes naturelles à pied ou à vélo, sur le GR 121 ou le RAVeL à proximité.',
    'Gîte 3 épis dans une ancienne ferme de 1872, calme et confort',
    'gite',
    5,
    2,
    '5 personnes (2 chambres)',
    'Rue Emile Daubechies, 4',
    'Tongre-Saint-Martin',
    '0474 78 71 99',
    'winieckimic@gmail.com',
    'https://www.lamaisondacote.be',
    NULL,
    ARRAY['Gîte spacieux et confortable pour 5 personnes', 'Tranquillité et cadre champêtre', 'Balades à pied ou à vélo sur le GR 121 et le RAVeL', 'À quelques minutes en voiture du célèbre Parc Pairi Daiza'],
    'published'
),
(
    'au-champ-du-bouillon',
    'Au Champ du Bouillon',
    'au-champ-du-bouillon-tongre-notre-dame',
    'Séjournez dans ce gîte tout confort, parfait pour une escapade tranquille en couple ou en petit groupe. Profitez d''un cadre paisible et d''un espace bien-être privatif pour un séjour détente au cœur de la campagne chiévroise.',
    'Gîte tout confort avec espace bien-être privatif',
    'gite',
    4,
    2,
    '2 à 4 personnes',
    'Rue de la Ladrerie, 12',
    'Tongre-Notre-Dame',
    '0498 07 00 85',
    'rogejoh@hotmail.com',
    NULL,
    'https://www.facebook.com/profile.php?id=100064563347866',
    ARRAY['Confort moderne dans un cadre rural', 'Espace bien-être privatif pour se relaxer', 'Proximité des balades et circuits touristiques', 'Accueil chaleureux et personnalisé'],
    'published'
),
(
    'les-greniers-du-moulin',
    'Les Greniers du Moulin',
    'les-greniers-du-moulin-grosage',
    'Séjournez dans ce gîte à la ferme et découvrez l''authenticité de la campagne chiévroise. Avec un élevage de vaches Jersey sur place et un petit magasin fermier ouvert le samedi, vous pourrez profiter d''un cadre naturel et goûter aux produits locaux. Idéal pour les familles ou groupes d''amis, ce gîte spacieux est parfait pour se détendre et explorer les environs.',
    'Gîte à la ferme avec élevage de vaches Jersey et magasin fermier',
    'gite',
    8,
    3,
    '8 personnes (3 chambres, 7 lits)',
    'Rue des Héros de Roumont, 26',
    'Grosage',
    '0478 45 94 19',
    'lafermedumoulin@skynet.be',
    NULL,
    'https://www.facebook.com/profile.php?id=61552163278202',
    ARRAY['Gîte spacieux pour 8 personnes', 'Ambiance authentique dans une ferme bio', 'Proximité des sentiers de randonnée et balades à vélo', 'Magasin à la ferme avec produits locaux (uniquement le samedi)'],
    'published'
),
(
    'levasion-yacht',
    'L''Évasion',
    'levasion-yacht-ladeuze',
    'Vivez une expérience unique en séjournant sur un yacht amarré à Ladeuze. Ce gîte insolite combine confort et originalité pour un séjour inoubliable au fil de l''eau, idéal pour les familles ou petits groupes.',
    'Séjour insolite sur un yacht amarré à Ladeuze',
    'unusual',
    6,
    3,
    '6 personnes (3 chambres : 2 lits doubles, 1 lit superposé)',
    'Rue Grande Drève',
    'Ladeuze',
    '0491 86 58 09',
    'evasionyacht@hotmail.com',
    NULL,
    'https://www.facebook.com/evasionyacht',
    ARRAY['Séjour insolite sur un yacht au calme', '3 chambres confortables pour 6 personnes', 'Cadre charmant au bord de l''eau', 'Proximité des balades le long du RAVel'],
    'published'
),
(
    'moulin-du-domissart',
    'Moulin du Domissart',
    'moulin-du-domissart-grosage',
    'Bienvenue chez Aurore et Thomas, au Moulin du Domissart, un ancien moulin à eau du XVIᵉ siècle, restauré et transformé en 4 gîtes. Abritant d''anciennes machines du moulin, vous aurez la sensation de séjourner dans un musée vivant. Plus qu''un hébergement, c''est un lieu apaisant et convivial, idéal pour les familles, groupes d''amis ou team buildings professionnels. Bercé par le ruissellement de l''eau, le Moulin du Domissart offre un cadre parfait pour promenades, escapades nature et découvertes de la campagne chiévroise. Un espace bien-être et un barbecue à disposition sont également disponibles pour des moments de détente et de convivialité.',
    'Ancien moulin à eau du XVIᵉ siècle transformé en 4 gîtes avec espace bien-être',
    'gite',
    24,
    8,
    '4 gîtes, jusqu''à 24 personnes',
    'Rue Puits à Leval, 27',
    'Grosage',
    '0477 13 22 99',
    'info@moulin-a-eau.be',
    'https://www.moulin-a-eau.be/',
    NULL,
    ARRAY['Cadre unique dans un moulin à eau historique du XVIᵉ siècle', 'Capacité totale de 24 personnes répartie sur 4 gîtes', 'Atmosphère apaisante, parfaite pour se ressourcer', 'Proximité des balades, circuits touristiques et villages voisins', 'Espace Wellness', 'Ménage inclus'],
    'published'
),
(
    'chez-les-kikis',
    'Chez les Kikis',
    'chez-les-kikis-chievres',
    'Ce gîte rural tout confort, situé en contrebas de la Tour de Gavre et de l''église St Martin de Chièvres, vous offre une escapade reposante au cœur de la ville. Idéal pour un couple ou une petite famille, il est également à proximité de la Casa des Aviateurs, pour profiter de paddle, laser game et mini foot.',
    'Gîte rural au pied des monuments historiques de Chièvres',
    'gite',
    3,
    1,
    '2 adultes + 1 adulte dans canapé-lit ou 2 petits enfants',
    'Rue Royale, 28C',
    'Chièvres',
    '068 65 78 18',
    'chezleskiki@gmail.com',
    NULL,
    NULL,
    ARRAY['Gîte cosy et confortable pour 2 à 3 personnes', 'Cadre calme, au pied des monuments historiques de Chièvres', 'Proximité des activités sportives et ludiques de la Casa des Aviateurs', 'Idéal pour une escapade familiale ou reposante'],
    'published'
),
(
    'on-dirait-le-sud',
    'On dirait le sud…',
    'on-dirait-le-sud-ladeuze',
    'Profitez d''un séjour convivial et reposant dans cette chambre d''hôtes chaleureuse. Idéal pour familles ou petits groupes, ce lieu charmant vous permettra de découvrir Ladeuze et la campagne chiévroise en toute tranquillité.',
    'Chambre d''hôtes chaleureuse avec piscine extérieure',
    'bed_breakfast',
    4,
    2,
    '4 personnes (2 chambres : "Tintin" avec 2 lits simples, "Doux Repos" avec 1 lit double)',
    'Rue de la Gare, 11B',
    'Ladeuze',
    '0477 99 59 27',
    'duquesnereal@hotmail.be',
    NULL,
    NULL,
    ARRAY['2 chambres confortables pour 4 personnes', 'Piscine extérieure pour se rafraîchir', 'Petit déjeuner fabuleux préparé par le chef Réal', 'Ambiance chaleureuse et accueillante', 'Proximité des balades, circuits touristiques et villages voisins'],
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- 9. Vérification finale
SELECT 
    COUNT(*) as total_accommodations,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
    COUNT(CASE WHEN type = 'gite' THEN 1 END) as gites,
    COUNT(CASE WHEN type = 'bed_breakfast' THEN 1 END) as bed_breakfasts,
    COUNT(CASE WHEN type = 'unusual' THEN 1 END) as unusual
FROM accommodations;