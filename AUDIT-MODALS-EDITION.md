# Audit des Modals d'Édition - Analyse Complète

## 🎯 Objectif
Vérifier la cohérence de tous les modals d'édition, éliminer les doublons, et s'assurer que :
1. ✅ Une fiche éditable dans l'admin apparaît sur le frontend
2. ✅ Une fiche supprimable disparaît du frontend
3. ❌ Aucune fiche non-admin n'apparaît sur le site

---

## 📋 État Actuel des Modals

### 1. **EditItemModal.tsx** (Modal Principal)
**Rôle** : Modal universel qui charge les composants de champs spécifiques selon le type

#### Champs Communs (Tous types)
- ✅ `name` - Nom/Titre
- ✅ `status` - Statut (published/draft/archived)
- ✅ `description` - Description longue
- ✅ `excerpt` - Description courte
- ✅ `slug` - URL
- ✅ `address` - Adresse
- ✅ `phone` - Téléphone
- ✅ `email` - Email
- ✅ `website` - Site web
- ✅ `facebook` - Facebook
- ✅ `lat` / `lng` - Coordonnées GPS
- ✅ `featured_image` - Image principale
- ✅ `gallery_images` - Galerie d'images

#### Problèmes Identifiés
1. ⚠️ **Doublon Facebook** : Présent dans les champs communs ET dans AccommodationFields
2. ⚠️ **Doublon Image** : Upload d'image dans les champs communs ET dans AccommodationFields
3. ⚠️ **Mapping de tables incohérent** : Logique complexe pour déterminer la table
4. ⚠️ **Champs non synchronisés** : Certains champs ne sont pas sauvegardés correctement

---

### 2. **AccommodationFields.tsx** (Hébergements)

#### Champs Spécifiques
- ✅ `type` - Types multiples (bed_breakfast, gite, hotel, camping, unusual)
- ✅ `village` - Village (liste déroulante)
- ✅ `capacity` - Capacité en personnes
- ✅ `bedrooms` - Nombre de chambres
- ✅ `beds_description` - Description des lits
- ✅ `min_stay` - Séjour minimum
- ✅ `price_range` - Gamme de prix
- ✅ `price_details` - Détails des tarifs
- ✅ `check_in_time` - Heure d'arrivée
- ✅ `check_out_time` - Heure de départ
- ✅ `features` - Ce que vous aimerez (liste)
- ✅ `amenities` - Équipements (liste)
- ✅ `house_rules` - Règles de la maison (liste)
- ❌ `facebook` - **DOUBLON** (déjà dans champs communs)
- ❌ `featured_image` upload - **DOUBLON** (déjà dans champs communs)
- ✅ `cancellation_policy` - Politique d'annulation

#### Problèmes
- ⚠️ Doublons : Facebook et upload d'image
- ✅ Gestion correcte des types multiples (array)
- ✅ Gestion correcte des amenities (array)

---

### 3. **EventFields.tsx** (Événements)

#### Champs Spécifiques
- ✅ `start_date` - Date et heure de début (datetime-local)
- ✅ `end_date` - Date et heure de fin (datetime-local)
- ✅ `start_time` - Heure de début (time)
- ✅ `end_time` - Heure de fin (time)
- ✅ `location` - Lieu de l'événement
- ✅ `event_category` - Catégorie (Concert, Festival, etc.)
- ✅ `organizer` - Organisateur
- ✅ `entry_price` - Prix d'entrée
- ✅ `booking_link` - Lien de réservation
- ✅ `capacity` - Capacité (nombre de places)
- ✅ `practical_info` - Informations pratiques

#### Problèmes
- ⚠️ `location` vs `address` : Confusion possible
- ⚠️ `entry_price` vs `price` : Mapping à vérifier
- ✅ Pas de doublons majeurs

---

### 4. **WalkFields.tsx** (Balades)

