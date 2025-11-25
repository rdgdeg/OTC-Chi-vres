# Dépannage RLS - Modifications Non Visibles 🔧

## 🚨 Problème

Vous modifiez des données dans l'admin mais elles ne se mettent pas à jour sur le site.

## 🎯 Solution Rapide

### Étape 1 : Exécuter le Script de Correction

1. **Ouvrir Supabase** : https://supabase.com
2. **Votre projet** → SQL Editor
3. **Copier-coller** le contenu de `FIX-RLS-POLICIES.sql`
4. **Exécuter** (bouton Run ou Ctrl+Enter)
5. **Vérifier** qu'il n'y a pas d'erreurs

### Étape 2 : Configurer le Storage

1. **SQL Editor** → Nouveau query
2. **Copier-coller** le contenu de `FIX-STORAGE-POLICIES.sql`
3. **Exécuter**
4. **Vérifier** le bucket "images" existe

### Étape 3 : Tester

1. **Rafraîchir** votre app : `Ctrl + Shift + R`
2. **Admin** → Modifier un musée
3. **Enregistrer**
4. **Cliquer "Rafraîchir"** en haut
5. **Vérifier** sur la page Musées

## 🔍 Diagnostic

### Vérifier les Politiques RLS

```sql
-- Dans Supabase SQL Editor
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Résultat attendu :**
- Chaque table doit avoir une politique "Allow all operations"
- `cmd` = `ALL`
- `qual` = `true`
- `with_check` = `true`

### Vérifier le Bucket Storage

```sql
-- Vérifier le bucket
SELECT * FROM storage.buckets WHERE id = 'images';
```

**Résultat attendu :**
- `id` = `images`
- `public` = `true`
- `file_size_limit` = `5242880` (5MB)

### Vérifier les Politiques Storage

```sql
-- Vérifier les politiques
SELECT 
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'images_%';
```

**Résultat attendu :**
- `images_public_read` (SELECT)
- `images_public_insert` (INSERT)
- `images_public_update` (UPDATE)
- `images_public_delete` (DELETE)

## 🐛 Erreurs Courantes

### Erreur 1 : "new row violates row-level security policy"

**Cause :** Les politiques RLS bloquent l'insertion

**Solution :**
```sql
-- Exécuter FIX-RLS-POLICIES.sql
-- OU désactiver RLS temporairement (dev seulement)
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
```

### Erreur 2 : "permission denied for table places"

**Cause :** Pas de politique RLS pour l'opération

**Solution :**
```sql
-- Créer une politique permissive
CREATE POLICY "Allow all operations on places" 
ON places 
FOR ALL 
USING (true) 
WITH CHECK (true);
```

### Erreur 3 : "Failed to upload image"

**Cause :** Bucket n'existe pas ou pas de politiques

**Solution :**
```sql
-- Exécuter FIX-STORAGE-POLICIES.sql
-- OU créer le bucket manuellement
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);
```

### Erreur 4 : "The resource you are looking for could not be found"

**Cause :** URL Supabase incorrecte

**Solution :**
```bash
# Vérifier .env.local
cat .env.local

# Doit contenir :
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Redémarrer le serveur
npm run dev
```

## 🔧 Solutions Alternatives

### Option 1 : Désactiver RLS (Dev Seulement)

```sql
-- ⚠️ NE JAMAIS FAIRE ÇA EN PRODUCTION !
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;
```

### Option 2 : Utiliser la Clé Service Role

```typescript
// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // ⚠️ Côté serveur uniquement !

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

**⚠️ ATTENTION :** La clé service_role doit UNIQUEMENT être utilisée côté serveur, jamais dans le frontend !

### Option 3 : Implémenter l'Authentification

```typescript
// Exemple avec Supabase Auth
import { supabase } from './supabaseClient';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'password'
});

// Politiques RLS basées sur auth.uid()
CREATE POLICY "Allow authenticated users" 
ON places 
FOR ALL 
USING (auth.role() = 'authenticated');
```

## 📊 Checklist de Vérification

### Avant de Modifier

- [ ] Supabase est accessible
- [ ] Variables d'environnement correctes
- [ ] Serveur dev redémarré après changement .env
- [ ] Console navigateur ouverte (F12)

### Pendant la Modification

- [ ] Pas d'erreur dans la console
- [ ] Message "Enregistré" affiché
- [ ] Bouton "Rafraîchir" cliqué

### Après la Modification

- [ ] Données visibles dans Supabase Dashboard
- [ ] Page rafraîchie avec Ctrl+Shift+R
- [ ] Cache navigateur vidé si nécessaire

## 🎯 Test Complet

### 1. Tester l'Insertion

```javascript
// Dans la console navigateur (F12)
const { data, error } = await supabase
  .from('places')
  .insert({
    id: 'test-' + Date.now(),
    name: 'Test Museum',
    description: 'Test description',
    type: 'museum'
  });

console.log('Insert result:', { data, error });
// Si error !== null, il y a un problème RLS
```

### 2. Tester la Mise à Jour

```javascript
// Trouver un ID existant
const { data: places } = await supabase
  .from('places')
  .select('id')
  .limit(1);

// Mettre à jour
const { data, error } = await supabase
  .from('places')
  .update({ name: 'Updated Name' })
  .eq('id', places[0].id);

console.log('Update result:', { data, error });
```

### 3. Tester l'Upload

```javascript
// Créer un fichier test
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

// Upload
const { data, error } = await supabase.storage
  .from('images')
  .upload(`test/${Date.now()}.jpg`, file);

console.log('Upload result:', { data, error });
```

## 📞 Support

### Si Rien ne Fonctionne

1. **Copier les erreurs** de la console (F12)
2. **Vérifier les logs** Supabase (Dashboard > Logs)
3. **Consulter** `GUIDE-RAFRAICHISSEMENT.md`
4. **Vérifier** `VERIFICATION.md`

### Ressources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- `FIX-RLS-POLICIES.sql` - Script de correction
- `FIX-STORAGE-POLICIES.sql` - Configuration Storage

---

**Important :** Les politiques RLS actuelles sont TRÈS permissives (permettent tout à tout le monde). C'est OK pour le développement, mais vous DEVEZ les sécuriser avant de déployer en production !
