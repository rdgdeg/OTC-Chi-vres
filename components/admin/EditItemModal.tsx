import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, MapPin, Phone, Mail, Globe, Calendar, Upload, Plus, Trash2, Facebook, Users, Bed, Clock, Info } from 'lucide-react';
import { ContentItem } from '../../services/admin/CategoryContentService';
import { supabase } from '../../services/supabaseClient';
import AccommodationFields from './AccommodationFields';
import RestaurantFields from './RestaurantFields';
import HeritageFields from './HeritageFields';
import WalkFields from './WalkFields';
import EventFields from './EventFields';

// Interface étendue pour le formulaire avec tous les champs possibles
interface ExtendedContentItem extends ContentItem {
  // Champs de base
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  excerpt?: string;
  slug?: string;
  lat?: number;
  lng?: number;
  featured_image?: string;
  gallery_images?: string[];
  tag_ids?: string[];
  meta_title?: string;
  meta_description?: string;
  
  // Hébergements
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
  
  // Événements
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_category?: string;
  organizer?: string;
  entry_price?: string;
  booking_link?: string;
  practical_info?: string;
  
  // Balades
  distance?: string;
  duration?: string;
  difficulty?: string;
  walk_type?: string;
  elevation?: string;
  starting_point?: string;
  gpx_file?: string;
  pdf_document?: string;
  accessibility?: string;
  points_of_interest?: string;
  
  // Restaurants
  cuisine_type?: string;
  opening_hours?: string;
  specialties?: string;
  menu_pdf?: string;
  has_terrace?: boolean;
  has_parking?: boolean;
  
  // Patrimoine/Musées
  price_adult?: string;
  price_child?: string;
  price_group?: string;
  visit_duration?: string;
  historical_period?: string;
  languages?: string[];
  guided_tours?: boolean;
  accessible_pmr?: boolean;
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

      const updateData: any = {
        name: formData.name,
        description: formData.description,
        excerpt: formData.excerpt,
        slug: formData.slug,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        facebook: formData.facebook,
        status: formData.status,
        lat: formData.lat,
        lng: formData.lng,
        featured_image: formData.featured_image,
        gallery_images: formData.gallery_images,
        updated_at: new Date().toISOString()
      };

      // Ajouter des champs spécifiques selon le type
      if (tableName === 'accommodations') {
        Object.assign(updateData, {
          type: formData.type,
          village: formData.village,
          capacity: formData.capacity,
          bedrooms: formData.bedrooms,
          beds_description: formData.beds_description,
          min_stay: formData.min_stay,
          price_range: formData.price_range,
          price_details: formData.price_details,
          check_in_time: formData.check_in_time,
          check_out_time: formData.check_out_time,
          amenities: formData.amenities,
          features: formData.features,
          house_rules: formData.house_rules,
          cancellation_policy: formData.cancellation_policy
        });
      } else if (tableName === 'events') {
        Object.assign(updateData, {
          start_date: formData.start_date,
          end_date: formData.end_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location,
          event_category: formData.event_category,
          organizer: formData.organizer,
          entry_price: formData.entry_price,
          booking_link: formData.booking_link,
          capacity: formData.capacity,
          practical_info: formData.practical_info
        });
      } else if (item.type === 'walk') {
        Object.assign(updateData, {
          distance: formData.distance,
          duration: formData.duration,
          difficulty: formData.difficulty,
          walk_type: formData.walk_type,
          elevation: formData.elevation,
          starting_point: formData.starting_point,
          gpx_file: formData.gpx_file,
          pdf_document: formData.pdf_document,
          accessibility: formData.accessibility,
          points_of_interest: formData.points_of_interest
        });
      } else if (item.type === 'restaurant' || item.type === 'cafe') {
        Object.assign(updateData, {
          cuisine_type: formData.cuisine_type,
          opening_hours: formData.opening_hours,
          price_range: formData.price_range,
          specialties: formData.specialties,
          menu_pdf: formData.menu_pdf,
          capacity: formData.capacity,
          has_terrace: formData.has_terrace,
          has_parking: formData.has_parking
        });
      } else if (item.type === 'museum' || item.type === 'heritage') {
        Object.assign(updateData, {
          opening_hours: formData.opening_hours,
          price_adult: formData.price_adult,
          price_child: formData.price_child,
          price_group: formData.price_group,
          visit_duration: formData.visit_duration,
          historical_period: formData.historical_period,
          languages: formData.languages,
          guided_tours: formData.guided_tours,
          accessible_pmr: formData.accessible_pmr,
          practical_info: formData.practical_info
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

        {/* Images */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
          
          {/* Image principale */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Image principale
            </label>
            <div className="flex items-center space-x-4">
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt="Image principale"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
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
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG ou GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Galerie d'images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galerie d'images
            </label>
            <div className="space-y-2">
              {formData.gallery_images?.map((imageUrl: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <img
                    src={imageUrl}
                    alt={`Galerie ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      const newGallery = [...(formData.gallery_images || [])];
                      newGallery[index] = e.target.value;
                      handleInputChange('gallery_images', newGallery);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de l'image"
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
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
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="URL de l'image à ajouter..."
                />
                <button
                  onClick={addGalleryImage}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Ajoutez des URLs d'images ou uploadez-les vers Supabase Storage
              </p>
            </div>
          </div>
        </div>

        {/* Champs spécifiques selon le type */}
        {renderSpecificFields()}
      </div>
    );
  };

  const renderSpecificFields = () => {
    // Hébergements
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

    // Événements
    if (categoryId === 'events') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations événement</h3>
          <EventFields
            formData={formData}
            onChange={handleInputChange}
          />
        </div>
      );
    }

    // Balades
    if (item?.type === 'walk' || categoryId === 'walks') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations balade</h3>
          <WalkFields
            formData={formData}
            onChange={handleInputChange}
          />
        </div>
      );
    }

    // Restaurants / Cafés
    if (item?.type === 'restaurant' || item?.type === 'cafe' || categoryId === 'restaurants' || categoryId === 'dining') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations restaurant</h3>
          <RestaurantFields
            formData={formData}
            onChange={handleInputChange}
          />
        </div>
      );
    }

    // Patrimoine / Musées
    if (item?.type === 'museum' || item?.type === 'heritage' || categoryId === 'museums' || categoryId === 'heritage') {
      return (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations patrimoine / musée</h3>
          <HeritageFields
            formData={formData}
            onChange={handleInputChange}
          />
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