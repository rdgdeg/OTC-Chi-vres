# 🚀 Quick Start - VisitChièvres.be

## ⚡ Démarrage en 3 minutes

### Étape 1 : Vérifier que ça tourne
Le serveur dev est déjà lancé sur **http://localhost:3000**

Ouvre ton navigateur et va sur :
- 🏠 http://localhost:3000 (Page d'accueil)
- 🏛️ http://localhost:3000/#/musees (Voir les cartes Mapbox)
- 🔐 http://localhost:3000/#/admin (Panel admin)

### Étape 2 : Initialiser la base de données
1. Va sur http://localhost:3000/#/admin
2. Mot de passe : `admin`
3. Clique sur le bouton vert **"Initialiser DB"**
4. Attends la confirmation "Base de données synchronisée avec succès !"

✅ C'est fait ! Les données sont maintenant dans Supabase.

### Étape 3 : Tester les cartes Mapbox
1. Va sur http://localhost:3000/#/musees
2. Tu devrais voir une carte interactive avec des marqueurs
3. Clique sur un marqueur → une popup s'affiche avec photo et infos
4. Teste le zoom avec la molette ou les boutons +/-

✅ Si tu vois la carte avec les marqueurs, Mapbox fonctionne parfaitement !

## 🎯 Tests rapides

### Test des cartes sur différentes pages
- **Musées** : http://localhost:3000/#/musees (marqueurs bleus)
- **Balades** : http://localhost:3000/#/balades (marqueurs verts)
- **Restaurants** : http://localhost:3000/#/restaurants (marqueurs jaunes)

### Test du CRUD admin
1. Dans l'admin, clique sur "Musées & Patrimoine"
2. Clique sur "Ajouter"
3. Remplis le formulaire
4. Sauvegarde
5. Vérifie que le nouveau musée apparaît dans la liste

## 🤖 Activer l'IA (optionnel)

Si tu veux tester le chatbot et la génération d'images :

1. Obtiens une clé API gratuite sur https://ai.google.dev/
2. Ouvre le fichier `.env.local`
3. Remplace `your_gemini_api_key_here` par ta vraie clé
4. Redémarre le serveur :
   ```bash
   # Dans le terminal, fais Ctrl+C puis :
   npm run dev
   ```
5. Teste le chatbot (bulle bleue en bas à droite)

## 📊 Vérification rapide

### ✅ Tout fonctionne si :
- [ ] La page d'accueil s'affiche correctement
- [ ] Les cartes Mapbox montrent des marqueurs
- [ ] Les popups s'affichent au clic sur un marqueur
- [ ] L'admin permet d'ajouter/modifier/supprimer des éléments
- [ ] Les changements sont sauvegardés (persistent après refresh)

### ❌ Problème ?
Consulte `VERIFICATION.md` pour le dépannage détaillé.

## 🎨 Personnalisation rapide

### Changer le texte de la page d'accueil
1. Admin → "Gestion des Pages"
2. Sélectionne "Page d'Accueil"
3. Modifie les textes
4. Sauvegarde
5. Rafraîchis la page d'accueil

### Ajouter un restaurant
1. Admin → "Restaurants"
2. Clique "Ajouter"
3. Remplis :
   - Nom
   - Description
   - Adresse
   - Upload une photo ou colle une URL
   - Tags (ex: "Brasserie, Terrasse")
4. Sauvegarde

### Modifier une photo de musée
1. Va sur la page Musées (frontend)
2. Clique sur "Générer IA" sur une photo
3. Attends 10-30 secondes
4. L'IA génère une nouvelle image

## 📱 Test mobile

1. Sur ton téléphone, va sur : http://192.168.0.6:3000
   (remplace par l'IP affichée dans ton terminal)
2. Teste la navigation
3. Teste les cartes (pinch to zoom)
4. Vérifie le menu hamburger

## 🎉 C'est tout !

Ton site touristique est opérationnel avec :
- ✅ Cartes interactives Mapbox
- ✅ Base de données Supabase
- ✅ Panel admin complet
- ✅ Design responsive
- ✅ 14 pages fonctionnelles

## 📚 Pour aller plus loin

- `CONFIGURATION.md` - Configuration détaillée
- `VERIFICATION.md` - Tests complets
- `RESUME.md` - Vue d'ensemble technique
- `supabase-schema.sql` - Schéma de la base de données

## 💡 Astuces

- **Mot de passe admin** : `admin` (à changer en production)
- **Port dev** : 3000 (configurable dans `vite.config.ts`)
- **Hot reload** : Les modifications de code sont automatiquement rechargées
- **Build prod** : `npm run build` puis `npm run preview`

---

**Besoin d'aide ?** Consulte les fichiers de documentation ou ouvre la console du navigateur (F12) pour voir les erreurs éventuelles.
