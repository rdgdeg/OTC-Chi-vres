import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { homepageService } from '../services/homepageService';

const HomeHero: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [heroContent, setHeroContent] = useState({
    title: 'Bienvenue à Chièvres,',
    subtitle: 'la Cité des Aviateurs !',
    content: 'Suivez notre crosseur, emblème du crossage al\' tonne, et partez à la découverte d\'une ville riche en histoire, traditions et vie associative.',
    backgroundImage: 'https://picsum.photos/id/1047/1920/1080',
    videoUrl: '/videos/chievres-intro.mp4',
    ctaText: 'Découvrir Chièvres',
    ctaUrl: '/musees'
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
          backgroundImage: content.image_url || content.settings?.backgroundImage || heroContent.backgroundImage,
          videoUrl: content.settings?.videoUrl || heroContent.videoUrl,
          ctaText: content.cta_text || heroContent.ctaText,
          ctaUrl: content.cta_url || heroContent.ctaUrl
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du contenu hero:', error);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {isVideoPlaying ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
          >
            <source src={heroContent.videoUrl} type="video/mp4" />
            {/* Fallback image si la vidéo ne charge pas */}
            <img 
              src={heroContent.backgroundImage} 
              alt="Chièvres - Cité des Aviateurs"
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          <img 
            src={heroContent.backgroundImage} 
            alt="Chièvres - Cité des Aviateurs"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Emblème du crosseur */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary rounded-full mb-6 shadow-2xl">
              <span className="text-3xl font-serif font-bold text-slate-900">C</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            {heroContent.title}<br />
            <span className="text-secondary">{heroContent.subtitle}</span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-8 space-y-6">
            <p className="text-xl sm:text-2xl leading-relaxed font-light">
              {heroContent.content}
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to={heroContent.ctaUrl} 
              className="px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {heroContent.ctaText}
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

      {/* Video Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-3">
        <button
          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label={isVideoPlaying ? "Mettre en pause" : "Lire la vidéo"}
        >
          {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        {isVideoPlaying && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
            aria-label={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}
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