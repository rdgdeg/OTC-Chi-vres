import React from 'react';
import { Link } from 'react-router-dom';
import { Place } from '../types';
import { MapPin, Star, Phone, Globe, Timer, Footprints, Mountain, Download, FileText, Eye } from 'lucide-react';

interface CardProps {
  place: Place;
}

const Card: React.FC<CardProps> = ({ place }) => {
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'shop': return 'Commerce';
      case 'restaurant': return 'Resto';
      case 'hotel': return 'Logement';
      case 'walk': return 'Balade';
      default: return 'Musée';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'walk': return 'text-green-600';
      case 'museum': return 'text-primary';
      case 'restaurant': return 'text-orange-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group touch-manipulation">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
            <span className={`bg-white/95 backdrop-blur-sm ${getTypeColor(place.type)} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
                {getTypeLabel(place.type)}
            </span>
        </div>
        {place.difficulty && (
           <div className="absolute bottom-4 left-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm ${
              place.difficulty === 'Facile' ? 'bg-green-100 text-green-700' : 
              place.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}>
                {place.difficulty}
            </span>
        </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 leading-tight">{place.name}</h3>
            {place.rating && (
                <div className="flex items-center text-secondary bg-yellow-50 px-2 py-1 rounded shrink-0 ml-2">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 text-sm font-bold">{place.rating}</span>
                </div>
            )}
        </div>

        {/* Walk Specifics */}
        {place.type === 'walk' && (
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4 text-slate-600 text-xs sm:text-sm bg-slate-50 p-2 sm:p-3 rounded-lg">
            <div className="flex items-center">
              <Footprints size={14} className="mr-1 sm:mr-1.5 text-primary" />
              <span className="font-medium">{place.distance}</span>
            </div>
            <div className="flex items-center">
              <Timer size={14} className="mr-1 sm:mr-1.5 text-primary" />
              <span className="font-medium">{place.duration}</span>
            </div>
          </div>
        )}
        
        <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow leading-relaxed line-clamp-3">
          {place.description}
        </p>

        <div className="space-y-2 mt-auto border-t border-slate-100 pt-3 sm:pt-4">
            <div className="flex items-start text-slate-500 text-xs sm:text-sm">
                <MapPin size={14} className="mr-2 mt-0.5 shrink-0 text-secondary" />
                <span className="line-clamp-2">{place.address}</span>
            </div>
            {place.phone && (
                <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                    <Phone size={14} className="mr-2 shrink-0 text-secondary" />
                    <a href={`tel:${place.phone}`} className="hover:text-primary transition-colors touch-manipulation">{place.phone}</a>
                </div>
            )}
            {place.website && (
                <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                    <Globe size={14} className="mr-2 shrink-0 text-secondary" />
                    <a href={place.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors touch-manipulation truncate">Visiter le site web</a>
                </div>
            )}
            
            {/* Download buttons for walks */}
            {place.type === 'walk' && ((place.downloadUrl && place.downloadUrl.trim() !== '') || (place.documentUrl && place.documentUrl.trim() !== '')) && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {place.downloadUrl && place.downloadUrl.trim() !== '' && (
                        <a 
                            href={place.downloadUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center justify-center bg-primary text-white text-xs sm:text-sm px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors touch-manipulation"
                        >
                            <Download size={14} className="mr-1.5" />
                            Télécharger le tracé
                        </a>
                    )}
                    {place.documentUrl && place.documentUrl.trim() !== '' && (
                        <a 
                            href={place.documentUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center justify-center bg-secondary text-white text-xs sm:text-sm px-3 py-2 rounded-lg hover:bg-secondary/90 transition-colors touch-manipulation"
                        >
                            <FileText size={14} className="mr-1.5" />
                            Document explicatif
                        </a>
                    )}
                </div>
            )}

            {/* Detail button for walks */}
            {place.type === 'walk' && (
                <div className="pt-3 border-t border-slate-100 mt-3">
                    <Link 
                        to={`/balades/${place.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors touch-manipulation text-sm font-medium"
                    >
                        <Eye size={14} />
                        Voir le détail
                    </Link>
                </div>
            )}
        </div>

        <div className="mt-3 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
            {place.tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] sm:text-xs px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors cursor-default">
                    #{tag}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Card;