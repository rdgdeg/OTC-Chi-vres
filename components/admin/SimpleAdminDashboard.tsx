import React, { useState } from 'react';
import SimpleCategoryManager from './SimpleCategoryManager';
import UnifiedPageBannerManager from './UnifiedPageBannerManager';
import { 
  BarChart3, Settings, Users, Image, FileText, 
  Layout, Home, LogOut, Menu, X
} from 'lucide-react';

interface AdminSection {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  description: string;
}

const SimpleAdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('pages');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections: AdminSection[] = [
    {
      id: 'pages',
      name: 'Pages & Bannières',
      icon: Layout,
      component: UnifiedPageBannerManager,
      description: 'Modifier le contenu des pages et bannières'
    },
    {
      id: 'content',
      name: 'Contenu',
      icon: FileText,
      component: SimpleCategoryManager,
      description: 'Gérer tous les contenus par catégorie'
    },
    {
      id: 'media',
      name: 'Médias',
      icon: Image,
      component: () => <div className="p-6">Gestionnaire de médias (à venir)</div>,
      description: 'Images, vidéos, documents'
    },
    {
      id: 'analytics',
      name: 'Statistiques',
      icon: BarChart3,
      component: () => <div className="p-6">Statistiques (à venir)</div>,
      description: 'Vues, performances, analytics'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: Settings,
      component: () => <div className="p-6">Paramètres (à venir)</div>,
      description: 'Configuration du site'
    }
  ];

  const activeComponent = sections.find(s => s.id === activeSection)?.component || SimpleCategoryManager;
  const ActiveComponent = activeComponent;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin OTC</h1>
                <p className="text-xs text-gray-600">Chièvres</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sections.map((section) => {
              const IconComponent = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!sidebarOpen ? section.name : ''}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {sidebarOpen && (
                    <div className="ml-3">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">Connecté</div>
              </div>
            )}
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="h-5 w-5" />
              </button>
              <a 
                href="/" 
                target="_blank"
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voir le site →
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;