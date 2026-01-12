
import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { Filter, Search } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

const Merchants: React.FC = () => {
  const { merchants } = useData();
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically extract unique tags from all merchants
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    merchants.forEach(merchant => {
      merchant.tags.forEach(tag => tags.add(tag));
    });
    // Sort tags alphabetically and add 'Tous' at the beginning
    return ['Tous', ...Array.from(tags).sort()];
  }, [merchants]);

  // Filter the merchants list based on selected tag AND search query
  const filteredMerchants = merchants.filter(merchant => {
      const matchesTag = selectedTag === 'Tous' || merchant.tags.includes(selectedTag);
      const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
  });

  return (
    <div>
      <Hero 
        title="Nos Commerçants"
        subtitle="Soutenez l'économie locale et découvrez le savoir-faire de nos artisans."
        imageUrl="https://picsum.photos/id/1059/1920/600"
        height="medium"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">Commerces locaux</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl mb-6 sm:mb-8">
                Nos commerçants vous accueillent avec le sourire. Boulangeries, fleuristes, boutiques de cadeaux... 
                Flânez dans les rues de Chièvres et faites-vous plaisir.
            </p>

            {/* Controls Container */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-100">
                
                {/* Search Bar */}
                <div className="relative w-full lg:w-72 order-2 lg:order-1">
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm sm:text-base"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 sm:top-3 text-slate-400" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 order-1 lg:order-2">
                    <div className="flex items-center text-slate-500 mr-1 sm:mr-2 text-xs sm:text-sm font-bold uppercase tracking-wider hidden md:flex">
                        <Filter size={14} className="mr-1 sm:mr-2" />
                        Filtrer :
                    </div>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-200 touch-manipulation ${
                                selectedTag === tag 
                                ? 'bg-primary text-white font-bold shadow-md transform scale-105' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-primary/30 active:scale-95'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Map Section */}
        {filteredMerchants.length > 0 && (
             <div className="mb-8 sm:mb-12">
                <InteractiveMap items={filteredMerchants} height="300px" />
             </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredMerchants.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>

        {filteredMerchants.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-slate-400">
                   <Search size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-2">Aucun résultat trouvé</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 max-w-md mx-auto">Nous n'avons trouvé aucun commerce correspondant à votre recherche "{searchQuery}" {selectedTag !== 'Tous' && `dans la catégorie ${selectedTag}`}.</p>
                <button 
                    onClick={() => { setSelectedTag('Tous'); setSearchQuery(''); }}
                    className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 active:scale-95 transition-all touch-manipulation text-sm sm:text-base"
                >
                    Réinitialiser tout
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Merchants;
