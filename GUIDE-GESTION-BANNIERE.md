# Guide de Gestion de la Bannière d'Information

## Vue d'ensemble

La bannière d'information permet d'afficher des messages importants en haut de toutes les pages du site web. Elle est parfaite pour :

- Annonces de fermeture/ouverture
- Informations importantes
- Alertes temporaires
- Messages promotionnels

## Accès à la Gestion

1. **Connexion à l'administration** : Connectez-vous avec vos identifiants admin
2. **Navigation** : Dans le menu de gauche, cliquez sur "Bannière d'Info" (icône mégaphone)

## Interface de Gestion

### Activation/Désactivation
- **Case à cocher "Afficher la bannière sur le site"** : Active ou désactive l'affichage de la bannière
- Quand désactivée, la bannière n'apparaît sur aucune page du site

### Contenu de la Bannière

#### Titre Principal
- **Champ** : "Titre principal"
- **Usage** : Message principal de la bannière
- **Exemple** : "Fermeture du bureau le 11 novembre (férié)"

#### Sous-titre
- **Champ** : "Sous-titre ou détails"
- **Usage** : Informations complémentaires ou précisions
- **Exemple** : "Réouverture le 12 novembre à 9h"

### Types de Bannière

La bannière peut prendre différents styles selon le type de message :

#### 🔵 Information
- **Usage** : Messages informatifs généraux
- **Couleur** : Bleu
- **Exemple** : Nouvelles heures d'ouverture

#### ⚠️ Attention
- **Usage** : Messages d'avertissement
- **Couleur** : Jaune/Orange
- **Exemple** : Travaux en cours, accès limité

#### ❌ Erreur
- **Usage** : Messages d'erreur ou problèmes
- **Couleur** : Rouge
- **Exemple** : Service temporairement indisponible

#### ✅ Succès
- **Usage** : Messages positifs ou confirmations
- **Couleur** : Vert
- **Exemple** : Nouveau service disponible

#### 📢 Annonce
- **Usage** : Annonces officielles importantes
- **Couleur** : Couleur principale du site
- **Exemple** : Fermetures exceptionnelles

### Options d'Affichage

#### Permettre la fermeture
- **Option** : "Permettre aux utilisateurs de fermer la bannière"
- **Activé** : Les visiteurs peuvent fermer la bannière (elle ne réapparaîtra pas pendant leur session)
- **Désactivé** : La bannière reste toujours visible

#### Afficher l'icône
- **Option** : "Afficher l'icône"
- **Activé** : Une icône correspondant au type de bannière s'affiche
- **Désactivé** : Seul le texte est affiché

## Aperçu en Temps Réel

- **Bouton "Aperçu"** : Affiche un aperçu de la bannière telle qu'elle apparaîtra sur le site
- **Mise à jour automatique** : L'aperçu se met à jour en temps réel lors de vos modifications

## Sauvegarde

- **Bouton "Sauvegarder"** : Enregistre toutes les modifications
- **Confirmation** : Un message de succès confirme la sauvegarde
- **Application immédiate** : Les changements sont visibles immédiatement sur le site

## Cas d'Usage Courants

### 1. Fermeture Exceptionnelle
```
Type: Annonce
Titre: Fermeture du bureau le 11 novembre (férié)
Sous-titre: Réouverture le 12 novembre à 9h
Dismissible: Oui
Icône: Oui
```

### 2. Travaux en Cours
```
Type: Attention
Titre: Travaux de rénovation en cours
Sous-titre: Accès par l'entrée arrière jusqu'au 15 décembre
Dismissible: Non
Icône: Oui
```

### 3. Nouveau Service
```
Type: Succès
Titre: Nouveau service de réservation en ligne
Sous-titre: Réservez vos visites guidées directement sur notre site
Dismissible: Oui
Icône: Oui
```

### 4. Alerte Météo
```
Type: Erreur
Titre: Fermeture temporaire due aux conditions météorologiques
Sous-titre: Réouverture dès que les conditions le permettront
Dismissible: Non
Icône: Oui
```

## Bonnes Pratiques

### Contenu
- **Soyez concis** : Messages courts et clairs
- **Informations essentielles** : Titre pour le message principal, sous-titre pour les détails
- **Dates précises** : Toujours indiquer les dates et heures exactes

### Type de Bannière
- **Information** : Pour les messages neutres
- **Attention** : Pour les avertissements non critiques
- **Erreur** : Pour les problèmes importants
- **Succès** : Pour les bonnes nouvelles
- **Annonce** : Pour les communications officielles

### Gestion
- **Désactivez** quand le message n'est plus d'actualité
- **Mettez à jour** régulièrement le contenu
- **Testez** l'aperçu avant de sauvegarder

## Dépannage

### La bannière ne s'affiche pas
1. Vérifiez que la case "Afficher la bannière sur le site" est cochée
2. Assurez-vous qu'il y a au moins un titre ou un sous-titre
3. Vérifiez que vous avez sauvegardé les modifications

### Problème de sauvegarde
1. Vérifiez votre connexion internet
2. Actualisez la page et réessayez
3. Contactez l'administrateur technique si le problème persiste

### La bannière ne se met pas à jour
1. Actualisez la page du site (F5 ou Ctrl+R)
2. Videz le cache de votre navigateur
3. Vérifiez que les modifications ont bien été sauvegardées

## Support Technique

En cas de problème technique :
1. Notez le message d'erreur exact
2. Indiquez les étapes que vous avez suivies
3. Contactez l'équipe technique avec ces informations

---

*Guide mis à jour le : Janvier 2026*