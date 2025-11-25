# Meilleures Pratiques Mobile - VisitChièvres.be

## 🎯 Principes Fondamentaux

### 1. Mobile-First
✅ **Appliqué** : Toutes les pages sont conçues pour mobile d'abord, puis améliorées pour desktop.

### 2. Touch-Friendly
✅ **Appliqué** : Zones tactiles minimum 44x44px, espacement suffisant entre éléments.

### 3. Performance
⚠️ **À améliorer** : Optimisation images, lazy loading, code splitting.

### 4. Accessibilité
✅ **Appliqué** : Contraste, tailles de police, navigation clavier.

## 📐 Design Responsive

### Breakpoints Stratégiques

```css
/* Mobile First Approach */
/* Base styles = Mobile (< 640px) */

@media (min-width: 640px) {
  /* Petites tablettes portrait */
}

@media (min-width: 768px) {
  /* Tablettes */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

### Grilles Adaptatives

```jsx
// ✅ Bon
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

// ❌ Éviter
<div className="grid grid-cols-3 gap-8">
```

### Typographie Fluide

```jsx
// ✅ Bon
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// ❌ Éviter
<h1 className="text-5xl">
```

## 🖱️ Interactions Tactiles

### Zones de Touch

```jsx
// ✅ Bon - Minimum 44x44px
<button className="px-6 py-3 touch-manipulation">

// ❌ Éviter - Trop petit
<button className="px-2 py-1">
```

### Feedback Visuel

```jsx
// ✅ Bon - Feedback immédiat
<button className="active:scale-95 transition-transform">

// ❌ Éviter - Pas de feedback
<button className="hover:bg-blue-500">
```

### Prévention du Zoom Involontaire

```html
<!-- ✅ Bon - Font-size minimum 16px sur mobile -->
<input type="text" className="text-base" />

<!-- ❌ Éviter - Déclenche le zoom sur iOS -->
<input type="text" className="text-sm" />
```

## 🗺️ Cartes Interactives

### Configuration Mapbox Mobile

```javascript
// ✅ Bon
const isMobile = window.innerWidth < 768;

new mapboxgl.Map({
  cooperativeGestures: true,  // Évite le blocage du scroll
  touchZoomRotate: true,
  touchPitch: false,          // Désactive pitch sur mobile
  zoom: isMobile ? 11 : 12,   // Zoom adaptatif
});
```

### Popups Adaptatives

```javascript
// ✅ Bon
const popup = new mapboxgl.Popup({
  offset: isMobile ? 15 : 25,
  maxWidth: isMobile ? '200px' : '240px',
  closeButton: true,
});
```

## 📱 Modales & Overlays

### Modal Mobile-Friendly

```jsx
// ✅ Bon - Plein écran sur mobile
<div className="fixed inset-0 sm:p-4">
  <div className="rounded-t-2xl sm:rounded-2xl max-h-[95vh] sm:max-h-[90vh]">
    {/* Contenu */}
  </div>
</div>

// ❌ Éviter - Trop petit sur mobile
<div className="fixed inset-0 p-4">
  <div className="max-w-md mx-auto">
```

### Footer Sticky

```jsx
// ✅ Bon - Actions toujours visibles
<div className="sticky bottom-0 bg-white border-t p-4">
  <button className="w-full">Action</button>
</div>
```

## 🎨 Images & Médias

### Images Responsives

```jsx
// ✅ Bon
<img 
  src={image} 
  className="w-full h-48 sm:h-56 md:h-64 object-cover"
  loading="lazy"
/>

// ❌ Éviter
<img src={image} className="h-64" />
```

### Galeries Adaptatives

```jsx
// ✅ Bon
<div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
  {images.map(img => (
    <div className="h-32 sm:h-40 md:h-48">
      <img src={img} className="w-full h-full object-cover" />
    </div>
  ))}
</div>
```

## 📝 Formulaires

### Inputs Optimisés

```jsx
// ✅ Bon
<input 
  type="email"
  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base"
  placeholder="Email"
/>

// ❌ Éviter - Déclenche zoom iOS
<input 
  type="email"
  className="px-2 py-1 text-sm"
/>
```

### Boutons de Soumission

```jsx
// ✅ Bon - Pleine largeur sur mobile
<button className="w-full sm:w-auto px-6 py-3 touch-manipulation">
  Envoyer
</button>
```

### Labels Visibles

```jsx
// ✅ Bon
<label className="block text-sm font-semibold mb-2">
  Nom
</label>
<input type="text" />

// ❌ Éviter - Placeholder seul
<input type="text" placeholder="Nom" />
```

## 🎯 Navigation

### Menu Mobile

```jsx
// ✅ Bon - Scrollable avec safe area
<div className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-safe">
  {menuItems}
</div>

