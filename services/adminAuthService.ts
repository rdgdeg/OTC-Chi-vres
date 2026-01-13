import { supabase } from './supabaseClient';

export interface AdminSession {
  id: string;
  sessionToken: string;
  expiresAt: string;
  createdAt: string;
}

export class AdminAuthService {
  private static readonly SESSION_KEY = 'admin_session_token';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

  /**
   * Créer une session admin temporaire
   * Alternative à l'authentification anonyme
   */
  static async createAdminSession(): Promise<string> {
    try {
      // Appeler la fonction SQL pour créer une session
      const { data, error } = await supabase.rpc('create_admin_session');
      
      if (error) throw error;
      
      const sessionToken = data as string;
      
      // Stocker le token localement
      localStorage.setItem(this.SESSION_KEY, sessionToken);
      
      return sessionToken;
    } catch (error) {
      console.error('Erreur lors de la création de la session admin:', error);
      throw error;
    }
  }

  /**
   * Valider une session admin existante
   */
  static async validateSession(token?: string): Promise<boolean> {
    try {
      const sessionToken = token || localStorage.getItem(this.SESSION_KEY);
      
      if (!sessionToken) return false;

      const { data, error } = await supabase.rpc('validate_admin_session', {
        token: sessionToken
      });

      if (error) throw error;

      return data as boolean;
    } catch (error) {
      console.error('Erreur lors de la validation de session:', error);
      return false;
    }
  }

  /**
   * Obtenir la session courante
   */
  static getCurrentSession(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  /**
   * Détruire la session courante
   */
  static async destroySession(): Promise<void> {
    try {
      const sessionToken = localStorage.getItem(this.SESSION_KEY);
      
      if (sessionToken) {
        // Supprimer de la base de données
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }

      // Supprimer du localStorage
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Erreur lors de la destruction de session:', error);
      // Supprimer quand même du localStorage
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  /**
   * Vérifier si une session est active
   */
  static async isSessionActive(): Promise<boolean> {
    const sessionToken = this.getCurrentSession();
    if (!sessionToken) return false;
    
    return await this.validateSession(sessionToken);
  }

  /**
   * Renouveler une session existante
   */
  static async renewSession(): Promise<string> {
    // Détruire l'ancienne session
    await this.destroySession();
    
    // Créer une nouvelle session
    return await this.createAdminSession();
  }

  /**
   * Nettoyer les sessions expirées (fonction utilitaire)
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_sessions');
      
      if (error) throw error;
      
      return data as number;
    } catch (error) {
      console.error('Erreur lors du nettoyage des sessions:', error);
      return 0;
    }
  }

  /**
   * Initialiser une session admin pour l'interface d'administration
   */
  static async initializeAdminAccess(): Promise<boolean> {
    try {
      // Vérifier si une session existe déjà
      const isActive = await this.isSessionActive();
      
      if (isActive) {
        console.log('Session admin déjà active');
        return true;
      }

      // Créer une nouvelle session
      const sessionToken = await this.createAdminSession();
      
      console.log('Nouvelle session admin créée');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'accès admin:', error);
      return false;
    }
  }
}