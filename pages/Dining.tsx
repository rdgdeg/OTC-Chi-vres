
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { Utensils, Coffee, Wheat, Filter, MapPin } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

const Dining: React.FC = () => {
  const { restaurants, merchants } = useData();
  const location = useLocation();
  
  // Determine default tab from URL query params
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'cafe') return 'cafe';
    if (type === 'producer') return 'producer';
    return 'restaurant';
  };

  const [activeTab, setActiveTab] = useState<'restaurant' | 'cafe' | 'producer'>(getInitialTab());
  const [selectedVillage, setSelectedVillage] = useState<string>('Tous');

  const VILLAGES = ['Tous', 'Chièvres', 'Vaudignies', 'Ladeuze', 'Grosage', 'Huissignies'];

  // Update tab if URL changes
  useEffect(() => {
    setActiveTab(getInitialTab());
    setSelectedVillage('Tous'); // Reset village when switching main category for better UX
  }, [location.search]);

  // Filter Data
  const filteredData = () => {
    let data = [];
    
    // 1. Filter by Type
    if (activeTab === 'producer') {
      data = merchants.filter(p => p.type === 'producer');
    } else {
      data = restaurants.filter(r => r.type === activeTab);
    }

    // 2. Filter by Village
    if (selectedVillage !== 'Tous') {
      data = data.filter(place => 
        place.address.toLowerCase().includes(selectedVillage.toLowerCase()) || 
        place.tags.some(tag => tag.toLowerCase().includes(selectedVillage.toLowerCase()))
      );
    }

    return data;
  };

  const currentData = filteredData();

  const getTabContent = () => {
    switch(activeTab) {
      case 'cafe':
        return {
          title: 'Se Désaltérer',
          description: 'Besoin d’une pause ? Attablez-vous à l’une des quelques terrasses de cafés et dégustez de délicieuses bières régionales.',
          icon: <Coffee className="mr-2" size={20}/>
        };
      case 'producer':
        return {
          title: 'Alimentation & Terroir',
          description: 'La Cité des aviateurs est riche de ses producteurs locaux. Favorisez le circuit-court afin de soutenir l’économie locale !',
          icon: <Wheat className="mr-2" size={20}/>
        };
      default:
        return {
          title: 'Se Restaurer',
          description: 'Un petit creux ou une grosse faim ? Des plats brasserie à la cuisine italienne, régalez-vous dans nos établissements.',
          icon: <Utensils className="mr-2" size={20}/>
        };
    }
  };

  const headerInfo = getTabContent();

  return (
    <div>
      <Hero 
        title="Gastronomie & Terroir"
        subtitle="Savourez les délices de Chièvres, de la fourche à la fourchette."
        imageUrl="https://picsum.photos/id/1080/1920/600"
        height="medium"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Navigation Tabs (Categories) */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('restaurant')}
              className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'restaurant' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
            >
              <Utensils className="mr-2" size={16}/> Se Restaurer
            </button>
            <button
              onClick={() => setActiveTab('cafe')}
              className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'cafe' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
            >
              <Coffee className="mr-2" size={16}/> Se Désaltérer
            </button>
            <button
              onClick={() => setActiveTab('producer')}
              className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base touch-manipulation ${activeTab === 'producer' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
            >
              <Wheat className="mr-2" size={16}/> Producteurs Locaux
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
             <InteractiveMap items={currentData} height="300px" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {currentData.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>

        {currentData.length === 0 && (
           <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
               <Filter size={20} />
             </div>
             <p className="text-slate-500">Aucun établissement trouvé à <span className="font-bold">{selectedVillage}</span> dans cette catégorie.</p>
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

export default Dining;
