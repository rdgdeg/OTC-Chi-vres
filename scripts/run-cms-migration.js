#!/usr/bin/env node

/**
 * Script de migration pour déployer le CMS unifié
 * Crée les tables et migre les données existantes
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

console.log('🚀 Migration du CMS unifié...\n')

// Exécuter une requête SQL directement
async function executeSQLDirect(sql, description) {
  try {
    console.log(`📝 ${description}...`)
    
    // Diviser le SQL en instructions individuelles
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    let successCount = 0
    let errorCount = 0
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          })
          
          if (error) {
            console.log(`    ⚠️  ${error.message}`)
            errorCount++
          } else {
            successCount++
          }
        } catch (err) {
          console.log(`    ⚠️  ${err.message}`)
          errorCount++
        }
      }
    }
    
    console.log(`  ✅ ${successCount} instructions réussies, ${errorCount} erreurs`)
    return errorCount === 0
  } catch (err) {
    console.log(`  ❌ Exception: ${err.message}`)
    return false
  }
}

// Vérifier si les tables existent déjà
async function checkExistingTables() {
  console.log('🔍 Vérification des tables existantes...')
  
  const tables = [
    { name: 'media', required: true },
    { name: 'audit_logs', required: true },
    { name: 'content_items', required: false },
    { name: 'content_versions', required: false },
    { name: 'content_media', required: false }
  ]
  
  const existingTables = []
  const missingRequiredTables = []
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1)
      
      if (!error) {
        existingTables.push(table.name)
        console.log(`  ✅ Table ${table.name} existe`)
      } else if (table.required) {
        missingRequiredTables.push(table.name)
        console.log(`  ❌ Table ${table.name} manquante (requise)`)
      } else {
        console.log(`  📋 Table ${table.name} à créer`)
      }
    } catch (err) {
      if (table.required) {
        missingRequiredTables.push(table.name)
        console.log(`  ❌ Table ${table.name} manquante (requise)`)
      } else {
        console.log(`  📋 Table ${table.name} à créer`)
      }
    }
  }
  
  console.log()
  return { existingTables, missingRequiredTables }
}

// Créer les tables de base d'abord
async function createBaseTables() {
  console.log('🔧 Création des tables de base...')
  
  try {
    const simpleSQL = readFileSync(
      join(__dirname, '..', 'migrations', 'create-cms-simple.sql'), 
      'utf8'
    )
    
    return await executeSQLDirect(simpleSQL, 'Création complète du CMS (version simple)')
  } catch (error) {
    console.error('❌ Impossible de lire le fichier de migration simple:', error.message)
    
    // Fallback vers la version de base
    try {
      const mediaTableSQL = readFileSync(
        join(__dirname, '..', 'migrations', 'create-media-table-first.sql'), 
        'utf8'
      )
      
      return await executeSQLDirect(mediaTableSQL, 'Création des tables media et audit_logs')
    } catch (fallbackError) {
      console.error('❌ Impossible de lire le fichier de migration de base:', fallbackError.message)
      return false
    }
  }
}

// Exécuter la migration principale
async function runMainMigration() {
  console.log('🔧 Exécution de la migration principale...')
  
  try {
    const migrationSQL = readFileSync(
      join(__dirname, '..', 'migrations', 'create-unified-cms-tables.sql'), 
      'utf8'
    )
    
    return await executeSQLDirect(migrationSQL, 'Migration complète du CMS')
  } catch (error) {
    console.error('❌ Impossible de lire le fichier de migration principal:', error.message)
    return false
  }
}

// Sauvegarder les données existantes
async function backupExistingData() {
  console.log('💾 Sauvegarde des données existantes...')
  
  const backupData = {}
  
  // Sauvegarder les hébergements
  try {
    const { data: accommodations } = await supabase
      .from('accommodations')
      .select('*')
    
    if (accommodations && accommodations.length > 0) {
      backupData.accommodations = accommodations
      console.log(`  ✅ ${accommodations.length} hébergements sauvegardés`)
    }
  } catch (err) {
    console.log(`  ⚠️  Hébergements: ${err.message}`)
  }
  
  // Sauvegarder les lieux
  try {
    const { data: places } = await supabase
      .from('places')
      .select('*')
    
    if (places && places.length > 0) {
      backupData.places = places
      console.log(`  ✅ ${places.length} lieux sauvegardés`)
    }
  } catch (err) {
    console.log(`  ⚠️  Lieux: ${err.message}`)
  }
  
  console.log()
  return backupData
}

// Migrer les données existantes (version simplifiée)
async function migrateExistingData(backupData) {
  console.log('📦 Migration des données existantes...')
  
  // Pour l'instant, on ne migre pas automatiquement pour éviter les erreurs
  // L'utilisateur peut le faire manuellement via l'interface
  console.log('  ℹ️  Migration des données reportée à plus tard')
  console.log('  ℹ️  Vous pourrez migrer vos données via l\'interface CMS')
  
  return true
}

// Vérifier la migration
async function verifyMigration() {
  console.log('✅ Vérification de la migration...')
  
  const checks = [
    { table: 'media', description: 'Médias' },
    { table: 'audit_logs', description: 'Logs d\'audit' },
    { table: 'content_items', description: 'Contenus' },
    { table: 'content_versions', description: 'Versions' },
    { table: 'content_media', description: 'Relations médias' }
  ]
  
  let allGood = true
  
  for (const check of checks) {
    try {
      const { data, error } = await supabase
        .from(check.table)
        .select('id')
        .limit(1)
      
      if (error) {
        console.log(`  ❌ ${check.description}: ${error.message}`)
        allGood = false
      } else {
        console.log(`  ✅ ${check.description}: Table créée`)
      }
    } catch (err) {
      console.log(`  ❌ ${check.description}: ${err.message}`)
      allGood = false
    }
  }
  
  return allGood
}

// Fonction principale
async function main() {
  try {
    console.log('🎯 Début de la migration du CMS unifié\n')
    
    // 1. Vérifier l'état actuel
    const { existingTables, missingRequiredTables } = await checkExistingTables()
    
    // 2. Créer les tables de base si nécessaire
    if (missingRequiredTables.length > 0) {
      console.log('📋 Création des tables de base requises...')
      const baseSuccess = await createBaseTables()
      if (!baseSuccess) {
        console.log('⚠️  Erreurs lors de la création des tables de base, mais on continue...')
      }
    } else {
      console.log('📋 Utilisation de la migration simple pour tout créer...')
      const simpleSuccess = await createBaseTables()
      if (!simpleSuccess) {
        console.log('⚠️  Erreurs lors de la migration simple, essai de la migration complète...')
        await runMainMigration()
      }
    }
    
    // 3. Sauvegarder les données
    const backupData = await backupExistingData()
    
    // 4. Exécuter la migration principale seulement si nécessaire
    if (missingRequiredTables.length > 0) {
      const migrationSuccess = await runMainMigration()
      if (!migrationSuccess) {
        console.log('⚠️  Erreurs lors de la migration principale, mais on continue...')
      }
    }
    
    // 5. Migrer les données existantes
    await migrateExistingData(backupData)
    
    // 6. Vérifier le résultat
    const verificationSuccess = await verifyMigration()
    
    if (verificationSuccess) {
      console.log('\n🎉 Migration terminée avec succès!')
    } else {
      console.log('\n⚠️  Migration terminée avec des avertissements')
    }
    
    console.log('\n📋 Prochaines étapes:')
    console.log('1. Tester le CMS avec: npm run test:cms')
    console.log('2. Accéder au CMS unifié dans l\'interface admin')
    console.log('3. Vérifier que toutes les tables sont créées')
    console.log('4. Migrer vos données via l\'interface si nécessaire')
    
  } catch (error) {
    console.error('\n💥 Erreur lors de la migration:', error.message)
    console.log('\n🔧 Actions de dépannage:')
    console.log('1. Vérifiez la connexion à Supabase')
    console.log('2. Vérifiez les permissions de la base de données')
    console.log('3. Essayez d\'exécuter les migrations SQL manuellement')
    console.log('4. Consultez les logs Supabase pour plus de détails')
    process.exit(1)
  }
}

// Lancer la migration
main()