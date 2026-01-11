# 🖼️ Guide d'ajout des images aux hébergements

## État actuel

✅ **Données complètes** : Les 9 hébergements sont présents avec toutes leurs informations
✅ **Caractéristiques** : Toutes les caractéristiques "Ce que vous aimerez" sont présentes
✅ **Interface admin** : L'AccommodationManager affiche déjà les images (quand présentes)
❌ **Images manquantes** : Aucun hébergement n'a d'image actuellement

## Méthodes pour ajouter les images

### Méthode 1: SQL Direct (Recommandée)

1. Ouvrir le dashboard Supabase : https://supabase.com/dashboard
2. Aller dans votre projet
3. Cliquer sur "SQL Editor" dans le menu de gauche
4. Copier-coller le contenu du fichier `scripts/add-images-manual.sql`
5. Cliquer sur "Run" pour exécuter

### Méthode 2: Interface Web

1. Ouvrir le fichier `add-images-admin.html` dans votre navigateur
2. Cliquer sur "Charger les hébergements"
3. Cliquer sur "Ajouter toutes les images"

### Méthode 3: Via l'admin de l'application

1. Démarrer le serveur : `npm run dev`
2. Aller sur http://localhost:5173
3. Naviguer vers l'admin des hébergements
4. Modifier chaque hébergement pour ajouter son image

## Images assignées

| Hébergement | Image URL |
|-------------|-----------|
| La Loge Bed & Breakfast | https://picsum.photos/id/1001/600/400 |
| Au sentier Chauchaut | https://picsum.photos/id/1002/600/400 |
| La Maison d'à côté | https://picsum.photos/id/1003/600/400 |
| Au Champ du Bouillon | https://picsum.photos/id/1004/600/400 |
| Les Greniers du Moulin | https://picsum.photos/id/1005/600/400 |
| L'Évasion | https://picsum.photos/id/1006/600/400 |
| Moulin du Domissart | https://picsum.photos/id/1007/600/400 |
| Chez les Kikis | https://picsum.photos/id/1008/600/400 |
| On dirait le sud… | https://picsum.photos/id/1009/600/400 |

## Vérification

Après avoir ajouté les images, vérifiez que :

1. **Admin interface** : Les images apparaissent dans l'AccommodationManager
2. **Page publique** : Les images s'affichent sur la page des hébergements
3. **Toutes les caractéristiques** : Les listes "Ce que vous aimerez" sont complètes

## Problème RLS identifié

Les politiques Row Level Security (RLS) empêchent les mises à jour via l'API anonyme. 
C'est pourquoi la méthode SQL directe est recommandée.

## Fonctionnalités confirmées

✅ **AccommodationManager** : Affiche les images dans la liste admin
✅ **AccommodationEditor** : Permet l'upload et la modification d'images  
✅ **Page publique** : Affiche toutes les caractéristiques sans troncature
✅ **Données exactes** : Tout le contenu correspond au texte fourni
✅ **Deux accès admin** : Via "Hébergements" et "Gestion du Contenu"