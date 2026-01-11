import { supabase } from './supabaseClient';
import { AccommodationService } from './accommodationService';

export interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
}

export class BulkActionsService {
  
  // Actions en lot pour les éléments génériques (places, experiences, etc.)
  static async bulkUpdateStatus(
    table: string, 
    itemIds: string[], 
    newStatus: string
  ): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const id of itemIds) {
      try {
        const { error } = await supabase
          .from(table)
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          result.failed++;
          result.errors.push(`Erreur pour l'élément ${id}: ${error.message}`);
        } else {
          result.success++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push(`Erreur pour l'élément ${id}: ${error}`);
      }
    }

    return result;
  }

  // Actions en lot pour les hébergements (utilise le service spécialisé)
  static async bulkUpdateAccommodationsStatus(
    itemIds: string[], 
    newStatus: 'draft' | 'published' | 'archived'
  ): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const id of itemIds) {
      try {
        await AccommodationService.updateAccommodation(id, { status: newStatus });
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Erreur pour l'hébergement ${id}: ${error}`);
      }
    }

    return result;
  }

  // Suppression en lot générique
  static async bulkDelete(
    table: string, 
    itemIds: string[]
  ): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const id of itemIds) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);

        if (error) {
          result.failed++;
          result.errors.push(`Erreur pour l'élément ${id}: ${error.message}`);
        } else {
          result.success++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push(`Erreur pour l'élément ${id}: ${error}`);
      }
    }

    return result;
  }

  // Suppression en lot pour les hébergements
  static async bulkDeleteAccommodations(itemIds: string[]): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const id of itemIds) {
      try {
        await AccommodationService.deleteAccommodation(id);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Erreur pour l'hébergement ${id}: ${error}`);
      }
    }

    return result;
  }

  // Activation/désactivation intelligente selon le type d'élément
  static async bulkToggleStatus(
    itemType: string,
    itemIds: string[],
    targetStatus?: string
  ): Promise<BulkActionResult> {
    
    // Déterminer la table et le statut cible
    const tableMapping: Record<string, string> = {
      'museums': 'places',
      'restaurants': 'places', 
      'merchants': 'places',
      'walks': 'places',
      'experiences': 'experiences',
      'events': 'events',
      'articles': 'articles',
      'products': 'products'
    };

    const table = tableMapping[itemType];
    
    if (!table) {
      return {
        success: 0,
        failed: itemIds.length,
        errors: [`Type d'élément non supporté: ${itemType}`]
      };
    }

    // Cas spécial pour les hébergements
    if (itemType === 'accommodation') {
      const status = targetStatus as 'draft' | 'published' | 'archived' || 'published';
      return this.bulkUpdateAccommodationsStatus(itemIds, status);
    }

    // Déterminer le statut cible si non spécifié
    let newStatus = targetStatus;
    if (!newStatus) {
      // Par défaut, on active (published/active selon le type)
      newStatus = ['experiences', 'events', 'articles', 'products'].includes(itemType) 
        ? 'published' 
        : 'active';
    }

    return this.bulkUpdateStatus(table, itemIds, newStatus);
  }

  // Suppression intelligente selon le type d'élément
  static async bulkDeleteItems(
    itemType: string,
    itemIds: string[]
  ): Promise<BulkActionResult> {
    
    // Cas spécial pour les hébergements
    if (itemType === 'accommodation') {
      return this.bulkDeleteAccommodations(itemIds);
    }

    // Mapping des types vers les tables
    const tableMapping: Record<string, string> = {
      'museums': 'places',
      'restaurants': 'places', 
      'merchants': 'places',
      'walks': 'places',
      'experiences': 'experiences',
      'events': 'events',
      'articles': 'articles',
      'products': 'products'
    };

    const table = tableMapping[itemType];
    
    if (!table) {
      return {
        success: 0,
        failed: itemIds.length,
        errors: [`Type d'élément non supporté: ${itemType}`]
      };
    }

    return this.bulkDelete(table, itemIds);
  }

  // Statistiques globales
  static async getGlobalStats(): Promise<{
    totalItems: number;
    activeItems: number;
    inactiveItems: number;
    archivedItems: number;
    byType: Record<string, number>;
  }> {
    try {
      const stats = {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        archivedItems: 0,
        byType: {} as Record<string, number>
      };

      // Compter les places (museums, restaurants, merchants, walks)
      const { data: places } = await supabase
        .from('places')
        .select('type, status');

      if (places) {
        places.forEach(place => {
          stats.totalItems++;
          stats.byType[place.type] = (stats.byType[place.type] || 0) + 1;
          
          const status = place.status || 'active';
          if (['active', 'published'].includes(status)) {
            stats.activeItems++;
          } else if (status === 'archived') {
            stats.archivedItems++;
          } else {
            stats.inactiveItems++;
          }
        });
      }

      // Compter les autres types
      const tables = ['experiences', 'events', 'articles', 'products'];
      for (const table of tables) {
        const { data } = await supabase
          .from(table)
          .select('status');

        if (data) {
          data.forEach(item => {
            stats.totalItems++;
            stats.byType[table] = (stats.byType[table] || 0) + 1;
            
            const status = item.status || 'published';
            if (status === 'published') {
              stats.activeItems++;
            } else if (status === 'archived') {
              stats.archivedItems++;
            } else {
              stats.inactiveItems++;
            }
          });
        }
      }

      // Compter les hébergements
      try {
        const accommodations = await AccommodationService.getAllAccommodations();
        accommodations.forEach(acc => {
          stats.totalItems++;
          stats.byType['accommodation'] = (stats.byType['accommodation'] || 0) + 1;
          
          const status = acc.status || 'published';
          if (status === 'published') {
            stats.activeItems++;
          } else if (status === 'archived') {
            stats.archivedItems++;
          } else {
            stats.inactiveItems++;
          }
        });
      } catch (error) {
        console.error('Erreur lors du comptage des hébergements:', error);
      }

      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        totalItems: 0,
        activeItems: 0,
        inactiveItems: 0,
        archivedItems: 0,
        byType: {}
      };
    }
  }

  // Archiver les anciens éléments (utilitaire de maintenance)
  static async archiveOldItems(
    itemType: string,
    olderThanDays: number = 365
  ): Promise<BulkActionResult> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const tableMapping: Record<string, string> = {
      'museums': 'places',
      'restaurants': 'places', 
      'merchants': 'places',
      'walks': 'places',
      'experiences': 'experiences',
      'events': 'events',
      'articles': 'articles',
      'products': 'products'
    };

    const table = tableMapping[itemType];
    
    if (!table) {
      return {
        success: 0,
        failed: 1,
        errors: [`Type d'élément non supporté: ${itemType}`]
      };
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .update({ status: 'archived' })
        .lt('created_at', cutoffDate.toISOString())
        .neq('status', 'archived')
        .select('id');

      if (error) {
        return {
          success: 0,
          failed: 1,
          errors: [error.message]
        };
      }

      return {
        success: data?.length || 0,
        failed: 0,
        errors: []
      };
    } catch (error) {
      return {
        success: 0,
        failed: 1,
        errors: [`Erreur lors de l'archivage: ${error}`]
      };
    }
  }
}