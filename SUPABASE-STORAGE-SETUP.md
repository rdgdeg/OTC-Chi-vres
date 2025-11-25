# Configuration Supabase Storage pour les Images

## Étape 1 : Créer le bucket de stockage

1. Connectez-vous à votre projet Supabase : https://app.supabase.com
2. Allez dans **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Configurez le bucket :
   - **Name** : `images`
   - **Public bucket** : ✅ Coché (pour que les images soient accessibles publiquement)
   - **File size limit** : `5242880` (5 MB)
   - **Allowed MIME types** : `image/jpeg,image/png,image/webp,image/gif`

5. Cliquez sur **Create bucket**

## Étape 2 : Configurer les politiques de sécurité (RLS)

Une fois le bucket créé, vous devez configurer les politiques d'accès :

### 1. Lecture publique (SELECT)

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

### 2. Upload pour utilisateurs authentifiés (INSERT)

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

### 3. Mise à jour pour utilisateurs authentifiés (UPDATE)

```sql
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

### 4. Suppression pour utilisateurs authentifiés (DELETE)

```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

## Étape 3 : Mettre à jour le schéma de base de données

Exécutez le script SQL mis à jour `supabase-schema.sql` dans l'éditeur SQL de Supabase pour ajouter les nouveaux champs aux tables existantes :

```sql
-- Ajouter les nouveaux champs à la table places
ALTER TABLE places ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS "openingHours" TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS "practicalInfo" TEXT;
```

## Étape 4 : Tester l'upload

1. Allez dans la page Admin de votre site
2. Éditez un musée
3. Utilisez le bouton "Ajouter" dans la section Images
4. Sélectionnez une ou plusieurs images
5. Les images seront uploadées automatiquement vers Supabase Storage

## Structure des dossiers dans Storage

Les images seront organisées par type :
- `images/museums/` - Photos des musées
- `images/restaurants/` - Photos des restaurants
- `images/hotels/` - Photos des hébergements
- `images/general/` - Autres images

## Résolution des problèmes

### Les images ne s'affichent pas
- Vérifiez que le bucket est bien **public**
- Vérifiez les politiques RLS dans Storage > Policies
- Vérifiez la console du navigateur pour les erreurs CORS

### Erreur lors de l'upload
- Vérifiez que vous êtes authentifié (connecté à l'admin)
- Vérifiez la taille du fichier (max 5 MB)
- Vérifiez le format (JPEG, PNG, WebP, GIF uniquement)

### Les images ne se mettent pas à jour
- Le système ajoute un paramètre `?t=timestamp` pour forcer le rechargement
- Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
- Vérifiez que l'URL de l'image a bien changé dans la base de données

## Migration des images existantes

Si vous avez déjà des images avec des URLs externes (Picsum, etc.), vous pouvez :

1. Les laisser telles quelles (elles continueront de fonctionner)
2. Les télécharger et les re-uploader via l'interface Admin
3. Utiliser un script de migration pour les transférer automatiquement

## Avantages de Supabase Storage

✅ Hébergement gratuit jusqu'à 1 GB
✅ CDN intégré pour des chargements rapides
✅ Gestion automatique des permissions
✅ Pas de limite de bande passante (dans le plan gratuit)
✅ Intégration native avec votre base de données Supabase
