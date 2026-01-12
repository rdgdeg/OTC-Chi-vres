import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, Settings, BarChart3, FileText, Image as ImageIcon, 
  Calendar, MapPin, ShoppingBag, Briefcase, Bed,
  Plus, Activity, TrendingUp, AlertCircle, Home, Layout,
  LogOut, Bell, Search, Layers, Building, Mail, Zap, Megaphone
} from 'lucide-react';
import AdminHomePage from '../components/AdminHomePage';
import AdminPageManager from '../components/AdminPageManager';
import AccommodationManager from '../components/AccommodationManager';
import ContentManagementDashboard from '../components/ContentManagementDashboard';
import PageContentManager from '../components/PageContentManager';
import HomepageContentManager from '../components/HomepageContentManager';
import NewsletterManager from '../components/NewsletterManager';
import BannerManager from '../components/BannerManager';
import MuseumSortManager from '../components/MuseumSortManager';
import MuseumPatrimoineManager from '../components/MuseumPatrimoineManager';
import { UnifiedCMSDashboard } from '../components/cms/UnifiedCMSDashboard';
import { UnifiedCMSProvider } from '../contexts/UnifiedCMSContext';

const AdminDashboard: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Statistiques factices pour la démo
  const stats = {
    totalPlaces: 45,
    totalEvents: 12,
    totalArticles: 8,
    totalUsers: 5,
    recentActivity: 23,
    pendingReviews: 3
  };

  // Navigation principale
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: BarChart3,
      permission: null
    },
    {
      id: 'banner',
      label: 'Bannière d\'Info',
      icon: Megaphone,
      permission: 'content:write'
    },
    {
      id: 'unified-cms',
      label: 'CMS Unifié',
      icon: Zap,
      permission: 'content:read',
      featured: true
    },
    {
      id: 'content-management',
      label: 'Gestion du Contenu',
      icon: Layers,
      permission: 'content:read'
    },
    {
      id: 'pages',
      label: 'Gestion des Pages',
      icon: Layout,
      permission: 'content:write'
    },
    {
      id: 'homepage',
      label: 'Page d\'Accueil',
      icon: Home,
      permission: 'content:write'
    },
    {
      id: 'homepage-content',
      label: 'Contenu Accueil',
      icon: Layout,
      permission: 'content:write'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: Mail,
      permission: 'content:read'
    },
    {
      id: 'places',
      label: 'Musées & Patrimoine',
      icon: MapPin,
      permission: 'places:read'
    },
    {
      id: 'places-sort',
      label: 'Tri Musées & Patrimoine',
      icon: Layers,
      permission: 'places:write'
    },
    {
      id: 'accommodations',
      label: 'Hébergements',
      icon: Bed,
      permission: 'accommodations:read'
    },
    {
      id: 'experiences',
      label: 'Expériences',
      icon: Briefcase,
      permission: 'experiences:read'
    },
    {
      id: 'events',
      label: 'Événements',
      icon: Calendar,
      permission: 'events:read'
    },
    {
      id: 'articles',
      label: 'Articles & Blog',
      icon: FileText,
      permission: 'articles:read'
    },
    {
      id: 'products',
      label: 'Boutique',
      icon: ShoppingBag,
      permission: 'products:read'
    },
    {
      id: 'media',
      label: 'Médiathèque',
      icon: ImageIcon,
      permission: 'media:read'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      permission: 'users:read',
      adminOnly: true
    }
  ];

  // Filtrer les éléments de navigation selon les permissions
  const filteredNavigation = navigationItems.filter(item => {
    if (item.adminOnly && user?.role !== 'super_admin' && user?.role !== 'admin') {
      return false;
    }
    if (item.permission && !hasPermission(item.permission.split(':')[0], item.permission.split(':')[1])) {
      return false;
    }
    return true;
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'banner':
        return <BannerManager />;
      case 'places':
        return <MuseumPatrimoineManager />;
      case 'places-sort':
        return <MuseumSortManager />;
      case 'unified-cms':
        return (
          <UnifiedCMSProvider>
            <UnifiedCMSDashboard />
          </UnifiedCMSProvider>
        );
      case 'content-management':
        return <ContentManagementDashboard />;
      case 'pages':
        return <PageContentManager />;
      case 'homepage':
        return <AdminHomePage />;
      case 'homepage-content':
        return <HomepageContentManager />;
      case 'newsletter':
        return <NewsletterManager />;
      case 'accommodations':
        return <AccommodationManager />;
      case 'media':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Gestionnaire de Médias</h2>
            <p className="text-slate-600">Fonctionnalité à venir - Gestion complète des médias avec Supabase Storage</p>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Gestion des Utilisateurs</h2>
            <p className="text-slate-600">Fonctionnalité à venir - Gestion complète des utilisateurs et rôles</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 capitalize">
              {activeSection.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <p className="text-slate-600">
              Éditeur de contenu pour {activeSection} - Fonctionnalité à implémenter
            </p>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Accès non autorisé</h2>
          <p className="text-slate-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`bg-slate-900 text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building size={20} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-slate-400">VisitChièvres.be</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors relative ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.featured && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Nouveau
                    </span>
                  )}
                </>
              )}
              {sidebarCollapsed && item.featured && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <Users size={16} />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-white"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <Settings size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 capitalize">
                  {activeSection.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <p className="text-sm text-slate-600">
                  Gestion du contenu de l'office de tourisme
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Recherche globale */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <Bell size={20} />
                {stats.pendingReviews > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingReviews}
                  </span>
                )}
              </button>

              {/* Profil utilisateur */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Composant pour l'aperçu du tableau de bord
const DashboardOverview: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Musées & Patrimoine"
          value={stats.totalPlaces}
          icon={MapPin}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Événements"
          value={stats.totalEvents}
          icon={Calendar}
          color="green"
          trend="+5%"
        />
        <StatCard
          title="Articles"
          value={stats.totalArticles}
          icon={FileText}
          color="purple"
          trend="+8%"
        />
        <StatCard
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={Users}
          color="orange"
          trend="+2"
        />
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Activité Récente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Nouveau musée ajouté', user: 'Marie Dupont', time: '2h' },
              { action: 'Article publié', user: 'Jean Martin', time: '4h' },
              { action: 'Événement modifié', user: 'Sophie Bernard', time: '6h' },
              { action: 'Image uploadée', user: 'Pierre Durand', time: '8h' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-xs text-slate-500">par {activity.user}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Statistiques du Mois
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Vues des pages</span>
              <span className="text-lg font-semibold text-slate-800">12,543</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Nouveaux visiteurs</span>
              <span className="text-lg font-semibold text-slate-800">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Taux de rebond</span>
              <span className="text-lg font-semibold text-slate-800">34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Temps moyen</span>
              <span className="text-lg font-semibold text-slate-800">3m 42s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Plus}
            label="Nouveau Lieu"
            onClick={() => alert('Fonctionnalité à venir')}
          />
          <QuickActionButton
            icon={Calendar}
            label="Nouvel Événement"
            onClick={() => alert('Fonctionnalité à venir')}
          />
          <QuickActionButton
            icon={FileText}
            label="Nouvel Article"
            onClick={() => alert('Fonctionnalité à venir')}
          />
          <QuickActionButton
            icon={ImageIcon}
            label="Upload Média"
            onClick={() => alert('Fonctionnalité à venir')}
          />
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de statistiques
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">↗ {trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]}`}>
          <Icon size={24} className={colorClasses[color as keyof typeof colorClasses].split(' ')[1]} />
        </div>
      </div>
    </div>
  );
};

// Composant pour les boutons d'action rapide
const QuickActionButton: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
        <Icon size={20} className="text-slate-600 group-hover:text-blue-600" />
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{label}</span>
    </button>
  );
};

export default AdminDashboard;