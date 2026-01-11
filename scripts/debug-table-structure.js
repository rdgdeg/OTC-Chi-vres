#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTable() {
  try {
    console.log('🔍 Debug de la table accommodations...');
    
    // Récupérer un hébergement avec tous les champs
    const { data: accommodation, error: fetchError } = await supabase
      .from('accommodations')
      .select('*')
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error('❌ Erreur lors de la lecture:', fetchError);
      return;
    }
    
    console.log('\n📋 Structure de la table (premier enregistrement):');
    console.log('Colonnes disponibles:');
    Object.keys(accommodation).forEach(key => {
      const value = accommodation[key];
      const type = typeof value;
      const preview = value ? (type === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null';
      console.log(`  - ${key}: ${type} = ${preview}`);
    });
    
    // Tester une mise à jour simple
    console.log('\n🧪 Test de mise à jour...');
    const testId = accommodation.id;
    const testImage = 'https://picsum.photos/id/1001/600/400';
    
    const { data: updateData, error: updateError } = await supabase
      .from('accommodations')
      .update({ featured_image: testImage })
      .eq('id', testId)
      .select('id, name, featured_image');
    
    if (updateError) {
      console.error('❌ Erreur de mise à jour:', updateError);
    } else {
      console.log('✅ Mise à jour réussie:', updateData);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

debugTable();