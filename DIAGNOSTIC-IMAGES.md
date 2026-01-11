# 🔍 Diagnostic - Problème d'enregistrement des images

## Symptôme
Quand vous uploadez une nouvelle image pour un musée, l'upload semble fonctionner mais après rafraîchissement de la page, l'ancienne image revient.

## Causes possibles

### 1. ✅ Politiques RLS (Row Level Security) - CAUSE LA PLUS PROBABLE

**Problème** : Les politiques RLS de Supabase bloquent les opérations UPDATE avec la clé anonyme.

**Solution** :
1. Ouvrez Supabase Dashboard : https://app.supabase.com
2. Allez dans votre projet
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Copiez-collez le contenu du fichier `FIX-RLS-POLICIES.sql`
5. Cliquez sur "Run" pour exécuter le script
6. Vérifiez que toutes les politiques sont créées sans erreur

**Vérification** :
```sql
-- Exécutez cette requête dans SQL Editor pour vérifier les politiques
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'places';
```

Vous devriez voir une politique nommée "Allow all operations on places" avec cmd = "ALL".

### 2. ✅ Politiques Storage pour les images

**Problème** : Le bucket "images" n'autorise pas l'upload ou la suppression.

**Solution** :
1. Dans Supabase Dashboard, allez dans "Storage"
2. Cliquez sur le bucket "images"
3. Allez dans l'onglet "Policies"
4. Vérifiez que vous avez ces 4 politiques :
   - ✅ Public read access (SELECT)
   - ✅ Public upload access (INSERT)
   - ✅ Public update access (UPDATE)
   - ✅ Public delete access (DELETE)

Si elles n'existent pas, créez-les avec l'expression `true` pour chaque.

### 3. ✅ Vérification de la console du navigateur

**Ouvrez la console du navigateur** (F12) et regardez les messages lors de l'upload :

**Messages attendus** :
```
Starting image upload: { fileName: "...", size: ..., folder: "museums" }
Generated filename: museums/1234567890-abc123.jpg
Upload successful, getting public URL for: museums/1234567890-abc123.jpg
Public URL generated: https://...
Image uploaded successfully: https://...
Updating museum in places: { id: "...", imageUrl: "https://..." }
Update successful, refreshing data...
Data refreshed
```

**Messages d'erreur possibles** :
- ❌ "new row violates row-level security policy" → Problème RLS (voir solution 1)
- ❌ "permission denied for table places" → Problème RLS (voir solution 1)
- ❌ "Upload failed: ..." → Problème Storage (voir solution 2)

### 4. ✅ Vérification dans la base de données

**Vérifiez si l'URL est bien enregistrée** :

1. Dans Supabase Dashboard, allez dans "Table Editor"
2. Ouvrez la table "places"
3. Trouvez votre musée
4. Vérifiez la colonne "imageUrl"
5. Est-ce que l'URL correspond à la nouvelle image ou à l'ancienne ?

**Si l'URL est l'ancienne** → Le problème est dans l'UPDATE (RLS)
**Si l'URL est la nouvelle** → Le problème est dans le cache ou le rafraîchissement

### 5. ✅ Cache du navigateur

**Problème** : Le navigateur cache l'ancienne image.

**Solution rapide** :
- Appuyez sur Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac) pour forcer le rafraîchissement
- Ou ouvrez les DevTools (F12) → Network → Cochez "Disable cache"

**Solution permanente** : J'ai déjà ajouté un `useEffect` dans `EditableImage.tsx` qui devrait résoudre ce problème.

## 🔧 Modifications apportées

J'ai apporté les modifications suivantes pour améliorer le système :

### 1. `components/EditableImage.tsx`
- ✅ Ajout d'un `useEffect` pour mettre à jour l'image quand le prop `src` change
- ✅ Ajout d'une `key` sur l'élément `<img>` pour forcer le re-render

### 2. `contexts/DataContext.tsx`
- ✅ Ajout de logs détaillés dans `updateItem()` pour faciliter le diagnostic
- ✅ Propagation des erreurs pour mieux les identifier

## 🧪 Test étape par étape

1. **Ouvrez la console du navigateur** (F12)
2. **Allez sur la page Musées**
3. **Survolez une image de musée** et cliquez sur "Modifier l'image"
4. **Sélectionnez une nouvelle image**
5. **Observez les messages dans la console** :
   - Vous devriez voir tous les logs de l'upload
   - Puis les logs de l'update
   - Puis "Data refreshed"
6. **Attendez quelques secondes** que l'image se mette à jour
7. **Rafraîchissez la page** (F5)
8. **Vérifiez si la nouvelle image est toujours là**

## ❌ Si ça ne fonctionne toujours pas

### Vérification manuelle dans Supabase

1. Allez dans Supabase Dashboard → Storage → images
2. Vérifiez que la nouvelle image est bien uploadée (vous devriez voir un fichier avec un timestamp récent)
3. Allez dans Table Editor → places
4. Trouvez votre musée et vérifiez l'URL dans la colonne `imageUrl`
5. Copiez cette URL et ouvrez-la dans un nouvel onglet
6. Est-ce que c'est la bonne image ?

### Si l'image est dans Storage mais pas dans la DB

→ **Problème RLS** : Exécutez `FIX-RLS-POLICIES.sql`

### Si l'image est dans Storage ET dans la DB mais ne s'affiche pas

→ **Problème de cache** : Videz le cache du navigateur ou utilisez le mode navigation privée

### Si l'image n'est même pas dans Storage

→ **Problème de permissions Storage** : Vérifiez les politiques du bucket "images"

## 📞 Besoin d'aide ?

Si le problème persiste après avoir suivi toutes ces étapes :

1. Copiez les messages d'erreur de la console
2. Vérifiez l'état des politiques RLS
3. Vérifiez l'état des politiques Storage
4. Partagez ces informations pour un diagnostic plus approfondi
