# Test de la Page d'Accueil Modifiée

## 🎯 Objectif

Vérifier que toutes les modifications de la page d'accueil fonctionnent correctement.

## 📋 Checklist de Test

### 1. Préparation de la Base de Données

```bash
# Exécuter le script d'initialisation dans Supabase
# Aller dans SQL Editor et exécuter :
```

```sql
-- Vérifier que la table homepage_content existe
SELECT * FROM homepage_content WHERE section = 'hero';

-- Si aucun résultat, exécuter le script d'initialisation
-- Copier/coller le contenu de migrations/init-home-banner.sql
```

### 2. Test de la Bannière d'Accueil (Frontend)

#### ✅ Affichage par Défaut

1. Ouvrir la page d'accueil : `http://localhost:5173/`
2. Vérifier que la bannière affiche :
   - ✅ Une image de fond (pas de vidéo)
   - ✅ Titre : "Bienvenue à Chièvres"
   - ✅ Sous-titre : "La cité des aviateurs vous accueille"
   - ✅ Description complète
   - ✅ Deux boutons : "Découvrir Chièvres" et "Voir l'agenda"
   - ✅ Indicateur de scroll en bas

#### ✅ Responsive

1. Tester sur mobile (DevTools → Toggle device toolbar)
2. Vérifier que :
   - ✅ Le texte est lisible
   - ✅ Les boutons sont accessibles
   - ✅ L'image s'adapte correctement

### 3. Test de la Section Actualités & Agenda

#### ✅ Onglet Actualités

1. Scroller jusqu'à "Actualités & Agenda"
2. Vérifier l'onglet "Actualités" :
   - ✅ Affiche les articles du blog (table `blog`)
   - ✅ Maximum 3 articles
   - ✅ Chaque article affiche :
     - Image
     - Catégorie
     - Temps de lecture
     - Titre
     - Extrait
     - Date de publication
     - Lien "Lire la suite"
   - ✅ Si aucun article : Message "Aucun article disponible"

#### ✅ Onglet Agenda

1. Cliquer sur l'onglet "Agenda"
2. Vérifier :
   - ✅ Affiche les événements (table `events`)
   - ✅ Maximum 3 événements
   - ✅ Chaque événement affiche :
     - Image
     - Date (calendrier en haut à droite)
     - Titre
     - Date et heure
     - Lieu
     - Description
     - Catégorie
     - Lien "Détails" ou "En savoir plus"
   - ✅ Si aucun événement : Message "Aucun événement à venir"

#### ✅ Boutons d'Action

1. Vérifier les boutons en bas :
   - ✅ "Tous les articles" → Redirige vers `/blog`
   - ✅ "Agenda complet" → Redirige vers `/agenda`

### 4. Test du Gestionnaire Admin

#### ✅ Accès au Gestionnaire

1. Se connecter à l'admin : `http://localhost:5173/admin-dashboard`
2. Vérifier que :
   - ✅ Le menu affiche "Page d'accueil" en premier
   - ✅ Cliquer dessus charge le gestionnaire de bannière

#### ✅ Chargement des Données

1. Vérifier que le formulaire affiche :
   - ✅ L'image actuelle (si définie)
   - ✅ Le titre actuel
   - ✅ Le sous-titre actuel
   - ✅ Le contenu actuel
   - ✅ Un aperçu en bas de page

#### ✅ Upload d'Image

1. Cliquer sur "Choisir une image"
2. Sélectionner une image (< 5MB)
3. Vérifier :
   - ✅ Message "Image téléchargée avec succès"
   - ✅ L'aperçu se met à jour
   - ✅ Le bouton "Supprimer l'image" apparaît

#### ✅ Modification du Texte

1. Modifier le titre : "Test Titre"
2. Modifier le sous-titre : "Test Sous-titre"
3. Modifier le contenu : "Test contenu"
4. Vérifier :
   - ✅ L'aperçu se met à jour en temps réel

#### ✅ Sauvegarde

1. Cliquer sur "Enregistrer"
2. Vérifier :
   - ✅ Message "Bannière mise à jour avec succès"
   - ✅ Le bouton affiche "Enregistrement..." pendant le processus

#### ✅ Vérification Frontend

1. Retourner sur la page d'accueil
2. Rafraîchir la page (F5)
3. Vérifier :
   - ✅ Les modifications sont visibles
   - ✅ L'image a changé
   - ✅ Les textes sont mis à jour

### 5. Test des Services

#### ✅ Service contentService

Ouvrir la console du navigateur et tester :

```javascript
// Importer le service
import { contentService } from './services/contentService';

// Tester les événements
const events = await contentService.getUpcomingEvents(3);
console.log('Événements:', events);

// Tester les articles
const posts = await contentService.getLatestBlogPosts(3);
console.log('Articles:', posts);

// Tester le contenu complet
const content = await contentService.getHomePageContent();
console.log('Contenu page d\'accueil:', content);
```

#### ✅ Service homepageService

```javascript
// Importer le service
import { homepageService } from './services/homepageService';

// Tester le hero
const hero = await homepageService.getHero();
console.log('Hero:', hero);
```

### 6. Test de Performance

#### ✅ Temps de Chargement

1. Ouvrir DevTools → Network
2. Rafraîchir la page d'accueil
3. Vérifier :
   - ✅ Temps de chargement total < 3s
   - ✅ Images optimisées
   - ✅ Pas d'erreurs 404

#### ✅ Console

1. Ouvrir DevTools → Console
2. Vérifier :
   - ✅ Pas d'erreurs JavaScript
   - ✅ Pas d'avertissements critiques

## 🐛 Problèmes Courants

### La bannière n'affiche pas l'image

**Solution :**
1. Vérifier que l'URL de l'image est valide
2. Vérifier les permissions Supabase Storage
3. Vérifier la console pour les erreurs CORS

### Les actualités/événements ne s'affichent pas

**Solution :**
1. Vérifier que des données existent dans les tables `blog` et `events`
2. Vérifier que le statut est "published"
3. Vérifier les dates (événements futurs uniquement)

### Erreur lors de la sauvegarde

**Solution :**
1. Vérifier la connexion à Supabase
2. Vérifier les permissions RLS sur la table `homepage_content`
3. Vérifier la console pour les erreurs détaillées

### L'aperçu ne se met pas à jour

**Solution :**
1. Vérifier que React détecte les changements d'état
2. Rafraîchir la page admin
3. Vérifier la console pour les erreurs

## ✅ Validation Finale

- [ ] La bannière affiche une photo fixe
- [ ] Le texte est personnalisable depuis l'admin
- [ ] Les actualités proviennent de la table `blog`
- [ ] L'agenda provient de la table `events`
- [ ] Tout est responsive
- [ ] Pas d'erreurs dans la console
- [ ] Les performances sont bonnes
- [ ] L'admin fonctionne correctement

## 📊 Résultats Attendus

### Page d'Accueil
- Bannière avec photo fixe ✅
- Texte personnalisé ✅
- Section Actualités & Agenda avec vraies données ✅
- Responsive ✅

### Admin
- Gestionnaire de bannière fonctionnel ✅
- Upload d'images ✅
- Aperçu en temps réel ✅
- Sauvegarde dans la BDD ✅

## 📝 Notes

- Les modifications sont immédiates après sauvegarde
- Penser à rafraîchir la page frontend pour voir les changements
- Les images sont stockées dans Supabase Storage
- Les données sont filtrées par statut "published"
