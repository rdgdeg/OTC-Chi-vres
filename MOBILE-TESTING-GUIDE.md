# Guide de Test Mobile - VisitChièvres.be

## Checklist de Test par Page

### 🏠 Page d'Accueil (Home)
- [ ] Hero s'affiche correctement sur petit écran
- [ ] Section introduction avec image responsive
- [ ] Cartes "Envie de..." en grille 1 colonne sur mobile
- [ ] Section agenda avec 3 événements lisibles
- [ ] Tous les boutons sont facilement cliquables (44px min)
- [ ] Textes lisibles sans zoom

### 🏛️ Musées & Patrimoine
- [ ] Carte Mapbox interactive avec geste 2 doigts
- [ ] Galerie photos responsive (grid 2x2)
- [ ] Bouton "Générer IA" accessible
- [ ] Bouton "Partager" fonctionne (API native ou copie)
- [ ] Modal détail s'ouvre en plein écran mobile
- [ ] Modal scrollable avec bouton fermer visible
- [ ] Informations pratiques lisibles

### 🥾 Balades & Nature
- [ ] Sidebar devient bloc empilé sur mobile
- [ ] Cartes de balades avec distance/durée visibles
- [ ] Info box "Code du promeneur" lisible
- [ ] Bouton "Contactez-nous" accessible

### 🍽️ Gastronomie & Terroir
- [ ] Onglets catégories en colonne sur mobile
- [ ] Filtres villages wrappent correctement
- [ ] Carte Mapbox avec popups adaptées
- [ ] Grille restaurants 1 colonne sur mobile
- [ ] Message "Aucun résultat" bien formaté

### 🎯 Expériences
- [ ] Filtres catégories en 2 lignes max
- [ ] Cards expériences en colonne sur mobile
- [ ] Images expériences bien proportionnées
- [ ] Features avec checkmarks lisibles
- [ ] Bouton "Réserver" pleine largeur mobile

### 🏪 Commerçants
- [ ] Barre de recherche pleine largeur mobile
- [ ] Tags filtres wrappent sur plusieurs lignes
- [ ] Carte Mapbox interactive
- [ ] Grille commerces 1 colonne mobile
- [ ] Bouton reset visible et accessible

### 🏨 Hébergement
- [ ] Carte Mapbox avec markers
- [ ] Grille hébergements responsive
- [ ] Informations contact cliquables (tel, email)

### 📅 Agenda
- [ ] Toggle Liste/Calendrier accessible
- [ ] Vue liste avec cards empilées
- [ ] Date badge bien visible
- [ ] Bouton "Détails" pleine largeur mobile
- [ ] Calendrier responsive (si activé)

### 📞 Contact
- [ ] Grille infos 1 colonne sur mobile
- [ ] Formulaire champs empilés
- [ ] Inputs avec taille police 16px (pas de zoom iOS)
- [ ] Bouton envoi pleine largeur
- [ ] Liens tel/email cliquables

### 🧭 Navigation Globale
- [ ] Logo visible et proportionné
- [ ] Menu hamburger accessible (44px)
- [ ] Menu mobile scrollable
- [ ] Dropdowns fonctionnels
- [ ] Fermeture auto après sélection
- [ ] Footer responsive avec grilles adaptées

## Tests de Gestes Tactiles

### Scroll
- [ ] Scroll vertical fluide sur toutes les pages
- [ ] Pas de blocage sur les cartes Mapbox
- [ ] Overscroll bounce désactivé

### Tap/Touch
- [ ] Tous les boutons répondent au premier tap
- [ ] Feedback visuel (scale-95) sur les boutons
- [ ] Pas de double-tap zoom involontaire
- [ ] Liens et boutons espacés (pas de clics accidentels)

### Pinch Zoom
- [ ] Zoom autorisé sur la page (max 5x)
- [ ] Zoom sur carte avec 2 doigts
- [ ] Images zoomables dans galeries

### Swipe
- [ ] Swipe horizontal sur galeries (si implémenté)
- [ ] Pas de conflit avec navigation

## Tests de Performance Mobile

### Temps de Chargement
- [ ] Page d'accueil < 3s sur 4G
- [ ] Images optimisées et lazy-loaded
- [ ] Pas de layout shift (CLS)

### Fluidité
- [ ] Animations à 60fps
- [ ] Transitions smooth
- [ ] Pas de lag au scroll

### Consommation
- [ ] Pas de memory leak
- [ ] Batterie non drainée anormalement

## Tests de Compatibilité

### iOS Safari
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)

### Android Chrome
- [ ] Samsung Galaxy S21 (360px)
- [ ] Pixel 5 (393px)
- [ ] OnePlus 9 (412px)

### Orientations
- [ ] Portrait (toutes les pages)
- [ ] Paysage (vérifier débordements)

## Tests d'Accessibilité Mobile

### Contraste
- [ ] Ratio minimum 4.5:1 pour texte
- [ ] Boutons bien visibles

### Taille des Cibles
- [ ] Minimum 44x44px pour tous les éléments interactifs
- [ ] Espacement suffisant entre éléments

### Lisibilité
- [ ] Texte minimum 14px (16px pour inputs)
- [ ] Line-height confortable (1.5+)
- [ ] Pas de texte tronqué

### Navigation Clavier
- [ ] Tab order logique
- [ ] Focus visible
- [ ] Pas de piège clavier

## Tests de Connectivité

### 4G
- [ ] Chargement acceptable
- [ ] Images progressives

### 3G
- [ ] Contenu prioritaire visible rapidement
- [ ] Pas de timeout

### Offline
- [ ] Message d'erreur approprié
- [ ] Retry possible

## Outils de Test Recommandés

### Navigateurs
- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- Safari Web Inspector (iOS)

### Émulateurs
- BrowserStack
- LambdaTest
- Sauce Labs

### Appareils Réels
- Minimum 2 iPhones (petit + grand)
- Minimum 2 Android (petit + grand)
- 1 tablette

### Outils d'Analyse
- Google Lighthouse (Mobile)
- PageSpeed Insights
- WebPageTest (Mobile)

## Critères de Validation

### ✅ Succès
- Toutes les fonctionnalités accessibles
- Aucun élément coupé ou illisible
- Performance acceptable (Lighthouse > 80)
- Pas de bug bloquant

### ⚠️ Attention
- Quelques ajustements mineurs nécessaires
- Performance moyenne (Lighthouse 60-80)
- Bugs non-bloquants

### ❌ Échec
- Fonctionnalités inaccessibles
- Contenu illisible
- Performance médiocre (Lighthouse < 60)
- Bugs bloquants

## Rapport de Bug Mobile

Lors de la découverte d'un bug, documenter :

1. **Appareil** : Modèle, OS, version
2. **Navigateur** : Nom, version
3. **Page** : URL exacte
4. **Action** : Étapes pour reproduire
5. **Résultat attendu** : Ce qui devrait se passer
6. **Résultat obtenu** : Ce qui se passe réellement
7. **Screenshot** : Capture d'écran si possible
8. **Gravité** : Bloquant / Majeur / Mineur

## Prochaines Étapes

Après validation de tous les tests :
1. Corriger les bugs identifiés
2. Optimiser les performances si nécessaire
3. Tester à nouveau
4. Déployer en production
5. Monitorer les analytics mobile
