import React, { createContext, useContext, useState, useEffect } from 'react';

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

      // Pour l'instant, pas de Supabase
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const legacyLogin = (password: string): boolean => {
    if (password === 'admin') {
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
      sessionStorage.setItem('admin_authenticated', 'true');
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