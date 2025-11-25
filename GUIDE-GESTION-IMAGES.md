# Guide de Gestion des Images et Informations

## 🎯 Problèmes Résolus

### 1. Les images ne se mettent pas à jour
**Solution** : Ajout d'un système de cache-busting avec timestamp (`?t=timestamp`) qui force le navigateur à recharger l'image.

### 2. Impossible de gérer plusieurs photos
**Solution** : Nouveau système de galerie d'images avec :
- Image principale + jusqu'à 4 images secondaires
- Affichage en grille (1 grande + 2 petites)
- Clic sur une image pour l'ouvrir en plein écran
- Navigation entre les images en plein écran

### 3. Champs manquants pour les musées
**Solution** : Ajout de tous les champs demandés :
- ✅ Titre
- ✅ Description
- ✅ Informations pratiques
- ✅ Photos (galerie multiple)
- ✅ Lien internet (site web)
- ✅ Email
- ✅ Réseaux sociaux (Facebook, Instagram, Twitter)
- ✅ Téléphone
- ✅ Horaires d'ouverture
- ✅ Prix / Tarifs

## 📋 Comment Utiliser

### Étape 1 : Configuration Initiale (À faire une seule fois)

1. **Mettre à jour la base de données**
   - Connectez-vous à Supabase : https://app.supabase.com
   - Allez dans **SQL Editor**
   - Copiez et exécutez le contenu de `supabase-migration.sql`
   - Cela ajoutera tous les nouveaux champs

2. **Configurer le stockage d'images** (Optionnel mais recommandé)
   - Suivez les instructions dans `SUPABASE-STORAGE-SETUP.md`
   - Cela vous permettra d'uploader des images directement depuis l'admin

### Étape 2 : Modifier un Musée

1. **Accéder à l'admin**
   - Allez sur votre site : `/admin` ou cliquez sur "Admin" dans le menu
   - Connectez-vous avec le mot de passe : `admin`

2. **Sélectionner "Musées & Patrimoine"** dans le menu de gauche

3. **Cliquer sur le bouton "Éditer"** (icône crayon) du musée à modifier

