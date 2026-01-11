# Guide de Gestion des Balades

## Vue d'ensemble

Ce guide explique comment utiliser les nouvelles fonctionnalités de gestion des balades, incluant la page de détail et l'interface d'administration complète.

## Fonctionnalités ajoutées

### 🔍 Page de détail des balades

**URL** : `/balades/{id}`

**Fonctionnalités :**
- **Affichage complet** : Toutes les informations de la balade
- **Hero section** avec image et titre
- **Cartes d'information** : Distance, durée, niveau
- **Description détaillée** avec formatage
- **Boutons de téléchargement** : Tracé et documents
- **Galerie photos** si disponible
- **Informations pratiques** : Contact, localisation
- **Tags et caractéristiques**
- **Évaluation** avec étoiles
- **Placeholder carte** pour future intégration

**Navigation :**
- Bouton "Voir le détail" sur chaque carte de balade
- Bouton "Retour aux balades" sur la page de détail

### ⚙️ Interface d'administration avancée

**Accès** : `/admin` → Section "Balades"

**Fonctionnalités :**

#### 1. Éditeur spécialisé pour balades
- **Interface dédiée** avec sections organisées
- **Validation des champs** obligatoires
- **Aperçu en temps réel** des images
- **Gestion des galeries** d'images

#### 2. Sections de l'éditeur :

**📍 Informations générales**
- Nom de la balade (obligatoire)
- Point de départ (obligatoire)
- Description détaillée (obligatoire)

**🚶 Caractéristiques de la balade**
- Distance (ex: "5 km")
- Durée estimée (ex: "1h30")
- Niveau de difficulté (Facile/Moyen/Difficile)

**📥 Liens de téléchargement**
- Lien du tracé (OpenRunner, GPX...)
- Document explicatif (PDF...)

**🖼️ Image principale**
- Upload direct ou URL
- Aperçu en temps réel
- Limite de 2Mo

**📸 Galerie d'images**
- Jusqu'à 8 images
- Gestion via ImageUploader
- Stockage optimisé

**ℹ️ Informations complémentaires**
- Téléphone de contact
- Site web
- Évaluation (1-5 étoiles)
- Tags (séparés par virgules)
- Coordonnées GPS (latitude/longitude)

## Utilisation

### Consulter une balade

1. **Aller sur la page balades** : `/balades`
2. **Cliquer sur "Voir le détail"** sur une carte de balade
3. **Explorer la page de détail** :
   - Informations principales en haut
   - Description et caractéristiques au centre
   - Actions et infos pratiques à droite

### Créer une nouvelle balade

1. **Accéder à l'admin** : `/admin`
2. **Cliquer sur "Balades"** dans la sidebar
3. **Cliquer sur "Ajouter"**
4. **Remplir le formulaire** :
   - Champs obligatoires : Nom, Description, Adresse
   - Caractéristiques : Distance, Durée, Difficulté
   - Liens de téléchargement si disponibles
   - Image principale recommandée
5. **Cliquer sur "Créer la balade"**

### Modifier une balade existante

1. **Accéder à l'admin** : `/admin` → "Balades"
2. **Cliquer sur l'icône "Éditer"** (crayon) sur une balade
3. **Modifier les informations** dans l'éditeur spécialisé
4. **Cliquer sur "Enregistrer les modifications"**

### Supprimer une balade

1. **Accéder à l'admin** : `/admin` → "Balades"
2. **Cliquer sur l'icône "Supprimer"** (poubelle)
3. **Confirmer la suppression**

## Champs détaillés

### Champs obligatoires
- **Nom** : Titre de la balade (ex: "Circuit des Moulins")
- **Description** : Description complète avec points d'intérêt
- **Adresse** : Point de départ précis

### Caractéristiques de la balade
- **Distance** : Format libre (ex: "5 km", "7,5 km")
- **Durée** : Format libre (ex: "1h", "2h30", "± 3h en vélo")
- **Difficulté** : Sélection parmi Facile/Moyen/Difficile

### Liens de téléchargement
- **Tracé** : URL vers OpenRunner, fichier GPX, etc.
- **Document** : URL vers PDF explicatif, carte détaillée, etc.

### Informations complémentaires
- **Téléphone** : Contact pour informations
- **Site web** : Site officiel ou page dédiée
- **Évaluation** : Note de 1 à 5 (décimales acceptées)
- **Tags** : Mots-clés séparés par virgules (ex: "Famille, Nature, Patrimoine")
- **GPS** : Coordonnées exactes du point de départ

## Bonnes pratiques

### Pour les descriptions
- **Soyez descriptif** : Mentionnez les points d'intérêt
- **Utilisez des paragraphes** : Sautez des lignes pour aérer
- **Incluez des détails pratiques** : Parking, accessibilité, etc.

### Pour les images
- **Qualité** : Utilisez des images de bonne résolution
- **Pertinence** : Montrez le paysage, les points d'intérêt
- **Variété** : Mélangez vues d'ensemble et détails

### Pour les liens
- **Testez les liens** : Vérifiez qu'ils fonctionnent
- **URLs complètes** : Commencez par "https://"
- **Liens permanents** : Évitez les liens temporaires

### Pour les tags
- **Soyez cohérent** : Utilisez les mêmes termes
- **Pensez aux filtres** : Les tags serviront à filtrer
- **Exemples utiles** : "Famille", "Accessible PMR", "Vélo", "Patrimoine"

## Intégration avec la base de données

### Synchronisation
- Les modifications sont **automatiquement sauvegardées** en base
- Utilisez le bouton **"Rafraîchir"** pour recharger les données
- Le bouton **"Initialiser DB"** remet les données par défaut

### Structure des données
- **Type** : Toujours "walk" pour les balades
- **ID** : Généré automatiquement à partir du nom
- **Timestamps** : created_at et updated_at automatiques

## Dépannage

### Problèmes courants

**L'éditeur ne s'ouvre pas**
- Vérifiez que vous êtes connecté à l'admin
- Rafraîchissez la page

**Les images ne s'affichent pas**
- Vérifiez la taille (max 2Mo)
- Utilisez des formats JPG, PNG, WebP
- Testez avec une URL d'image externe

**Les liens de téléchargement ne fonctionnent pas**
- Vérifiez que l'URL est complète (https://)
- Testez le lien dans un nouvel onglet
- Assurez-vous que le fichier est accessible publiquement

**La balade n'apparaît pas sur le site**
- Vérifiez que tous les champs obligatoires sont remplis
- Rafraîchissez les données dans l'admin
- Vérifiez la console pour les erreurs

### Support technique
- **Logs** : Consultez la console navigateur (F12)
- **Base de données** : Vérifiez dans Supabase
- **Images** : Contrôlez le stockage Supabase

## Évolutions futures

### Fonctionnalités prévues
- **Carte interactive** : Affichage du tracé sur carte
- **Météo** : Conditions météo en temps réel
- **Commentaires** : Avis des utilisateurs
- **Réservations** : Système de réservation pour visites guidées
- **Partage social** : Boutons de partage Facebook, Instagram
- **Export** : Téléchargement des informations en PDF

### Améliorations possibles
- **Filtres avancés** : Par difficulté, durée, distance
- **Recherche** : Recherche textuelle dans les descriptions
- **Favoris** : Système de balades favorites
- **Statistiques** : Nombre de vues, téléchargements