import React from 'react';
import { Utensils, Clock, Euro, FileText, Users, Car } from 'lucide-react';

interface RestaurantFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const RestaurantFields: React.FC<RestaurantFieldsProps> = ({
  formData,
  onChange
}) => {
  const cuisineTypes = [
    'Française', 'Belge', 'Italienne', 'Asiatique', 
    'Méditerranéenne', 'Brasserie', 'Gastronomique', 'Bistrot'
  ];

  return (
    <div className="space-y-6">
      {/* Type de cuisine */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Utensils className="h-4 w-4 inline mr-1" />
          Type de cuisine
        </label>
        <select
          value={formData.cuisine_type || ''}
          onChange={(e) => onChange('cuisine_type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          {cuisineTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Horaires d'ouverture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="h-4 w-4 inline mr-1" />
          Horaires d'ouverture
        </label>
        <textarea
          value={formData.opening_hours || ''}
          onChange={(e) => onChange('opening_hours', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Lun-Ven: 12h-14h, 18h-22h&#10;Sam-Dim: 12h-22h&#10;Fermé le mardi"
        />
      </div>

      {/* Gamme de prix et capacité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="h-4 w-4 inline mr-1" />
            Gamme de prix
          </label>
          <select
            value={formData.price_range || ''}
            onChange={(e) => onChange('price_range', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            <option value="€">€ - Économique</option>
            <option value="€€">€€ - Moyen</option>
            <option value="€€€">€€€ - Élevé</option>
            <option value="€€€€">€€€€ - Très élevé</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Capacité (couverts)
          </label>
          <input
            type="number"
            min="0"
            value={formData.capacity || ''}
            onChange={(e) => onChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>
      </div>

      {/* Spécialités */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Spécialités
        </label>
        <textarea
          value={formData.specialties || ''}
          onChange={(e) => onChange('specialties', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Décrivez les spécialités de la maison..."
        />
      </div>

      {/* Menu PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 inline mr-1" />
          Lien vers le menu (PDF)
        </label>
        <input
          type="url"
          value={formData.menu_pdf || ''}
          onChange={(e) => onChange('menu_pdf', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/menu.pdf"
        />
      </div>

      {/* Terrasse et Parking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.has_terrace || false}
              onChange={(e) => onChange('has_terrace', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Terrasse disponible
            </span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.has_parking || false}
              onChange={(e) => onChange('has_parking', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              <Car className="h-4 w-4 inline mr-1" />
              Parking disponible
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFields;
