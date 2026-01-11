import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll vers le haut à chaque changement de route
    // Utilisation de requestAnimationFrame pour s'assurer que le DOM est prêt
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Scroll instantané pour une navigation rapide
      });
    });
  }, [pathname]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop;