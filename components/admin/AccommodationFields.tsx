import React from 'react';
import { MapPin, Users, Bed, Clock, Plus, Trash2, Upload, Facebook } from 'lucide-react';

interface AccommodationFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  newFeature: string;
  setNewFeature: (value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  newAmenity: string;
  setNewAmenity: (value: string) => void;
  addAmenity: () => void;
  removeAmenity: (index: number) => void;
  newRule: string;
  setNewRule: (value: string) => void;
  addRule: () => void;
  removeRule: (index: number) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingImage: boolean;
}

const AccommodationFields: React.FC<AccommodationFieldsProps> = ({
  formData,
  onChange,
  newFeature,
  setNewFeature,
  addFeature,
  removeFeature,
  newAmenity,
  setNewAmenity,
  addAmenity,
  removeAmenity,
  newRule,
  setNewRule,
  addRule,
  removeRule,
  handleImageUpload,
  uploadingImage
}) => {
  const accommodationTypes = {
    bed_breakfast: 'Bed & Breakfast',
    gite: 'Gîte',
    hotel: 'Hôtel',
    camping: 'Camping',
    unusual: 'Hébergement insolite'
  };

  const villages = [
    'Chièvres', 'Ladeuze', 'Vaudignies', 'Tongre-Saint-Martin', 
    'Tongre-Notre-Dame', 'Grosage', 'Huissignies', 'Bailleul'
  ];

  const currentAmenities = Array.isArray(formData.amenities) 
    ? formData.amenities 
    : formData.amenities ? [formData.amenities] : [];

  return (
    <div className="space-y-6">
      {/* SECTION PRINCIPALE */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">
          Informations principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Types multiples */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-2">
              Types d'hébergement (sélection multiple)
            </label>
            <div className="space-y-2">
              {Object.entries(accommodationTypes).map(([key, label]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.type) 
                      ? formData.type.includes(key)
                      : formData.type === key
                    }
                    onChange={(e) => {
                      const currentTypes = Array.isArray(formData.type) 
                        ? formData.type 
                        : formData.type ? [formData.type] : [];
                      
                      let newTypes;
                      if (e.target.checked) {
                        newTypes = [...currentTypes, key];
                      } else {
                        newTypes = currentTypes.filter(t => t !== key);
                      }
                      
                      onChange('type', newTypes);
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-2">
              Village
            </label>
            <select
              value={formData.village || ''}
              onChange={(e) => onChange('village', e.target.value)}
              className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              {villages.map(village => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
          </div>

          {/* Capacité */}
          <div>
            <label className="block text-sm font-bold text-blue-800 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Capacité (personnes)
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity || 2}
              onChange={(e) => onChange('capacity', parseInt(e.target.value))}
              className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Détails hébergement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bed className="h-4 w-4 inline mr-1" />
            Nombre de chambres
          </label>
          <input
            type="number"
            min="0"
            value={formData.bedrooms || ''}
            onChange={(e) => onChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description des lits
          </label>
          <input
            type="text"
            value={formData.beds_description || ''}
            onChange={(e) => onChange('beds_description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 2 lits doubles"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Séjour minimum (nuits)
          </label>
          <input
            type="number"
            min="1"
            value={formData.min_stay || 1}
            onChange={(e) => onChange('min_stay', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tarifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gamme de prix
          </label>
          <input
            type="text"
            value={formData.price_range || ''}
            onChange={(e) => onChange('price_range', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="80-120€/nuit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détails des tarifs
          </label>
          <input
            type="text"
            value={formData.price_details || ''}
            onChange={(e) => onChange('price_details', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Petit-déjeuner inclus"
          />
        </div>
      </div>

      {/* Horaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Heure d'arrivée
          </label>
          <input
            type="text"
            value={formData.check_in_time || ''}
            onChange={(e) => onChange('check_in_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="15h00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Heure de départ
          </label>
          <input
            type="text"
            value={formData.check_out_time || ''}
            onChange={(e) => onChange('check_out_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="11h00"
          />
        </div>
      </div>

      {/* Image principale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image principale
        </label>
        <div className="flex items-center space-x-4">
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt="Image principale"
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="featured-image-upload"
            />
            <label
              htmlFor="featured-image-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingImage ? 'Upload...' : 'Choisir une image'}
            </label>
          </div>
        </div>
      </div>

      {/* Caractéristiques */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ce que vous aimerez
        </label>
        <div className="space-y-2">
          {formData.features?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(formData.features || [])];
                  newFeatures[index] = e.target.value;
                  onChange('features', newFeatures);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeFeature(index)}
                className="p-2 text-red-600 hover:text-red-800"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ajouter une caractéristique..."
            />
            <button
              onClick={addFeature}
              className="p-2 text-blue-600 hover:text-blue-800"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Équipements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Équipements
        </label>
        <div className="space-y-2">
          {currentAmenities.map((amenity: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => {
                  const newAmenities = [...currentAmenities];
                  newAmenities[index] = e.target.value;
                  onChange('amenities', newAmenities);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeAmenity(index)}
                className="p-2 text-red-600 hover:text-red-800"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ajouter un équipement..."
            />
            <button
              onClick={addAmenity}
              className="p-2 text-blue-600 hover:text-blue-800"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Règles de la maison */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Règles de la maison
        </label>
        <div className="space-y-2">
          {formData.house_rules?.map((rule: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => {
                  const newRules = [...(formData.house_rules || [])];
                  newRules[index] = e.target.value;
                  onChange('house_rules', newRules);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeRule(index)}
                className="p-2 text-red-600 hover:text-red-800"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ajouter une règle..."
            />
            <button
              onClick={addRule}
              className="p-2 text-blue-600 hover:text-blue-800"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Facebook */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Facebook className="h-4 w-4 inline mr-1" />
          Facebook
        </label>
        <input
          type="url"
          value={formData.facebook || ''}
          onChange={(e) => onChange('facebook', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://www.facebook.com/page"
        />
      </div>

      {/* Politique d'annulation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Politique d'annulation
        </label>
        <textarea
          value={formData.cancellation_policy || ''}
          onChange={(e) => onChange('cancellation_policy', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Conditions d'annulation..."
        />
      </div>
    </div>
  );
};

export default AccommodationFields;