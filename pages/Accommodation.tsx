
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
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Nos Hébergements</h2>
            <p className="text-slate-600 max-w-3xl">
                Profitez de l'hospitalité légendaire de notre région. Que vous cherchiez le confort moderne ou le charme rustique d'une ancienne ferme rénovée, 
                vous trouverez l'endroit idéal pour poser vos valises.
            </p>
        </div>

        {/* Map Section */}
        <div className="mb-12">
           <InteractiveMap items={accommodation} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodation.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
