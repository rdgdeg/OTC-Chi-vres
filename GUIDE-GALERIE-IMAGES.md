# Guide Complet - Galerie d'Images par Upload 📸

## ✨ Fonctionnalités

La galerie d'images permet d'uploader plusieurs photos pour chaque élément (musées, restaurants, hébergements, commerces).

### Caractéristiques

- ✅ **Upload multiple** - Sélectionnez plusieurs images en une fois
- ✅ **Drag & Drop** - Glissez-déposez vos images (à venir)
- ✅ **Aperçu instantané** - Visualisez vos images avant sauvegarde
- ✅ **Suppression facile** - Retirez une image en un clic
- ✅ **Stockage Supabase** - Images hébergées sur Supabase Storage
- ✅ **Optimisation automatique** - Compression et redimensionnement
- ✅ **Image principale** - La première image est l'image principale

### Limites par Type

| Type | Nombre Max | Dossier |
|------|-----------|---------|
| Musées | 10 images | `museums/` |
| Restaurants | 8 images | `restaurants/` |
| Hébergements | 10 images | `accommodation/` |
| Commerçants | 6 images | `merchants/` |

## 🎯 Comment Utiliser

### 1. Accéder à l'Admin

```
http://localhost:3000/#/admin
Mot de passe : admin
```

### 2. Ajouter des Images à un Musée

#### Étape 1 : Sélectionner le Musée
1. Cliquez sur **"Musées & Patrimoine"** dans la sidebar
2. Cliquez sur **"Éditer"** (icône crayon) sur le musée souhaité

#### Étape 2 : Uploader les Images
1. Descendez jusqu'à la section **"Galerie d'images"**
2. Cliquez sur le bouton **"Ajouter"** ou sur une case vide
3. Sélectionnez une ou plusieurs images (Ctrl/Cmd + clic pour sélection multiple)
4. Attendez que l'upload se termine (icône de chargement)
5. Les images apparaissent dans la grille

#### Étape 3 : Organiser les Images
- **Image principale** : La première image (badge "Principal")
- **Réorganiser** : Glissez-déposez pour changer l'ordre (à venir)
- **Supprimer** : Survolez une image → Cliquez sur l'icône ❌

#### Étape 4 : Enregistrer
1. Cliquez sur **"Enregistrer"** en bas du formulaire
2. Attendez la confirmation
3. Cliquez sur **"Rafraîchir"** en haut de la page

### 3. Vérifier sur le Site

1. Allez sur la page **Musées** : `http://localhost:3000/#/musees`
2. Rafraîchissez avec `Ctrl + Shift + R`
3. Vos images apparaissent dans la galerie du musée

## 📋 Formats Supportés

### Images Acceptées
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF (non animé recommandé)

### Taille Recommandée
- **Largeur** : 1200-1920px
- **Hauteur** : 800-1080px
- **Poids** : < 2 Mo par image
- **Ratio** : 16:9 ou 4:3 recommandé

### Optimisation Avant Upload

Pour de meilleures performances, optimisez vos images :

