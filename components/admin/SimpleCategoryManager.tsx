import React, { useState, useEffect } from 'react';
import { 
  Home, Bed, Coffee, Utensils, Camera, MapPin, Calendar,
  Users, Settings, Plus, Edit3, Eye, EyeOff, Trash2,
  ChevronRight, List, Grid, Search, Filter
} from 'lucide-react';
import { CategoryContentService, ContentItem } from '../../services/admin/CategoryContentService';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  types: string[];
  color: string;
}

const SimpleCategoryManager: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [globalStats, setGlobalStats] = useState<Record<string, number>>({});

  // Catégories basées sur la navigation du site
  const categories: Category[] = [
    {
      id: 'accommodations',
      name: 'Où dormir',
      icon: Bed,
      description: 'Hébergements, gîtes, chambres d\'hôtes',
      types: ['accommodation', 'bed_breakfast', 'gite', 'hotel', 'camping'],
      color: 'bg-blue-500'
    },
    {
      id: 'dining',
      name: 'Se désaltérer',
      icon: Utensils,
      description: 'Restaurants, cafés, bars',
      types: ['restaurant', 'cafe', 'bar'],
      color: 'bg-green-500'
    },
    {
      id: 'activities',
      name: 'Que faire',
      icon: Camera,
      description: 'Activités, loisirs, expériences',
      types: ['activity', 'experience', 'leisure'],
      color: 'bg-purple-500'
    },
    {
      id: 'heritage',
      name: 'Patrimoine',
      icon: MapPin,
      description: 'Musées, monuments, sites historiques',
      types: ['museum', 'monument', 'heritage'],
      color: 'bg-orange-500'
    },
    {
      id: 'walks',
      name: 'Balades',
      icon: MapPin,
      description: 'Circuits pédestres, randonnées',
      types: ['walk', 'hike', 'trail'],
      color: 'bg-teal-500'
    },
    {
      id: 'events',
      name: 'Événements',
      icon: Calendar,
      description: 'Agenda, manifestations, festivals',
      types: ['event', 'festival', 'manifestation'],
      color: 'bg-red-500'
    },
    {
      id: 'team',
      name: 'Équipe',
      icon: Users,
      description: 'Membres de l\'équipe, contacts',
      types: ['team_member', 'contact'],
      color: 'bg-indigo-500'
    },
    {
      id: 'pages',
      name: 'Pages',
      icon: Home,
      description: 'Contenu des pages, textes',
      types: ['page_content', 'homepage_block'],
      color: 'bg-gray-500'
    }
  ];

  // Charger les statistiques globales au démarrage
  useEffect(() => {
    loadGlobalStats();
  }, []);

  const loadGlobalStats = async () => {
    try {
      const stats = await CategoryContentService.getGlobalStats();
      setGlobalStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadCategoryItems = async (categoryId: string) => {
    setLoading(true);
    try {
      const data = await CategoryContentService.getCategoryItems(categoryId);
      setItems(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    setStatusFilter('all');
    loadCategoryItems(categoryId);
  };

  const handleSearch = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const data = await CategoryContentService.searchCategoryItems(selectedCategory, searchTerm);
      setItems(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedCategory) {
    return (
      <div className="p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion du Contenu
          </h1>
          <p className="text-gray-600">
            Choisissez une catégorie pour gérer le contenu correspondant
          </p>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-center mb-4">
                  <div className={`${category.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-gray-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.types.length} type(s)</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Gérer →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Statistiques rapides */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Aperçu Rapide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{globalStats.accommodations || 0}</div>
              <div className="text-sm text-gray-600">Hébergements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalStats.dining || 0}</div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{globalStats.activities || 0}</div>
              <div className="text-sm text-gray-600">Activités</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{globalStats.heritage || 0}</div>
              <div className="text-sm text-gray-600">Sites patrimoniaux</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedCat = categories.find(cat => cat.id === selectedCategory);
  const IconComponent = selectedCat?.icon || Home;

  return (
    <div className="p-6">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Retour
          </button>
          <div className="flex items-center">
            <div className={`${selectedCat?.color} p-2 rounded-lg text-white mr-3`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCat?.name}
              </h1>
              <p className="text-gray-600 text-sm">
                {selectedCat?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Recherche */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Filtre par statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="archived">Archivés</option>
          </select>

          {/* Boutons de vue */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des éléments */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          {viewMode === 'list' ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modifié
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.view_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Type: {item.type}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {item.view_count || 0} vues
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleCategoryManager;