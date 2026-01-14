import React from 'react';
import { User, Mail, Phone, Briefcase, Award } from 'lucide-react';

interface TeamFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const TeamFields: React.FC<TeamFieldsProps> = ({
  formData,
  onChange
}) => {
  const roles = [
    'Directeur/Directrice',
    'Responsable',
    'Agent d\'accueil',
    'Guide',
    'Animateur/Animatrice',
    'Stagiaire',
    'Bénévole'
  ];

  return (
    <div className="space-y-6">
      {/* Fonction/Rôle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="h-4 w-4 inline mr-1" />
          Fonction / Rôle *
        </label>
        <select
          value={formData.role || formData.position || ''}
          onChange={(e) => onChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" />
            Email professionnel
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="prenom.nom@otc-chievres.be"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="+32 68 XX XX XX"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="h-4 w-4 inline mr-1" />
          Biographie / Présentation
        </label>
        <textarea
          value={formData.bio || formData.description || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Présentez brièvement le membre de l'équipe..."
        />
      </div>

      {/* Compétences / Spécialités */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Award className="h-4 w-4 inline mr-1" />
          Compétences / Spécialités
        </label>
        <textarea
          value={formData.skills || formData.specialties || ''}
          onChange={(e) => onChange('skills', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Langues parlées, domaines d'expertise..."
        />
      </div>

      {/* Ordre d'affichage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ordre d'affichage
        </label>
        <input
          type="number"
          min="0"
          value={formData.sort_order || formData.display_order || 0}
          onChange={(e) => onChange('sort_order', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Plus le nombre est petit, plus la personne apparaît en premier
        </p>
      </div>

      {/* Visible sur le site */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_visible !== false}
            onChange={(e) => onChange('is_visible', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Visible sur le site public
          </span>
        </label>
      </div>
    </div>
  );
};

export default TeamFields;
