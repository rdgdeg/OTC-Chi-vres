# Guide de Rafraîchissement des Données 🔄

## Problème : Modifications non visibles

Si vous modifiez des données dans l'admin et ne voyez pas les changements sur le site, voici les solutions :

## ✅ Solutions Rapides

### 1. Bouton Rafraîchir (NOUVEAU!)

Dans le panneau admin, cliquez sur le bouton **"Rafraîchir"** en haut à droite :

```
[Rafraîchir] [Initialiser DB]
```

Ce bouton recharge toutes les données depuis Supabase.

### 2. Rafraîchissement Navigateur

**Méthode 1 : Rafraîchissement dur**
- Windows/Linux : `Ctrl + Shift + R` ou `Ctrl + F5`
- Mac : `Cmd + Shift + R`

**Méthode 2 : Vider le cache**
1. Ouvrir DevTools (F12)
2. Clic droit sur le bouton rafraîchir
3. Sélectionner "Vider le cache et actualiser"

### 3. Mode Incognito

Ouvrez le site en mode navigation privée :
- Chrome : `Ctrl + Shift + N` (Windows) ou `Cmd + Shift + N` (Mac)
- Firefox : `Ctrl + Shift + P` (Windows) ou `Cmd + Shift + P` (Mac)

## 🔍 Vérifications

### 1. Vérifier que les données sont dans Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans "Table Editor"
4. Vérifiez la table concernée (places, events, etc.)
5. Vérifiez que vos modifications sont présentes

### 2. Vérifier la Console

1. Ouvrez DevTools (F12)
2. Onglet "Console"
3. Cherchez des erreurs en rouge
4. Si erreur Supabase, vérifiez votre connexion

### 3. Vérifier le Network

1. DevTools (F12) → Onglet "Network"
2. Rafraîchissez la page
3. Cherchez les requêtes vers Supabase
4. Vérifiez que les données retournées sont correctes

## 🛠️ Dépannage Avancé

### Cache du Service Worker

Si vous avez un Service Worker actif :

```javascript
// Dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

Puis rafraîchissez la page.

### LocalStorage

Vider le localStorage :

```javascript
// Dans la console du navigateur
localStorage.clear();
location.reload();
```

### Cookies

Vider les cookies du site :
1. DevTools (F12) → Application
2. Storage → Cookies
3. Supprimer tous les cookies du domaine
4. Rafraîchir

## 📝 Workflow Recommandé

### Pour modifier un musée :

1. **Admin** → Sélectionner "Musées & Patrimoine"
2. **Modifier** l'élément souhaité
3. **Enregistrer** les modifications
4. **Cliquer sur "Rafraîchir"** en haut de la page admin
5. **Aller sur la page Musées** du site
6. **Rafraîchissement dur** : `Ctrl + Shift + R`

### Pour ajouter des images à la galerie :

1. **Admin** → Musées → Modifier un musée
2. **Galerie d'images** → Cliquer "Ajouter"
3. **Sélectionner** vos images (max 10)
4. **Attendre** l'upload (icône de chargement)
5. **Enregistrer** le musée
6. **Rafraîchir** les données
7. **Vérifier** sur la page Musées

## ⚡ Optimisations Futures

### Auto-refresh après sauvegarde

Le système rafraîchit automatiquement après :
- ✅ Ajout d'un élément
- ✅ Modification d'un élément
- ✅ Suppression d'un élément
- ✅ Modification de contenu de page

### Real-time avec Supabase

Pour des mises à jour en temps réel, on pourrait implémenter :

```typescript
// À ajouter dans DataContext.tsx
useEffect(() => {
  const subscription = supabase
    .channel('db-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'places' },
      (payload) => {
        console.log('Change received!', payload);
        fetchData();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 🆘 Problèmes Persistants

### Les modifications ne s'enregistrent pas

**Vérifier :**
1. Connexion Supabase active
2. Clés API correctes dans `.env.local`
3. Politiques RLS configurées
4. Pas d'erreur dans la console

**Solution :**
```bash
# Vérifier les variables d'environnement
cat .env.local

# Redémarrer le serveur
npm run dev
```

### Les images ne s'affichent pas

**Vérifier :**
1. Bucket Supabase "images" existe
2. Bucket est public
3. URL de l'image est correcte
4. Taille de l'image < 2Mo

**Solution :**
1. Aller sur Supabase → Storage
2. Vérifier le bucket "images"
3. Vérifier les politiques (public read)

### Erreur "Failed to fetch"

**Causes possibles :**
- Pas de connexion internet
- Supabase down
- URL Supabase incorrecte
- Clé API expirée

**Solution :**
1. Vérifier https://status.supabase.com
2. Vérifier `.env.local`
3. Régénérer les clés API si nécessaire

## 📞 Support

Si le problème persiste :

1. **Console** : Copier les erreurs
2. **Network** : Vérifier les requêtes
3. **Supabase** : Vérifier les logs
4. **Documentation** : Consulter `VERIFICATION.md`

---

**Astuce** : Gardez toujours DevTools ouvert (F12) pendant le développement pour voir les erreurs en temps réel !
