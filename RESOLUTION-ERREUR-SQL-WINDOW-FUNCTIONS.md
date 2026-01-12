# Résolution : Erreur SQL Window Functions dans UPDATE

## Problème Rencontré

```
Error: Failed to run sql query: 
ERROR: 42P20: window functions are not allowed in UPDATE 
LINE 15: ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at, name)
```

## Cause du Problème

PostgreSQL (et donc Supabase) ne permet pas l'utilisation de **fonctions de fenêtre** (window functions) comme `ROW_NUMBER() OVER()` directement dans les clauses `UPDATE`.

### Code Problématique
```sql
UPDATE places 
SET sort_order = CASE 
    WHEN type IN ('museum') THEN 
        ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at, name)  -- ❌ Interdit
    ELSE 0
END
WHERE sort_order = 0;
```

## Solutions Implémentées

### Solution 1 : Utilisation de CTE (Common Table Expression)
```sql
WITH numbered_museums AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, name) as rn
    FROM places 
    WHERE type = 'museum' AND (sort_order IS NULL OR sort_order = 0)
)
UPDATE places 
SET sort_order = numbered_museums.rn
FROM numbered_museums
WHERE places.id = numbered_museums.id;
```

### Solution 2 : Boucle PL/pgSQL (Recommandée pour Supabase)
```sql
DO $$
DECLARE
    museum_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR museum_record IN 
        SELECT id FROM places 
        WHERE type = 'museum' AND (sort_order IS NULL OR sort_order = 0)
        ORDER BY name
    LOOP
        UPDATE places 
        SET sort_order = counter 
        WHERE id = museum_record.id;
        counter := counter + 1;
    END LOOP;
END $$;
```

### Solution 3 : Script JavaScript (Plus Flexible)
```javascript
// Récupérer les musées dans l'ordre souhaité
const { data: museums } = await supabase
  .from('places')
  .select('id, name')
  .eq('type', 'museum')
  .order('name');

// Mettre à jour chaque musée individuellement
for (let i = 0; i < museums.length; i++) {
  await supabase
    .from('places')
    .update({ sort_order: i + 1 })
    .eq('id', museums[i].id);
}
```

## Fichiers Créés pour la Résolution

### 1. Migration Corrigée
- **`migrations/add-sort-order-simple.sql`** : Version compatible Supabase
- Utilise une boucle PL/pgSQL au lieu de window functions

### 2. Script d'Exécution
- **`scripts/run-simple-sort-migration.js`** : Exécution sécurisée
- Gestion d'erreurs et vérifications
- Mode dégradé si la colonne n'existe pas

### 3. Tests de Validation
- **`scripts/test-museum-sorting.js`** : Tests complets
- Vérification du support des fonctionnalités
- Validation de la cohérence des données

## Résultats Obtenus

### État Final
```
✅ 7 musées testés
✅ Tri supporté en base de données
✅ Service de tri fonctionnel
✅ Filtres par catégorie opérationnels
✅ Aucun ordre dupliqué
✅ Tous les ordres définis correctement
```

### Ordre Actuel des Musées
1. Chapelle de la Ladrerie (ordre: 1)
2. Chapelle Notre-Dame de la Fontaine (ordre: 2)
3. Chapelle Saint-Jean-Baptiste (ordre: 3)
4. Église Saint-Martin (ordre: 4)
5. La Tour de Gavre (ordre: 5)
6. Musée de la Vie Rurale (ordre: 6)
7. Musée International de la Base Aérienne (M.I.B.A.) (ordre: 7)

## Bonnes Pratiques pour Éviter ce Problème

### 1. Éviter les Window Functions dans UPDATE
```sql
-- ❌ Ne pas faire
UPDATE table SET col = ROW_NUMBER() OVER (...);

-- ✅ Faire plutôt
WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (...) as rn FROM table
)
UPDATE table SET col = numbered.rn FROM numbered WHERE table.id = numbered.id;
```

### 2. Utiliser des Scripts pour les Opérations Complexes
- Plus de contrôle sur les erreurs
- Possibilité de rollback
- Logs détaillés des opérations

### 3. Tester les Migrations Avant Déploiement
- Scripts de test automatisés
- Vérification de la compatibilité
- Validation des résultats

## Commandes de Vérification

### Vérifier l'État Actuel
```bash
node scripts/test-museum-sorting.js
```

### Réexécuter la Migration si Nécessaire
```bash
node scripts/run-simple-sort-migration.js
```

### Tester l'Interface de Tri
1. Accéder à l'admin
2. Menu "Tri Musées & Patrimoine"
3. Tester le glisser-déposer
4. Vérifier la sauvegarde

## Impact sur l'Application

### Fonctionnalités Opérationnelles
- ✅ Interface de tri par glisser-déposer
- ✅ Sauvegarde en base de données
- ✅ Affichage trié sur le site public
- ✅ Conservation du tri avec les filtres
- ✅ Mode dégradé si nécessaire

### Performance
- Index créé sur `(type, sort_order)` pour optimiser les requêtes
- Tri efficace côté base de données
- Cache intelligent côté application

---

## Conclusion

L'erreur SQL a été **résolue avec succès** en remplaçant les window functions par une approche compatible avec Supabase. Le système de tri est maintenant **pleinement fonctionnel** et tous les tests passent.

**Le problème initial était uniquement dans la migration SQL, pas dans le code de l'application.**