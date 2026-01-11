# 🔧 CMS UNIFIÉ - GUIDE DE DÉPANNAGE

## 🚨 Erreur: "syntax error at or near NOT"

### 📋 Diagnostic

Cette erreur indique que votre version de PostgreSQL/Supabase ne supporte pas la syntaxe `CREATE POLICY IF NOT EXISTS`. C'est un problème de compatibilité.

### 🔧 Solutions

#### **Solution 1: Migration Simplifiée (Recommandée)**

J'ai créé une version simplifiée qui évite ce problème :

```bash
npm run migrate:cms
```

Le script utilisera automatiquement `create-cms-simple.sql` qui est compatible avec toutes les versions.

#### **Solution 2: Migration Manuelle Simplifiée**

Exécutez directement dans Supabase SQL Editor le contenu du fichier :
`migrations/create-cms-simple.sql`

Ce fichier contient toute la migration en une seule fois avec une syntaxe compatible.

---

## 🚨 Erreur: "relation media does not exist"

### 📋 Diagnostic

Cette erreur indique que la table `media` n'existe pas dans votre base de données Supabase. C'est normal si c'est votre première installation du CMS unifié.

### 🔧 Solutions

#### **Solution 1: Migration Automatique (Recommandée)**

1. **Exécutez le script de migration amélioré :**
```bash
npm run migrate:cms
```

Ce script va :
- ✅ Vérifier quelles tables existent
- ✅ Créer les tables manquantes
- ✅ Gérer les erreurs automatiquement
- ✅ Vous donner un rapport détaillé

#### **Solution 2: Migration Manuelle**

Si le script automatique ne fonctionne pas, créez les tables manuellement :

1. **Connectez-vous à Supabase Dashboard**
2. **Allez dans SQL Editor**
3. **Exécutez d'abord cette requête :**

```sql
-- Créer la table media
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration REAL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  folder TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Puis exécutez le contenu du fichier :**
   `migrations/create-unified-cms-tables.sql`

#### **Solution 3: Utilisation du Fichier de Migration Spécifique**

1. **Exécutez d'abord :**
```sql
-- Contenu du fichier migrations/create-media-table-first.sql
```

2. **Puis exécutez :**
```sql
-- Contenu du fichier migrations/create-unified-cms-tables.sql
```

---

## 🔍 Autres Erreurs Courantes

### **Erreur: "permission denied for table"**

**Cause :** Permissions insuffisantes  
**Solution :**
1. Vérifiez que vous utilisez la clé `service_role` et non `anon`
2. Ou exécutez les migrations directement dans Supabase SQL Editor

### **Erreur: "column does not exist"**

**Cause :** Migration incomplète  
**Solution :**
1. Vérifiez que toutes les migrations ont été exécutées
2. Relancez `npm run migrate:cms`

### **Erreur: "function exec_sql does not exist"**

**Cause :** Fonction RPC manquante  
**Solution :** Exécutez les migrations manuellement dans Supabase SQL Editor

---

## 🧪 Vérification Post-Migration

### **1. Testez la Migration**
```bash
npm run test:cms
```

### **2. Vérifiez les Tables Manuellement**

Connectez-vous à Supabase et vérifiez que ces tables existent :
- ✅ `media`
- ✅ `audit_logs`
- ✅ `content_items`
- ✅ `content_versions`
- ✅ `content_media`

### **3. Vérifiez les Données**

```sql
-- Compter les entrées dans chaque table
SELECT 'media' as table_name, COUNT(*) as count FROM media
UNION ALL
SELECT 'content_items', COUNT(*) FROM content_items
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;
```

---

## 🚀 Accès au CMS

Une fois la migration réussie :

1. **Lancez l'application :**
```bash
npm run dev
```

2. **Connectez-vous à l'interface admin**

3. **Cliquez sur "CMS Unifié" dans la barre latérale**

4. **Vérifiez que tout fonctionne :**
   - Dashboard s'affiche
   - Vous pouvez créer du contenu
   - Vous pouvez uploader des médias

---

## 📞 Support Avancé

### **Logs de Débogage**

Si vous avez encore des problèmes :

1. **Activez les logs détaillés :**
```javascript
// Dans votre code, ajoutez :
console.log('Supabase URL:', process.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

2. **Vérifiez la connexion Supabase :**
```javascript
// Test de connexion
const { data, error } = await supabase
  .from('accommodations') // Table qui existe sûrement
  .select('*')
  .limit(1)

console.log('Connexion Supabase:', error ? 'ERREUR' : 'OK')
```

### **Réinitialisation Complète**

Si tout échoue, vous pouvez réinitialiser :

1. **Supprimez les tables CMS :**
```sql
DROP TABLE IF EXISTS content_media CASCADE;
DROP TABLE IF EXISTS content_versions CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
```

2. **Relancez la migration :**
```bash
npm run migrate:cms
```

---

## ✅ Checklist de Résolution

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Connexion Supabase fonctionnelle
- [ ] Table `media` créée
- [ ] Table `audit_logs` créée
- [ ] Tables CMS créées (`content_items`, etc.)
- [ ] Permissions RLS configurées
- [ ] Tests passent (`npm run test:cms`)
- [ ] Interface CMS accessible
- [ ] Création de contenu fonctionne
- [ ] Upload de médias fonctionne

---

## 🎯 Résolution Rapide

**Pour résoudre rapidement l'erreur "media does not exist" :**

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer la migration
npm run migrate:cms

# 3. Tester
npm run test:cms

# 4. Lancer l'app
npm run dev
```

Si ça ne marche toujours pas, exécutez manuellement dans Supabase SQL Editor le contenu du fichier `migrations/create-media-table-first.sql`.

---

**🚀 Une fois résolu, profitez de votre CMS unifié !**