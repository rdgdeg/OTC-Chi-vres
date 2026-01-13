import { supabase } from './supabaseClient';

export interface Event {
  id: string;
  title: string;
  slug?: string;
  description: string;
  excerpt?: string;
  start_date: string;
  end_date?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  location: string;
  venue_id?: string;
  category: 'folklore' | 'culture' | 'sport' | 'marché' | 'conference' | 'festival';
  event_type: 'public' | 'private' | 'members_only';
  featured_image?: string;
  gallery_images?: string[];
  price_text?: string;
  price_amount?: number;
  registration_required: boolean;
  registration_url?: string;
  contact_email?: string;
  contact_phone?: string;
  max_attendees?: number;
  status: 'draft' | 'published' | 'cancelled' | 'archived';
  tag_ids?: string[];
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventFilters {
  category?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

class EventService {
  // Récupérer tous les événements avec filtres
  async getEvents(filters: EventFilters = {}): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('start_date', { ascending: true });

      // Appliquer les filtres
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateRange) {
        query = query
          .gte('start_date', filters.dateRange.start)
          .lte('start_date', filters.dateRange.end);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getEvents:', error);
      throw error;
    }
  }

  // Récupérer un événement par ID
  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur dans getEventById:', error);
      throw error;
    }
  }

  // Récupérer les événements publics (pour le frontend)
  async getPublicEvents(limit?: number): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('start_date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des événements publics:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getPublicEvents:', error);
      throw error;
    }
  }

  // Créer un nouvel événement
  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    try {
      // Générer un slug si pas fourni
      const slug = eventData.slug || this.generateSlug(eventData.title);

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          id: this.generateId(),
          slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur dans createEvent:', error);
      throw error;
    }
  }

  // Mettre à jour un événement
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'événement:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur dans updateEvent:', error);
      throw error;
    }
  }

  // Supprimer un événement
  async deleteEvent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression de l\'événement:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur dans deleteEvent:', error);
      throw error;
    }
  }

  // Dupliquer un événement
  async duplicateEvent(id: string): Promise<Event> {
    try {
      const originalEvent = await this.getEventById(id);
      if (!originalEvent) {
        throw new Error('Événement non trouvé');
      }

      const duplicatedEvent = {
        ...originalEvent,
        title: `${originalEvent.title} (Copie)`,
        slug: undefined, // Sera régénéré
        status: 'draft' as const,
        created_by: undefined,
        updated_by: undefined,
        created_at: undefined,
        updated_at: undefined
      };

      delete duplicatedEvent.id;

      return await this.createEvent(duplicatedEvent);
    } catch (error) {
      console.error('Erreur dans duplicateEvent:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des événements
  async getEventStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    upcoming: number;
    past: number;
  }> {
    try {
      const now = new Date().toISOString();

      const [
        { count: total },
        { count: published },
        { count: draft },
        { count: upcoming },
        { count: past }
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('events').select('*', { count: 'exact', head: true }).gte('start_date', now),
        supabase.from('events').select('*', { count: 'exact', head: true }).lt('start_date', now)
      ]);

      return {
        total: total || 0,
        published: published || 0,
        draft: draft || 0,
        upcoming: upcoming || 0,
        past: past || 0
      };
    } catch (error) {
      console.error('Erreur dans getEventStats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        upcoming: 0,
        past: 0
      };
    }
  }

  // Utilitaires
  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Valider les données d'un événement
  validateEvent(eventData: Partial<Event>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!eventData.title?.trim()) {
      errors.push('Le titre est obligatoire');
    }

    if (!eventData.description?.trim()) {
      errors.push('La description est obligatoire');
    }

    if (!eventData.start_date) {
      errors.push('La date de début est obligatoire');
    }

    if (!eventData.location?.trim()) {
      errors.push('Le lieu est obligatoire');
    }

    if (!eventData.category) {
      errors.push('La catégorie est obligatoire');
    }

    if (eventData.end_date && eventData.start_date && 
        new Date(eventData.end_date) < new Date(eventData.start_date)) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }

    if (eventData.registration_url && !this.isValidUrl(eventData.registration_url)) {
      errors.push('L\'URL d\'inscription n\'est pas valide');
    }

    if (eventData.contact_email && !this.isValidEmail(eventData.contact_email)) {
      errors.push('L\'email de contact n\'est pas valide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const eventService = new EventService();