# Guide de Mise à Jour de la Base de Données - Balades

## Vue d'ensemble

Ce guide explique comment mettre à jour la base de données Supabase avec les nouvelles balades selon le brief client. Les modifications incluent 9 nouveaux circuits avec liens de téléchargement et descriptions détaillées.

## Méthodes de Mise à Jour

### 1. Via l'Interface Admin (Recommandé)

**Étapes :**

1. **Accéder à l'administration**
   - Aller sur `/admin` 
   - Se connecter avec le mot de passe admin

2. **Naviguer vers les Balades**
   - Cliquer sur "Balades" dans la sidebar
   - Vous verrez le composant "Mise à jour des Balades" en haut

3. **Prévisualiser les données**
   - Cliquer sur "Prévisualiser les données" pour voir les 9 nouvelles balades
   - Vérifier que toutes les informations sont correctes

4. **Lancer la mise à jour**
   - Cliquer sur "Mettre à jour la base de données"
   - Confirmer l'action dans la popup
   - Attendre la confirmation de succès

**Avantages :**
- Interface utilisateur intuitive
- Prévisualisation des données
- Vérification automatique des données
- Feedback en temps réel

### 2. Via la Synchronisation Complète

**Étapes :**

1. **Accéder à l'administration**
   - Aller sur `/admin`
   - Se connecter

2. **Utiliser le bouton "Initialiser DB"**
   - En haut à droite, cliquer sur "Initialiser DB"
   - Confirmer l'action
   - Cela synchronise TOUTES les données mockData vers Supabase

**Avantages :**
- Met à jour toutes les données en une fois
- Utile pour une réinitialisation complète

**Inconvénients :**
- Remplace toutes les données existantes
- Plus lourd que la mise à jour ciblée

## Nouvelles Balades Incluses

### Circuits Principaux (4)

1. **Circuit "Cervia"** - 5 km, 1h, Facile
   - Départ : Parc communal (Chièvres)
   - Flèches jaunes pour orientation
   - Créé par Axelle Mercier

2. **La ronde des Piedsentes** - 7,5 km, 2h, Facile
   - Départ : Musée de la Vie rurale de Huissignies
   - Sentiers typiques entre terres agricoles

3. **Circuit découverte des églises** - 22 km, 5h, Moyen
   - Départ : Église Saint-Martin
   - Architecture gothique, romane, néo-gothique

4. **Circuit des châteaux** - 28 km, 3h vélo, Moyen
   - Départ : Grand-Place Chièvres
   - Testé par le Vélo Club de Tongre Notre-Dame
   - Inclut document explicatif

### Circuits de l'Entité (5)

5. **À la rencontre des moulins** - 18 km, 4h, Moyen
   - Lien OpenRunner : https://www.openrunner.com/route-details/22818735

6. **Les deux Tongre** - 10 km, 2h, Facile
   - Lien OpenRunner : https://www.openrunner.com/route-details/22818836

7. **Ladeuze & Huissignies** - 10 km, 2h, Facile
   - Lien OpenRunner : https://www.openrunner.com/route-details/22819149

8. **Vaudignies** - 5,5 km, 1h30, Facile
   - Lien OpenRunner : https://www.openrunner.com/route-details/12667613

9. **Grosage** - 7 km, 1h45, Facile
   - Lien OpenRunner : https://www.openrunner.com/route-details/19517101

## Fonctionnalités Ajoutées

### Boutons de Téléchargement
- **"Télécharger le tracé"** : Liens vers OpenRunner
- **"Document explicatif"** : Pour le circuit des châteaux
- Design responsive avec icônes

### Nouveau Contenu de Page
- **Titre** : "Découvrir - Balades"
- **Sous-titre** : Description complète du territoire
- **Introduction** : Présentation des 5 circuits

## Vérifications Post-Mise à Jour

### 1. Vérifier les Données
```sql
-- Compter les balades
SELECT COUNT(*) FROM places WHERE type = 'walk';
-- Devrait retourner 9

-- Vérifier les liens de téléchargement
SELECT name, download_url FROM places WHERE type = 'walk' AND download_url IS NOT NULL;
```

### 2. Tester l'Interface
- Aller sur `/balades`
- Vérifier que les 9 circuits s'affichent
- Tester les boutons de téléchargement
- Vérifier le nouveau contenu de la page

### 3. Vérifier les Liens OpenRunner
- Tester les 5 liens OpenRunner (circuits 5-9)
- S'assurer qu'ils s'ouvrent dans un nouvel onglet

## Dépannage

### Erreur "Données invalides"
- Vérifier que tous les champs requis sont remplis
- Contrôler que le type est bien "walk"
- Vérifier la structure des données dans mockData.ts

### Erreur de Connexion Supabase
- Vérifier les variables d'environnement
- Contrôler la configuration Supabase
- Vérifier les permissions RLS

### Boutons de Téléchargement Non Visibles
- Vérifier que downloadUrl est défini
- Contrôler le composant Card.tsx
- Vérifier les imports d'icônes

## Sauvegarde

Avant toute mise à jour majeure :

```sql
-- Sauvegarder les balades existantes
CREATE TABLE places_backup AS SELECT * FROM places WHERE type = 'walk';

-- Sauvegarder le contenu de page
CREATE TABLE page_content_backup AS SELECT * FROM page_content WHERE id = 'walks';
```

## Support

En cas de problème :
1. Vérifier les logs de la console navigateur
2. Contrôler les erreurs Supabase dans l'onglet Network
3. Utiliser le bouton "Rafraîchir" pour recharger les données
4. En dernier recours, utiliser "Initialiser DB" pour tout réinitialiser

## Notes Importantes

- ⚠️ La mise à jour remplace toutes les balades existantes
- 🔄 La page se rafraîchit automatiquement après mise à jour réussie
- 📱 Les boutons de téléchargement sont responsive
- 🔗 Les liens OpenRunner sont fonctionnels et testés
- 🏷️ Les tags et difficultés sont correctement assignés