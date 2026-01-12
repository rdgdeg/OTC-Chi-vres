import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Accommodation } from '../types';
import { AccommodationService } from '../services/accommodationService';
import { useAuth } from '../contexts/AuthContext';
import { BedIcon as Bed, Home, Building, Tent, Star, MapPin, Filter } from 'lucide-react';
import Hero from '../components/Hero';
import AccommodationCard from '../components/AccommodationCard';
import InteractiveMap from '../components/InteractiveMap';

const AccommodationsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  
  // Vérifier si l'utilisateur peut éditer le contenu
  const canEdit = hasPermission('accommodations', 'update');
  
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Determine default tab from URL query params
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'bed_breakfast') return 'bed_breakfast';
    if (type === 'hotel') return 'hotel';
    if (type === 'camping') return 'camping';
    if (type === 'unusual') return 'unusual';
    if (type === 'gite') return 'gite';
    return 'all'; // Par défaut, afficher tous les hébergements
  };

  const [activeTab, setActiveTab] = useState<'all' | 'gite' | 'bed_breakfast' | 'hotel' | 'camping' | 'unusual'>(getInitialTab());
  const [selectedVillage, setSelectedVillage] = useState<string>('Tous');

  const VILLAGES = ['Tous', 'Chièvres', 'Vaudignies', 'Ladeuze', 'Tongre-Saint-Martin', 'Tongre-Notre-Dame', 'Grosage', 'Huissignies'];

  // Update tab if URL changes
  useEffect(() => {
    setActiveTab(getInitialTab());
    setSelectedVillage('Tous'); // Reset village when switching main category for better UX
  }, [location.search]);

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      const data = await AccommodationService.getPublishedAccommodations();
      setAccommodations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des hébergements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Data
  const filteredData = () => {
    let data = accommodations;
    
    // Filtrer par type seulement si un type spécifique est sélectionné
    if (activeTab !== 'all') {
      data = data.filter(acc => acc.type === activeTab);
    }

    // Filter by Village
    if (selectedVillage !== 'Tous') {
      data = data.filter(acc => acc.village === selectedVillage);
    }

    return data;
  };

  const currentData = filteredData();

  const getTabContent = () => {
    switch(activeTab) {
      case 'bed_breakfast':
        return {
          title: 'Chambres d\'hôtes & B&B',
          description: 'Profitez d\'un accueil personnalisé et d\'un petit-déjeuner savoureux dans nos chambres d\'hôtes chaleureuses.',
          icon: <Home className="mr-2" size={20}/>
        };
      case 'hotel':
        return {
          title: 'Hôtels',
          description: 'Séjournez dans le confort et la commodité de nos établissements hôteliers.',
          icon: <Building className="mr-2" size={20}/>
        };
      case 'camping':
        return {
          title: 'Campings',
          description: 'Reconnectez-vous avec la nature dans nos espaces de camping aménagés.',
          icon: <Tent className="mr-2" size={20}/>
        };
      case 'unusual':
        return {
          title: 'Hébergements insolites',
          description: 'Vivez une expérience unique dans nos hébergements atypiques et originaux.',
          icon: <Star className="mr-2" size={20}/>
        };
      case 'gite':
        return {
          title: 'Gîtes',
          description: 'Découvrez nos gîtes authentiques pour un séjour en toute indépendance au cœur de la campagne chiévroise.',
          icon: <Bed className="mr-2" size={20}/>
        };
      default: // 'all'
        return {
          title: 'Tous nos hébergements',
          description: 'Découvrez tous nos hébergements pour un séjour authentique et convivial à Chièvres et ses villages.',
          icon: <Home className="mr-2" size={20}/>
        };
    }
  };

  const headerInfo = getTabContent();

  const handleAccommodationClick = (accommodation: Accommodation) => {
    // Incrémenter le compteur de vues
    AccommodationService.incrementViewCount(accommodation.id);
    // Rediriger vers la page de détail
    window.location.href = `/hebergements/${accommodation.slug}`;
  };

  const handleImageUpdate = async (accommodation: Accommodation, newUrl: string) => {
    try {
      await AccommodationService.updateAccommodation(accommodation.id, { featured_image: newUrl });
      // Recharger les données
      loadAccommodations();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
    }
  };

  // Convert accommodations to map format
  const mapItems = currentData.map(acc => ({
    id: acc.id,
    name: acc.name,
    type: 'hotel' as const, // Utiliser 'hotel' comme type générique pour tous les hébergements
    address: acc.address,
    lat: acc.lat || 50.5897, // Coordonnées par défaut de Chièvres si pas de coordonnées
    lng: acc.lng || 3.8014,
    imageUrl: acc.featured_image || 'https://picsum.photos/600/400?grayscale',
    description: acc.excerpt || acc.description,
    phone: acc.phone,
    website: acc.website,
    tags: acc.village ? [acc.village, acc.type] : [acc.type],
    rating: acc.rating
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des hébergements...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero 
        title="Dormir à Chièvres"
        subtitle="Envie d'une escale à Chièvres ? Chièvres et ses villages vous accueillent dans des hébergements chaleureux pour un séjour authentique et convivial."
        imageUrl="https://picsum.photos/id/1080/1920/600"
        height="medium"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Navigation Tabs (Categories) */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'all' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Home className="mr-2" size={16}/> Tous
          </button>
          <button
            onClick={() => setActiveTab('gite')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'gite' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Bed className="mr-2" size={16}/> Gîtes
          </button>
          <button
            onClick={() => setActiveTab('bed_breakfast')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'bed_breakfast' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Home className="mr-2" size={16}/> B&B
          </button>
          <button
            onClick={() => setActiveTab('unusual')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'unusual' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Star className="mr-2" size={16}/> Insolite
          </button>
          <button
            onClick={() => setActiveTab('hotel')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'hotel' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Building className="mr-2" size={16}/> Hôtels
          </button>
          <button
            onClick={() => setActiveTab('camping')}
            className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'camping' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <Tent className="mr-2" size={16}/> Campings
          </button>
        </div>

        {/* Village Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mr-1 sm:mr-2 flex items-center">
            <MapPin size={12} className="mr-1"/> Villages :
          </span>
          {VILLAGES.map(village => (
            <button
              key={village}
              onClick={() => setSelectedVillage(village)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                selectedVillage === village 
                ? 'bg-secondary text-slate-900 shadow-sm ring-2 ring-secondary/20 font-bold' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary hover:border-primary/30 active:scale-95'
              }`}
            >
              {village}
            </button>
          ))}
        </div>

        <div className="mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 text-secondary rounded-full mb-4 sm:mb-6">
            {React.cloneElement(headerInfo.icon as React.ReactElement, { size: 24, className: 'sm:w-8 sm:h-8' })}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6 px-4">
            {headerInfo.title} {selectedVillage !== 'Tous' && <span className="text-primary">à {selectedVillage}</span>}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg px-4">
            {headerInfo.description}
          </p>
        </div>

        {/* Map Section */}
        {currentData.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <InteractiveMap items={mapItems} height="300px" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {currentData.map((accommodation) => (
            <AccommodationCard 
              key={accommodation.id} 
              accommodation={accommodation}
              editable={canEdit}
              onImageUpdate={async (newUrl) => {
                await handleImageUpdate(accommodation, newUrl);
              }}
              onClick={() => handleAccommodationClick(accommodation)}
            />
          ))}
        </div>

        {currentData.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Filter size={20} />
            </div>
            <p className="text-slate-500">Aucun hébergement trouvé à <span className="font-bold">{selectedVillage}</span> dans cette catégorie.</p>
            <button 
              onClick={() => setSelectedVillage('Tous')}
              className="mt-4 text-primary font-bold text-sm hover:underline"
            >
              Voir tous les villages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationsPage;