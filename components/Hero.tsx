import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  height?: 'small' | 'medium' | 'large';
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl, height = 'medium' }) => {
  const heightClass = {
    small: 'h-[30vh]',
    medium: 'h-[50vh]',
    large: 'h-[80vh]'
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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-100 font-light max-w-2xl mx-auto drop-shadow-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;