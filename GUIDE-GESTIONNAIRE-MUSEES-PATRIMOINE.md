# Guide du Gestionnaire Musées & Patrimoine

## Vue d'ensemble

Le gestionnaire Musées & Patrimoine est un outil complet qui permet de gérer le contenu et l'ordre d'affichage de tous vos lieux culturels depuis une interface unique dans le tableau de bord d'administration.

## Accès au Gestionnaire

1. **Connexion** : Connectez-vous à l'interface d'administration
2. **Navigation** : Cliquez sur "Musées & Patrimoine" dans le menu de gauche
3. **Permissions** : Nécessite les droits de lecture (`places:read`) minimum

## Fonctionnalités Principales

### 🏛️ Gestion par Sous-Catégories

Le système reconnaît automatiquement deux types de lieux culturels :

#### Musées
- **Détection automatique** : Via les tags "Musée", "Museum"
- **Couleur** : Bleu dans l'interface
- **Exemples** : Musée de la Vie Rurale, M.I.B.A.
- **Tags suggérés** : Culture, Histoire, Art, Exposition, Visite guidée

#### Patrimoine
- **Détection automatique** : Via les tags "Patrimoine", "Église", "Chapelle", "Monument"
- **Couleur** : Ambre dans l'interface
- **Exemples** : Église Saint-Martin, Tour de Gavre
- **Tags suggérés** : Architecture, Histoire, Gothique, Pèlerinage

### 🔍 Filtres et Recherche

#### Filtres par Catégorie
- **Tout** : Affiche tous les éléments
- **Musées** : Filtre uniquement les musées
- **Patrimoine** : Filtre uniquement les sites patrimoniaux
- **Compteurs** : Nombre d'éléments par catégorie

#### Recherche Textuelle
- **Champs recherchés** : Nom, adresse, tags
- **Recherche en temps réel** : Résultats instantanés
- **Combinable** : Fonctionne avec les filtres de catégorie

### 📋 Gestion du Contenu

#### Ajouter un Nouvel Élément
1. **Bouton "Ajouter"** : En haut à droite de l'interface
2. **Sélection du type** : Choisir entre Musée ou Patrimoine
3. **Formulaire complet** : Toutes les informations nécessaires
4. **Tags automatiques** : Ajout automatique des tags de base

#### Modifier un Élément Existant
1. **Bouton "Modifier"** : Icône crayon sur chaque élément
2. **Formulaire pré-rempli** : Toutes les données actuelles
3. **Sauvegarde** : Mise à jour immédiate

#### Supprimer un Élément
1. **Bouton "Supprimer"** : Icône poubelle sur chaque élément
2. **Confirmation** : Demande de confirmation avant suppression
3. **Suppression définitive** : Action irréversible

### 🔄 Gestion de l'Ordre d'Affichage

#### Tri par Glisser-Déposer
- **Interface intuitive** : Glissez les éléments pour les réorganiser
- **Poignée de tri** : Icône ≡ à gauche de chaque élément
- **Numérotation** : Position claire de chaque élément
- **Temps réel** : Changements visibles immédiatement

#### Sauvegarde de l'Ordre
- **Bouton "Sauvegarder l'ordre"** : Enregistre les modifications
- **Application immédiate** : Visible sur le site public
- **Persistance** : L'ordre est conservé entre les sessions

#### Réinitialisation
- **Bouton "Réinitialiser"** : Annule les modifications non sauvegardées
- **Retour à l'état initial** : Recharge l'ordre depuis la base

### 👁️ Aperçu en Temps Réel

#### Fonction Aperçu
- **Bouton "Aperçu"** : Affiche le rendu final
- **Ordre exact** : Tel qu'il apparaîtra sur le site
- **Informations complètes** : Nom, adresse, catégorie
- **Mise à jour dynamique** : Suit les modifications

## Interface de Création/Modification

### Informations de Base

#### Type de Lieu
- **Sélection obligatoire** : Musée ou Patrimoine
- **Interface visuelle** : Cartes avec icônes distinctives
- **Impact sur les tags** : Détermine les tags de base

#### Informations Essentielles
- **Nom** : Titre du lieu (obligatoire)
- **Description** : Présentation détaillée (obligatoire)
- **Adresse** : Localisation complète (obligatoire)
- **Image principale** : URL de l'image de présentation (obligatoire)

#### Géolocalisation
- **Latitude/Longitude** : Coordonnées GPS (optionnel)
- **Affichage sur carte** : Permet la localisation précise
- **Format décimal** : Ex: 50.5950, 3.8050

### Informations de Contact

