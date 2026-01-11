# Guide de Gestion du Contenu - Visit Chièvres

## 🎯 Vue d'ensemble

Le système de gestion du contenu permet d'activer, désactiver et supprimer tous les éléments du site depuis une interface centralisée. Vous pouvez gérer individuellement ou en lot tous les types de contenu.

## 📍 Accès

**Administration** → **Gestion du Contenu**
- URL : `/admin-dashboard` puis cliquer sur "Gestion du Contenu"
- Permissions requises : `content:read`

## 🗂️ Types de contenu gérés

### 1. **Musées & Patrimoine**
- Sites historiques, monuments, musées
- Statuts : Actif / Inactif / Archivé
- Actions : Créer, Modifier, Supprimer, Activer/Désactiver

### 2. **Restaurants & Cafés**
- Établissements de restauration
- Filtres par type : Restaurant, Café, Bar
- Gestion des horaires et informations pratiques

### 3. **Hébergements**
- Gîtes, chambres d'hôtes, hôtels
- Statuts : Publié / Brouillon / Archivé
- Gestion complète avec capacité, équipements, tarifs

### 4. **Commerçants & Producteurs**
- Boutiques, artisans, producteurs locaux
- Catégories multiples
- Informations de contact et horaires

### 5. **Balades & Randonnées**
- Circuits de découverte
- Niveaux de difficulté
- Fichiers GPX et cartes

### 6. **Expériences**
- Activités proposées aux visiteurs
- Catégories : Adulte, Enfant, Famille, Team building
- Tarifs et durées

### 7. **Événements**
- Agenda des manifestations
- Dates et récurrence
- Catégories : Folklore, Culture, Sport, Marché

### 8. **Articles & Blog**
- Actualités et articles
- Statuts de publication
- Catégories et tags

### 9. **Boutique**
- Produits en vente
- Gestion des stocks
- Catégories : Souvenirs, Livres, Terroir

## 🔧 Fonctionnalités principales

### Interface unifiée
- **Vue d'ensemble** : Statistiques globales et accès rapide
- **Gestionnaires spécialisés** : Interface adaptée à chaque type
- **Filtres avancés** : Recherche, statut, type, localisation
- **Actions en lot** : Traitement multiple d'éléments

### Gestion des statuts

#### Pour les hébergements, articles, événements :
- **Publié** : Visible sur le site public
- **Brouillon** : Visible uniquement en administration
- **Archivé** : Masqué mais conservé

#### Pour les autres éléments :
- **Actif** : Visible et accessible
- **Inactif** : Masqué temporairement
- **Archivé** : Conservé mais non affiché

## 📊 Tableau de bord

### Statistiques globales
- **Total** : Nombre d'éléments tous types confondus
- **Actifs** : Éléments visibles sur le site
- **Inactifs** : Éléments temporairement masqués
- **Archivés** : Éléments conservés mais non affichés

### Actions rapides
- **Activer tout** : Rendre tous les éléments visibles
- **Désactiver tout** : Masquer tous les éléments
- **Statistiques** : Analytics détaillées

## 🎛️ Actions individuelles

### Sur chaque élément
- **👁️ Activer/Désactiver** : Basculer la visibilité
- **✏️ Modifier** : Éditer le contenu
- **🗑️ Supprimer** : Suppression définitive
- **🌐 Voir sur le site** : Lien direct (si publié)

### Informations affichées
- **Image** et **titre**
- **Type** et **catégorie**
- **Localisation** (si applicable)
- **Capacité** (hébergements)
- **Date** (événements)
- **Prix** (produits, expériences)
- **Statistiques** (vues, notes)

## 🔄 Actions en lot

### Sélection
- **Cases à cocher** : Sélection individuelle
- **Tout sélectionner** : Sélection de tous les éléments visibles
- **Tout désélectionner** : Annuler la sélection

