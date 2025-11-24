
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
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Commerces locaux</h2>
            <p className="text-slate-600 max-w-3xl mb-8">
                Nos commerçants vous accueillent avec le sourire. Boulangeries, fleuristes, boutiques de cadeaux... 
                Flânez dans les rues de Chièvres et faites-vous plaisir.
            </p>

            {/* Controls Container */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                
                {/* Search Bar */}
                <div className="relative w-full lg:w-72 order-2 lg:order-1">
                    <input 
                        type="text" 
                        placeholder="Rechercher un commerce..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 order-1 lg:order-2">
                    <div className="flex items-center text-slate-500 mr-2 text-sm font-bold uppercase tracking-wider hidden md:flex">
                        <Filter size={16} className="mr-2" />
                        Filtrer :
                    </div>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                                selectedTag === tag 
                                ? 'bg-primary text-white font-bold shadow-md transform scale-105' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-primary/30'
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
             <div className="mb-12">
                <InteractiveMap items={filteredMerchants} />
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMerchants.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>

        {filteredMerchants.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                   <Search size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Aucun résultat trouvé</h3>
                <p className="text-slate-500 mb-6">Nous n'avons trouvé aucun commerce correspondant à votre recherche "{searchQuery}" {selectedTag !== 'Tous' && `dans la catégorie ${selectedTag}`}.</p>
                <button 
                    onClick={() => { setSelectedTag('Tous'); setSearchQuery(''); }}
                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors"
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
