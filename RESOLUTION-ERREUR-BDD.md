# Résolution de l'erreur de base de données

## Problème rencontré

```
Could not find the 'status' column of 'places' in the schema cache
```

## Cause

La table `places` dans Supabase utilise une structure différente de celle attendue :
- Structure existante : camelCase (ex: `imageUrl`, `downloadUrl`)
- Structure attendue initialement : snake_case (ex: `image_url`, `download_url`)
- Colonnes manquantes : `downloadUrl` et `documentUrl` pour les balades

## Solution

### Étape 1 : Exécuter la migration SQL (camelCase)

1. **Aller dans Supabase Dashboard**
   - Ouvrir votre projet Supabase
   - Aller dans l'onglet "SQL Editor"

2. **Exécuter le script de migration mis à jour**
   - Copier le contenu du fichier `migrations/add-walks-columns.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" pour exécuter

**Contenu du script (camelCase) :**
```sql
-- Migration pour ajouter les colonnes nécessaires aux balades
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS "downloadUrl" TEXT,
ADD COLUMN IF NOT EXISTS "documentUrl" TEXT;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN places."downloadUrl" IS 'URL de téléchargement du tracé de la balade (ex: lien OpenRunner)';
COMMENT ON COLUMN places."documentUrl" IS 'URL du document explicatif de la balade (ex: PDF avec informations détaillées)';

-- Créer un index pour optimiser les requêtes sur les balades avec liens
CREATE INDEX IF NOT EXISTS idx_places_download_url ON places("downloadUrl") WHERE "downloadUrl" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_places_document_url ON places("documentUrl") WHERE "documentUrl" IS NOT NULL;
```

### Étape 2 : Vérifier la migration

Après avoir exécuté le script, vérifier que les colonnes ont été ajoutées :

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name IN ('downloadUrl', 'documentUrl');
```

Vous devriez voir :
```
column_name   | data_type | is_nullable
downloadUrl   | text      | YES
documentUrl   | text      | YES
```

### Étape 3 : Utiliser l'interface de mise à jour

1. **Retourner dans l'admin de l'application**
   - Aller sur `/admin`
   - Cliquer sur "Balades"

2. **Vérifier le schéma**
   - Cliquer sur "Vérifier le schéma"
   - Vous devriez voir "Schéma compatible" ✅

3. **Mettre à jour les balades**
   - Cliquer sur "Mettre à jour la base de données"
   - Confirmer l'action

## Structure de la base de données

### Table `places` (structure existante camelCase)
```sql
CREATE TABLE places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    "imageUrl" TEXT,
    type TEXT NOT NULL,
    -- ... autres colonnes existantes
    -- Nouvelles colonnes ajoutées :
    "downloadUrl" TEXT,
    "documentUrl" TEXT
);
```

### Différences importantes
- **Existant** : `imageUrl` (camelCase)
- **Pas** : `image_url` (snake_case)
- **Pas de colonne** : `status` (n'existe pas dans le schéma original)

## Vérification post-migration

### 1. Compter les balades
```sql
SELECT COUNT(*) FROM places WHERE type = 'walk';
-- Devrait retourner 9
```

### 2. Vérifier les liens de téléchargement
```sql
SELECT name, "downloadUrl", "documentUrl" 
FROM places 
WHERE type = 'walk' 
AND ("downloadUrl" IS NOT NULL OR "documentUrl" IS NOT NULL);
```

### 3. Tester l'interface
- Aller sur `/balades`
- Vérifier que les 9 circuits s'affichent
- Tester les boutons de téléchargement

## Problèmes résolus

### ❌ Erreur initiale : `documentUrl` column not found
**Cause** : Colonne manquante dans la table
**Solution** : Ajout de la colonne avec la migration

### ❌ Erreur suivante : `status` column not found
**Cause** : Tentative d'utilisation d'une colonne inexistante
**Solution** : Suppression de la colonne `status` du script d'insertion

### ❌ Erreur de convention : snake_case vs camelCase
**Cause** : Mélange de conventions de nommage
**Solution** : Utilisation cohérente du camelCase existant

## Scripts mis à jour

### Fichiers modifiés :
- `migrations/add-walks-columns.sql` : Migration camelCase
- `scripts/update-walks-database.ts` : Suppression des colonnes inexistantes
- `components/WalksDatabaseUpdater.tsx` : Vérification adaptée

### Changements principaux :
1. **Colonnes ajoutées** : `"downloadUrl"` et `"documentUrl"` (camelCase)
2. **Colonnes supprimées** : `status`, `tag_ids` (inexistantes)
3. **Format cohérent** : Respect de la structure camelCase existante

## Alternative : Synchronisation complète

Si la mise à jour ciblée ne fonctionne toujours pas :

1. Dans l'admin, cliquer sur "Initialiser DB" (en haut à droite)
2. Confirmer l'action
3. Cela utilisera la fonction `syncMockDataToSupabase` qui gère automatiquement la structure

## Contact

En cas de problème persistant, vérifier :
1. Les logs de la console navigateur
2. Les erreurs dans l'onglet Network
3. La structure réelle de la table dans Supabase
4. La cohérence des conventions de nommage (camelCase vs snake_case)