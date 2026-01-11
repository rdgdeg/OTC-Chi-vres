# 🔐 Guide d'authentification - Édition d'images

## Changements apportés

### ✅ Système d'authentification ajouté

Un contexte d'authentification a été créé pour gérer l'accès à l'édition des images.

## Fonctionnement

### 1. Contexte d'authentification (`contexts/AuthContext.tsx`)

- Gère l'état de connexion de l'administrateur
- Stocke l'état dans `sessionStorage` (persiste pendant la session du navigateur)
- Fournit les fonctions `login()` et `logout()`

### 2. Pages modifiées

**Pages publiques (édition désactivée) :**
- ✅ `pages/Museums.tsx` - Les images ne sont plus éditables
- ✅ `pages/Team.tsx` - Les photos d'équipe ne sont plus éditables

**Page admin (édition activée) :**
- ✅ `pages/Admin.tsx` - Utilise le contexte pour gérer la connexion

### 3. Composant EditableImage

Le composant `EditableImage` a déjà un prop `editable` qui contrôle si l'image peut être modifiée :

```typescript
<EditableImage
  src={museum.imageUrl}
  alt={museum.name}
  onImageUpdate={...}
  editable={isAuthenticated}  // ← Contrôle l'édition
/>
```

## Utilisation

### Pour les visiteurs (non authentifiés)

1. Visitent le site normalement
2. Voient toutes les images
3. **Ne peuvent PAS** modifier les images (pas de bouton "Modifier l'image")

### Pour l'administrateur

1. **Se connecter :**
   - Aller sur `/admin`
   - Entrer le mot de passe : `admin`
   - Cliquer sur "Connexion"

2. **Modifier les images depuis l'Admin :**
   - Utiliser l'interface Admin pour modifier les fiches
   - Uploader de nouvelles images via les formulaires

3. **Modifier les images sur les pages publiques :**
   - Une fois connecté via `/admin`
   - Aller sur n'importe quelle page (Musées, Équipe, etc.)
   - Survoler les images → Le bouton "Modifier l'image" apparaît
   - Uploader une nouvelle image

4. **Se déconnecter :**
   - Fermer le navigateur (sessionStorage est vidé)
   - Ou ajouter un bouton de déconnexion (voir ci-dessous)

## Ajouter un bouton de déconnexion (optionnel)

Si vous voulez ajouter un bouton de déconnexion dans le Layout :

```typescript
// Dans components/Layout.tsx
import { useAuth } from '../contexts/AuthContext';

// Dans le composant
const { isAuthenticated, logout } = useAuth();

// Dans le JSX (par exemple dans le header)
{isAuthenticated && (
  <button 
    onClick={logout}
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  >
    Déconnexion
  </button>
)}
```

## Sécurité

### ⚠️ Important

Ce système d'authentification est **basique** et convient pour :
- ✅ Un site vitrine avec un seul administrateur
- ✅ Protéger l'interface d'édition des visiteurs
- ✅ Éviter les modifications accidentelles

**Ce n'est PAS sécurisé pour :**
- ❌ Protéger des données sensibles
- ❌ Empêcher un utilisateur technique de contourner la protection
- ❌ Gérer plusieurs utilisateurs avec différents rôles

### Pourquoi ?

- Le mot de passe est en dur dans le code (`admin`)
- L'authentification est côté client (peut être contournée)
- Les politiques RLS de Supabase sont permissives (permettent tout)

### Pour une vraie sécurité (production)

Si vous avez besoin d'une vraie sécurité :

1. **Utiliser Supabase Auth :**
   ```typescript
   import { supabase } from './supabaseClient';
   
   // Login
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@example.com',
     password: 'secure-password'
   });
   ```

2. **Configurer les politiques RLS strictes :**
   ```sql
   -- Permettre UPDATE seulement aux utilisateurs authentifiés
   CREATE POLICY "Allow authenticated update on places" 
   ON places 
   FOR UPDATE 
   USING (auth.uid() IS NOT NULL);
   ```

3. **Utiliser des variables d'environnement :**
   ```typescript
   const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
   ```

## Test

### 1. Mode visiteur (par défaut)

1. Ouvrez http://localhost:3000/
2. Allez sur la page Musées
3. Survolez une image
4. ✅ **Aucun bouton "Modifier l'image"** ne devrait apparaître

### 2. Mode administrateur

1. Allez sur http://localhost:3000/#/admin
2. Connectez-vous avec le mot de passe : `admin`
3. Retournez sur la page Musées
4. Survolez une image
5. ✅ **Le bouton "Modifier l'image" devrait apparaître**
6. Cliquez et uploadez une nouvelle image
7. ✅ L'image devrait se mettre à jour

### 3. Persistance de la session

1. Connectez-vous sur `/admin`
2. Naviguez sur différentes pages
3. ✅ Vous restez connecté
4. Fermez le navigateur
5. Rouvrez et allez sur une page
6. ✅ Vous n'êtes plus connecté (session expirée)

## Résumé

- ✅ Les visiteurs ne peuvent plus modifier les images
- ✅ L'administrateur doit se connecter via `/admin`
- ✅ Une fois connecté, il peut modifier les images partout
- ✅ La session persiste pendant la navigation
- ✅ La session expire à la fermeture du navigateur

**L'édition d'images est maintenant protégée !** 🔒
