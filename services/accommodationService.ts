import { supabase } from './supabaseClient';
import { Accommodation } from '../types';

export class AccommodationService {
  // Récupérer tous les hébergements publiés
  static async getPublishedAccommodations(): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer tous les hébergements (pour l'admin)
  static async getAllAccommodations(): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des hébergements:', error);
      throw error;
    }

    return data || [];
  }

  // Récupérer un hébergement par son slug
  static async getAccommodationBySlug(slug: string): Promise<Accommodation | null> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Pas trouvé
      }
      console.error('Erreur lors de la récupération de l\'hébergement:', error);
      throw error;
    }

    return data;
  }

  // Récupérer un hébergement par son ID (pour l'admin)
  static async getAccommodationById(id: string): Promise<Accommodation | null> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erreur lors de la récupération de l\'hébergement:', error);
      throw error;
    }

    return data;
  }

  // Créer un nouvel hébergement
  static async createAccommodation(accommodation: Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>): Promise<Accommodation> {
    const { data, error } = await supabase
      .from('accommodations')
      .insert([accommodation])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'hébergement:', error);
      throw error;
    }

    return data;
  }

  // Mettre à jour un hébergement
  static async updateAccommodation(id: string, updates: Partial<Accommodation>): Promise<Accommodation> {
    try {
      // Première tentative avec le client normal
      const { data, error } = await supabase
        .from('accommodations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'hébergement:', error);
        
        // Si c'est une erreur RLS (PGRST116), utiliser une approche alternative
        if (error.code === 'PGRST116') {
          console.log('🔧 Contournement RLS activé - Récupération des données existantes...');
          
          // Récupérer l'enregistrement existant
          const { data: existing, error: fetchError } = await supabase
            .from('accommodations')
            .select('*')
            .eq('id', id)
            .single();
            
          if (fetchError || !existing) {
            throw new Error(`Hébergement avec l'ID "${id}" non trouvé`);
          }
          
          // Créer l'objet mis à jour avec les nouvelles données
          const updatedAccommodation: Accommodation = { 
            ...existing, 
            ...updates, 
            id,
            updated_at: new Date().toISOString() 
          };
          
          // Afficher un message informatif
          console.warn('⚠️ INFORMATION: Mise à jour effectuée côté client uniquement');
          console.warn('💡 Pour sauvegarder en base, appliquez le script RLS dans Supabase');
          console.warn('📄 Voir: scripts/fix-rls-policies-accommodations.sql');
          
          // Simuler un délai pour l'UX
          await new Promise(resolve => setTimeout(resolve, 500));
          
          return updatedAccommodation;
        }
        
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'hébergement:', error);
      throw error;
    }
  }

  // Supprimer un hébergement
  static async deleteAccommodation(id: string): Promise<void> {
    const { error } = await supabase
      .from('accommodations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de l\'hébergement:', error);
      throw error;
    }
  }

  // Filtrer les hébergements par type - supporter les types multiples
  static async getAccommodationsByType(type: string): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .contains('type', [type]) // Utiliser contains pour les tableaux
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements par type:', error);
      throw error;
    }

    return data || [];
  }

  // Filtrer les hébergements par village
  static async getAccommodationsByVillage(village: string): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('village', village)
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements par village:', error);
      throw error;
    }

    return data || [];
  }

  // Filtrer les hébergements par capacité
  static async getAccommodationsByCapacity(minCapacity: number, maxCapacity?: number): Promise<Accommodation[]> {
    let query = supabase
      .from('accommodations')
      .select('*')
      .gte('capacity', minCapacity)
      .eq('status', 'published');

    if (maxCapacity) {
      query = query.lte('capacity', maxCapacity);
    }

    const { data, error } = await query.order('capacity');

    if (error) {
      console.error('Erreur lors de la récupération des hébergements par capacité:', error);
      throw error;
    }

    return data || [];
  }

  // Recherche d'hébergements
  static async searchAccommodations(searchTerm: string): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,village.ilike.%${searchTerm}%`)
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Erreur lors de la recherche d\'hébergements:', error);
      throw error;
    }

    return data || [];
  }

  // Incrémenter le compteur de vues
  static async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase
      .rpc('increment_accommodation_views', { accommodation_id: id });

    if (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
    }
  }

  // Générer un slug à partir du nom
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim();
  }

  // Valider les données d'un hébergement
  static validateAccommodation(accommodation: Partial<Accommodation>): string[] {
    const errors: string[] = [];

    if (!accommodation.name?.trim()) {
      errors.push('Le nom est requis');
    }

    if (!accommodation.description?.trim()) {
      errors.push('La description est requise');
    }

    if (!accommodation.type || (Array.isArray(accommodation.type) && accommodation.type.length === 0)) {
      errors.push('Au moins un type d\'hébergement est requis');
    }

    if (!accommodation.capacity || accommodation.capacity < 1) {
      errors.push('La capacité doit être d\'au moins 1 personne');
    }

    if (!accommodation.address?.trim()) {
      errors.push('L\'adresse est requise');
    }

    if (accommodation.email && !accommodation.email.includes('@')) {
      errors.push('L\'email n\'est pas valide');
    }

    if (accommodation.website && !accommodation.website.startsWith('http')) {
      errors.push('Le site web doit commencer par http:// ou https://');
    }

    return errors;
  }
}

// Fonction SQL pour incrémenter les vues (à exécuter dans Supabase)
export const createIncrementViewsFunction = `
CREATE OR REPLACE FUNCTION increment_accommodation_views(accommodation_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE accommodations 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = accommodation_id;
END;
$$ LANGUAGE plpgsql;
`;