4. **Remplir les champs** :

   **Informations de base :**
   - Nom du musée
   - Description complète
   - Adresse

   **Contact :**
   - Téléphone (ex: +32 68 12 34 56)
   - Email (ex: contact@musee.be)
   - Site Web (ex: https://www.musee.be)

   **Réseaux sociaux :**
   - Facebook (URL complète)
   - Instagram (URL complète)
   - Twitter (URL complète)

   **Informations pratiques :**
   - Horaires d'ouverture (vous pouvez utiliser plusieurs lignes)
     ```
     Mardi - Dimanche: 10h00 - 18h00
     Fermé le lundi
     Dernière entrée: 17h00
     ```
   
   - Prix / Tarifs
     ```
     Adulte: 8€
     Enfant (6-12 ans): 5€
     Gratuit -6 ans
     ```
   
   - Informations pratiques
     ```
     Parking gratuit disponible
     Accessible PMR
     Visites guidées sur réservation
     ```

   **Images :**
   - **Image principale** : Utilisez le bouton "Uploader" ou collez une URL
   - **Galerie d'images** : Ajoutez plusieurs URLs séparées par des virgules
     ```
     https://image1.jpg, https://image2.jpg, https://image3.jpg
     ```

5. **Cliquer sur "Enregistrer"**

### Étape 3 : Vérifier les Modifications

1. Les changements sont **immédiats**
2. Allez sur la page "Musées & Patrimoine" du site
3. Vous devriez voir :
   - La nouvelle image principale
   - Les images de la galerie (cliquez dessus pour les voir en grand)
   - Toutes les informations mises à jour

## 🖼️ Gestion des Images

### Option 1 : Utiliser des URLs externes (Actuel)

**Avantages :**
- Simple et rapide
- Pas de limite de stockage
- Fonctionne immédiatement

**Comment faire :**
1. Hébergez vos images sur un service (Imgur, Cloudinary, etc.)
2. Copiez l'URL de l'image
3. Collez-la dans le champ "Image" ou "Galerie d'images"

### Option 2 : Upload direct (Recommandé)

**Avantages :**
- Contrôle total sur vos images
- Pas de dépendance externe
- Intégré à votre base de données

**Comment faire :**
1. Suivez d'abord `SUPABASE-STORAGE-SETUP.md`
2. Dans l'admin, cliquez sur "Uploader une image"
3. Sélectionnez votre fichier (max 5 MB)
4. L'image est automatiquement uploadée et l'URL est générée

### Galerie d'Images

Pour créer une galerie avec plusieurs photos :

1. **Méthode 1 : URLs multiples**
   ```
   https://image1.jpg, https://image2.jpg, https://image3.jpg
   ```

2. **Méthode 2 : Upload multiple** (après configuration Storage)
   - Le composant `ImageUploader` permet de gérer jusqu'à 5 images
   - Glissez-déposez ou cliquez pour ajouter
   - La première image devient l'image principale

## 🔄 Pourquoi les Images se Mettent à Jour Maintenant

### Problème Précédent
Le navigateur mettait en cache les images et ne les rechargeait pas même après modification.

### Solution Implémentée
Ajout d'un paramètre timestamp à chaque URL d'image :
```typescript
<img src={`${museum.imageUrl}?t=${Date.now()}`} />
```

Cela force le navigateur à considérer chaque image comme unique et à la recharger.

## 📱 Affichage sur le Site

### Page Musées

**Grille d'images :**
- 1 grande image principale (2/3 de l'espace)
- 2 petites images de la galerie (1/3 de l'espace)

**Clic sur une image :**
- Ouvre la galerie en plein écran
- Navigation avec flèches gauche/droite
- Compteur d'images (ex: 2/5)
- Fermeture avec X ou Échap

**Modal "En savoir plus" :**
- Affiche TOUTES les informations
- Horaires d'ouverture
- Prix
- Contact (téléphone, email)
- Réseaux sociaux (icônes cliquables)
- Informations pratiques
- Bouton "Voir sur Google Maps"

## 🎨 Champs Optionnels

**Tous les champs sont optionnels** sauf :
- Nom
- Description
- Image principale

Si un champ n'est pas rempli, il ne s'affichera simplement pas sur le site.

## 🔧 Fichiers Modifiés

1. **supabase-schema.sql** - Schéma de base de données mis à jour
2. **supabase-migration.sql** - Script pour ajouter les nouveaux champs
3. **types.ts** - Types TypeScript mis à jour
4. **pages/Museums.tsx** - Page musées avec galerie et nouveaux champs
5. **pages/Admin.tsx** - Formulaire admin avec tous les champs
6. **services/imageUploadService.ts** - Service d'upload d'images (nouveau)
7. **components/ImageUploader.tsx** - Composant d'upload (nouveau)

## 🚀 Prochaines Étapes

1. **Exécuter la migration SQL** dans Supabase
2. **Tester la modification d'un musée** dans l'admin
3. **Optionnel : Configurer Supabase Storage** pour l'upload direct
4. **Remplir les informations** de tous vos musées

## ❓ Questions Fréquentes

**Q : Les anciennes images vont-elles disparaître ?**
R : Non, toutes les images existantes continueront de fonctionner.

**Q : Dois-je obligatoirement configurer Supabase Storage ?**
R : Non, vous pouvez continuer à utiliser des URLs externes.

**Q : Combien d'images puis-je ajouter ?**
R : 1 image principale + jusqu'à 4 images dans la galerie (5 au total).

**Q : Les modifications sont-elles immédiates ?**
R : Oui, dès que vous cliquez sur "Enregistrer", les changements sont visibles.

**Q : Puis-je utiliser ce système pour les restaurants aussi ?**
R : Oui ! Les mêmes champs sont disponibles pour les restaurants (horaires, prix, etc.).

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que la migration SQL a bien été exécutée
3. Vérifiez vos identifiants Supabase dans `.env.local`
