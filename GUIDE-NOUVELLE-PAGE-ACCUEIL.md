# Guide - Nouvelle Page d'Accueil

## Vue d'ensemble

La page d'accueil a été entièrement repensée selon vos spécifications pour offrir une expérience utilisateur moderne et engageante.

## Nouvelles Sections Implémentées

### 1. Bande d'Information Défilante
- **Composant**: `InfoBanner.tsx`
- **Fonctionnalité**: Affiche des informations exceptionnelles en haut de page
- **Exemple**: "Fermeture du bureau le 11 novembre (férié)"
- **Options**: 
  - Type d'annonce (info, warning, announcement)
  - Possibilité de fermer l'annonce
  - Animation subtile

### 2. Section Intro avec Vidéo/Photo
- **Composant**: `HomeHero.tsx`
- **Contenu**: 
  - Vidéo ou photo de Chièvres en arrière-plan
  - Texte d'accueil avec le crosseur comme emblème
  - Message de bienvenue personnalisé
  - Contrôles vidéo (play/pause, son)
  - Boutons d'action principaux

### 3. Section Actualités
- **Composant**: `NewsSection.tsx`
- **Fonctionnalité**: 
  - Affiche 2-3 articles récents
  - Photo + titre + description courte
  - Catégories et temps de lecture
  - Lien vers toutes les actualités

### 4. Planifiez votre Visite
- **Composant**: `PlanYourVisitSection.tsx`
- **Liens vers**:
  - Où dormir
  - Boire et Manger
  - Agenda
- **Design**: Cartes interactives avec icônes colorées

### 5. Nos Coups de Cœur
- **Composant**: `FavoritesSection.tsx`
- **Contenu**: Photos des sites emblématiques de l'entité
- **Exemples**: 
  - Église Saint-Martin
  - Le Crossage al'tonne
  - Château de Ladeuze
  - Sentiers de randonnée
  - Place Charles II
  - Musée de la Vie Rurale

### 6. Section Newsletter
- **Composant**: `NewsletterSection.tsx`
- **Fonctionnalité**:
  - Formulaire d'inscription
  - Validation email
  - Messages de confirmation/erreur
  - Design moderne avec gradient

### 7. Réseaux Sociaux
- **Composant**: `SocialSection.tsx`
- **Contenu**:
  - Liens vers Facebook et Instagram
  - Message d'encouragement à suivre
  - Boutons stylisés aux couleurs des réseaux

## Structure des Fichiers

```
components/
├── InfoBanner.tsx          # Bande d'info défilante
├── HomeHero.tsx           # Hero section avec vidéo
├── NewsSection.tsx        # Section actualités
├── PlanYourVisitSection.tsx # Planification visite
├── FavoritesSection.tsx   # Coups de cœur
├── NewsletterSection.tsx  # Newsletter
└── SocialSection.tsx      # Réseaux sociaux

pages/
└── Home.tsx              # Page d'accueil mise à jour
```

## Personnalisation

### Modifier la Bande d'Information
```tsx
<InfoBanner 
  message="Votre message ici"
  type="announcement" // info, warning, announcement
  dismissible={true}
/>
```

### Ajouter des Actualités
Modifiez le tableau `newsItems` dans `NewsSection.tsx` :
```tsx
const newsItems = [
  {
    id: 1,
    title: "Titre de l'actualité",
    excerpt: "Description courte...",
    image: "url-de-l-image",
    date: "Date",
    category: "Catégorie",
    readTime: "Temps de lecture"
  }
];
```

### Modifier les Coups de Cœur
Éditez le tableau `favorites` dans `FavoritesSection.tsx` avec vos propres sites.

## Responsive Design

Toutes les sections sont entièrement responsives :
- **Mobile First**: Optimisé pour les petits écrans
- **Tablette**: Adaptation automatique
- **Desktop**: Mise en page étendue

## Accessibilité

- Contrôles clavier
- Textes alternatifs pour les images
- Contrastes respectés
- Tailles de touch targets optimisées

## Prochaines Étapes

1. **Remplacer les images placeholder** par vos vraies photos
2. **Ajouter la vraie vidéo** dans `/public/videos/chievres-intro.mp4`
3. **Connecter la newsletter** à votre service d'emailing
4. **Mettre à jour les liens** des réseaux sociaux
5. **Personnaliser les actualités** avec votre contenu

## Support Technique

Les composants utilisent :
- **React 19** avec TypeScript
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **React Router** pour la navigation

Tous les composants sont modulaires et peuvent être facilement modifiés ou réutilisés ailleurs dans l'application.