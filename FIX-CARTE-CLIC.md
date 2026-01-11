# ✅ Fix - Clic sur la carte ouvre maintenant la fiche

## Problème résolu

Quand on cliquait sur un marqueur de la carte, seule la popup Mapbox s'affichait. Maintenant, cliquer sur un marqueur ouvre la fiche détaillée complète du musée.

## Modifications apportées

### 1. ✅ InteractiveMap.tsx

**Ajout d'un prop `onItemClick` :**
```typescript
interface InteractiveMapProps {
  items: Place[];
  height?: string;
  onItemClick?: (item: Place) => void;  // ← Nouveau
}
```

**Ajout de l'événement de clic sur les marqueurs :**
```typescript
// Add click event to open detail modal
if (onItemClick) {
  marker.getElement().addEventListener('click', () => {
    onItemClick(place);
  });
}
```

### 2. ✅ Museums.tsx

**Passage de la fonction callback :**
```typescript
<InteractiveMap 
  items={museums} 
  height="300px" 
  onItemClick={(museum) => setSelectedMuseum(museum)}  // ← Ouvre le modal
/>
```

## Comportement

### Avant
```
User clique sur marqueur
  → Popup Mapbox s'affiche
  → Affiche nom, adresse, type
  → Pas de fiche détaillée ❌
```

### Maintenant
```
User clique sur marqueur
  → Popup Mapbox s'affiche (comme avant)
  → ET le modal de détail s'ouvre ✅
  → Affiche toutes les infos (horaires, prix, contact, etc.)
  → Bouton "Voir sur Google Maps"
  → Bouton "Site Web"
```

## Test

1. **Rafraîchissez le navigateur** (Ctrl+Shift+R)
2. **Allez sur la page Musées** : http://localhost:3000/#/musees
3. **Cliquez sur un marqueur de la carte**
4. ✅ **Le modal de détail devrait s'ouvrir**

## Avantages

- ✅ Meilleure UX : accès direct aux détails depuis la carte
- ✅ Cohérent avec le bouton "En savoir plus" des fiches
- ✅ Fonctionne sur mobile et desktop
- ✅ La popup Mapbox reste visible pour un aperçu rapide

## Notes

- Le prop `onItemClick` est **optionnel**
- Si non fourni, la carte fonctionne comme avant (popup uniquement)
- Les autres pages (Dining, Merchants, etc.) ne sont pas affectées
- Elles peuvent ajouter cette fonctionnalité si besoin

## Autres pages

Si vous voulez ajouter cette fonctionnalité sur d'autres pages :

```typescript
// Dans Dining.tsx par exemple
const [selectedRestaurant, setSelectedRestaurant] = useState<Place | null>(null);

<InteractiveMap 
  items={restaurants} 
  height="300px" 
  onItemClick={(restaurant) => setSelectedRestaurant(restaurant)}
/>

// Puis ajouter le modal comme dans Museums.tsx
```

## Résumé

- ✅ Clic sur marqueur → Ouvre la fiche détaillée
- ✅ Fonctionne sur Museums.tsx
- ✅ Prêt à être ajouté sur d'autres pages
- ✅ Compatible mobile et desktop

**Le problème est résolu !** 🗺️
