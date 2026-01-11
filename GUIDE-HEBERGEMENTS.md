# Guide des Hébergements - Visit Chièvres

## 📋 Vue d'ensemble

Le système d'hébergements permet de gérer complètement les logements touristiques de Chièvres et ses villages : gîtes, chambres d'hôtes, hébergements insolites, etc.

## 🚀 Installation

### 1. Migration de la base de données

Exécutez dans l'éditeur SQL de Supabase :

```sql
-- Exécuter le fichier de migration
\i migrations/add-accommodations-table.sql

-- Créer la fonction pour les vues
CREATE OR REPLACE FUNCTION increment_accommodation_views(accommodation_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE accommodations 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = accommodation_id;
END;
$$ LANGUAGE plpgsql;
```

### 2. Vérification

Les données d'exemple sont automatiquement insérées avec tous les hébergements existants de Chièvres.

## 🎯 Fonctionnalités

### Page publique (`/hebergements`)

- **Liste complète** des hébergements avec filtres
- **Recherche** par nom, description, village
- **Filtres** par type, village, capacité
- **Cartes détaillées** pour chaque hébergement
- **Contact direct** (téléphone, email, site web, Facebook)

### Page de détail (`/hebergements/:slug`)

- **Galerie d'images** avec navigation
- **Informations complètes** (capacité, équipements, règles)
- **Contact et réservation** centralisés
- **Caractéristiques** mises en avant
- **Compteur de vues** automatique

### Administration (`/admin-dashboard` → Hébergements)

- **Gestion complète** des hébergements
- **Éditeur visuel** avec tous les champs
- **Upload d'images** via Supabase Storage
- **Statuts** : brouillon, publié, archivé
- **Statistiques** et analytics
- **Validation** des données

## 📝 Types d'hébergements

- **Bed & Breakfast** : Chambres d'hôtes avec petit-déjeuner
- **Gîte** : Hébergements indépendants
- **Hôtel** : Établissements hôteliers
- **Camping** : Emplacements de camping
- **Hébergement insolite** : Yacht, cabanes, etc.

## 🏘️ Villages couverts

- Chièvres (centre)
- Ladeuze
- Vaudignies
- Tongre-Saint-Martin
- Tongre-Notre-Dame
- Grosage
- Huissignies
- Bailleul

## 📊 Champs disponibles

### Informations de base
- Nom, slug, description
- Type d'hébergement
- Capacité (nombre de personnes)
- Nombre de chambres
- Description des lits

### Localisation
- Adresse complète
- Village
- Coordonnées GPS (optionnel)

### Contact
- Téléphone
- Email
- Site web
- Page Facebook

### Médias
- Image principale
- Galerie d'images (à venir)

### Caractéristiques
- "Ce que vous aimerez" (points forts)
- Équipements disponibles
- Règles de la maison

### Tarifs et conditions
- Gamme de prix
- Détails des tarifs
- Heures d'arrivée/départ
- Séjour minimum
- Politique d'annulation

### SEO
- Titre et description meta
- Slug personnalisable

## 🔧 Utilisation administrative

### Créer un hébergement

1. Aller dans **Admin Dashboard** → **Hébergements**
2. Cliquer sur **"Nouvel hébergement"**
3. Remplir les informations obligatoires :
   - Nom
   - Description
   - Type
   - Capacité
   - Adresse
4. Ajouter les caractéristiques et équipements
5. Uploader une image principale
6. Définir le statut (brouillon/publié)
7. Sauvegarder

### Modifier un hébergement

1. Dans la liste, cliquer sur l'icône **"Modifier"**
2. Effectuer les modifications
3. Sauvegarder les changements

### Gérer la visibilité

- **Brouillon** : Visible uniquement en admin
- **Publié** : Visible sur le site public
- **Archivé** : Masqué mais conservé

## 🎨 Personnalisation

### Ajouter des caractéristiques

Dans l'éditeur, section **"Ce que vous aimerez"** :
- Cliquer sur le champ de saisie
- Taper la caractéristique
- Appuyer sur Entrée ou cliquer sur **+**
- Répéter pour chaque point fort

### Ajouter des équipements

Section **"Équipements"** :
- WiFi, Parking, Cuisine, etc.
- Icônes automatiques selon le nom

### Règles de la maison

Section **"Règles de la maison"** :
- Horaires, animaux, fumeurs, etc.
- Une règle par ligne

## 📈 Analytics

### Statistiques disponibles
- Nombre total d'hébergements
- Répartition par statut
- Vues par hébergement
- Hébergements les plus consultés

### Compteur de vues
- Incrémenté automatiquement à chaque visite
- Visible dans l'administration
- Utilisé pour les statistiques

## 🔍 SEO et référencement

### URLs optimisées
- Format : `/hebergements/nom-hebergement-village`
- Génération automatique du slug
- Personnalisable manuellement

### Métadonnées
- Titre et description personnalisables
- Balises Open Graph (à venir)
- Schema.org pour les hébergements (à venir)

## 🚨 Bonnes pratiques

### Images
- Format recommandé : JPG ou PNG
- Taille optimale : 1200x800px
- Poids maximum : 2MB
- Alt text descriptif

### Descriptions
- **Excerpt** : 1-2 phrases pour les listes
- **Description** : Paragraphe complet et engageant
- Mentionner les points forts uniques
- Inclure les informations pratiques

### Contact
- Vérifier la validité des emails
- Tester les numéros de téléphone
- S'assurer que les sites web sont accessibles

## 🔧 Maintenance

### Mise à jour régulière
- Vérifier les informations de contact
- Mettre à jour les tarifs saisonniers
- Actualiser les photos
- Contrôler la disponibilité des liens

### Modération
- Valider les nouveaux hébergements
- Vérifier la qualité des contenus
- S'assurer de la cohérence des informations

## 📞 Support

Pour toute question ou problème :
1. Consulter ce guide
2. Vérifier les logs d'erreur dans la console
3. Contacter l'administrateur technique

---

*Guide créé pour Visit Chièvres - Version 1.0*