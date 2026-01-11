# 🏠 Guide - Nouvelle page hébergements avec carte

## ✅ Réalisations

### 1. Structure identique à la page gastronomie
- **Hero section** avec titre et sous-titre personnalisés
- **Onglets de navigation** par type d'hébergement (Gîtes, B&B, Insolite, Hôtels, Campings)
- **Filtres par village** avec boutons interactifs
- **Carte interactive** affichant tous les hébergements
- **Grille de fiches** avec design cohérent

### 2. Composant AccommodationCard créé
- **Design moderne** avec image, badges et informations
- **Caractéristiques "Ce que vous aimerez"** affichées
- **Contact direct** : téléphone, email, site web, Facebook
- **Édition d'images** pour les administrateurs
- **Responsive** et optimisé mobile

### 3. Page Accommodations refactorisée
- **Navigation par onglets** : Gîtes, B&B, Insolite, Hôtels, Campings
- **Filtrage par village** : Tous, Chièvres, Vaudignies, Ladeuze, etc.
- **Carte interactive** intégrée avec InteractiveMap
- **Permissions admin** pour édition des images
- **Compteur de vues** automatique

## 🎯 Fonctionnalités

### Navigation
```
Gîtes (par défaut) → 7 hébergements
B&B → 3 hébergements  
Insolite → 1 hébergement (yacht)
Hôtels → 0 hébergement
Campings → 0 hébergement
```

### Filtres par village
- Tous (affiche tout)
- Chièvres (2 hébergements)
- Vaudignies (1 hébergement)
- Ladeuze (2 hébergements)
- Tongre-Saint-Martin (1 hébergement)
- Tongre-Notre-Dame (1 hébergement)
- Grosage (2 hébergements)

### Carte interactive
- **Marqueurs** pour chaque hébergement avec image
- **Popup** avec informations de base
- **Géolocalisation** (si coordonnées disponibles)
- **Zoom automatique** sur la région

## 📝 Actions requises

### 1. Ajouter les images (OBLIGATOIRE)
Exécuter dans le SQL Editor de Supabase :

```sql
-- Copier le contenu du fichier scripts/add-images-manual.sql
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1001/600/400' WHERE id = 'la-loge-bed-breakfast';
UPDATE accommodations SET featured_image = 'https://picsum.photos/id/1002/600/400' WHERE id = 'au-sentier-chauchaut';
-- ... (voir le fichier complet)
```

### 2. Vérifier les coordonnées GPS (optionnel)
Pour améliorer la carte, ajouter les coordonnées lat/lng dans l'admin.

### 3. Tester la page
1. Aller sur http://localhost:5173/hebergements
2. Tester les onglets de navigation
3. Tester les filtres par village
4. Vérifier l'affichage de la carte
5. Cliquer sur les fiches pour voir les détails

## 🔧 Administration

### Édition complète dans l'admin
L'AccommodationEditor permet de modifier :
- ✅ **Nom et slug**
- ✅ **Description complète et excerpt**
- ✅ **Type et capacité**
- ✅ **Adresse et village**
- ✅ **Contact** : téléphone, email, site web, Facebook
- ✅ **Caractéristiques** "Ce que vous aimerez" (ajout/suppression)
- ✅ **Équipements** et règles de la maison
- ✅ **Tarifs et horaires**
- ✅ **Image principale** avec upload
- ✅ **SEO** : meta title et description
- ✅ **Statut** : brouillon/publié

### Accès admin
- **Direct** : Menu "Hébergements"
- **Via gestion** : "Gestion du Contenu" → Hébergements

## 📊 État actuel

```
✅ Structure de page identique à gastronomie
✅ 9 hébergements avec contenu complet
✅ Composant AccommodationCard fonctionnel
✅ Navigation par onglets et filtres
✅ Carte interactive intégrée
✅ Admin complet pour édition
⏳ Images à ajouter via SQL
⏳ Coordonnées GPS optionnelles
```

## 🎉 Résultat

La page hébergements a maintenant exactement la même structure que la page gastronomie :
- Hero avec titre personnalisé
- Navigation par onglets (types d'hébergements)
- Filtres par village
- Carte interactive
- Grille de fiches avec images et informations complètes
- Administration complète pour tout modifier

Il ne reste qu'à exécuter le script SQL pour ajouter les images et la page sera parfaitement fonctionnelle !