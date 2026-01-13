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

  // Filtre par type - supporter les types multiples
  if (typeFilter !== 'all') {
    filtered = filtered.filter(acc => {
      if (Array.isArray(acc.type)) {
        return acc.type.includes(typeFilter);
      } else {
        // Compatibilité avec l'ancien format
        return acc.type === typeFilter;
      }
    });
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
        {/* Vue en cartes pour éviter le défilement horizontal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation) => (
            <div key={accommodation.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              {/* En-tête avec image et titre */}
              <div className="flex items-start space-x-4 mb-4">
                {accommodation.featured_image && (
                  <img
                    src={accommodation.featured_image}
                    alt={accommodation.name}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {accommodation.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {accommodation.excerpt || accommodation.description.substring(0, 100) + '...'}
                  </p>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    ID: {accommodation.id}
                  </div>
                </div>
                
                {/* Statut */}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[accommodation.status]}`}>
                  {statusLabels[accommodation.status]}
                </span>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {Array.isArray(accommodation.type) 
                      ? accommodation.type.map(t => accommodationTypes[t]).join(', ')
                      : accommodationTypes[accommodation.type] || accommodation.type
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    {accommodation.capacity} personnes
                    {accommodation.bedrooms && ` • ${accommodation.bedrooms} chambres`}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    Localisation
                  </div>
                  <div className="text-sm text-gray-600">
                    {accommodation.village || accommodation.address}
                  </div>
                </div>
              </div>

              {/* Contact et liens */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  {accommodation.phone && (
                    <a
                      href={`tel:${accommodation.phone}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title={accommodation.phone}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                  {accommodation.email && (
                    <a
                      href={`mailto:${accommodation.email}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
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
                      className="text-blue-600 hover:text-blue-800 p-1"
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
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {accommodation.view_count || 0} vues
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {accommodation.status === 'published' && (
                    <a
                      href={`/hebergements/${accommodation.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Voir sur le site"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  
                  <button
                    onClick={() => handleToggleStatus(accommodation)}
                    className={`p-1 ${
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
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(accommodation.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(accommodation.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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