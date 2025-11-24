# ✅ Checklist de Vérification

## 🎯 Tests à effectuer

### 1. Page d'accueil (http://localhost:3000)
- [ ] La page se charge correctement
- [ ] Les images s'affichent
- [ ] Le menu de navigation fonctionne
- [ ] Le footer est complet

### 2. Cartes Mapbox

#### Page Musées (http://localhost:3000/#/musees)
- [ ] La carte interactive s'affiche
- [ ] Les marqueurs (pins) sont visibles
- [ ] Cliquer sur un marqueur affiche une popup avec :
  - Photo du lieu
  - Nom
  - Adresse
  - Type
- [ ] Les contrôles de zoom fonctionnent
- [ ] La carte est responsive (tester sur mobile)

#### Page Balades (http://localhost:3000/#/balades)
- [ ] La carte affiche les itinéraires de randonnée
- [ ] Les marqueurs sont de couleur différente (vert émeraude)

#### Page Restaurants (http://localhost:3000/#/restaurants)
- [ ] La carte affiche les restaurants et cafés
- [ ] Les marqueurs sont jaunes (secondary color)

### 3. Base de données Supabase

#### Initialisation
1. Aller sur http://localhost:3000/#/admin
2. Se connecter avec le mot de passe : `admin`
3. Cliquer sur "Initialiser DB"
4. Vérifier le message de confirmation

#### Vérification
- [ ] Les données sont maintenant dans Supabase
- [ ] Rafraîchir la page d'accueil
- [ ] Les données s'affichent toujours correctement

### 4. Assistant IA (si configuré)

#### Chatbot
- [ ] Le bouton flottant (bulle bleue) est visible en bas à droite
- [ ] Cliquer dessus ouvre la fenêtre de chat
- [ ] Poser une question : "Où manger à Chièvres ?"
- [ ] L'assistant répond avec des informations du site

#### Génération d'images
1. Aller sur http://localhost:3000/#/musees
2. Cliquer sur "Générer IA" sur une photo de musée
3. Attendre la génération (peut prendre 10-30 secondes)
4. Vérifier que l'image est remplacée

### 5. Panel Admin

#### Gestion des fiches
- [ ] Ajouter un nouveau restaurant
- [ ] Modifier un musée existant
- [ ] Supprimer un élément
- [ ] Vérifier que les changements sont persistés

#### Gestion des pages
- [ ] Aller dans "Gestion des Pages"
- [ ] Modifier le titre de la page d'accueil
- [ ] Sauvegarder
- [ ] Vérifier sur la page d'accueil que le changement est visible

## 🐛 Problèmes connus et solutions

### La carte ne s'affiche pas
**Symptôme** : Zone grise avec "Carte indisponible"

**Solutions** :
1. Ouvrir la console (F12)
2. Chercher les erreurs Mapbox
3. Vérifier que le token est valide
4. Vérifier la connexion internet

### L'assistant IA ne répond pas
**Symptôme** : Message d'erreur "Clé API manquante"

**Solution** :
1. Créer/éditer `.env.local`
2. Ajouter `GEMINI_API_KEY=votre_clé`
3. Redémarrer le serveur : `Ctrl+C` puis `npm run dev`

### Les données ne se sauvegardent pas
**Symptôme** : Après modification, les données reviennent à l'ancien état

**Solutions** :
1. Vérifier la connexion Supabase dans la console
2. Vérifier que les tables existent dans Supabase
3. Cliquer sur "Initialiser DB" dans l'admin

## 📊 Résultats attendus

### Mapbox
- ✅ Cartes interactives sur 3 pages minimum
- ✅ Marqueurs colorés selon le type
- ✅ Popups avec images et infos
- ✅ Responsive et mobile-friendly

### Supabase
- ✅ Connexion établie
- ✅ Tables créées et remplies
- ✅ CRUD fonctionnel depuis l'admin
- ✅ Données persistées entre les sessions

### Gemini AI (optionnel)
- ✅ Chatbot répond aux questions
- ✅ Génération d'images fonctionnelle
- ✅ Contexte du site utilisé dans les réponses

## 🎉 Validation finale

Si tous les tests passent :
- ✅ L'application est prête pour la production
- ✅ Les cartes Mapbox fonctionnent parfaitement
- ✅ La base de données Supabase est opérationnelle
- ✅ Le CMS admin est fonctionnel

## 📞 Support

En cas de problème, vérifier :
1. `CONFIGURATION.md` pour la configuration détaillée
2. La console du navigateur (F12) pour les erreurs
3. Les logs du serveur dans le terminal
