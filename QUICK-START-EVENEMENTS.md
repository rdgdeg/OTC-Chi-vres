# Démarrage Rapide - Gestion des Événements

## 🚀 Installation et Configuration

### 1. Exécuter la migration
```bash
cd OTC-Chi-vres
node scripts/run-events-migration.js
```

### 2. Tester les fonctionnalités
```bash
node scripts/test-events-features.js
```

### 3. Vérifier l'intégration
- Connectez-vous à l'admin
- Cliquez sur "Événements" dans le tableau de bord
- Créez votre premier événement

## ⚡ Utilisation Rapide

### Créer un événement
1. **Nouvel Événement** → Remplir les champs obligatoires
2. **Titre** : "Festival de Musique"
3. **Description** : Description complète
4. **Date** : Sélectionner date et heure
5. **Lieu** : "Grand-Place de Chièvres"
6. **Catégorie** : "Festival"
7. **Statut** : "Publié"
8. **Créer**

### Modifier un événement
1. Cliquer sur l'icône crayon
2. Modifier les champs souhaités
3. **Mettre à jour**

### Dupliquer un événement
1. Cliquer sur l'icône copie
2. Modifier le titre et les dates
3. **Créer**

## 📋 Champs Essentiels

### Obligatoires
- ✅ **Titre**
- ✅ **Description**
- ✅ **Date de début**
- ✅ **Lieu**
- ✅ **Catégorie**

### Recommandés
- 📝 **Description courte** (pour l'aperçu)
- 💰 **Prix** (texte libre)
- 📧 **Email de contact**
- 📞 **Téléphone**
- 🔗 **URL d'inscription** (si nécessaire)

## 🎯 Catégories Disponibles

- 🎭 **Folklore** : Fêtes traditionnelles
- 🎨 **Culture** : Concerts, expositions
- ⚽ **Sport** : Tournois, compétitions
- 🛒 **Marché** : Marchés saisonniers
- 🎤 **Conférence** : Séminaires, formations
- 🎪 **Festival** : Événements festifs

## 📊 Statuts des Événements

- 📝 **Brouillon** : En préparation (non visible)
- ✅ **Publié** : Visible sur le site
- ❌ **Annulé** : Événement annulé
- 📦 **Archivé** : Événement passé

## 🔍 Fonctionnalités de Recherche

### Filtres disponibles
- **Recherche textuelle** : Titre, description, lieu
- **Par catégorie** : Toutes les catégories
- **Par statut** : Tous les statuts

### Actions rapides
- 👁️ **Voir** : Afficher les détails
- ✏️ **Modifier** : Éditer l'événement
- 📋 **Dupliquer** : Copier l'événement
- 🗑️ **Supprimer** : Supprimer définitivement

## 🌐 Affichage Public

### Page d'agenda
- Accessible via `/events`
- Liste tous les événements publics
- Filtrage et recherche disponibles

### Événements d'aujourd'hui
- Mise en évidence spéciale
- Affichage prioritaire sur la page d'accueil

### Détails d'événement
- Modal avec toutes les informations
- Liens de contact automatiques
- Bouton d'inscription si configuré

## 🛠️ Dépannage Rapide

### L'événement n'apparaît pas
- ✅ Vérifier le statut = "Publié"
- ✅ Vérifier la date (pas dans le passé)
- ✅ Actualiser la page

### Erreur de sauvegarde
- ✅ Remplir tous les champs obligatoires
- ✅ Vérifier le format de l'email
- ✅ Vérifier le format de l'URL

### Problème de permissions
- ✅ Vérifier votre rôle utilisateur
- ✅ Se reconnecter à l'admin

## 📞 Support

1. Consulter le [Guide Complet](./GUIDE-GESTION-EVENEMENTS.md)
2. Exécuter les scripts de test
3. Vérifier les logs d'erreur
4. Contacter l'équipe technique

---

**Prêt en 3 minutes !** 🎉