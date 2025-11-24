
import React, { useState } from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { MapPin, Image as ImageIcon, Sparkles, Loader2, Share2, Check, X, Globe, Phone, Clock, ExternalLink } from 'lucide-react';
import { generateMuseumImage } from '../services/geminiService';
import InteractiveMap from '../components/InteractiveMap';
import { Place } from '../types';

const Museums: React.FC = () => {
  const { museums, pageContent, updateItem } = useData();
  const content = pageContent['museums'] || {};
  
  // State to track which museum is currently generating an image
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  // State for share feedback (fallback clipboard)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State for the Detail Modal
  const [selectedMuseum, setSelectedMuseum] = useState<Place | null>(null);

  const handleGenerateImage = async (museum: any) => {
    setGeneratingId(museum.id);
    
    // Fallback placeholder
    const placeholderUrl = "https://placehold.co/800x600?text=Image+Indisponible";

    try {
      const generatedImage = await generateMuseumImage(museum.name, museum.description);
      
      if (generatedImage) {
        updateItem('museum', { ...museum, imageUrl: generatedImage });
      } else {
        // Use placeholder if generation fails but logic ran
        alert("La génération a échoué. Utilisation d'un placeholder.");
        updateItem('museum', { ...museum, imageUrl: placeholderUrl });
      }
    } catch (e) {
      console.error(e);
      updateItem('museum', { ...museum, imageUrl: placeholderUrl });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleShare = async (museum: any) => {
    // Generate URL with anchor to specific museum
    const url = `${window.location.origin}${window.location.pathname}#${museum.id}`;

    const shareData = {
      title: museum.name,
      text: `Découvrez ${museum.name} à Chièvres ! ${museum.description.substring(0, 80)}...`,
      url: url // Partage l'URL spécifique avec ancre
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Partage annulé ou erreur', err);
      }
    } else {
      // Fallback pour Desktop : Copie dans le presse-papier
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setCopiedId(museum.id);
        setTimeout(() => setCopiedId(null), 3000);
      } catch (err) {
        alert("Impossible de copier le lien.");
      }
    }
  };

  return (
    <div>
      <Hero 
        title={content.heroTitle || "Musées & Patrimoine"}
        subtitle={content.heroSubtitle || "Plongez au cœur de l'histoire."}
        imageUrl={content.heroImage || "https://picsum.photos/id/1050/1920/600"}
        height="medium"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">{content.introTitle || "Nos lieux culturels"}</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
                {content.introText || "Découvrez nos musées..."}
            </p>
        </div>

        {/* Map Section */}
        <div className="mb-20">
            <InteractiveMap items={museums} />
        </div>

        <div className="space-y-24">
          {museums.map((museum, index) => {
            // Combine main image and gallery images for display
            const allImages = [museum.imageUrl, ...(museum.galleryImages || [])];
            const isGenerating = generatingId === museum.id;
            const isCopied = copiedId === museum.id;
            
            return (
              <div key={museum.id} id={museum.id} className={`flex flex-col lg:flex-row gap-12 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Text Content */}
                <div className="w-full lg:w-1/2">
                   <div className="flex flex-wrap gap-2 mb-4">
                      {museum.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold px-3 py-1 bg-secondary/20 text-slate-900 rounded-full uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                   </div>
                   
                   <h3 className="text-4xl font-serif font-bold text-slate-800 mb-6 relative inline-block">
                      {museum.name}
                      <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary"></span>
                   </h3>
                   
                   <div className="flex items-center text-slate-500 mb-6 text-sm font-medium">
                      <MapPin size={18} className="mr-2 text-primary" />
                      {museum.address}
                   </div>

                   <p className="text-slate-600 text-lg leading-relaxed mb-8 text-justify">
                      {museum.description}
                   </p>
                   
                   <div className="flex items-center gap-4">
                       <button 
                          onClick={() => setSelectedMuseum(museum)}
                          className="text-primary font-bold hover:text-secondary transition-colors uppercase text-sm tracking-wide border-b-2 border-primary hover:border-secondary pb-1"
                       >
                          En savoir plus
                       </button>

                       <button 
                         onClick={() => handleShare(museum)}
                         className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                           isCopied 
                             ? 'bg-green-50 text-green-700 border-green-200' 
                             : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-primary'
                         }`}
                       >
                         {isCopied ? <Check size={16} /> : <Share2 size={16} />}
                         <span>{isCopied ? 'Lien copié !' : 'Partager'}</span>
                       </button>
                   </div>
                </div>

                {/* Gallery & Main Image Grid */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-slate-800 font-bold">
                        <ImageIcon size={20} className="mr-2 text-secondary" />
                        <span>Galerie Photo</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[400px] rounded-2xl overflow-hidden shadow-xl bg-slate-100">
                    {/* Main Image (Large) */}
                    <div className="relative h-full w-full overflow-hidden group col-span-2 row-span-2">
                         <img 
                            src={museum.imageUrl} 
                            alt={museum.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isGenerating ? 'opacity-50 blur-sm' : 'group-hover:scale-105'}`}
                          />
                          
                          {/* AI Generation Button Overlay */}
                          <div className="absolute top-4 right-4 z-20">
                              <button 
                                onClick={() => handleGenerateImage(museum)}
                                disabled={isGenerating}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${
                                  isGenerating 
                                    ? 'bg-slate-800 text-white cursor-wait' 
                                    : 'bg-white/90 hover:bg-white text-primary hover:text-secondary backdrop-blur-sm'
                                }`}
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Création...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={14} />
                                    <span>Générer IA</span>
                                  </>
                                )}
                              </button>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    {/* Secondary Images */}
                    {museum.galleryImages?.slice(0, 2).map((img, idx) => (
                      <div key={idx} className="relative h-full w-full overflow-hidden group cursor-pointer col-span-1 row-span-1">
                        <img 
                          src={img} 
                          alt="Detail" 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                    )) || (
                      // Fillers if no gallery images
                      <>
                        <div className="bg-slate-200 flex items-center justify-center col-span-1 row-span-1"><ImageIcon className="text-slate-300"/></div>
                        <div className="bg-slate-200 flex items-center justify-center col-span-1 row-span-1"><ImageIcon className="text-slate-300"/></div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right italic">
                     * Utilisez le bouton "Générer IA" si la photo ne correspond pas.
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedMuseum && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMuseum(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Hero Image */}
            <div className="relative h-64 w-full shrink-0">
               <img src={selectedMuseum.imageUrl} alt={selectedMuseum.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-serif font-bold text-white mb-2 shadow-sm">{selectedMuseum.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedMuseum.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md text-white rounded border border-white/30">
                            {tag}
                        </span>
                    ))}
                  </div>
               </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
                
                {/* Intro / Description */}
                <div>
                   <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center">
                      <Sparkles className="mr-2 text-secondary" size={20}/> 
                      À propos
                   </h3>
                   <p className="text-slate-600 leading-relaxed text-justify">
                      {selectedMuseum.description}
                      <br/><br/>
                      L'expérience offerte par {selectedMuseum.name} est unique en son genre. Que vous soyez passionné d'histoire, amateur d'art ou simplement curieux, ce lieu vous transportera à travers les époques. Les collections sont régulièrement mises à jour et des guides passionnés sont souvent disponibles pour enrichir votre visite.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                    
                    {/* Practical Info */}
                    <div className="space-y-4">
                       <h3 className="font-bold text-slate-800 text-lg mb-3">Informations Pratiques</h3>
                       
                       <div className="flex items-start text-slate-600">
                          <MapPin size={20} className="mr-3 text-primary shrink-0 mt-1" />
                          <span>{selectedMuseum.address}</span>
                       </div>
                       
                       <div className="flex items-center text-slate-600">
                          <Clock size={20} className="mr-3 text-primary shrink-0" />
                          <span>Ouvert du Mardi au Dimanche<br/><span className="text-sm text-slate-500">10h00 - 18h00 (Dernière entrée 17h)</span></span>
                       </div>

                       {selectedMuseum.phone && (
                           <div className="flex items-center text-slate-600 hover:text-primary transition-colors">
                              <Phone size={20} className="mr-3 text-primary shrink-0" />
                              <a href={`tel:${selectedMuseum.phone}`}>{selectedMuseum.phone}</a>
                           </div>
                       )}

                       {selectedMuseum.website && (
                           <div className="flex items-center text-slate-600 hover:text-primary transition-colors">
                              <Globe size={20} className="mr-3 text-primary shrink-0" />
                              <a href={selectedMuseum.website} target="_blank" rel="noopener noreferrer">Visiter le site officiel</a>
                           </div>
                       )}
                    </div>

                    {/* Actions / Map Placeholder */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col items-center text-center justify-center">
                        <h4 className="font-bold text-slate-800 mb-2">Planifier votre visite</h4>
                        <p className="text-sm text-slate-500 mb-6">
                            Consultez l'itinéraire et préparez votre venue dès maintenant.
                        </p>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMuseum.name + ' ' + selectedMuseum.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg"
                        >
                            <MapPin size={18} className="mr-2" />
                            Voir sur Google Maps
                        </a>
                        {selectedMuseum.website && (
                            <a 
                            href={selectedMuseum.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 w-full bg-white text-slate-700 border border-slate-200 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center"
                            >
                                <ExternalLink size={18} className="mr-2" />
                                Site Web
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setSelectedMuseum(null)}
                  className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Fermer
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Museums;
