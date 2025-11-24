# 📚 Documentation VisitChièvres.be

## 🎯 Par où commencer ?

### Nouveau sur le projet ?
👉 **Commence par** : [`QUICK-START.md`](QUICK-START.md)
- Démarrage en 3 minutes
- Tests essentiels
- Vérification rapide

### Besoin de configurer l'environnement ?
👉 **Consulte** : [`CONFIGURATION.md`](CONFIGURATION.md)
- Configuration Supabase
- Configuration Mapbox
- Configuration Gemini AI
- Variables d'environnement

### Problème technique ?
👉 **Vérifie** : [`VERIFICATION.md`](VERIFICATION.md)
- Checklist complète de tests
- Dépannage des problèmes courants
- Solutions aux erreurs fréquentes

### Vue d'ensemble technique ?
👉 **Lis** : [`RESUME.md`](RESUME.md)
- État du projet
- Technologies utilisées
- Améliorations apportées
- Statistiques

### Initialiser la base de données ?
👉 **Utilise** : [`supabase-schema.sql`](supabase-schema.sql)
- Schéma SQL complet
- Tables et relations
- Indexes et triggers
- Politiques RLS

## 📖 Structure de la documentation

```
📁 Documentation
├── 🚀 QUICK-START.md          ← Commence ici !
├── 🔧 CONFIGURATION.md         ← Configuration détaillée
├── ✅ VERIFICATION.md          ← Tests et dépannage
├── 📋 RESUME.md                ← Vue d'ensemble
├── 🗄️ supabase-schema.sql     ← Schéma de la base
├── 📝 .env.example             ← Template de configuration
└── 📚 DOCS-INDEX.md            ← Ce fichier
```

## 🎓 Guides par tâche

### Je veux...

#### ...démarrer l'application
1. `npm install`
2. `npm run dev`
3. Ouvrir http://localhost:3000
→ Voir [`QUICK-START.md`](QUICK-START.md)

#### ...configurer les cartes Mapbox
Les cartes fonctionnent déjà ! Token inclus.
Pour utiliser ton propre token :
1. Créer `.env.local`
2. Ajouter `VITE_MAPBOX_TOKEN=ton_token`
→ Voir [`CONFIGURATION.md`](CONFIGURATION.md) section Mapbox

#### ...initialiser la base de données
1. Aller sur http://localhost:3000/#/admin
2. Mot de passe : `admin`
3. Cliquer "Initialiser DB"
→ Voir [`QUICK-START.md`](QUICK-START.md) Étape 2

#### ...activer l'assistant IA
1. Obtenir une clé sur https://ai.google.dev/
2. L'ajouter dans `.env.local`
3. Redémarrer le serveur
→ Voir [`CONFIGURATION.md`](CONFIGURATION.md) section Gemini

#### ...ajouter du contenu
1. Aller sur `/admin`
2. Choisir une catégorie (Musées, Restaurants, etc.)
3. Cliquer "Ajouter"
4. Remplir le formulaire
→ Voir [`QUICK-START.md`](QUICK-START.md) section Personnalisation

#### ...modifier les textes des pages
1. Admin → "Gestion des Pages"
2. Sélectionner une page
3. Modifier les champs
4. Sauvegarder
→ Voir [`QUICK-START.md`](QUICK-START.md) section Personnalisation

#### ...déployer en production
1. `npm run build`
2. Déployer le dossier `dist/`
3. Configurer les variables d'environnement
4. Changer le mot de passe admin
→ Voir [`RESUME.md`](RESUME.md) section Prochaines étapes

## 🔍 Recherche rapide

### Erreurs courantes

| Erreur | Solution | Documentation |
|--------|----------|---------------|
| Carte ne s'affiche pas | Vérifier le token Mapbox | [`VERIFICATION.md`](VERIFICATION.md) |
| Chatbot ne répond pas | Configurer `GEMINI_API_KEY` | [`CONFIGURATION.md`](CONFIGURATION.md) |
| Données ne se sauvent pas | Initialiser la DB | [`QUICK-START.md`](QUICK-START.md) |
| Build échoue | Vérifier les dépendances | [`README.md`](README.md) |

### Configurations

| Service | Fichier | Obligatoire ? |
|---------|---------|---------------|
| Gemini AI | `.env.local` | Non (optionnel) |
| Mapbox | `.env.local` | Non (token inclus) |
| Supabase | `.env.local` | Non (credentials inclus) |

### Commandes utiles

```bash
# Développement
npm run dev              # Démarrer le serveur dev
npm run build            # Build de production
npm run preview          # Prévisualiser le build

# Dépendances
npm install              # Installer les dépendances
npm list                 # Lister les packages installés
```

## 🎯 Checklist de démarrage

- [ ] Lire [`QUICK-START.md`](QUICK-START.md)
- [ ] Installer les dépendances (`npm install`)
- [ ] Démarrer le serveur (`npm run dev`)
- [ ] Tester les cartes Mapbox
- [ ] Initialiser la base de données
- [ ] Tester le CRUD admin
- [ ] (Optionnel) Configurer Gemini AI

## 📞 Support

### En cas de problème

1. **Console du navigateur** (F12) → Onglet Console
2. **Logs du serveur** → Terminal où tourne `npm run dev`
3. **Documentation** → Consulter les fichiers ci-dessus
4. **Supabase Dashboard** → Vérifier les tables et données

### Ressources externes

- [Mapbox Documentation](https://docs.mapbox.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🎨 Architecture du projet

```
visitchievres.be/
├── components/          # Composants React réutilisables
│   ├── Layout.tsx      # Layout principal avec nav et footer
│   ├── Hero.tsx        # Bannière hero
│   ├── InteractiveMap.tsx  # Carte Mapbox
│   └── AiAssistant.tsx # Chatbot IA
├── pages/              # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Museums.tsx     # Page musées
│   ├── Admin.tsx       # Panel admin
│   └── ...
├── services/           # Services externes
│   ├── supabaseClient.ts   # Client Supabase
│   └── geminiService.ts    # Service Gemini AI
├── contexts/           # Contextes React
│   └── DataContext.tsx # Gestion des données
├── data/               # Données mock
│   └── mockData.ts     # Données de fallback
└── types.ts            # Types TypeScript
```

## 🚀 Prêt à commencer ?

👉 **Commence par** [`QUICK-START.md`](QUICK-START.md) et suis les étapes !

---

**Dernière mise à jour** : Novembre 2024
**Version** : 1.0.0
