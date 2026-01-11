# 🔧 Fix : Erreur "record 'new' has no field 'updated_at'"

## L'erreur

```
Error updating item in places: Object
code: "42703"
details: null
hint: null
message: "record \"new\" has no field \"updated_at\""
```

## Cause

Cette erreur survient quand :
1. Le trigger PostgreSQL essaie de mettre à jour le champ `updated_at`
2. Mais le code envoie aussi ce champ dans l'UPDATE
3. Il y a un conflit entre le trigger et les données envoyées

## Solution (déjà appliquée dans le code)

J'ai modifié `contexts/DataContext.tsx` pour filtrer automatiquement les champs `created_at` et `updated_at` avant l'UPDATE :

```typescript
// Avant (causait l'erreur)
const { data, error } = await supabase.from(table).update(item).eq('id', item.id);

// Après (corrigé)
const { created_at, updated_at, ...itemToUpdate } = item;
const { data, error } = await supabase.from(table).update(itemToUpdate).eq('id', item.id);
```

## Étapes pour corriger complètement

### 1. Vérifier que le code est à jour

Le fichier `contexts/DataContext.tsx` devrait maintenant filtrer automatiquement ces champs. Si vous voyez encore l'erreur, rafraîchissez votre application (Ctrl+Shift+R).

### 2. Corriger le trigger dans Supabase

Exécutez le script `FIX-UPDATED-AT-TRIGGER.sql` dans Supabase SQL Editor :

1. Ouvrez Supabase Dashboard
2. SQL Editor
3. Copiez-collez le contenu de `FIX-UPDATED-AT-TRIGGER.sql`
4. Cliquez sur "Run"

Ce script va :
- ✅ Vérifier que la colonne `updated_at` existe
- ✅ Recréer le trigger correctement
- ✅ Tester que tout fonctionne

### 3. Tester

1. Ouvrez votre application
2. Allez sur la page Musées
3. Essayez de modifier une image
4. Vérifiez dans la console qu'il n'y a plus d'erreur

## Vérification rapide

Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier que updated_at existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name = 'updated_at';
```

Résultat attendu :
```
column_name | data_type
updated_at  | timestamp with time zone
```

## Si l'erreur persiste

### Option 1 : Désactiver le trigger temporairement

```sql
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
```

Puis gérer `updated_at` manuellement dans le code (déjà fait dans DataContext.tsx).

### Option 2 : Recréer la table

Si vraiment rien ne fonctionne :

1. Sauvegardez vos données (Export CSV depuis Supabase)
2. Supprimez la table : `DROP TABLE places CASCADE;`
3. Recréez-la avec `supabase-schema.sql`
4. Réimportez les données

## Pourquoi cette erreur ?

PostgreSQL utilise des "records" spéciaux dans les triggers :
- `OLD` : les anciennes valeurs (avant UPDATE)
- `NEW` : les nouvelles valeurs (après UPDATE)

Quand le trigger essaie d'accéder à `NEW.updated_at`, il doit exister dans les données envoyées. Si vous envoyez un objet sans ce champ, ou avec un champ mal formaté, le trigger échoue.

## Solution permanente

Le code a été modifié pour :
1. ✅ Filtrer `created_at` et `updated_at` avant UPDATE
2. ✅ Laisser le trigger gérer automatiquement ces champs
3. ✅ Éviter tout conflit

Après avoir exécuté `FIX-UPDATED-AT-TRIGGER.sql` et rafraîchi votre application, l'erreur ne devrait plus apparaître.

## Test final

```javascript
// Dans la console du navigateur
// Après avoir modifié une image, vérifiez :
console.log('Test réussi si aucune erreur 42703 dans la console');
```

Si vous voyez "Update successful, refreshing data..." sans erreur, c'est bon ! ✅
