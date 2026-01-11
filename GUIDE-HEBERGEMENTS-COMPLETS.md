# Guide Complet - Hébergements Chièvres

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer les 9 hébergements de Chièvres avec toutes leurs données complètes : descriptions détaillées, coordonnées GPS, contacts, caractéristiques et images par défaut.

## 🏠 Liste des Hébergements

1. **La Loge Bed & Breakfast** (Vaudignies) - Bed & Breakfast - 2-4 pers.
2. **Au sentier Chauchaut** (Chièvres) - Chambre d'hôtes - 3-5 pers.
3. **La Maison d'à côté** (Tongre-Saint-Martin) - Gîte 3 épis - 5 pers.
4. **Au Champ du Bouillon** (Tongre-Notre-Dame) - Gîte avec spa - 2-4 pers.
5. **Les Greniers du Moulin** (Grosage) - Gîte à la ferme - 8 pers.
6. **L'Évasion** (Ladeuze) - Yacht insolite - 6 pers.
7. **Moulin du Domissart** (Grosage) - Moulin historique - 24 pers.
8. **Chez les Kikis** (Chièvres) - Gîte rural - 2-3 pers.
9. **On dirait le sud…** (Ladeuze) - Chambre d'hôtes avec piscine - 4 pers.

## 🚀 Configuration Automatique

### Option 1: Script Complet (Recommandé)

```bash
# Exécuter la configuration complète
cd OTC-Chi-vres
node scripts/setup-complete-accommodations.js
```

Ce script fait tout automatiquement :
- ✅ Vérifie/crée la table accommodations
- ✅ Met à jour avec les données complètes
- ✅ Ajoute les images par défaut
- ✅ Effectue une vérification finale

### Option 2: Étapes Manuelles

Si vous préférez contrôler chaque étape :

```bash
# 1. Créer la table (si nécessaire)
node scripts/run-migration.js migrations/accommodations-simple.sql

# 2. Mettre à jour les données
node scripts/update-accommodations-complete-data.js

# 3. Ajouter les images
node scripts/add-default-images-accommodations.js

# 4. Vérifier le résultat
node scripts/verify-accommodations-complete.js
```

## 📊 Données Incluses

### Informations de Base
- ✅ Nom et description détaillée
- ✅ Type d'hébergement (gîte, B&B, insolite)
- ✅ Capacité et nombre de chambres
- ✅ Adresse complète et village

### Localisation
- ✅ Coordonnées GPS précises
- ✅ Village d'appartenance
- ✅ Adresse complète

### Contact
- ✅ Téléphone
- ✅ Email
- ✅ Site web (si disponible)
- ✅ Page Facebook (si disponible)

### Caractéristiques
- ✅ Points forts spécifiques
- ✅ Équipements disponibles
- ✅ Gamme de prix
- ✅ Descriptions des lits/chambres

### SEO
- ✅ Meta titre optimisé
- ✅ Meta description
- ✅ Slug URL convivial

### Images
- ✅ Image principale par défaut
- ✅ Galerie de 3 images
- ✅ Images adaptées au type d'hébergement

## 🔍 Vérification

Après la configuration, vérifiez :

1. **Interface Admin** : Allez dans l'admin → Hébergements
2. **Page Publique** : Visitez `/hebergements`
3. **Détails** : Cliquez sur chaque hébergement

### Commandes de Vérification

```bash
# Vérification complète
node scripts/verify-accommodations-complete.js

# Vérification rapide en base
node -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data } = await supabase.from('accommodations').select('name, village, type').order('name');
console.log('Hébergements:', data.map(h => \`\${h.name} (\${h.village})\`));
"
```

## 🖼️ Gestion des Images

### Images par Défaut
Les scripts ajoutent des images Unsplash appropriées :
- **Bed & Breakfast** : Images de chambres d'hôtes
- **Gîtes** : Images de maisons rurales
- **Insolite** : Images de yacht/bateaux
- **Spécifiques** : Images de moulin, ferme, piscine

### Remplacer par de Vraies Photos

1. **Via l'Admin** :
   - Allez dans Hébergements → Modifier
   - Uploadez les vraies photos
   - Sauvegardez

2. **Via Script** (pour plusieurs à la fois) :
   ```bash
   # Créer un script personnalisé pour vos images
   node scripts/update-real-images.js
   ```

## 📱 Fonctionnalités Disponibles

### Page Hébergements
- ✅ Liste avec filtres par type/village
- ✅ Cartes avec images et infos
- ✅ Recherche par capacité
- ✅ Tri par nom/prix/capacité

### Page Détail
- ✅ Galerie d'images
- ✅ Informations complètes
- ✅ Carte de localisation
- ✅ Boutons de contact
- ✅ Caractéristiques détaillées

### Interface Admin
- ✅ Gestion complète des hébergements
- ✅ Upload d'images
- ✅ Modification des textes
- ✅ Gestion du statut (publié/brouillon)

## 🔧 Personnalisation

### Modifier les Données
Éditez `scripts/update-accommodations-complete-data.js` et relancez :
```bash
node scripts/update-accommodations-complete-data.js
```

### Ajouter des Hébergements
1. Ajoutez les données dans le script
2. Relancez la mise à jour
3. Vérifiez le résultat

### Modifier les Images par Défaut
Éditez `scripts/add-default-images-accommodations.js` avec vos URLs.

## 🆘 Dépannage

### Erreur de Connexion Supabase
```bash
# Vérifiez les variables d'environnement
cat .env.local | grep SUPABASE
```

### Table Manquante
```bash
# Recréer la table
node scripts/run-migration.js migrations/accommodations-simple.sql
```

### Données Incomplètes
```bash
# Vérifier ce qui manque
node scripts/verify-accommodations-complete.js
```

### Images Non Affichées
1. Vérifiez les URLs dans la base
2. Testez les liens dans le navigateur
3. Relancez l'ajout d'images

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez les logs des scripts
2. Vérifiez la connexion Supabase
3. Testez étape par étape avec les scripts individuels

---

**✅ Configuration terminée !** Vos 9 hébergements sont maintenant prêts avec toutes leurs données complètes.