# Guide des Modifications - Page d'Accueil

## 📋 Résumé des Modifications

La page d'accueil a été simplifiée et connectée aux données de l'administration pour permettre une gestion complète du contenu.

## ✅ Modifications Effectuées

### 1. Bannière d'Accueil Simplifiée

**Avant :**
- Vidéo avec contrôles play/pause
- Logo du crosseur
- Texte complexe avec plusieurs éléments

**Après :**
- Photo fixe éditable depuis l'admin
- Texte simplifié et personnalisable :
  - Titre : "Bienvenue à Chièvres"
  - Sous-titre : "La cité des aviateurs vous accueille"
  - Description : "Découvrez une commune riche en histoire..."
- Deux boutons d'action : "Découvrir Chièvres" et "Voir l'agenda"

**Fichier modifié :** `components/HomeHero.tsx`

### 2. Section Actualités & Agenda

**Avant :**
- Données fictives (mock data)
- Actualités depuis `homepage_news`
- Événements en dur

**Après :**
- Données réelles depuis l'administration
- **Onglet "Actualités"** : Articles du blog (table `blog`)
- **Onglet "Agenda"** : Événements (table `events`)
- Affichage des 3 derniers éléments de chaque catégorie
- Liens vers les pages complètes

**Fichiers modifiés :**
- `components/AgendaNewsSection.tsx`
- `services/contentService.ts` (nouveau)

### 3. Gestionnaire Admin pour la Bannière

**Nouveau composant :** `components/admin/HomeBannerManager.tsx`

**Fonctionnalités :**
- Upload d'image de fond (max 5MB)
- Édition du titre principal
- Édition du sous-titre
- Édition du texte descriptif
- Aperçu en temps réel
- Sauvegarde dans la base de données

**Accès :** Admin Dashboard → "Page d'accueil"

## 🗄️ Structure de la Base de Données

### Table `homepage_content`

La bannière utilise l'enregistrement avec `section = 'hero'` :

```sql
{
  id: 'hero-main',
  section: 'hero',
  title: 'Bienvenue à Chièvres',
  subtitle: 'La cité des aviateurs vous accueille',
  content: 'Découvrez une commune riche en histoire...',
  image_url: 'https://...',
  is_active: true
}
```

### Table `events`

Événements affichés dans l'onglet "Agenda" :

```sql
{
  id: uuid,
  title: string,
  description: text,
  date: date,
  time: string,
  location: string,
  image_url: string,
  category: string,
  status: 'published'
}
```

### Table `blog`

Articles affichés dans l'onglet "Actualités" :

```sql
{
  id: uuid,
  title: string,
  excerpt: text,
  content: text,
  image_url: string,
  category: string,
  author: string,
  read_time: string,
  is_featured: boolean,
  status: 'published',
  published_at: timestamp
}
```

## 🎨 Utilisation

### Pour Modifier la Bannière d'Accueil

1. Connectez-vous à l'admin : `/admin-dashboard`
2. Cliquez sur "Page d'accueil" dans le menu
3. Modifiez les champs :
   - **Image de fond** : Cliquez sur "Choisir une image" (1920x1080px recommandé)
   - **Titre principal** : Le titre principal affiché
   - **Sous-titre** : Le sous-titre en jaune
   - **Texte descriptif** : La description sous le titre
4. Visualisez l'aperçu en bas de page
5. Cliquez sur "Enregistrer"
6. Rafraîchissez la page d'accueil pour voir les changements

### Pour Gérer les Actualités

1. Allez dans Admin Dashboard → "Contenu"
2. Sélectionnez "Blog" dans la liste
3. Créez/modifiez des articles
4. Assurez-vous que le statut est "published"
5. Les 3 derniers articles apparaîtront automatiquement sur la page d'accueil

### Pour Gérer l'Agenda

1. Allez dans Admin Dashboard → "Contenu"
2. Sélectionnez "Événements" dans la liste
3. Créez/modifiez des événements
4. Assurez-vous que le statut est "published"
5. Les 3 prochains événements apparaîtront automatiquement sur la page d'accueil

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `services/contentService.ts` - Service pour gérer événements et blog
- `components/admin/HomeBannerManager.tsx` - Gestionnaire de bannière d'accueil

### Fichiers Modifiés
- `components/HomeHero.tsx` - Bannière simplifiée avec photo fixe
- `components/AgendaNewsSection.tsx` - Connexion aux vraies données
- `components/admin/SimpleAdminDashboard.tsx` - Ajout du gestionnaire de bannière

## 🔄 Flux de Données

```
Page d'Accueil
├── HomeHero
│   └── homepageService.getHero()
│       └── Table: homepage_content (section='hero')
│
└── AgendaNewsSection
    └── contentService.getHomePageContent()
        ├── getUpcomingEvents() → Table: events (status='published')
        └── getLatestBlogPosts() → Table: blog (status='published')
```

## ✨ Avantages

1. **Simplicité** : Bannière épurée, facile à comprendre
2. **Éditable** : Tout le contenu est modifiable depuis l'admin
3. **Données réelles** : Plus de données fictives, tout vient de la BDD
4. **Cohérence** : Utilise les mêmes tables que le reste du site
5. **Performance** : Pas de vidéo lourde à charger
6. **Responsive** : S'adapte à tous les écrans

## 🎯 Prochaines Étapes Possibles

- [ ] Ajouter un carrousel d'images pour la bannière
- [ ] Permettre de choisir le nombre d'articles/événements affichés
- [ ] Ajouter des filtres par catégorie
- [ ] Créer une page dédiée pour chaque article/événement
- [ ] Ajouter des statistiques de vues

## 📝 Notes Techniques

- Les images sont stockées dans Supabase Storage (`images/banners/`)
- Le service `contentService` filtre automatiquement par statut "published"
- Les événements sont triés par date (les plus proches en premier)
- Les articles sont triés par date de publication (les plus récents en premier)
- Limite de 3 éléments par onglet pour la page d'accueil
