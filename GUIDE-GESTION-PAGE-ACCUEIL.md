# Guide de Gestion de la Page d'Accueil

Ce guide explique comment utiliser les nouvelles fonctionnalités de gestion de la page d'accueil et de la newsletter.

## 🎯 Fonctionnalités Implémentées

### 1. Gestion de la Bannière d'Information
- ✅ Modification du message principal et des détails
- ✅ Activation/désactivation de la bannière
- ✅ Option pour permettre à l'utilisateur de fermer la bannière
- ✅ Différents types de bannières (annonce, info, succès, avertissement, erreur)

### 2. Gestion du Contenu Hero (Section Principale)
- ✅ Modification du titre et sous-titre
- ✅ Changement de l'image de fond
- ✅ Modification de la description
- ✅ Personnalisation du bouton d'action (texte et lien)
- ✅ Support vidéo de fond (optionnel)

### 3. Gestion des Actualités
- ✅ Création, modification et suppression d'actualités
- ✅ Gestion des images, catégories et temps de lecture
- ✅ Publication/dépublication
- ✅ Mise en avant d'actualités
- ✅ Réorganisation de l'ordre d'affichage

### 4. Gestion des Coups de Cœur
- ✅ Ajout, modification et suppression de coups de cœur
- ✅ Gestion des images et descriptions
- ✅ Liens vers des pages spécifiques
- ✅ Activation/désactivation
- ✅ Ordre d'affichage personnalisable

### 5. Gestion de la Newsletter
- ✅ Inscription automatique depuis le site
- ✅ Gestion complète des abonnements dans l'admin
- ✅ Statistiques détaillées (total, actifs, désabonnés, rebonds)
- ✅ Recherche et filtrage des abonnements
- ✅ Export des emails actifs
- ✅ Ajout manuel d'abonnements
- ✅ Gestion des statuts (actif, désabonné, rebond)

## 🚀 Installation et Configuration

### 1. Migration de la Base de Données

Exécutez la migration pour créer les nouvelles tables :

```bash
cd OTC-Chi-vres
node scripts/run-homepage-migration.js
```

### 2. Variables d'Environnement

Assurez-vous que ces variables sont définies dans votre `.env.local` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_publique
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
```

### 3. Politiques RLS (Row Level Security)

Les politiques suivantes sont automatiquement créées :

- **Lecture publique** : Contenu publié accessible à tous
- **Inscription newsletter** : Tout le monde peut s'inscrire
- **Gestion admin** : Utilisateurs authentifiés peuvent tout gérer

## 📱 Utilisation dans l'Admin

### Accès aux Fonctionnalités

1. **Contenu Accueil** : Gestion complète du contenu de la page d'accueil
2. **Newsletter** : Gestion des abonnements et statistiques

### Gestion du Contenu de la Page d'Accueil

#### Onglet "Bannière d'info"
- Modifiez le message principal et les détails
- Activez/désactivez la bannière
- Configurez si elle peut être fermée par l'utilisateur

#### Onglet "Section Hero"
- Changez l'image de fond (upload ou URL)
- Modifiez le titre et sous-titre
- Personnalisez la description
- Configurez le bouton d'action

#### Onglet "Actualités"
- Créez de nouvelles actualités avec titre, extrait, image
- Gérez les catégories et temps de lecture
- Publiez/dépubliez selon vos besoins
- Mettez en avant les actualités importantes

#### Onglet "Coups de cœur"
- Ajoutez des sites emblématiques
- Gérez les images et descriptions
- Configurez les liens vers d'autres pages
- Réorganisez l'ordre d'affichage

### Gestion de la Newsletter

#### Tableau de Bord
- Visualisez les statistiques en temps réel
- Total des abonnements, actifs, désabonnés, rebonds
- Inscriptions des 30 derniers jours

#### Liste des Abonnements
- Recherchez par email ou nom
- Filtrez par statut (actif, désabonné, rebond)
- Modifiez les statuts individuellement
- Supprimez les abonnements indésirables

#### Fonctionnalités Avancées
- Exportez la liste des emails actifs (format CSV)
- Ajoutez manuellement des abonnements
- Gérez les tags et métadonnées (fonctionnalité future)

## 🔧 Structure Technique

### Tables de Base de Données

#### `newsletter_subscriptions`
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- name (TEXT, optionnel)
- status (active|unsubscribed|bounced)
- source (website|admin|import)
- tags (TEXT[])
- metadata (JSONB)
- subscribed_at, unsubscribed_at, created_at, updated_at
```

