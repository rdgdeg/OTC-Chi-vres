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

#### Étape 1 : Vérifier la table team_members
```sql
-- Dans Supabase SQL Editor
SELECT * FROM team_members;
```
Si erreur "relation does not exist" → Exécutez `supabase-team-table.sql`

#### Étape 2 : Vérifier le bucket images
1. Allez dans **Supabase Dashboard > Storage**
2. Vérifiez que le bucket `images` existe
3. Cliquez sur le bucket et vérifiez qu'il est **Public**
4. Si le bucket n'existe pas, créez-le :
   - Nom : `images`
   - Public : ✅ Oui
   - File size limit : 5 MB
   - Allowed MIME types : `image/*`

#### Étape 3 : Vérifier les politiques de stockage
Exécutez le script `FIX-TEAM-STORAGE.sql` dans Supabase SQL Editor

#### Étape 4 : Vérifier les politiques RLS de la table
```sql
-- Vérifier les politiques existantes
SELECT * FROM pg_policies WHERE tablename = 'team_members';
```

#### Étape 5 : Tester l'upload manuellement
1. Ouvrez la console du navigateur (F12)
2. Essayez d'uploader une image
3. Regardez les logs dans la console pour voir l'erreur exacte

### Messages d'erreur courants

**"Upload failed: The resource already exists"**
- Le fichier existe déjà dans le bucket
- Solution : Réessayez (un nouveau nom sera généré)

**"Upload failed: new row violates row-level security policy"**
- Les politiques RLS bloquent l'upload
- Solution : Exécutez `FIX-TEAM-STORAGE.sql`

**"Échec de l'upload de l'image vers Supabase Storage"**
- Le bucket n'existe pas ou n'est pas accessible
- Solution : Créez le bucket `images` et rendez-le public

**"Database update error"**
- La table existe mais les politiques RLS bloquent la mise à jour
- Solution : Vérifiez les politiques sur `team_members`

### Les images ne s'affichent pas
- Vérifiez que les URLs sont correctes dans la base de données
- Vérifiez que le bucket est bien configuré en public
- Testez l'URL directement dans le navigateur

### Erreur "Table doesn't exist"
- Exécutez le script `supabase-team-table.sql` dans Supabase
- La page affichera des données par défaut en attendant

### Checklist complète

- [ ] Table `team_members` créée (exécuter `supabase-team-table.sql`)
- [ ] Bucket `images` créé et configuré en public
- [ ] Politiques de stockage configurées (exécuter `FIX-TEAM-STORAGE.sql`)
- [ ] Politiques RLS sur `team_members` activées
- [ ] Variables d'environnement Supabase configurées dans `.env.local`
- [ ] Application redémarrée après changement de config
