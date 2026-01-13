# Guide de Gestion des Événements

## Vue d'ensemble

Le système de gestion d'événements permet de créer, modifier et gérer tous les événements de l'agenda de Chièvres depuis l'interface d'administration. Il offre une interface complète pour la gestion des manifestations, festivals, concerts, marchés et autres événements.

## Fonctionnalités principales

### ✨ Gestion complète des événements
- **Création** : Formulaire complet avec tous les champs nécessaires
- **Modification** : Édition en temps réel avec validation
- **Suppression** : Suppression sécurisée avec confirmation
- **Duplication** : Copie rapide d'événements similaires

### 🔍 Recherche et filtrage avancés
- **Recherche textuelle** : Dans le titre, description et lieu
- **Filtrage par catégorie** : Folklore, culture, sport, marché, conférence, festival
- **Filtrage par statut** : Brouillon, publié, annulé, archivé
- **Filtrage par date** : Événements passés, présents, futurs

### 📊 Interface intuitive
- **Vue liste** : Affichage détaillé avec actions rapides
- **Vue développée** : Informations complètes par événement
- **Statistiques** : Compteurs et métriques en temps réel

## Structure des données

### Champs obligatoires
- **Titre** : Nom de l'événement
- **Description** : Description complète
- **Date de début** : Date et heure de début
- **Lieu** : Localisation de l'événement
- **Catégorie** : Type d'événement

### Champs optionnels
- **Description courte** : Résumé pour l'aperçu
- **Date de fin** : Pour les événements multi-jours
- **Toute la journée** : Événement sans horaire précis
- **Type d'événement** : Public, privé, membres uniquement
- **Prix** : Texte libre et montant numérique
- **Inscription** : Obligatoire ou non, URL, limite de participants
- **Contact** : Email et téléphone
- **Statut** : Brouillon, publié, annulé, archivé

## Utilisation de l'interface d'administration

### Accès au gestionnaire
1. Connectez-vous à l'interface d'administration
2. Cliquez sur "Événements" dans le tableau de bord
3. Vous accédez au gestionnaire d'événements

### Créer un nouvel événement
1. Cliquez sur "Nouvel Événement"
2. Remplissez les champs obligatoires :
   - Titre
   - Description complète
   - Date de début
   - Lieu
   - Catégorie
3. Ajoutez les informations optionnelles selon vos besoins
4. Choisissez le statut (brouillon pour préparer, publié pour diffuser)
5. Cliquez sur "Créer"

### Modifier un événement existant
1. Trouvez l'événement dans la liste
2. Cliquez sur l'icône "Modifier" (crayon)
3. Modifiez les champs souhaités
4. Cliquez sur "Mettre à jour"

### Dupliquer un événement
1. Cliquez sur l'icône "Dupliquer" (copie)
2. Un nouvel événement est créé avec "(Copie)" dans le titre
3. Modifiez les informations nécessaires
4. Sauvegardez

### Supprimer un événement
1. Cliquez sur l'icône "Supprimer" (poubelle)
2. Confirmez la suppression
3. L'événement est définitivement supprimé

## Catégories d'événements

### 🎭 Folklore
- Fêtes traditionnelles
- Danses folkloriques
- Événements culturels locaux

### 🎨 Culture
- Concerts
- Expositions
- Théâtre
- Conférences culturelles

### ⚽ Sport
- Tournois
- Compétitions
- Événements sportifs

### 🛒 Marché
- Marchés saisonniers
- Marchés de Noël
- Brocantes

### 🎤 Conférence
- Conférences
- Séminaires
- Formations

### 🎪 Festival
- Festivals de musique
- Festivals gastronomiques
- Événements festifs

## Statuts des événements

### 📝 Brouillon
- Événement en préparation
- Non visible sur le site public
- Peut être modifié librement

### ✅ Publié
- Événement visible sur le site
- Affiché dans l'agenda public
- Indexé par les moteurs de recherche

### ❌ Annulé
- Événement annulé mais conservé
- Peut afficher un message d'annulation
- Historique préservé

### 📦 Archivé
- Événement passé archivé
- Non visible sur le site
- Conservé pour l'historique

## Gestion des inscriptions

### Inscription non requise
- Événement en accès libre
- Aucune gestion d'inscription

### Inscription obligatoire
- **URL d'inscription** : Lien vers le formulaire
- **Limite de participants** : Nombre maximum
- **Contact** : Email et téléphone pour renseignements

## Informations de contact

### Email de contact
- Email principal pour les renseignements
- Affiché sur la page de l'événement
- Lien mailto automatique

### Téléphone de contact
- Numéro pour les renseignements
- Affiché sur la page de l'événement
- Lien tel automatique

## Affichage sur le site public

### Page d'agenda
- Liste de tous les événements publics
- Filtrage par catégorie
- Recherche textuelle
- Vue calendrier

### Événements d'aujourd'hui
- Mise en évidence spéciale
- Affichage prioritaire
- Informations essentielles

### Détail d'événement
- Page complète avec toutes les informations
- Boutons de contact
- Lien d'inscription si applicable

## Scripts de maintenance

### Migration initiale
```bash
node scripts/run-events-migration.js
```
- Crée la table events
- Configure les index et politiques
- Ajoute des événements d'exemple

### Test des fonctionnalités
```bash
node scripts/test-events-features.js
```
- Teste toutes les opérations CRUD
- Vérifie les filtres et recherches
- Valide les contraintes

## Bonnes pratiques

### ✅ Recommandations
- **Titres clairs** : Utilisez des titres descriptifs
- **Descriptions complètes** : Donnez tous les détails utiles
- **Dates précises** : Vérifiez les dates et heures
- **Contact accessible** : Fournissez des moyens de contact
- **Statut approprié** : Utilisez le bon statut selon la situation

### ⚠️ À éviter
- **Titres vagues** : Évitez les titres trop génériques
- **Informations manquantes** : N'oubliez pas les détails importants
- **Dates incorrectes** : Vérifiez toujours les dates
- **Contact manquant** : Toujours fournir un moyen de contact

## Dépannage

### Problèmes courants

#### L'événement n'apparaît pas sur le site
- Vérifiez que le statut est "Publié"
- Vérifiez que la date n'est pas passée
- Vérifiez les politiques RLS

#### Erreur lors de la sauvegarde
- Vérifiez les champs obligatoires
- Vérifiez le format des dates
- Vérifiez la validité de l'email et URL

#### Problème de permissions
- Vérifiez votre rôle utilisateur
- Contactez l'administrateur système

### Logs et débogage
- Consultez la console du navigateur
- Vérifiez les logs Supabase
- Utilisez les scripts de test

## Support

Pour toute question ou problème :
1. Consultez ce guide
2. Vérifiez les logs d'erreur
3. Exécutez les scripts de test
4. Contactez l'équipe technique

---

*Guide mis à jour le 13 janvier 2025*