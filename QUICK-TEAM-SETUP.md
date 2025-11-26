# Configuration Rapide - Page Équipe

## 🚀 Setup en 3 étapes

### Étape 1 : Créer la table (1 min)

Dans **Supabase SQL Editor**, exécutez :
```sql
-- Copiez tout le contenu de supabase-team-table.sql et exécutez-le
```

✅ Cela crée la table `team_members` avec 6 membres par défaut

### Étape 2 : Vérifier le bucket images (30 sec)

1. Allez dans **Supabase Dashboard > Storage**
2. Vérifiez que le bucket `images` existe
3. S'il n'existe pas, créez-le :
   - Cliquez sur "New bucket"
   - Nom : `images`
   - Public : ✅ **OUI** (important !)
   - Cliquez sur "Create bucket"

### Étape 3 : Vérifier les politiques (30 sec)

Dans **Supabase SQL Editor**, exécutez :
```sql
-- Copiez tout le contenu de VERIFY-STORAGE-POLICIES.sql et exécutez-le
```

**Si vous voyez des politiques listées** → Tout est bon ! ✅

**Si aucune politique n'apparaît** → Exécutez `FIX-TEAM-STORAGE.sql`

**Si vous avez l'erreur "policy already exists"** → C'est normal, les politiques existent déjà ! ✅

## ✨ C'est prêt !

Allez sur `/equipe` et survolez une photo pour la modifier.

## 🐛 Ça ne marche pas ?

1. Ouvrez la console du navigateur (F12)
2. Essayez d'uploader une image
3. Regardez les messages d'erreur dans la console
4. Consultez `GUIDE-EQUIPE.md` pour le dépannage détaillé

## 📋 Checklist

- [ ] Table `team_members` créée
- [ ] Bucket `images` existe et est PUBLIC
- [ ] Des politiques existent pour le bucket images
- [ ] Variables `.env.local` configurées
- [ ] Application redémarrée

## 🎯 Test rapide

```javascript
// Dans la console du navigateur (F12)
const { data } = await supabase.from('team_members').select('*');
console.log('Membres:', data);
// Devrait afficher 6 membres
```