#### Coordonnées
- **Téléphone** : Numéro de contact
- **Email** : Adresse électronique
- **Site web** : URL complète (doit commencer par http/https)

#### Informations Pratiques
- **Horaires d'ouverture** : Format libre, multiligne
- **Tarifs** : Prix et conditions
- **Informations pratiques** : Parking, accessibilité, etc.

### Système de Tags

#### Tags Automatiques
- **Musée** : "Musée", "Culture" ajoutés automatiquement
- **Patrimoine** : "Patrimoine", "Architecture" ajoutés automatiquement
- **Non modifiables** : Garantissent la catégorisation

#### Tags Personnalisés
- **Ajout libre** : Créez vos propres tags
- **Suggestions** : Tags prédéfinis selon le type
- **Suppression** : Retirez les tags non pertinents
- **Recherche** : Les tags sont inclus dans la recherche

#### Tags Suggérés

**Pour les Musées :**
- Culture, Histoire, Art, Exposition, Visite guidée

**Pour le Patrimoine :**
- Architecture, Histoire, Gothique, Pèlerinage, Monument, Église, Chapelle

## Impact sur le Site Public

### Page Musées & Patrimoine

#### Ordre d'Affichage
- **Respect du tri** : L'ordre défini dans l'admin est appliqué
- **Conservation avec filtres** : Le tri est maintenu même avec les filtres
- **Cohérence** : Même logique de catégorisation

#### Filtres Publics
- **Même catégorisation** : Utilise la même détection de sous-catégories
- **Compteurs précis** : Nombre exact d'éléments par catégorie
- **Expérience cohérente** : Interface publique alignée sur l'admin

### Autres Pages
- **Suggestions** : L'ordre peut influencer les recommandations
- **Recherche** : Impact sur l'ordre des résultats
- **Carte interactive** : Ordre des marqueurs

## Permissions et Sécurité

### Niveaux d'Accès

#### Lecture (`places:read`)
- **Visualisation** : Voir tous les éléments
- **Filtres** : Utiliser les filtres et recherche
- **Aperçu** : Voir l'ordre d'affichage

#### Écriture (`places:write`)
- **Tri** : Modifier l'ordre d'affichage
- **Sauvegarde** : Enregistrer les modifications d'ordre

#### Création (`places:create`)
- **Ajout** : Créer de nouveaux éléments
- **Formulaire complet** : Accès à tous les champs

#### Suppression (`places:delete`)
- **Suppression** : Retirer des éléments existants
- **Confirmation** : Sécurité avant suppression

### Validation des Données

#### Côté Client
- **Champs obligatoires** : Vérification avant envoi
- **Format email** : Validation de l'adresse électronique
- **URL** : Vérification du format des liens

#### Côté Serveur
- **Intégrité** : Vérification des données en base
- **Sécurité** : Protection contre les injections
- **Cohérence** : Maintien de la structure

## Bonnes Pratiques

### Organisation du Contenu

#### Ordre Logique
- **Importance** : Placer les lieux les plus importants en premier
- **Géographie** : Organiser par proximité ou circuit de visite
- **Thématique** : Regrouper par époque ou style

#### Catégorisation
- **Tags pertinents** : Utiliser des mots-clés recherchés
- **Cohérence** : Maintenir une logique de nommage
- **Éviter la redondance** : Ne pas dupliquer l'information

### Maintenance Régulière

#### Révision Périodique
- **Contenu** : Vérifier l'actualité des informations
- **Ordre** : Adapter selon les priorités touristiques
- **Images** : Maintenir des visuels de qualité

#### Suivi des Performances
- **Analytics** : Analyser les pages les plus visitées
- **Feedback** : Prendre en compte les retours visiteurs
- **Optimisation** : Ajuster l'ordre selon les données

## Dépannage

### Problèmes Courants

#### L'ordre ne se sauvegarde pas
1. **Vérifiez** les permissions d'écriture
2. **Actualisez** la page et réessayez
3. **Contactez** l'administrateur technique

#### Les filtres ne fonctionnent pas
1. **Vérifiez** les tags des éléments
2. **Actualisez** les données
3. **Videz** le cache du navigateur

#### L'aperçu ne correspond pas au site
1. **Sauvegardez** les modifications
2. **Actualisez** la page publique
3. **Vérifiez** le cache du site

### Support Technique

En cas de problème persistant :
1. **Notez** les messages d'erreur exacts
2. **Documentez** les étapes effectuées
3. **Contactez** l'équipe technique avec ces informations

---

*Guide mis à jour le : Janvier 2026*