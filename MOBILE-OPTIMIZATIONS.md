# Optimisations Mobile - VisitChièvres.be

## Vue d'ensemble
Le site VisitChièvres.be a été entièrement optimisé pour offrir une expérience mobile parfaite sur tous les appareils (smartphones, tablettes).

## Améliorations Principales

### 1. **Meta Tags & Configuration**
- Viewport optimisé avec `maximum-scale=5.0` pour permettre le zoom
- Support PWA avec `mobile-web-app-capable`
- Barre de statut iOS adaptée

### 2. **Navigation Mobile**
- Menu hamburger responsive avec animations fluides
- Hauteur adaptative du menu (max-height pour éviter le débordement)
- Zones tactiles agrandies (min 44px) pour faciliter la navigation
- Classe `touch-manipulation` pour améliorer la réactivité
- Feedback visuel avec `active:scale-95` sur les boutons

### 3. **Typographie Responsive**
- Tailles de police adaptatives avec breakpoints sm/md/lg
- Exemple : `text-base sm:text-lg md:text-xl`
- Line-clamp pour tronquer le texte proprement

### 4. **Images & Médias**
- Hauteurs d'images adaptatives : `h-48 sm:h-56 md:h-64`
- Hero sections avec hauteurs optimisées par appareil
- Galeries photos avec grilles responsive

### 5. **Formulaires**
- Taille de police minimum 16px sur mobile (évite le zoom iOS)
- Champs de saisie avec padding adaptatif
- Boutons pleine largeur sur mobile, auto sur desktop

### 6. **Cartes Interactives (Mapbox)**
- Mode `cooperativeGestures` activé (scroll sans blocage)
- Zoom initial adapté à la taille d'écran
- Popups redimensionnées pour mobile
- Hint "Utilisez 2 doigts pour zoomer" sur mobile
- Padding des bounds adaptatif (40px mobile, 70px desktop)

### 7. **Modales & Overlays**
- Modales en plein écran sur mobile avec `rounded-t-2xl`
- Animation `slide-in-from-bottom` sur mobile
- Bouton de fermeture bien visible et accessible
- Footer sticky pour les actions principales

### 8. **Espacement & Layout**
- Padding conteneur : `px-4 sm:px-6`
- Gaps de grille : `gap-4 sm:gap-6 lg:gap-8`
- Marges verticales : `py-12 sm:py-16 md:py-20`

### 9. **Grilles Responsive**
- Cartes : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Formulaires : `grid-cols-1 sm:grid-cols-2`
- Adaptation automatique selon la largeur d'écran

### 10. **Performance & UX**
- `-webkit-tap-highlight-color` personnalisé
- `overscroll-behavior-y: none` pour éviter le bounce
- Smooth scrolling avec respect des préférences utilisateur
- Touch-action optimisé pour éviter les conflits de gestes

## Breakpoints Tailwind Utilisés

```
sm: 640px   (Petites tablettes portrait)
md: 768px   (Tablettes)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
```

## Classes Utilitaires Ajoutées

- `touch-manipulation` : Améliore la réactivité tactile
- `active:scale-95` : Feedback visuel au toucher
- `line-clamp-{n}` : Tronque le texte sur n lignes
- `pb-safe` : Padding pour les encoches (iPhone X+)

## Tests Recommandés

1. **iPhone SE (375px)** - Petit écran
2. **iPhone 12/13 (390px)** - Standard
3. **iPhone 14 Pro Max (430px)** - Grand écran
4. **iPad Mini (768px)** - Tablette portrait
5. **iPad Pro (1024px)** - Tablette paysage

## Compatibilité

- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Firefox Mobile 90+
- ✅ Samsung Internet 14+
- ✅ Edge Mobile 90+

## Notes Importantes

- Les formulaires utilisent `font-size: 16px` minimum pour éviter le zoom automatique sur iOS
- Les cartes Mapbox nécessitent 2 doigts pour zoomer (comportement standard mobile)
- Le menu mobile se ferme automatiquement après sélection d'un lien
- Les images sont optimisées avec `object-cover` pour éviter la déformation

## Prochaines Améliorations Possibles

- [ ] Mode sombre adaptatif
- [ ] Gestes de swipe pour la navigation
- [ ] Lazy loading des images
- [ ] Service Worker pour mode offline
- [ ] Optimisation des images avec WebP
