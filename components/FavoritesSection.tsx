import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';

const FavoritesSection: React.FC = () => {
  const favorites = [
    {
      id: 1,
      title: 'Église Saint-Martin',
      image: 'https://picsum.photos/id/1041/600/400',
      description: 'Monument historique classé du XIIe siècle'
    },
    {
      id: 2,
      title: 'Le Crossage al\'tonne',
      image: 'https://picsum.photos/id/1042/600/400',
      description: 'Tradition folklorique unique de Chièvres'
    },
    {
      id: 3,
      title: 'Château de Ladeuze',
      image: 'https://picsum.photos/id/1043/600/400',
      description: 'Patrimoine architectural remarquable'
    },
    {
      id: 4,
      title: 'Sentiers de randonnée',
      image: 'https://picsum.photos/id/1044/600/400',
      description: 'Découvrez la nature environnante'
    },
    {
      id: 5,
      title: 'Place Charles II',
      image: 'https://picsum.photos/id/1045/600/400',
      description: 'Cœur historique de la cité'
    },
    {
      id: 6,
      title: 'Musée de la Vie Rurale',
      image: 'https://picsum.photos/id/1046/600/400',
      description: 'Plongez dans l\'histoire locale'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Heart size={32} className="text-red-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-4">
            Nos coups de cœur
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Les sites emblématiques et incontournables de l'entité de Chièvres
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={favorite.image}
                  alt={favorite.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink size={18} className="text-slate-700" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                  {favorite.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {favorite.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/musees" 
            className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl inline-block"
          >
            Voir tout le patrimoine
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FavoritesSection;