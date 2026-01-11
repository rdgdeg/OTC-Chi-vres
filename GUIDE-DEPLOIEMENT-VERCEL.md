# Guide de Déploiement Vercel

## 🎯 Résumé des Fonctionnalités Complétées

### ✅ Gestionnaire de Contenu des Pages
- **Toutes les 14 pages du site** sont maintenant éditables via l'admin
- **Images de bannière** modifiables avec upload vers Supabase Storage
- **Contenu textuel** complet (titre, sous-titre, description, SEO)
- **Interface intuitive** avec prévisualisation et sauvegarde

### 📄 Pages Gérées
1. **Accueil** (`/`)
2. **Musées & Patrimoine** (`/musees`)
3. **Hébergements** (`/hebergements`)
4. **Gastronomie & Terroir** (`/restaurants`)
5. **Commerces** (`/commercants`)
6. **Balades & Randonnées** (`/balades`)
7. **Expériences** (`/experiences`)
8. **Agenda & Événements** (`/agenda`)
9. **Blog & Actualités** (`/blog`)
10. **Boutique** (`/boutique`)
11. **Contact** (`/contact`)
12. **Notre Équipe** (`/equipe`)
13. **Crossage** (`/crossage`)
14. **Bulletin Municipal** (`/bulletin`)

## 🚀 Déploiement Automatique

### Méthode 1: Script Automatique
```bash
cd OTC-Chi-vres
./scripts/deploy-to-vercel.sh
```

### Méthode 2: Commandes Git Manuelles
```bash
# Ajouter tous les fichiers
git add .

# Commit avec message descriptif
git commit -m "Ajout du gestionnaire de contenu des pages - Toutes les pages éditables"

# Push vers le dépôt
git push origin main
```

## 🔧 Configuration Vercel

### Variables d'Environnement Requises
```env
# Supabase Configuration
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase

# Configuration de Build
VITE_APP_ENV=production
```

### Configuration de Build (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📋 Checklist Pré-Déploiement

### ✅ Fonctionnalités Testées
- [x] Gestionnaire de pages accessible via `/admin-dashboard`
- [x] Modification des titres et sous-titres
- [x] Upload d'images de bannière
- [x] Sauvegarde des modifications
- [x] Prévisualisation des pages
- [x] Intégration avec toutes les pages du site

### ✅ Intégrations Complètes
- [x] Context PageContent créé et intégré
- [x] Composant PageHero pour affichage uniforme
- [x] Service d'upload d'images fonctionnel
- [x] Persistance localStorage (temporaire)
- [x] Interface admin complète

## 🎨 Utilisation du Gestionnaire

### Accès Admin
1. Aller sur `/admin-dashboard`
2. Se connecter avec les identifiants admin
3. Cliquer sur "Gestion des Pages" dans le menu

### Modification d'une Page
1. Sélectionner la page dans la liste
2. Cliquer sur "Modifier"
3. Modifier le contenu souhaité
4. Uploader une nouvelle image si nécessaire
5. Cliquer sur "Sauvegarder"

### Upload d'Images
- **Format supporté**: JPG, PNG, WebP
- **Taille maximale**: 5 Mo
- **Stockage**: Supabase Storage (bucket 'images')
- **Dossier**: `banners/` pour les images de bannière

## 🔄 Prochaines Étapes (Post-Déploiement)

### Améliorations Futures
1. **Base de données**: Migrer de localStorage vers Supabase
2. **Versioning**: Historique des modifications
3. **Permissions**: Gestion fine des droits d'édition
4. **SEO**: Génération automatique des meta tags
5. **Performance**: Optimisation des images

### Maintenance
- **Sauvegarde**: Exporter régulièrement le contenu
- **Monitoring**: Surveiller les erreurs d'upload
- **Updates**: Mettre à jour les dépendances

## 🆘 Dépannage

### Problèmes Courants
1. **Images non affichées**: Vérifier la configuration Supabase Storage
2. **Modifications non sauvées**: Vérifier localStorage du navigateur
3. **Erreur d'upload**: Vérifier les permissions du bucket 'images'

### Logs Utiles
```bash
# Vérifier les logs Vercel
vercel logs

# Vérifier le build local
npm run build
npm run preview
```

## 📞 Support

En cas de problème:
1. Vérifier les logs de la console navigateur
2. Tester en local avec `npm run dev`
3. Vérifier la configuration Supabase
4. Consulter la documentation Vercel

---

**✅ Le gestionnaire de contenu des pages est maintenant prêt pour le déploiement !**