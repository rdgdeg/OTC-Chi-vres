import React, { useState, useEffect } from 'react';
import { Accommodation } from '../types';
import { AccommodationService } from '../services/accommodationService';
import { 
  Save, X, Plus, Trash2, Upload, MapPin, Phone, Mail, 
  Globe, Facebook, Users, BedIcon as Bed, Calendar, Clock, Info,
  Eye, EyeOff, Edit3
} from 'lucide-react';

interface AccommodationEditorProps {
  accommodationId?: string;
  onSave: (accommodation: Accommodation) => void;
  onCancel: () => void;
}

const AccommodationEditor: React.FC<AccommodationEditorProps> = ({
  accommodationId,
  onSave,
  onCancel
}) => {
  const [accommodation, setAccommodation] = useState<Partial<Accommodation>>({
    name: '',
    slug: '',
    description: '',
    excerpt: '',
    type: [], // Changé pour un tableau vide
    capacity: 2,
    bedrooms: 1,
    beds_description: '',
    address: '',
    village: '',
    phone: '',
    email: '',
    website: '',
    facebook: '',
    features: [],
    amenities: [],
    price_range: '',
    price_details: '',
    check_in_time: '',
    check_out_time: '',
    house_rules: [],
    cancellation_policy: '',
    min_stay: 1,
    status: 'draft',
    tag_ids: [],
    meta_title: '',
    meta_description: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

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

  useEffect(() => {
    if (accommodationId) {
      loadAccommodation();
    }
  }, [accommodationId]);

  useEffect(() => {
    // Générer le slug automatiquement
    if (accommodation.name && !accommodationId) {
      const slug = AccommodationService.generateSlug(accommodation.name);
      setAccommodation(prev => ({ ...prev, slug }));
    }
  }, [accommodation.name, accommodationId]);

  const loadAccommodation = async () => {
    if (!accommodationId) return;
    
    setLoading(true);
    try {
      const data = await AccommodationService.getAccommodationById(accommodationId);
      if (data) {
        setAccommodation(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'hébergement:', error);
      setErrors(['Erreur lors du chargement de l\'hébergement']);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors([]);

    try {
      // Validation
      const validationErrors = AccommodationService.validateAccommodation(accommodation);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setSaving(false);
        return;
      }

      let savedAccommodation: Accommodation;

      if (accommodationId) {
        // Mise à jour
        savedAccommodation = await AccommodationService.updateAccommodation(
          accommodationId,
          accommodation
        );
      } else {
        // Création
        savedAccommodation = await AccommodationService.createAccommodation(
          accommodation as Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>
        );
      }

      onSave(savedAccommodation);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Gestion spécifique de l'erreur RLS
      if (error?.code === 'PGRST116') {
        setErrors([
          '⚠️ Modifications sauvegardées localement uniquement',
          '💡 Pour sauvegarder en base de données, contactez l\'administrateur',
          '📄 Erreur technique: Politiques de sécurité Supabase (RLS) à configurer'
        ]);
      } else {
        setErrors(['Erreur lors de la sauvegarde de l\'hébergement']);
      }
    } finally {
      setSaving(false);
    }
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
        setAccommodation(prev => ({
          ...prev,
          featured_image: result
        }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setErrors(['Erreur lors de l\'upload de l\'image']);
      setUploadingImage(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setAccommodation(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setAccommodation(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAccommodation(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setAccommodation(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setAccommodation(prev => ({
        ...prev,
        house_rules: [...(prev.house_rules || []), newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setAccommodation(prev => ({
      ...prev,
      house_rules: prev.house_rules?.filter((_, i) => i !== index) || []
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {accommodationId ? 'Modifier l\'hébergement' : 'Nouvel hébergement'}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Erreurs */}
        {errors.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium mb-2">Erreurs de validation :</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* SECTION PRINCIPALE - Type, Localisation, Capacité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Informations principales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  Types d'hébergement * (sélection multiple)
                </label>
                <div className="space-y-2">
                  {Object.entries(accommodationTypes).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={Array.isArray(accommodation.type) 
                          ? accommodation.type.includes(key)
                          : accommodation.type === key
                        }
                        onChange={(e) => {
                          const currentTypes = Array.isArray(accommodation.type) 
                            ? accommodation.type 
                            : accommodation.type ? [accommodation.type] : [];
                          
                          let newTypes;
                          if (e.target.checked) {
                            newTypes = [...currentTypes, key];
                          } else {
                            newTypes = currentTypes.filter(t => t !== key);
                          }
                          
                          setAccommodation(prev => ({ ...prev, type: newTypes }));
                        }}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                {Array.isArray(accommodation.type) && accommodation.type.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    Sélectionnés: {accommodation.type.map(t => accommodationTypes[t]).join(', ')}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Localisation (Adresse) *
                </label>
                <input
                  type="text"
                  value={accommodation.address || ''}
                  onChange={(e) => setAccommodation(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  placeholder="Ex: Rue de Ladeuze, 1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-800 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Capacité (personnes) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={accommodation.capacity || 2}
                  onChange={(e) => setAccommodation(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-lg"
                />
              </div>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'hébergement *
              </label>
              <input
                type="text"
                value={accommodation.name || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: La Loge Bed & Breakfast"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={accommodation.slug || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="la-loge-bed-breakfast"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village
              </label>
              <select
                value={accommodation.village || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, village: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un village</option>
                {villages.map(village => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={accommodation.status || 'draft'}
                onChange={(e) => setAccommodation(prev => ({ ...prev, status: e.target.value as Accommodation['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description courte (excerpt)
            </label>
            <textarea
              value={accommodation.excerpt || ''}
              onChange={(e) => setAccommodation(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description courte pour les listes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description complète *
            </label>
            <textarea
              value={accommodation.description || ''}
              onChange={(e) => setAccommodation(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description détaillée de l'hébergement..."
            />
          </div>

          {/* Capacité et chambres détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="h-4 w-4 inline mr-1" />
                Nombre de chambres
              </label>
              <input
                type="number"
                min="0"
                value={accommodation.bedrooms || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, bedrooms: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Séjour minimum (nuits)
              </label>
              <input
                type="number"
                min="1"
                value={accommodation.min_stay || 1}
                onChange={(e) => setAccommodation(prev => ({ ...prev, min_stay: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description des lits
              </label>
              <input
                type="text"
                value={accommodation.beds_description || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, beds_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2 lits doubles, 1 lit superposé"
              />
            </div>
          </div>

          {/* Localisation détaillée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordonnées GPS - Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={accommodation.lat || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, lat: e.target.value ? parseFloat(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 50.5897 (optionnel pour la carte)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordonnées GPS - Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={accommodation.lng || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, lng: e.target.value ? parseFloat(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 3.8014 (optionnel pour la carte)"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={accommodation.phone || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0472 65 32 01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={accommodation.email || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@hebergement.be"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Site web
              </label>
              <input
                type="url"
                value={accommodation.website || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.hebergement.be"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="h-4 w-4 inline mr-1" />
                Facebook
              </label>
              <input
                type="url"
                value={accommodation.facebook || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, facebook: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.facebook.com/page"
              />
            </div>
          </div>

          {/* Tarifs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gamme de prix
              </label>
              <input
                type="text"
                value={accommodation.price_range || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, price_range: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="80-120€/nuit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Détails des tarifs
              </label>
              <input
                type="text"
                value={accommodation.price_details || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, price_details: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Petit-déjeuner inclus"
              />
            </div>
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Heure d'arrivée
              </label>
              <input
                type="text"
                value={accommodation.check_in_time || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, check_in_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={accommodation.check_out_time || ''}
                onChange={(e) => setAccommodation(prev => ({ ...prev, check_out_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {accommodation.featured_image && (
                <img
                  src={accommodation.featured_image}
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
              {accommodation.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(accommodation.features || [])];
                      newFeatures[index] = e.target.value;
                      setAccommodation(prev => ({ ...prev, features: newFeatures }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:text-red-800"
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
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ajouter une caractéristique..."
                />
                <button
                  onClick={addFeature}
                  className="p-2 text-blue-600 hover:text-blue-800"
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
              {accommodation.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) => {
                      const newAmenities = [...(accommodation.amenities || [])];
                      newAmenities[index] = e.target.value;
                      setAccommodation(prev => ({ ...prev, amenities: newAmenities }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeAmenity(index)}
                    className="p-2 text-red-600 hover:text-red-800"
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
                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ajouter un équipement..."
                />
                <button
                  onClick={addAmenity}
                  className="p-2 text-blue-600 hover:text-blue-800"
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
              {accommodation.house_rules?.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...(accommodation.house_rules || [])];
                      newRules[index] = e.target.value;
                      setAccommodation(prev => ({ ...prev, house_rules: newRules }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeRule(index)}
                    className="p-2 text-red-600 hover:text-red-800"
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
                  onKeyPress={(e) => e.key === 'Enter' && addRule()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ajouter une règle..."
                />
                <button
                  onClick={addRule}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Politique d'annulation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Politique d'annulation
            </label>
            <textarea
              value={accommodation.cancellation_policy || ''}
              onChange={(e) => setAccommodation(prev => ({ ...prev, cancellation_policy: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez la politique d'annulation..."
            />
          </div>

          {/* SEO */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre SEO
                </label>
                <input
                  type="text"
                  value={accommodation.meta_title || ''}
                  onChange={(e) => setAccommodation(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre pour les moteurs de recherche"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description SEO
                </label>
                <textarea
                  value={accommodation.meta_description || ''}
                  onChange={(e) => setAccommodation(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description pour les moteurs de recherche"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <div className="flex space-x-3">
            {accommodation.status === 'published' && (
              <button
                onClick={() => setAccommodation(prev => ({ ...prev, status: 'draft' }))}
                className="flex items-center px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Dépublier
              </button>
            )}
            {accommodation.status === 'draft' && (
              <button
                onClick={() => setAccommodation(prev => ({ ...prev, status: 'published' }))}
                className="flex items-center px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Publier
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationEditor;