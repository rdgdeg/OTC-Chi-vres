import React from 'react';
import { Calendar, Clock, Euro, Users, Link as LinkIcon, Tag } from 'lucide-react';

interface EventFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const EventFields: React.FC<EventFieldsProps> = ({
  formData,
  onChange
}) => {
  const eventCategories = [
    'Concert', 'Festival', 'Exposition', 'Théâtre', 'Conférence',
    'Marché', 'Fête locale', 'Sport', 'Atelier', 'Visite guidée'
  ];

  return (
    <div className="space-y-6">
      {/* Dates et horaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date et heure de début *
          </label>
          <input
            type="datetime-local"
            value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
            onChange={(e) => onChange('start_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date et heure de fin
          </label>
          <input
            type="datetime-local"
            value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
            onChange={(e) => onChange('end_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Horaires spécifiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Heure de début
          </label>
          <input
            type="time"
            value={formData.start_time || ''}
            onChange={(e) => onChange('start_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Heure de fin
          </label>
          <input
            type="time"
            value={formData.end_time || ''}
            onChange={(e) => onChange('end_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lieu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lieu de l'événement *
        </label>
        <input
          type="text"
          value={formData.location || formData.address || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Salle des fêtes, Place du village..."
        />
      </div>

      {/* Catégorie d'événement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 inline mr-1" />
          Catégorie d'événement
        </label>
        <select
          value={formData.event_category || ''}
          onChange={(e) => onChange('event_category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          {eventCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Organisateur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4 inline mr-1" />
          Organisateur
        </label>
        <input
          type="text"
          value={formData.organizer || ''}
          onChange={(e) => onChange('organizer', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Nom de l'organisateur ou de l'association"
        />
      </div>

      {/* Prix d'entrée */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Euro className="h-4 w-4 inline mr-1" />
          Prix d'entrée
        </label>
        <input
          type="text"
          value={formData.entry_price || formData.price || ''}
          onChange={(e) => onChange('entry_price', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Gratuit, 5€, 10€ (réduit 7€)..."
        />
      </div>

      {/* Lien de réservation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <LinkIcon className="h-4 w-4 inline mr-1" />
          Lien de réservation / billetterie
        </label>
        <input
          type="url"
          value={formData.booking_link || ''}
          onChange={(e) => onChange('booking_link', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://www.billetterie.com/event"
        />
      </div>

      {/* Capacité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4 inline mr-1" />
          Capacité (nombre de places)
        </label>
        <input
          type="number"
          min="0"
          value={formData.capacity || ''}
          onChange={(e) => onChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="100"
        />
      </div>

      {/* Informations pratiques */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations pratiques
        </label>
        <textarea
          value={formData.practical_info || ''}
          onChange={(e) => onChange('practical_info', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Parking disponible, restauration sur place, accessible PMR..."
        />
      </div>
    </div>
  );
};

export default EventFields;
