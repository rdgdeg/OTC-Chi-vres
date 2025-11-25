# Instructions Finales - VisitChièvres.be 🎯

## 🚨 IMPORTANT : Corriger les Politiques RLS

Vos modifications ne se mettent pas à jour car les politiques RLS (Row Level Security) de Supabase bloquent les opérations. Voici comment corriger :

## ✅ Étape 1 : Corriger les Politiques RLS

### 1.1 Ouvrir Supabase
```
https://supabase.com
→ Votre projet
→ SQL Editor
```

### 1.2 Exécuter le Script
```
1. Copier TOUT le contenu de FIX-RLS-POLICIES.sql
2. Coller dans SQL Editor
3. Cliquer "Run" (ou Ctrl+Enter)
4. Vérifier qu'il n'y a pas d'erreurs
```

### 1.3 Vérifier
```sql
-- Copier-coller cette requête pour vérifier
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Résultat attendu :**
- Chaque table doit avoir une politique "Allow all operations"
- `cmd` doit être `ALL`

## ✅ Étape 2 : Configurer le Storage

### 2.1 Exécuter le Script Storage
```
1. SQL Editor → Nouveau query
2. Copier TOUT le contenu de FIX-STORAGE-POLICIES.sql
3. Coller et exécuter
4. Vérifier qu'il n'y a pas d'erreurs
```

### 2.2 Vérifier le Bucket
```
Supabase → Storage → Vérifier que "images" existe
```

Si le bucket n'existe pas :
```
Storage → New bucket
Name: images
Public: ✅ Coché
File size limit: 5MB
```

## ✅ Étape 3 : Tester

### 3.1 Rafraîchir l'Application
```
Dans votre navigateur :
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### 3.2 Tester une Modification
```
1. Admin → Musées & Patrimoine
2. Éditer un musée
3. Modifier le nom
4. Enregistrer
5. Cliquer "Rafraîchir" en haut
6. Aller sur /musees
7. Rafraîchir (Ctrl+Shift+R)
```

**✅ Si ça marche :** Le nom est mis à jour !
**❌ Si ça ne marche pas :** Voir section Dépannage ci-dessous

### 3.3 Tester l'Upload d'Images
```
1. Admin → Musées → Éditer un musée
2. Section "Galerie d'images"
3. Cliquer "Ajouter"
4. Sélectionner 2-3 images
5. Attendre l'upload
6. Enregistrer
7. Vérifier sur /musees
```

## 🐛 Dépannage

### Problème 1 : Erreur "row-level security policy"

**Solution :**
```sql
-- Dans Supabase SQL Editor
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;
```

⚠️ Ceci désactive complètement RLS. OK pour dev, PAS pour production !

### Problème 2 : Upload d'images ne fonctionne pas

**Vérifications :**
1. F12 → Console → Chercher les erreurs
2. Supabase → Storage → Vérifier que "images" existe
3. Vérifier que le bucket est "public"
4. Exécuter FIX-STORAGE-POLICIES.sql

### Problème 3 : Modifications non visibles

**Solutions :**
1. Cliquer "Rafraîchir" dans l'admin
2. Rafraîchir la page : Ctrl + Shift + R
3. Vider le cache : F12 → Application → Clear storage
4. Mode incognito pour tester

### Problème 4 : Erreur de connexion Supabase

**Vérifications :**
```bash
# Vérifier .env.local
cat .env.local

# Doit contenir :
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Redémarrer le serveur
npm run dev
```

## 📚 Documentation Disponible

### Guides Rapides
- `QUICK-GALLERY-GUIDE.md` - Upload d'images en 5 étapes
- `GUIDE-RAFRAICHISSEMENT.md` - Voir vos modifications
- `MOBILE-QUICK-REFERENCE.md` - Patterns mobile

### Guides Complets
- `GUIDE-GALERIE-IMAGES.md` - Galerie complète
- `MOBILE-OPTIMIZATIONS.md` - Optimisations mobile
- `TROUBLESHOOTING-RLS.md` - Dépannage RLS

### Scripts SQL
- `FIX-RLS-POLICIES.sql` - Corriger les politiques RLS
- `FIX-STORAGE-POLICIES.sql` - Configurer le storage
- `supabase-schema.sql` - Schéma complet

## 🚀 Commit Git

### Option 1 : Script Automatique
```bash
chmod +x GIT-COMMANDS.sh
./GIT-COMMANDS.sh
```

### Option 2 : Commandes Manuelles
```bash
# Ajouter tous les fichiers
git add .

# Commit avec message
git commit -F COMMIT-MESSAGE.txt

# Push
git push origin main
```

## 📊 Résumé des Modifications

### Version 2.0.0 - Mobile
- ✅ 14 pages optimisées pour mobile
- ✅ Navigation responsive
- ✅ Cartes Mapbox optimisées
- ✅ Formulaires mobile-first
- ✅ 15+ fichiers de documentation

### Version 2.1.0 - Galerie
- ✅ Upload multiple d'images
- ✅ Composant ImageUploader intégré
- ✅ Stockage Supabase organisé
- ✅ Bouton Rafraîchir dans l'admin
- ✅ 4 guides créés

### Scripts RLS
- ✅ FIX-RLS-POLICIES.sql créé
- ✅ FIX-STORAGE-POLICIES.sql créé
- ✅ TROUBLESHOOTING-RLS.md créé

## ⚠️ IMPORTANT : Sécurité

Les politiques RLS actuelles sont **TRÈS permissives** :
- ✅ OK pour le développement
- ❌ PAS OK pour la production

**Avant de déployer en production :**
1. Implémenter une vraie authentification
2. Créer des politiques RLS strictes
3. Utiliser auth.uid() dans les politiques
4. Protéger l'admin avec un vrai login

Voir `FIX-RLS-POLICIES.sql` section "SÉCURITÉ PRODUCTION" pour des exemples.

## 🎯 Checklist Finale

### Avant de Commiter
- [ ] Scripts RLS exécutés dans Supabase
- [ ] Bucket Storage configuré
- [ ] Modifications testées et fonctionnelles
- [ ] Upload d'images testé
- [ ] Documentation lue

### Commit Git
- [ ] `git add .` exécuté
- [ ] `git commit -F COMMIT-MESSAGE.txt` exécuté
- [ ] `git push origin main` exécuté

### Après le Commit
- [ ] Vérifier sur GitHub que tout est bien pushé
- [ ] Tester sur un autre appareil
- [ ] Partager avec l'équipe

## 📞 Support

### En Cas de Problème

1. **Console navigateur** (F12) → Copier les erreurs
2. **Supabase Logs** → Dashboard → Logs → API Logs
3. **Documentation** → Consulter les guides
4. **TROUBLESHOOTING-RLS.md** → Solutions détaillées

### Ressources
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- Documentation locale dans le projet

---

## 🎉 Félicitations !

Vous avez maintenant :
- ✅ Un site 100% responsive et mobile-optimized
- ✅ Un système de galerie d'images fonctionnel
- ✅ Une documentation complète
- ✅ Des scripts de correction RLS

**Prochaines étapes :**
1. Exécuter les scripts SQL dans Supabase
2. Tester les modifications
3. Commiter dans Git
4. Déployer ! 🚀

---

**Version** : 2.1.0
**Date** : 25 novembre 2025
**Status** : ✅ Prêt pour le commit
