export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',    // Accès total + gestion utilisateurs
  ADMIN = 'admin',                // Gestion contenu + modération
  EDITOR = 'editor',              // Édition contenu seulement
  VIEWER = 'viewer'               // Lecture seule
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: UserRole;
}