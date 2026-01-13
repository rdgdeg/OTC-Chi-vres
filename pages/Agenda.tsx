
import React from 'react';
import Hero from '../components/Hero';
import { EventsCalendar } from '../components/EventsCalendar';

const Agenda: React.FC = () => {
  return (
    <div>
      <Hero 
        title="Agenda des Événements"
        subtitle="Fêtes locales, marchés, événements culturels... Ne manquez rien de la vie chièvroise."
        imageUrl="https://picsum.photos/id/1040/1920/600"
        height="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <EventsCalendar />
      </div>
    </div>
  );
};

export default Agenda;