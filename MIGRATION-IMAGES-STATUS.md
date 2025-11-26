# État de la Migration - Upload d'Images

## ✅ Terminé

### Pages migrées vers EditableImage
1. **Page Équipe** (`pages/Team.tsx`)
   - ✅ Upload d'images pour chaque membre
   - ✅ Sauvegarde dans Supabase Storage
   - ✅ Mise à jour de la base de données

2. **Page Musées** (`pages/Museums.tsx`)
   - ✅ Remplacement de la génération IA par EditableImage
   - ✅ Upload d'images principales
   - ✅ Sauvegarde dans Supabase Storage

### Composants créés
- ✅ `EditableImage` - Composant d'édition inline
- ✅ `EditableHero` - Hero éditable
- ✅ `ImageUploader` - Upload multiple (existait déjà)

### Services
- ✅ `imageUploadService.ts` - Service d'upload amélioré avec logs

## ⏳ À faire

### Pages à migrer

#### 1. Page Restaurants/Dining (`pages/Dining.tsx`)
- Utilise le composant `Card`
- Nécessite une version éditable du Card ou intégration directe

#### 2. Page Hébergements (`pages/Accommodation.tsx`)
- Utilise probablement le composant `Card`
- Même approche que Dining

#### 3. Page Commerçants (`pages/Merchants.tsx`)
- Utilise le composant `Card`
- Même approche que Dining

#### 4. Page Balades (`pages/Walks.tsx`)
- Utilise le composant `Card`
- Même approche que Dining

#### 5. Page Expériences (`pages/Experiences.tsx`)
- Structure à vérifier
- Intégrer EditableImage

#### 6. Page Agenda/Événements (`pages/Agenda.tsx`)
- Structure à vérifier
- Intégrer EditableImage

#### 7. Page Boutique (`pages/Shop.tsx`)
- Structure à vérifier
- Intégrer EditableImage

#### 8. Page Blog (`pages/Blog.tsx`)
- Structure à vérifier
- Intégrer EditableImage

#### 9. Page Home (`pages/Home.tsx`)
- Hero image éditable
- Sections avec images

### Hero Images
- ⏳ Remplacer tous les `<Hero>` par `<EditableHero>` avec callback d'update
- Pages concernées : toutes les pages principales

### Composant Card
Deux options :
1. **Option A** : Créer `EditableCard` qui accepte un callback `onImageUpdate`
2. **Option B** : Modifier `Card` pour accepter un prop `editable` optionnel

## 📋 Plan d'action recommandé

### Phase 1 : Composant Card éditable
```tsx
// Créer EditableCard.tsx ou modifier Card.tsx
<Card 
  place={place}
  editable={true}
  onImageUpdate={async (newUrl) => {
    await updateItem(place.type, { ...place, imageUrl: newUrl });
  }}
/>
```

### Phase 2 : Migrer les pages utilisant Card
- Dining
- Accommodation
- Merchants
- Walks

### Phase 3 : Migrer les pages avec structure custom
- Experiences
- Agenda
- Shop
- Blog

### Phase 4 : Hero images
- Remplacer tous les Hero par EditableHero
- Ajouter callbacks pour updatePageContent

## 🎯 Objectif final

Toutes les images de l'application doivent pouvoir être :
1. ✅ Uploadées depuis l'interface
2. ✅ Sauvegardées dans Supabase Storage
3. ✅ Mises à jour dans la base de données
4. ✅ Affichées immédiatement après l'upload

## 📊 Progression

- **Composants** : 3/3 (100%)
- **Pages migrées** : 2/10 (20%)
- **Hero images** : 0/10 (0%)

**Total** : ~15% complété

## 🚀 Prochaine étape

Créer `EditableCard` pour permettre l'édition d'images sur toutes les pages utilisant le composant Card (Dining, Accommodation, Merchants, Walks).