#### `homepage_content`
```sql
- id (TEXT, PK)
- section (banner|hero|newsletter)
- title, subtitle, content
- image_url, cta_text, cta_url
- settings (JSONB)
- is_active, sort_order
- updated_by, created_at, updated_at
```

#### `homepage_news`
```sql
- id (UUID, PK)
- title, excerpt, content
- image_url, category, read_time
- is_featured, is_published
- published_at, sort_order
- created_by, updated_by, created_at, updated_at
```

#### `homepage_favorites`
```sql
- id (UUID, PK)
- title, description
- image_url, link_url
- is_active, sort_order
- created_by, updated_by, created_at, updated_at
```

### Services

#### `homepageService.ts`
- Gestion complète du contenu de la page d'accueil
- CRUD pour bannière, hero, actualités, coups de cœur
- Réorganisation et gestion des statuts

#### `newsletterService.ts`
- Inscription et désabonnement
- Gestion des abonnements (CRUD)
- Statistiques et export
- Recherche et filtrage

### Composants

#### `HomepageContentManager.tsx`
- Interface admin pour gérer tout le contenu
- Onglets pour chaque section
- Formulaires de modification en temps réel

#### `NewsletterManager.tsx`
- Tableau de bord des abonnements
- Statistiques visuelles
- Gestion complète des abonnements

#### Composants Frontend Mis à Jour
- `InfoBanner.tsx` : Bannière d'information dynamique
- `HomeHero.tsx` : Section hero avec contenu dynamique
- `NewsSection.tsx` : Actualités depuis la base de données
- `FavoritesSection.tsx` : Coups de cœur dynamiques
- `NewsletterSection.tsx` : Inscription avec sauvegarde en BDD

## 🎨 Personnalisation

### Styles et Thèmes
- Tous les composants utilisent Tailwind CSS
- Classes personnalisables dans chaque composant
- Support des thèmes sombres/clairs (à implémenter)

### Types de Bannières
- `announcement` : Bannière d'annonce (bleu par défaut)
- `success` : Succès (vert)
- `warning` : Avertissement (jaune)
- `error` : Erreur (rouge)
- `info` : Information (bleu clair)

### Catégories d'Actualités
- Culture
- Événement
- Nature
- Patrimoine
- Actualité (par défaut)

## 🔒 Sécurité

### Politiques RLS
- Lecture publique pour le contenu publié uniquement
- Inscription newsletter ouverte à tous
- Gestion admin réservée aux utilisateurs authentifiés

### Validation des Données
- Validation email côté client et serveur
- Sanitisation des entrées utilisateur
- Gestion des erreurs robuste

## 📈 Monitoring et Analytics

### Métriques Disponibles
- Nombre total d'abonnements newsletter
- Taux de croissance des abonnements
- Statistiques par source d'inscription
- Activité récente (30 derniers jours)

### Logs et Audit
- Toutes les modifications sont tracées
- Historique des changements de statut
- Métadonnées d'inscription (source, date, etc.)

## 🚀 Prochaines Améliorations

### Fonctionnalités Prévues
- [ ] Envoi d'emails newsletter
- [ ] Templates d'emails personnalisables
- [ ] Segmentation des abonnés par tags
- [ ] A/B testing pour les contenus
- [ ] Analytics avancées
- [ ] Import/export CSV complet
- [ ] API REST pour intégrations externes
- [ ] Webhooks pour événements newsletter

### Optimisations Techniques
- [ ] Cache Redis pour les contenus fréquents
- [ ] CDN pour les images
- [ ] Compression d'images automatique
- [ ] Lazy loading des composants admin
- [ ] PWA pour l'interface admin

## 🆘 Dépannage

### Problèmes Courants

#### La migration échoue
```bash
# Vérifiez les variables d'environnement
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Exécutez manuellement dans Supabase SQL Editor
```

#### Les inscriptions newsletter ne fonctionnent pas
1. Vérifiez les politiques RLS dans Supabase
2. Contrôlez les logs de la console navigateur
3. Testez la connexion à la base de données

#### Le contenu ne se met pas à jour
1. Vérifiez les permissions utilisateur
2. Contrôlez les erreurs dans la console
3. Rafraîchissez le cache du navigateur

### Support
Pour toute question ou problème, consultez :
1. Les logs de la console navigateur
2. Les logs Supabase dans le dashboard
3. La documentation Supabase officielle

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2026  
**Compatibilité** : React 18+, Supabase, Tailwind CSS 3+