import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const NewsSection: React.FC = () => {
  // Données d'exemple - à remplacer par des données dynamiques
  const newsItems = [
    {
      id: 1,
      title: 'Ouverture de la nouvelle exposition au Musée de la Vie Rurale',
      excerpt: 'Découvrez "Artisans d\'autrefois", une exposition temporaire qui met en lumière les métiers traditionnels de notre région.',
      image: 'https://picsum.photos/id/1051/400/300',
      date: '15 janvier 2026',
      category: 'Culture',
      readTime: '3 min'
    },
    {
      id: 2,
      title: 'Festival du Crossage 2026 : Save the Date !',
      excerpt: 'Le traditionnel Festival du Crossage al\'tonne aura lieu le premier weekend de septembre. Préparez-vous à vivre une expérience unique !',
      image: 'https://picsum.photos/id/1052/400/300',
      date: '12 janvier 2026',
      category: 'Événement',
      readTime: '2 min'
    },
    {
      id: 3,
      title: 'Nouveaux circuits de randonnée balisés',
      excerpt: 'Trois nouveaux parcours de découverte ont été aménagés pour vous faire découvrir les trésors cachés de notre campagne.',
      image: 'https://picsum.photos/id/1053/400/300',
      date: '8 janvier 2026',
      category: 'Nature',
      readTime: '4 min'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-4">
              Actualités
            </h2>
            <p className="text-lg text-slate-600">
              Les dernières nouvelles de Chièvres et de l'Office du Tourisme
            </p>
          </div>
          <Link 
            to="/blog" 
            className="flex items-center text-primary font-bold hover:text-secondary transition-colors group"
          >
            Toutes les actualités 
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-slate-500 text-sm mb-3 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{item.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center text-primary font-semibold text-sm group-hover:text-secondary transition-colors">
                  <span className="mr-2">Lire la suite</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;