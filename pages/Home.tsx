
import React from 'react';
import InfoBanner from '../components/InfoBanner';
import HomeHero from '../components/HomeHero';
import DiscoverSection from '../components/DiscoverSection';
import NewsSection from '../components/NewsSection';
import PlanVisitSection from '../components/PlanVisitSection';
import NewsletterSection from '../components/NewsletterSection';
import SocialSection from '../components/SocialSection';

const Home: React.FC = () => {
  return (
    <div>
      {/* Bannière d'information dynamique */}
      <InfoBanner />

      {/* Section Hero avec contenu dynamique */}
      <HomeHero />

      {/* Section Découvrir Chièvres (Culture, Crossage, Hébergements) */}
      <DiscoverSection />

      {/* Section Actualités dynamiques */}
      <NewsSection />

      {/* Section Planifiez votre visite */}
      <PlanVisitSection />

      {/* Section Newsletter avec sauvegarde BDD */}
      <NewsletterSection />

      {/* Réseaux sociaux */}
      <SocialSection />
    </div>
  );
};

export default Home;
