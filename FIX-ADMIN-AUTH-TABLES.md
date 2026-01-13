# FIX ADMIN AUTH TABLES

## Problème résolu
- Erreur "column status does not exist" dans la vue walks
- Tables manquantes : walks, team_members, admin_sessions
- Authentification anonyme désactivée

## Solution appliquée

### 1. Script SQL corrigé (`scripts/fix-admin-auth-tables.sql`)
- Vérification et ajout automatique des colonnes manquantes
- Création sécurisée de la vue walks avec COALESCE
- Création de la table team_members avec RLS
- Système de sessions admin alternatif

### 2. Script de test (`scripts/test-admin-fixes.js`)
- Vérification de toutes les tables et vues
- Test des fonctions admin
- Validation des colonnes places

## Instructions d'exécution

1. **Exécuter le script SQL** dans Supabase SQL Editor :
   ```sql
   -- Copier le contenu de scripts/fix-admin-auth-tables.sql
   ```

2. **Activer l'authentification anonyme** dans Supabase :
   - Dashboard > Authentication > Settings
   - Cocher "Enable anonymous sign-ins"

3. **Tester les corrections** :
   ```bash
   node scripts/test-admin-fixes.js
   ```

## Résultat attendu
- ✅ Vue walks fonctionnelle
- ✅ Table team_members créée avec données par défaut
- ✅ Système de sessions admin opérationnel
- ✅ Toutes les colonnes places disponibles