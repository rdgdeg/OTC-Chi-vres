import { supabase } from './supabaseClient';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  image_url?: string;
  link_url?: string;
  category?: string;
  is_featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  category?: string;
  author?: string;
  read_time?: string;
  is_featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

class ContentService {
  // ===== GESTION DES ÉVÉNEMENTS =====

  // Obtenir les événements publiés
  async getPublishedEvents(limit?: number): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      return [];
    }
  }

  // Obtenir les événements à venir
  async getUpcomingEvents(limit: number = 3): Promise<Event[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des événements à venir:', error);
      return [];
    }
  }

  // Obtenir un événement par ID
  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      return null;
    }
  }

  // ===== GESTION DES ARTICLES DE BLOG =====

  // Obtenir les articles publiés
  async getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Obtenir les derniers articles
  async getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.getPublishedBlogPosts(limit);
  }

  // Obtenir un article par ID
  async getBlogPostById(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  }

  // ===== UTILITAIRES =====

  // Obtenir le contenu pour la page d'accueil (événements + blog)
  async getHomePageContent(): Promise<{
    events: Event[];
    blogPosts: BlogPost[];
  }> {
    try {
      const [events, blogPosts] = await Promise.all([
        this.getUpcomingEvents(3),
        this.getLatestBlogPosts(3)
      ]);

      return { events, blogPosts };
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu de la page d\'accueil:', error);
      return { events: [], blogPosts: [] };
    }
  }
}

export const contentService = new ContentService();
export default contentService;
