
import React from 'react';
import InfoBanner from '../components/InfoBanner';
import HomeHero from '../components/HomeHero';
import NewsSection from '../components/NewsSection';
import FavoritesSection from '../components/FavoritesSection';
import NewsletterSection from '../components/NewsletterSection';
import SocialSection from '../components/SocialSection';

const Home: React.FC = () => {
  return (
    <div>
      {/* Bannière d'information dynamique */}
      <InfoBanner />

      {/* Section Hero avec contenu dynamique */}
      <HomeHero />

      {/* Section Actualités dynamiques */}
      <NewsSection />

      {/* Section Coups de cœur dynamiques */}
      <FavoritesSection />

      {/* Section Newsletter avec sauvegarde BDD */}
      <NewsletterSection />

      {/* Réseaux sociaux */}
      <SocialSection />
    </div>
  );
};

export default Home;