#### Champs Spécifiques
- ✅ `distance` - Distance (ex: "5 km")
- ✅ `duration` - Durée estimée (ex: "1h30")
- ✅ `difficulty` - Difficulté (Facile/Moyen/Difficile)
- ✅ `walk_type` - Type (Boucle/Linéaire/Aller-retour)
- ✅ `elevation` - Dénivelé
- ✅ `starting_point` - Point de départ
- ✅ `gpx_file` - Fichier GPX
- ✅ `pdf_document` - Document PDF
- ✅ `accessibility` - Accessibilité
- ✅ `points_of_interest` - Points d'intérêt

#### Problèmes
- ⚠️ `starting_point` vs `address` : Confusion possible
- ⚠️ `gpx_file` vs `downloadUrl` : Mapping à vérifier
- ⚠️ `pdf_document` vs `documentUrl` : Mapping à vérifier
- ✅ Pas de doublons majeurs

---

### 5. **HeritageFields.tsx** (Patrimoine/Musées)

#### Champs Spécifiques
- ✅ `opening_hours` - Horaires d'ouverture (textarea)
- ✅ `price_adult` - Tarif adulte
- ✅ `price_child` - Tarif enfant
- ✅ `price_group` - Tarif groupe
- ✅ `visit_duration` - Durée de visite
- ✅ `historical_period` - Période historique (liste)
- ✅ `languages` - Langues disponibles (checkboxes)
- ✅ `guided_tours` - Visites guidées (boolean)
- ✅ `accessible_pmr` - Accessible PMR (boolean)
- ✅ `practical_info` - Informations pratiques

#### Problèmes
- ✅ Pas de doublons
- ✅ Champs bien structurés

---

### 6. **RestaurantFields.tsx** (Restaurants)

#### Champs Spécifiques
- ✅ `cuisine_type` - Type de cuisine (liste)
- ✅ `opening_hours` - Horaires d'ouverture (textarea)
- ✅ `price_range` - Gamme de prix (€ à €€€€)
- ✅ `capacity` - Capacité (couverts)
- ✅ `specialties` - Spécialités (textarea)
- ✅ `menu_pdf` - Lien vers le menu PDF
- ✅ `has_terrace` - Terrasse disponible (boolean)
- ✅ `has_parking` - Parking disponible (boolean)

#### Problèmes
- ✅ Pas de doublons
- ✅ Champs bien structurés

---

### 7. **BlogFields.tsx** (Blog/Articles)

#### Champs Spécifiques
- ✅ `title` - Titre de l'article
- ✅ `slug` - Slug (URL)
- ✅ `excerpt` / `summary` - Chapeau/Extrait
- ✅ `content` - Contenu complet (textarea grande)
- ✅ `category` / `category_id` - Catégorie
- ✅ `author` / `author_name` - Auteur
- ✅ `published_at` - Date de publication
- ✅ `view_count` - Nombre de vues (disabled)
- ✅ `tags` - Tags (séparés par virgules)
- ✅ `is_featured` - Article à la une (boolean)
- ✅ `allow_comments` - Autoriser les commentaires (boolean)

#### Problèmes
- ⚠️ `title` vs `name` : Confusion dans le mapping
- ⚠️ `excerpt` vs `summary` : Doublons de mapping
- ⚠️ `author` vs `author_name` : Doublons de mapping
- ⚠️ `category` vs `category_id` : Doublons de mapping
- ✅ Sinon bien structuré

---

### 8. **TeamFields.tsx** (Équipe)

#### Champs Spécifiques
- ✅ `role` / `position` - Fonction/Rôle (liste)
- ✅ `email` - Email professionnel
- ✅ `phone` - Téléphone
- ✅ `bio` / `description` - Biographie
- ✅ `skills` / `specialties` - Compétences
- ✅ `sort_order` / `display_order` - Ordre d'affichage
- ✅ `is_visible` - Visible sur le site (boolean)

