# 🔍 Audit - Contenu en Dur à Corriger

## 📋 Vue d'Ensemble

Cet audit identifie **tout le contenu texte en dur** présent dans les pages du site qui devrait être modifiable via les modals de l'admin.

## ❌ Problèmes Identifiés

### 1. **Museums.tsx** ✅ CORRIGÉ
- ~~Texte générique "L'expérience offerte par..."~~ → **SUPPRIMÉ**
- ~~Texte "Planifier votre visite"~~ → **SUPPRIMÉ**
- Texte d'introduction : "Découvrez nos musées..." → **À RENDRE MODIFIABLE**

### 2. **Accommodations.tsx** ❌ À CORRIGER
**Ligne 83-84** : Descriptions des types d'hébergement
```typescript
description: 'Profitez d\'un accueil personnalisé et d\'un petit-déjeuner 
savoureux dans nos chambres d\'hôtes chaleureuses.'
```
**Solution** : Créer une table `page_sections` pour stocker ces textes

### 3. **Dining.tsx** ❌ À CORRIGER
**Ligne 92-93** : Description de la page
```typescript
description: 'Découvrez tous nos établissements : restaurants, cafés 
et producteurs locaux pour une expérience culinaire complète.'
```
**Solution** : Utiliser le système de gestion de pages

### 4. **Walks.tsx** ❌ À CORRIGER
**Ligne 28-29** : Texte d'introduction
```typescript
{content.introText || "Découvrez nos sentiers..."}
```
**Solution** : Charger depuis la base de données

### 5. **Team.tsx** ❌ À CORRIGER
**Ligne 88** : Sous-titre
```typescript
subtitle="Des passionnés à votre service pour vous faire découvrir Chièvres"
```
**Ligne 188-190** : Texte de présentation
```typescript
Notre équipe est à votre disposition pour répondre à toutes vos questions 
et vous aider à préparer votre séjour à Chièvres.
```
**Solution** : Créer des champs modifiables dans la page

### 6. **Contact.tsx** ❌ À CORRIGER
**Ligne 11** : Sous-titre
```typescript
subtitle="Notre équipe est à votre écoute pour organiser votre visite."
```
**Solution** : Utiliser le système de gestion de pages

### 7. **Merchants.tsx** ❌ À CORRIGER
**Ligne 35** : Sous-titre
```typescript
subtitle="Soutenez l'économie locale et découvrez le savoir-faire de nos artisans."
```
**Solution** : Utiliser le système de gestion de pages

### 8. **Events.tsx** ❌ À CORRIGER
**Ligne 15-16** : Description
```typescript
Découvrez tous les événements, festivals et manifestations à Chièvres 
et dans la région
```
**Solution** : Utiliser le système de gestion de pages

### 9. **CrossageDetail.tsx** ❌ À CORRIGER
**Ligne 110-112** : Description
```typescript
Vivez le folklore chiévrois ! Découvrez un jeu médiéval de rue pas comme 
les autres… Embarquez amis, crosse et cholette, et plongez dans l'ambiance 
unique du crossage al' tonne !
```
**Solution** : Créer une fiche modifiable pour le Crossage

### 10. **Accommodation.tsx** ❌ À CORRIGER
**Ligne 24-26** : Texte d'introduction
```typescript
Profitez de l'hospitalité légendaire de notre région. Que vous cherchiez 
le confort moderne ou le charme rustique d'une ancienne ferme rénovée, 
vous trouverez l'endroit idéal pour poser vos valises.
```
**Solution** : Utiliser le système de gestion de pages

## 🎯 Plan de Correction

### Phase 1 : Système de Gestion de Contenu de Page ✅ EN COURS
Créer une table `page_content` dans Supabase avec :
- `page_id` : Identifiant de la page
- `section` : Section de la page (hero, intro, description, etc.)
- `content_type` : Type de contenu (text, html, image, etc.)
- `content` : Le contenu lui-même
- `order` : Ordre d'affichage

### Phase 2 : Migration des Contenus
Pour chaque page, migrer le contenu en dur vers la base de données :

#### A. Pages Simples (Hero + Intro)
- Contact
- Merchants
- Events
- Team

