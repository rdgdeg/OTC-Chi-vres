
import React from 'react';
import InfoBanner from '../components/InfoBanner';
import HomeHero from '../components/HomeHero';
import HomepageBlocks from '../components/HomepageBlocks';
import AgendaNewsSection from '../components/AgendaNewsSection';
import NewsletterSection from '../components/NewsletterSection';
import SocialSection from '../components/SocialSection';

const Home: React.FC = () => {
  return (
    <div>
      {/* Bannière d'information dynamique */}
      <InfoBanner />

      {/* Bannière d'accueil avec présentation (éditable) */}
      <HomeHero />

      {/* Blocs de navigation "Envie de..." (éditables) */}
      <HomepageBlocks />

      {/* Section Agenda et Actualités (éditables) */}
      <AgendaNewsSection />

      {/* Section Newsletter avec sauvegarde BDD */}
      <NewsletterSection />

      {/* Réseaux sociaux */}
      <SocialSection />
    </div>
  );
};

export default Home;