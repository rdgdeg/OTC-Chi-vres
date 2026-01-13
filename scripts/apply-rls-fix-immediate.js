import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Lire la configuration
const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configuration Supabase manquante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLS() {
  console.log('🔧 Application du correctif RLS pour les hébergements...');
  
  try {
    // Supprimer les anciennes politiques
    console.log('📝 Suppression des anciennes politiques...');
    
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Public read published accommodations" ON accommodations;',
      'DROP POLICY IF EXISTS "Authenticated users can read all accommodations" ON accommodations;',
      'DROP POLICY IF EXISTS "Authenticated users can insert accommodations" ON accommodations;',
      'DROP POLICY IF EXISTS "Authenticated users can update accommodations" ON accommodations;',
      'DROP POLICY IF EXISTS "Authenticated users can delete accommodations" ON accommodations;'
    ];
    
    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error && !error.message.includes('does not exist')) {
        console.warn('⚠️ Avertissement lors de la suppression:', error.message);
      }
    }
    
    // Créer les nouvelles politiques
    console.log('✨ Création des nouvelles politiques...');
    
    const newPolicies = [
      // Lecture publique des hébergements publiés
      `CREATE POLICY "Public can read published accommodations" 
       ON accommodations FOR SELECT 
       USING (status = 'published');`,
       
      // Lecture complète pour les utilisateurs authentifiés
      `CREATE POLICY "Authenticated users can read all accommodations" 
       ON accommodations FOR SELECT 
       USING (auth.role() = 'authenticated');`,
       
      // Insertion pour les utilisateurs authentifiés
      `CREATE POLICY "Authenticated users can insert accommodations" 
       ON accommodations FOR INSERT 
       WITH CHECK (auth.role() = 'authenticated');`,
       
      // Mise à jour pour les utilisateurs authentifiés
      `CREATE POLICY "Authenticated users can update accommodations" 
       ON accommodations FOR UPDATE 
       USING (auth.role() = 'authenticated')
       WITH CHECK (auth.role() = 'authenticated');`,
       
      // Suppression pour les utilisateurs authentifiés
      `CREATE POLICY "Authenticated users can delete accommodations" 
       ON accommodations FOR DELETE 
       USING (auth.role() = 'authenticated');`
    ];
    
    for (const policy of newPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error('❌ Erreur lors de la création de la politique:', error.message);
        return;
      }
    }
    
    // Activer RLS
    console.log('🔒 Activation de RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsError && !rlsError.message.includes('already enabled')) {
      console.warn('⚠️ RLS:', rlsError.message);
    }
    
    console.log('✅ Correctif RLS appliqué avec succès !');
    
    // Test de fonctionnement
    console.log('🧪 Test de lecture...');
    const { data: testData, error: testError } = await supabase
      .from('accommodations')
      .select('id, name, status')
      .limit(1);
      
    if (testError) {
      console.error('❌ Test de lecture échoué:', testError.message);
    } else {
      console.log('✅ Test de lecture réussi:', testData?.length || 0, 'hébergement(s) trouvé(s)');
    }
    
  } catch (err) {
    console.error('❌ Erreur générale:', err.message);
  }
}

fixRLS();