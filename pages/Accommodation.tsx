
import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import InteractiveMap from '../components/InteractiveMap';

const Accommodation: React.FC = () => {
  const { accommodation } = useData();

  return (
    <div>
      <Hero 
        title="Où Séjourner ?"
        subtitle="Hôtels, gîtes de charme et chambres d'hôtes pour un repos bien mérité."
        imageUrl="https://picsum.photos/id/1029/1920/600"
        height="medium"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">Nos Hébergements</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
                Profitez de l'hospitalité légendaire de notre région. Que vous cherchiez le confort moderne ou le charme rustique d'une ancienne ferme rénovée, 
                vous trouverez l'endroit idéal pour poser vos valises.
            </p>
        </div>

        {/* Map Section */}
        <div className="mb-8 sm:mb-12">
           <InteractiveMap items={accommodation} height="300px" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {accommodation.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
