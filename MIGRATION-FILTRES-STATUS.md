# Migration : Ajout des Filtres de Statut

## 🎯 Objectif
Ajouter le filtre `status='published'` dans TOUS les services frontend pour garantir que seules les fiches publiées apparaissent sur le site.

---

## 📋 Services à Modifier

### 1. **accommodationService.ts**

#### Avant
```typescript
const { data, error } = await supabase
  .from('accommodations')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Après
```typescript
const { data, error } = await supabase
  .from('accommodations')
  .select('*')
  .eq('status', 'published') // ⭐ AJOUT CRITIQUE
  .order('created_at', { ascending: false });
```

---

### 2. **eventService.ts**

#### Avant
```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .gte('start_date', new Date().toISOString())
  .order('start_date', { ascending: true });
```

#### Après
```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'published') // ⭐ AJOUT CRITIQUE
  .gte('start_date', new Date().toISOString())
  .order('start_date', { ascending: true });
```

---

### 3. **Services utilisant la table `places`**

Pour les balades, restaurants, patrimoine, etc. qui utilisent la table `places` :

#### Avant
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .in('type', ['restaurant', 'cafe', 'bar'])
  .order('name', { ascending: true });
```

#### Après
```typescript
const { data, error } = await supabase
  .from('places')
  .select('*')
  .eq('status', 'published') // ⭐ AJOUT CRITIQUE
  .in('type', ['restaurant', 'cafe', 'bar'])
  .order('name', { ascending: true });
```

---

### 4. **articleService.ts / blogService.ts**

#### Avant
```typescript
const { data, error } = await supabase
  .from('articles')
  .select('*')
  .order('published_at', { ascending: false });
```

#### Après
```typescript
const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('status', 'published') // ⭐ AJOUT CRITIQUE
  .order('published_at', { ascending: false });
```

---

### 5. **teamService.ts**

#### Avant
```typescript
const { data, error } = await supabase
  .from('team_members')
  .select('*')
  .order('sort_order', { ascending: true });
```

#### Après
```typescript
const { data, error } = await supabase
  .from('team_members')
  .select('*')
  .eq('status', 'published') // ⭐ AJOUT CRITIQUE
  .eq('is_visible', true) // Filtre supplémentaire pour l'équipe
  .order('sort_order', { ascending: true });
```

---

## 🔍 Fichiers à Vérifier

### Services
- [ ] `services/accommodationService.ts`
- [ ] `services/eventService.ts`
- [ ] `services/placeService.ts` (ou équivalent)
- [ ] `services/walkService.ts`
- [ ] `services/articleService.ts`
- [ ] `services/teamService.ts`
- [ ] `services/museumService.ts`
- [ ] `services/restaurantService.ts`

### Composants qui font des requêtes directes
- [ ] `components/AccommodationCard.tsx`
- [ ] `components/EventsCalendar.tsx`
- [ ] `components/WalksList.tsx`
- [ ] `components/MuseumPatrimoineManager.tsx`
- [ ] `pages/Accommodations.tsx`
- [ ] `pages/Dining.tsx`
- [ ] `pages/Heritage.tsx`
- [ ] `pages/Walks.tsx`
- [ ] `pages/Events.tsx`

---

## 🛠️ Script de Migration Automatique

Créer un script pour rechercher et remplacer automatiquement :

```bash
#!/bin/bash
# scripts/add-status-filters.sh

# Rechercher tous les fichiers avec des requêtes Supabase
echo "Recherche des fichiers à modifier..."

# Trouver les requêtes sans filtre status
grep -r "\.from('accommodations')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ | \
  grep -v "status" | \
  grep -v "node_modules"

grep -r "\.from('events')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ | \
  grep -v "status" | \
  grep -v "node_modules"

grep -r "\.from('places')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ | \
  grep -v "status" | \
  grep -v "node_modules"

grep -r "\.from('articles')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ | \
  grep -v "status" | \
  grep -v "node_modules"

grep -r "\.from('team_members')" OTC-Chi-vres/services/ OTC-Chi-vres/components/ OTC-Chi-vres/pages/ | \
  grep -v "status" | \
  grep -v "node_modules"

echo "Vérification terminée. Modifiez manuellement les fichiers listés ci-dessus."
```

---

## ✅ Utilisation du Hook usePublishedContent

### Exemple : Remplacer une requête manuelle

#### Avant
```typescript
const [accommodations, setAccommodations] = useState([]);

useEffect(() => {
  const fetchAccommodations = async () => {
    const { data } = await supabase
      .from('accommodations')
      .select('*')
      .order('name');
    
    setAccommodations(data || []);
  };
  
  fetchAccommodations();
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

**Avantages** :
- ✅ Filtre automatique sur `status='published'`
- ✅ Gestion automatique du loading et des erreurs
- ✅ Refetch facile
- ✅ Code plus propre et maintenable

---

## 🧪 Tests de Validation

### Test 1 : Vérifier qu'aucune fiche draft n'apparaît
```sql
-- Dans Supabase SQL Editor
-- Créer une fiche de test en draft
INSERT INTO accommodations (name, type, village, status)
VALUES ('Test Draft', ARRAY['gite'], 'Chièvres', 'draft');

-- Vérifier qu'elle n'apparaît PAS sur le site
-- Aller sur /accommodations et confirmer qu'elle est invisible
```

### Test 2 : Vérifier qu'une fiche publiée apparaît
```sql
-- Changer le statut en published
UPDATE accommodations
SET status = 'published'
WHERE name = 'Test Draft';

-- Vérifier qu'elle apparaît MAINTENANT sur le site
-- Rafraîchir /accommodations et confirmer qu'elle est visible
```

### Test 3 : Vérifier qu'une fiche archivée disparaît
```sql
-- Archiver la fiche
UPDATE accommodations
SET status = 'archived'
WHERE name = 'Test Draft';

-- Vérifier qu'elle disparaît du site
-- Rafraîchir /accommodations et confirmer qu'elle est invisible
```

---

## 📊 Checklist de Migration

### Phase 1 : Préparation
- [x] Créer `services/contentMappings.ts`
- [x] Créer `hooks/usePublishedContent.ts`
- [ ] Créer le script de recherche `scripts/add-status-filters.sh`
- [ ] Exécuter le script pour identifier tous les fichiers

### Phase 2 : Migration des Services
- [ ] Modifier `services/accommodationService.ts`
- [ ] Modifier `services/eventService.ts`
- [ ] Modifier `services/placeService.ts`
- [ ] Modifier `services/walkService.ts`
- [ ] Modifier `services/articleService.ts`
- [ ] Modifier `services/teamService.ts`

### Phase 3 : Migration des Composants
- [ ] Vérifier `components/AccommodationCard.tsx`
- [ ] Vérifier `components/EventsCalendar.tsx`
- [ ] Vérifier `components/WalksList.tsx`
- [ ] Vérifier tous les composants de liste

### Phase 4 : Migration des Pages
- [ ] Modifier `pages/Accommodations.tsx`
- [ ] Modifier `pages/Dining.tsx`
- [ ] Modifier `pages/Heritage.tsx`
- [ ] Modifier `pages/Walks.tsx`
- [ ] Modifier `pages/Events.tsx`

### Phase 5 : Tests
- [ ] Test 1 : Fiche draft invisible
- [ ] Test 2 : Fiche published visible
- [ ] Test 3 : Fiche archived invisible
- [ ] Test 4 : Édition admin → affichage frontend
- [ ] Test 5 : Suppression admin → disparition frontend

### Phase 6 : Documentation
- [ ] Mettre à jour le README
- [ ] Documenter l'utilisation de usePublishedContent
- [ ] Créer un guide pour les développeurs

---

## 🚨 Points d'Attention

### 1. Tables sans colonne `status`
Certaines tables peuvent ne pas avoir de colonne `status`. Vérifier :
```sql
-- Vérifier la structure de chaque table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'accommodations';
```

Si la colonne n'existe pas, l'ajouter :
```sql
ALTER TABLE accommodations 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
```

### 2. Données existantes
Toutes les fiches existantes doivent avoir un statut :
```sql
-- Mettre à jour les fiches sans statut
UPDATE accommodations 
SET status = 'published' 
WHERE status IS NULL;

UPDATE events 
SET status = 'published' 
WHERE status IS NULL;

UPDATE places 
SET status = 'published' 
WHERE status IS NULL;
```

### 3. RLS Policies
Vérifier que les RLS policies autorisent la lecture des fiches publiées :
```sql
-- Policy pour la lecture publique
CREATE POLICY "Public can view published content"
ON accommodations FOR SELECT
USING (status = 'published');
```

---

## 📝 Exemple Complet de Migration

### Fichier : `services/accommodationService.ts`

#### Avant
```typescript
import { supabase } from './supabaseClient';

export const getAccommodations = async () => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const getAccommodationById = async (id: string) => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
```

#### Après
```typescript
import { supabase } from './supabaseClient';

export const getAccommodations = async () => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('status', 'published') // ⭐ AJOUT
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const getAccommodationById = async (id: string) => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .eq('status', 'published') // ⭐ AJOUT
    .single();

  if (error) throw error;
  return data;
};

// Nouvelle fonction pour l'admin (sans filtre status)
export const getAccommodationByIdAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};
```

---

## 🎯 Résultat Final

Après migration complète :
1. ✅ Toutes les requêtes frontend filtrent sur `status='published'`
2. ✅ Les fiches draft/archived sont invisibles sur le site
3. ✅ L'admin peut voir toutes les fiches (tous statuts)
4. ✅ Code maintenable avec hooks réutilisables
5. ✅ Tests de validation passent
