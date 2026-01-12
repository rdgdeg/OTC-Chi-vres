import React, { useState, useEffect } from 'react';
import { 
  Edit3, Save, X, Eye, Settings, Image, 
  FileText, Globe, MapPin, Calendar, Users, 
  Utensils, BedIcon as Bed, ShoppingBag, Mail,
  Mountain, Camera, BookOpen, Newspaper
} from 'lucide-react';
import EditableImage from './EditableImage';
import { usePageContent, PageContent } from '../contexts/PageContentContext';

const PageContentManager: React.FC = () => {
  const { getAllPages, updatePageContent } = usePageContent();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPages(getAllPages());
  }, [getAllPages]);

  const savePage = (updatedPage: PageContent) => {
    updatePageContent(updatedPage.id, updatedPage);
    setPages(getAllPages());
    setSelectedPage(updatedPage);
    setIsEditing(false);
  };

  const getPageIcon = (pageId: string) => {
    const icons: Record<string, React.ReactNode> = {
      home: <Globe className="h-5 w-5" />,
      museums: <Camera className="h-5 w-5" />,
      accommodations: <Bed className="h-5 w-5" />,
      dining: <Utensils className="h-5 w-5" />,
      merchants: <ShoppingBag className="h-5 w-5" />,
      walks: <Mountain className="h-5 w-5" />,
      experiences: <Users className="h-5 w-5" />,
      agenda: <Calendar className="h-5 w-5" />,
      blog: <BookOpen className="h-5 w-5" />,
      shop: <ShoppingBag className="h-5 w-5" />,
      contact: <Mail className="h-5 w-5" />,
      team: <Users className="h-5 w-5" />,
      crossage: <MapPin className="h-5 w-5" />,
      bulletin: <Newspaper className="h-5 w-5" />
    };
    return icons[pageId] || <FileText className="h-5 w-5" />;
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Pages</h1>
          <p className="text-gray-600 mt-1">
            Modifiez le contenu et les images de toutes les pages du site
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Rechercher une page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des pages */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Pages du site ({filteredPages.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPage?.id === page.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {getPageIcon(page.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {page.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {page.path}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Éditeur de page */}
        <div className="lg:col-span-2">
          {selectedPage ? (
            <PageEditor
              page={selectedPage}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={savePage}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une page
              </h3>
              <p className="text-gray-600">
                Choisissez une page dans la liste pour modifier son contenu et ses images.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PageEditorProps {
  page: PageContent;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (page: PageContent) => void;
  onCancel: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  page,
  isEditing,
  onEdit,
  onSave,
  onCancel
}) => {
  const [editedPage, setEditedPage] = useState<PageContent>(page);

  useEffect(() => {
    setEditedPage(page);
  }, [page]);

  const handleSave = () => {
    onSave(editedPage);
  };

  const handleImageUpdate = async (newUrl: string) => {
    setEditedPage(prev => ({ ...prev, heroImage: newUrl }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{page.name}</h2>
          <p className="text-sm text-gray-500">{page.path}</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <a
                href={page.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir la page
              </a>
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Image de bannière */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="h-4 w-4 inline mr-1" />
            Image de bannière
          </label>
          {isEditing ? (
            <EditableImage
              src={editedPage.heroImage || 'https://picsum.photos/1920/600?grayscale'}
              alt={`Bannière ${page.name}`}
              onImageUpdate={handleImageUpdate}
              folder="banners"
              className="w-full h-48 rounded-lg"
            />
          ) : (
            <img
              src={page.heroImage || 'https://picsum.photos/1920/600?grayscale'}
              alt={`Bannière ${page.name}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Titre principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedPage.title}
              onChange={(e) => setEditedPage(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-2xl font-bold text-gray-900">{page.title}</div>
          )}
        </div>

        {/* Sous-titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedPage.subtitle || ''}
              onChange={(e) => setEditedPage(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-lg text-gray-600">{page.subtitle}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={editedPage.description || ''}
              onChange={(e) => setEditedPage(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-gray-700">{page.description}</div>
          )}
        </div>

        {/* SEO */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre SEO
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPage.metaTitle || ''}
                  onChange={(e) => setEditedPage(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">{page.metaTitle}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description SEO
              </label>
              {isEditing ? (
                <textarea
                  value={editedPage.metaDescription || ''}
                  onChange={(e) => setEditedPage(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="text-gray-700">{page.metaDescription}</div>
              )}
            </div>
          </div>
        </div>

        {/* Informations */}
        {page.lastModified && (
          <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
            Dernière modification : {new Date(page.lastModified).toLocaleString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContentManager;