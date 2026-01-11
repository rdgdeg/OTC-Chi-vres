import React from 'react';
import { Accommodation } from '../types';
import { MapPin, Star, Phone, Globe, Users, Bed, Mail, Facebook } from 'lucide-react';
import EditableImage from './EditableImage';

interface AccommodationCardProps {
  accommodation: Accommodation;
  editable?: boolean;
  onImageUpdate?: (newUrl: string) => Promise<void>;
  onClick?: () => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ 
  accommodation, 
  editable = false, 
  onImageUpdate,
  onClick 
}) => {
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'bed_breakfast': return 'B&B';
      case 'gite': return 'Gîte';
      case 'hotel': return 'Hôtel';
      case 'camping': return 'Camping';
      case 'unusual': return 'Insolite';
      default: return 'Hébergement';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'bed_breakfast': return 'text-blue-600';
      case 'gite': return 'text-green-600';
      case 'hotel': return 'text-purple-600';
      case 'camping': return 'text-orange-600';
      case 'unusual': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group touch-manipulation cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {editable && onImageUpdate ? (
          <EditableImage
            src={accommodation.featured_image || 'https://picsum.photos/600/400?grayscale'}
            alt={accommodation.name}
            onImageUpdate={onImageUpdate}
            folder="accommodations"
            className="h-full"
          />
        ) : (
          <img 
            src={accommodation.featured_image || 'https://picsum.photos/600/400?grayscale'} 
            alt={accommodation.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        )}
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`bg-white/95 backdrop-blur-sm ${getTypeColor(accommodation.type)} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
            {getTypeLabel(accommodation.type)}
          </span>
        </div>
        
        {/* Capacity Badge */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
            <Users size={12} className="mr-1" />
            {accommodation.capacity}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 leading-tight">
            {accommodation.name}
          </h3>
          {accommodation.rating && (
            <div className="flex items-center text-secondary bg-yellow-50 px-2 py-1 rounded shrink-0 ml-2">
              <Star size={14} fill="currentColor" />
              <span className="ml-1 text-sm font-bold">{accommodation.rating}</span>
            </div>
          )}
        </div>

        {/* Accommodation Specifics */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4 text-slate-600 text-xs sm:text-sm bg-slate-50 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center">
            <Users size={14} className="mr-1 sm:mr-1.5 text-primary" />
            <span className="font-medium">{accommodation.capacity} personnes</span>
          </div>
          {accommodation.bedrooms && (
            <div className="flex items-center">
              <Bed size={14} className="mr-1 sm:mr-1.5 text-primary" />
              <span className="font-medium">{accommodation.bedrooms} chambres</span>
            </div>
          )}
        </div>
        
        <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow leading-relaxed line-clamp-3">
          {accommodation.excerpt || accommodation.description}
        </p>

        {/* Features */}
        {accommodation.features && accommodation.features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Ce que vous aimerez :</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              {accommodation.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {accommodation.features.length > 3 && (
                <li className="text-primary text-xs font-medium">
                  +{accommodation.features.length - 3} autres avantages
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="space-y-2 mt-auto border-t border-slate-100 pt-3 sm:pt-4">
          <div className="flex items-start text-slate-500 text-xs sm:text-sm">
            <MapPin size={14} className="mr-2 mt-0.5 shrink-0 text-secondary" />
            <span className="line-clamp-2">
              {accommodation.address}
              {accommodation.village && (
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                  {accommodation.village}
                </span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500 text-xs sm:text-sm">
            {accommodation.phone && (
              <a 
                href={`tel:${accommodation.phone}`} 
                className="flex items-center hover:text-primary transition-colors touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={14} className="mr-1 shrink-0" />
                <span className="hidden sm:inline">{accommodation.phone}</span>
              </a>
            )}
            {accommodation.email && (
              <a 
                href={`mailto:${accommodation.email}`} 
                className="flex items-center hover:text-primary transition-colors touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail size={14} className="mr-1 shrink-0" />
                <span className="hidden sm:inline">Email</span>
              </a>
            )}
            {accommodation.website && (
              <a 
                href={accommodation.website} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center hover:text-primary transition-colors touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe size={14} className="mr-1 shrink-0" />
                <span className="hidden sm:inline">Site web</span>
              </a>
            )}
            {accommodation.facebook && (
              <a 
                href={accommodation.facebook} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center hover:text-primary transition-colors touch-manipulation"
                onClick={(e) => e.stopPropagation()}
              >
                <Facebook size={14} className="mr-1 shrink-0" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;