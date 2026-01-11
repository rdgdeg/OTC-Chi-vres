import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const HomeHero: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
            <source src="/videos/chievres-intro.mp4" type="video/mp4" />
            {/* Fallback image si la vidéo ne charge pas */}
            <img 
              src="https://picsum.photos/id/1047/1920/1080" 
              alt="Chièvres - Cité des Aviateurs"
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          <img 
            src="https://picsum.photos/id/1047/1920/1080" 
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
            Bienvenue à Chièvres,<br />
            <span className="text-secondary">la Cité des Aviateurs !</span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-8 space-y-6">
            <p className="text-xl sm:text-2xl leading-relaxed font-light">
              Suivez notre crosseur, emblème du crossage al' tonne, et partez à la découverte 
              d'une ville riche en histoire, traditions et vie associative.
            </p>
            
            <p className="text-lg sm:text-xl leading-relaxed opacity-90">
              Chièvres séduit par son patrimoine médiéval, ses événements festifs et ses associations 
              qui font vibrer la ville tout au long de l'année.
            </p>
            
            <p className="text-lg font-semibold text-secondary">
              Venez juger par vous-même et explorez les trésors de notre cité !
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