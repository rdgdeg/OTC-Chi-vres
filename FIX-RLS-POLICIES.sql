-- ===================================
-- FIX RLS POLICIES - VisitChièvres.be
-- ===================================
-- Ce script corrige les politiques RLS pour permettre
-- les opérations INSERT/UPDATE/DELETE avec la clé anon
-- 
-- À exécuter dans Supabase SQL Editor

-- ===================================
-- 1. SUPPRIMER LES ANCIENNES POLITIQUES
-- ===================================

-- Places
DROP POLICY IF EXISTS "Allow authenticated insert on places" ON places;
DROP POLICY IF EXISTS "Allow authenticated update on places" ON places;
DROP POLICY IF EXISTS "Allow authenticated delete on places" ON places;

-- Experiences
DROP POLICY IF EXISTS "Allow authenticated insert on experiences" ON experiences;
DROP POLICY IF EXISTS "Allow authenticated update on experiences" ON experiences;
DROP POLICY IF EXISTS "Allow authenticated delete on experiences" ON experiences;

-- Events
DROP POLICY IF EXISTS "Allow authenticated insert on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated update on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated delete on events" ON events;

-- Articles
DROP POLICY IF EXISTS "Allow authenticated insert on articles" ON articles;
DROP POLICY IF EXISTS "Allow authenticated update on articles" ON articles;
DROP POLICY IF EXISTS "Allow authenticated delete on articles" ON articles;

-- Products
DROP POLICY IF EXISTS "Allow authenticated insert on products" ON products;
DROP POLICY IF EXISTS "Allow authenticated update on products" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete on products" ON products;

-- Page Content
DROP POLICY IF EXISTS "Allow authenticated insert on page_content" ON page_content;
DROP POLICY IF EXISTS "Allow authenticated update on page_content" ON page_content;
DROP POLICY IF EXISTS "Allow authenticated delete on page_content" ON page_content;

-- ===================================
-- 2. CRÉER LES NOUVELLES POLITIQUES (PERMISSIVES)
-- ===================================
-- ⚠️ ATTENTION : Ces politiques sont TRÈS permissives
-- Elles permettent à TOUT LE MONDE (même anonyme) de modifier les données
-- C'est OK pour le développement, mais PAS pour la production !
-- Pour la production, implémentez une vraie authentification

-- PLACES
CREATE POLICY "Allow all operations on places" 
ON places 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- EXPERIENCES
CREATE POLICY "Allow all operations on experiences" 
ON experiences 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- EVENTS
CREATE POLICY "Allow all operations on events" 
ON events 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ARTICLES
CREATE POLICY "Allow all operations on articles" 
ON articles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- PRODUCTS
CREATE POLICY "Allow all operations on products" 
ON products 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- PAGE_CONTENT
CREATE POLICY "Allow all operations on page_content" 
ON page_content 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ===================================
-- 3. VÉRIFICATION
-- ===================================
-- Vérifier que les politiques sont bien créées

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===================================
-- 4. STORAGE POLICIES (Images)
-- ===================================
-- Ces politiques doivent être créées dans l'interface Supabase
-- Storage > images > Policies

-- Politique 1 : Lecture publique
-- Name: Public read access
-- Policy: SELECT
-- Target roles: public
-- USING expression: true

-- Politique 2 : Upload public (⚠️ permissif pour dev)
-- Name: Public upload access
-- Policy: INSERT
-- Target roles: public
-- WITH CHECK expression: true

-- Politique 3 : Update public (⚠️ permissif pour dev)
-- Name: Public update access
-- Policy: UPDATE
-- Target roles: public
-- USING expression: true
-- WITH CHECK expression: true

-- Politique 4 : Delete public (⚠️ permissif pour dev)
-- Name: Public delete access
-- Policy: DELETE
-- Target roles: public
-- USING expression: true

-- ===================================
-- 5. ALTERNATIVE : DÉSACTIVER RLS (DEV SEULEMENT)
-- ===================================
-- Si vous voulez complètement désactiver RLS pour le développement
-- ⚠️ NE JAMAIS FAIRE ÇA EN PRODUCTION !

-- Décommenter les lignes suivantes si vous voulez désactiver RLS :
-- ALTER TABLE places DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

-- ===================================
-- 6. NOTES IMPORTANTES
-- ===================================

/*
POURQUOI CE PROBLÈME ?

Le problème vient du fait que vous utilisez la clé "anon" (anonyme) de Supabase
dans votre application frontend. Par défaut, les politiques RLS bloquent les
opérations INSERT/UPDATE/DELETE pour les utilisateurs anonymes.

SOLUTIONS :

1. SOLUTION ACTUELLE (ce script) :
   - Politiques RLS très permissives
   - Permet tout à tout le monde
   - ✅ Facile et rapide
   - ❌ Pas sécurisé pour la production

2. SOLUTION RECOMMANDÉE (production) :
   - Implémenter une vraie authentification (Supabase Auth)
   - Créer un rôle "admin" dans votre app
   - Politiques RLS basées sur auth.uid()
   - ✅ Sécurisé
   - ❌ Plus complexe

3. SOLUTION ALTERNATIVE :
   - Utiliser la clé "service_role" côté serveur
   - Créer une API backend qui gère les modifications
   - Politiques RLS strictes
   - ✅ Très sécurisé
   - ❌ Nécessite un backend

POUR LA PRODUCTION :

Avant de déployer en production, vous DEVEZ :
1. Implémenter une authentification
2. Créer des politiques RLS strictes
3. Protéger l'accès à l'admin avec un vrai login
4. Utiliser des rôles et permissions

EXEMPLE DE POLITIQUE RLS SÉCURISÉE :

CREATE POLICY "Allow admin update on places" 
ON places 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);

*/

-- ===================================
-- FIN DU SCRIPT
-- ===================================

-- Après avoir exécuté ce script :
-- 1. Rafraîchir votre application
-- 2. Tester les modifications dans l'admin
-- 3. Vérifier que les données se mettent à jour
-- 4. Consulter GUIDE-RAFRAICHISSEMENT.md si problème persiste
