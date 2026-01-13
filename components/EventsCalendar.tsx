import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Tag, Users, Mail, Phone, Globe,
  ChevronLeft, ChevronRight, Filter, Search, X
} from 'lucide-react';
import { eventService, Event } from '../services/eventService';

interface EventsCalendarProps {
  limit?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  compact?: boolean;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  limit,
  showFilters = true,
  showSearch = true,
  compact = false
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'folklore', label: 'Folklore' },
    { value: 'culture', label: 'Culture' },
    { value: 'sport', label: 'Sport' },
    { value: 'marché', label: 'Marché' },
    { value: 'conference', label: 'Conférence' },
    { value: 'festival', label: 'Festival' }
  ];

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, searchQuery, currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        dateRange: {
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString()
        }
      };

      const data = await eventService.getPublicEvents(limit);
      setEvents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      folklore: 'bg-purple-100 text-purple-800 border-purple-200',
      culture: 'bg-blue-100 text-blue-800 border-blue-200',
      sport: 'bg-green-100 text-green-800 border-green-200',
      marché: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      conference: 'bg-gray-100 text-gray-800 border-gray-200',
      festival: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isEventToday = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.start_date);
    return eventDate.toDateString() === today.toDateString();
  };

  const isEventUpcoming = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.start_date);
    return eventDate > today;
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(isEventUpcoming);
  const todayEvents = filteredEvents.filter(isEventToday);

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
      {/* Header */}
      {!compact && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Agenda des Événements</h2>
          <p className="text-gray-600">Découvrez les prochains événements à Chièvres</p>
        </div>
      )}

      {/* Filtres et recherche */}
      {(showFilters || showSearch) && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {showSearch && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {showFilters && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Événements d'aujourd'hui */}
      {todayEvents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Aujourd'hui ({todayEvents.length})
          </h3>
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-4 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                        {categories.find(c => c.value === event.category)?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.is_all_day ? 'Toute la journée' : formatTime(event.start_date)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des événements à venir */}
      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Événements à venir ({upcomingEvents.length})
            </h3>
            
            <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                    compact ? 'p-4' : 'p-6'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.featured_image && !compact && (
                    <img
                      src={event.featured_image}
                      alt={event.title}
                      className="w-full h-48 object-cover mb-4 rounded-lg"
                    />
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-lg'}`}>
                        {event.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)} flex-shrink-0 ml-2`}>
                        {categories.find(c => c.value === event.category)?.label}
                      </span>
                    </div>

                    <div className={`space-y-2 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{formatDate(event.start_date)}</span>
                        {!event.is_all_day && (
                          <span className="ml-2">à {formatTime(event.start_date)}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      {event.price_text && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{event.price_text}</span>
                        </div>
                      )}
                    </div>

                    {event.excerpt && !compact && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun événement à venir
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory 
                ? 'Aucun événement ne correspond à vos critères de recherche.'
                : 'Aucun événement n\'est programmé pour le moment.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de détail d'événement */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(selectedEvent.category)}`}>
                      {categories.find(c => c.value === selectedEvent.category)?.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{formatDate(selectedEvent.start_date)}</span>
                      {!selectedEvent.is_all_day && (
                        <span className="ml-2">à {formatTime(selectedEvent.start_date)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {selectedEvent.featured_image && (
                <img
                  src={selectedEvent.featured_image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>

                {(selectedEvent.price_text || selectedEvent.registration_required) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informations pratiques</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.price_text && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Prix: {selectedEvent.price_text}</span>
                        </div>
                      )}
                      
                      {selectedEvent.registration_required && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Inscription obligatoire</span>
                        </div>
                      )}
                      
                      {selectedEvent.max_attendees && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Limité à {selectedEvent.max_attendees} participants</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(selectedEvent.contact_email || selectedEvent.contact_phone || selectedEvent.registration_url) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.contact_email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={`mailto:${selectedEvent.contact_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedEvent.contact_email}
                          </a>
                        </div>
                      )}
                      
                      {selectedEvent.contact_phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={`tel:${selectedEvent.contact_phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedEvent.contact_phone}
                          </a>
                        </div>
                      )}
                      
                      {selectedEvent.registration_url && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={selectedEvent.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Inscription en ligne
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};