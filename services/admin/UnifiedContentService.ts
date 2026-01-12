import { supabase } from '../supabaseClient';

export interface ContentFilters {
  type?: string;
  status?: string;
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface ContentItem {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  excerpt?: string;
  description?: string;
  content?: any;
  featured_image?: string;
  gallery_images?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  view_count?: number;
  category?: string;
  tags?: string[];
  [key: string]: any;
}

export class UnifiedContentService {
  // Mapping des types vers les tables
  private static tableMapping: Record<string, string> = {
    accommodations: 'accommodations',
    places: 'places',
    walks: 'places', // Les balades sont dans la table places avec type='walk'
    experiences: 'experiences',
    events: 'events',
    articles: 'articles',
    products: 'products',
    pages: 'page_content',
    homepage: 'homepage_content',
    newsletter: 'newsletter_subscriptions'
  };

  // Mapping des champs titre
  private static titleMapping: Record<string, string> = {
    accommodations: 'name',
    places: 'name',
    walks: 'name',
    experiences: 'title',
    events: 'title',
    articles: 'title',
    products: 'name',
    pages: 'title',
    homepage: 'title',
    newsletter: 'email'
  };

  // Obtenir le nom de la table pour un type de contenu
  private static getTableName(contentType: string): string {
    return this.tableMapping[contentType] || contentType;
  }

  // Obtenir le champ titre pour un type de contenu
  private static getTitleField(contentType: string): string {
    return this.titleMapping[contentType] || 'title';
  }

  // Normaliser un élément de contenu
  private static normalizeItem(item: any, contentType: string): ContentItem {
    const titleField = this.getTitleField(contentType);
    
    return {
      ...item,
      title: item[titleField] || item.title || item.name,
      type: contentType,
      // Assurer que les champs requis existent
      status: item.status || 'draft',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
    };
  }

