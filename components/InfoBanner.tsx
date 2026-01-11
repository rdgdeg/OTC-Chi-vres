import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface InfoBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'announcement';
  dismissible?: boolean;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ 
  message, 
  type = 'info', 
  dismissible = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColor = {
    info: 'bg-blue-600',
    warning: 'bg-orange-600',
    announcement: 'bg-primary'
  }[type];

  return (
    <div className={`${bgColor} text-white py-2 px-4 relative overflow-hidden`}>
      <div className="container mx-auto flex items-center justify-center relative">
        <div className="flex items-center space-x-2">
          <AlertCircle size={16} className="shrink-0" />
          <div className="text-sm font-medium text-center animate-pulse">
            {message}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Fermer l'annonce"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Animation de défilement pour les messages longs */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-30"></div>
    </div>
  );
};

export default InfoBanner;