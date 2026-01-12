import { supabase } from './supabaseClient';
import { Place, Accommodation } from '../types';

/**
 * Service unifié pour la synchronisation parfaite frontend-backend
 * Assure que toutes les données affichées viennent directement de Supabase
 */
export class UnifiedDataService {
  
  // ===================================
  // HÉBERGEMENTS (Table: accommodations)
  // ===================================
  
  static async getAccommodations(): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements:', error);
      return [];
    }

    return data || [];
  }

  static async getAccommodationsByType(type: string): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('type', type)
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements par type:', error);
      return [];
    }

    return data || [];
  }

  // ===================================
  // MUSÉES & PATRIMOINE (Table: places)
  // ===================================
  
  static async getMuseums(): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'museum')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des musées:', error);
      return [];
    }

    // Tous les musées sont considérés comme publiés (pas de colonne status)
    return (data || []).map(museum => ({
      ...museum,
      status: 'published' // Toujours publié pour les places
    }));
  }

  static async getPublishedMuseums(): Promise<Place[]> {
    // Même chose que getMuseums() car pas de colonne status
    return this.getMuseums();
  }

  // ===================================
  // RESTAURANTS (Table: places)
  // ===================================
  
  static async getRestaurants(): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .in('type', ['restaurant', 'cafe'])
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      return [];
    }

    return data || [];
  }

  // ===================================
  // COMMERÇANTS (Table: places)
  // ===================================
  
  static async getMerchants(): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .in('type', ['shop', 'producer'])
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des commerçants:', error);
      return [];
    }

    return data || [];
  }

  // ===================================
  // BALADES (Table: places)
  // ===================================
  
  static async getWalks(): Promise<Place[]> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('type', 'walk')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des balades:', error);
      return [];
    }

    return data || [];
  }

  // ===================================
  // BLOCS PAGE D'ACCUEIL
  // ===================================
  
  static async getHomepageBlocks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('homepage_blocks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Erreur lors de la récupération des blocs homepage:', error);
      return [];
    }

    return data || [];
  }

  // ===================================
  // SYNCHRONISATION FORCÉE
  // ===================================
  
  /**
   * Force la synchronisation de toutes les données
   * Utile après des modifications dans l'admin
   */
  static async forceSync(): Promise<{
    accommodations: Accommodation[];
    museums: Place[];
    restaurants: Place[];
    merchants: Place[];
    walks: Place[];
    homepageBlocks: any[];
  }> {
    console.log('🔄 Synchronisation forcée des données...');
    
    const [accommodations, museums, restaurants, merchants, walks, homepageBlocks] = await Promise.all([
      this.getAccommodations(),
      this.getMuseums(),
      this.getRestaurants(),
      this.getMerchants(),
      this.getWalks(),
      this.getHomepageBlocks()
    ]);

    console.log('✅ Synchronisation terminée:', {
      accommodations: accommodations.length,
      museums: museums.length,
      restaurants: restaurants.length,
      merchants: merchants.length,
      walks: walks.length,
      homepageBlocks: homepageBlocks.length
    });

    return {
      accommodations,
      museums,
      restaurants,
      merchants,
      walks,
      homepageBlocks
    };
  }

  // ===================================
  // MISE À JOUR DES STATUS
  // ===================================
  
  /**
   * S'assurer que tous les éléments sont visibles
   * (Pas de colonne status dans places, donc pas d'action nécessaire)
   */
  static async ensurePublishedStatus(): Promise<void> {
    console.log('🔧 Vérification des status...');
    
    // Les places n'ont pas de colonne status, donc tous sont visibles
    console.log('✅ Places: Tous visibles (pas de colonne status)');

    // Vérifier les hébergements (ils ont une colonne status)
    const { data: unpublishedAccommodations } = await supabase
      .from('accommodations')
      .select('id, name, status')
      .neq('status', 'published');

    if (unpublishedAccommodations && unpublishedAccommodations.length > 0) {
      console.log(`⚠️ ${unpublishedAccommodations.length} hébergements non publiés trouvés`);
      
      // Optionnel: les publier automatiquement
      const { error: accommodationsError } = await supabase
        .from('accommodations')
        .update({ status: 'published' })
        .neq('status', 'published');

      if (accommodationsError) {
        console.error('Erreur lors de la mise à jour des status accommodations:', accommodationsError);
      } else {
        console.log('✅ Tous les hébergements sont maintenant publiés');
      }
    } else {
      console.log('✅ Tous les hébergements sont déjà publiés');
    }
  }

  // ===================================
  // DIAGNOSTIC
  // ===================================
  
  static async diagnoseSync(): Promise<void> {
    console.log('🔍 Diagnostic de synchronisation...');
    
    const data = await this.forceSync();
    
    console.log('📊 État actuel:');
    console.log(`   Hébergements: ${data.accommodations.length}`);
    console.log(`   Musées: ${data.museums.length}`);
    console.log(`   Restaurants: ${data.restaurants.length}`);
    console.log(`   Commerçants: ${data.merchants.length}`);
    console.log(`   Balades: ${data.walks.length}`);
    console.log(`   Blocs homepage: ${data.homepageBlocks.length}`);
    
    // Vérifier les problèmes
    const issues = [];
    
    if (data.accommodations.length === 0) {
      issues.push('❌ Aucun hébergement trouvé');
    }
    
    if (data.museums.length === 0) {
      issues.push('❌ Aucun musée trouvé');
    }
    
    if (issues.length > 0) {
      console.log('⚠️ Problèmes détectés:');
      issues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log('✅ Synchronisation parfaite!');
    }
  }
}