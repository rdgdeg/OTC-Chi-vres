
import React from 'react';
import InfoBanner from '../components/InfoBanner';
import HomeHero from '../components/HomeHero';
import NewsSection from '../components/NewsSection';
import PlanYourVisitSection from '../components/PlanYourVisitSection';
import NewsletterSection from '../components/NewsletterSection';
import SocialSection from '../components/SocialSection';
import { useData } from '../contexts/DataContext';
import homePageConfig from '../data/homePageConfig';

const Home: React.FC = () => {
  // Use CMS Data for text content
  const { pageContent, events } = useData();
  const content = pageContent['home'] || {};

  return (
    <div>
      {/* Bande info défilante */}
      {homePageConfig.infoBanner.enabled && (
        <InfoBanner 
          message={homePageConfig.infoBanner.message}
          type={homePageConfig.infoBanner.type}
          dismissible={homePageConfig.infoBanner.dismissible}
        />
      )}

      {/* Section Intro avec Vidéo/Photo */}
      <HomeHero />

      {/* Planifiez votre visite */}
      <PlanYourVisitSection />

      {/* Section Actualités */}
      <NewsSection />

      {/* Section Newsletter */}
      <NewsletterSection />

      {/* Réseaux sociaux */}
      <SocialSection />
    </div>
  );
};

export default Home;
