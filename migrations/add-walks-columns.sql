-- Migration pour ajouter les colonnes nécessaires aux balades
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour les liens de téléchargement des balades
-- Utilisation de camelCase pour correspondre à la structure existante
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS "downloadUrl" TEXT,
ADD COLUMN IF NOT EXISTS "documentUrl" TEXT;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN places."downloadUrl" IS 'URL de téléchargement du tracé de la balade (ex: lien OpenRunner)';
COMMENT ON COLUMN places."documentUrl" IS 'URL du document explicatif de la balade (ex: PDF avec informations détaillées)';

-- Créer un index pour optimiser les requêtes sur les balades avec liens
CREATE INDEX IF NOT EXISTS idx_places_download_url ON places("downloadUrl") WHERE "downloadUrl" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_places_document_url ON places("documentUrl") WHERE "documentUrl" IS NOT NULL;

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name IN ('downloadUrl', 'documentUrl');