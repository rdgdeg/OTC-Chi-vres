import React from 'react';
import { Clock, Euro, Users, Languages, Calendar, Accessibility } from 'lucide-react';

interface HeritageFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const HeritageFields: React.FC<HeritageFieldsProps> = ({
  formData,
  onChange
}) => {
  const historicalPeriods = [
    'Préhistoire', 'Antiquité', 'Moyen Âge', 'Renaissance', 
    'Époque moderne', 'XIXe siècle', 'XXe siècle', 'Contemporain'
  ];

  const availableLanguages = [
    'Français', 'Néerlandais', 'Anglais', 'Allemand', 'Espagnol'
  ];

  return (
    <div className="space-y-6">
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
          placeholder="Lun-Ven: 9h-17h&#10;Sam-Dim: 10h-18h&#10;Fermé le mardi"
        />
      </div>

      {/* Tarifs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="h-4 w-4 inline mr-1" />
            Tarif adulte
          </label>
          <input
            type="text"
            value={formData.price_adult || ''}
            onChange={(e) => onChange('price_adult', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="5€"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tarif enfant
          </label>
          <input
            type="text"
            value={formData.price_child || ''}
            onChange={(e) => onChange('price_child', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="3€"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tarif groupe
          </label>
          <input
            type="text"
            value={formData.price_group || ''}
            onChange={(e) => onChange('price_group', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="4€/pers"
          />
        </div>
      </div>

      {/* Durée de visite */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="h-4 w-4 inline mr-1" />
          Durée de visite estimée
        </label>
        <input
          type="text"
          value={formData.visit_duration || ''}
          onChange={(e) => onChange('visit_duration', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="1h30"
        />
      </div>

      {/* Période historique */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Période historique
        </label>
        <select
          value={formData.historical_period || ''}
          onChange={(e) => onChange('historical_period', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          {historicalPeriods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>

      {/* Langues disponibles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="h-4 w-4 inline mr-1" />
          Langues disponibles
        </label>
        <div className="space-y-2">
          {availableLanguages.map(lang => (
            <label key={lang} className="flex items-center">
              <input
                type="checkbox"
                checked={Array.isArray(formData.languages) && formData.languages.includes(lang)}
                onChange={(e) => {
                  const currentLangs = Array.isArray(formData.languages) ? formData.languages : [];
                  let newLangs;
                  if (e.target.checked) {
                    newLangs = [...currentLangs, lang];
                  } else {
                    newLangs = currentLangs.filter(l => l !== lang);
                  }
                  onChange('languages', newLangs);
                }}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visites guidées */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.guided_tours || false}
            onChange={(e) => onChange('guided_tours', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            <Users className="h-4 w-4 inline mr-1" />
            Visites guidées disponibles
          </span>
        </label>
      </div>

      {/* Accessibilité PMR */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.accessible_pmr || false}
            onChange={(e) => onChange('accessible_pmr', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            <Accessibility className="h-4 w-4 inline mr-1" />
            Accessible PMR (Personnes à Mobilité Réduite)
          </span>
        </label>
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
          placeholder="Parking gratuit, boutique de souvenirs, café sur place..."
        />
      </div>
    </div>
  );
};

export default HeritageFields;
