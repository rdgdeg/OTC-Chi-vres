import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

// Types simplifiés pour éviter les erreurs d'import
interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials | string) => Promise<void | boolean>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Vérifier l'ancien système (sessionStorage)
      const legacyAuth = sessionStorage.getItem('admin_authenticated');
      if (legacyAuth === 'true') {
        // Créer une session Supabase temporaire pour l'admin
        await createAdminSession();
        return;
      }

      // Vérifier la session Supabase existante
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email || 'admin@chievres.be',
            name: 'Administrateur',
            role: 'super_admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const createAdminSession = async () => {
    try {
      // Utiliser une authentification anonyme mais avec des privilèges admin
      // En production, ceci devrait être remplacé par une vraie authentification
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Erreur lors de la création de la session admin:', error);
        // Fallback: utiliser le système legacy
        setAuthState({
          user: {
            id: 'legacy-admin',
            email: 'admin@chievres.be',
            name: 'Administrateur',
            role: 'super_admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      setAuthState({
        user: {
          id: data.user?.id || 'admin-session',
          email: 'admin@chievres.be',
          name: 'Administrateur',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const legacyLogin = async (password: string): Promise<boolean> => {
    if (password === 'admin') {
      sessionStorage.setItem('admin_authenticated', 'true');
      await createAdminSession();
      return true;
    }
    return false;
  };

  // Fonction de login hybride
  const login = async (credentialsOrPassword: LoginCredentials | string): Promise<void | boolean> => {
    if (typeof credentialsOrPassword === 'string') {
      // Mode legacy
      return legacyLogin(credentialsOrPassword);
    } else {
      // Mode moderne - à implémenter plus tard
      console.log('Modern login not implemented yet');
      throw new Error('Authentification moderne pas encore implémentée');
    }
  };

  const logout = async () => {
    try {
      // Nettoyer l'ancien système
      sessionStorage.removeItem('admin_authenticated');
      
      // Déconnecter de Supabase
      await supabase.auth.signOut();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!authState.user) return false;
    
    // Super admin a tous les droits
    if (authState.user.role === 'super_admin') return true;
    
    // Admin peut gérer la plupart des contenus
    if (authState.user.role === 'admin') {
      return !['users'].includes(resource) || action === 'read';
    }
    
    // Éditeur peut créer/modifier le contenu
    if (authState.user.role === 'editor') {
      return ['places', 'events', 'articles', 'products', 'experiences', 'page_content'].includes(resource) && 
             ['create', 'read', 'update'].includes(action);
    }
    
    // Lecteur peut seulement lire
    if (authState.user.role === 'viewer') {
      return action === 'read';
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};