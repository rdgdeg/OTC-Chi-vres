import React, { useState, useEffect } from 'react';
import { 
  Save, X, Eye, Image as ImageIcon, MapPin, Calendar,
  Clock, DollarSign, Users, Star, Tag, Globe, FileText,
  Upload, Trash2, Plus, AlertCircle
} from 'lucide-react';
import { ContentItem } from '../../services/admin/UnifiedContentService';

interface ContentEditorProps {
  contentType: string;
  item?: ContentItem | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'datetime' | 'email' | 'url' | 'image' | 'gallery' | 'tags' | 'wysiwyg';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  contentType,
  item,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Configuration des champs par type de contenu
  const getFieldsConfig = (type: string): FormField[] => {
    const commonFields: FormField[] = [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'URL conviviale (généré automatiquement si vide)' },
      { name: 'excerpt', label: 'Résumé', type: 'textarea', placeholder: 'Description courte...' },
      { name: 'description', label: 'Description', type: 'wysiwyg' },
      { name: 'featured_image', label: 'Image principale', type: 'image' },
      { name: 'gallery_images', label: 'Galerie', type: 'gallery' },
      { name: 'status', label: 'Statut', type: 'select', required: true, options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'published', label: 'Publié' },
        { value: 'archived', label: 'Archivé' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ];

    const specificFields: Record<string, FormField[]> = {
      accommodations: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'select', required: true, options: [
          { value: 'bed_breakfast', label: 'Chambre d\'hôte' },
          { value: 'gite', label: 'Gîte' },
          { value: 'hotel', label: 'Hôtel' },
          { value: 'camping', label: 'Camping' },
          { value: 'unusual', label: 'Hébergement insolite' }
        ]},
        { name: 'village', label: 'Village', type: 'text', required: true },
        { name: 'address', label: 'Adresse', type: 'text' },
        { name: 'capacity', label: 'Capacité', type: 'number' },
        { name: 'bedrooms', label: 'Chambres', type: 'number' },
        { name: 'phone', label: 'Téléphone', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'website', label: 'Site web', type: 'url' },
        { name: 'price_range', label: 'Gamme de prix', type: 'text' }
      ],
      places: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'type', label: 'Type', type: 'select', required: true, options: [
          { value: 'museum', label: 'Musée' },
          { value: 'restaurant', label: 'Restaurant' },
          { value: 'shop', label: 'Boutique' },
          { value: 'cafe', label: 'Café' },
          { value: 'producer', label: 'Producteur' }
        ]},
        { name: 'address', label: 'Adresse', type: 'text', required: true },
        { name: 'phone', label: 'Téléphone', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'website', label: 'Site web', type: 'url' },
        { name: 'openingHours', label: 'Horaires', type: 'textarea' },
        { name: 'price_range', label: 'Gamme de prix', type: 'text' }
      ],
      walks: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'difficulty', label: 'Difficulté', type: 'select', options: [
          { value: 'Facile', label: 'Facile' },
          { value: 'Moyen', label: 'Moyen' },
          { value: 'Difficile', label: 'Difficile' }
        ]},
        { name: 'distance', label: 'Distance', type: 'text' },
        { name: 'duration', label: 'Durée', type: 'text' },
        { name: 'address', label: 'Point de départ', type: 'text' }
      ],
      experiences: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: [
          { value: 'adulte', label: 'Adulte' },
          { value: 'enfant', label: 'Enfant' },
          { value: 'famille', label: 'Famille' },
          { value: 'teambuilding', label: 'Team building' }
        ]},
        { name: 'duration', label: 'Durée', type: 'text' },
        { name: 'price_text', label: 'Prix', type: 'text' },
        { name: 'max_participants', label: 'Participants max', type: 'number' },
        { name: 'min_age', label: 'Âge minimum', type: 'number' }
      ],
      events: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'start_date', label: 'Date de début', type: 'datetime', required: true },
        { name: 'end_date', label: 'Date de fin', type: 'datetime' },
        { name: 'location', label: 'Lieu', type: 'text' },
        { name: 'category', label: 'Catégorie', type: 'text' },
        { name: 'price_text', label: 'Prix', type: 'text' },
        { name: 'registration_required', label: 'Inscription requise', type: 'select', options: [
          { value: 'true', label: 'Oui' },
          { value: 'false', label: 'Non' }
        ]},
        { name: 'contact_email', label: 'Email de contact', type: 'email' },
        { name: 'contact_phone', label: 'Téléphone de contact', type: 'text' }
      ],
      articles: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'content', label: 'Contenu', type: 'wysiwyg', required: true },
        { name: 'category', label: 'Catégorie', type: 'text' },
        { name: 'published_at', label: 'Date de publication', type: 'datetime' }
      ],
      products: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'price', label: 'Prix', type: 'number', required: true },
        { name: 'compare_price', label: 'Prix barré', type: 'number' },
        { name: 'sku', label: 'SKU', type: 'text' },
        { name: 'stock_quantity', label: 'Stock', type: 'number' },
        { name: 'weight', label: 'Poids (g)', type: 'number' },
        { name: 'category', label: 'Catégorie', type: 'text' }
      ],
      pages: [
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'hero_title', label: 'Titre hero', type: 'text' },
        { name: 'hero_subtitle', label: 'Sous-titre hero', type: 'text' },
        { name: 'hero_image', label: 'Image hero', type: 'image' },
        { name: 'intro_title', label: 'Titre introduction', type: 'text' },
        { name: 'intro_text', label: 'Texte introduction', type: 'textarea' }
      ]
    };

    // Fusionner les champs communs avec les champs spécifiques
    const fields = [...(specificFields[type] || [])];
    
    // Ajouter les champs communs qui ne sont pas déjà présents
    commonFields.forEach(commonField => {
      if (!fields.find(f => f.name === commonField.name)) {
        fields.push(commonField);
      }
    });

    return fields;
  };

  const fields = getFieldsConfig(contentType);

  // Initialiser le formulaire
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Valeurs par défaut
      const defaultData: any = {
        status: 'draft'
      };
      
      // Ajouter le type pour les balades
      if (contentType === 'walks') {
        defaultData.type = 'walk';
      }
      
      setFormData(defaultData);
    }
  }, [item, contentType]);

  // Gérer les changements de champs
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Supprimer l'erreur si le champ est maintenant valide
    if (errors[name] && value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rendu d'un champ
  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            className={baseClasses}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseClasses}
          />
        );
        
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'date':
        return (
          <input
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
          />
        );
        
      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
          />
        );
        
      case 'image':
        return (
          <div className="space-y-2">
            {value && (
              <img src={value} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg" />
            )}
            <input
              type="url"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder="URL de l'image"
              className={baseClasses}
            />
          </div>
        );
        
      case 'tags':
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => handleFieldChange(field.name, e.target.value.split(',').map(t => t.trim()))}
            placeholder="Tag1, Tag2, Tag3..."
            className={baseClasses}
          />
        );
        
      case 'wysiwyg':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={8}
            className={baseClasses}
          />
        );
        
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
          />
        );
    }
  };

  // Organiser les champs par onglets
  const contentFields = fields.filter(f => 
    ['title', 'name', 'slug', 'excerpt', 'description', 'content'].includes(f.name) ||
    f.type === 'wysiwyg'
  );
  
  const detailsFields = fields.filter(f => 
    !contentFields.includes(f) && 
    !['featured_image', 'gallery_images', 'status', 'tags'].includes(f.name)
  );
  
  const mediaFields = fields.filter(f => 
    ['featured_image', 'gallery_images'].includes(f.name)
  );
  
  const metaFields = fields.filter(f => 
    ['status', 'tags'].includes(f.name)
  );

  const tabs = [
    { id: 'content', label: 'Contenu', fields: contentFields },
    { id: 'details', label: 'Détails', fields: detailsFields },
    { id: 'media', label: 'Médias', fields: mediaFields },
    { id: 'meta', label: 'Métadonnées', fields: metaFields }
  ].filter(tab => tab.fields.length > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Modifier' : 'Créer'} - {contentType}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`space-y-6 ${activeTab === tab.id ? 'block' : 'hidden'}`}
            >
              {tab.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {field.help && (
                    <p className="mt-1 text-sm text-gray-500">{field.help}</p>
                  )}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};