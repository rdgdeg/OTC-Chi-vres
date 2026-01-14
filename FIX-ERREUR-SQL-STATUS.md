# 🔧 Fix : Erreur SQL lors de l'ajout des colonnes status

## ❌ Problèmes Rencontrés

### Erreur 1 : Column "status" does not exist

```
Error: Failed to run sql query: 
ERROR: 42703: column "status" does not exist
LINE 26: SELECT 'events', status, COUNT(*) ^
```

**Cause :** Le script original essayait de lire la colonne `status` avant qu'elle ne soit créée.

### Erreur 2 : Column "is_visible" does not exist

```
Error: Failed to run sql query: 
ERROR: 42703: column "is_visible" does not exist
CONTEXT: SQL statement "CREATE POLICY ... USING (status = 'published' AND (is_visible IS NULL OR is_visible = true))"
```

**Cause :** La table `team_members` n'a pas de colonne `is_visible`, mais le script essayait de l'utiliser dans une RLS policy.

---

## ✅ Solution

Un nouveau script **sécurisé** a été créé : `verify-and-fix-status-columns-safe.sql`

### Différences avec l'ancien script

| Ancien Script | Nouveau Script (Safe) |
|---------------|----------------------|
| ❌ Lit les colonnes avant création | ✅ Vérifie l'existence avant lecture |
| ❌ Erreur si colonne manquante | ✅ Gère les colonnes manquantes |
| ❌ UNION ALL avec tables mixtes | ✅ Utilise DO blocks conditionnels |

---

## 🚀 Utilisation du Nouveau Script

### Étape 1 : Ouvrir Supabase SQL Editor

1. Aller sur votre dashboard Supabase
2. Cliquer sur "SQL Editor" dans le menu de gauche
3. Cliquer sur "New query"

### Étape 2 : Copier le Script

Copier le contenu complet de :
```
OTC-Chi-vres/scripts/verify-and-fix-status-columns-safe.sql
```

### Étape 3 : Exécuter

1. Coller le script dans l'éditeur
2. Cliquer sur "Run" (ou Ctrl+Enter)
3. Attendre la fin de l'exécution

### Étape 4 : Vérifier les Résultats

Vous devriez voir dans les messages :

```
========================================
VÉRIFICATION DES VALEURS NULL
========================================
Accommodations avec status NULL: 0
Events avec status NULL: 0
Places avec status NULL: 0
✅ Aucune valeur NULL trouvée!

========================================
RÉSUMÉ DES MODIFICATIONS
========================================
Accommodations publiés: 12
Events publiés: 8
Places publiés: 25
========================================
Colonnes status ajoutées: ✅
Contraintes CHECK ajoutées: ✅
RLS Policies mises à jour: ✅
Index créés: ✅
========================================
Migration terminée avec succès! 🎉
```

---

## 🔍 Que Fait le Script ?

### 1. Vérification Initiale
- Liste les colonnes `status` existantes
- Identifie les tables qui en ont besoin

### 2. Ajout des Colonnes
- Ajoute `status VARCHAR(20) DEFAULT 'published'` à :
  - `accommodations`
  - `events`
  - `places`
  - `articles` (si existe)
  - `team_members` (si existe)

### 3. Mise à Jour des Données
- Met toutes les fiches existantes en `status='published'`
- Garantit qu'aucune fiche n'a `status=NULL`

### 4. Contraintes
- Ajoute des contraintes CHECK pour valider les statuts
- Seules les valeurs `'draft'`, `'published'`, `'archived'` sont acceptées

### 5. RLS Policies
- **Public** : Peut voir seulement les fiches `status='published'`
- **Admin** : Peut voir et modifier toutes les fiches

### 6. Index
- Crée des index sur `status` pour améliorer les performances
- Crée des index composites pour les requêtes fréquentes

### 7. Vérification Finale
- Vérifie que tout est en place
- Compte les fiches par statut
- Affiche un résumé

---

## 🧪 Tests Après Exécution

### Test 1 : Vérifier les Colonnes

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'accommodations' AND column_name = 'status';
```

**Résultat attendu :**
```
column_name | data_type      | column_default
status      | character varying | 'published'::character varying
```

### Test 2 : Vérifier les Données

```sql
SELECT status, COUNT(*) 
FROM accommodations 
GROUP BY status;
```

**Résultat attendu :**
```
status    | count
published | 12
```

### Test 3 : Vérifier les Contraintes

```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'accommodations' 
AND constraint_name LIKE '%status%';
```

**Résultat attendu :**
```
constraint_name
check_status_accommodations
```

### Test 4 : Vérifier les RLS Policies

```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'accommodations';
```

**Résultat attendu :**
```
policyname                              | cmd    | qual
Public can view published accommodations | SELECT | (status = 'published'::text)
Admins can manage all accommodations    | ALL    | true
```

---

## 🚨 En Cas de Problème

### Problème : "Permission denied"

**Solution :**
```sql
-- Vérifier que vous êtes connecté en tant qu'admin
SELECT current_user;

-- Si nécessaire, se connecter avec les droits admin
```

### Problème : "Table does not exist"

**Solution :**
```sql
-- Vérifier quelles tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('accommodations', 'events', 'places');

-- Le script gère automatiquement les tables manquantes
```

### Problème : "Constraint already exists"

**Solution :**
Le script vérifie l'existence avant de créer. Si l'erreur persiste :

```sql
-- Supprimer la contrainte existante
ALTER TABLE accommodations 
DROP CONSTRAINT IF EXISTS check_status_accommodations;

-- Puis réexécuter le script
```

### Problème : "Policy already exists"

**Solution :**
Le script supprime les policies existantes avant de les recréer (`DROP POLICY IF EXISTS`).

---

## ✅ Checklist de Validation

Après exécution du script, vérifier :

- [ ] Colonnes `status` ajoutées à toutes les tables
- [ ] Toutes les fiches ont `status='published'`
- [ ] Aucune fiche avec `status=NULL`
- [ ] Contraintes CHECK en place
- [ ] RLS Policies actives
- [ ] Index créés
- [ ] Pas d'erreurs dans les logs

---

## 🎯 Prochaines Étapes

Une fois le script exécuté avec succès :

1. **Tester dans l'admin**
   - Créer une fiche en draft
   - Vérifier qu'elle n'apparaît pas sur le site

2. **Exécuter le script de détection**
   ```bash
   cd OTC-Chi-vres
   bash scripts/find-missing-status-filters.sh
   ```

3. **Corriger les services**
   - Ajouter `.eq('status', 'published')` dans les services identifiés

4. **Tester le frontend**
   - Vérifier que seules les fiches published apparaissent

---

## 📚 Documentation Associée

- **GUIDE-RAPIDE-CORRECTIONS.md** : Guide complet pas-à-pas
- **MIGRATION-FILTRES-STATUS.md** : Migration des services
- **AUDIT-MODALS-EDITION.md** : Analyse détaillée

---

## 🎉 Résultat Final

Après exécution réussie :
- ✅ Base de données prête
- ✅ Colonnes status en place
- ✅ RLS Policies actives
- ✅ Prêt pour la migration des services

**Temps d'exécution :** ~5-10 secondes

**Prochaine étape :** Suivre le **GUIDE-RAPIDE-CORRECTIONS.md** à partir de l'étape 2 !
