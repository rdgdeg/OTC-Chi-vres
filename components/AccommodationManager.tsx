import React, { useState, useEffect } from 'react';
import { Accommodation } from '../types';
import { AccommodationService } from '../services/accommodationService';
import AccommodationEditor from './AccommodationEditor';
import { 
  Plus, Edit3, Trash2, Eye, EyeOff, Search, Filter, 
  Users, MapPin, Phone, Mail, Globe, Facebook,
  Calendar, MoreVertical, ExternalLink, BedIcon as Bed
} from 'lucide-react';

const AccommodationManager: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const accommodationTypes = {
    bed_breakfast: 'Bed & Breakfast',
    gite: 'Gîte',
    hotel: 'Hôtel',
    camping: 'Camping',
    unusual: 'Hébergement insolite'
  };

  const statusLabels = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé'
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    loadAccommodations();
  }, []);

  useEffect(() => {
    filterAccommodations();
  }, [accommodations, searchTerm, statusFilter, typeFilter]);

  const loadAccommodations = async () => {
    setLoading(true);
    try {
      const data = await AccommodationService.getAllAccommodations();
      setAccommodations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des hébergements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAccommodations = () => {
    let filtered = [...accommodations];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.village?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(acc => acc.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(acc => acc.type === typeFilter);
    }

    setFilteredAccommodations(filtered);
  };

  const handleCreate = () => {
    setEditingAccommodation(undefined);
    setShowEditor(true);
  };

  const handleEdit = (accommodationId: string) => {
    setEditingAccommodation(accommodationId);
    setShowEditor(true);
  };

  const handleSave = (accommodation: Accommodation) => {
    setShowEditor(false);
    setEditingAccommodation(undefined);
    loadAccommodations();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingAccommodation(undefined);
  };

  const handleDelete = async (accommodationId: string) => {
    try {
      await AccommodationService.deleteAccommodation(accommodationId);
      setDeleteConfirm(null);
      loadAccommodations();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleToggleStatus = async (accommodation: Accommodation) => {
    try {
      const newStatus = accommodation.status === 'published' ? 'draft' : 'published';
      await AccommodationService.updateAccommodation(accommodation.id, { status: newStatus });
      loadAccommodations();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  if (showEditor) {
    return (
      <AccommodationEditor
        accommodationId={editingAccommodation}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hébergements</h1>
          <p className="text-gray-600 mt-1">
            Gérez les hébergements de Chièvres et ses villages
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvel hébergement
        </button>
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
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            {Object.entries(accommodationTypes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

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
            {accommodations.length}
          </div>
          <div className="text-sm text-gray-600">Total hébergements</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {accommodations.filter(a => a.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">Publiés</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {accommodations.filter(a => a.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">Brouillons</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-purple-600">
            {accommodations.reduce((sum, a) => sum + (a.view_count || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Vues totales</div>
        </div>
      </div>

      {/* Liste des hébergements */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAccommodations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun hébergement trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Aucun hébergement ne correspond à vos critères.'
              : 'Commencez par créer votre premier hébergement.'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un hébergement
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hébergement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
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
                {filteredAccommodations.map((accommodation) => (
                  <tr key={accommodation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {accommodation.featured_image && (
                          <img
                            src={accommodation.featured_image}
                            alt={accommodation.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {accommodation.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {accommodation.excerpt || accommodation.description.substring(0, 60) + '...'}
                          </div>
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            ID: {accommodation.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {accommodationTypes[accommodation.type]}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {accommodation.capacity} personnes
                      </div>
                      {accommodation.bedrooms && (
                        <div className="text-xs text-gray-400 flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          {accommodation.bedrooms} chambres
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{accommodation.address}</div>
                          {accommodation.village && (
                            <div className="text-xs text-gray-500 mt-1">
                              📍 {accommodation.village}
                            </div>
                          )}
                          {(accommodation.lat && accommodation.lng) ? (
                            <div className="text-xs text-green-600 mt-1">
                              🗺️ GPS: {accommodation.lat.toFixed(4)}, {accommodation.lng.toFixed(4)}
                            </div>
                          ) : (
                            <div className="text-xs text-orange-500 mt-1">
                              🗺️ GPS: Coordonnées par défaut
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {accommodation.phone && (
                          <a
                            href={`tel:${accommodation.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                            title={accommodation.phone}
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                        {accommodation.email && (
                          <a
                            href={`mailto:${accommodation.email}`}
                            className="text-blue-600 hover:text-blue-800"
                            title={accommodation.email}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {accommodation.website && (
                          <a
                            href={accommodation.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Site web"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                        {accommodation.facebook && (
                          <a
                            href={accommodation.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[accommodation.status]}`}>
                        {statusLabels[accommodation.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {accommodation.view_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {accommodation.status === 'published' && (
                          <a
                            href={`/hebergements/${accommodation.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Voir sur le site"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        
                        <button
                          onClick={() => handleToggleStatus(accommodation)}
                          className={`${
                            accommodation.status === 'published'
                              ? 'text-orange-600 hover:text-orange-800'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={accommodation.status === 'published' ? 'Dépublier' : 'Publier'}
                        >
                          {accommodation.status === 'published' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(accommodation.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(accommodation.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet hébergement ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationManager;