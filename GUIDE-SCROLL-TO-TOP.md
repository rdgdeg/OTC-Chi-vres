# Guide - Scroll automatique vers le haut

## Fonctionnalité implémentée

✅ **Scroll automatique** vers le haut de la page à chaque changement de route  
✅ **Navigation fluide** pour une meilleure expérience utilisateur  
✅ **Composant réutilisable** pour d'autres besoins de scroll  

## Comment ça fonctionne

### 🔄 Scroll automatique global

**Composant** : `ScrollToTop.tsx`  
**Intégration** : Dans `App.tsx` au niveau du Router  
**Déclencheur** : Chaque changement d'URL/route  

```typescript
// À chaque changement de pathname (/balades, /musees, etc.)
useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant' // Scroll instantané
  });
}, [pathname]);
```

### 📱 Comportement utilisateur

**Scénarios couverts :**
- Navigation depuis le menu principal
- Clic sur les liens internes
- Boutons "Retour" 
- Navigation par URL directe
- Changement de page de détail (ex: balade A → balade B)

**Résultat :** L'utilisateur arrive **toujours en haut** de la nouvelle page

## Implémentation technique

### 1. Composant ScrollToTop

**Fichier** : `components/ScrollToTop.tsx`

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });
  }, [pathname]);

  return null; // Composant invisible
};
```

**Caractéristiques :**
- ✅ **Léger** : Ne rend aucun élément visuel
- ✅ **Performant** : Utilise `requestAnimationFrame`
- ✅ **Fiable** : Fonctionne avec React Router
- ✅ **Instantané** : Pas d'animation pour éviter les distractions

### 2. Intégration dans App.tsx

```typescript
<Router>
  <ScrollToTop /> {/* Composant ajouté ici */}
  <Layout>
    <Routes>
      {/* ... toutes les routes */}
    </Routes>
  </Layout>
</Router>
```

**Position importante :** À l'intérieur du Router mais avant Layout

### 3. Hook personnalisé (bonus)

**Fichier** : `hooks/useScrollToTop.ts`

```typescript
// Pour des cas spécifiques
export const useScrollToTop = (trigger?: any) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [trigger]);
};

// Fonction utilitaire
export const scrollToTop = (smooth: boolean = false) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'instant'
  });
};
```

## Cas d'usage spécifiques

### 🚶 Page de détail des balades

**Problème résolu :** Quand on passe d'une balade à une autre, on reste à la même position de scroll

**Solution :** Scroll supplémentaire dans `WalkDetail.tsx`

```typescript
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}, [id]); // Se déclenche quand l'ID de la balade change
```

### 📋 Autres pages avec contenu dynamique

**Utilisation du hook :**
```typescript
import { useScrollToTop } from '../hooks/useScrollToTop';

const MyComponent = () => {
  const [data, setData] = useState();
  
  // Scroll vers le haut quand les données changent
  useScrollToTop(data);
  
  return <div>...</div>;
};
```

## Avantages UX

### ✅ Expérience utilisateur améliorée
- **Cohérence** : Comportement prévisible sur toutes les pages
- **Lisibilité** : L'utilisateur voit toujours le début du contenu
- **Navigation** : Pas de confusion sur la position dans la page

### ✅ Accessibilité
- **Lecteurs d'écran** : Position cohérente pour la lecture
- **Navigation clavier** : Focus au début de la page
- **Mobile** : Évite les problèmes de scroll sur petits écrans

### ✅ Performance
- **Instantané** : Pas d'animation qui ralentit
- **Léger** : Impact minimal sur les performances
- **Fiable** : Fonctionne sur tous les navigateurs

## Personnalisation possible

### Scroll avec animation

Si vous préférez une animation fluide :

```typescript
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth' // Animation fluide
});
```

### Scroll conditionnel

Pour certaines pages seulement :

```typescript
useEffect(() => {
  // Seulement pour certaines routes
  if (pathname.startsWith('/balades') || pathname.startsWith('/musees')) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}, [pathname]);
```

### Délai de scroll

Pour attendre le chargement du contenu :

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, 100); // Délai de 100ms

  return () => clearTimeout(timer);
}, [pathname]);
```

## Tests de validation

### Scénarios à tester

✅ **Navigation menu** : Accueil → Balades → Musées  
✅ **Liens internes** : Clic sur carte de balade → Page détail  
✅ **Bouton retour** : Détail balade → Liste balades  
✅ **URL directe** : Taper `/balades/cervia` dans la barre d'adresse  
✅ **Navigation rapide** : Cliquer rapidement sur plusieurs liens  

### Résultats attendus

- Page s'affiche toujours depuis le haut
- Pas de "saut" visuel désagréable
- Fonctionne sur mobile et desktop
- Compatible avec tous les navigateurs

## Dépannage

### Problème : Le scroll ne fonctionne pas

**Causes possibles :**
1. Composant mal placé dans l'arbre React
2. Conflit avec d'autres scripts de scroll
3. CSS qui force une position de scroll

**Solutions :**
1. Vérifier que `ScrollToTop` est dans le Router
2. Ajouter `!important` si nécessaire : `scroll-behavior: auto !important`
3. Utiliser `window.scrollTo(0, 0)` en version simplifiée

### Problème : Animation trop lente/rapide

**Solution :** Ajuster le `behavior`
- `'instant'` : Immédiat
- `'smooth'` : Animation fluide
- `'auto'` : Comportement par défaut du navigateur

## Évolutions futures

### Améliorations possibles
- **Mémorisation** : Se souvenir de la position sur certaines pages
- **Scroll intelligent** : Différent selon le type de navigation
- **Indicateur** : Bouton "Retour en haut" sur les longues pages
- **Smooth scroll** : Animation personnalisée plus fluide

---

**Résultat :** Navigation fluide et prévisible sur tout le site, améliorant significativement l'expérience utilisateur.