import React, { useState } from 'react';
import UniversalItemManager from './UniversalItemManager';
import { 
  MapPin, Utensils, BedIcon as Bed, Store, Mountain, Briefcase, 
  Calendar, FileText, ShoppingBag, BarChart3, Settings,
  Eye, EyeOff, Trash2, AlertCircle, TrendingUp
} from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  itemType: 'museums' | 'restaurants' | 'accommodation' | 'merchants' | 'walks' | 'experiences' | 'events' | 'articles' | 'products';
  color: string;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canToggleStatus: boolean;
  };
}

const ContentManagementDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [bulkAction, setBulkAction] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const contentSections: ContentSection[] = [
    {
      id: 'museums',
      title: 'Musées & Patrimoine',
      description: 'Gérez les sites historiques, monuments et musées',
      icon: MapPin,
      itemType: 'museums',
      color: 'bg-purple-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'restaurants',
      title: 'Restaurants & Cafés',
      description: 'Gérez les établissements de restauration',
      icon: Utensils,
      itemType: 'restaurants',
      color: 'bg-orange-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'accommodation',
      title: 'Hébergements',
      description: 'Gérez les gîtes, chambres d\'hôtes et hôtels',
      icon: Bed,
      itemType: 'accommodation',
      color: 'bg-blue-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'merchants',
      title: 'Commerçants & Producteurs',
      description: 'Gérez les boutiques et producteurs locaux',
      icon: Store,
      itemType: 'merchants',
      color: 'bg-green-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'walks',
      title: 'Balades & Randonnées',
      description: 'Gérez les circuits de découverte',
      icon: Mountain,
      itemType: 'walks',
      color: 'bg-emerald-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'experiences',
      title: 'Expériences',
      description: 'Gérez les activités et expériences proposées',
      icon: Briefcase,
      itemType: 'experiences',
      color: 'bg-indigo-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'events',
      title: 'Événements',
      description: 'Gérez l\'agenda et les événements',
      icon: Calendar,
      itemType: 'events',
      color: 'bg-pink-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'articles',
      title: 'Articles & Blog',
      description: 'Gérez les actualités et articles de blog',
      icon: FileText,
      itemType: 'articles',
      color: 'bg-yellow-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    },
    {
      id: 'products',
      title: 'Boutique',
      description: 'Gérez les produits de la boutique en ligne',
      icon: ShoppingBag,
      itemType: 'products',
      color: 'bg-red-500',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canToggleStatus: true
      }
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h1>
            <p className="text-gray-600 mt-1">
              Gérez tous les éléments de votre site depuis cette interface centralisée
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {contentSections.length}
              </div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Activer tout</div>
              <div className="text-sm text-gray-600">Rendre tous les éléments visibles</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <EyeOff className="h-6 w-6 text-orange-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Désactiver tout</div>
              <div className="text-sm text-gray-600">Masquer tous les éléments</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Statistiques</div>
              <div className="text-sm text-gray-600">Voir les analytics détaillées</div>
            </div>
          </button>
        </div>
      </div>

      {/* Grille des sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveSection(section.id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${section.color} text-white mr-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {section.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    {section.permissions.canCreate && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Créer
                      </span>
                    )}
                    {section.permissions.canEdit && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                        Modifier
                      </span>
                    )}
                    {section.permissions.canDelete && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                        Supprimer
                      </span>
                    )}
                  </div>
                  
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Gérer →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertes et notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes système</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <div className="font-medium text-yellow-800">Éléments en brouillon</div>
              <div className="text-sm text-yellow-700">
                Certains éléments sont en mode brouillon et ne sont pas visibles sur le site
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-blue-800">Statistiques disponibles</div>
              <div className="text-sm text-blue-700">
                Consultez les analytics pour optimiser votre contenu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionManager = (sectionId: string) => {
    const section = contentSections.find(s => s.id === sectionId);
    if (!section) return null;

    return (
      <div>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Gestion du Contenu
                </button>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{section.title}</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Gestionnaire universel */}
        <UniversalItemManager
          itemType={section.itemType}
          title={section.title}
          description={section.description}
          canCreate={section.permissions.canCreate}
          canEdit={section.permissions.canEdit}
          canDelete={section.permissions.canDelete}
          canToggleStatus={section.permissions.canToggleStatus}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' ? renderOverview() : renderSectionManager(activeSection)}
      </div>
    </div>
  );
};

export default ContentManagementDashboard;