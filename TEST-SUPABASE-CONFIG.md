# Test de Configuration Supabase

## Vérification rapide

### 1. Vérifier les variables d'environnement

Ouvrez `.env.local` et vérifiez que vous avez :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### 2. Tester la connexion Supabase

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// Test 1 : Connexion à Supabase
const { data, error } = await supabase.from('team_members').select('count');
console.log('Test connexion:', { data, error });

// Test 2 : Vérifier le bucket images
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Buckets disponibles:', buckets);

// Test 3 : Tester l'upload (avec un fichier test)
// Créez d'abord un fichier test dans la console
const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('images')
  .upload(`test/${Date.now()}.txt`, testFile);
console.log('Test upload:', { uploadData, uploadError });
```

### 3. Vérifier dans Supabase Dashboard

#### Table team_members
1. Allez dans **Table Editor**
2. Cherchez `team_members`
3. Vérifiez qu'il y a 6 lignes

#### Bucket images
1. Allez dans **Storage**
2. Cherchez le bucket `images`
3. Vérifiez qu'il est **Public**
4. Essayez d'uploader un fichier manuellement

#### Politiques RLS
1. Allez dans **Authentication > Policies**
2. Cherchez les politiques pour `team_members`
3. Vérifiez qu'il y a des politiques pour SELECT, INSERT, UPDATE, DELETE

### 4. Test complet d'upload

1. Allez sur la page `/equipe`
2. Ouvrez la console (F12)
3. Survolez une photo et cliquez sur "Modifier la photo"
4. Sélectionnez une image
5. Regardez les logs dans la console :
   - "Starting image upload"
   - "Generated filename"
   - "Upload successful"
   - "Public URL generated"
   - "Team member updated successfully"

### 5. Si ça ne fonctionne toujours pas

Exécutez dans l'ordre :
1. `supabase-team-table.sql` (créer la table)
2. `FIX-TEAM-STORAGE.sql` (configurer le storage)
3. Redémarrez l'application
4. Videz le cache du navigateur (Ctrl+Shift+R)
5. Réessayez

### 6. Logs utiles

Les logs dans la console vous diront exactement où ça bloque :
- ❌ Erreur avant "Starting image upload" → Problème de sélection de fichier
- ❌ Erreur après "Generated filename" → Problème de bucket/storage
- ❌ Erreur après "Upload successful" → Problème de base de données
- ✅ "Team member updated successfully" → Tout fonctionne !
