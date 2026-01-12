import React, { useState, useEffect } from 'react';
import { X, Save, Upload, MapPin, Tag, Building, Landmark, Image as ImageIcon } from 'lucide-react';
import { Place } from '../types';

interface MuseumPatrimoineEditorProps {
  item?: Place | null;
  onSave: (item: Omit<Place, 'id'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type SubCategory = 'musee' | 'patrimoine';

const MuseumPatrimoineEditor: React.FC<MuseumPatrimoineEditorProps> = ({
  item,
  onSave,
  onCancel,
  isLoading = false
}) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    imageUrl: '',
    phone: '',
    email: '',
    website: '',
    openingHours: '',
    price: '',
    practicalInfo: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>('musee');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tags prédéfinis par sous-catégorie
  const predefinedTags = {
    musee: ['Musée', 'Culture', 'Histoire', 'Art', 'Exposition', 'Visite guidée'],
    patrimoine: ['Patrimoine', 'Architecture', 'Église', 'Chapelle', 'Monument', 'Histoire', 'Gothique', 'Pèlerinage']
  };

  // Initialiser le formulaire
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        address: item.address || '',
        imageUrl: item.imageUrl || '',
        phone: item.phone || '',
        email: item.email || '',
        website: item.website || '',
        openingHours: item.openingHours || '',
        price: item.price || '',
        practicalInfo: item.practicalInfo || '',
        lat: item.lat,
        lng: item.lng,
      });

      // Déterminer la sous-catégorie à partir des tags existants
      const hasMuseumTag = item.tags.some(tag => 
        tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
      );
      const hasPatrimoineTag = item.tags.some(tag => 
        tag.toLowerCase().includes('patrimoine') || 
        tag.toLowerCase().includes('église') || 
        tag.toLowerCase().includes('chapelle')
      );

      if (hasMuseumTag) {
        setSelectedSubCategory('musee');
      } else if (hasPatrimoineTag) {
        setSelectedSubCategory('patrimoine');
      }

      // Séparer les tags personnalisés des tags prédéfinis
      const allPredefined = [...predefinedTags.musee, ...predefinedTags.patrimoine];
      const custom = item.tags.filter(tag => !allPredefined.includes(tag));
      setCustomTags(custom);
    }
  }, [item]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'L\'image est obligatoire';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Construire les tags finaux
    const baseTags = selectedSubCategory === 'musee' 
      ? ['Musée', 'Culture'] 
      : ['Patrimoine', 'Architecture'];
    
    const finalTags = [...baseTags, ...customTags];

    const itemData = {
      ...formData,
      type: 'museum' as const,
      tags: finalTags,
      rating: item?.rating,
      galleryImages: item?.galleryImages || [],
      sort_order: item?.sort_order || 0,
    };

    if (item?.id) {
      itemData.id = item.id;
    }

    await onSave(itemData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Modifier' : 'Ajouter'} un lieu culturel
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection de sous-catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de lieu culturel
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedSubCategory('musee')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedSubCategory === 'musee'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Musée</div>
                    <div className="text-sm text-gray-500">
                      Musées, centres d'interprétation, expositions
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubCategory('patrimoine')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedSubCategory === 'patrimoine'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Landmark className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Patrimoine</div>
                    <div className="text-sm text-gray-500">
                      Églises, monuments, sites historiques
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du lieu *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Musée de la Vie Rurale"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Rue de la Culture, 7950 Chièvres"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Décrivez le lieu, son histoire, ses collections..."
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image principale *
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Upload d'image (à implémenter)"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            {errors.imageUrl && <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>}
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Aperçu"
                  className="w-32 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="lat"
                value={formData.lat || ''}
                onChange={(e) => handleInputChange('lat', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="50.5950"
              />
            </div>

            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="lng"
                value={formData.lng || ''}
                onChange={(e) => handleInputChange('lng', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="3.8050"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+32 68 XX XX XX"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="contact@musee.be"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.website ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://www.musee.be"
              />
              {errors.website && <p className="text-red-600 text-sm mt-1">{errors.website}</p>}
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-2">
                Horaires d'ouverture
              </label>
              <textarea
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => handleInputChange('openingHours', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Lun-Ven: 9h-17h&#10;Sam-Dim: 10h-18h"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Tarifs
              </label>
              <textarea
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Adulte: 5€&#10;Enfant: 3€&#10;Gratuit -12 ans"
              />
            </div>
          </div>

          {/* Informations pratiques supplémentaires */}
          <div>
            <label htmlFor="practicalInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Informations pratiques
            </label>
            <textarea
              id="practicalInfo"
              value={formData.practicalInfo}
              onChange={(e) => handleInputChange('practicalInfo', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Parking gratuit, accessible PMR, visite guidée sur demande..."
            />
          </div>

          {/* Tags personnalisés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags personnalisés
            </label>
            <div className="space-y-3">
              {/* Tags existants */}
              {customTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Ajouter un tag */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ajouter un tag personnalisé"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>

              {/* Tags suggérés */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Tags suggérés pour {selectedSubCategory === 'musee' ? 'les musées' : 'le patrimoine'} :</p>
                <div className="flex flex-wrap gap-1">
                  {predefinedTags[selectedSubCategory].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!customTags.includes(tag)) {
                          setCustomTags(prev => [...prev, tag]);
                        }
                      }}
                      disabled={customTags.includes(tag)}
                      className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Sauvegarde...' : item ? 'Modifier' : 'Ajouter'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MuseumPatrimoineEditor;