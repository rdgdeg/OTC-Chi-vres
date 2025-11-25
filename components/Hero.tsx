import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  height?: 'small' | 'medium' | 'large';
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl, height = 'medium' }) => {
  const heightClass = {
    small: 'h-[40vh] sm:h-[35vh]',
    medium: 'h-[50vh] sm:h-[55vh]',
    large: 'h-[70vh] sm:h-[75vh] md:h-[80vh]'
  }[height];

  return (
    <div className={`relative w-full ${heightClass} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-3 sm:mb-4 drop-shadow-md leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-100 font-light max-w-2xl mx-auto drop-shadow-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;