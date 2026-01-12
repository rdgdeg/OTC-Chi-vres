# Guide de Gestion du Tri des Musées & Patrimoine

## Vue d'ensemble

Le système de tri permet de définir l'ordre d'affichage des musées et sites patrimoniaux sur le site web. Les éléments sont affichés dans l'ordre défini par l'administrateur, ce qui permet de mettre en avant certains lieux ou de créer un parcours logique de visite.

## Accès à la Gestion du Tri

1. **Connexion à l'administration** : Connectez-vous avec vos identifiants admin
2. **Navigation** : Dans le menu de gauche, cliquez sur "Tri Musées & Patrimoine" (icône couches)

## Interface de Gestion

### Vue d'ensemble
L'interface présente tous les musées et sites patrimoniaux dans une liste que vous pouvez réorganiser par glisser-déposer.

### Fonctionnalités Principales

#### 1. Glisser-Déposer
- **Cliquez et maintenez** sur l'icône de poignée (≡) à gauche de chaque élément
- **Glissez** l'élément vers sa nouvelle position
- **Relâchez** pour confirmer le nouvel emplacement
- L'ordre est mis à jour instantanément dans l'interface

#### 2. Aperçu en Temps Réel
- **Bouton "Aperçu"** : Affiche comment les éléments apparaîtront sur le site
- **Mise à jour automatique** : L'aperçu se met à jour lors de vos modifications
- **Ordre numéroté** : Chaque élément affiche sa position dans l'ordre final

#### 3. Sauvegarde
- **Bouton "Sauvegarder l'ordre"** : Enregistre les modifications en base de données
- **Confirmation** : Un message confirme la réussite de la sauvegarde
- **Application immédiate** : Les changements sont visibles sur le site après sauvegarde

#### 4. Réinitialisation
- **Bouton "Réinitialiser"** : Annule les modifications non sauvegardées
- **Retour à l'état initial** : Recharge l'ordre depuis la base de données

## Informations Affichées

Pour chaque élément, vous voyez :

### Image de Présentation
- **Miniature** de l'image principale du lieu
- **Placeholder** si aucune image n'est définie

### Informations Principales
- **Nom** du musée ou site patrimonial
- **Adresse** complète du lieu
- **Tags** de catégorisation (Musée, Patrimoine, etc.)

### Ordre Actuel
- **Position numérique** dans l'ordre de tri
- **Statut** : "Non défini" si aucun ordre n'est configuré
- **Indicateur temporaire** si les modifications ne peuvent pas être sauvegardées en base

## Types de Lieux Gérés

### Musées
- Identifiés par les tags : "Musée", "Museum"
- **Couleur** : Bleu dans l'interface
- **Exemples** : Musée de la Vie Rurale, M.I.B.A.

### Patrimoine
- Identifiés par les tags : "Patrimoine", "Église", "Chapelle", "Monument"
- **Couleur** : Ambre dans l'interface
- **Exemples** : Église Saint-Martin, Tour de Gavre

## Fonctionnement Technique

### Sauvegarde en Base de Données
- **Champ sort_order** : Stocke la position de chaque élément
- **Valeurs numériques** : 1 = premier, 2 = deuxième, etc.
- **Tri automatique** : Les éléments sans ordre défini apparaissent en fin de liste

### Fallback et Compatibilité
- **Mode dégradé** : Si la base ne supporte pas le tri, utilise un système temporaire
- **Tri alphabétique** : Ordre par défaut si aucun tri personnalisé n'est défini
- **Persistance** : Les modifications sont conservées entre les sessions

## Utilisation Pratique

### Cas d'Usage Courants

#### 1. Mettre en Avant un Lieu
```
Objectif : Promouvoir le Musée de la Vie Rurale
Action : Glisser le musée en position 1
Résultat : Il apparaîtra en premier sur le site
```

#### 2. Créer un Parcours Logique
```
Ordre suggéré :
1. Église Saint-Martin (centre historique)
2. Musée de la Vie Rurale (histoire locale)
3. Tour de Gavre (patrimoine architectural)
4. Chapelles (sites de pèlerinage)
```

#### 3. Séparer par Catégories
```
Musées en premier :
1-3. Tous les musées
Patrimoine ensuite :
4-7. Sites patrimoniaux
```

### Workflow Recommandé

1. **Planification** : Définir l'ordre souhaité avant de commencer
2. **Réorganisation** : Utiliser le glisser-déposer pour positionner les éléments
3. **Vérification** : Utiliser l'aperçu pour contrôler le résultat
4. **Sauvegarde** : Confirmer les modifications
5. **Contrôle** : Vérifier l'affichage sur le site public

## Bonnes Pratiques

### Ordre Logique
- **Importance** : Placer les lieux les plus importants en premier
- **Géographie** : Organiser par proximité géographique
- **Thématique** : Regrouper par type ou époque

### Maintenance
- **Révision régulière** : Revoir l'ordre périodiquement
- **Nouveaux éléments** : Intégrer les nouveaux lieux dans l'ordre existant
- **Feedback** : Prendre en compte les retours des visiteurs

### Cohérence
- **Logique claire** : Maintenir une logique d'organisation compréhensible
- **Documentation** : Noter les raisons des choix d'ordre
- **Communication** : Informer l'équipe des modifications importantes

## Dépannage

### Le tri ne fonctionne pas
1. **Vérifiez** que vous avez sauvegardé les modifications
2. **Actualisez** la page du site public
3. **Contrôlez** les permissions d'écriture en base de données

### Les modifications ne sont pas sauvegardées
1. **Message d'avertissement** : Vérifiez s'il y a un message sur les limitations
2. **Permissions** : Contactez l'administrateur technique
3. **Mode temporaire** : Les modifications restent actives pendant la session

### L'ordre ne s'affiche pas correctement
1. **Cache navigateur** : Videz le cache et actualisez
2. **Données** : Vérifiez que tous les éléments ont un ordre défini
3. **Filtres** : Contrôlez que les filtres de catégorie n'interfèrent pas

## Impact sur le Site Public

### Page Musées & Patrimoine
- **Liste principale** : Affichage dans l'ordre défini
- **Filtres** : L'ordre est conservé même avec les filtres actifs
- **Carte interactive** : L'ordre influence l'affichage des marqueurs

### Autres Pages
- **Suggestions** : L'ordre peut influencer les recommandations
- **Recherche** : Peut affecter l'ordre des résultats de recherche
- **Navigation** : Impact sur les liens "suivant/précédent"

## Support Technique

En cas de problème :
1. **Vérifiez** les messages d'erreur dans l'interface
2. **Notez** les actions effectuées avant le problème
3. **Contactez** l'équipe technique avec ces informations

---

*Guide mis à jour le : Janvier 2026*