import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, MapPin, Phone, Mail, Globe, Calendar, Upload, Plus, Trash2, Facebook, Users, Bed, Clock, Info } from 'lucide-react';
import { ContentItem } from '../../services/admin/CategoryContentService';
import { supabase } from '../../services/supabaseClient';
import AccommodationFields from './AccommodationFields';

// Interface étendue pour le formulaire avec tous les champs possibles
interface ExtendedContentItem extends ContentItem {
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  price_range?: string;
  price_details?: string;
  amenities?: string[] | string;
  features?: string[];
  capacity?: number;
  bedrooms?: number;
  beds_description?: string;
  village?: string;
  check_in_time?: string;
  check_out_time?: string;
  house_rules?: string[];
  cancellation_policy?: string;
  min_stay?: number;
  start_date?: string;
  end_date?: string;
  location?: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  lat?: number;
  lng?: number;
  featured_image?: string;
  gallery_images?: string[];
  excerpt?: string;
  slug?: string;
  tag_ids?: string[];
  meta_title?: string;
  meta_description?: string;
}

interface EditItemModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: ContentItem) => void;
  categoryId: string;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  categoryId
}) => {
  const [formData, setFormData] = useState<Partial<ExtendedContentItem>>({});
  const [loading, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // États pour les listes dynamiques
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!item?.id) return;
    
    setSaving(true);
    try {
      // Déterminer la table à utiliser selon le type
      let tableName = 'places';
      if (categoryId === 'accommodations') {
        tableName = 'accommodations';
      } else if (categoryId === 'events') {
        tableName = 'events';
      } else if (item.type === 'walk') {
        tableName = 'places';
      }

      const updateData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      // Ajouter des champs spécifiques selon le type
      if (tableName === 'accommodations') {
        Object.assign(updateData, {
          price_range: formData.price_range,
          amenities: formData.amenities,
          capacity: formData.capacity
        });
      } else if (tableName === 'events') {
        Object.assign(updateData, {
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location
        });
      } else if (item.type === 'walk') {
        Object.assign(updateData, {
          distance: formData.distance,
          duration: formData.duration,
          difficulty: formData.difficulty
        });
      }

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', item.id);

      if (error) throw error;

      // Mettre à jour l'item avec les nouvelles données
      const updatedItem = { ...item, ...updateData };
      onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Fonctions pour gérer les listes dynamiques
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      const currentAmenities = Array.isArray(formData.amenities) 
        ? formData.amenities 
        : formData.amenities ? [formData.amenities] : [];
      setFormData(prev => ({
        ...prev,
        amenities: [...currentAmenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = Array.isArray(formData.amenities) 
      ? formData.amenities 
      : formData.amenities ? [formData.amenities] : [];
    setFormData(prev => ({
      ...prev,
      amenities: currentAmenities.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        house_rules: [...(prev.house_rules || []), newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      house_rules: prev.house_rules?.filter((_, i) => i !== index) || []
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Pour l'instant, on utilise une URL temporaire
      // TODO: Implémenter l'upload vers Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          featured_image: result
        }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
      setUploadingImage(false);
    }
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images?.filter((_, i) => i !== index) || []
    }));
  };

  const renderFormFields = () => {
    return (
      <div className="space-y-6">
        {/* Champs de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status || 'published'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description courte (excerpt)
          </label>
          <textarea
            value={formData.excerpt || ''}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description courte pour les listes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="mon-hebergement"
          />
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Adresse
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Site web
            </label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Facebook className="inline h-4 w-4 mr-1" />
              Facebook
            </label>
            <input
              type="url"
              value={formData.facebook || ''}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.facebook.com/page"
            />
          </div>
        </div>

        {/* Coordonnées GPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Latitude (GPS)
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.lat || ''}
              onChange={(e) => handleInputChange('lat', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.5897"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Longitude (GPS)
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.lng || ''}
              onChange={(e) => handleInputChange('lng', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.8014"
            />
          </div>
        </div>

        {/* Champs spécifiques selon le type */}
        {renderSpecificFields()}
      </div>
    );
  };

  const renderSpecificFields = () => {
    if (categoryId === 'accommodations') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations hébergement</h3>
          <AccommodationFields
            formData={formData}
            onChange={handleInputChange}
            newFeature={newFeature}
            setNewFeature={setNewFeature}
            addFeature={addFeature}
            removeFeature={removeFeature}
            newAmenity={newAmenity}
            setNewAmenity={setNewAmenity}
            addAmenity={addAmenity}
            removeAmenity={removeAmenity}
            newRule={newRule}
            setNewRule={setNewRule}
            addRule={addRule}
            removeRule={removeRule}
            handleImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
          />
        </div>
      );
    }

    if (categoryId === 'events') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations événement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de début
              </label>
              <input
                type="datetime-local"
                value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="datetime-local"
                value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      );
    }

    if (item?.type === 'walk') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations balade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance
              </label>
              <input
                type="text"
                value={formData.distance || ''}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                placeholder="5 km"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée
              </label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="2h30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                value={formData.difficulty || ''}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Non spécifié</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderPreview = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{formData.name}</h2>
          <p className="text-gray-600 mb-4">{formData.description}</p>
          
          {formData.address && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              {formData.address}
            </div>
          )}
          
          {formData.phone && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Phone className="h-4 w-4 mr-2" />
              {formData.phone}
            </div>
          )}
          
          {formData.email && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              {formData.email}
            </div>
          )}
          
          {formData.website && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Globe className="h-4 w-4 mr-2" />
              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {formData.website}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Modifier : {item.name}
            </h2>
            <p className="text-sm text-gray-600">
              Type: {item.type} • ID: {item.id}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {previewMode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {previewMode ? 'Édition' : 'Aperçu'}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {previewMode ? renderPreview() : renderFormFields()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;