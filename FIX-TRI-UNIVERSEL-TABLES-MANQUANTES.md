# Fix - Tables manquantes pour le tri universel

## Problème identifié

Certaines tables référencées dans la migration n'existent pas dans votre base de données :
- ❌ `walks` (les balades sont dans `places` avec `type='walk'`)
- ❌ `team_members` (table équipe non créée)

## Solution immédiate

J'ai créé des scripts adaptés à votre structure de base de données :

### 1. Découvrir votre structure de base

```bash
cd OTC-Chi-vres
node scripts/discover-database-structure.js
```

Ce script va :
- ✅ Identifier toutes les tables existantes
- ✅ Compter les enregistrements
- ✅ Vérifier si `sort_order` existe déjà
- ✅ Analyser les types dans la table `places`

### 2. Appliquer la migration minimale

```bash
cd OTC-Chi-vres
node scripts/apply-minimal-sort-migration.js
```

Ce script va :
- ✅ Ne traiter que les tables existantes
- ✅ Ajouter `sort_order` aux tables principales
- ✅ Initialiser les ordres pour les éléments existants
- ✅ Tester le fonctionnement

## Tables supportées (après correction)

| Catégorie | Table | Type | Statut |
|-----------|-------|------|--------|
| Hébergements | accommodations | - | ✅ |
| Musées | places | type='museum' | ✅ |
| Restaurants | places | type='restaurant' | ✅ |
| Cafés | places | type='cafe' | ✅ |
| Activités | places | type='activity' | ✅ |
| Balades | places | type='walk' | ✅ |
| Événements | events | - | ✅ (si existe) |

## Interface d'administration

L'interface a été adaptée :
- ✅ Catégories "Équipe" et "Pages" temporairement désactivées
- ✅ Tri disponible pour les catégories existantes
- ✅ Gestion automatique des tables manquantes

## Utilisation

1. **Exécuter la découverte** pour voir vos tables
2. **Appliquer la migration minimale** pour les tables existantes
3. **Tester dans l'admin** : Aller dans une catégorie → Cliquer sur l'icône tri (↕️)

## Si vous voulez ajouter les tables manquantes

### Créer la table team_members

```sql
CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT,
    phone TEXT,
    bio TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_members_sort_order ON team_members(sort_order);
```

Puis réactiver la catégorie "Équipe" dans `SimpleCategoryManager.tsx`.

## Résultat attendu

Après la migration minimale :
- ✅ Tri par glisser-déposer fonctionne pour les hébergements
- ✅ Tri par glisser-déposer fonctionne pour tous les types de lieux (musées, restaurants, etc.)
- ✅ Tri par glisser-déposer fonctionne pour les événements (si la table existe)
- ✅ Interface admin adaptée aux tables disponibles

---

**Prochaine étape** : Exécutez `node scripts/discover-database-structure.js` pour voir votre structure exacte.