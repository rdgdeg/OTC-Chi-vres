import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, Settings, Users, FileText, Image as ImageIcon,
  Calendar, MapPin, ShoppingBag, Briefcase, Bed, Home, Layout,
  Mail, Megaphone, Layers, Building, Mountain, Camera,
  Plus, Search, Filter, Grid, List, Eye, Edit, Trash2,
  Save, X, Check, AlertCircle, TrendingUp, Activity
} from 'lucide-react';

// Import des gestionnaires
import { ContentManager } from './ContentManager';
import { MediaManager } from './MediaManager';
import { SettingsManager } from './SettingsManager';
import { AnalyticsManager } from './AnalyticsManager';

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'content' | 'media' | 'settings' | 'analytics';
  permission: string;
  count?: number;
  status?: 'active' | 'draft' | 'archived';
}

interface AdminStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalMedia: number;
  totalViews: number;
  recentActivity: number;
}

export const UnifiedAdminDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Sections du tableau de bord organisées par catégorie
  const adminSections: AdminSection[] = [
    // CONTENU
    {
      id: 'accommodations',
      title: 'Hébergements',
      description: 'Gîtes, chambres d\'hôtes, hôtels',
      icon: Bed,
      category: 'content',
      permission: 'accommodations:read',
      count: 0
    },
    {
      id: 'places',
      title: 'Lieux & Patrimoine',
      description: 'Musées, monuments, sites historiques',
      icon: Building,
      category: 'content',
      permission: 'places:read',
      count: 0
    },
    {
      id: 'walks',
      title: 'Balades & Randonnées',
      description: 'Circuits pédestres, tracés GPX',
      icon: Mountain,
      category: 'content',
      permission: 'walks:read',
      count: 0
    },
    {
      id: 'experiences',
      title: 'Expériences',
      description: 'Activités, visites guidées',
      icon: Briefcase,
      category: 'content',
      permission: 'experiences:read',
      count: 0
    },
    {
      id: 'events',
      title: 'Événements',
      description: 'Agenda, manifestations',
      icon: Calendar,
      category: 'content',
      permission: 'events:read',
      count: 0
    },
    {
      id: 'articles',
      title: 'Articles & Blog',
      description: 'Actualités, articles de blog',
      icon: FileText,
      category: 'content',
      permission: 'articles:read',
      count: 0
    },
    {
      id: 'products',
      title: 'Boutique',
      description: 'Produits, souvenirs',
      icon: ShoppingBag,
      category: 'content',
      permission: 'products:read',
      count: 0
    },
    {
      id: 'pages',
      title: 'Pages Dynamiques',
      description: 'Pages personnalisées',
      icon: Layout,
      category: 'content',
      permission: 'pages:read',
      count: 0
    },
    {
      id: 'homepage',
      title: 'Page d\'Accueil',
      description: 'Contenu de la page d\'accueil',
      icon: Home,
      category: 'content',
      permission: 'homepage:read',
      count: 0
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Campagnes, abonnés',
      icon: Mail,
      category: 'content',
      permission: 'newsletter:read',
      count: 0
    },
    // MÉDIAS
    {
      id: 'media',
      title: 'Médiathèque',
      description: 'Images, vidéos, documents',
      icon: ImageIcon,
      category: 'media',
      permission: 'media:read',
      count: 0
    },
    {
      id: 'gallery',
      title: 'Galeries',
      description: 'Collections d\'images',
      icon: Camera,
      category: 'media',
      permission: 'media:read',
      count: 0
    }
  ];

  // Charger les statistiques
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // TODO: Implémenter le chargement des vraies statistiques
      const mockStats: AdminStats = {
        totalContent: 156,
        publishedContent: 142,
        draftContent: 14,
        totalMedia: 89,
        totalViews: 12543,
        recentActivity: 23
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sections
  const filteredSections = adminSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    const hasPermission = !section.permission || hasPermission(section.permission);
    
    return matchesSearch && matchesCategory && hasPermission;
  });

  // Rendu de la vue d'ensemble
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contenu Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalContent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publié</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.publishedContent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Edit className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.draftContent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ImageIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Médias</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalMedia || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="content">Contenu</option>
            <option value="media">Médias</option>
            <option value="settings">Paramètres</option>
            <option value="analytics">Analytics</option>
          </select>

          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredSections.map((section) => (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-lg
                ${viewMode === 'grid' 
                  ? 'bg-gray-50 rounded-lg p-6 hover:bg-gray-100' 
                  : 'bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100'
                }
              `}
            >
              <div className={`
                ${viewMode === 'grid' ? 'text-center' : 'flex items-center flex-1'}
              `}>
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'mx-auto mb-4 p-3 bg-white rounded-lg shadow-sm w-fit' 
                    : 'p-2 bg-white rounded-lg shadow-sm mr-4'
                  }
                `}>
                  <section.icon className={`
                    ${viewMode === 'grid' ? 'h-8 w-8' : 'h-6 w-6'} text-blue-600
                  `} />
                </div>
                
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className={`
                    font-semibold text-gray-900
                    ${viewMode === 'grid' ? 'text-lg mb-2' : 'text-base'}
                  `}>
                    {section.title}
                  </h3>
                  <p className={`
                    text-gray-600
                    ${viewMode === 'grid' ? 'text-sm' : 'text-sm'}
                  `}>
                    {section.description}
                  </p>
                </div>

                {section.count !== undefined && (
                  <div className={`
                    ${viewMode === 'grid' 
                      ? 'mt-4 text-center' 
                      : 'ml-4 text-right'
                    }
                  `}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {section.count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Rendu du contenu principal
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'media':
        return <MediaManager />;
      case 'settings':
        return <SettingsManager />;
      case 'analytics':
        return <AnalyticsManager />;
      default:
        return <ContentManager contentType={activeSection} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de Bord Admin
              </h1>
              {activeSection !== 'overview' && (
                <button
                  onClick={() => setActiveSection('overview')}
                  className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Retour à l'aperçu
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Connecté en tant que <span className="font-medium">{user?.name}</span>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};