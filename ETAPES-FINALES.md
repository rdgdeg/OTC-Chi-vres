# 🎯 Étapes finales - Configuration Supabase

## Statut actuel

✅ Les tables existent déjà
✅ Les politiques RLS sont en place
⏳ Il faut corriger le trigger `updated_at`
⏳ Il faut initialiser les données

## Étape 1 : Corriger le trigger updated_at

**Copiez et exécutez ce script dans Supabase SQL Editor :**

```sql
-- ===================================
-- CORRECTION RAPIDE DU TRIGGER
-- ===================================

-- 1. Supprimer les anciens triggers
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;

-- 2. Recréer la fonction trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Recréer les triggers
CREATE TRIGGER update_places_updated_at 
    BEFORE UPDATE ON places
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON experiences
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Vérification
SELECT 'Triggers créés avec succès!' as status;
```

**Résultat attendu :** `Triggers créés avec succès!`

## Étape 2 : Initialiser les données

**Option A : Via l'interface Admin (RECOMMANDÉ)**

1. Ouvrez votre application : http://localhost:5173 (ou votre URL)
2. Allez sur `/admin`
3. Connectez-vous avec le mot de passe : `admin`
4. Cliquez sur le bouton vert **"Initialiser DB"** en haut à droite
5. Confirmez l'action
6. Attendez le message "Base de données synchronisée avec succès !"

**Option B : Vérifier si les données existent déjà**

Dans Supabase SQL Editor :

```sql
-- Compter les données existantes
SELECT 
    'places' as table_name, COUNT(*) as count FROM places
UNION ALL
SELECT 'experiences', COUNT(*) FROM experiences
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'articles', COUNT(*) FROM articles
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'page_content', COUNT(*) FROM page_content;
```

Si tous les compteurs sont à 0, utilisez l'Option A.

## Étape 3 : Tester l'upload d'images

1. **Allez sur la page Musées** de votre application
2. **Survolez une image** de musée
3. **Cliquez sur "Modifier l'image"**
4. **Sélectionnez une nouvelle image**
5. **Ouvrez la console du navigateur (F12)** et vérifiez les messages :
   ```
   Starting image upload: {...}
   Upload successful, getting public URL for: ...
   Image uploaded successfully: https://...
   Updating museum in places: {...}
   Update successful, refreshing data...
   Data refreshed
   ```
6. **Rafraîchissez la page (F5)**
7. ✅ **La nouvelle image devrait rester !**

## Étape 4 : Vérification dans Supabase

1. **Dashboard → Table Editor → places**
2. Trouvez le musée que vous avez modifié
3. Vérifiez que la colonne `imageUrl` contient la nouvelle URL
4. Vérifiez que `updated_at` a été mis à jour récemment

## Si ça ne fonctionne toujours pas

### Problème : L'image ne s'upload pas

**Vérifiez le bucket Storage :**

1. Supabase Dashboard → Storage
2. Vérifiez que le bucket `images` existe
3. S'il n'existe pas, créez-le :
   - Nom : `images`
   - Public : ✅ Oui
   - File size limit : 5MB

**Vérifiez les politiques Storage :**

1. Storage → images → Policies
2. Vous devez avoir 4 politiques :
   - Public read (SELECT)
   - Public upload (INSERT)
   - Public update (UPDATE)
   - Public delete (DELETE)

Si elles n'existent pas, créez-les avec l'expression `true` pour chaque.

### Problème : L'image s'upload mais ne persiste pas

**Vérifiez que les données sont en DB :**

```sql
SELECT id, name, "imageUrl", updated_at 
FROM places 
WHERE type = 'museum' 
ORDER BY updated_at DESC 
LIMIT 5;
```

Si la table est vide, retournez à l'Étape 2.

### Problème : Erreur dans la console

**Erreur "permission denied" :**
→ Problème de politiques RLS, mais normalement c'est déjà réglé

**Erreur "updated_at" :**
→ Retournez à l'Étape 1 et réexécutez le script

**Erreur "bucket not found" :**
→ Créez le bucket `images` dans Storage

## Résumé des actions

1. ✅ Exécuter le script de correction du trigger (ci-dessus)
2. ✅ Initialiser la DB via l'Admin
3. ✅ Tester l'upload d'images
4. ✅ Vérifier que ça persiste après rafraîchissement

**Temps estimé : 5 minutes**

## Script complet (tout-en-un)

Si vous voulez tout faire d'un coup dans SQL Editor :

```sql
-- 1. Corriger les triggers
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Vérifier
SELECT 'Configuration terminée!' as status;
```

Après avoir exécuté ce script, allez dans votre application et cliquez sur "Initialiser DB" !
