# 🔄 Guide Final - Synchronisation Admin ↔ Page Publique

## ✅ Problèmes identifiés et solutions

### 1. Hébergements présents mais pas visibles
**Diagnostic :** Tous les 9 hébergements sont en base et publiés
**Solution :** Vider le cache du navigateur (Ctrl+F5)

### 2. Champs Type, Localisation, Capacité peu visibles
**Solution :** Interface admin améliorée avec section en évidence

### 3. Coordonnées GPS manquantes pour la carte
**Solution :** Script SQL pour ajouter les coordonnées géocodées

## 🎯 Actions à effectuer

### ÉTAPE 1 : Ajouter les coordonnées GPS
Exécuter dans Supabase SQL Editor :
```sql
-- Copier le contenu de scripts/add-coordinates-to-accommodations.sql
ALTER TABLE accommodations 
ADD COLUMN IF NOT EXISTS lat NUMERIC,
ADD COLUMN IF NOT EXISTS lng NUMERIC;

UPDATE accommodations SET lat = 50.5860, lng = 3.7783 WHERE name = 'Au Champ du Bouillon';
-- ... (voir le fichier complet)
```

### ÉTAPE 2 : Vider le cache du navigateur
- **Chrome/Edge :** Ctrl+Shift+R ou F12 → Network → Disable cache
- **Firefox :** Ctrl+Shift+R
- **Safari :** Cmd+Option+R

### ÉTAPE 3 : Tester la page publique
1. Aller sur : **http://localhost:5173/hebergements**
2. Vérifier les onglets :
   - **Gîtes** (5 hébergements)
   - **B&B** (3 hébergements)
   - **Insolite** (1 hébergement - le yacht)
3. Tester les filtres par village
4. Vérifier que la carte s'affiche avec les marqueurs

### ÉTAPE 4 : Tester l'admin amélioré
1. Aller dans **Admin → Hébergements**
2. Vérifier la section **"Informations principales"** en bleu
3. Les champs **Type**, **Localisation**, **Capacité** sont maintenant en évidence
4. Modifier un hébergement pour tester

## 📊 État attendu après les corrections

### Page publique (http://localhost:5173/hebergements)
```
🏠 Onglet Gîtes (5) :
   - Au Champ du Bouillon (4 pers.)
   - Chez les Kikis (3 pers.)
   - La Maison d'à côté (5 pers.)
   - Les Greniers du Moulin (8 pers.)
   - Moulin du Domissart (24 pers.)

🏡 Onglet B&B (3) :
   - Au sentier Chauchaut (5 pers.)
   - La Loge Bed & Breakfast (4 pers.)
   - On dirait le sud… (4 pers.)

⭐ Onglet Insolite (1) :
   - L'Évasion (6 pers.)
```

### Filtres par village
```
📍 Chièvres (2) : Au sentier Chauchaut, Chez les Kikis
📍 Ladeuze (2) : L'Évasion, On dirait le sud…
📍 Grosage (2) : Les Greniers du Moulin, Moulin du Domissart
📍 Tongre-Notre-Dame (1) : Au Champ du Bouillon
📍 Vaudignies (1) : La Loge Bed & Breakfast
📍 Tongre-Saint-Martin (1) : La Maison d'à côté
```

### Carte interactive
```
🗺️ 9 marqueurs avec coordonnées GPS précises
📍 Popups avec image et informations
🎯 Zoom automatique sur la région de Chièvres
```

### Admin amélioré
```
📋 Section "Informations principales" en évidence :
   🏠 Type d'hébergement (menu déroulant)
   📍 Localisation/Adresse (champ texte)
   👥 Capacité (nombre de personnes)

📊 Affichage liste admin :
   - Images miniatures
   - Type, capacité, village
   - Coordonnées GPS (si disponibles)
   - Statut de publication
```

## 🔍 Diagnostic en cas de problème

### Si les hébergements n'apparaissent toujours pas :
```bash
# Vérifier les données
node scripts/diagnose-accommodations-sync.js

# Forcer le rafraîchissement
node scripts/force-refresh-accommodations.js
```

### Si la carte ne s'affiche pas :
```bash
# Vérifier les coordonnées
node scripts/check-coordinates.js
```

### Si l'admin ne fonctionne pas :
1. Vérifier les permissions utilisateur
2. Vérifier la connexion à Supabase
3. Regarder la console du navigateur (F12)

## 🎉 Résultat final

Après ces corrections, vous aurez :
- ✅ **9 hébergements visibles** sur la page publique
- ✅ **Navigation par onglets** fonctionnelle
- ✅ **Filtres par village** opérationnels
- ✅ **Carte interactive** avec marqueurs GPS précis
- ✅ **Admin complet** avec champs Type/Localisation/Capacité en évidence
- ✅ **Synchronisation parfaite** entre admin et page publique

La page hébergements aura exactement la même structure que votre page gastronomie !