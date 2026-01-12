import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, Calendar,
  MapPin, Clock, Globe, Smartphone, Monitor,
  ArrowUp, ArrowDown, Minus, RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    trends: {
      views: number;
      visitors: number;
      pageViews: number;
      bounceRate: number;
    };
  };
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
  }>;
  topContent: Array<{
    type: string;
    title: string;
    views: number;
    engagement: number;
  }>;
  devices: Array<{
    type: string;
    percentage: number;
    sessions: number;
  }>;
  locations: Array<{
    country: string;
    city?: string;
    sessions: number;
    percentage: number;
  }>;
  timeStats: Array<{
    hour: number;
    sessions: number;
  }>;
}

export const AnalyticsManager: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Charger les données analytics
  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Implémenter le chargement des vraies données analytics
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 12543,
          uniqueVisitors: 8921,
          pageViews: 18765,
          bounceRate: 42.3,
          avgSessionDuration: 245,
          trends: {
            views: 12.5,
            visitors: 8.3,
            pageViews: 15.2,
            bounceRate: -3.1
          }
        },
        topPages: [
          { path: '/', title: 'Accueil', views: 3421, uniqueViews: 2876 },
          { path: '/hebergements', title: 'Hébergements', views: 2134, uniqueViews: 1987 },
          { path: '/lieux-patrimoine', title: 'Lieux & Patrimoine', views: 1876, uniqueViews: 1654 },
          { path: '/balades', title: 'Balades', views: 1543, uniqueViews: 1432 },
          { path: '/evenements', title: 'Événements', views: 1234, uniqueViews: 1123 }
        ],
        topContent: [
          { type: 'accommodation', title: 'Gîte du Moulin', views: 543, engagement: 78.5 },
          { type: 'place', title: 'Château de Chièvres', views: 432, engagement: 82.1 },
          { type: 'walk', title: 'Circuit des Étangs', views: 387, engagement: 75.3 },
          { type: 'event', title: 'Marché de Noël', views: 321, engagement: 89.2 }
        ],
        devices: [
          { type: 'Desktop', percentage: 45.2, sessions: 4032 },
          { type: 'Mobile', percentage: 38.7, sessions: 3453 },
          { type: 'Tablet', percentage: 16.1, sessions: 1436 }
        ],
        locations: [
          { country: 'Belgique', city: 'Bruxelles', sessions: 3421, percentage: 38.4 },
          { country: 'France', city: 'Paris', sessions: 2134, percentage: 23.9 },
          { country: 'Pays-Bas', city: 'Amsterdam', sessions: 1876, percentage: 21.0 },
          { country: 'Allemagne', city: 'Berlin', sessions: 1489, percentage: 16.7 }
        ],
        timeStats: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          sessions: Math.floor(Math.random() * 500) + 100
        }))
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  // Formater les nombres
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Formater la durée
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Obtenir l'icône de tendance
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Obtenir la couleur de tendance
  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Données non disponibles
        </h3>
        <p className="text-gray-600">
          Impossible de charger les données analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Statistiques et performances du site</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Aujourd'hui</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vues totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(data.overview.totalViews)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(data.overview.trends.views)}
            <span className={`ml-1 text-sm ${getTrendColor(data.overview.trends.views)}`}>
              {Math.abs(data.overview.trends.views)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visiteurs uniques</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(data.overview.uniqueVisitors)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(data.overview.trends.visitors)}
            <span className={`ml-1 text-sm ${getTrendColor(data.overview.trends.visitors)}`}>
              {Math.abs(data.overview.trends.visitors)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pages vues</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(data.overview.pageViews)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(data.overview.trends.pageViews)}
            <span className={`ml-1 text-sm ${getTrendColor(data.overview.trends.pageViews)}`}>
              {Math.abs(data.overview.trends.pageViews)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Durée moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(data.overview.avgSessionDuration)}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">
              Taux de rebond: {data.overview.bounceRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages les plus visitées */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pages les plus visitées
          </h3>
          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {page.title}
                    </p>
                    <p className="text-xs text-gray-500">{page.path}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(page.views)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(page.uniqueViews)} uniques
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu le plus populaire */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contenu le plus populaire
          </h3>
          <div className="space-y-4">
            {data.topContent.map((content, index) => (
              <div key={content.title} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {content.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {content.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(content.views)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {content.engagement}% engagement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appareils */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Types d'appareils
          </h3>
          <div className="space-y-4">
            {data.devices.map(device => (
              <div key={device.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  {device.type === 'Desktop' && <Monitor className="h-5 w-5 text-gray-600 mr-3" />}
                  {device.type === 'Mobile' && <Smartphone className="h-5 w-5 text-gray-600 mr-3" />}
                  {device.type === 'Tablet' && <Monitor className="h-5 w-5 text-gray-600 mr-3" />}
                  <span className="text-sm font-medium text-gray-900">
                    {device.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Localisation des visiteurs
          </h3>
          <div className="space-y-4">
            {data.locations.map(location => (
              <div key={location.country} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {location.country}
                    </p>
                    {location.city && (
                      <p className="text-xs text-gray-500">{location.city}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(location.sessions)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {location.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique des heures de pointe */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Heures de pointe
        </h3>
        <div className="flex items-end space-x-1 h-32">
          {data.timeStats.map(stat => (
            <div key={stat.hour} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-600 rounded-t w-full"
                style={{
                  height: `${(stat.sessions / Math.max(...data.timeStats.map(s => s.sessions))) * 100}%`
                }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">
                {stat.hour}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};