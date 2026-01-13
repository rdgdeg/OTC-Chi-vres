import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Filter, Edit, Trash2, Eye, Copy,
  MapPin, Clock, Users, Mail, Phone, Globe, Tag, 
  Save, X, AlertCircle, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { eventService, Event, EventFilters } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';

interface EventManagerProps {
  onEventSelect?: (event: Event) => void;
}

export const EventManager: React.FC<EventManagerProps> = ({ onEventSelect }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Formulaire
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    excerpt: '',
    start_date: '',
    end_date: '',
    is_all_day: false,
    location: '',
    category: 'culture',
    event_type: 'public',
    price_text: '',
    price_amount: 0,
    registration_required: false,
    registration_url: '',
    contact_email: '',
    contact_phone: '',
    max_attendees: undefined,
    status: 'draft'
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const categories = [
    { value: 'folklore', label: 'Folklore' },
    { value: 'culture', label: 'Culture' },
    { value: 'sport', label: 'Sport' },
    { value: 'marché', label: 'Marché' },
    { value: 'conference', label: 'Conférence' },
    { value: 'festival', label: 'Festival' }
  ];

  const eventTypes = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Privé' },
    { value: 'members_only', label: 'Membres uniquement' }
  ];

  const statuses = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'archived', label: 'Archivé' }
  ];

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents({
        ...filters,
        search: searchQuery,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined
      });
      setEvents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setErrors(['Erreur lors du chargement des événements']);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchQuery,
      category: selectedCategory || undefined,
      status: selectedStatus || undefined
    });
  };

  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      excerpt: '',
      start_date: '',
      end_date: '',
      is_all_day: false,
      location: '',
      category: 'culture',
      event_type: 'public',
      price_text: '',
      price_amount: 0,
      registration_required: false,
      registration_url: '',
      contact_email: '',
      contact_phone: '',
      max_attendees: undefined,
      status: 'draft'
    });
    setSelectedEvent(null);
    setIsEditing(true);
    setShowForm(true);
    setErrors([]);
    setSuccess('');
  };

  const handleEditEvent = (event: Event) => {
    setFormData(event);
    setSelectedEvent(event);
    setIsEditing(true);
    setShowForm(true);
    setErrors([]);
    setSuccess('');
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setShowForm(true);
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const handleSaveEvent = async () => {
    try {
      setErrors([]);
      
      // Validation
      const validation = eventService.validateEvent(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      if (selectedEvent) {
        // Mise à jour
        await eventService.updateEvent(selectedEvent.id, {
          ...formData,
          updated_by: user?.id
        });
        setSuccess('Événement mis à jour avec succès');
      } else {
        // Création
        await eventService.createEvent({
          ...formData as Omit<Event, 'id' | 'created_at' | 'updated_at'>,
          created_by: user?.id,
          updated_by: user?.id
        });
        setSuccess('Événement créé avec succès');
      }

      await loadEvents();
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors(['Erreur lors de la sauvegarde de l\'événement']);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      return;
    }

    try {
      await eventService.deleteEvent(event.id);
      setSuccess('Événement supprimé avec succès');
      await loadEvents();
      if (selectedEvent?.id === event.id) {
        setShowForm(false);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErrors(['Erreur lors de la suppression de l\'événement']);
    }
  };

  const handleDuplicateEvent = async (event: Event) => {
    try {
      await eventService.duplicateEvent(event.id);
      setSuccess('Événement dupliqué avec succès');
      await loadEvents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      setErrors(['Erreur lors de la duplication de l\'événement']);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      folklore: 'bg-purple-100 text-purple-800',
      culture: 'bg-blue-100 text-blue-800',
      sport: 'bg-green-100 text-green-800',
      marché: 'bg-yellow-100 text-yellow-800',
      conference: 'bg-gray-100 text-gray-800',
      festival: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des événements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreurs détectées</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Événements</h2>
          <p className="text-gray-600">Gérez l'agenda et les manifestations</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Événement
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Titre, description, lieu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Événements ({events.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                      {categories.find(c => c.value === event.category)?.label}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {statuses.find(s => s.value === event.status)?.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    {event.price_text && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {event.price_text}
                      </div>
                    )}
                  </div>

                  {event.excerpt && (
                    <p className="text-gray-600 text-sm mb-3">{event.excerpt}</p>
                  )}

                  {expandedEvent === event.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {event.contact_email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:underline">
                              {event.contact_email}
                            </a>
                          </div>
                        )}
                        
                        {event.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`tel:${event.contact_phone}`} className="text-blue-600 hover:underline">
                              {event.contact_phone}
                            </a>
                          </div>
                        )}
                        
                        {event.registration_url && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Inscription en ligne
                            </a>
                          </div>
                        )}
                        
                        {event.max_attendees && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            Max {event.max_attendees} participants
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={expandedEvent === event.id ? "Réduire" : "Développer"}
                  >
                    {expandedEvent === event.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleViewEvent(event)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Voir"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDuplicateEvent(event)}
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="Dupliquer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEvent(event)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun événement trouvé</p>
              <button
                onClick={handleCreateEvent}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Créer le premier événement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {isEditing ? (selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement') : 'Détails de l\'événement'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Titre de l'événement"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu *
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Lieu de l'événement"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description courte
                    </label>
                    <textarea
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description courte pour l'aperçu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description complète *
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description détaillée de l'événement"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.start_date || ''}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.end_date || ''}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_all_day"
                        checked={formData.is_all_day || false}
                        onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_all_day" className="ml-2 text-sm text-gray-700">
                        Toute la journée
                      </label>
                    </div>
                  </div>

                  {/* Catégorie et type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        value={formData.category || 'culture'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'événement
                      </label>
                      <select
                        value={formData.event_type || 'public'}
                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={formData.status || 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (texte)
                      </label>
                      <input
                        type="text"
                        value={formData.price_text || ''}
                        onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Gratuit, 15€, Sur donation..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (montant)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_amount || ''}
                        onChange={(e) => setFormData({ ...formData, price_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Inscription */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="registration_required"
                        checked={formData.registration_required || false}
                        onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="registration_required" className="ml-2 text-sm text-gray-700">
                        Inscription obligatoire
                      </label>
                    </div>

                    {formData.registration_required && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL d'inscription
                          </label>
                          <input
                            type="url"
                            value={formData.registration_url || ''}
                            onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre max de participants
                          </label>
                          <input
                            type="number"
                            value={formData.max_attendees || ''}
                            onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Illimité"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        value={formData.contact_email || ''}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone de contact
                      </label>
                      <input
                        type="tel"
                        value={formData.contact_phone || ''}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+32 XX XX XX XX"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveEvent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {selectedEvent ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </div>
              ) : (
                // Vue lecture seule
                selectedEvent && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedEvent.category)}`}>
                        {categories.find(c => c.value === selectedEvent.category)?.label}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedEvent.status)}`}>
                        {statuses.find(s => s.value === selectedEvent.status)?.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Début: {formatDate(selectedEvent.start_date)}</span>
                          </div>
                          {selectedEvent.end_date && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Fin: {formatDate(selectedEvent.end_date)}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{selectedEvent.location}</span>
                          </div>
                          {selectedEvent.price_text && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{selectedEvent.price_text}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                        <div className="space-y-2 text-sm">
                          {selectedEvent.contact_email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`mailto:${selectedEvent.contact_email}`} className="text-blue-600 hover:underline">
                                {selectedEvent.contact_email}
                              </a>
                            </div>
                          )}
                          {selectedEvent.contact_phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${selectedEvent.contact_phone}`} className="text-blue-600 hover:underline">
                                {selectedEvent.contact_phone}
                              </a>
                            </div>
                          )}
                          {selectedEvent.registration_url && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={selectedEvent.registration_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Inscription en ligne
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedEvent.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleEditEvent(selectedEvent)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};