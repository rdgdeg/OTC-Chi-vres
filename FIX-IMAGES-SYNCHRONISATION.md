# 🖼️ FIX: Synchronisation des Images Admin ↔ Frontend

## 🔴 Problème Identifié

Vous rencontrez des erreurs lors de la modification d'images dans l'admin :
```
Error: Could not find the 'featured_image' column of 'places' in the schema cache
```

Et les images affichées sur le site ne correspondent pas à celles dans l'admin.

## 🔍 Cause Racine

**Incohérence des noms de colonnes entre les tables :**

| Table | Colonne utilisée | Problème |
|-------|-----------------|----------|
| `places` | `imageUrl` (camelCase) | ✅ Correct |
| `accommodations` | `featured_image` (snake_case) | ❌ Incohérent |
| `events` | `featured_image` (snake_case) | ❌ Incohérent |
| `articles` | `featured_image` (snake_case) | ❌ Incohérent |

**Le modal EditItemModal.tsx essayait d'utiliser `featured_image` pour toutes les tables, mais `places` utilise `imageUrl`.**

## ✅ Solution Appliquée

### 1. Script SQL de Synchronisation

Créé : `scripts/fix-image-fields-sync.sql`

Ce script :
- ✅ Vérifie les colonnes existantes dans chaque table
- ✅ Ajoute `imageUrl` si elle n'existe pas
- ✅ Copie les données de `featured_image` vers `imageUrl`
- ✅ Garde `featured_image` pour compatibilité (deprecated)

### 2. Correction du Modal EditItemModal.tsx

**Modifications apportées :**

```typescript
// AVANT (❌ Erreur)
interface ExtendedContentItem {
  featured_image?: string;
  gallery_images?: string[];
}

// APRÈS (✅ Corrigé)
interface ExtendedContentItem {
  imageUrl?: string; // Image principale (standardisé)
  featured_image?: string; // Ancien champ (deprecated)
  galleryImages?: string[]; // Galerie (camelCase)
  gallery_images?: string[]; // Ancien champ (deprecated)
}
```

**Changements dans le code :**

1. **Sauvegarde** : Utilise `imageUrl` au lieu de `featured_image`
   ```typescript
   imageUrl: formData.imageUrl || formData.featured_image
   ```

2. **Upload d'image** : Met à jour `imageUrl`
   ```typescript
   setFormData(prev => ({ ...prev, imageUrl: result }))
   ```

3. **Affichage** : Supporte les deux formats
   ```typescript
   {(formData.imageUrl || formData.featured_image) && (
     <img src={formData.imageUrl || formData.featured_image} />
   )}
   ```

4. **Galerie** : Supporte `galleryImages` et `gallery_images`
   ```typescript
   (formData.galleryImages || formData.gallery_images || []).map(...)
   ```

## 🚀 Étapes de Correction

### Étape 1 : Exécuter le Script SQL

```bash
# Dans Supabase SQL Editor, exécuter :
OTC-Chi-vres/scripts/fix-image-fields-sync.sql
```

**Ce que fait le script :**
- Copie toutes les images de `featured_image` vers `imageUrl`
- Ajoute la colonne `imageUrl` si elle n'existe pas
- Affiche un résumé des modifications

### Étape 2 : Vider le Cache du Navigateur

```bash
# Dans votre navigateur :
1. Ouvrir les DevTools (F12)
2. Onglet "Application" ou "Storage"
3. Cliquer sur "Clear storage" ou "Vider le cache"
4. Recharger la page (Ctrl+Shift+R ou Cmd+Shift+R)
```

### Étape 3 : Tester la Modification d'Image

1. Aller dans l'admin
2. Ouvrir une fiche "Se Désaltérer" (café/restaurant)
3. Modifier l'image principale
4. Sauvegarder
5. Vérifier que l'image s'affiche correctement sur le site

## 📊 Vérification

### Vérifier les Colonnes dans Supabase

```sql
-- Vérifier places
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name LIKE '%image%';

-- Vérifier accommodations
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'accommodations' 
AND column_name LIKE '%image%';
```

### Vérifier les Données

```sql
-- Compter les images dans places
SELECT 
  COUNT(*) as total,
  COUNT("imageUrl") as with_imageUrl,
  COUNT(featured_image) as with_featured_image
FROM places;

-- Compter les images dans accommodations
SELECT 
  COUNT(*) as total,
  COUNT("imageUrl") as with_imageUrl,
  COUNT(featured_image) as with_featured_image
FROM accommodations;
```

## 🎯 Résultat Attendu

Après correction :

✅ **Admin** : Peut modifier les images sans erreur 406 ou 400  
✅ **Frontend** : Affiche les images correctement  
✅ **Synchronisation** : Les images modifiées dans l'admin apparaissent immédiatement sur le site  
✅ **Compatibilité** : Les anciennes données avec `featured_image` fonctionnent toujours  

## 🔄 Migration Progressive

Le code supporte maintenant **les deux formats** :
- `imageUrl` (nouveau standard)
- `featured_image` (ancien format, deprecated)

Cela permet une migration progressive sans casser les données existantes.

## 📝 Standardisation Future

**Recommandation** : À terme, standardiser sur :
- `imageUrl` pour l'image principale
- `galleryImages` pour la galerie (array)

**Éviter** :
- `featured_image` (snake_case)
- `gallery_images` (snake_case)

## 🐛 Debugging

Si le problème persiste :

1. **Vérifier les logs du navigateur** (F12 → Console)
2. **Vérifier les logs Supabase** (Dashboard → Logs)
3. **Vérifier la structure de la table** :
   ```sql
   SELECT * FROM places WHERE type = 'cafe' LIMIT 1;
   ```
4. **Vérifier les RLS Policies** :
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'places';
   ```

## 📚 Fichiers Modifiés

- ✅ `components/admin/EditItemModal.tsx` - Utilise imageUrl au lieu de featured_image
- ✅ `scripts/fix-image-fields-sync.sql` - Script de synchronisation SQL
- ✅ `FIX-IMAGES-SYNCHRONISATION.md` - Cette documentation

## 🎉 Prochaines Étapes

1. Exécuter le script SQL
2. Vider le cache
3. Tester la modification d'images
4. Vérifier que tout fonctionne
5. Commit et push des changements

---

**Date de création** : 2026-01-14  
**Problème résolu** : Erreur 406/400 lors de la modification d'images + désynchronisation admin/frontend
