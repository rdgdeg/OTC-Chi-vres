import { supabase } from './supabaseClient';
import { Place } from '../types';

// Configuration de tri par défaut (sera chargée depuis le fichier JSON)
let defaultSortConfig: { museums: { id: string; name: string; sort_order: number }[] } | null = null;

// Charger la configuration de tri par défaut
const loadDefaultSortConfig = async () => {
  if (defaultSortConfig) return defaultSortConfig;
  
  try {
    // En production, cette configuration pourrait être stockée en base
    // Pour l'instant, on utilise un ordre alphabétique par défaut
    const { data: museums } = await supabase
      .from('places')
      .select('id, name')
      .eq('type', 'museum')
      .order('name');
    
    if (museums) {
      defaultSortConfig = {
        museums: museums.map((museum, index) => ({
          id: museum.id,
          name: museum.name,
          sort_order: index + 1
        }))
      };
    }
    
    return defaultSortConfig;
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration de tri:', error);
    return null;
  }
};

class MuseumSortService {
  // Obtenir l'ordre de tri pour un musée
  async getSortOrder(museumId: string): Promise<number> {
    try {
      // Essayer d'abord de récupérer depuis la base de données
      const { data: museum } = await supabase
        .from('places')
        .select('sort_order')
        .eq('id', museumId)
        .single();
      
      if (museum && museum.sort_order) {
        return museum.sort_order;
      }
      
      // Fallback sur la configuration par défaut
      const config = await loadDefaultSortConfig();
      if (config) {
        const museumConfig = config.museums.find(m => m.id === museumId);
        return museumConfig?.sort_order || 999;
      }
      
      return 999; // Ordre par défaut pour les nouveaux éléments
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ordre:', error);
      return 999;
    }
  }

  // Trier une liste de musées
  async sortMuseums(museums: Place[]): Promise<Place[]> {
    try {
      // Enrichir chaque musée avec son ordre de tri
      const museumsWithOrder = await Promise.all(
        museums.map(async (museum) => {
          const sortOrder = await this.getSortOrder(museum.id);
          return { ...museum, sort_order: sortOrder };
        })
      );

      // Trier par sort_order, puis par nom
      return museumsWithOrder.sort((a, b) => {
        const orderA = a.sort_order || 999;
        const orderB = b.sort_order || 999;
        
        if (orderA === orderB) {
          return a.name.localeCompare(b.name);
        }
        
        return orderA - orderB;
      });
    } catch (error) {
      console.error('Erreur lors du tri des musées:', error);
      // Fallback sur tri alphabétique
      return museums.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // Mettre à jour l'ordre d'un musée
  async updateSortOrder(museumId: string, newOrder: number): Promise<boolean> {
    try {
      // Essayer de mettre à jour en base de données
      const { error } = await supabase
        .from('places')
        .update({ sort_order: newOrder })
        .eq('id', museumId);

      if (error) {
        console.warn('Impossible de mettre à jour en base, utilisation du cache local:', error.message);
        
        // Fallback : mettre à jour la configuration locale
        const config = await loadDefaultSortConfig();
        if (config) {
          const museumIndex = config.museums.findIndex(m => m.id === museumId);
          if (museumIndex !== -1) {
            config.museums[museumIndex].sort_order = newOrder;
          }
        }
        
        return true; // Considérer comme réussi même si c'est en local
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', error);
      return false;
    }
  }

  // Réorganiser complètement l'ordre des musées
  async reorderMuseums(orderedMuseumIds: string[]): Promise<boolean> {
    try {
      const updatePromises = orderedMuseumIds.map((museumId, index) =>
        this.updateSortOrder(museumId, index + 1)
      );

      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      return false;
    }
  }

  // Obtenir la liste triée des musées avec leur ordre actuel
  async getMuseumsWithSortOrder(): Promise<(Place & { sort_order: number })[]> {
    try {
      const { data: museums } = await supabase
        .from('places')
        .select('*')
        .eq('type', 'museum');

      if (!museums) return [];

      // Enrichir avec l'ordre de tri
      const museumsWithOrder = await Promise.all(
        museums.map(async (museum) => {
          const sortOrder = await this.getSortOrder(museum.id);
          return { ...museum, sort_order: sortOrder };
        })
      );

      // Trier par ordre
      return museumsWithOrder.sort((a, b) => {
        if (a.sort_order === b.sort_order) {
          return a.name.localeCompare(b.name);
        }
        return a.sort_order - b.sort_order;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des musées avec ordre:', error);
      return [];
    }
  }

  // Réinitialiser l'ordre par défaut (alphabétique)
  async resetToAlphabeticalOrder(): Promise<boolean> {
    try {
      const { data: museums } = await supabase
        .from('places')
        .select('id, name')
        .eq('type', 'museum')
        .order('name');

      if (!museums) return false;

      const updatePromises = museums.map((museum, index) =>
        this.updateSortOrder(museum.id, index + 1)
      );

      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      return false;
    }
  }

  // Vérifier si le tri est supporté en base de données
  async isSortOrderSupported(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('sort_order')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

export const museumSortService = new MuseumSortService();
export default museumSortService;