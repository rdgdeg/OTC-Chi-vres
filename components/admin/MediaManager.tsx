import React, { useState, useEffect } from 'react';
import { 
  Upload, Search, Filter, Grid, List, Folder, 
  Image as ImageIcon, File, Trash2, Edit, Eye,
  Plus, X, Check, AlertCircle, Download
} from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  thumbnail_url?: string;
  folder: string;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

export const MediaManager: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);

  // Charger les médias
  useEffect(() => {
    loadMedia();
    loadFolders();
  }, [currentFolder, searchQuery]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      // TODO: Implémenter le chargement des médias
      const mockData: MediaItem[] = [
        {
          id: '1',
          filename: 'hero-image.jpg',
          original_name: 'hero-image.jpg',
          mime_type: 'image/jpeg',
          size: 1024000,
          width: 1920,
          height: 1080,
          url: '/images/hero-image.jpg',
          thumbnail_url: '/images/hero-image-thumb.jpg',
          folder: 'homepage',
          alt_text: 'Image hero',
          created_at: new Date().toISOString()
        }
      ];
      setItems(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      // TODO: Implémenter le chargement des dossiers
      setFolders(['homepage', 'accommodations', 'places', 'events', 'articles']);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
    }
  };

  // Filtrer les médias
  const filteredItems = items.filter(item => {
    const matchesFolder = currentFolder === 'all' || item.folder === currentFolder;
    const matchesSearch = !searchQuery || 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFolder && matchesSearch;
  });

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtenir l'icône du type de fichier
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return ImageIcon;
    }
    return File;
  };

  // Sélectionner/désélectionner un élément
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Sélectionner tout
  const selectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length 
        ? [] 
        : filteredItems.map(item => item.id)
    );
  };

  // Supprimer les éléments sélectionnés
  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedItems.length} élément(s) ?`)) {
      return;
    }

    try {
      // TODO: Implémenter la suppression
      console.log('Suppression des éléments:', selectedItems);
      setSelectedItems([]);
      await loadMedia();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Rendu en grille
  const renderGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredItems.map(item => {
        const FileIcon = getFileIcon(item.mime_type);
        const isSelected = selectedItems.includes(item.id);
        
        return (
          <div
            key={item.id}
            className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleSelection(item.id)}
          >
            <div className="aspect-square p-2">
              {item.mime_type.startsWith('image/') ? (
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.alt_text || item.filename}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <FileIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-900 truncate">
                {item.original_name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </p>
              {item.width && item.height && (
                <p className="text-xs text-gray-500">
                  {item.width} × {item.height}
                </p>
              )}
            </div>
            
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Rendu en liste
  const renderList = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={selectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Fichier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Taille
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Dossier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredItems.map(item => {
            const FileIcon = getFileIcon(item.mime_type);
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <tr key={item.id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(item.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {item.mime_type.startsWith('image/') ? (
                      <img
                        src={item.thumbnail_url || item.url}
                        alt={item.alt_text || item.filename}
                        className="h-10 w-10 object-cover rounded mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <FileIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.original_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.filename}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.mime_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatFileSize(item.size)}
                  {item.width && item.height && (
                    <div className="text-xs text-gray-400">
                      {item.width} × {item.height}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.folder}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.url, '_blank');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Ouvrir l'éditeur
                      }}
                      className="text-gray-600 hover:text-gray-800"
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <a
                      href={item.url}
                      download={item.original_name}
                      className="text-green-600 hover:text-green-800"
                      title="Télécharger"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Médiathèque</h2>
          <p className="text-gray-600">Gérez vos images et fichiers</p>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Uploader
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les dossiers</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
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
      </div>

      {/* Actions en masse */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} fichier{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun fichier trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || currentFolder !== 'all' 
              ? 'Aucun résultat ne correspond à vos critères.'
              : 'Vous n\'avez pas encore uploadé de fichiers.'
            }
          </p>
          {!searchQuery && currentFolder === 'all' && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Uploader vos premiers fichiers
            </button>
          )}
        </div>
      ) : (
        viewMode === 'grid' ? renderGrid() : renderList()
      )}

      {/* Modal d'upload */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploader des fichiers
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                >
                  Sélectionner des fichiers
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};