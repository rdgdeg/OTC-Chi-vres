# 🔧 Configuration VisitChièvres.be

## ✅ État actuel

### 1. Supabase (Base de données)
- **Statut** : ✅ Connexion fonctionnelle
- **URL** : `https://pyrqqruqvvhwmgkhlhed.supabase.co`
- **Configuration** : Credentials en dur avec fallback sur variables d'environnement
- **Base de données** : Vide (prête à être initialisée)

**Action requise** :
1. Aller sur `/admin` (mot de passe: `admin`)
2. Cliquer sur "Initialiser DB" pour synchroniser les données mock

### 2. Mapbox (Cartes interactives)
- **Statut** : ✅ Token configuré et fonctionnel
- **Token** : Inclus dans le code avec fallback sur `VITE_MAPBOX_TOKEN`
- **CSS** : Correctement importé dans `index.html`
- **Fonctionnalités** :
  - Marqueurs colorés par type de lieu
  - Popups avec images
  - Contrôles de navigation
  - Responsive et mobile-friendly

**Aucune action requise** - Les cartes fonctionnent out-of-the-box

### 3. Gemini AI (Assistant virtuel)
- **Statut** : ⚠️ Nécessite configuration
- **Variable** : `GEMINI_API_KEY` dans `.env.local`
- **Utilisation** :
  - Chatbot intelligent (connaît tout le contenu du site)
  - Génération d'images pour les musées

**Action requise** :
1. Obtenir une clé API gratuite sur https://ai.google.dev/
2. L'ajouter dans `.env.local` :
   ```
   GEMINI_API_KEY=votre_clé_ici
   ```
3. Redémarrer le serveur dev

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'API Gemini (optionnel mais recommandé)
cp .env.example .env.local
# Éditer .env.local et ajouter votre GEMINI_API_KEY

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir http://localhost:3000
```

## 📊 Structure des tables Supabase

Les tables suivantes doivent exister dans Supabase :

### `places`
- id (text, primary key)
- name (text)
- description (text)
- address (text)
- imageUrl (text)
- type (text) - 'museum' | 'restaurant' | 'hotel' | 'shop' | 'walk' | 'cafe' | 'producer'
- rating (numeric, optional)
- phone (text, optional)
- website (text, optional)
- tags (text[], array)
- lat (numeric, optional)
- lng (numeric, optional)
- distance (text, optional)
- duration (text, optional)
- difficulty (text, optional)
- galleryImages (text[], array, optional)

### `experiences`
- id (text, primary key)
- title (text)
- description (text)
- category (text) - 'adulte' | 'enfant' | 'teambuilding' | 'famille'
- price (text)
- duration (text)
- imageUrl (text)
- features (text[], array)

### `events`
- id (text, primary key)
- title (text)
- date (text)
- day (integer)
- month (text)
- description (text)
- location (text)
- category (text) - 'folklore' | 'culture' | 'sport' | 'marché'
- imageUrl (text)

### `articles`
- id (text, primary key)
- title (text)
- excerpt (text)
- date (text)
- author (text)
- imageUrl (text)
- category (text)

### `products`
- id (text, primary key)
- name (text)
- price (numeric)
- description (text)
- imageUrl (text)
- category (text) - 'souvenir' | 'livre' | 'terroir'

### `page_content`
- id (text, primary key)
- heroTitle (text)
- heroSubtitle (text)
- heroImage (text)
- introTitle (text, optional)
- introText (text, optional)
- extraTitle (text, optional)
- extraText (text, optional)
- extraImage (text, optional)

## 🔐 Sécurité

- Les clés Supabase `anon` sont publiques par design (RLS doit être configuré côté Supabase)
- Le token Mapbox est public (normal pour une utilisation frontend)
- La clé Gemini API doit rester privée (ne pas commit `.env.local`)

## 🐛 Dépannage

### Les cartes ne s'affichent pas
1. Vérifier que le CSS Mapbox est chargé (F12 > Network)
2. Vérifier la console pour les erreurs
3. Le token Mapbox est valide et actif

### L'assistant IA ne répond pas
1. Vérifier que `GEMINI_API_KEY` est défini dans `.env.local`
2. Redémarrer le serveur dev après modification du `.env.local`
3. Vérifier la console pour les erreurs API

### La base de données est vide
1. Aller sur `/admin`
2. Se connecter (mot de passe: `admin`)
3. Cliquer sur "Initialiser DB"
4. Attendre la confirmation

## 📝 Notes

- Le mot de passe admin par défaut est `admin` (à changer en production)
- Les images peuvent être uploadées en Base64 (max 2Mo recommandé)
- Le fallback sur mockData garantit que le site fonctionne même sans Supabase
