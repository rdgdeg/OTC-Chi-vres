import React, { useState, useEffect } from 'react';
import { 
  Layout, Bell, Save, Eye, Search, Filter,
  ChevronRight, Image, Type, FileText, Settings,
  AlertCircle, CheckCircle, X
} from 'lucide-react';
import PageStructureManager from './PageStructureManager';
import PageContentManager from '../PageContentManager';
import { usePageContent, PageContent } from '../../contexts/PageContentContext';

type ViewMode = 'overview' | 'structure' | 'pages' | 'page-detail';

interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

const UnifiedPageBannerManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const { getAllPages } = usePageContent();

  const pages = getAllPages();
  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showMessage = (type: Message['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePageSelect = (page: PageContent) => {
    setSelectedPage(page);
    setViewMode('page-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Pages & Bannières
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Modifiez facilement le contenu de toutes les pages et bannières du site
                </p>
              </div>
              
              {viewMode !== 'overview' && (
                <button
                  onClick={() => {
                    setViewMode('overview');
                    setSelectedPage(null);
                  }}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                  Retour au tableau de bord
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
              {message.type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
              {message.type === 'info' && <AlertCircle className="h-5 w-5 mr-2" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'overview' && (
          <OverviewDashboard
            onNavigate={setViewMode}
            pagesCount={pages.length}
          />
        )}

        {viewMode === 'structure' && (
          <PageStructureManager />
        )}

        {viewMode === 'pages' && (
          <PagesListView
            pages={filteredPages}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onPageSelect={handlePageSelect}
          />
        )}

        {viewMode === 'page-detail' && selectedPage && (
          <PageDetailView
            page={selectedPage}
            onBack={() => setViewMode('pages')}
            onSave={() => showMessage('success', 'Page mise à jour avec succès')}
          />
        )}
      </div>
    </div>
  );
};

interface OverviewDashboardProps {
  onNavigate: (mode: ViewMode) => void;
  pagesCount: number;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate, pagesCount }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carte Structure des Pages */}
        <div
          onClick={() => onNavigate('structure')}
          className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Structure & Bannières
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Modifiez les bannières (info + hero), images de fond et textes des pages.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Gérer la structure
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte Pages */}
        <div
          onClick={() => onNavigate('pages')}
          className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Layout className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Contenu des pages
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Modifiez le contenu, les images et les textes de toutes les pages du site.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{pagesCount} pages disponibles</span>
                <div className="flex items-center text-green-600 font-medium">
                  Gérer les pages
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide rapide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Guide rapide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">🎨 Structure & Bannières</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Bannière d'info en haut du site</li>
              <li>• Grande bannière Hero (page d'accueil)</li>
              <li>• Images de fond et textes</li>
              <li>• Boutons d'action (CTA)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">📄 Contenu des Pages</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Modifiez titres et descriptions</li>
              <li>• Changez les images de bannière</li>
              <li>• Optimisez le référencement (SEO)</li>
              <li>• Aperçu en temps réel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pages totales</p>
              <p className="text-2xl font-bold text-gray-900">{pagesCount}</p>
            </div>
            <Layout className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bannières actives</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernière modification</p>
              <p className="text-sm font-medium text-gray-900">Aujourd'hui</p>
            </div>
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PagesListViewProps {
  pages: PageContent[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onPageSelect: (page: PageContent) => void;
}

const PagesListView: React.FC<PagesListViewProps> = ({
  pages,
  searchTerm,
  onSearchChange,
  onPageSelect
}) => {
  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une page..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Liste des pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => onPageSelect(page)}
            className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
          >
            {/* Image de bannière */}
            <div className="h-32 bg-gray-200 overflow-hidden">
              <img
                src={page.heroImage || 'https://picsum.photos/400/200?grayscale'}
                alt={page.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Contenu */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {page.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{page.path}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {page.description || page.subtitle}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Modifié {page.lastModified ? 'récemment' : 'jamais'}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune page trouvée
          </h3>
          <p className="text-gray-600">
            Essayez de modifier votre recherche
          </p>
        </div>
      )}
    </div>
  );
};

interface PageDetailViewProps {
  page: PageContent;
  onBack: () => void;
  onSave: () => void;
}

const PageDetailView: React.FC<PageDetailViewProps> = ({ page, onBack, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Retour à la liste
            </button>
            <a
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir la page
            </a>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{page.name}</h2>
          <p className="text-gray-600 mt-1">{page.path}</p>
        </div>

        <div className="p-6">
          <PageContentManager />
        </div>
      </div>
    </div>
  );
};

export default UnifiedPageBannerManager;
