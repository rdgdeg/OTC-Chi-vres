import { supabase } from '../supabaseClient';

export interface ContentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  updated_at: string;
  view_count?: number;
  description?: string;
  featured_image?: string;
}

export interface CategoryStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export class CategoryContentService {
  // Mapping des catégories vers les tables Supabase
  private static categoryTableMap: Record<string, string[]> = {
    accommodations: ['accommodations'],
    dining: ['places'], // Filtré par type restaurant/cafe/bar
    activities: ['places'], // Filtré par type activity
    heritage: ['places'], // Filtré par type museum/monument
    walks: ['walks'],
    events: ['events'],
    team: ['team_members'],
    blog: ['articles'], // Blog/Actualités
    pages: ['homepage_blocks', 'page_content']
  };

  // Récupérer les éléments d'une catégorie
  static async getCategoryItems(categoryId: string): Promise<ContentItem[]> {
    const tables = this.categoryTableMap[categoryId];
    if (!tables) {
      throw new Error(`Catégorie inconnue: ${categoryId}`);
    }

    let allItems: ContentItem[] = [];

    for (const table of tables) {
      try {
        let query = supabase.from(table).select('*');

        // Filtres spécifiques selon la table et la catégorie
        if (table === 'places') {
          switch (categoryId) {
            case 'dining':
              query = query.in('type', ['restaurant', 'cafe', 'bar']);
              break;
            case 'activities':
              query = query.in('type', ['activity', 'experience', 'leisure']);
              break;
            case 'heritage':
              query = query.in('type', ['museum', 'monument', 'heritage']);
              break;
          }
        }

        const { data, error } = await query.order('updated_at', { ascending: false });

        if (error) {
          console.error(`Erreur lors du chargement de ${table}:`, error);
          continue;
        }

        if (data) {
          const items: ContentItem[] = data.map(item => ({
            id: item.id,
            name: item.name || item.title || `${table} ${item.id}`,
            type: item.type || table,
            category: categoryId,
            status: item.status || 'published',
            updated_at: item.updated_at || item.created_at,
            view_count: item.view_count || 0,
            description: item.description || item.excerpt,
            featured_image: item.featured_image || item.imageUrl
          }));

          allItems = [...allItems, ...items];
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de ${table}:`, err);
      }
    }

    return allItems.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  // Récupérer les statistiques d'une catégorie
  static async getCategoryStats(categoryId: string): Promise<CategoryStats> {
    const items = await this.getCategoryItems(categoryId);
    
    return {
      total: items.length,
      published: items.filter(item => item.status === 'published').length,
      draft: items.filter(item => item.status === 'draft').length,
      archived: items.filter(item => item.status === 'archived').length
    };
  }

  // Récupérer les statistiques globales
  static async getGlobalStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};

    for (const categoryId of Object.keys(this.categoryTableMap)) {
      try {
        const categoryStats = await this.getCategoryStats(categoryId);
        stats[categoryId] = categoryStats.published;
      } catch (error) {
        console.error(`Erreur stats pour ${categoryId}:`, error);
        stats[categoryId] = 0;
      }
    }

    return stats;
  }

  // Mettre à jour le statut d'un élément
  static async updateItemStatus(
    itemId: string, 
    newStatus: 'draft' | 'published' | 'archived',
    table: string
  ): Promise<void> {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) {
      throw error;
    }
  }

  // Supprimer un élément
  static async deleteItem(itemId: string, table: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', itemId);

    if (error) {
      throw error;
    }
  }

  // Rechercher dans une catégorie
  static async searchCategoryItems(
    categoryId: string, 
    searchTerm: string
  ): Promise<ContentItem[]> {
    const allItems = await this.getCategoryItems(categoryId);
    
    if (!searchTerm.trim()) {
      return allItems;
    }

    const term = searchTerm.toLowerCase();
    return allItems.filter(item =>
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      item.type.toLowerCase().includes(term)
    );
  }

  // Obtenir les types disponibles pour une catégorie
  static getCategoryTypes(categoryId: string): string[] {
    const typeMap: Record<string, string[]> = {
      accommodations: ['bed_breakfast', 'gite', 'hotel', 'camping', 'unusual'],
      dining: ['restaurant', 'cafe', 'bar', 'brasserie'],
      activities: ['activity', 'experience', 'leisure', 'sport'],
      heritage: ['museum', 'monument', 'heritage', 'church'],
      walks: ['walk', 'hike', 'trail', 'circuit'],
      events: ['event', 'festival', 'manifestation', 'concert'],
      team: ['team_member', 'contact', 'guide'],
      pages: ['page_content', 'homepage_block', 'banner']
    };

    return typeMap[categoryId] || [];
  }

  // Obtenir la table principale pour une catégorie
  static getPrimaryTable(categoryId: string): string {
    const tableMap: Record<string, string> = {
      accommodations: 'accommodations',
      dining: 'places',
      activities: 'places',
      heritage: 'places',
      walks: 'walks',
      events: 'events',
      team: 'team_members',
      pages: 'page_content'
    };

    return tableMap[categoryId] || 'places';
  }
}