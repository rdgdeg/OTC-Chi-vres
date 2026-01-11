# Guide d'Accès - Modification du Texte de la Page d'Accueil

## 🎯 **Où Modifier le Texte en Haut de Page**

### ✅ **CORRECT : Menu "Contenu Accueil"**

Pour modifier le **message en haut de la page d'accueil** :

1. **Connectez-vous à l'admin**
2. **Cliquez sur "Contenu Accueil"** dans le menu de gauche
3. **Onglet "Bannière d'info"** pour le message du haut
4. **Onglet "Section Hero"** pour la bannière principale avec image

### ❌ **INCORRECT : Menu "Gestion des Pages"**

Le menu "Gestion des Pages" → "Page d'Accueil" ne contient **PAS** tous les éléments de la page d'accueil car :
- Il gère uniquement les **métadonnées** (titre SEO, description)
- Il ne gère **pas le contenu dynamique** (bannière, actualités, etc.)

## 📋 **Structure des Menus Admin**

### 🏠 **"Contenu Accueil"** (Nouveau système)
- ✅ **Bannière d'info** : Message en haut de page
- ✅ **Section Hero** : Image et texte de la bannière principale
- ✅ **Actualités** : Gestion des news
- ✅ **Coups de cœur** : Sites emblématiques

### 📄 **"Gestion des Pages"** (Ancien système)
- ⚠️ **Métadonnées uniquement** : Titre SEO, description
- ⚠️ **Pas de contenu dynamique**

## 🔧 **Étapes de Configuration**

### 1. **Exécuter la Migration** (Si pas encore fait)
```bash
npm run migrate:homepage
```

### 2. **Vérifier l'Accès Admin**
- Menu "Contenu Accueil" doit être visible
- Menu "Newsletter" doit être visible

### 3. **Tester les Modifications**
- Modifier le texte dans "Bannière d'info"
- Sauvegarder
- Vérifier sur la page d'accueil publique

## 🎨 **Types de Modifications Disponibles**

### **Bannière d'Information** (Message du haut)
- **Message principal** : Ex: "Fermeture du bureau le 11 novembre"
- **Détails** : Ex: "Réouverture le 12 novembre à 9h"
- **Type** : Annonce, Info, Succès, Avertissement, Erreur
- **Activation** : On/Off
- **Fermeture** : Permettre à l'utilisateur de fermer

### **Section Hero** (Bannière principale)
- **Image de fond** : Upload ou URL
- **Titre** : "Bienvenue à Chièvres,"
- **Sous-titre** : "la Cité des Aviateurs !"
- **Description** : Texte de présentation
- **Bouton principal** : Texte et lien
- **Bouton secondaire** : "Voir l'agenda"

## 🚨 **Dépannage**

### **Si le menu "Contenu Accueil" n'apparaît pas :**

1. **Vérifiez la migration** :
   ```bash
   npm run test:homepage
   ```

2. **Vérifiez les permissions utilisateur**
3. **Rafraîchissez la page admin**
4. **Vérifiez la console pour les erreurs**

### **Si les modifications ne s'affichent pas :**

1. **Vérifiez que la migration a créé les tables**
2. **Rafraîchissez la page d'accueil publique**
3. **Vérifiez la console navigateur pour les erreurs**

## 📱 **Interface Utilisateur**

### **Bannière d'Information**
```
┌─────────────────────────────────────────────────┐
│ ⚠️ Fermeture du bureau le 11 novembre (férié)   │ ← Modifiable
│    Réouverture le 12 novembre à 9h          [X] │ ← Modifiable
└─────────────────────────────────────────────────┘
```

### **Section Hero**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Image de fond modifiable]                     │ ← Modifiable
│                                                 │
│         Bienvenue à Chièvres,                   │ ← Modifiable
│      la Cité des Aviateurs !                    │ ← Modifiable
│                                                 │
│  Description du crosseur et de la ville...      │ ← Modifiable
│                                                 │
│  [Découvrir Chièvres] [Voir l'agenda]          │ ← Modifiable
│                                                 │
└─────────────────────────────────────────────────┘
```

## ✅ **Checklist de Vérification**

- [ ] Migration exécutée : `npm run migrate:homepage`
- [ ] Menu "Contenu Accueil" visible dans l'admin
- [ ] Onglet "Bannière d'info" accessible
- [ ] Onglet "Section Hero" accessible
- [ ] Modifications sauvegardées avec succès
- [ ] Changements visibles sur la page d'accueil publique

---

**Résumé** : Utilisez **"Contenu Accueil"** (pas "Gestion des Pages") pour modifier le texte en haut de la page d'accueil.