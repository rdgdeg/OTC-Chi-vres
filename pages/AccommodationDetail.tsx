import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accommodation } from '../types';
import { AccommodationService } from '../services/accommodationService';
import { 
  ArrowLeft, Users, Bed, MapPin, Phone, Mail, Globe, Facebook, 
  Star, Wifi, Car, Coffee, Utensils, Tv, Bath, CheckCircle,
  Calendar, Clock, Info, Camera
} from 'lucide-react';

const AccommodationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const accommodationTypes = {
    bed_breakfast: 'Bed & Breakfast',
    gite: 'Gîte',
    hotel: 'Hôtel',
    camping: 'Camping',
    unusual: 'Hébergement insolite'
  };

  useEffect(() => {
    if (slug) {
      loadAccommodation(slug);
    }
  }, [slug]);

  const loadAccommodation = async (slug: string) => {
    try {
      const data = await AccommodationService.getAccommodationBySlug(slug);
      if (data) {
        setAccommodation(data);
        // Incrémenter le compteur de vues
        AccommodationService.incrementViewCount(data.id);
      } else {
        navigate('/hebergements');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'hébergement:', error);
      navigate('/hebergements');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-5 w-5" />;
    if (amenityLower.includes('parking')) return <Car className="h-5 w-5" />;
    if (amenityLower.includes('petit-déjeuner') || amenityLower.includes('breakfast')) return <Coffee className="h-5 w-5" />;
    if (amenityLower.includes('cuisine') || amenityLower.includes('kitchenette')) return <Utensils className="h-5 w-5" />;
    if (amenityLower.includes('tv') || amenityLower.includes('télé')) return <Tv className="h-5 w-5" />;
    if (amenityLower.includes('salle de bain') || amenityLower.includes('bathroom')) return <Bath className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'hébergement...</p>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement non trouvé</h2>
          <button
            onClick={() => navigate('/hebergements')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux hébergements
          </button>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(accommodation.featured_image ? [accommodation.featured_image] : []),
    ...(accommodation.gallery_images || [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/hebergements')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux hébergements
          </button>
        </div>
      </div>

      {/* Images */}
      {allImages.length > 0 && (
        <div className="relative">
          <div className="h-96 bg-gray-200 overflow-hidden">
            <img
              src={allImages[selectedImageIndex]}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <button
                onClick={() => setShowGallery(true)}
                className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition-colors flex items-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Voir toutes les photos ({allImages.length})
              </button>
            )}
          </div>
          
          {/* Miniatures */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {allImages.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {allImages.length > 5 && (
                <div className="w-16 h-16 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  +{allImages.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* En-tête */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {accommodation.name}
                  </h1>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {accommodationTypes[accommodation.type]}
                  </span>
                </div>
                {accommodation.rating && (
                  <div className="flex items-center">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    <span className="ml-1 text-lg font-medium text-gray-700">
                      {accommodation.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{accommodation.capacity} personnes</span>
                </div>
                {accommodation.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{accommodation.bedrooms} chambres</span>
                  </div>
                )}
                {accommodation.beds_description && (
                  <div className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    <span>{accommodation.beds_description}</span>
                  </div>
                )}
              </div>

              {/* Localisation */}
              <div className="flex items-center mb-4 text-gray-600">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{accommodation.address}</span>
                {accommodation.village && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {accommodation.village}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {accommodation.description}
                </p>
              </div>
            </div>

            {/* Ce que vous aimerez */}
            {accommodation.features && accommodation.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Ce que vous aimerez
                </h2>
                <ul className="space-y-3">
                  {accommodation.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Équipements */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Équipements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accommodation.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-blue-600 mr-3">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Règles de la maison */}
            {accommodation.house_rules && accommodation.house_rules.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Règles de la maison
                </h2>
                <ul className="space-y-2">
                  {accommodation.house_rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact et réservation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact / Réservation
              </h3>

              {/* Prix */}
              {accommodation.price_range && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {accommodation.price_range}
                  </div>
                  {accommodation.price_details && (
                    <div className="text-sm text-gray-600 mt-1">
                      {accommodation.price_details}
                    </div>
                  )}
                </div>
              )}

              {/* Horaires */}
              <div className="mb-4 space-y-2">
                {accommodation.check_in_time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Arrivée : {accommodation.check_in_time}</span>
                  </div>
                )}
                {accommodation.check_out_time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Départ : {accommodation.check_out_time}</span>
                  </div>
                )}
                {accommodation.min_stay && accommodation.min_stay > 1 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Séjour minimum : {accommodation.min_stay} nuits</span>
                  </div>
                )}
              </div>

              {/* Contacts */}
              <div className="space-y-3">
                {accommodation.phone && (
                  <a
                    href={`tel:${accommodation.phone}`}
                    className="flex items-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    {accommodation.phone}
                  </a>
                )}
                
                {accommodation.email && (
                  <a
                    href={`mailto:${accommodation.email}`}
                    className="flex items-center w-full px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {accommodation.email}
                  </a>
                )}

                {accommodation.website && (
                  <a
                    href={accommodation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="h-5 w-5 mr-3" />
                    Site web
                  </a>
                )}

                {accommodation.facebook && (
                  <a
                    href={accommodation.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Facebook className="h-5 w-5 mr-3" />
                    Page Facebook
                  </a>
                )}
              </div>

              {/* Politique d'annulation */}
              {accommodation.cancellation_policy && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Politique d'annulation
                  </h4>
                  <p className="text-sm text-gray-600">
                    {accommodation.cancellation_policy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Galerie modale */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="max-w-4xl max-h-full p-4">
            <div className="relative">
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={allImages[selectedImageIndex]}
                alt={`Photo ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetailPage;