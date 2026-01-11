#!/usr/bin/env node

/**
 * Test rapide pour vérifier que le CMS fonctionne
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🧪 Test rapide du CMS...\n')

async function quickTest() {
  const tables = ['media', 'audit_logs', 'content_items', 'content_versions', 'content_media']
  
  console.log('📋 Vérification des tables...')
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`)
      } else {
        console.log(`  ✅ ${table}: OK`)
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`)
    }
  }
  
  console.log('\n🎯 Test de création de contenu...')
  
  try {
    const testContent = {
      type: 'article',
      title: 'Test CMS',
      slug: 'test-cms-' + Date.now(),
      status: 'draft',
      content: { text: 'Test' },
      metadata: {},
      seo: {},
      permissions: { public: true, roles: {}, users: {} }
    }
    
    const { data, error } = await supabase
      .from('content_items')
      .insert(testContent)
      .select()
      .single()
    
    if (error) {
      console.log(`  ❌ Création: ${error.message}`)
    } else {
      console.log(`  ✅ Contenu créé: ${data.id}`)
      
      // Nettoyer
      await supabase.from('content_items').delete().eq('id', data.id)
      console.log(`  🧹 Nettoyage effectué`)
    }
  } catch (err) {
    console.log(`  ❌ Erreur: ${err.message}`)
  }
  
  console.log('\n🎉 Test terminé!')
}

quickTest()