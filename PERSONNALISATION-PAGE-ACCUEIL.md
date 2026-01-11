# Guide de Personnalisation - Page d'Accueil

## Configuration Centralisée

Toute la configuration de la page d'accueil se trouve dans le fichier :
**`/data/homePageConfig.ts`**

## Sections Personnalisables

### 1. Bande d'Information

```typescript
infoBanner: {
  message: "Votre message d'information",
  type: "announcement", // "info", "warning", "announcement"
  dismissible: true,     // Peut être fermée par l'utilisateur
  enabled: true          // Afficher ou masquer la bande
}
```

**Pour désactiver** la bande d'information, changez `enabled: false`.

### 2. Section Hero (Vidéo/Photo d'accueil)

```typescript
hero: {
  title: "Bienvenue à Chièvres,",
  subtitle: "la Cité des Aviateurs !",
  description: [
    "Premier paragraphe...",
    "Deuxième paragraphe...",
    "Troisième paragraphe..."
  ],
  backgroundImage: "URL de l'image de fond",
  videoUrl: "/videos/chievres-intro.mp4",
  buttons: {
    primary: { text: "Découvrir Chièvres", link: "/musees" },
    secondary: { text: "Voir l'agenda", link: "/agenda" }
  }
}
```

**Pour ajouter votre vidéo** :
1. Placez le fichier vidéo dans `/public/videos/`
2. Mettez à jour `videoUrl` avec le bon chemin

### 3. Section Actualités

```typescript
news: {
  title: "Actualités",
  subtitle: "Description de la section",
  items: [
    {
      id: 1,
      title: "Titre de l'actualité",
      excerpt: "Description courte (2-3 lignes)",
      image: "URL de l'image",
      date: "Date de publication",
      category: "Catégorie",
      readTime: "Temps de lecture"
    }
    // Ajoutez d'autres actualités...
  ]
}
```

**Recommandations** :
- Maximum 3 actualités affichées
- Images de 400x300px recommandées
- Descriptions de 2-3 lignes maximum

### 4. Coups de Cœur (Sites Emblématiques)

```typescript
favorites: {
  title: "Nos coups de cœur",
  subtitle: "Description des sites",
  items: [
    {
      id: 1,
      title: "Nom du site",
      image: "URL de l'image",
      description: "Description courte"
    }
    // Ajoutez d'autres sites...
  ]
}
```

**Recommandations** :
- Images de 600x400px recommandées
- 6 sites maximum pour un affichage optimal
- Descriptions courtes et impactantes

### 5. Newsletter

```typescript
newsletter: {
  title: "Inscrivez-vous à notre newsletter",
  subtitle: "Message d'encouragement",
  buttonText: "S'inscrire",
  successMessage: "Message de confirmation",
  errorMessage: "Message d'erreur",
  disclaimer: "Texte légal"
}
```

### 6. Réseaux Sociaux

```typescript
social: {
  title: "Suivez-nous !",
  subtitle: "Message d'encouragement",
  links: {
    facebook: "https://facebook.com/votre-page",
    instagram: "https://instagram.com/votre-compte"
  }
}
```

## Modification des Images

### Images Actuelles (Placeholder)
Toutes les images utilisent actuellement des placeholders de Picsum. 

### Remplacer par Vos Images

1. **Placez vos images** dans `/public/images/`
2. **Mettez à jour les URLs** dans `homePageConfig.ts`

Exemple :
```typescript
// Au lieu de :
image: "https://picsum.photos/id/1041/600/400"

// Utilisez :
image: "/images/eglise-saint-martin.jpg"
```

### Tailles Recommandées

- **Hero background** : 1920x1080px
- **Actualités** : 400x300px
- **Coups de cœur** : 600x400px
- **Format** : JPG ou WebP pour de meilleures performances

## Fonctionnalités Avancées

### Désactiver une Section

Pour masquer temporairement une section, commentez-la dans `/pages/Home.tsx` :

```tsx
{/* Section temporairement désactivée */}
{/* <NewsSection /> */}
```

### Ajouter une Nouvelle Section

1. Créez un nouveau composant dans `/components/`
2. Importez-le dans `/pages/Home.tsx`
3. Ajoutez-le à l'endroit souhaité

### Modifier l'Ordre des Sections

Réorganisez simplement les composants dans `/pages/Home.tsx` :

```tsx
<div>
  <InfoBanner />
  <HomeHero />
  <PlanYourVisitSection />  {/* Déplacé avant les actualités */}
  <NewsSection />
  <FavoritesSection />
  <NewsletterSection />
  <SocialSection />
</div>
```

## Intégration avec le CMS

Le système est prêt pour une intégration CMS future :
- Les données sont centralisées dans `homePageConfig.ts`
- Structure compatible avec une base de données
- Possibilité d'ajouter une interface d'administration

## Support et Maintenance

### Fichiers Principaux
- **Configuration** : `/data/homePageConfig.ts`
- **Page principale** : `/pages/Home.tsx`
- **Composants** : `/components/[NomSection].tsx`

### Sauvegarde
Avant toute modification importante, sauvegardez :
- `homePageConfig.ts`
- Dossier `/components/`
- Vos images personnalisées

### Tests
Après chaque modification :
1. Vérifiez l'affichage sur mobile
2. Testez les liens et boutons
3. Validez les performances de chargement