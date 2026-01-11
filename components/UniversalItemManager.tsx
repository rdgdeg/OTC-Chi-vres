import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AccommodationService } from '../services/accommodationService';
import AccommodationEditor from './AccommodationEditor';
import { 
  Eye, EyeOff, Edit3, Trash2, Plus, Search, Filter, 
  MoreVertical, ExternalLink, AlertTriangle, Check, X,
  MapPin, Users, Calendar, Star, Phone, Mail, Globe
} from 'lucide-react';

interface ItemType {
  id: string;
  name: string;
  title?: string;
  description?: string;
  excerpt?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'published' | 'draft' | 'archived';
  imageUrl?: string;
  featured_image?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  village?: string;
  category?: string;
  date?: string;
  price?: number;
  rating?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface UniversalItemManagerProps {
  itemType: 'museums' | 'restaurants' | 'accommodation' | 'merchants' | 'walks' | 'experiences' | 'events' | 'articles' | 'products';
  title: string;
  description?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canToggleStatus?: boolean;
}

const UniversalItemManager: React.FC<UniversalItemManagerProps> = ({
  itemType,
  title,
  description,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  canToggleStatus = true
}) => {
  const { 
    museums, restaurants, accommodation, merchants, walks, 
    experiences, events, articles, products,
    updateItem, deleteItem, isLoading 
  } = useData();

  const [items, setItems] = useState<ItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [accommodations, setAccommodations] = useState<ItemType[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | undefined>();

  // Mapping des données selon le type
  const getItemsData = () => {
    switch (itemType) {
      case 'museums': return museums;
      case 'restaurants': return restaurants;
      case 'accommodation': return accommodations; // Utilise les hébergements de Supabase
      case 'merchants': return merchants;
      case 'walks': return walks;
      case 'experiences': return experiences;
      case 'events': return events;
      case 'articles': return articles;
      case 'products': return products;
      default: return [];
    }
  };

  // Charger les données spécifiques aux hébergements
  const loadAccommodations = async () => {
    if (itemType === 'accommodation') {
      try {
        const data = await AccommodationService.getAllAccommodations();
        setAccommodations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des hébergements:', error);
      }
    }
  };

  useEffect(() => {
    loadAccommodations();
  }, [itemType]);

  useEffect(() => {
    const data = getItemsData();
    setItems(data);
  }, [museums, restaurants, accommodation, merchants, walks, experiences, events, articles, products, accommodations]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, statusFilter, typeFilter]);

  const filterItems = () => {
    let filtered = [...items];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.name || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.village || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const status = item.status || 'active';
        return status === statusFilter;
      });
    }

    // Filtre par type/catégorie
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => {
        const type = item.type || item.category || '';
        return type === typeFilter;
      });
    }

    setFilteredItems(filtered);
  };

  const getUniqueTypes = () => {
    const types = items
      .map(item => item.type || item.category)
      .filter(Boolean)
      .filter((type, index, arr) => arr.indexOf(type) === index)
      .sort();
    return types;
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      default: return 'Actif';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleToggleStatus = async (item: ItemType) => {
    try {
      let newStatus: string;
      const currentStatus = item.status || 'active';

      // Logique de basculement selon le type d'élément
      if (['published', 'draft', 'archived'].includes(currentStatus)) {
        newStatus = currentStatus === 'published' ? 'draft' : 'published';
      } else {
        newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      }

      if (itemType === 'accommodation') {
        await AccommodationService.updateAccommodation(item.id, { status: newStatus as any });
        await loadAccommodations();
      } else {
        await updateItem(itemType.slice(0, -1), { ...item, status: newStatus });
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      if (itemType === 'accommodation') {
        await AccommodationService.deleteAccommodation(itemId);
        await loadAccommodations();
      } else {
        await deleteItem(itemType.slice(0, -1), itemId);
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getItemImage = (item: ItemType) => {
    return item.featured_image || item.imageUrl || 'https://via.placeholder.com/150x100?text=No+Image';
  };

  const getItemTitle = (item: ItemType) => {
    return item.name || item.title || 'Sans titre';
  };

  const handleEdit = (itemId: string) => {
    if (itemType === 'accommodation') {
      // Pour les hébergements, utiliser l'éditeur spécialisé
      setEditingItemId(itemId);
      setShowEditor(true);
    } else {
      // Pour les autres types, rediriger vers l'éditeur approprié ou afficher un message
      console.log(`Édition de ${itemType} ${itemId} - À implémenter`);
      alert(`Édition de ${itemType} - Fonctionnalité à venir`);
    }
  };

  const handleSaveEdit = (item: any) => {
    setShowEditor(false);
    setEditingItemId(undefined);
    // Recharger les données
    if (itemType === 'accommodation') {
      loadAccommodations();
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingItemId(undefined);
  };

  const getItemDescription = (item: ItemType) => {
    return item.excerpt || item.description || 'Aucune description';
  };

  // Si on est en mode édition d'hébergement, afficher l'éditeur
  if (showEditor && itemType === 'accommodation') {
    return (
      <AccommodationEditor
        accommodationId={editingItemId}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {canCreate && (
          <button
            onClick={() => {/* TODO: Implémenter la création */}}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>

          {getUniqueTypes().length > 0 && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-5 w-5 inline mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {items.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {items.filter(i => ['active', 'published'].includes(i.status || 'active')).length}
          </div>
          <div className="text-sm text-gray-600">Actifs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {items.filter(i => ['inactive', 'draft'].includes(i.status || '')).length}
          </div>
          <div className="text-sm text-gray-600">Inactifs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-600">
            {items.filter(i => i.status === 'archived').length}
          </div>
          <div className="text-sm text-gray-600">Archivés</div>
        </div>
      </div>

      {/* Liste des éléments */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun élément trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Aucun élément ne correspond à vos critères.'
              : 'Aucun élément disponible.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élément
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type/Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistiques
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
                      <div className="flex items-center">
                        <img
                          src={getItemImage(item)}
                          alt={getItemTitle(item)}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getItemTitle(item)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getItemDescription(item).substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.type || item.category || 'Non défini'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.address && (
                          <div className="flex items-center mb-1">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {item.village || item.address}
                          </div>
                        )}
                        {item.capacity && (
                          <div className="flex items-center mb-1">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {item.capacity} personnes
                          </div>
                        )}
                        {item.date && (
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        )}
                        {item.price && (
                          <div className="text-green-600 font-medium">
                            {item.price}€
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.rating && (
                          <div className="flex items-center mb-1">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            {item.rating}/5
                          </div>
                        )}
                        {item.view_count !== undefined && (
                          <div className="text-gray-500">
                            {item.view_count} vues
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {canToggleStatus && (
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`${
                              ['active', 'published'].includes(item.status || 'active')
                                ? 'text-orange-600 hover:text-orange-800'
                                : 'text-green-600 hover:text-green-800'
                            }`}
                            title={['active', 'published'].includes(item.status || 'active') ? 'Désactiver' : 'Activer'}
                          >
                            {['active', 'published'].includes(item.status || 'active') ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                        {/* Liens externes */}
                        {item.website && (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800"
                            title="Site web"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalItemManager;