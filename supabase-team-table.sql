-- ===================================
-- TABLE TEAM MEMBERS
-- ===================================

CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    description TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");

-- RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on team_members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on team_members" ON team_members FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on team_members" ON team_members FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO team_members (id, name, role, email, phone, description, "imageUrl", "order") VALUES
('team-1', 'Marie Dubois', 'Directrice', 'marie.dubois@otchievres.be', '068/ 64 59 61', 'Passionnée par le patrimoine local, Marie coordonne l''ensemble des activités de l''Office du Tourisme.', 'https://picsum.photos/id/1005/400/400', 1),
('team-2', 'Sophie Martin', 'Responsable Communication', 'sophie.martin@otchievres.be', '068/ 64 59 62', 'Sophie gère la communication et les réseaux sociaux pour promouvoir notre belle région.', 'https://picsum.photos/id/1005/400/400', 2),
('team-3', 'Pierre Leroy', 'Guide Touristique', 'pierre.leroy@otchievres.be', '068/ 64 59 63', 'Guide expérimenté, Pierre vous fera découvrir les secrets et l''histoire de Chièvres.', 'https://picsum.photos/id/1005/400/400', 3),
('team-4', 'Julie Renard', 'Accueil et Information', 'julie.renard@otchievres.be', '068/ 64 59 64', 'Julie vous accueille et vous conseille pour organiser votre séjour dans la région.', 'https://picsum.photos/id/1005/400/400', 4),
('team-5', 'Thomas Bernard', 'Coordinateur Événements', 'thomas.bernard@otchievres.be', '068/ 64 59 65', 'Thomas organise les événements culturels et festifs tout au long de l''année.', 'https://picsum.photos/id/1005/400/400', 5),
('team-6', 'Isabelle Petit', 'Chargée de Projets', 'isabelle.petit@otchievres.be', '068/ 64 59 66', 'Isabelle développe de nouveaux projets touristiques pour valoriser notre territoire.', 'https://picsum.photos/id/1005/400/400', 6);
