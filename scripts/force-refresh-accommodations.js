#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyrqqruqvvhwmgkhlhed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cnFxcnVxdnZod21na2hsaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE1MzMsImV4cCI6MjA3OTU2NzUzM30.0i_zHPfL7KYc9VaU3FVbx8H7NufOgcbFa2E39GGdVts';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceRefresh() {
  try {
    console.log('🔄 FORÇAGE DU RAFRAÎCHISSEMENT DES HÉBERGEMENTS');
    console.log('='.repeat(60));
    
    // 1. S'assurer que tous les hébergements sont publiés
    console.log('\n📝 Mise à jour du statut des hébergements...');
    const { data: updateResult, error: updateError } = await supabase
      .from('accommodations')
      .update({ 
        status: 'published',
        updated_at: new Date().toISOString()
      })
      .neq('id', '');
    
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
    } else {
      console.log('✅ Tous les hébergements sont maintenant publiés');
    }
    
    // 2. Vérifier les données pour la page publique
    console.log('\n🔍 Vérification des données pour la page publique...');
    const { data: accommodations, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log(`📊 Hébergements publiés: ${accommodations.length}`);
    
    // 3. Analyser par type pour les onglets
    const byType = {
      gite: accommodations.filter(a => a.type === 'gite'),
      bed_breakfast: accommodations.filter(a => a.type === 'bed_breakfast'),
      unusual: accommodations.filter(a => a.type === 'unusual'),
      hotel: accommodations.filter(a => a.type === 'hotel'),
      camping: accommodations.filter(a => a.type === 'camping')
    };
    
    console.log('\n📋 RÉPARTITION PAR ONGLETS (page publique):');
    console.log(`🏠 Gîtes: ${byType.gite.length} hébergements`);
    byType.gite.forEach(acc => console.log(`   - ${acc.name} (${acc.capacity} pers.)`));
    
    console.log(`🏡 B&B: ${byType.bed_breakfast.length} hébergements`);
    byType.bed_breakfast.forEach(acc => console.log(`   - ${acc.name} (${acc.capacity} pers.)`));
    
    console.log(`⭐ Insolite: ${byType.unusual.length} hébergements`);
    byType.unusual.forEach(acc => console.log(`   - ${acc.name} (${acc.capacity} pers.)`));
    
    console.log(`🏨 Hôtels: ${byType.hotel.length} hébergements`);
    console.log(`⛺ Campings: ${byType.camping.length} hébergements`);
    
    // 4. Vérifier les champs essentiels
    console.log('\n🔍 VÉRIFICATION CHAMPS ESSENTIELS:');
    let allGood = true;
    
    accommodations.forEach(acc => {
      const issues = [];
      if (!acc.type) issues.push('Type manquant');
      if (!acc.address) issues.push('Adresse manquante');
      if (!acc.capacity) issues.push('Capacité manquante');
      if (!acc.featured_image) issues.push('Image manquante');
      
      const status = issues.length === 0 ? '✅' : '⚠️';
      console.log(`${status} ${acc.name}`);
      if (issues.length > 0) {
        console.log(`   Issues: ${issues.join(', ')}`);
        allGood = false;
      }
    });
    
    // 5. Instructions pour tester
    console.log('\n🌐 INSTRUCTIONS POUR TESTER:');
    console.log('1. Ouvrir: http://localhost:5173/hebergements');
    console.log('2. Vider le cache du navigateur (Ctrl+F5 ou Cmd+Shift+R)');
    console.log('3. Vérifier les onglets:');
    console.log(`   - Gîtes (${byType.gite.length})`);
    console.log(`   - B&B (${byType.bed_breakfast.length})`);
    console.log(`   - Insolite (${byType.unusual.length})`);
    console.log('4. Tester les filtres par village');
    console.log('5. Vérifier que la carte s\'affiche');
    
    console.log('\n📱 INSTRUCTIONS POUR L\'ADMIN:');
    console.log('1. Aller dans Admin → Hébergements');
    console.log('2. Vérifier que tous les hébergements sont visibles');
    console.log('3. Les champs Type, Localisation, Capacité sont maintenant en évidence');
    console.log('4. Modifier un hébergement pour tester');
    
    if (allGood) {
      console.log('\n🎉 TOUT EST PRÊT ! Les hébergements devraient maintenant apparaître.');
    } else {
      console.log('\n⚠️ Quelques corrections nécessaires (voir ci-dessus)');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

forceRefresh();