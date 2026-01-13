# 🚀 Guide d'Application des Corrections - Hébergements

## ⚠️ IMPORTANT : Ordre d'Application

Les corrections doivent être appliquées dans cet ordre précis :

### 1. 🔧 Corriger l'erreur RLS (URGENT)

**Problème actuel** : Erreur `PGRST116` lors de la mise à jour d'hébergements

**Solution** :
1. Ouvrir l'interface Supabase : https://supabase.com/dashboard
2. Sélectionner votre projet OTC-Chièvres
3. Aller dans **SQL Editor**
4. Créer une nouvelle requête
5. Copier-coller le contenu du fichier : `scripts/fix-rls-direct.sql`
6. Cliquer sur **Run** pour exécuter

**Résultat attendu** : Plus d'erreur lors de la mise à jour d'hébergements

### 2. 🏠 Appliquer la migration types multiples

**Problème actuel** : Un hébergement ne peut avoir qu'un seul type

**Solution** :
1. Dans le même **SQL Editor** de Supabase
2. Créer une nouvelle requête
3. Copier-coller le contenu du fichier : `migrations/update-accommodations-multiple-types.sql`
4. Cliquer sur **Run** pour exécuter

**Résultat attendu** : Les hébergements peuvent avoir plusieurs types (ex: Bed & Breakfast + Gîte)

### 3. ✅ Vérifier que tout fonctionne

Exécuter le script de vérification :
```bash
cd OTC-Chi-vres
node scripts/apply-migration-direct.js
```

**Résultat attendu** :
- ✅ Types au format array
- ✅ Mise à jour sans erreur RLS
- ✅ Interface admin fonctionnelle

## 📋 Checklist de Vérification

Après application des corrections :

### Interface Admin
- [ ] Ouvrir l'admin des hébergements
- [ ] Vérifier qu'il n'y a pas de défilement horizontal
- [ ] Toutes les informations sont visibles en vue cartes
- [ ] Les actions (modifier, supprimer) sont accessibles

### Modification d'Hébergement
- [ ] Cliquer sur "Modifier" un hébergement
- [ ] Changer le nom ou la description
- [ ] Sauvegarder
- [ ] Vérifier qu'il n'y a pas d'erreur PGRST116

### Types Multiples
- [ ] Créer ou modifier un hébergement
- [ ] Sélectionner plusieurs types (ex: Bed & Breakfast + Gîte)
- [ ] Sauvegarder
- [ ] Vérifier l'affichage dans la liste

## 🔍 Scripts de Diagnostic

Si problème, utiliser ces scripts :

```bash
# Vérifier l'état des données
node scripts/apply-migration-direct.js

# Tester les fonctionnalités
node scripts/test-accommodations-frontend.js

# Diagnostiquer les erreurs RLS
node scripts/diagnose-accommodation-update-error.js
```

## 📞 Support

En cas de problème :

1. **Erreur RLS persistante** : Vérifier que le script `fix-rls-direct.sql` a été exécuté
2. **Types multiples ne fonctionnent pas** : Vérifier que la migration SQL a été appliquée
3. **Interface cassée** : Vider le cache du navigateur (Ctrl+F5)

## 🎯 Résultats Finaux Attendus

### ✅ Corrections Appliquées
- Mise à jour d'hébergements sans erreur
- Interface admin responsive sans défilement
- Sélection multiple de types d'hébergement

### ✅ Nouvelles Fonctionnalités
- Un hébergement peut être "Bed & Breakfast" ET "Gîte"
- Interface en cartes plus lisible
- Filtrage par type fonctionne avec types multiples

### ✅ Amélioration UX
- Plus de défilement horizontal sur mobile/tablette
- Actions plus accessibles
- Informations mieux organisées

---

**⏱️ Temps d'application estimé** : 5-10 minutes
**🔧 Niveau technique requis** : Accès admin Supabase
**📱 Impact utilisateur** : Aucun (améliorations backend/admin uniquement)