// ❌ Éviter - Déborde de l'écran
<div className="h-screen">
  {menuItems}
</div>
```

### Liens Espacés

```jsx
// ✅ Bon
<nav className="space-y-2">
  <Link className="block px-4 py-3">Item 1</Link>
  <Link className="block px-4 py-3">Item 2</Link>
</nav>

// ❌ Éviter - Trop serré
<nav>
  <Link className="px-2 py-1">Item 1</Link>
  <Link className="px-2 py-1">Item 2</Link>
</nav>
```

## 🚀 Performance

### Lazy Loading

```jsx
// ✅ Bon
<img src={image} loading="lazy" />

// À implémenter
const LazyComponent = React.lazy(() => import('./Component'));
```

### Code Splitting

```jsx
// À implémenter
const Museums = React.lazy(() => import('./pages/Museums'));
const Dining = React.lazy(() => import('./pages/Dining'));
```

### Optimisation Images

```bash
# À implémenter
# Convertir en WebP
# Générer plusieurs tailles
# Utiliser srcset
```

## ♿ Accessibilité

### Contraste

```jsx
// ✅ Bon - Ratio 4.5:1 minimum
<p className="text-slate-600">Texte</p>

// ❌ Éviter - Contraste insuffisant
<p className="text-slate-300">Texte</p>
```

### Focus Visible

```jsx
// ✅ Bon
<button className="focus:ring-2 focus:ring-primary">

// ❌ Éviter
<button className="focus:outline-none">
```

### Aria Labels

```jsx
// ✅ Bon
<button aria-label="Ouvrir le menu">
  <Menu />
</button>

// ❌ Éviter
<button>
  <Menu />
</button>
```

## 📊 Métriques à Surveiller

### Core Web Vitals

1. **LCP (Largest Contentful Paint)** : < 2.5s
   - Optimiser images hero
   - Lazy loading
   - CDN

2. **FID (First Input Delay)** : < 100ms
   - Réduire JavaScript
   - Code splitting
   - Web Workers

3. **CLS (Cumulative Layout Shift)** : < 0.1
   - Dimensions images fixes
   - Pas de contenu injecté dynamiquement au-dessus
   - Skeleton loaders

### Lighthouse Mobile

- **Performance** : > 90
- **Accessibility** : > 95
- **Best Practices** : > 95
- **SEO** : > 95

## 🔧 Outils Recommandés

### Développement

1. **Chrome DevTools** - Device Mode
2. **Firefox Responsive Design Mode**
3. **Safari Web Inspector** (pour iOS)

### Testing

1. **BrowserStack** - Tests multi-appareils
2. **LambdaTest** - Tests automatisés
3. **Google Lighthouse** - Audit performance

### Monitoring

1. **Google Analytics** - Comportement mobile
2. **Hotjar** - Heatmaps mobile
3. **Sentry** - Erreurs mobile

## 📚 Ressources

### Documentation

- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev - Mobile Performance](https://web.dev/mobile/)
- [Apple - iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design - Mobile](https://material.io/design/layout/responsive-layout-grid.html)

### Tailwind CSS

- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Touch Action](https://tailwindcss.com/docs/touch-action)
- [Screen Readers](https://tailwindcss.com/docs/screen-readers)

## ✅ Checklist Finale

### Design
- [ ] Toutes les pages responsive
- [ ] Zones tactiles > 44px
- [ ] Texte lisible sans zoom
- [ ] Images adaptatives
- [ ] Pas de débordement horizontal

### Performance
- [ ] Lighthouse Mobile > 90
- [ ] Images optimisées
- [ ] Lazy loading implémenté
- [ ] Code splitting actif

### Accessibilité
- [ ] Contraste suffisant
- [ ] Navigation clavier
- [ ] Aria labels
- [ ] Focus visible

### UX
- [ ] Feedback tactile
- [ ] Animations fluides
- [ ] Chargement progressif
- [ ] Messages d'erreur clairs

### Tests
- [ ] iPhone (petit, moyen, grand)
- [ ] Android (petit, moyen, grand)
- [ ] Tablette (portrait, paysage)
- [ ] Connexions lentes (3G, 4G)

## 🎓 Formation Continue

### Veille Technologique

1. **Suivre les évolutions** :
   - Nouveaux breakpoints (foldables)
   - Nouvelles API Web (Vibration, Geolocation)
   - Nouveaux patterns UX mobile

2. **Tester régulièrement** :
   - Nouveaux appareils
   - Nouvelles versions OS
   - Nouveaux navigateurs

3. **Itérer** :
   - Analytics utilisateurs
   - Feedback utilisateurs
   - A/B testing

---

**Maintenu par** : Équipe VisitChièvres.be
**Dernière mise à jour** : 25 novembre 2025
