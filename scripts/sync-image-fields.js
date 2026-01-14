import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function syncImageFields() {
  console.log('🔧 Synchronisation des champs d\'images...\n');
  
  try {
    // 1. Vérifier places (déjà OK avec imageUrl)
    const { data: placesData, error: placesError } = await supabase
      .from('places')
      .select('id, imageUrl, type')
      .not('imageUrl', 'is', null)
      .limit(3);
      
    if (placesError) {
      console.error('❌ Erreur places:', placesError.message);
    } else {
      console.log('✅ Table places utilise déjà imageUrl');
      console.log('   Exemples:', placesData.map(p => `${p.type}: ${p.id}`).join(', '));
    }
    
    // 2. Accommodations - Copier featured_image vers imageUrl
    console.log('\n📋 Traitement des accommodations...');
    const { data: accData, error: accError } = await supabase
      .from('accommodations')
      .select('id, name, featured_image, imageUrl');
      
    if (accError) {
      console.error('❌ Erreur accommodations:', accError.message);
    } else if (accData) {
      console.log(`   Trouvé ${accData.length} hébergements`);
      let updated = 0;
      
      for (const acc of accData) {
        // Si featured_image existe mais pas imageUrl, copier
        if (acc.featured_image && !acc.imageUrl) {
          const { error: updateError } = await supabase
            .from('accommodations')
            .update({ imageUrl: acc.featured_image })
            .eq('id', acc.id);
            
          if (updateError) {
            console.error(`   ❌ Erreur pour ${acc.id}:`, updateError.message);
          } else {
            console.log(`   ✅ Copié image pour: ${acc.name}`);
            updated++;
          }
        }
      }
      
      console.log(`   📊 ${updated} hébergements mis à jour`);
    }
    
    // 3. Events - Copier featured_image vers imageUrl
    console.log('\n📋 Traitement des événements...');
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, featured_image, imageUrl');
      
    if (eventsError) {
      console.error('❌ Erreur events:', eventsError.message);
    } else if (eventsData) {
      console.log(`   Trouvé ${eventsData.length} événements`);
      let updated = 0;
      
      for (const event of eventsData) {
        if (event.featured_image && !event.imageUrl) {
          const { error: updateError } = await supabase
            .from('events')
            .update({ imageUrl: event.featured_image })
            .eq('id', event.id);
            
          if (updateError) {
            console.error(`   ❌ Erreur pour ${event.id}:`, updateError.message);
          } else {
            console.log(`   ✅ Copié image pour: ${event.title}`);
            updated++;
          }
        }
      }
      
      console.log(`   📊 ${updated} événements mis à jour`);
    }
    
    // 4. Articles - Copier featured_image vers imageUrl
    console.log('\n📋 Traitement des articles...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, featured_image, imageUrl');
      
    if (articlesError) {
      console.error('❌ Erreur articles:', articlesError.message);
    } else if (articlesData) {
      console.log(`   Trouvé ${articlesData.length} articles`);
      let updated = 0;
      
      for (const article of articlesData) {
        if (article.featured_image && !article.imageUrl) {
          const { error: updateError } = await supabase
            .from('articles')
            .update({ imageUrl: article.featured_image })
            .eq('id', article.id);
            
          if (updateError) {
            console.error(`   ❌ Erreur pour ${article.id}:`, updateError.message);
          } else {
            console.log(`   ✅ Copié image pour: ${article.title}`);
            updated++;
          }
        }
      }
      
      console.log(`   📊 ${updated} articles mis à jour`);
    }
    
    // 5. Vérification finale
    console.log('\n📊 Vérification finale...');
    
    const { data: finalPlaces } = await supabase
      .from('places')
      .select('id')
      .not('imageUrl', 'is', null);
      
    const { data: finalAccs } = await supabase
      .from('accommodations')
      .select('id')
      .not('imageUrl', 'is', null);
      
    const { data: finalEvents } = await supabase
      .from('events')
      .select('id')
      .not('imageUrl', 'is', null);
      
    console.log(`   - Places avec imageUrl: ${finalPlaces?.length || 0}`);
    console.log(`   - Accommodations avec imageUrl: ${finalAccs?.length || 0}`);
    console.log(`   - Events avec imageUrl: ${finalEvents?.length || 0}`);
    
    console.log('\n✅ Synchronisation terminée!');
    console.log('\n💡 Prochaines étapes:');
    console.log('   1. Vider le cache du navigateur (Ctrl+Shift+R)');
    console.log('   2. Tester la modification d\'une image dans l\'admin');
    console.log('   3. Vérifier que l\'image s\'affiche sur le site');
    
  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    console.error(error);
  }
}

syncImageFields();
