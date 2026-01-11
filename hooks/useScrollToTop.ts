import { useEffect } from 'react';

/**
 * Hook personnalisé pour faire défiler vers le haut
 * Utile pour les composants qui ont besoin de contrôler le scroll manuellement
 */
export const useScrollToTop = (trigger?: any) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [trigger]);
};

/**
 * Fonction utilitaire pour scroll vers le haut avec animation
 */
export const scrollToTop = (smooth: boolean = false) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'instant'
  });
};

/**
 * Fonction utilitaire pour scroll vers un élément spécifique
 */
export const scrollToElement = (elementId: string, smooth: boolean = true) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'start'
    });
  }
};