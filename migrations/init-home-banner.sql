-- Migration : Initialisation de la bannière d'accueil
-- Date : 2026-01-15
-- Description : Crée ou met à jour l'enregistrement de la bannière d'accueil

-- Insérer ou mettre à jour la bannière d'accueil
INSERT INTO homepage_content (
  id,
  section,
  title,
  subtitle,
  content,
  image_url,
  is_active,
  sort_order,
  settings,
  created_at,
  updated_at
) VALUES (
  'hero-main',
  'hero',
  'Bienvenue à Chièvres',
  'La cité des aviateurs vous accueille',
  'Découvrez une commune riche en histoire, en traditions et en nature. Entre patrimoine exceptionnel et modernité, Chièvres vous invite à explorer ses trésors cachés.',
  'https://picsum.photos/id/1047/1920/1080',
  true,
  1,
  '{}',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET
  updated_at = NOW()
WHERE homepage_content.id = 'hero-main';

-- Vérifier que la table homepage_content existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
    RAISE EXCEPTION 'La table homepage_content n''existe pas. Veuillez exécuter d''abord le script de création des tables.';
  END IF;
END $$;

-- Afficher le résultat
SELECT 
  id,
  section,
  title,
  subtitle,
  is_active,
  created_at,
  updated_at
FROM homepage_content
WHERE section = 'hero';
