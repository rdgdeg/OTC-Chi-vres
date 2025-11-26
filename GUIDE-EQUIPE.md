# Guide - Gestion de l'Équipe

## Configuration initiale

### 1. Créer la table dans Supabase

Exécutez le script SQL `supabase-team-table.sql` dans votre éditeur SQL Supabase :

```bash
# Le fichier contient :
# - Création de la table team_members
# - Politiques RLS pour la sécurité
# - Données initiales (6 membres d'équipe)
```

### 2. Vérifier le bucket de stockage

Assurez-vous que le bucket `images` existe dans Supabase Storage avec les bonnes permissions :
- Public : Oui
- Taille max : 5 Mo
- Types autorisés : image/jpeg, image/png, image/webp

## Utilisation

### Modifier une photo de membre

1. Allez sur la page **Notre Équipe** (`/equipe`)
2. Survolez la photo d'un membre avec votre souris
3. Cliquez sur "Modifier la photo" qui apparaît
4. Sélectionnez une nouvelle image (max 5 Mo)
5. L'image est automatiquement uploadée et sauvegardée

### Fonctionnalités

- ✅ Upload d'images directement depuis la page publique
- ✅ Indicateur de chargement pendant l'upload
- ✅ Validation de la taille des fichiers (max 5 Mo)
- ✅ Sauvegarde automatique dans Supabase Storage
- ✅ Mise à jour en temps réel de l'affichage
- ✅ Fallback sur données par défaut si la table n'existe pas encore

### Structure de la table

```sql
team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL,
  imageUrl TEXT,
  order INTEGER DEFAULT 0
)
```

## Ajouter/Modifier des membres

Pour ajouter ou modifier des membres de l'équipe, vous pouvez :

1. **Via Supabase Dashboard** : 
   - Allez dans Table Editor > team_members
   - Ajoutez/modifiez les lignes directement

2. **Via SQL** :
   ```sql
   INSERT INTO team_members (id, name, role, email, phone, description, imageUrl, "order")
   VALUES ('team-7', 'Nouveau Membre', 'Poste', 'email@otchievres.be', '068/ 64 59 67', 'Description', 'https://picsum.photos/id/1005/400/400', 7);
   ```

## Dépannage

### L'upload ne fonctionne pas
- Vérifiez que la table `team_members` existe dans Supabase
- Vérifiez que le bucket `images` existe et est public
- Vérifiez les politiques RLS sur la table et le bucket

### Les images ne s'affichent pas
- Vérifiez que les URLs sont correctes dans la base de données
- Vérifiez que le bucket est bien configuré en public

### Erreur "Table doesn't exist"
- Exécutez le script `supabase-team-table.sql` dans Supabase
- La page affichera des données par défaut en attendant
