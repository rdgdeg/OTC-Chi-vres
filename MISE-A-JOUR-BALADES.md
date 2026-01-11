# Mise à jour de la section "Nature et Balades"

## Modifications apportées

### 1. Mise à jour du contenu de la page (mockData.ts)

**Nouveau titre et sous-titre :**
- Titre : "Découvrir - Balades"
- Sous-titre : "Partez à la découverte de Chièvres et de ses campagnes ! Que ce soit à pied, à cheval ou à vélo, succombez au charme d'un territoire riche en paysages, en patrimoine et en histoire."
- Introduction : "Cinq circuits soigneusement repérés vous guident à travers moulins, rivières, hameaux pittoresques ou encore, les allées de la cité. Téléchargez votre tracé et préparez-vous à vivre une balade au grand air… vous ne serez pas déçus !"

### 2. Nouveaux circuits de balades

**Fiches balades remplacées :**

1. **Circuit "Cervia"** (5 km, 1h, Facile)
   - Départ : Parc communal (Chièvres - rue du grand Vivier)
   - Circuit urbain avec flèches jaunes
   - Créé par Axelle Mercier

2. **La ronde des Piedsentes** (7,5 km, 2h, Facile)
   - Départ : Musée de la Vie rurale de Huissignies
   - Sentiers typiques entre terres agricoles

3. **Circuit découverte des églises** (22 km, ± 5h à pied, Moyen)
   - Départ : Rue du Château à Chièvres (église Saint-Martin)
   - Architecture gothique, romane et néo-gothique

4. **Circuit des châteaux** (28 km, ± 3h en vélo, Moyen)
   - Départ : Grand-Place Chièvres
   - Testé par le Vélo Club de Tongre Notre-Dame
   - Avec document explicatif

**L'entité en 5 circuits (scindés) :**

5. **À la rencontre des moulins** (18 km, 4h, Moyen)
   - Départ : Chapelle de la Ladrerie
   - Le long de la Hunelle
   - Lien OpenRunner : https://www.openrunner.com/route-details/22818735

6. **Les deux Tongre** (10 km, 2h, Facile)
   - Départ : Parking Moulin de la Hunelle
   - Villages de Tongre-Saint-Martin et Tongre-Notre-Dame
   - Lien OpenRunner : https://www.openrunner.com/route-details/22818836

7. **Ladeuze & Huissignies** (10 km, 2h, Facile)
   - Départ : halte nautique de Ladeuze
   - Paysages du Haut-Pays hennuyer
   - Lien OpenRunner : https://www.openrunner.com/route-details/22819149

8. **Vaudignies** (5,5 km, 1h30, Facile)
   - Départ : église Saint-Philippe
   - Pont des Amoureux
   - Lien OpenRunner : https://www.openrunner.com/route-details/12667613

9. **Grosage** (7 km, 1h45, Facile)
   - Départ : église de Grosage
   - Église Saint-Christophe
   - Lien OpenRunner : https://www.openrunner.com/route-details/19517101

### 3. Modifications techniques

**Types TypeScript :**
- Ajout des propriétés `downloadUrl` et `documentUrl` au type `Place`

**Composant Card :**
- Ajout des boutons de téléchargement pour les balades
- Bouton "Télécharger le tracé" (icône Download)
- Bouton "Document explicatif" (icône FileText)
- Design responsive avec couleurs primaire et secondaire

### 4. Circuits supprimés

- **Circuit "Journée du Patrimoine"** (supprimé comme demandé)
- Anciens circuits remplacés par les nouveaux

## Fonctionnalités ajoutées

- Boutons de téléchargement intégrés dans les cartes de balades
- Liens vers OpenRunner pour certains circuits
- Descriptions détaillées avec points d'intérêt
- Informations sur les créateurs/testeurs des circuits
- Classification par niveau de difficulté et public cible

## Mise à jour de la base de données

### Composants créés :
- **WalksDatabaseUpdater.tsx** : Interface pour mettre à jour la BDD
- **update-walks-database.ts** : Script de mise à jour ciblée
- **verify-walks-update.ts** : Script de vérification post-mise à jour

### Fonctionnalités de mise à jour :
- **Interface admin intégrée** : Bouton dans la section Balades
- **Prévisualisation** : Voir les données avant mise à jour
- **Vérification automatique** : Validation des données
- **Feedback en temps réel** : Statut de la mise à jour
- **Sauvegarde automatique** : Suppression des anciennes données et insertion des nouvelles

### Comment mettre à jour la base de données :

1. **Via l'interface admin** (Recommandé) :
   - Aller sur `/admin`
   - Cliquer sur "Balades" dans la sidebar
   - Utiliser le composant "Mise à jour des Balades"
   - Prévisualiser puis confirmer la mise à jour

2. **Via synchronisation complète** :
   - Utiliser le bouton "Initialiser DB" en haut de l'admin
   - Synchronise toutes les données mockData vers Supabase

### Vérifications post-mise à jour :
- Compter les balades : `SELECT COUNT(*) FROM places WHERE type = 'walk'` (doit retourner 9)
- Vérifier les liens : Tester les boutons de téléchargement
- Contrôler le contenu de page : Nouveau titre et descriptions

## Notes

- Les liens OpenRunner sont fonctionnels pour les circuits 5 à 9
- Les circuits 1 à 4 ont des liens placeholder ("#") en attendant les vrais liens
- Le circuit des châteaux inclut un document explicatif supplémentaire
- Tous les circuits sont maintenant adaptés aux demandes client
- La base de données peut être mise à jour facilement via l'interface admin
- Des scripts de vérification permettent de s'assurer que tout fonctionne correctement

## Fichiers créés/modifiés :

### Modifiés :
- `data/mockData.ts` : Nouvelles balades et contenu de page
- `types.ts` : Ajout des propriétés downloadUrl et documentUrl
- `components/Card.tsx` : Boutons de téléchargement
- `pages/Admin.tsx` : Intégration du composant de mise à jour

### Créés :
- `components/WalksDatabaseUpdater.tsx` : Interface de mise à jour
- `scripts/update-walks-database.ts` : Script de mise à jour
- `scripts/verify-walks-update.ts` : Script de vérification
- `GUIDE-MISE-A-JOUR-BDD-BALADES.md` : Guide d'utilisation
- `MISE-A-JOUR-BALADES.md` : Ce résumé