### Actions disponibles
- **👁️ Activer** : Rendre visible sur le site
- **👁️‍🗨️ Désactiver** : Masquer temporairement
- **📦 Archiver** : Conserver mais masquer
- **🗑️ Supprimer** : Suppression définitive

### Résultats
- **Compteur de réussite** : Éléments traités avec succès
- **Compteur d'échec** : Éléments non traités
- **Détail des erreurs** : Messages d'erreur spécifiques

## 🔍 Filtres et recherche

### Recherche textuelle
- Nom/titre de l'élément
- Description et contenu
- Adresse et localisation
- Village/commune

### Filtres par statut
- Tous les statuts
- Actif/Publié
- Inactif/Brouillon
- Archivé

### Filtres par type
- Selon le type de contenu
- Catégories spécifiques
- Sous-types (restaurant/café, etc.)

### Réinitialisation
- Bouton pour effacer tous les filtres
- Retour à la vue complète

## 🛡️ Sécurité et permissions

### Niveaux d'accès
- **Lecture** : Voir les éléments
- **Écriture** : Créer et modifier
- **Suppression** : Supprimer définitivement
- **Administration** : Accès complet

### Confirmations
- **Suppression individuelle** : Confirmation requise
- **Actions en lot** : Double confirmation
- **Suppression définitive** : Avertissement spécial

### Audit
- **Historique des modifications** : Qui, quand, quoi
- **Logs d'actions** : Traçabilité complète
- **Sauvegarde automatique** : Versions précédentes

## 📱 Utilisation pratique

### Scénarios courants

#### 1. Masquer temporairement des éléments
1. Aller dans la section concernée
2. Sélectionner les éléments à masquer
3. Cliquer sur "Désactiver"
4. Confirmer l'action

#### 2. Supprimer des éléments obsolètes
1. Filtrer par statut "Archivé"
2. Sélectionner les éléments à supprimer
3. Cliquer sur "Supprimer"
4. Confirmer la suppression définitive

#### 3. Activer du nouveau contenu
1. Filtrer par statut "Brouillon" ou "Inactif"
2. Vérifier le contenu
3. Sélectionner les éléments prêts
4. Cliquer sur "Activer"

#### 4. Archiver du contenu saisonnier
1. Rechercher les éléments concernés
2. Sélectionner les éléments saisonniers
3. Cliquer sur "Archiver"
4. Confirmer l'archivage

### Bonnes pratiques

#### Avant de supprimer
- **Archiver d'abord** : Tester l'impact
- **Vérifier les liens** : Éviter les liens brisés
- **Sauvegarder** : Exporter si nécessaire

#### Gestion des statuts
- **Brouillon** : Pour le contenu en préparation
- **Inactif** : Pour les fermetures temporaires
- **Archivé** : Pour le contenu obsolète mais à conserver

#### Actions en lot
- **Tester sur un petit échantillon** d'abord
- **Vérifier les filtres** avant sélection
- **Lire les messages d'erreur** en cas de problème

## 🚨 Dépannage

### Problèmes courants

#### Élément non supprimé
- Vérifier les permissions
- Contrôler les dépendances
- Consulter les logs d'erreur

#### Action en lot échouée
- Vérifier la connexion réseau
- Réessayer avec moins d'éléments
- Contacter l'administrateur si persistant

#### Statut non mis à jour
- Actualiser la page
- Vérifier les permissions
- Contrôler la base de données

### Messages d'erreur
- **"Permissions insuffisantes"** : Contacter l'administrateur
- **"Élément non trouvé"** : Actualiser et réessayer
- **"Erreur de réseau"** : Vérifier la connexion

## 📞 Support

### Aide en ligne
- **Tooltips** : Survol des boutons pour aide
- **Messages contextuels** : Guidance intégrée
- **Confirmations** : Prévention des erreurs

### Contact
- **Administrateur technique** : Pour les problèmes système
- **Gestionnaire de contenu** : Pour les questions éditoriales
- **Documentation** : Guides détaillés disponibles

---

*Guide créé pour Visit Chièvres - Version 1.0*