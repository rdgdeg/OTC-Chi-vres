# 🚨 SOLUTION IMMÉDIATE - Erreur PGRST116 Hébergements

## 🔍 PROBLÈME ACTUEL

Vous voyez cette erreur dans la console :
```
PGRST116: Cannot coerce the result to a single JSON object
The result contains 0 rows
```

**Cause** : Les politiques de sécurité (RLS) de Supabase bloquent les modifications.

## ⚡ SOLUTION IMMÉDIATE (2 minutes)

### Option 1 : Fix Manuel dans Supabase Dashboard

1. **Ouvrez votre dashboard Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre projet** : `pyrqqruqvvhwmgkhlhed`
3. **Allez dans "SQL Editor"** (dans le menu de gauche)
4. **Créez une nouvelle requête** et copiez-collez ce code :

```sql
-- SOLUTION RAPIDE RLS - Hébergements
-- Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Public read published accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can read all accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can insert accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can update accommodations" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can delete accommodations" ON accommodations;

-- Créer des politiques permissives pour l'admin
CREATE POLICY "Public can read published accommodations" 
ON accommodations FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can read all accommodations" 
ON accommodations FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert accommodations" 
ON accommodations FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update accommodations" 
ON accommodations FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete accommodations" 
ON accommodations FOR DELETE 
USING (auth.role() = 'authenticated');

-- Vérifier que RLS est activé
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
```

5. **Cliquez sur "Run"** pour exécuter le script
6. **Rafraîchissez votre admin** et testez la modification d'un hébergement

### Option 2 : Script Automatique (si vous avez une clé de service)

```bash
node scripts/apply-rls-fix.js
```

## 🎯 RÉSULTAT ATTENDU

**AVANT** :
- ❌ Erreur PGRST116 dans la console
- ❌ Modifications non sauvegardées
- ❌ Message d'erreur dans l'interface

**APRÈS** :
- ✅ Modifications sauvegardées en base
- ✅ Aucune erreur dans la console
- ✅ Interface admin pleinement fonctionnelle

## 🔧 CONTOURNEMENT TEMPORAIRE ACTIVÉ

En attendant que vous appliquiez le fix, j'ai activé un contournement qui :

- ✅ **Permet de modifier l'interface** sans erreur
- ✅ **Affiche les changements** immédiatement
- ⚠️ **Ne sauvegarde pas en base** (temporaire)
- 💡 **Affiche des messages informatifs** sur la situation

## 🧪 COMMENT TESTER

1. **Allez sur votre admin** : http://localhost:3000/admin
2. **Connectez-vous** avec le mot de passe "admin"
3. **Cliquez sur "Hébergements"**
4. **Modifiez un hébergement** (ex: changer le nom)
5. **Sauvegardez**

**Si le fix RLS n'est pas appliqué** :
- Vous verrez un message d'avertissement
- Les modifications s'affichent mais ne sont pas sauvées en base

**Si le fix RLS est appliqué** :
- Sauvegarde normale sans message d'erreur
- Modifications persistantes en base de données

## 📞 SUPPORT RAPIDE

Si vous avez des difficultés :

1. **Vérifiez les logs** dans la console du navigateur
2. **Regardez les messages** dans l'interface admin
3. **Testez le diagnostic** : `node scripts/diagnose-accommodation-update-error.js`

## 🎉 APRÈS LE FIX

Une fois le script RLS appliqué, votre admin sera **100% fonctionnel** pour :

- ✅ Créer de nouveaux hébergements
- ✅ Modifier les hébergements existants
- ✅ Supprimer des hébergements
- ✅ Changer les statuts (publié/brouillon)
- ✅ Gérer les images et galeries
- ✅ Modifier tous les champs (contact, description, etc.)

---

**⏱️ Temps estimé pour le fix : 2 minutes**
**🎯 Résultat : Admin 100% fonctionnel**