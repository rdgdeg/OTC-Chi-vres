# 📄 Guide de Gestion des Pages et Bannières

## Vue d'ensemble

Le **Gestionnaire Unifié de Pages et Bannières** vous permet de modifier facilement tout le contenu textuel et visuel de votre site depuis une seule interface.

## 🎯 Fonctionnalités principales

### 1. Gestion des Bannières d'Information

Les bannières s'affichent en haut de toutes les pages du site pour communiquer des informations importantes.

#### Accès
- Depuis le tableau de bord admin → **Gestion des Pages & Bannières**
- Cliquez sur la carte **"Bannières d'information"**

#### Paramètres disponibles

**Contenu :**
- **Titre principal** : Message court et percutant
- **Sous-titre** : Détails complémentaires
- **Activation** : Afficher/masquer la bannière

**Apparence :**
- **Type de bannière** :
  - 🔵 **Information** : Messages généraux (bleu)
  - ⚠️ **Attention** : Alertes importantes (jaune)
  - ❌ **Erreur** : Problèmes critiques (rouge)
  - ✅ **Succès** : Bonnes nouvelles (vert)
  - 📢 **Annonce** : Événements spéciaux (couleur primaire)

**Options :**
- **Dismissible** : Permet aux visiteurs de fermer la bannière
- **Afficher l'icône** : Ajoute une icône selon le type

#### Exemples d'utilisation

```
Fermeture exceptionnelle
📅 Le bureau sera fermé le 11 novembre (férié)
Type: Information | Dismissible: Oui
```

```
⚠️ Travaux en cours
Certains sentiers de randonnée sont temporairement fermés
Type: Attention | Dismissible: Non
```

### 2. Gestion du Contenu des Pages

Modifiez le contenu de toutes les pages du site : accueil, hébergements, restaurants, musées, etc.

#### Accès
- Depuis le tableau de bord admin → **Gestion des Pages & Bannières**
- Cliquez sur la carte **"Contenu des pages"**
- Sélectionnez la page à modifier

#### Éléments modifiables

**Contenu principal :**
- **Image de bannière** : Grande image en haut de page (1920x600px recommandé)
- **Titre principal** : H1 de la page
- **Sous-titre** : Accroche sous le titre
- **Description** : Texte d'introduction

**SEO (Référencement) :**
- **Titre SEO** : Titre dans les résultats Google (60 caractères max)
- **Description SEO** : Description dans les résultats Google (160 caractères max)

#### Pages disponibles

| Page | Chemin | Description |
|------|--------|-------------|
| Accueil | `/` | Page d'accueil du site |
| Musées & Patrimoine | `/musees` | Liste des musées et patrimoine |
| Hébergements | `/hebergements` | Gîtes, chambres d'hôtes, etc. |
| Gastronomie | `/restaurants` | Restaurants et producteurs |
| Commerces | `/commercants` | Boutiques et artisans |
| Balades | `/balades` | Circuits de randonnée |
| Expériences | `/experiences` | Activités et visites |
| Agenda | `/agenda` | Événements et festivités |
| Blog | `/blog` | Articles et actualités |
| Boutique | `/boutique` | Produits et souvenirs |
| Contact | `/contact` | Coordonnées de l'office |
| Équipe | `/equipe` | Présentation de l'équipe |
| Crossage | `/crossage` | Activité Crossage |
| Bulletin | `/bulletin` | Bulletin municipal |

## 🚀 Guide d'utilisation rapide

### Modifier une bannière

1. **Accéder** : Admin → Pages & Bannières → Bannières
2. **Activer** : Cocher "Afficher la bannière sur le site"
3. **Rédiger** : Saisir le titre et le sous-titre
4. **Styliser** : Choisir le type (info, attention, etc.)
5. **Options** : Configurer dismissible et icône
6. **Aperçu** : Cliquer sur "Aperçu" pour visualiser
7. **Sauvegarder** : Cliquer sur "Sauvegarder"

### Modifier une page

