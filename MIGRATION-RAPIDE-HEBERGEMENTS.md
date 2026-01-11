# Migration Rapide - Hébergements

## 🚀 Installation en 2 étapes

### Étape 1: Exécuter la migration

Dans l'éditeur SQL de Supabase, copiez-collez le contenu du fichier :
```
migrations/accommodations-simple.sql
```

### Étape 2: Vérifier l'installation

Après exécution, vous devriez voir :
- ✅ Table `accommodations` créée
- ✅ 9 hébergements insérés
- ✅ Fonctions et triggers configurés

## 📊 Résultat attendu

```
total_accommodations | published | gites | bed_breakfasts | unusual
--------------------|-----------|-------|----------------|--------
9                   | 9         | 5     | 3              | 1
```

## 🔧 En cas d'erreur

Si vous obtenez des erreurs :

1. **"relation already exists"** → Normal, continuez
2. **"function already exists"** → Normal, continuez  
3. **"duplicate key value"** → Normal pour les données

## 🎯 Test rapide

Après la migration, testez :
1. Allez sur `/hebergements` 
2. Vous devriez voir 9 hébergements
3. Cliquez sur un hébergement pour voir le détail
4. Testez les filtres (type, village, capacité)

## 📝 Prochaines étapes

Une fois la migration réussie :
- Les hébergements sont visibles sur le site
- L'administration est accessible via `/admin-dashboard` → Hébergements
- Vous pouvez créer/modifier des hébergements

## 🆘 Support

Si problème persistant :
1. Vérifiez que Supabase est bien configuré
2. Contrôlez les permissions RLS
3. Consultez les logs d'erreur