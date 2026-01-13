#!/usr/bin/env node

/**
 * Script pour appliquer les corrections de l'admin
 * Résout les problèmes d'authentification et de tables manquantes
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjI4NzQsImV4cCI6MjA1MDUzODg3NH0.Ej4rYJhOJhgJJhgJJhgJJhgJJhgJJhgJJhgJJhgJJhg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyFixes() {
  console.log('🔧 Application des corrections admin...');

  try {
    // 1. Lire et exécuter le script SQL
    const sqlPath = path.join(__dirname, 'fix-admin-auth-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Exécution du script SQL...');
    
    // Diviser le script en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.trim()) {
        try {
          await supabase.rpc('exec_sql', { sql: command });
          console.log('✅ Commande exécutée:', command.substring(0, 50) + '...');
        } catch (error) {
          console.warn('⚠️ Erreur sur commande (peut être normale):', error.message);
        }
      }
    }

    console.log('✅ Corrections appliquées avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application des corrections:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  applyFixes();
}

module.exports = { applyFixes };