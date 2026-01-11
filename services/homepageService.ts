import { supabase } from './supabaseClient';

export interface HomepageContent {
  id: string;
  section: 'banner' | 'hero' | 'news' | 'favorites' | 'newsletter';
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  settings: Record<string, any>;
  is_active: boolean;
  sort_order: number;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageNews {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image_url?: string;
  category: string;
  read_time: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  sort_order: number;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageFavorite {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

class HomepageService {
  // ===== GESTION DU CONTENU GÉNÉRAL =====

  // Obtenir tout le contenu de la page d'accueil
  async getHomepageContent(): Promise<HomepageContent[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error);
      return [];
    }
  }

  // Obtenir un contenu spécifique par section
  async getContentBySection(section: string): Promise<HomepageContent | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contenu ${section}:`, error);
      return null;
    }
  }

  // Mettre à jour le contenu d'une section
  async updateContent(id: string, updates: Partial<HomepageContent>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu:', error);
      return false;
    }
  }

  // ===== GESTION DE LA BANNIÈRE =====

  // Obtenir la bannière d'information
  async getBanner(): Promise<HomepageContent | null> {
    return this.getContentBySection('banner');
  }

  // Mettre à jour la bannière
  async updateBanner(updates: {
    title?: string;
    subtitle?: string;
    content?: string;
    settings?: Record<string, any>;
    is_active?: boolean;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'info-banner');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bannière:', error);
      return false;
    }
  }

  // ===== GESTION DU HERO =====

  // Obtenir le contenu hero
  async getHero(): Promise<HomepageContent | null> {
    return this.getContentBySection('hero');
  }

  // Mettre à jour le hero
  async updateHero(updates: {
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    cta_text?: string;
    cta_url?: string;
    settings?: Record<string, any>;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'hero-main');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du hero:', error);
      return false;
    }
  }

  // ===== GESTION DES ACTUALITÉS =====

  // Obtenir les actualités publiées
  async getNews(limit: number = 10): Promise<HomepageNews[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_news')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      return [];
    }
  }

  // Obtenir toutes les actualités (admin)
  async getAllNews(): Promise<HomepageNews[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_news')
        .select('*')
        .order('sort_order')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les actualités:', error);
      return [];
    }
  }

  // Créer une actualité
  async createNews(news: Omit<HomepageNews, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageNews | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_news')
        .insert(news)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'actualité:', error);
      return null;
    }
  }

  // Mettre à jour une actualité
  async updateNews(id: string, updates: Partial<HomepageNews>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_news')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'actualité:', error);
      return false;
    }
  }

  // Supprimer une actualité
  async deleteNews(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'actualité:', error);
      return false;
    }
  }

  // ===== GESTION DES COUPS DE CŒUR =====

  // Obtenir les coups de cœur actifs
  async getFavorites(): Promise<HomepageFavorite[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_favorites')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des coups de cœur:', error);
      return [];
    }
  }

  // Obtenir tous les coups de cœur (admin)
  async getAllFavorites(): Promise<HomepageFavorite[]> {
    try {
      const { data, error } = await supabase
        .from('homepage_favorites')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les coups de cœur:', error);
      return [];
    }
  }

  // Créer un coup de cœur
  async createFavorite(favorite: Omit<HomepageFavorite, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageFavorite | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_favorites')
        .insert(favorite)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du coup de cœur:', error);
      return null;
    }
  }

  // Mettre à jour un coup de cœur
  async updateFavorite(id: string, updates: Partial<HomepageFavorite>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_favorites')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du coup de cœur:', error);
      return false;
    }
  }

  // Supprimer un coup de cœur
  async deleteFavorite(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du coup de cœur:', error);
      return false;
    }
  }

  // ===== UTILITAIRES =====

  // Réorganiser l'ordre des éléments
  async reorderItems(table: 'homepage_news' | 'homepage_favorites', items: { id: string; sort_order: number }[]): Promise<boolean> {
    try {
      const updates = items.map(item => 
        supabase
          .from(table)
          .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      return false;
    }
  }

  // Obtenir le contenu complet de la page d'accueil
  async getFullHomepageData(): Promise<{
    content: HomepageContent[];
    news: HomepageNews[];
    favorites: HomepageFavorite[];
  }> {
    try {
      const [content, news, favorites] = await Promise.all([
        this.getHomepageContent(),
        this.getNews(),
        this.getFavorites()
      ]);

      return { content, news, favorites };
    } catch (error) {
      console.error('Erreur lors de la récupération complète:', error);
      return { content: [], news: [], favorites: [] };
    }
  }
}

export const homepageService = new HomepageService();
export default homepageService;