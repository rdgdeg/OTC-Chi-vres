import { supabase } from './supabaseClient';
import { User, UserRole, LoginCredentials, RegisterData } from '../types/auth';

export class AuthService {
  
  // Connexion utilisateur
  static async login(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      // Récupérer le profil utilisateur
      const profile = await this.getUserProfile(data.user.id);
      return { user: data.user, profile };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Déconnexion
  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Inscription (admin seulement)
  static async register(userData: RegisterData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // Créer le profil utilisateur
      if (data.user) {
        await this.createUserProfile(data.user.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role || UserRole.EDITOR,
        });
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Récupérer le profil utilisateur
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Créer un profil utilisateur
  static async createUserProfile(userId: string, profileData: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          ...profileData,
          isActive: true,
          createdAt: new Date().toISOString(),
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  // Mettre à jour le profil
  static async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Lister tous les utilisateurs (admin seulement)
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  }

  // Désactiver un utilisateur
  static async deactivateUser(userId: string) {
    return this.updateUserProfile(userId, { isActive: false });
  }

  // Réactiver un utilisateur
  static async activateUser(userId: string) {
    return this.updateUserProfile(userId, { isActive: true });
  }

  // Changer le rôle d'un utilisateur
  static async changeUserRole(userId: string, newRole: UserRole) {
    return this.updateUserProfile(userId, { role: newRole });
  }

  // Vérifier les permissions
  static hasPermission(userRole: UserRole, resource: string, action: string): boolean {
    const permissions = {
      [UserRole.SUPER_ADMIN]: ['*'], // Accès total
      [UserRole.ADMIN]: [
        'places:*', 'events:*', 'articles:*', 'products:*', 
        'experiences:*', 'page_content:*', 'users:read'
      ],
      [UserRole.EDITOR]: [
        'places:create', 'places:read', 'places:update',
        'events:create', 'events:read', 'events:update',
        'articles:create', 'articles:read', 'articles:update',
        'products:create', 'products:read', 'products:update',
        'experiences:create', 'experiences:read', 'experiences:update',
        'page_content:read', 'page_content:update'
      ],
      [UserRole.VIEWER]: [
        'places:read', 'events:read', 'articles:read', 
        'products:read', 'experiences:read', 'page_content:read'
      ]
    };

    const userPermissions = permissions[userRole] || [];
    
    // Super admin a tous les droits
    if (userPermissions.includes('*')) return true;
    
    // Vérifier permission spécifique
    const specificPermission = `${resource}:${action}`;
    const wildcardPermission = `${resource}:*`;
    
    return userPermissions.includes(specificPermission) || 
           userPermissions.includes(wildcardPermission);
  }
}