**Outils en ligne :**
- [TinyPNG](https://tinypng.com/) - Compression PNG/JPG
- [Squoosh](https://squoosh.app/) - Compression avancée
- [ImageOptim](https://imageoptim.com/) - Mac uniquement

**Recommandations :**
```
Résolution : 1920x1080px max
Qualité : 80-85%
Format : JPG pour photos, PNG pour logos
```

## 🎨 Affichage sur le Site

### Page Musées

Les images de la galerie s'affichent dans une grille :

```
┌─────────────────┬──────┬──────┐
│                 │      │      │
│  Image          │ Img2 │ Img3 │
│  Principale     │      │      │
│  (Grande)       ├──────┼──────┤
│                 │ Img4 │ Img5 │
└─────────────────┴──────┴──────┘
```

- **Image principale** : Grande, à gauche (2 colonnes)
- **Images secondaires** : Petites, à droite (1 colonne chacune)
- **Hover** : Zoom léger sur survol
- **Clic** : Ouvre en plein écran (à venir)

### Responsive Mobile

Sur mobile, la galerie s'adapte :

```
┌─────────────────┐
│                 │
│  Image          │
│  Principale     │
│                 │
├────────┬────────┤
│  Img2  │  Img3  │
└────────┴────────┘
```

## 🔧 Configuration Technique

### Structure Supabase Storage

```
images/
├── museums/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.jpg
│   └── ...
├── restaurants/
│   └── ...
├── accommodation/
│   └── ...
└── merchants/
    └── ...
```

### Nom des Fichiers

Format automatique :
```
{folder}/{timestamp}-{random}.{extension}

Exemple :
museums/1732547890-x7k9m2.jpg
```

### URLs Générées

```
https://[project].supabase.co/storage/v1/object/public/images/museums/1732547890-x7k9m2.jpg
```

## 🛠️ Dépannage

### L'upload ne fonctionne pas

**Vérifications :**

1. **Bucket existe** :
   - Supabase → Storage → Vérifier bucket "images"

2. **Bucket est public** :
   ```sql
   -- Dans Supabase SQL Editor
   SELECT * FROM storage.buckets WHERE name = 'images';
   -- public devrait être true
   ```

3. **Politiques RLS** :
   ```sql
   -- Politique de lecture publique
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'images' );

   -- Politique d'upload (authentifié ou public selon besoin)
   CREATE POLICY "Upload Access"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'images' );
   ```

4. **Taille du fichier** :
   - Vérifier que l'image < 2 Mo
   - Compresser si nécessaire

5. **Console navigateur** :
   - F12 → Console
   - Chercher les erreurs en rouge

### Les images ne s'affichent pas

**Solutions :**

1. **Vérifier l'URL** :
   ```javascript
   // Dans la console
   console.log(museum.galleryImages);
   // Devrait afficher un tableau d'URLs
   ```

2. **Tester l'URL directement** :
   - Copier une URL d'image
   - Ouvrir dans un nouvel onglet
   - Si erreur 404 → Image supprimée ou bucket privé

3. **Vider le cache** :
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

4. **Vérifier les CORS** :
   - Supabase → Storage → Configuration
   - Vérifier que les CORS sont configurés

### L'image est floue

**Causes :**
- Image source trop petite
- Compression trop forte
- Mauvais ratio d'aspect

**Solutions :**
1. Uploader une image plus grande (1920px min)
2. Réduire la compression (qualité 85%+)
3. Respecter le ratio 16:9 ou 4:3

### Upload lent

**Optimisations :**

1. **Compresser avant upload** :
   - Utiliser TinyPNG ou Squoosh
   - Réduire à 1920px max

2. **Upload par lots** :
   - Uploader 2-3 images à la fois
   - Attendre la fin avant d'ajouter plus

3. **Connexion** :
   - Vérifier votre connexion internet
   - Éviter les heures de pointe

## 📊 Bonnes Pratiques

### Nommage des Images

Avant upload, renommez vos images :

```
❌ Mauvais :
IMG_1234.jpg
DSC_5678.jpg
photo.jpg

✅ Bon :
musee-chievres-facade.jpg
musee-chievres-interieur.jpg
musee-chievres-collection.jpg
```

### Organisation

1. **Image principale** : Façade ou vue d'ensemble
2. **Images 2-3** : Intérieur, détails
3. **Images 4-5** : Collections, expositions
4. **Images 6+** : Ambiance, visiteurs

### Qualité

- ✅ Lumière naturelle ou bonne luminosité
- ✅ Netteté parfaite (pas de flou)
- ✅ Cadrage soigné
- ✅ Couleurs fidèles
- ❌ Éviter les photos sombres
- ❌ Éviter les photos pixelisées
- ❌ Éviter les watermarks

### Droits d'Auteur

⚠️ **Important** : Assurez-vous d'avoir les droits sur les images uploadées.

- ✅ Photos prises par vous
- ✅ Photos libres de droits (Unsplash, Pexels)
- ✅ Photos avec autorisation écrite
- ❌ Photos trouvées sur Google Images
- ❌ Photos d'autres sites web

## 🚀 Fonctionnalités Futures

### En Développement

- [ ] **Drag & Drop** - Glisser-déposer les images
- [ ] **Réorganisation** - Changer l'ordre par glisser-déposer
- [ ] **Lightbox** - Visualisation plein écran
- [ ] **Zoom** - Zoom sur les images
- [ ] **Métadonnées** - Ajouter titre et description par image
- [ ] **Crop** - Recadrer les images
- [ ] **Filtres** - Appliquer des filtres
- [ ] **Batch upload** - Upload de dossier complet

### Améliorations Prévues

- [ ] **Compression automatique** - Optimisation côté serveur
- [ ] **Formats WebP** - Conversion automatique
- [ ] **Thumbnails** - Génération de miniatures
- [ ] **CDN** - Distribution via CDN
- [ ] **Lazy loading** - Chargement progressif
- [ ] **Progressive images** - Chargement progressif

## 📞 Support

### Problème Persistant ?

1. **Vérifier** `GUIDE-RAFRAICHISSEMENT.md`
2. **Consulter** `SUPABASE-STORAGE-SETUP.md`
3. **Lire** `VERIFICATION.md`
4. **Ouvrir** DevTools (F12) et copier les erreurs

### Ressources

- [Documentation Supabase Storage](https://supabase.com/docs/guides/storage)
- [Guide Upload Images](GUIDE-GESTION-IMAGES.md)
- [Configuration Supabase](SUPABASE-STORAGE-SETUP.md)

---

**Dernière mise à jour** : 25 novembre 2025
**Version** : 2.1.0 (Galerie Upload)
