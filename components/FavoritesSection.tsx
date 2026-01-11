import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { homepageService, HomepageFavorite } from '../services/homepageService';

const FavoritesSection: React.FC = () => {
  const [favorites, setFavorites] = useState<HomepageFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await homepageService.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Erreur lors du chargement des coups de cœur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (favorites.length === 0) {
    return null;
  }

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
              onClick={() => favorite.link_url && (window.location.href = favorite.link_url)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={favorite.image_url}
                  alt={favorite.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {favorite.link_url && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink size={18} className="text-slate-700" />
                  </div>
                )}
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