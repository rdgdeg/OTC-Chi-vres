import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { homepageService } from '../services/homepageService';

const InfoBanner: React.FC = () => {
  const [banner, setBanner] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    loadBanner();
    
    // Vérifier si la bannière a été fermée dans cette session
    const dismissed = sessionStorage.getItem('banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const loadBanner = async () => {
    try {
      const bannerData = await homepageService.getBanner();
      if (bannerData && bannerData.is_active) {
        setBanner(bannerData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la bannière:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    // Sauvegarder dans la session pour ne pas réafficher
    if (banner?.settings?.dismissible) {
      sessionStorage.setItem('banner-dismissed', 'true');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getBannerStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'announcement':
      default:
        return 'bg-primary border-primary-600 text-white';
    }
  };

  if (!banner || !isVisible || isDismissed) {
    return null;
  }

  const bannerType = banner.settings?.type || 'announcement';
  const isDismissible = banner.settings?.dismissible ?? true;

  return (
    <div className={`border-b ${getBannerStyles(bannerType)} transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              {getIcon(bannerType)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                {banner.title && (
                  <p className="font-medium text-sm sm:text-base">
                    {banner.title}
                  </p>
                )}
                {banner.subtitle && (
                  <p className="text-sm opacity-90">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {isDismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Fermer la bannière"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;