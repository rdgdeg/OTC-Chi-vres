
import React from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { ShoppingBag, Search } from 'lucide-react';

const Shop: React.FC = () => {
  const { products } = useData();

  return (
    <div>
      <Hero 
        title="La Boutique"
        subtitle="Emportez un morceau de Chièvres avec vous : terroir, souvenirs et livres."
        imageUrl="https://picsum.photos/id/1059/1920/600"
        height="medium"
      />

      <div className="container mx-auto px-4 py-16">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl font-serif font-bold text-slate-800">Nos produits phares</h2>
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <div key={product.id} className="group">
                    <div className="bg-slate-50 rounded-xl overflow-hidden relative mb-4 aspect-square flex items-center justify-center p-4 hover:shadow-lg transition-all">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Quick Add Button */}
                        <button className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary shadow-lg">
                            <ShoppingBag size={20} />
                        </button>
                    </div>
                    
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">{product.category}</div>
                        <h3 className="font-serif font-bold text-slate-800 text-lg mb-1 leading-tight">{product.name}</h3>
                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="text-secondary font-bold text-xl">{product.price.toFixed(2)} €</div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center">
            <h3 className="font-serif font-bold text-2xl text-slate-800 mb-4">Points de vente physiques</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                Retrouvez tous nos produits directement à l'Office du Tourisme (Rue de Saint-Ghislain, 16) ou chez nos partenaires locaux.
            </p>
            <button className="text-primary font-bold hover:underline">Voir les revendeurs</button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
