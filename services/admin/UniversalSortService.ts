import { supabase } from '../supabaseClient';

export interface SortableItem {
  id: string;
  name?: string;
  title?: string;
  sort_order?: number;
}

export interface TableConfig {
  tableName: string;
  nameField: string; // Champ utilisé pour le nom (name, title, etc.)
  filterField?: string; // Champ pour filtrer (type, category, etc.)
  filterValue?: string; // Valeur du filtre
}

class UniversalSortService {
  // Configuration des tables supportées
  private static tableConfigs: Record<string, TableConfig> = {
    // Hébergements
    accommodations: {
      tableName: 'accommodations',
      nameField: 'name'
    },
    
    // Lieux (restaurants, musées, etc.)
    places: {
      tableName: 'places',
      nameField: 'name'
    },
    
    // Lieux par type
    'places-museum': {
      tableName: 'places',
      nameField: 'name',
      filterField: 'type',
      filterValue: 'museum'
    },
    'places-restaurant': {
      tableName: 'places',
      nameField: 'name',
      filterField: 'type',
      filterValue: 'restaurant'
    },
    'places-cafe': {
      tableName: 'places',
      nameField: 'name',
      filterField: 'type',
      filterValue: 'cafe'
    },
    'places-activity': {
      tableName: 'places',
      nameField: 'name',
      filterField: 'type',
      filterValue: 'activity'
    },
    
    // Balades (dans la table places)
    'walks': {
      tableName: 'places',
      nameField: 'name',
      filterField: 'type',
      filterValue: 'walk'
    },
    
    // Événements (si la table existe)
    events: {
      tableName: 'events',
      nameField: 'title'
    }
    
    // Note: team_members et homepage_blocks seront ajoutés dynamiquement
    // s'ils existent dans la base de données
  };

  // Ajouter dynamiquement une configuration de table
  static addTableConfig(tableKey: string, config: TableConfig): void {
    this.tableConfigs[tableKey] = config;
  }

  // Initialiser les configurations pour les tables optionnelles
  static async initializeOptionalTables(): Promise<void> {
    // Vérifier team_members
    const teamExists = await this.checkSortOrderColumn('team_members');
    if (teamExists) {
      this.addTableConfig('team_members', {
        tableName: 'team_members',
        nameField: 'name'
      });
    }

    // Vérifier homepage_blocks
    const homepageExists = await this.checkSortOrderColumn('homepage_blocks');
    if (homepageExists) {
      this.addTableConfig('homepage_blocks', {
        tableName: 'homepage_blocks',
        nameField: 'title'
      });
    }
  }

  // Vérifier si une table supporte le tri
  static isTableSortable(tableKey: string): boolean {
    return tableKey in this.tableConfigs;
  }

  // Obtenir la configuration d'une table
  static getTableConfig(tableKey: string): TableConfig | null {
    return this.tableConfigs[tableKey] || null;
  }

  // Vérifier si la colonne sort_order existe dans une table
  static async checkSortOrderColumn(tableName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('sort_order')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  }

  // Récupérer les éléments triés d'une table
  static async getSortedItems(tableKey: string): Promise<SortableItem[]> {
    const config = this.getTableConfig(tableKey);
    if (!config) {
      throw new Error(`Configuration non trouvée pour la table: ${tableKey}`);
    }

    try {
      let query = supabase
        .from(config.tableName)
        .select(`id, ${config.nameField}, sort_order`);

      // Appliquer le filtre si configuré
      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue);
      }

