import React from 'react';
import { Footprints, Mountain, Download, FileText, MapPin, Clock } from 'lucide-react';

interface WalkFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const WalkFields: React.FC<WalkFieldsProps> = ({
  formData,
  onChange
}) => {
  const walkTypes = ['Boucle', 'Linéaire', 'Aller-retour'];
  const difficultyLevels = ['Facile', 'Moyen', 'Difficile'];

  return (
    <div className="space-y-6">
      {/* Caractéristiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Footprints className="h-4 w-4 inline mr-1" />
            Distance *
          </label>
          <input
            type="text"
            value={formData.distance || ''}
            onChange={(e) => onChange('distance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="5 km"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Durée estimée *
          </label>
          <input
            type="text"
            value={formData.duration || ''}
            onChange={(e) => onChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="1h30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mountain className="h-4 w-4 inline mr-1" />
            Difficulté *
          </label>
          <select
            value={formData.difficulty || 'Facile'}
            onChange={(e) => onChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {difficultyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Type de balade et dénivelé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de balade
          </label>
          <select
            value={formData.walk_type || ''}
            onChange={(e) => onChange('walk_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            {walkTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dénivelé
          </label>
          <input
            type="text"
            value={formData.elevation || ''}
            onChange={(e) => onChange('elevation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="150m"
          />
        </div>
      </div>

      {/* Point de départ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 inline mr-1" />
          Point de départ
        </label>
        <input
          type="text"
          value={formData.starting_point || formData.address || ''}
          onChange={(e) => onChange('starting_point', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Parking de l'église, Place du village..."
        />
      </div>

      {/* Fichier GPX */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Download className="h-4 w-4 inline mr-1" />
          Fichier GPX (tracé GPS)
        </label>
        <input
          type="url"
          value={formData.gpx_file || formData.downloadUrl || ''}
          onChange={(e) => onChange('gpx_file', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/trace.gpx"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL du fichier GPX téléchargeable pour GPS
        </p>
      </div>

      {/* Document PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 inline mr-1" />
          Document PDF (fiche descriptive)
        </label>
        <input
          type="url"
          value={formData.pdf_document || formData.documentUrl || ''}
          onChange={(e) => onChange('pdf_document', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/fiche-balade.pdf"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL du document PDF avec la description complète
        </p>
      </div>

      {/* Accessibilité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accessibilité
        </label>
        <textarea
          value={formData.accessibility || ''}
          onChange={(e) => onChange('accessibility', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Accessible poussettes, PMR, vélos..."
        />
      </div>

      {/* Points d'intérêt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Points d'intérêt
        </label>
        <textarea
          value={formData.points_of_interest || ''}
          onChange={(e) => onChange('points_of_interest', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Église romane, moulin à eau, panorama sur la vallée..."
        />
      </div>
    </div>
  );
};

export default WalkFields;
