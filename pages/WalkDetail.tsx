import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, MapPin, Clock, Footprints, Mountain, Download, FileText, Star, Phone, Globe, Camera } from 'lucide-react';

const WalkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { walks } = useData();
  
  const walk = walks.find(w => w.id === id);

  // Scroll vers le haut quand l'ID de la balade change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  if (!walk) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Balade non trouvée</h2>
          <p className="text-slate-600 mb-4">Cette balade n'existe pas ou a été supprimée.</p>
          <Link 
            to="/balades" 
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux balades
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-700 border-green-200';
      case 'Moyen': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Difficile': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={walk.imageUrl} 
          alt={walk.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/balades"
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux balades
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                  {walk.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm">{walk.address}</span>
                  </div>
                </div>
              </div>
              
              {/* Difficulty Badge */}
              <div className={`px-4 py-2 rounded-full border ${getDifficultyColor(walk.difficulty || 'Facile')}`}>
                <span className="font-medium text-sm">{walk.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Footprints className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Distance</h3>
                <p className="text-2xl font-bold text-primary">{walk.distance}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Durée</h3>
                <p className="text-2xl font-bold text-primary">{walk.duration}</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mountain className="text-orange-600" size={24} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Niveau</h3>
                <p className="text-lg font-bold text-primary">{walk.difficulty}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Description</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {walk.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {walk.tags && walk.tags.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {walk.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {walk.galleryImages && walk.galleryImages.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Camera size={20} />
                  Galerie photos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {walk.galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img 
                        src={image} 
                        alt={`${walk.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Download Actions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Téléchargements</h3>
              <div className="space-y-3">
                {walk.downloadUrl && walk.downloadUrl.trim() !== '' && (
                  <a 
                    href={walk.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Download size={18} />
                    <span className="font-medium">Télécharger le tracé</span>
                  </a>
                )}
                
                {walk.documentUrl && walk.documentUrl.trim() !== '' && (
                  <a 
                    href={walk.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-secondary text-slate-900 px-4 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <FileText size={18} />
                    <span className="font-medium">Document explicatif</span>
                  </a>
                )}
                
                {(!walk.downloadUrl || walk.downloadUrl.trim() === '') && (!walk.documentUrl || walk.documentUrl.trim() === '') && (
                  <p className="text-slate-500 text-sm italic">
                    Aucun téléchargement disponible pour cette balade.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Informations pratiques</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">Point de départ</p>
                    <p className="text-slate-600 text-sm">{walk.address}</p>
                  </div>
                </div>
                
                {walk.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <a 
                      href={`tel:${walk.phone}`}
                      className="text-primary hover:underline"
                    >
                      {walk.phone}
                    </a>
                  </div>
                )}
                
                {walk.website && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-slate-400 shrink-0" />
                    <a 
                      href={walk.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            {walk.rating && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Évaluation</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={20}
                        className={i < Math.floor(walk.rating!) ? 'text-yellow-400 fill-current' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-slate-800">{walk.rating}/5</span>
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Localisation</h3>
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MapPin size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Carte interactive</p>
                  <p className="text-xs">(À implémenter)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkDetail;