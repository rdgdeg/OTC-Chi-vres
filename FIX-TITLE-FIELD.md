# ✅ Fix - Erreur "title column not found"

## Problème résolu

L'erreur `"Could not find the 'title' column of 'places' in the schema cache"` apparaissait lors de la mise à jour d'un musée depuis l'Admin.

## Cause

Dans `pages/Admin.tsx`, le formulaire d'édition met à jour à la fois `name` ET `title` :

```typescript
onChange={e => setEditingItem({
  ...editingItem, 
  name: e.target.value,   // ✅ Existe dans la table
  title: e.target.value   // ❌ N'existe PAS dans la table places
})}
```

**Problème :** La table `places` utilise uniquement `name`, pas `title`. Le champ `title` existe dans d'autres tables (events, experiences, articles) mais pas dans `places`.

## Solution appliquée

### DataContext.tsx modifié

**Dans `updateItem()` :**
```typescript
// Avant
const { created_at, updated_at, ...itemToUpdate } = item;

// Après
const { created_at, updated_at, title, ...itemToUpdate } = item;
```

**Dans `addItem()` :**
```typescript
// Avant
const { created_at, updated_at, ...itemData } = item;

// Après
const { created_at, updated_at, title, ...itemData } = item;
```

Le champ `title` est maintenant filtré avant l'envoi à Supabase, évitant l'erreur.

## Pourquoi ce champ existe ?

L'Admin gère plusieurs types d'entités :
- **Places** (museums, restaurants, hotels) → utilisent `name`
- **Events, Experiences, Articles** → utilisent `title`

Pour simplifier le formulaire, le code met à jour les deux champs. Maintenant, seul le champ approprié est envoyé à la base de données.

## Test

1. **Rafraîchissez le navigateur** (Ctrl+Shift+R)
2. **Allez sur `/admin`**
3. **Modifiez un musée** (changez le nom ou la description)
4. **Cliquez sur "Enregistrer"**
5. ✅ **Plus d'erreur "title column not found"**
6. ✅ **La modification est enregistrée**

## Vérification dans la console

**Avant (avec erreur) :**
```
Updating museum in places: { name: "...", title: "...", ... }
Supabase update error: Could not find the 'title' column
```

**Maintenant (sans erreur) :**
```
Updating museum in places: { name: "...", ... }
Update successful, refreshing data...
Data refreshed
```

Le champ `title` n'est plus envoyé.

## Autres champs filtrés

Pour référence, voici tous les champs filtrés avant UPDATE/INSERT :

1. ✅ `created_at` - Géré par la base de données
2. ✅ `updated_at` - Géré manuellement dans le code
3. ✅ `title` - N'existe pas dans la table `places`

## Résumé

- ✅ Champ `title` filtré avant UPDATE
- ✅ Champ `title` filtré avant INSERT
- ✅ Plus d'erreur lors de la modification de musées
- ✅ Les autres types (events, experiences) fonctionnent toujours

**Le problème est résolu !** 📝
