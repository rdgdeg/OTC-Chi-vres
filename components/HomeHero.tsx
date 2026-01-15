import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homepageService } from '../services/homepageService';

const HomeHero: React.FC = () => {
  const [heroContent, setHeroContent] = useState({
    title: 'Bienvenue à Chièvres',
    subtitle: 'La cité des aviateurs vous accueille',
    content: 'Découvrez une commune riche en histoire, en traditions et en nature. Entre patrimoine exceptionnel et modernité, Chièvres vous invite à explorer ses trésors cachés.',
    backgroundImage: 'https://picsum.photos/id/1047/1920/1080'
  });

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      const content = await homepageService.getHero();
      if (content) {
        setHeroContent({
          title: content.title || heroContent.title,
          subtitle: content.subtitle || heroContent.subtitle,
          content: content.content || heroContent.content,
          backgroundImage: content.image_url || heroContent.backgroundImage
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du contenu hero:', error);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image fixe */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroContent.backgroundImage} 
          alt="Chièvres - Cité des Aviateurs"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            {heroContent.title}
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold mb-8 text-secondary">
            {heroContent.subtitle}
          </h2>
          
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-xl sm:text-2xl leading-relaxed font-light">
              {heroContent.content}
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/musees" 
              className="px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Découvrir Chièvres
            </Link>
            <Link 
              to="/agenda" 
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Voir l'agenda
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;