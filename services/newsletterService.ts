import { supabase } from './supabaseClient';

export interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  tags: string[];
  metadata: Record<string, any>;
  subscribed_at: string;
  unsubscribed_at?: string;
  last_email_sent?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  recent: number; // Inscriptions des 30 derniers jours
}

class NewsletterService {
  // Inscription à la newsletter
  async subscribe(email: string, name?: string, source: string = 'website'): Promise<{ success: boolean; message: string; data?: NewsletterSubscription }> {
    try {
      // Vérifier si l'email existe déjà
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.status === 'active') {
          return {
            success: false,
            message: 'Cette adresse email est déjà inscrite à notre newsletter.'
          };
        } else {
          // Réactiver l'abonnement
          const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .update({
              status: 'active',
              name: name || existing.name,
              source,
              unsubscribed_at: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;

          return {
            success: true,
            message: 'Votre abonnement a été réactivé avec succès !',
            data
          };
        }
      }

      // Nouvelle inscription
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email,
          name,
          source,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.',
        data
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la newsletter:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer.'
      };
    }
  }

  // Désabonnement
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) throw error;

      return {
        success: true,
        message: 'Vous avez été désabonné(e) avec succès.'
      };
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors du désabonnement.'
      };
    }
  }

  // Obtenir toutes les inscriptions (admin)
  async getAllSubscriptions(page: number = 1, limit: number = 50): Promise<{
    data: NewsletterSubscription[];
    count: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      return { data: [], count: 0, totalPages: 0 };
    }
  }

  // Rechercher des inscriptions
  async searchSubscriptions(query: string): Promise<NewsletterSubscription[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .or(`email.ilike.%${query}%,name.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  }

  // Obtenir les statistiques
  async getStats(): Promise<NewsletterStats> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('status, created_at');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: 0,
        unsubscribed: 0,
        bounced: 0,
        recent: 0
      };

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      data?.forEach(subscription => {
        switch (subscription.status) {
          case 'active':
            stats.active++;
            break;
          case 'unsubscribed':
            stats.unsubscribed++;
            break;
          case 'bounced':
            stats.bounced++;
            break;
        }

        if (new Date(subscription.created_at) > thirtyDaysAgo) {
          stats.recent++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { total: 0, active: 0, unsubscribed: 0, bounced: 0, recent: 0 };
    }
  }

  // Exporter les emails actifs
  async exportActiveEmails(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('status', 'active')
        .order('email');

      if (error) throw error;
      return data?.map(sub => sub.email) || [];
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return [];
    }
  }

  // Mettre à jour le statut d'un abonnement
  async updateSubscriptionStatus(id: string, status: 'active' | 'unsubscribed' | 'bounced'): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'unsubscribed') {
        updateData.unsubscribed_at = new Date().toISOString();
      } else if (status === 'active') {
        updateData.unsubscribed_at = null;
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return false;
    }
  }

  // Supprimer un abonnement
  async deleteSubscription(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  // Ajouter des tags à un abonnement
  async addTags(id: string, tags: string[]): Promise<boolean> {
    try {
      const { data: current } = await supabase
        .from('newsletter_subscriptions')
        .select('tags')
        .eq('id', id)
        .single();

      const currentTags = current?.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ tags: newTags, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des tags:', error);
      return false;
    }
  }
}

export const newsletterService = new NewsletterService();
export default newsletterService;