1. **Accéder** : Admin → Pages & Bannières → Contenu des pages
2. **Rechercher** : Utiliser la barre de recherche si nécessaire
3. **Sélectionner** : Cliquer sur la carte de la page
4. **Modifier** : Cliquer sur "Modifier"
5. **Éditer** : Modifier les textes et images
6. **Sauvegarder** : Cliquer sur "Sauvegarder"
7. **Vérifier** : Cliquer sur "Voir la page" pour vérifier

## 💡 Bonnes pratiques

### Pour les bannières

✅ **À faire :**
- Utiliser des messages courts et clairs
- Choisir le bon type selon l'urgence
- Désactiver quand l'information n'est plus pertinente
- Utiliser "dismissible" pour les infos non critiques

❌ **À éviter :**
- Messages trop longs (max 2 lignes)
- Laisser des bannières obsolètes actives
- Utiliser "erreur" pour des infos mineures
- Trop de bannières simultanées

### Pour les pages

✅ **À faire :**
- Utiliser des images de qualité (min 1920px de large)
- Rédiger des titres accrocheurs
- Optimiser les descriptions SEO
- Vérifier l'affichage après modification

❌ **À éviter :**
- Images trop petites ou floues
- Titres trop longs (max 60 caractères)
- Descriptions SEO identiques pour toutes les pages
- Oublier de sauvegarder

## 🎨 Recommandations visuelles

### Images de bannière

**Dimensions recommandées :**
- Largeur : 1920px minimum
- Hauteur : 400-600px
- Format : JPG ou WebP
- Poids : < 500 Ko (optimisé)

**Composition :**
- Sujet principal au centre
- Éviter le texte sur l'image (sera ajouté par le site)
- Bon contraste pour la lisibilité du texte
- Représentative du contenu de la page

### Textes

**Titres :**
- Court et percutant (3-8 mots)
- Commence par une majuscule
- Pas de point final
- Utilise des mots-clés pertinents

**Sous-titres :**
- Complète le titre (8-15 mots)
- Apporte une précision
- Peut être une question ou une accroche

**Descriptions :**
- 2-3 phrases maximum
- Présente le contenu de la page
- Incite à l'action ou à la découverte

## 🔧 Intégration dans l'admin

### Ajout au tableau de bord

```typescript
// Dans votre AdminDashboard.tsx ou équivalent
import UnifiedPageBannerManager from './components/admin/UnifiedPageBannerManager';

// Ajouter dans le menu ou les onglets
<UnifiedPageBannerManager />
```

### Structure des données

Les données sont stockées dans :
- **Bannières** : Service `homepageService` → table `homepage_content`
- **Pages** : Context `PageContentContext` → localStorage + Supabase

## 📊 Suivi et statistiques

Le tableau de bord affiche :
- Nombre total de pages
- Bannières actives
- Dernière modification
- Aperçu rapide des pages

## 🆘 Dépannage

### La bannière ne s'affiche pas
1. Vérifier que "Afficher la bannière" est coché
2. Vérifier qu'un titre est renseigné
3. Rafraîchir la page (Ctrl+F5)
4. Vider le cache du navigateur

### Les modifications ne sont pas visibles
1. Cliquer sur "Sauvegarder"
2. Attendre la confirmation de sauvegarde
3. Rafraîchir la page concernée
4. Vérifier la connexion internet

### L'image ne se charge pas
1. Vérifier le format (JPG, PNG, WebP)
2. Vérifier la taille (< 5 Mo)
3. Vérifier les permissions Supabase Storage
4. Essayer une autre image

## 📱 Responsive

Toutes les modifications sont automatiquement adaptées pour :
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔐 Permissions

Seuls les utilisateurs authentifiés avec le rôle **admin** peuvent accéder à cette interface.

## 📞 Support

Pour toute question ou problème :
- Consulter la documentation technique
- Vérifier les logs dans la console navigateur
- Contacter le support technique

---

**Dernière mise à jour** : Janvier 2026
**Version** : 1.0.0