#### Problèmes
- ⚠️ `role` vs `position` : Doublons de mapping
- ⚠️ `bio` vs `description` : Doublons de mapping
- ⚠️ `skills` vs `specialties` : Doublons de mapping
- ⚠️ `sort_order` vs `display_order` : Doublons de mapping
- ✅ Sinon bien structuré

---

## 🔍 Problèmes Critiques Identifiés

### 1. **Doublons de Champs**
| Champ | Où | Impact |
|-------|-----|--------|
| `facebook` | Communs + AccommodationFields | Confusion, doublon visuel |
| `featured_image` upload | Communs + AccommodationFields | Doublon d'interface |
| `title` vs `name` | Blog, Team | Mapping incohérent |
| `location` vs `address` | Events, Walks | Confusion |

### 2. **Mapping Incohérent**
- Blog : `title` / `name`, `excerpt` / `summary`, `author` / `author_name`
- Team : `role` / `position`, `bio` / `description`, `skills` / `specialties`
- Walks : `gpx_file` / `downloadUrl`, `pdf_document` / `documentUrl`

### 3. **Logique de Sauvegarde Complexe**
```typescript
// Dans EditItemModal.tsx - handleSave()
let tableName = 'places';
if (categoryId === 'accommodations') {
  tableName = 'accommodations';
} else if (categoryId === 'events') {
  tableName = 'events';
} else if (categoryId === 'team') {
  tableName = 'team_members';
} else if (categoryId === 'blog') {
  tableName = 'articles';
} else if (item.type === 'walk') {
  tableName = 'places';
}
```
⚠️ **Problème** : Logique fragile, risque d'erreurs

### 4. **Filtrage Frontend Manquant**
❌ **Problème Critique** : Aucun filtre sur `status` dans les requêtes frontend
- Les fiches avec `status='draft'` ou `status='archived'` apparaissent sur le site
- Seules les fiches `status='published'` devraient être visibles

---

## ✅ Solutions Proposées

### Solution 1 : Nettoyer les Doublons

#### A. Supprimer Facebook et Image Upload de AccommodationFields
```typescript
// AccommodationFields.tsx - SUPPRIMER ces sections :
// - Section Facebook (ligne ~280)
// - Section Image principale (ligne ~200)
```

#### B. Standardiser les Mappings
```typescript
// Créer un fichier de mapping centralisé
export const FIELD_MAPPINGS = {
  blog: {
    title: 'title',
    excerpt: 'excerpt',
    author: 'author'
  },
  team: {
    role: 'role',
    bio: 'bio',
    skills: 'skills',
    sort_order: 'sort_order'
  },
  walks: {
    gpx_file: 'gpx_file',
    pdf_document: 'pdf_document'
  }
};
```

### Solution 2 : Simplifier la Logique de Table

```typescript
// Créer un service centralisé
export const TABLE_MAPPING = {
  accommodations: 'accommodations',
  events: 'events',
  team: 'team_members',
  blog: 'articles',
  walks: 'places', // avec filter type='walk'
  dining: 'places', // avec filter type IN ('restaurant','cafe','bar')
  heritage: 'places', // avec filter type IN ('museum','monument','heritage')
  activities: 'places' // avec filter type IN ('activity','experience')
};
```

### Solution 3 : Filtrer par Statut sur le Frontend

#### A. Modifier tous les services de récupération
```typescript
// Dans tous les services (accommodationService, eventService, etc.)
const { data, error } = await supabase
  .from(tableName)
  .select('*')
  .eq('status', 'published') // ⭐ AJOUTER CETTE LIGNE
  .order('created_at', { ascending: false });
```

#### B. Créer un hook réutilisable
```typescript
// hooks/usePublishedContent.ts
export const usePublishedContent = (table: string, filters = {}) => {
  return useQuery({
    queryKey: [table, 'published', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq('status', 'published') // Toujours filtrer
        .match(filters);
      return data;
    }
  });
};
```

### Solution 4 : Validation Stricte

