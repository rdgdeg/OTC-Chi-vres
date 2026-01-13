# Guide du Tri Universel par Glisser-Déposer

## Vue d'ensemble

Le système de tri universel permet de réorganiser l'ordre d'affichage de tous les types de contenu sur le site par simple glisser-déposer dans l'interface d'administration.

## Fonctionnalités

### Types de contenu supportés
- ✅ **Hébergements** (accommodations)
- ✅ **Lieux par type** (places: musées, restaurants, cafés, activités, balades)
- ✅ **Événements** (events)
- ✅ **Équipe** (team_members)
- ✅ **Blocs de page d'accueil** (homepage_blocks)

### Interface d'administration

#### Accès au tri
1. Aller dans l'admin → Gestion du Contenu
2. Sélectionner une catégorie (ex: "Où dormir")
3. Cliquer sur l'icône de tri (↕️) dans la barre d'outils
4. Utiliser l'interface de glisser-déposer

#### Fonctionnalités de l'interface de tri
- **Glisser-déposer** : Réorganiser les éléments par drag & drop
- **Flèches** : Déplacer précisément un élément vers le haut/bas
- **Sauvegarde** : Appliquer les changements en base de données
- **Réinitialisation** : Remettre l'ordre alphabétique
- **Statistiques** : Voir le nombre d'éléments avec/sans ordre défini

## Architecture technique

### Base de données

#### Colonne sort_order
Chaque table supportée possède une colonne `sort_order` :
```sql
sort_order INTEGER DEFAULT 0
```

#### Index pour les performances
```sql
CREATE INDEX idx_[table]_sort_order ON [table](sort_order);
```

#### Triggers automatiques
Des triggers assignent automatiquement un `sort_order` aux nouveaux éléments.

### Services

#### UniversalSortService
Service principal pour la gestion du tri :
- `getSortedItems(tableKey)` : Récupère les éléments triés
- `updateSortOrder(tableKey, itemId, newOrder)` : Met à jour l'ordre d'un élément
- `reorderItems(tableKey, orderedItemIds)` : Réorganise complètement
- `resetToAlphabeticalOrder(tableKey)` : Remet l'ordre alphabétique

#### Configuration des tables
```typescript
const tableConfigs = {
  accommodations: {
    tableName: 'accommodations',
    nameField: 'name'
  },
  'places-museum': {
    tableName: 'places',
    nameField: 'name',
    filterField: 'type',
    filterValue: 'museum'
  }
  // ...
};
```

### Frontend

#### Composants
- `UniversalSortManager` : Interface de tri par glisser-déposer
- `SimpleCategoryManager` : Intégration dans l'admin

#### Mise à jour des requêtes
Tous les services utilisent maintenant `sort_order` :
```typescript
.order('sort_order', { ascending: true, nullsFirst: false })
.order('name') // Fallback alphabétique
```

## Installation et configuration

### 1. Appliquer la migration
```bash
cd OTC-Chi-vres
node scripts/apply-universal-sort-migration-safe.js
```

### 2. Vérifier l'installation
La migration ajoute :
- Colonnes `sort_order` aux tables
- Index pour les performances
- Triggers pour les nouveaux éléments
- Initialisation des ordres existants

### 3. Tester le système
1. Aller dans l'admin
2. Sélectionner une catégorie
3. Activer la vue de tri
4. Réorganiser quelques éléments
5. Sauvegarder et vérifier sur le site public

## Utilisation

### Pour les administrateurs

#### Réorganiser une catégorie
1. **Accéder au tri** : Admin → Catégorie → Icône tri (↕️)
2. **Glisser-déposer** : Faire glisser les éléments dans l'ordre souhaité
3. **Sauvegarder** : Cliquer sur "Sauvegarder l'ordre"
4. **Vérifier** : L'ordre est immédiatement visible sur le site

#### Réinitialiser l'ordre
1. Dans l'interface de tri
2. Cliquer sur "Ordre alphabétique"
3. Confirmer l'action
4. L'ordre alphabétique est restauré

#### Gérer les éléments sans ordre
Si des éléments n'ont pas d'ordre défini :
1. Un bouton "Initialiser les ordres manquants" apparaît
2. Cliquer pour assigner automatiquement des ordres
3. Les nouveaux éléments sont placés à la fin

### Pour les développeurs

#### Ajouter le support d'une nouvelle table
1. **Ajouter la configuration** dans `UniversalSortService` :
```typescript
'ma-table': {
  tableName: 'ma_table',
  nameField: 'title'
}
```

2. **Ajouter la colonne** en base :
```sql
ALTER TABLE ma_table ADD COLUMN sort_order INTEGER DEFAULT 0;
CREATE INDEX idx_ma_table_sort_order ON ma_table(sort_order);
```

3. **Mettre à jour les requêtes** du service correspondant :
```typescript
.order('sort_order', { ascending: true, nullsFirst: false })
.order('title')
```

#### Personnaliser l'interface
Le composant `UniversalSortManager` accepte des props :
- `onItemEdit` : Callback pour éditer un élément
- `onItemView` : Callback pour voir un élément
- `title` : Titre personnalisé
- `description` : Description personnalisée

## Dépannage

### Problèmes courants

#### La colonne sort_order n'existe pas
```bash
# Réappliquer la migration sécurisée
node scripts/apply-universal-sort-migration-safe.js
```

#### L'ordre ne se sauvegarde pas
1. Vérifier les permissions Supabase
2. Vérifier les politiques RLS
3. Consulter la console pour les erreurs

#### Les nouveaux éléments n'ont pas d'ordre
1. Vérifier que les triggers sont créés
2. Utiliser "Initialiser les ordres manquants"

### Vérification de l'état
```javascript
// Dans la console du navigateur
import UniversalSortService from './services/admin/UniversalSortService';

// Vérifier une table
const stats = await UniversalSortService.getSortStats('accommodations');
console.log(stats);

// Tester la récupération triée
const items = await UniversalSortService.getSortedItems('accommodations');
console.log(items);
```

## Impact sur le site public

### Ordre d'affichage
Tous les éléments sont maintenant affichés selon leur `sort_order` :
1. Éléments avec `sort_order` défini (ordre croissant)
2. Éléments sans `sort_order` (ordre alphabétique)

### Performance
- Index sur `sort_order` pour des requêtes rapides
- Pas d'impact sur les performances existantes
- Fallback alphabétique si `sort_order` est null

### Compatibilité
- Compatible avec tous les filtres existants
- Compatible avec la recherche
- Compatible avec la pagination

## Évolutions futures

### Fonctionnalités prévues
- [ ] Tri par catégories multiples
- [ ] Sauvegarde de configurations de tri
- [ ] Historique des modifications d'ordre
- [ ] API pour le tri programmatique

### Améliorations possibles
- Interface de tri en lot
- Prévisualisation avant sauvegarde
- Tri conditionnel par critères
- Export/import de configurations

## Support

Pour toute question ou problème :
1. Consulter ce guide
2. Vérifier les logs de la console
3. Tester avec le script de diagnostic
4. Contacter l'équipe de développement

---

*Guide mis à jour le 13 janvier 2026*