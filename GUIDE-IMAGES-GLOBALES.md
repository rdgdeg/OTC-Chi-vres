# Guide - Gestion Globale des Images

## Vue d'ensemble

Toutes les images de l'application peuvent maintenant être modifiées et enregistrées dans Supabase Storage. Il existe deux méthodes principales :

### 1. EditableImage (Édition inline simple)
Pour les images individuelles qui peuvent être modifiées directement sur la page.

### 2. ImageUploader (Galeries multiples)
Pour les galeries d'images avec upload multiple.

## Composant EditableImage

### Utilisation de base

```tsx
import EditableImage from '../components/EditableImage';

<EditableImage
  src={item.imageUrl}
  alt={item.name}
  onImageUpdate={async (newUrl) => {
    await updateItem('type', { ...item, imageUrl: newUrl });
  }}
  folder="museums"
  aspectRatio="video"
/>
```

### Props

- `src`: URL de l'image actuelle
- `alt`: Texte alternatif
- `onImageUpdate`: Callback async appelé avec la nouvelle URL
- `folder`: Dossier dans Supabase Storage (ex: 'museums', 'team', 'events')
- `aspectRatio`: 'square' | 'video' | 'wide' | 'auto'
- `editable`: true/false (défaut: true)
- `className`: Classes CSS additionnelles

### Exemples par page

#### Page Équipe (✅ Déjà implémenté)
```tsx
<EditableImage
  src={member.imageUrl}
  alt={member.name}
  onImageUpdate={(newUrl) => handleImageUpdate(member.id, newUrl)}
  folder="team"
  aspectRatio="square"
/>
```

#### Page Musées
```tsx
<EditableImage
  src={museum.imageUrl}
  alt={museum.name}
  onImageUpdate={async (newUrl) => {
    await updateItem('museum', { ...museum, imageUrl: newUrl });
  }}
  folder="museums"
  aspectRatio="video"
/>
```

#### Page Restaurants
```tsx
<EditableImage
  src={restaurant.imageUrl}
  alt={restaurant.name}
  onImageUpdate={async (newUrl) => {
    await updateItem('restaurant', { ...restaurant, imageUrl: newUrl });
  }}
  folder="restaurants"
  aspectRatio="square"
/>
```

#### Page Événements
```tsx
<EditableImage
  src={event.imageUrl}
  alt={event.title}
  onImageUpdate={async (newUrl) => {
    await updateItem('event', { ...event, imageUrl: newUrl });
  }}
  folder="events"
  aspectRatio="video"
/>
```

#### Page Hébergements
```tsx
<EditableImage
  src={hotel.imageUrl}
  alt={hotel.name}
  onImageUpdate={async (newUrl) => {
    await updateItem('hotel', { ...hotel, imageUrl: newUrl });
  }}
  folder="hotels"
  aspectRatio="wide"
/>
```

#### Hero Images (Pages)
```tsx
<EditableImage
  src={pageContent.heroImage}
  alt="Hero"
  onImageUpdate={async (newUrl) => {
    await updatePageContent(pageId, { ...pageContent, heroImage: newUrl });
  }}
  folder="heroes"
  aspectRatio="wide"
  className="h-96"
/>
```

## Composant ImageUploader

Pour les galeries d'images multiples (déjà existant).

### Utilisation

```tsx
import ImageUploader from '../components/ImageUploader';

<ImageUploader
  currentImages={museum.galleryImages || []}
  onImagesChange={(newImages) => {
    updateItem('museum', { ...museum, galleryImages: newImages });
  }}
  maxImages={10}
  folder="museums/gallery"
  label="Galerie du musée"
/>
```

## Organisation des dossiers dans Supabase Storage

```
images/
├── team/           # Photos de l'équipe
├── museums/        # Images principales des musées
├── restaurants/    # Images des restaurants
├── hotels/         # Images des hébergements
├── events/         # Images des événements
├── products/       # Images des produits boutique
├── heroes/         # Images hero des pages
├── walks/          # Images des balades
├── merchants/      # Images des commerçants
└── general/        # Images diverses
```

## Migration des pages existantes

### Étape 1 : Importer EditableImage
```tsx
import EditableImage from '../components/EditableImage';
```

### Étape 2 : Remplacer les balises <img>
Avant :
```tsx
<img src={item.imageUrl} alt={item.name} className="..." />
```

Après :
```tsx
<EditableImage
  src={item.imageUrl}
  alt={item.name}
  onImageUpdate={async (newUrl) => {
    await updateItem('type', { ...item, imageUrl: newUrl });
  }}
  folder="type"
  className="..."
/>
```

### Étape 3 : Tester
1. Survolez l'image
2. Cliquez sur "Modifier l'image"
3. Sélectionnez une nouvelle image
4. Vérifiez que l'image est uploadée et sauvegardée

## Fonctionnalités

✅ Upload vers Supabase Storage
✅ Validation de taille (max 5 Mo)
✅ Validation de type (images uniquement)
✅ Indicateur de chargement
✅ Gestion d'erreur avec messages explicites
✅ Fallback sur image par défaut en cas d'erreur
✅ Logs détaillés dans la console
✅ Aspect ratio configurable
✅ Mode éditable/non-éditable

## Dépannage

### L'upload ne fonctionne pas
1. Vérifiez que le bucket `images` existe dans Supabase Storage
2. Vérifiez que le bucket est PUBLIC
3. Exécutez `VERIFY-STORAGE-POLICIES.sql`
4. Vérifiez les logs dans la console (F12)

### L'image ne se met pas à jour
1. Vérifiez que `onImageUpdate` est bien async
2. Vérifiez que la fonction met à jour la base de données
3. Vérifiez que l'état local est mis à jour après la sauvegarde

### Erreur "policy already exists"
C'est normal ! Les politiques existent déjà. Votre storage est configuré.

## Prochaines étapes

Pour activer l'édition d'images sur toutes les pages :

1. ✅ Page Équipe (fait)
2. ⏳ Page Musées
3. ⏳ Page Restaurants
4. ⏳ Page Hébergements
5. ⏳ Page Événements
6. ⏳ Page Commerçants
7. ⏳ Page Balades
8. ⏳ Page Expériences
9. ⏳ Page Boutique
10. ⏳ Hero images de toutes les pages

## Exemple complet : Page Museums

```tsx
// Dans le render de chaque musée
<div className="w-full lg:w-1/2">
  <EditableImage
    src={museum.imageUrl}
    alt={museum.name}
    onImageUpdate={async (newUrl) => {
      await updateItem('museum', { ...museum, imageUrl: newUrl });
    }}
    folder="museums"
    aspectRatio="video"
    className="rounded-xl shadow-xl"
  />
  
  {/* Galerie additionnelle */}
  <ImageUploader
    currentImages={museum.galleryImages || []}
    onImagesChange={(newImages) => {
      updateItem('museum', { ...museum, galleryImages: newImages });
    }}
    maxImages={10}
    folder="museums/gallery"
    label="Galerie"
  />
</div>
```

## Notes importantes

- Toutes les images sont stockées dans Supabase Storage (pas de stockage local)
- Les URLs sont publiques et accessibles directement
- Les anciennes images ne sont pas automatiquement supprimées (à gérer manuellement si nécessaire)
- Pour la production, pensez à restreindre les politiques RLS