```typescript
// Ajouter une validation avant sauvegarde
const validateItem = (item: ContentItem): string[] => {
  const errors: string[] = [];
  
  // Champs requis
  if (!item.name && !item.title) {
    errors.push('Le nom/titre est requis');
  }
  
  // Statut valide
  if (!['draft', 'published', 'archived'].includes(item.status)) {
    errors.push('Statut invalide');
  }
  
  // Validation spécifique par type
  if (item.type === 'accommodation' && !item.village) {
    errors.push('Le village est requis pour les hébergements');
  }
  
  return errors;
};
```

---

## 📊 Plan d'Action

### Phase 1 : Nettoyage Immédiat (Urgent)
1. ✅ Supprimer les doublons Facebook et Image dans AccommodationFields
2. ✅ Ajouter le filtre `status='published'` dans TOUS les services frontend
3. ✅ Tester que les fiches draft/archived n'apparaissent plus

### Phase 2 : Standardisation (Important)
4. ✅ Créer un fichier de mapping centralisé
5. ✅ Uniformiser les noms de champs (title vs name, etc.)
6. ✅ Simplifier la logique de détermination de table

### Phase 3 : Amélioration (Souhaitable)
7. ✅ Créer un hook usePublishedContent réutilisable
8. ✅ Ajouter une validation stricte avant sauvegarde
9. ✅ Ajouter des tests pour vérifier la cohérence

---

## 🧪 Tests de Validation

### Test 1 : Édition et Affichage
```
1. Créer une fiche hébergement avec status='published'
2. Vérifier qu'elle apparaît sur /accommodations
3. Modifier la fiche dans l'admin
4. Vérifier que les modifications apparaissent sur le frontend
```

### Test 2 : Suppression
```
1. Supprimer une fiche depuis l'admin
2. Vérifier qu'elle disparaît immédiatement du frontend
3. Vérifier qu'elle n'apparaît plus dans les listes
```

### Test 3 : Statuts
```
1. Créer une fiche avec status='draft'
2. Vérifier qu'elle N'apparaît PAS sur le frontend
3. Changer le statut en 'published'
4. Vérifier qu'elle apparaît maintenant
5. Changer le statut en 'archived'
6. Vérifier qu'elle disparaît à nouveau
```

### Test 4 : Doublons
```
1. Éditer un hébergement
2. Vérifier qu'il n'y a qu'UN SEUL champ Facebook
3. Vérifier qu'il n'y a qu'UN SEUL upload d'image principale
```

---

## 📝 Checklist de Vérification

### Modals
- [ ] EditItemModal : Pas de doublons dans les champs communs
- [ ] AccommodationFields : Facebook et Image supprimés
- [ ] EventFields : Mapping location/address clarifié
- [ ] WalkFields : Mapping gpx_file/downloadUrl clarifié
- [ ] HeritageFields : OK, pas de modifications
- [ ] RestaurantFields : OK, pas de modifications
- [ ] BlogFields : Mapping title/name standardisé
- [ ] TeamFields : Mapping role/position standardisé

### Services Frontend
- [ ] accommodationService : Filtre status='published'
- [ ] eventService : Filtre status='published'
- [ ] walkService : Filtre status='published'
- [ ] placeService : Filtre status='published'
- [ ] articleService : Filtre status='published'
- [ ] teamService : Filtre status='published'

### Tests
- [ ] Test édition → affichage
- [ ] Test suppression → disparition
- [ ] Test status draft → invisible
- [ ] Test status published → visible
- [ ] Test status archived → invisible
- [ ] Test pas de doublons visuels

---

## 🎯 Résultat Attendu

Après corrections :
1. ✅ Une fiche `status='published'` dans l'admin apparaît sur le site
2. ✅ Une fiche `status='draft'` ou `status='archived'` N'apparaît PAS sur le site
3. ✅ Une fiche supprimée disparaît immédiatement du site
4. ✅ Pas de doublons de champs dans les modals
5. ✅ Mapping cohérent entre admin et frontend
6. ✅ Logique de table simplifiée et maintenable
