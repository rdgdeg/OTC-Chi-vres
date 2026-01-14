# CHAMPS ADMIN COMPLETS - À IMPLÉMENTER

## 🎯 Objectif
Ajouter TOUS les champs de l'ancien admin dans la nouvelle modale d'édition

## 📋 Champs manquants à ajouter

### Pour TOUS les types :
- ✅ Nom, Description, Statut
- ✅ Adresse, Téléphone, Email, Site web
- ⚠️ **À AJOUTER** :
  - Image principale (upload)
  - Galerie d'images (multiple)
  - Description courte (excerpt)
  - Slug (URL)
  - Coordonnées GPS (lat/lng)
  - Facebook
  - Tags
  - SEO (meta_title, meta_description)

### Hébergements (accommodations) :
- ✅ Gamme de prix, Capacité
- ⚠️ **À AJOUTER** :
  - Types multiples (checkboxes)
  - Village (select)
  - Nombre de chambres
  - Description des lits
  - Détails des tarifs
  - Heure d'arrivée/départ
  - Séjour minimum
  - Caractéristiques ("Ce que vous aimerez") - liste dynamique
  - Équipements - liste dynamique avec add/remove
  - Règles de la maison - liste dynamique
  - Politique d'annulation

### Événements :
- ✅ Date début/fin, Lieu
- ⚠️ **À AJOUTER** :
  - Heure de début/fin
  - Prix d'entrée
  - Organisateur
  - Catégorie d'événement
  - Lien de réservation

### Balades :
- ✅ Distance, Durée, Difficulté
- ⚠️ **À AJOUTER** :
  - Fichier GPX (downloadUrl)
  - Document PDF (documentUrl)
  - Point de départ
  - Type de balade (boucle, linéaire)
  - Dénivelé
  - Accessibilité

### Restaurants/Cafés :
- ⚠️ **À AJOUTER** :
  - Type de cuisine
  - Horaires d'ouverture (JSONB)
  - Gamme de prix
  - Spécialités
  - Menus (liens PDF)
  - Capacité (couverts)
  - Terrasse (oui/non)
  - Parking

### Patrimoine/Musées :
- ⚠️ **À AJOUTER** :
  - Horaires d'ouverture (JSONB)
  - Tarifs (adulte, enfant, groupe)
  - Durée de visite
  - Accessibilité PMR
  - Visites guidées
  - Langues disponibles
  - Période historique

## 🔧 Plan d'implémentation

### Phase 1 : Champs de base (FAIT ✅)
- Nom, description, statut
- Contact (téléphone, email, site web)
- Localisation (adresse)

### Phase 2 : Images et médias (EN COURS ⚠️)
- Upload image principale
- Galerie d'images
- Gestion des fichiers (GPX, PDF)

### Phase 3 : Champs spécifiques par catégorie
- Hébergements : tous les champs détaillés
- Événements : dates, horaires, prix
- Balades : fichiers, tracés
- Restaurants : menus, horaires
- Patrimoine : tarifs, horaires

### Phase 4 : Listes dynamiques
- Caractéristiques (features)
- Équipements (amenities)
- Règles (house_rules)
- Tags
- Galerie

### Phase 5 : SEO et métadonnées
- Meta title/description
- Slug personnalisé
- Tags pour recherche

## 📝 Structure du formulaire idéale

```
┌─ SECTION PRINCIPALE (encadré bleu) ─────────────┐
│ - Type(s) (checkboxes multiples)                │
│ - Localisation (adresse + village)              │
│ - Capacité                                       │
└──────────────────────────────────────────────────┘

┌─ INFORMATIONS DE BASE ──────────────────────────┐
│ - Nom, Slug                                      │
│ - Description courte, Description complète       │
│ - Statut                                         │
└──────────────────────────────────────────────────┘

┌─ IMAGES ─────────────────────────────────────────┐
│ - Image principale (upload)                      │
│ - Galerie (liste avec add/remove)                │
└──────────────────────────────────────────────────┘

┌─ CONTACT ────────────────────────────────────────┐
│ - Téléphone, Email                               │
│ - Site web, Facebook                             │
│ - Coordonnées GPS                                │
└──────────────────────────────────────────────────┘

┌─ CHAMPS SPÉCIFIQUES (selon type) ───────────────┐
│ [Contenu dynamique selon categoryId]             │
└──────────────────────────────────────────────────┘

┌─ LISTES DYNAMIQUES ──────────────────────────────┐
│ - Caractéristiques (+ add/remove)                │
│ - Équipements (+ add/remove)                     │
│ - Règles (+ add/remove)                          │
└──────────────────────────────────────────────────┘

┌─ SEO ────────────────────────────────────────────┐
│ - Meta title, Meta description                   │
│ - Tags                                           │
└──────────────────────────────────────────────────┘
```

## 🚀 Prochaines étapes

1. **Terminer EditItemModal.tsx** avec tous les champs
2. **Tester** chaque type de contenu
3. **Valider** que toutes les données sont sauvegardées
4. **Documenter** l'utilisation pour l'utilisateur final

## 📌 Notes importantes

- Garder la même structure que l'ancien admin pour faciliter la transition
- Utiliser des sections visuellement distinctes (encadrés colorés)
- Ajouter des icônes pour chaque type de champ
- Validation côté client avant sauvegarde
- Messages d'erreur clairs
- Mode aperçu pour visualiser avant sauvegarde