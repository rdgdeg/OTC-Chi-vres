
import React, { useState } from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { MapPin, Image as ImageIcon, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generateMuseumImage } from '../services/geminiService';
import InteractiveMap from '../components/InteractiveMap';

const Museums: React.FC = () => {
  const { museums, pageContent, updateItem } = useData();
  const content = pageContent['museums'] || {};
  
  // State to track which museum is currently generating an image
  const [generatingId, setGeneratingId] = useState<string | null>(null);

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
            
            return (
              <div key={museum.id} className={`flex flex-col lg:flex-row gap-12 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                
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
                   
                   <button className="text-primary font-bold hover:text-secondary transition-colors uppercase text-sm tracking-wide border-b-2 border-primary hover:border-secondary pb-1">
                      En savoir plus
                   </button>
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
    </div>
  );
};

export default Museums;
