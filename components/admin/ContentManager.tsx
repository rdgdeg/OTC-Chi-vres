import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, 
  Save, X, Check, AlertCircle, Calendar, MapPin,
  Image as ImageIcon, FileText, Tag, Globe, Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import des services unifiés
import { UnifiedContentService } from '../../services/admin/UnifiedContentService';
import { ContentEditor } from './ContentEditor';
import { BulkActionsPanel } from './BulkActionsPanel';
import { EventManager } from '../EventManager';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  excerpt?: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  view_count?: number;
  category?: string;
  tags?: string[];
}

interface ContentManagerProps {
  contentType: string;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ contentType }) => {
  const { user, hasPermission } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Configuration par type de contenu
  const contentConfig = {
    accommodations: {
      title: 'Hébergements',
      singular: 'hébergement',
      fields: ['name', 'type', 'village', 'capacity', 'status'],
      canCreate: hasPermission('accommodations:create'),
      canEdit: hasPermission('accommodations:update'),
      canDelete: hasPermission('accommodations:delete')
    },
    places: {
      title: 'Lieux & Patrimoine',
      singular: 'lieu',
      fields: ['name', 'type', 'address', 'status'],
      canCreate: hasPermission('places:create'),
      canEdit: hasPermission('places:update'),
      canDelete: hasPermission('places:delete')
    },
    walks: {
      title: 'Balades & Randonnées',
      singular: 'balade',
      fields: ['name', 'difficulty', 'duration', 'distance', 'status'],
      canCreate: hasPermission('walks:create'),
      canEdit: hasPermission('walks:update'),
      canDelete: hasPermission('walks:delete')
    },
    experiences: {
      title: 'Expériences',
      singular: 'expérience',
      fields: ['title', 'category', 'duration', 'price_text', 'status'],
      canCreate: hasPermission('experiences:create'),
      canEdit: hasPermission('experiences:update'),
      canDelete: hasPermission('experiences:delete')
    },
    events: {
      title: 'Événements',
      singular: 'événement',
      fields: ['title', 'start_date', 'end_date', 'location', 'status'],
      canCreate: hasPermission('events:create'),
      canEdit: hasPermission('events:update'),
      canDelete: hasPermission('events:delete')
    },
    articles: {
      title: 'Articles & Blog',
      singular: 'article',
      fields: ['title', 'category', 'published_at', 'view_count', 'status'],
      canCreate: hasPermission('articles:create'),
      canEdit: hasPermission('articles:update'),
      canDelete: hasPermission('articles:delete')
    },
    products: {
      title: 'Produits',
      singular: 'produit',
      fields: ['name', 'price', 'stock_quantity', 'category', 'status'],
      canCreate: hasPermission('products:create'),
      canEdit: hasPermission('products:update'),
      canDelete: hasPermission('products:delete')
    },
    pages: {
      title: 'Pages Dynamiques',
      singular: 'page',
      fields: ['title', 'slug', 'updated_at', 'status'],
      canCreate: hasPermission('pages:create'),
      canEdit: hasPermission('pages:update'),
      canDelete: hasPermission('pages:delete')
    }
  };

  const config = contentConfig[contentType as keyof typeof contentConfig];

  // Charger les éléments
  useEffect(() => {
    loadItems();
  }, [contentType, statusFilter, searchQuery]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        type: contentType,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined
      };

      const data = await UnifiedContentService.getItems(filters);
      setItems(data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel élément
  const handleCreate = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  // Éditer un élément
  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  // Supprimer un élément
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      await UnifiedContentService.deleteItem(contentType, id);
      await loadItems();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression');
    }
  };

  // Changer le statut
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await UnifiedContentService.updateItem(contentType, id, { status: newStatus });
      await loadItems();
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  // Sauvegarder depuis l'éditeur
  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await UnifiedContentService.updateItem(contentType, editingItem.id, data);
      } else {
        await UnifiedContentService.createItem(contentType, data);
      }
      
      setShowEditor(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  // Sélection d'éléments
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === items.length 
        ? [] 
        : items.map(item => item.id)
    );
  };

  // Actions en masse
  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    try {
      await UnifiedContentService.bulkAction(contentType, selectedItems, action);
      setSelectedItems([]);
      await loadItems();
    } catch (err) {
      console.error('Erreur lors de l\'action en masse:', err);
      setError('Erreur lors de l\'action en masse');
    }
  };

  // Filtrer les éléments
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Rendu de la table
  const renderTable = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modifié
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {item.featured_image && (
                    <img
                      src={item.featured_image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    {item.excerpt && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.excerpt}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={!config?.canEdit}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(item.updated_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {config?.canEdit && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {config?.canDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Rendu de la grille
  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {item.featured_image && (
            <img
              src={item.featured_image}
              alt=""
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'published' ? 'bg-green-100 text-green-800' :
                item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'published' ? 'Publié' :
                 item.status === 'draft' ? 'Brouillon' : 'Archivé'}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {item.title}
            </h3>
            
            {item.excerpt && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(item.updated_at).toLocaleDateString('fr-FR')}
              </span>
              
              <div className="flex items-center space-x-2">
                {config?.canEdit && (
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                {config?.canDelete && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!config) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Type de contenu non supporté
        </h3>
        <p className="text-gray-600">
          Le type de contenu "{contentType}" n'est pas encore configuré.
        </p>
      </div>
    );
  }

  // Utiliser le gestionnaire spécialisé pour les événements
  if (contentType === 'events') {
    return <EventManager />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          <p className="text-gray-600">
            Gérez vos {config.title.toLowerCase()}
          </p>
        </div>
        
        {config.canCreate && (
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau {config.singular}
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>

          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedItems.length > 0 && (
        <BulkActionsPanel
          selectedCount={selectedItems.length}
          onAction={handleBulkAction}
          onClear={() => setSelectedItems([])}
        />
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
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
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun {config.singular} trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'Aucun résultat ne correspond à vos critères de recherche.'
              : `Vous n'avez pas encore créé de ${config.singular}.`
            }
          </p>
          {config.canCreate && !searchQuery && statusFilter === 'all' && (
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Créer votre premier {config.singular}
            </button>
          )}
        </div>
      ) : (
        viewMode === 'table' ? renderTable() : renderGrid()
      )}

      {/* Éditeur */}
      {showEditor && (
        <ContentEditor
          contentType={contentType}
          item={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};