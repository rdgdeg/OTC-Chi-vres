# 🏠 Guide - Retrouver et modifier vos hébergements

## ✅ Vos hébergements sont TOUS présents dans la base de données

### 📋 Liste complète (9 hébergements)

1. **La Loge Bed & Breakfast** - Vaudignies (B&B, 4 pers.)
2. **Au sentier Chauchaut** - Chièvres (B&B, 5 pers.)
3. **La Maison d'à côté** - Tongre-Saint-Martin (Gîte, 5 pers.)
4. **Au Champ du Bouillon** - Tongre-Notre-Dame (Gîte, 4 pers.)
5. **Les Greniers du Moulin** - Grosage (Gîte, 8 pers.)
6. **L'Évasion** - Ladeuze (Insolite/Yacht, 6 pers.)
7. **Moulin du Domissart** - Grosage (Gîte, 24 pers.)
8. **Chez les Kikis** - Chièvres (Gîte, 3 pers.)
9. **On dirait le sud…** - Ladeuze (B&B, 4 pers.)

## 🔍 Comment retrouver vos hébergements

### 1. Dans l'interface admin
**Chemin 1 (direct) :**
- Menu principal → **"Hébergements"**
- Vous verrez la liste complète avec images, statuts, capacités

**Chemin 2 (via gestion) :**
- Menu → **"Gestion du Contenu"**
- Cliquer sur **"Hébergements"**
- Même interface que le chemin 1

### 2. Sur la page publique
- Aller sur : **http://localhost:5173/hebergements**
- Navigation par onglets :
  - **Gîtes** (5 hébergements)
  - **B&B** (3 hébergements)  
  - **Insolite** (1 hébergement - le yacht)
- Filtres par village disponibles

## ✏️ Comment modifier TOUT le contenu textuel

### Modification complète d'un hébergement
1. **Aller dans l'admin** → Hébergements
2. **Cliquer sur l'icône "Modifier"** (crayon) à droite de l'hébergement
3. **L'éditeur complet s'ouvre** avec TOUS les champs :

#### Informations de base
- ✅ **Nom** de l'hébergement
- ✅ **Slug** (URL)
- ✅ **Type** (Gîte, B&B, Hôtel, Camping, Insolite)
- ✅ **Statut** (Brouillon/Publié/Archivé)

#### Descriptions
- ✅ **Description courte** (excerpt)
- ✅ **Description complète** (texte principal)

#### Capacité et chambres
- ✅ **Capacité** (nombre de personnes)
- ✅ **Nombre de chambres**
- ✅ **Description des lits** (ex: "2 lits doubles, 1 lit superposé")
- ✅ **Séjour minimum** (nuits)

#### Localisation
- ✅ **Adresse complète**
- ✅ **Village** (menu déroulant)

#### Contact
- ✅ **Téléphone**
- ✅ **Email**
- ✅ **Site web**
- ✅ **Facebook**

#### Tarifs et horaires
- ✅ **Gamme de prix**
- ✅ **Détails des tarifs**
- ✅ **Heure d'arrivée**
- ✅ **Heure de départ**

#### Image principale
- ✅ **Upload d'image** avec prévisualisation

#### Caractéristiques "Ce que vous aimerez"
- ✅ **Ajout/suppression** de caractéristiques
- ✅ **Modification** de chaque point
- Interface dynamique avec boutons + et -

#### Équipements et règles
- ✅ **Équipements** (ajout/suppression)
- ✅ **Règles de la maison**
- ✅ **Politique d'annulation**

#### SEO
- ✅ **Titre SEO**
- ✅ **Description SEO**

## 🖼️ Ajouter les images (ACTION REQUISE)

### Méthode recommandée (1 minute)
1. **Ouvrir Supabase Dashboard** : https://supabase.com/dashboard
2. **Aller dans votre projet**
3. **SQL Editor** (menu gauche)
4. **Copier-coller** le contenu de `scripts/fix-accommodations-final.sql`
5. **Cliquer "Run"**
6. ✅ **Les 9 images seront ajoutées instantanément**

### Vérification
Après avoir exécuté le SQL :
- Retourner dans l'admin → Hébergements
- Vous devriez voir les miniatures des images
- Sur la page publique, les images s'afficheront dans les fiches

## 📊 État actuel vérifié

```
✅ 9/9 hébergements présents
✅ Contenu exact selon votre texte
✅ Toutes les caractéristiques "Ce que vous aimerez"
✅ Contacts complets (téléphone, email, sites)
✅ Descriptions complètes
✅ Capacités et détails corrects
✅ Villages et adresses exacts
✅ Interface admin complète pour tout modifier
⏳ Images à ajouter (1 script SQL à exécuter)
```

## 🎯 Résultat

Vos 9 hébergements sont **parfaitement intégrés** dans la base de données avec :
- **Contenu exact** selon votre texte fourni
- **Interface admin complète** pour modifier absolument tout
- **Page publique** avec structure identique à la gastronomie
- **Navigation par onglets** et filtres par village
- **Carte interactive** intégrée

Il ne reste qu'à exécuter le script SQL pour les images et tout sera parfait !