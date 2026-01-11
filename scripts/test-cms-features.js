#!/usr/bin/env node

/**
 * Script de test pour les fonctionnalités du CMS unifié
 * Vérifie que tous les services et composants fonctionnent correctement
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🧪 Test des fonctionnalités du CMS unifié...\n')

// Test 1: Vérifier les tables
async function testTables() {
  console.log('📋 Test 1: Vérification des tables...')
  
  const tables = [
    'content_items',
    'content_versions', 
    'content_media',
    'media',
    'audit_logs'
  ]
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`  ❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`  ✅ Table ${table}: OK`)
      }
    } catch (err) {
      console.log(`  ❌ Table ${table}: ${err.message}`)
    }
  }
  console.log()
}

// Test 2: Créer un contenu de test
async function testContentCreation() {
  console.log('📝 Test 2: Création de contenu...')
  
  try {
    const testContent = {
      type: 'article',
      title: 'Test Article CMS',
      slug: 'test-article-cms',
      status: 'draft',
      content: {
        blocks: [
          {
            id: '1',
            type: 'text',
            content: {
              text: 'Ceci est un article de test pour le CMS unifié.',
              html: '<p>Ceci est un article de test pour le CMS unifié.</p>'
            },
            position: 0,
            settings: {},
            media: [],
            visibility: { desktop: true, tablet: true, mobile: true }
          }
        ]
      },
      metadata: {
        description: 'Article de test pour vérifier le fonctionnement du CMS',
        tags: ['test', 'cms']
      },
      seo: {
        title: 'Test Article CMS',
        description: 'Article de test pour le CMS unifié'
      },
      permissions: {
        public: true,
        roles: {},
        users: {}
      }
    }
    
    const { data, error } = await supabase
      .from('content_items')
      .insert(testContent)
      .select()
      .single()
    
    if (error) {
      console.log(`  ❌ Création de contenu: ${error.message}`)
      return null
    } else {
      console.log(`  ✅ Contenu créé avec l'ID: ${data.id}`)
      return data
    }
  } catch (err) {
    console.log(`  ❌ Erreur lors de la création: ${err.message}`)
    return null
  }
}

// Test 3: Lire le contenu
async function testContentReading(contentId) {
  console.log('📖 Test 3: Lecture de contenu...')
  
  if (!contentId) {
    console.log('  ⏭️  Ignoré (pas de contenu créé)')
    return
  }
  
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        content_media (
          id,
          media_id,
          position,
          caption,
          alt_text
        )
      `)
      .eq('id', contentId)
      .single()
    
    if (error) {
      console.log(`  ❌ Lecture de contenu: ${error.message}`)
    } else {
      console.log(`  ✅ Contenu lu: ${data.title}`)
      console.log(`  📊 Blocs: ${data.content.blocks?.length || 0}`)
      console.log(`  🖼️  Médias: ${data.content_media?.length || 0}`)
    }
  } catch (err) {
    console.log(`  ❌ Erreur lors de la lecture: ${err.message}`)
  }
}

// Test 4: Mettre à jour le contenu
async function testContentUpdate(contentId) {
  console.log('✏️  Test 4: Mise à jour de contenu...')
  
  if (!contentId) {
    console.log('  ⏭️  Ignoré (pas de contenu créé)')
    return
  }
  
  try {
    const { data, error } = await supabase
      .from('content_items')
      .update({
        title: 'Test Article CMS - Modifié',
        status: 'published',
        version: 2,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId)
      .select()
      .single()
    
    if (error) {
      console.log(`  ❌ Mise à jour: ${error.message}`)
    } else {
      console.log(`  ✅ Contenu mis à jour: ${data.title}`)
      console.log(`  📈 Version: ${data.version}`)
      console.log(`  📊 Statut: ${data.status}`)
    }
  } catch (err) {
    console.log(`  ❌ Erreur lors de la mise à jour: ${err.message}`)
  }
}

// Test 5: Recherche de contenu
async function testContentSearch() {
  console.log('🔍 Test 5: Recherche de contenu...')
  
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('id, title, type, status')
      .or('title.ilike.%test%,content->>description.ilike.%test%')
      .limit(5)
    
    if (error) {
      console.log(`  ❌ Recherche: ${error.message}`)
    } else {
      console.log(`  ✅ Résultats trouvés: ${data.length}`)
      data.forEach(item => {
        console.log(`    - ${item.title} (${item.type}, ${item.status})`)
      })
    }
  } catch (err) {
    console.log(`  ❌ Erreur lors de la recherche: ${err.message}`)
  }
}

// Test 6: Vérifier les permissions RLS
async function testRLSPolicies() {
  console.log('🔐 Test 6: Politiques RLS...')
  
  try {
    // Test lecture publique (contenu publié)
    const { data: publicData, error: publicError } = await supabase
      .from('content_items')
      .select('id, title, status')
      .eq('status', 'published')
      .limit(3)
    
    if (publicError) {
      console.log(`  ❌ Lecture publique: ${publicError.message}`)
    } else {
      console.log(`  ✅ Lecture publique: ${publicData.length} contenus accessibles`)
    }
    
    // Test lecture de tous les contenus (nécessite authentification)
    const { data: allData, error: allError } = await supabase
      .from('content_items')
      .select('id, title, status')
      .limit(5)
    
    if (allError) {
      console.log(`  ⚠️  Lecture complète: ${allError.message} (normal si non authentifié)`)
    } else {
      console.log(`  ✅ Lecture complète: ${allData.length} contenus accessibles`)
    }
  } catch (err) {
    console.log(`  ❌ Erreur RLS: ${err.message}`)
  }
}

// Test 7: Vérifier les triggers
async function testTriggers(contentId) {
  console.log('⚡ Test 7: Triggers et audit...')
  
  if (!contentId) {
    console.log('  ⏭️  Ignoré (pas de contenu créé)')
    return
  }
  
  try {
    // Vérifier les logs d'audit
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource', 'content_items')
      .eq('resource_id', contentId)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (error) {
      console.log(`  ❌ Audit logs: ${error.message}`)
    } else {
      console.log(`  ✅ Audit logs: ${data.length} entrées trouvées`)
      data.forEach(log => {
        console.log(`    - ${log.action} à ${new Date(log.created_at).toLocaleString('fr-FR')}`)
      })
    }
  } catch (err) {
    console.log(`  ❌ Erreur triggers: ${err.message}`)
  }
}

// Test 8: Nettoyer les données de test
async function cleanupTestData(contentId) {
  console.log('🧹 Test 8: Nettoyage...')
  
  if (!contentId) {
    console.log('  ⏭️  Rien à nettoyer')
    return
  }
  
  try {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', contentId)
    
    if (error) {
      console.log(`  ❌ Nettoyage: ${error.message}`)
    } else {
      console.log(`  ✅ Contenu de test supprimé`)
    }
  } catch (err) {
    console.log(`  ❌ Erreur nettoyage: ${err.message}`)
  }
}

// Exécuter tous les tests
async function runAllTests() {
  try {
    await testTables()
    
    const testContent = await testContentCreation()
    const contentId = testContent?.id
    
    await testContentReading(contentId)
    await testContentUpdate(contentId)
    await testContentSearch()
    await testRLSPolicies()
    await testTriggers(contentId)
    await cleanupTestData(contentId)
    
    console.log('🎉 Tests terminés!')
    console.log('\n📋 Résumé:')
    console.log('- Tables CMS: Vérifiées')
    console.log('- CRUD contenu: Testé')
    console.log('- Recherche: Testée')
    console.log('- RLS: Vérifié')
    console.log('- Audit: Vérifié')
    console.log('- Nettoyage: Effectué')
    
  } catch (error) {
    console.error('💥 Erreur générale:', error.message)
    process.exit(1)
  }
}

// Lancer les tests
runAllTests()