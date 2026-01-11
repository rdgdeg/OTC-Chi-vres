import React from 'react';
import { usePageContent } from '../contexts/PageContentContext';

interface PageHeroProps {
  pageId: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({
  pageId,
  fallbackTitle,
  fallbackSubtitle,
  fallbackImage,
  className = '',
  children
}) => {
  const { getPageContent } = usePageContent();
  const pageContent = getPageContent(pageId);

  const title = pageContent?.title || fallbackTitle || 'Page';
  const subtitle = pageContent?.subtitle || fallbackSubtitle;
  const heroImage = pageContent?.heroImage || fallbackImage || 'https://picsum.photos/1920/600?grayscale';

  return (
    <section className={`relative h-96 flex items-center justify-center text-white ${className}`}>
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHero;