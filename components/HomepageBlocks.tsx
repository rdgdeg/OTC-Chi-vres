import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Mountain, Utensils, Bed, 
  Camera, Users, Coffee, TreePine, Building,
  ArrowRight, ExternalLink
} from 'lucide-react';
import { homepageBlocksService, HomepageBlock } from '../services/homepageBlocksService';

// Mapping des icônes disponibles
const iconMap = {
  MapPin,
  Calendar,
  Mountain,
  Utensils,
  Bed,
  Camera,
  Users,
  Coffee,
  TreePine,
  Building,
  ArrowRight,
  ExternalLink
};

const HomepageBlocks: React.FC = () => {
  const [blocks, setBlocks] = useState<HomepageBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const data = await homepageBlocksService.getAllBlocks();
      setBlocks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des blocs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (blocks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Titre de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            Envie de...
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez tout ce que Chièvres a à vous offrir
          </p>
        </div>

        {/* Grille des blocs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blocks.map((block, index) => {
            const IconComponent = block.icon_name && iconMap[block.icon_name as keyof typeof iconMap] 
              ? iconMap[block.icon_name as keyof typeof iconMap] 
              : MapPin;

            return (
              <Link
                key={block.id}
                to={block.link_url || '#'}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Image de fond */}
                {block.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={block.image_url}
                      alt={block.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay avec couleur personnalisée */}
                    <div 
                      className="absolute inset-0 opacity-80"
                      style={{ backgroundColor: block.background_color }}
                    ></div>
                    
                    {/* Icône */}
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Numéro */}
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contenu */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 
                      className="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
                      style={{ color: block.text_color }}
                    >
                      {block.title}
                    </h3>
                    {block.subtitle && (
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {block.subtitle}
                      </p>
                    )}
                  </div>

                  {block.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {block.description}
                    </p>
                  )}

                  {/* Bouton d'action */}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">Découvrir</span>
                    <ArrowRight className="h-4 w-4 text-primary transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call-to-action global */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <span className="text-gray-700 font-medium">
              Besoin d'aide pour planifier votre visite ?
            </span>
            <Link
              to="/contact"
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors font-semibold"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageBlocks;