#!/usr/bin/env node

/**
 * Script pour ajouter manuellement le champ sort_order aux musées existants
 * Utilise les données existantes pour simuler le tri
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSortOrderManually() {
  console.log('🚀 Ajout manuel du tri pour les musées...\n');

  try {
    // 1. Récupérer tous les musées
    console.log('📋 Récupération des musées...');
    const { data: museums, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum')
      .order('created_at');

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError.message);
      return;
    }

    console.log(`✅ ${museums.length} musées trouvés`);

    if (museums.length === 0) {
      console.log('ℹ️  Aucun musée à traiter');
      return;
    }

    // 2. Vérifier si sort_order existe déjà
    const firstMuseum = museums[0];
    const hasSortOrder = 'sort_order' in firstMuseum;
    
    console.log(`🔍 Champ sort_order ${hasSortOrder ? 'présent' : 'absent'}`);

    // 3. Si sort_order n'existe pas, on va utiliser une approche alternative
    if (!hasSortOrder) {
      console.log('⚠️  Le champ sort_order n\'existe pas dans la base de données');
      console.log('💡 Solution: Utiliser l\'ordre alphabétique par défaut dans l\'application');
      
      // Créer un fichier de configuration pour l'ordre
      const sortConfig = {
        museums: museums.map((museum, index) => ({
          id: museum.id,
          name: museum.name,
          sort_order: index + 1
        }))
      };

      // Sauvegarder la configuration
      const fs = await import('fs');
      const path = await import('path');
      
      const configPath = path.join(process.cwd(), 'data', 'museum-sort-config.json');
      fs.writeFileSync(configPath, JSON.stringify(sortConfig, null, 2));
      
      console.log(`✅ Configuration de tri sauvegardée dans: ${configPath}`);
      console.log('📝 Cette configuration sera utilisée par l\'application');
      
    } else {
      // 4. Si sort_order existe, initialiser les valeurs
      console.log('🔄 Initialisation des valeurs de tri...');
      
      for (let i = 0; i < museums.length; i++) {
        const museum = museums[i];
        
        if (!museum.sort_order || museum.sort_order === 0) {
          const { error: updateError } = await supabase
            .from('places')
            .update({ sort_order: i + 1 })
            .eq('id', museum.id);

          if (updateError) {
            console.log(`   ⚠️  Erreur mise à jour ${museum.name}: ${updateError.message}`);
          } else {
            console.log(`   ✅ ${museum.name} -> ordre ${i + 1}`);
          }
        } else {
          console.log(`   ℹ️  ${museum.name} -> ordre déjà défini (${museum.sort_order})`);
        }
      }
    }

    // 5. Afficher l'ordre final
    console.log('\n📊 Ordre final des musées:');
    museums.forEach((museum, index) => {
      console.log(`   ${index + 1}. ${museum.name}`);
    });

    console.log('\n🎉 Configuration du tri terminée !');
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Le composant MuseumSortManager permettra de modifier l\'ordre');
    console.log('   2. La page Museums affichera les éléments dans l\'ordre défini');
    console.log('   3. Les modifications seront sauvegardées en base de données');

  } catch (error) {
    console.error('💥 Erreur:', error);
    process.exit(1);
  }
}

// Exécuter le script
addSortOrderManually().then(() => {
  console.log('\n✨ Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});