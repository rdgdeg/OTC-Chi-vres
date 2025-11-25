# Mobile Quick Reference 📱

Guide de référence rapide pour le développement mobile sur VisitChièvres.be

## 🎯 Breakpoints

```jsx
// Mobile First!
className="base sm:640px md:768px lg:1024px xl:1280px"
```

## 📐 Patterns Communs

### Container
```jsx
<div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
```

### Grille Responsive
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
```

### Titre
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
```

### Bouton
```jsx
<button className="w-full sm:w-auto px-6 py-3 touch-manipulation active:scale-95">
```

### Card
```jsx
<div className="p-4 sm:p-6 rounded-xl">
  <img className="h-48 sm:h-56 md:h-64" />
  <h3 className="text-lg sm:text-xl">
  <p className="text-sm sm:text-base">
</div>
```

### Input
```jsx
<input className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base" />
```

### Modal Mobile
```jsx
<div className="fixed inset-0 sm:p-4">
  <div className="rounded-t-2xl sm:rounded-2xl max-h-[95vh] sm:max-h-[90vh]">
```

### Navigation Mobile
```jsx
<nav className="max-h-[calc(100vh-4rem)] overflow-y-auto pb-safe">
```

## 🎨 Tailles Communes

### Spacing
- Padding : `p-4 sm:p-6 md:p-8`
- Margin : `mb-6 sm:mb-8 md:mb-12`
- Gap : `gap-4 sm:gap-6 lg:gap-8`

### Typography
- XS : `text-xs sm:text-sm`
- SM : `text-sm sm:text-base`
- Base : `text-base sm:text-lg`
- LG : `text-lg sm:text-xl`
- XL : `text-xl sm:text-2xl`
- 2XL : `text-2xl sm:text-3xl md:text-4xl`

### Heights
- Small : `h-32 sm:h-40 md:h-48`
- Medium : `h-48 sm:h-56 md:h-64`
- Large : `h-64 sm:h-72 md:h-80`

## 🖱️ Touch Classes

```jsx
// Toujours ajouter
className="touch-manipulation"

// Feedback visuel
className="active:scale-95"

// Pour les cartes
className="active:scale-98"
```

## 🗺️ Mapbox Mobile

```javascript
const isMobile = window.innerWidth < 768;

new mapboxgl.Map({
  zoom: isMobile ? 11 : 12,
  cooperativeGestures: true,
  touchPitch: false,
});

new mapboxgl.Popup({
  offset: isMobile ? 15 : 25,
  maxWidth: isMobile ? '200px' : '240px',
});

map.fitBounds(bounds, {
  padding: isMobile ? 40 : 70,
  maxZoom: isMobile ? 14 : 15,
});
```

## 📝 Formulaires

```jsx
// Input - Font 16px minimum (évite zoom iOS)
<input className="text-base" />

// Label visible
<label className="block text-sm font-semibold mb-2">

// Bouton submit
<button className="w-full sm:w-auto py-3 sm:py-4">
```

## 🎯 Zones Tactiles

```jsx
// Minimum 44x44px
<button className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">

// Espacement
<nav className="space-y-2">
  <Link className="block px-4 py-3">
```

## 🖼️ Images

```jsx
// Responsive
<img 
  src={url}
  className="w-full h-48 sm:h-56 md:h-64 object-cover"
  loading="lazy"
/>

// Hero
<div className="h-[50vh] sm:h-[55vh] md:h-[60vh]">
```

## 📱 Safe Areas

```jsx
// Pour les encoches iPhone
<div className="pb-safe">
```

## 🎨 Flex Layouts

```jsx
// Stack sur mobile, row sur desktop
<div className="flex flex-col sm:flex-row gap-4">

// Centré sur mobile, left sur desktop
<div className="text-center sm:text-left">

// Pleine largeur mobile
<button className="w-full sm:w-auto">
```

## 🔍 Line Clamp

```jsx
// Tronquer texte
<p className="line-clamp-2">  // 2 lignes max
<p className="line-clamp-3">  // 3 lignes max
```

## ⚡ Performance

```jsx
// Lazy loading
<img loading="lazy" />

// Code splitting (à implémenter)
const Page = React.lazy(() => import('./Page'));
```

## ♿ Accessibilité

```jsx
// Aria labels
<button aria-label="Ouvrir le menu">

// Focus visible
<button className="focus:ring-2 focus:ring-primary">

// Contraste minimum
<p className="text-slate-600">  // ✅ Bon
<p className="text-slate-300">  // ❌ Éviter
```

## 🚫 À Éviter

```jsx
// ❌ Pas de tailles fixes
<div className="w-[500px]">

// ❌ Pas de hover seul
<button className="hover:bg-blue-500">

// ❌ Pas de text-sm sur inputs
<input className="text-sm">

// ❌ Pas de min-height sur desktop
<button className="min-h-[44px]">

// ✅ Utiliser plutôt
<button className="min-h-[44px] sm:min-h-0">
```

## 🎯 Checklist Rapide

Avant de commit :
- [ ] Testé sur mobile (Chrome DevTools)
- [ ] Zones tactiles > 44px
- [ ] Texte lisible sans zoom
- [ ] Pas de débordement horizontal
- [ ] Images avec loading="lazy"
- [ ] Boutons avec touch-manipulation
- [ ] Inputs avec text-base minimum
- [ ] Feedback visuel (active:scale-95)

## 🔧 DevTools

```bash
# Chrome DevTools
Cmd/Ctrl + Shift + M  # Toggle device mode
Cmd/Ctrl + Shift + P  # Command palette
> Show Device Frame   # Afficher cadre appareil
```

## 📊 Tests Rapides

```bash
# Lighthouse Mobile
npm run lighthouse

# Ou dans Chrome DevTools
> Lighthouse > Mobile > Generate Report
```

## 🆘 Dépannage Rapide

### Débordement horizontal
```jsx
// Ajouter sur body ou container
className="overflow-x-hidden"
```

### Zoom involontaire iOS
```jsx
// Input avec font-size 16px minimum
<input className="text-base" />
```

### Menu mobile ne ferme pas
```jsx
// Ajouter onClick
onClick={() => setIsMenuOpen(false)}
```

### Carte bloque le scroll
```jsx
// Mapbox avec cooperativeGestures
cooperativeGestures: true
```

### Modal trop petite
```jsx
// Plein écran sur mobile
<div className="rounded-t-2xl sm:rounded-2xl">
```

## 📚 Ressources

- [Tailwind Responsive](https://tailwindcss.com/docs/responsive-design)
- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Web.dev Mobile](https://web.dev/mobile/)

---

**Tip** : Toujours tester sur un vrai appareil mobile avant de déployer !