  // Récupérer les éléments avec filtres
  static async getItems(filters: ContentFilters = {}): Promise<ContentItem[]> {
    try {
      const { type, status, search, category, limit = 50, offset = 0 } = filters;
      
      if (!type) {
        throw new Error('Le type de contenu est requis');
      }

      const tableName = this.getTableName(type);
      const titleField = this.getTitleField(type);
      
      let query = supabase
        .from(tableName)
        .select('*')
        .range(offset, offset + limit - 1)
        .order('updated_at', { ascending: false });

      // Filtrer par type si nécessaire (pour les tables partagées comme places)
      if (type === 'walks') {
        query = query.eq('type', 'walk');
      } else if (tableName === 'places' && type === 'places') {
        query = query.neq('type', 'walk');
      }

      // Filtrer par statut
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Filtrer par catégorie
      if (category) {
        query = query.eq('category', category);
      }

      // Recherche textuelle
      if (search) {
        query = query.or(`${titleField}.ilike.%${search}%,description.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => this.normalizeItem(item, type));
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments:', error);
      throw error;
    }
  }

  // Récupérer un élément par ID
  static async getItem(contentType: string, id: string): Promise<ContentItem> {
    try {
      const tableName = this.getTableName(contentType);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Élément non trouvé');

      return this.normalizeItem(data, contentType);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'élément:', error);
      throw error;
    }
  }

  // Créer un nouvel élément
  static async createItem(contentType: string, data: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const tableName = this.getTableName(contentType);
      const titleField = this.getTitleField(contentType);
      
      // Préparer les données
      const itemData = {
        ...data,
        [titleField]: data.title || data.name,
        slug: data.slug || this.generateSlug(data.title || data.name || 'nouveau-contenu'),
        status: data.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Ajouter le type pour les tables partagées
      if (contentType === 'walks') {
        itemData.type = 'walk';
      }

      // Supprimer les champs qui n'existent pas dans la table
      delete itemData.title; // On utilise le champ spécifique (name ou title)

      const { data: newItem, error } = await supabase
        .from(tableName)
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;

      return this.normalizeItem(newItem, contentType);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  }

  // Mettre à jour un élément
  static async updateItem(contentType: string, id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const tableName = this.getTableName(contentType);
      const titleField = this.getTitleField(contentType);
      
      // Préparer les données de mise à jour
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Mapper le titre vers le bon champ
      if (updates.title) {
        updateData[titleField] = updates.title;
        delete updateData.title;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.normalizeItem(data, contentType);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  // Supprimer un élément
  static async deleteItem(contentType: string, id: string): Promise<void> {
    try {
      const tableName = this.getTableName(contentType);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }

  // Actions en masse
  static async bulkAction(contentType: string, ids: string[], action: string): Promise<void> {
    try {
      const tableName = this.getTableName(contentType);
      
      switch (action) {
        case 'publish':
          await supabase
            .from(tableName)
            .update({ status: 'published', updated_at: new Date().toISOString() })
            .in('id', ids);
          break;
          
        case 'unpublish':
          await supabase
            .from(tableName)
            .update({ status: 'draft', updated_at: new Date().toISOString() })
            .in('id', ids);
          break;
          
        case 'archive':
          await supabase
            .from(tableName)
            .update({ status: 'archived', updated_at: new Date().toISOString() })
            .in('id', ids);
          break;
          
        case 'delete':
          await supabase
            .from(tableName)
            .delete()
            .in('id', ids);
          break;
          
        default:
          throw new Error(`Action non supportée: ${action}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error);
      throw error;
    }
  }

  // Obtenir les statistiques
  static async getStats(contentType?: string): Promise<any> {
    try {
      const stats: any = {};
      
      if (contentType) {
        const tableName = this.getTableName(contentType);
        
        // Compter par statut
        const { data: statusCounts } = await supabase
          .from(tableName)
          .select('status')
          .then(({ data }) => {
            const counts = { published: 0, draft: 0, archived: 0 };
            data?.forEach(item => {
              counts[item.status as keyof typeof counts] = (counts[item.status as keyof typeof counts] || 0) + 1;
            });
            return { data: counts };
          });
        
        stats[contentType] = statusCounts;
      } else {
        // Statistiques globales
        for (const [type, table] of Object.entries(this.tableMapping)) {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          stats[type] = count || 0;
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Recherche globale
  static async globalSearch(query: string, types?: string[]): Promise<ContentItem[]> {
    try {
      const results: ContentItem[] = [];
      const searchTypes = types || Object.keys(this.tableMapping);
      
      for (const type of searchTypes) {
        try {
          const items = await this.getItems({
            type,
            search: query,
            limit: 10
          });
          results.push(...items);
        } catch (error) {
          console.warn(`Erreur lors de la recherche dans ${type}:`, error);
        }
      }
      
      return results.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (error) {
      console.error('Erreur lors de la recherche globale:', error);
      throw error;
    }
  }

  // Générer un slug
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim();
  }

  // Valider les données selon le type
  static validateData(contentType: string, data: Partial<ContentItem>): string[] {
    const errors: string[] = [];
    const titleField = this.getTitleField(contentType);
    
    // Validation commune
    if (!data[titleField] && !data.title && !data.name) {
      errors.push('Le titre est requis');
    }
    
    // Validations spécifiques par type
    switch (contentType) {
      case 'accommodations':
        if (!data.type) errors.push('Le type d\'hébergement est requis');
        if (!data.village) errors.push('Le village est requis');
        break;
        
      case 'places':
      case 'walks':
        if (!data.address) errors.push('L\'adresse est requise');
        break;
        
      case 'events':
        if (!data.start_date) errors.push('La date de début est requise');
        break;
        
      case 'products':
        if (!data.price) errors.push('Le prix est requis');
        break;
    }
    
    return errors;
  }

  // Dupliquer un élément
  static async duplicateItem(contentType: string, id: string): Promise<ContentItem> {
    try {
      const original = await this.getItem(contentType, id);
      
      const duplicateData = {
        ...original,
        title: `${original.title} (Copie)`,
        slug: `${original.slug}-copie`,
        status: 'draft' as const,
        created_at: undefined,
        updated_at: undefined,
        id: undefined
      };
      
      return await this.createItem(contentType, duplicateData);
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      throw error;
    }
  }
}