      // Trier par sort_order puis par nom
      query = query.order('sort_order', { ascending: true, nullsFirst: false })
                   .order(config.nameField, { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        name: item[config.nameField],
        sort_order: item.sort_order || 999
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments triés pour ${tableKey}:`, error);
      return [];
    }
  }

  // Mettre à jour l'ordre d'un élément
  static async updateSortOrder(
    tableKey: string, 
    itemId: string, 
    newOrder: number
  ): Promise<boolean> {
    const config = this.getTableConfig(tableKey);
    if (!config) {
      throw new Error(`Configuration non trouvée pour la table: ${tableKey}`);
    }

    try {
      const { error } = await supabase
        .from(config.tableName)
        .update({ 
          sort_order: newOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) {
        console.error(`Erreur lors de la mise à jour de l'ordre pour ${tableKey}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'ordre pour ${tableKey}:`, error);
      return false;
    }
  }

  // Réorganiser complètement l'ordre des éléments
  static async reorderItems(
    tableKey: string, 
    orderedItemIds: string[]
  ): Promise<boolean> {
    try {
      const updatePromises = orderedItemIds.map((itemId, index) =>
        this.updateSortOrder(tableKey, itemId, index + 1)
      );

      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error(`Erreur lors de la réorganisation pour ${tableKey}:`, error);
      return false;
    }
  }

  // Réinitialiser l'ordre alphabétique
  static async resetToAlphabeticalOrder(tableKey: string): Promise<boolean> {
    const config = this.getTableConfig(tableKey);
    if (!config) {
      throw new Error(`Configuration non trouvée pour la table: ${tableKey}`);
    }

    try {
      let query = supabase
        .from(config.tableName)
        .select(`id, ${config.nameField}`)
        .order(config.nameField, { ascending: true });

      // Appliquer le filtre si configuré
      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue);
      }

      const { data, error } = await query;

      if (error || !data) {
        throw error || new Error('Aucune donnée récupérée');
      }

      const updatePromises = data.map((item, index) =>
        this.updateSortOrder(tableKey, item.id, index + 1)
      );

      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error(`Erreur lors de la réinitialisation pour ${tableKey}:`, error);
      return false;
    }
  }

  // Ajouter la colonne sort_order à une table (migration)
  static async addSortOrderColumn(tableName: string): Promise<boolean> {
    try {
      // Cette fonction nécessiterait des privilèges admin sur Supabase
      // En pratique, les migrations SQL seraient appliquées manuellement
      console.warn(`Migration manuelle requise: ajouter la colonne sort_order à ${tableName}`);
      return false;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la colonne sort_order à ${tableName}:`, error);
      return false;
    }
  }

  // Obtenir les statistiques de tri pour une table
  static async getSortStats(tableKey: string): Promise<{
    total: number;
    withSortOrder: number;
    withoutSortOrder: number;
  }> {
    const config = this.getTableConfig(tableKey);
    if (!config) {
      return { total: 0, withSortOrder: 0, withoutSortOrder: 0 };
    }

    try {
      let query = supabase
        .from(config.tableName)
        .select('id, sort_order');

      // Appliquer le filtre si configuré
      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue);
      }

      const { data, error } = await query;

      if (error || !data) {
        return { total: 0, withSortOrder: 0, withoutSortOrder: 0 };
      }

      const total = data.length;
      const withSortOrder = data.filter(item => item.sort_order != null).length;
      const withoutSortOrder = total - withSortOrder;

      return { total, withSortOrder, withoutSortOrder };
    } catch (error) {
      console.error(`Erreur lors de la récupération des stats pour ${tableKey}:`, error);
      return { total: 0, withSortOrder: 0, withoutSortOrder: 0 };
    }
  }

  // Initialiser l'ordre pour les éléments qui n'en ont pas
  static async initializeMissingSortOrders(tableKey: string): Promise<boolean> {
    const config = this.getTableConfig(tableKey);
    if (!config) {
      return false;
    }

    try {
      // Récupérer les éléments sans sort_order
      let query = supabase
        .from(config.tableName)
        .select(`id, ${config.nameField}`)
        .is('sort_order', null)
        .order(config.nameField, { ascending: true });

      // Appliquer le filtre si configuré
      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue);
      }

      const { data: itemsWithoutOrder, error } = await query;

      if (error || !itemsWithoutOrder || itemsWithoutOrder.length === 0) {
        return true; // Rien à faire
      }

      // Obtenir le plus grand sort_order existant
      let maxOrderQuery = supabase
        .from(config.tableName)
        .select('sort_order')
        .not('sort_order', 'is', null)
        .order('sort_order', { ascending: false })
        .limit(1);

      // Appliquer le filtre si configuré
      if (config.filterField && config.filterValue) {
        maxOrderQuery = maxOrderQuery.eq(config.filterField, config.filterValue);
      }

      const { data: maxOrderData } = await maxOrderQuery;
      const maxOrder = maxOrderData?.[0]?.sort_order || 0;

      // Assigner des ordres aux éléments sans ordre
      const updatePromises = itemsWithoutOrder.map((item, index) =>
        this.updateSortOrder(tableKey, item.id, maxOrder + index + 1)
      );

      const results = await Promise.all(updatePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error(`Erreur lors de l'initialisation des ordres pour ${tableKey}:`, error);
      return false;
    }
  }
}

export default UniversalSortService;