#### B. Pages avec Sections Multiples
- Accommodations (types d'hébergement)
- Dining (types de restaurants)
- Walks (introduction + conseils)

#### C. Pages Spéciales
- CrossageDetail (page dédiée)
- Museums (déjà partiellement corrigé)

### Phase 3 : Mise à Jour des Composants
Modifier chaque page pour :
1. Charger le contenu depuis la base de données
2. Afficher un fallback si pas de contenu
3. Permettre l'édition inline (optionnel)

## 📊 Statistiques

| Page | Blocs en Dur | Priorité | Statut |
|------|--------------|----------|--------|
| Museums | 2 | Haute | ✅ Corrigé |
| Accommodations | 4 | Haute | ❌ À faire |
| Dining | 2 | Haute | ❌ À faire |
| Walks | 2 | Moyenne | ❌ À faire |
| Team | 2 | Moyenne | ❌ À faire |
| Contact | 1 | Basse | ❌ À faire |
| Merchants | 1 | Basse | ❌ À faire |
| Events | 1 | Basse | ❌ À faire |
| CrossageDetail | 1 | Basse | ❌ À faire |
| Accommodation | 1 | Basse | ❌ À faire |

**Total** : 17 blocs de contenu en dur identifiés

## 🔧 Solution Technique Recommandée

### Option 1 : Table `page_content` (Recommandé)
```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  settings JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Avantages** :
- ✅ Flexible et extensible
- ✅ Permet plusieurs sections par page
- ✅ Facile à gérer depuis l'admin
- ✅ Historique des modifications possible

### Option 2 : Étendre `PageContentContext` (Plus Simple)
Ajouter des champs dans le context existant :
```typescript
interface PageContent {
  // ... champs existants
  introText?: string;
  heroSubtitle?: string;
  sections?: {
    id: string;
    type: string;
    content: string;
  }[];
}
```

**Avantages** :
- ✅ Utilise le système existant
- ✅ Pas de migration de base de données
- ✅ Plus rapide à implémenter

**Inconvénients** :
- ❌ Moins flexible
- ❌ Stockage dans localStorage (limité)

## 🎯 Recommandation

**Je recommande l'Option 1** (table `page_content`) car :
1. Plus professionnel et scalable
2. Permet un vrai CMS
3. Facile à étendre
4. Meilleure performance
5. Pas de limite de stockage

## 📝 Prochaines Étapes

### Étape 1 : Créer la Structure
1. Créer la table `page_content` dans Supabase
2. Créer le service `pageContentService.ts`
3. Créer le composant `PageContentEditor.tsx`

### Étape 2 : Migrer les Contenus
1. Identifier tous les contenus en dur
2. Les insérer dans la table
3. Mettre à jour les pages pour les charger

### Étape 3 : Intégrer dans l'Admin
1. Ajouter un onglet "Contenu des Pages"
2. Permettre l'édition de chaque section
3. Prévisualisation en temps réel

### Étape 4 : Tester et Valider
1. Vérifier chaque page
2. S'assurer que tout est modifiable
3. Documenter le processus

## 💡 Exemple d'Utilisation

### Avant (Contenu en Dur)
```typescript
<Hero 
  title="Contactez-nous"
  subtitle="Notre équipe est à votre écoute pour organiser votre visite."
  imageUrl="https://picsum.photos/id/1011/1920/600"
/>
```

### Après (Contenu Dynamique)
```typescript
const pageContent = await pageContentService.getPageContent('contact');

<Hero 
  title={pageContent.hero?.title || "Contactez-nous"}
  subtitle={pageContent.hero?.subtitle || ""}
  imageUrl={pageContent.hero?.image || "https://picsum.photos/id/1011/1920/600"}
/>
```

### Dans l'Admin
```
Admin → Pages & Bannières → Contact → Hero
- Titre : [Contactez-nous]
- Sous-titre : [Notre équipe est à votre écoute...]
- Image : [Choisir une image]
[Sauvegarder]
```

## ⏱️ Estimation du Temps

| Tâche | Temps Estimé |
|-------|--------------|
| Créer la structure DB | 30 min |
| Créer les services | 1h |
| Créer l'éditeur admin | 2h |
| Migrer les contenus | 2h |
| Tester et valider | 1h |
| **TOTAL** | **6h30** |

## 🎉 Résultat Final

Une fois terminé, vous pourrez :
- ✅ Modifier **chaque texte** de chaque page depuis l'admin
- ✅ Changer **chaque image** facilement
- ✅ Ajouter/supprimer des sections
- ✅ Prévisualiser avant de publier
- ✅ Gérer tout depuis une interface unique

**Plus aucun contenu en dur dans le code !**

---

**Date d'audit** : Janvier 2026  
**Pages auditées** : 20  
**Blocs identifiés** : 17  
**Statut** : En cours de correction
