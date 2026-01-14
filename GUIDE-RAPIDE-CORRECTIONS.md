# Guide Rapide : Appliquer les Corrections

## 🚀 Démarrage Rapide

Ce guide vous permet d'appliquer toutes les corrections en quelques étapes simples.

---

## ✅ Étape 1 : Vérifier les Corrections Déjà Appliquées

Les corrections suivantes ont déjà été appliquées :

1. ✅ Suppression des doublons dans `AccommodationFields.tsx`
   - Facebook (maintenant uniquement dans les champs communs)
   - Upload d'image principale (maintenant uniquement dans les champs communs)

2. ✅ Création des fichiers de support
   - `services/contentMappings.ts` - Mappings centralisés
   - `hooks/usePublishedContent.ts` - Hook pour filtrer le contenu publié
   - `scripts/find-missing-status-filters.sh` - Script de détection
   - `scripts/verify-and-fix-status-columns.sql` - Script SQL de correction

3. ✅ Documentation complète
   - `AUDIT-MODALS-EDITION.md` - Analyse détaillée
   - `MIGRATION-FILTRES-STATUS.md` - Guide de migration
   - `CORRECTIONS-MODALS-APPLIQUEES.md` - Résumé des corrections

---

## 🔧 Étape 2 : Corriger la Base de Données

### ⚠️ Important : Utiliser le Script Sécurisé

**Utilisez le nouveau script :** `verify-and-fix-status-columns-safe.sql`

Ce script corrige l'erreur "column status does not exist" du script original.

### Option A : Via Supabase SQL Editor (Recommandé)

1. Ouvrir Supabase Dashboard
2. Aller dans "SQL Editor"
3. Créer une nouvelle requête
4. Copier-coller le contenu de `scripts/verify-and-fix-status-columns-safe.sql`
5. Exécuter la requête (Run ou Ctrl+Enter)
6. Vérifier les résultats dans les messages

### Option B : Via CLI Supabase

```bash
cd OTC-Chi-vres
supabase db push scripts/verify-and-fix-status-columns-safe.sql
```

### ❌ En Cas d'Erreur

Si vous rencontrez l'erreur :
```
ERROR: 42703: column "status" does not exist
```

👉 **Consultez :** `FIX-ERREUR-SQL-STATUS.md` pour la solution détaillée

### Vérification

Après exécution, vous devriez voir :
- ✅ Colonnes `status` ajoutées à toutes les tables
- ✅ Toutes les fiches existantes ont `status='published'`
- ✅ Contraintes CHECK ajoutées
- ✅ RLS Policies mises à jour
- ✅ Index créés pour la performance

---

## 🔍 Étape 3 : Identifier les Fichiers à Modifier

### Exécuter le script de détection

```bash
cd OTC-Chi-vres
chmod +x scripts/find-missing-status-filters.sh
bash scripts/find-missing-status-filters.sh
```

### Interpréter les résultats

Le script affichera :
- ✅ Fichiers OK (avec filtre status)
- ❌ Fichiers à corriger (sans filtre status)
- 📊 Résumé avec compteurs

**Exemple de sortie :**
```
🔍 Recherche des requêtes Supabase sans filtre status...
==================================================

📋 Vérification de la table: accommodations
---
❌ MANQUE FILTRE: services/accommodationService.ts
45:  const { data, error } = await supabase.from('accommodations')

✅ OK: components/AccommodationManager.tsx

📊 RÉSUMÉ
==================================================
Fichiers analysés: 15
Problèmes trouvés: 3
```

---

## 📝 Étape 4 : Corriger les Services

Pour chaque fichier identifié, ajouter `.eq('status', 'published')` :

### Exemple : accommodationService.ts

#### Avant
```typescript
export const getAccommodations = async () => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};
```

#### Après
```typescript
export const getAccommodations = async () => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('status', 'published') // ⭐ AJOUT
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};
```

### Services Prioritaires

1. **accommodationService.ts**
   ```typescript
   .eq('status', 'published')
   ```

2. **eventService.ts**
   ```typescript
   .eq('status', 'published')
   ```

3. **Services utilisant `places`** (walks, dining, heritage)
   ```typescript
   .eq('status', 'published')
   .in('type', ['walk']) // ou ['restaurant', 'cafe', 'bar'], etc.
   ```

---

## 🎨 Étape 5 : Utiliser le Hook usePublishedContent (Optionnel mais Recommandé)

### Remplacer les requêtes manuelles

#### Avant
```typescript
const [accommodations, setAccommodations] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');
    
    setAccommodations(data || []);
    setLoading(false);
  };
  
  fetchData();
}, []);
```

#### Après
```typescript
import { usePublishedContent } from '../hooks/usePublishedContent';

const { data: accommodations, loading, error } = usePublishedContent({
  categoryId: 'accommodations',
  orderBy: 'name',
  ascending: true
});
```

### Avantages
- ✅ Filtre automatique sur `status='published'`
- ✅ Gestion automatique du loading
- ✅ Gestion automatique des erreurs
- ✅ Code plus propre et maintenable

---

## 🧪 Étape 6 : Tester les Corrections

### Test 1 : Fiche Draft Invisible

```bash
# 1. Créer une fiche de test en draft
# Dans Supabase SQL Editor :
INSERT INTO accommodations (name, type, village, status)
VALUES ('Test Draft', ARRAY['gite'], 'Chièvres', 'draft');

# 2. Vérifier sur le site
# Aller sur http://localhost:5173/accommodations
# ✅ La fiche "Test Draft" ne doit PAS apparaître
```

