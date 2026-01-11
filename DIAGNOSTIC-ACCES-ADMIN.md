# Diagnostic - Accès Admin Page d'Accueil

## 🔍 **Vérification Rapide**

### **Étape 1 : Vérifiez les Menus Disponibles**

Dans votre admin, vous devriez voir ces menus dans la barre latérale :

```
📊 Tableau de Bord
📋 Gestion du Contenu  
📄 Gestion des Pages        ← ANCIEN (métadonnées uniquement)
🏠 Page d'Accueil           ← ANCIEN (système précédent)
🎨 Contenu Accueil          ← NOUVEAU (pour modifier texte/images)
📧 Newsletter               ← NOUVEAU (gestion abonnements)
📍 Lieux & Patrimoine
🏨 Hébergements
...
```

### **Étape 2 : Cliquez sur "Contenu Accueil"**

Vous devriez voir **4 onglets** :
- 🚨 **Bannière d'info** ← Pour le message en haut de page
- 🎨 **Section Hero** ← Pour l'image et texte principal
- 📰 **Actualités** ← Pour les news
- ❤️ **Coups de cœur** ← Pour les sites emblématiques

## 🚨 **Si le menu "Contenu Accueil" n'apparaît pas**

### **Cause 1 : Migration non exécutée**
```bash
# Exécutez cette commande dans le terminal
cd OTC-Chi-vres
npm run migrate:homepage
```

**Résultat attendu :**
```
✅ Table newsletter_subscriptions: OK
✅ Table homepage_content: OK
✅ Table homepage_news: OK
✅ Table homepage_favorites: OK
```

### **Cause 2 : Permissions utilisateur**
- Vérifiez que vous êtes connecté en tant qu'admin
- Le menu nécessite la permission `content:write`

### **Cause 3 : Erreur JavaScript**
1. **Ouvrez la console navigateur** (F12)
2. **Recherchez les erreurs** en rouge
3. **Rafraîchissez la page admin**

## 🔧 **Test de Diagnostic**

### **Test 1 : Vérification Base de Données**
```bash
npm run test:homepage
```

### **Test 2 : Vérification Manuelle**
1. Allez dans votre **dashboard Supabase**
2. **Table Editor** → Recherchez ces tables :
   - `newsletter_subscriptions`
   - `homepage_content`
   - `homepage_news`
   - `homepage_favorites`

### **Test 3 : Vérification Interface**
1. **Connectez-vous à l'admin**
2. **Comptez les menus** dans la barre latérale
3. **Cherchez "Contenu Accueil"** (pas "Page d'Accueil")

## 📋 **Solutions par Problème**

### **Problème : "Je ne vois que 'Gestion des Pages'"**
**Solution :** Vous regardez l'ancien système. Cherchez "Contenu Accueil" plus bas dans le menu.

### **Problème : "Le menu 'Contenu Accueil' n'existe pas"**
**Solution :** 
1. Exécutez `npm run migrate:homepage`
2. Rafraîchissez la page admin
3. Vérifiez les erreurs console

### **Problème : "Les onglets sont vides"**
**Solution :** 
1. Vérifiez que les tables sont créées dans Supabase
2. Vérifiez les politiques RLS
3. Contrôlez les erreurs réseau dans l'onglet Network

### **Problème : "Erreur lors de la sauvegarde"**
**Solution :**
1. Vérifiez les clés API Supabase
2. Contrôlez les politiques RLS
3. Vérifiez les erreurs dans la console

## 🎯 **Chemin Correct pour Modifier le Texte**

```
Admin Dashboard
    ↓
Contenu Accueil (dans le menu de gauche)
    ↓
Onglet "Bannière d'info"
    ↓
Modifier "Message principal" et "Détails"
    ↓
Cliquer "Sauvegarder"
    ↓
Vérifier sur la page d'accueil publique
```

## 📞 **Support Immédiat**

### **Si rien ne fonctionne :**

1. **Envoyez-moi une capture d'écran** de votre menu admin
2. **Copiez-collez les erreurs** de la console navigateur
3. **Indiquez-moi** si vous avez exécuté `npm run migrate:homepage`

### **Vérification Rapide :**
- [ ] Migration exécutée
- [ ] Menu "Contenu Accueil" visible
- [ ] Onglets "Bannière d'info" et "Section Hero" accessibles
- [ ] Pas d'erreurs dans la console
- [ ] Tables créées dans Supabase

---

**Objectif :** Vous devez pouvoir modifier le texte en haut de page via **Admin → Contenu Accueil → Bannière d'info**