### Test 2 : Fiche Published Visible

```bash
# 1. Changer le statut en published
UPDATE accommodations
SET status = 'published'
WHERE name = 'Test Draft';

# 2. Rafraîchir le site
# ✅ La fiche "Test Draft" doit maintenant apparaître
```

### Test 3 : Fiche Archived Invisible

```bash
# 1. Archiver la fiche
UPDATE accommodations
SET status = 'archived'
WHERE name = 'Test Draft';

# 2. Rafraîchir le site
# ✅ La fiche "Test Draft" ne doit plus apparaître
```

### Test 4 : Édition Admin → Frontend

```bash
# 1. Aller dans l'admin
# 2. Modifier une fiche published (changer le nom)
# 3. Sauvegarder
# 4. Aller sur le frontend
# ✅ Le nouveau nom doit apparaître
```

### Test 5 : Suppression Admin → Frontend

```bash
# 1. Aller dans l'admin
# 2. Supprimer une fiche
# 3. Rafraîchir le frontend
# ✅ La fiche doit avoir disparu
```

### Test 6 : Pas de Doublons Visuels

```bash
# 1. Aller dans l'admin
# 2. Éditer un hébergement
# 3. Vérifier visuellement :
#    ✅ UN SEUL champ Facebook
#    ✅ UN SEUL upload d'image principale
```

---

## 📊 Checklist Complète

### Base de Données
- [ ] Exécuter `verify-and-fix-status-columns.sql`
- [ ] Vérifier que toutes les tables ont une colonne `status`
- [ ] Vérifier que toutes les fiches ont un statut valide
- [ ] Vérifier les RLS Policies

### Code
- [ ] Exécuter `find-missing-status-filters.sh`
- [ ] Corriger tous les services identifiés
- [ ] Corriger tous les composants identifiés
- [ ] Corriger toutes les pages identifiées

### Tests
- [ ] Test 1 : Fiche draft invisible ✅
- [ ] Test 2 : Fiche published visible ✅
- [ ] Test 3 : Fiche archived invisible ✅
- [ ] Test 4 : Édition admin → frontend ✅
- [ ] Test 5 : Suppression admin → frontend ✅
- [ ] Test 6 : Pas de doublons visuels ✅

---

## 🚨 Dépannage

### Problème : Les fiches draft apparaissent encore

**Solution :**
1. Vérifier que le filtre `.eq('status', 'published')` est bien présent
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Redémarrer le serveur de développement
4. Vérifier les RLS Policies dans Supabase

### Problème : Erreur "column status does not exist"

**Solution :**
1. Exécuter le script SQL `verify-and-fix-status-columns.sql`
2. Vérifier dans Supabase que la colonne existe
3. Si nécessaire, ajouter manuellement :
   ```sql
   ALTER TABLE accommodations 
   ADD COLUMN status VARCHAR(20) DEFAULT 'published';
   ```

### Problème : Les modifications admin n'apparaissent pas

**Solution :**
1. Vérifier que le statut de la fiche est `published`
2. Vider le cache du navigateur
3. Vérifier les RLS Policies
4. Vérifier les logs de la console navigateur

### Problème : Doublons de champs encore visibles

**Solution :**
1. Vérifier que les modifications dans `AccommodationFields.tsx` sont bien appliquées
2. Redémarrer le serveur de développement
3. Vider le cache du navigateur

---

## 📞 Support

### Documentation Complète
- `AUDIT-MODALS-EDITION.md` - Analyse détaillée des problèmes
- `MIGRATION-FILTRES-STATUS.md` - Guide de migration complet
- `CORRECTIONS-MODALS-APPLIQUEES.md` - Résumé des corrections

### Scripts Utiles
- `scripts/find-missing-status-filters.sh` - Trouver les fichiers à corriger
- `scripts/verify-and-fix-status-columns.sql` - Corriger la base de données

### Commandes Utiles

```bash
# Rechercher toutes les requêtes sans filtre status
grep -r "\.from('accommodations')" OTC-Chi-vres/ | grep -v "status"

# Vérifier la structure d'une table
# Dans Supabase SQL Editor :
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'accommodations';

# Compter les fiches par statut
SELECT status, COUNT(*) FROM accommodations GROUP BY status;
```

---

## 🎯 Résultat Final

Après avoir suivi toutes les étapes :

1. ✅ **Modals cohérents**
   - Pas de doublons de champs
   - Interface claire et intuitive

2. ✅ **Filtrage correct**
   - Seules les fiches `published` apparaissent sur le site
   - Les fiches `draft` et `archived` sont invisibles

3. ✅ **Synchronisation parfaite**
   - Édition admin → Affichage frontend
   - Suppression admin → Disparition frontend
   - Changement de statut → Visibilité mise à jour

4. ✅ **Code maintenable**
   - Mappings centralisés
   - Hooks réutilisables
   - Documentation complète

---

## 🎉 Félicitations !

Vous avez maintenant un système de gestion de contenu cohérent et fiable !

**Prochaines étapes suggérées :**
- Créer des tests automatisés
- Ajouter un dashboard de monitoring
- Documenter les workflows pour l'équipe
- Former les utilisateurs à l'utilisation des statuts
