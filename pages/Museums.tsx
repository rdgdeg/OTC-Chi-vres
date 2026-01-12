
import React, { useState, useMemo, useEffect } from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Image as ImageIcon, Share2, Check, X, Globe, Phone, Clock, ExternalLink, Mail, Facebook, Instagram, Twitter, DollarSign, Info, Filter, Building, Landmark } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import { Place } from '../types';
import EditableImage from '../components/EditableImage';
import { museumSortService } from '../services/museumSortService';

const Museums: React.FC = () => {
  const { museums, pageContent, updateItem } = useData();
  const { hasPermission } = useAuth();
  
  // Vérifier si l'utilisateur peut éditer le contenu
  const canEdit = hasPermission('places', 'update');
  const content = pageContent['museums'] || {
    heroTitle: "Culture & Patrimoine",
    heroSubtitle: "Plongez au cœur de l'histoire.",
    heroImage: "https://picsum.photos/id/1050/1920/600",
    introTitle: "Nos lieux culturels",
    introText: "Découvrez nos musées..."
  };
  
  // State for filters
  const [activeFilter, setActiveFilter] = useState<'all' | 'musee' | 'patrimoine'>('all');
  
  // State for share feedback (fallback clipboard)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State for the Detail Modal
  const [selectedMuseum, setSelectedMuseum] = useState<Place | null>(null);
  
  // State for image gallery viewer
  const [galleryView, setGalleryView] = useState<{ museum: Place; imageIndex: number } | null>(null);

  // State for sorted museums
  const [sortedMuseums, setSortedMuseums] = useState<Place[]>([]);

  // Charger les musées triés
  useEffect(() => {
    const loadSortedMuseums = async () => {
      try {
        const sorted = await museumSortService.sortMuseums(museums);
        setSortedMuseums(sorted);
      } catch (error) {
        console.error('Erreur lors du tri des musées:', error);
        // Fallback sur tri alphabétique
        setSortedMuseums([...museums].sort((a, b) => a.name.localeCompare(b.name)));
      }
    };

    if (museums.length > 0) {
      loadSortedMuseums();
    }
  }, [museums]);

  // Filter museums based on category - utilise la même logique que le gestionnaire
  const filteredMuseums = useMemo(() => {
    let filtered = sortedMuseums;
    
    if (activeFilter !== 'all') {
      filtered = sortedMuseums.filter(museum => {
        const hasMuseumTag = museum.tags.some(tag => 
          tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
        );
        const hasPatrimoineTag = museum.tags.some(tag => 
          tag.toLowerCase().includes('patrimoine') || 
          tag.toLowerCase().includes('église') || 
          tag.toLowerCase().includes('chapelle') ||
          tag.toLowerCase().includes('monument') ||
          tag.toLowerCase().includes('architecture')
        );
        
        if (activeFilter === 'musee') return hasMuseumTag;
        if (activeFilter === 'patrimoine') return hasPatrimoineTag;
        
        return true;
      });
    }
    
    // Les musées sont déjà triés par le service
    return filtered;
  }, [sortedMuseums, activeFilter]);

  // Count items per category - utilise la même logique que le gestionnaire
  const categoryCounts = useMemo(() => {
    const getSubCategoryFromTags = (tags: string[]): 'musee' | 'patrimoine' | 'autre' => {
      const hasMuseumTag = tags.some(tag => 
        tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
      );
      const hasPatrimoineTag = tags.some(tag => 
        tag.toLowerCase().includes('patrimoine') || 
        tag.toLowerCase().includes('église') || 
        tag.toLowerCase().includes('chapelle') ||
        tag.toLowerCase().includes('monument') ||
        tag.toLowerCase().includes('architecture')
      );
      
      if (hasMuseumTag) return 'musee';
      if (hasPatrimoineTag) return 'patrimoine';
      return 'autre';
    };

    const museeCount = sortedMuseums.filter(museum => 
      getSubCategoryFromTags(museum.tags) === 'musee'
    ).length;
    
    const patrimoineCount = sortedMuseums.filter(museum => 
      getSubCategoryFromTags(museum.tags) === 'patrimoine'
    ).length;
    
    return { musee: museeCount, patrimoine: patrimoineCount, all: sortedMuseums.length };
  }, [sortedMuseums]);

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
        title={content.heroTitle || "Culture & Patrimoine"}
        subtitle={content.heroSubtitle || "Plongez au cœur de l'histoire."}
        imageUrl={content.heroImage || "https://picsum.photos/id/1050/1920/600"}
        height="medium"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10 sm:mb-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">{content.introTitle || "Nos lieux culturels"}</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto px-4">
                {content.introText || "Découvrez nos musées..."}
            </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Filter size={20} />
              <span className="font-medium">Filtrer par catégorie :</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'
              }`}
            >
              <span>Tout voir</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeFilter === 'all' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {categoryCounts.all}
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('musee')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all ${
                activeFilter === 'musee'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              <Building size={16} />
              <span>Musées</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeFilter === 'musee' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {categoryCounts.musee}
              </span>
            </button>
            
            <button
              onClick={() => setActiveFilter('patrimoine')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all ${
                activeFilter === 'patrimoine'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-600 hover:text-amber-600'
              }`}
            >
              <Landmark size={16} />
              <span>Patrimoine</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeFilter === 'patrimoine' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {categoryCounts.patrimoine}
              </span>
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-slate-500 text-sm">
            {filteredMuseums.length} {filteredMuseums.length === 1 ? 'lieu' : 'lieux'} 
            {activeFilter !== 'all' && (
              <span>
                {' '}dans la catégorie{' '}
                <span className="font-medium">
                  {activeFilter === 'musee' ? 'Musées' : 'Patrimoine'}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-12 sm:mb-20">
            <InteractiveMap 
              items={filteredMuseums} 
              height="300px" 
              onItemClick={(museum) => setSelectedMuseum(museum)}
            />
        </div>

        {/* Museums List */}
        {filteredMuseums.length === 0 ? (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeFilter === 'musee' ? <Building size={24} className="text-slate-400" /> : <Landmark size={24} className="text-slate-400" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucun lieu trouvé</h3>
            <p className="text-slate-500">
              Aucun {activeFilter === 'musee' ? 'musée' : 'site patrimonial'} ne correspond à votre recherche.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Voir tous les lieux
            </button>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16 md:space-y-24 animate-in fade-in duration-500">
            {filteredMuseums.map((museum, index) => {
              // Combine main image and gallery images for display
              const allImages = [museum.imageUrl, ...(museum.galleryImages || [])];
              const isCopied = copiedId === museum.id;
              
              return (
                <div 
                  key={museum.id} 
                  id={museum.id} 
                  className={`flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} animate-in slide-in-from-bottom duration-700`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  
                  {/* Text Content */}
                  <div className="w-full lg:w-1/2">
                     <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {museum.tags.map(tag => {
                          // Color code tags based on category
                          const isMuseumTag = tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum');
                          const isPatrimoineTag = tag.toLowerCase().includes('patrimoine') || 
                                                tag.toLowerCase().includes('église') || 
                                                tag.toLowerCase().includes('chapelle') ||
                                                tag.toLowerCase().includes('monument') ||
                                                tag.toLowerCase().includes('architecture') ||
                                                tag.toLowerCase().includes('gothique') ||
                                                tag.toLowerCase().includes('pèlerinage');
                          
                          let tagColor = 'bg-secondary/20 text-slate-900';
                          if (isMuseumTag) tagColor = 'bg-blue-100 text-blue-800 border border-blue-200';
                          if (isPatrimoineTag) tagColor = 'bg-amber-100 text-amber-800 border border-amber-200';
                          
                          return (
                            <span key={tag} className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 ${tagColor} rounded-full uppercase tracking-wider transition-all hover:scale-105`}>
                              {tag}
                            </span>
                          );
                        })}
                     </div>
                     
                     <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4 sm:mb-6 relative inline-block">
                        {museum.name}
                        <span className="absolute -bottom-2 left-0 w-10 sm:w-12 h-1 bg-secondary"></span>
                     </h3>
                     
                     <div className="flex items-start text-slate-500 mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
                        <MapPin size={16} className="mr-2 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{museum.address}</span>
                     </div>

                     <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 text-justify">
                        {museum.description}
                     </p>
                     
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                         <button 
                            onClick={() => setSelectedMuseum(museum)}
                            className="text-primary font-bold hover:text-secondary transition-colors uppercase text-xs sm:text-sm tracking-wide border-b-2 border-primary hover:border-secondary pb-1 text-center sm:text-left touch-manipulation"
                         >
                            En savoir plus
                         </button>

                         <button 
                           onClick={() => handleShare(museum)}
                           className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border touch-manipulation ${
                             isCopied 
                               ? 'bg-green-50 text-green-700 border-green-200' 
                               : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-primary active:scale-95'
                           }`}
                         >
                           {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                           <span>{isCopied ? 'Lien copié !' : 'Partager'}</span>
                         </button>
                     </div>
                  </div>

                  {/* Gallery & Main Image Grid */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center text-slate-800 font-bold text-sm sm:text-base">
                          <ImageIcon size={18} className="mr-2 text-secondary" />
                          <span>Galerie Photo</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 h-[300px] sm:h-[350px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-slate-100">
                      {/* Main Image (Large) - Editable */}
                      <div className="col-span-2 row-span-2">
                        <EditableImage
                          src={museum.imageUrl}
                          alt={museum.name}
                          onImageUpdate={async (newUrl) => {
                            await updateItem('museum', { ...museum, imageUrl: newUrl });
                          }}
                          folder="museums"
                          className="h-full cursor-pointer"
                          editable={canEdit}
                        />
                      </div>

                      {/* Secondary Images */}
                      {museum.galleryImages?.slice(0, 2).map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative h-full w-full overflow-hidden group cursor-pointer col-span-1 row-span-1 touch-manipulation"
                          onClick={() => setGalleryView({ museum, imageIndex: idx + 1 })}
                        >
                          <img 
                            src={`${img}?t=${Date.now()}`}
                            alt="Detail" 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                          </div>
                        </div>
                      )) || (
                        // Fillers if no gallery images
                        <>
                          <div className="bg-slate-200 flex items-center justify-center col-span-1 row-span-1"><ImageIcon size={20} className="text-slate-300"/></div>
                          <div className="bg-slate-200 flex items-center justify-center col-span-1 row-span-1"><ImageIcon size={20} className="text-slate-300"/></div>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-right italic">
                       {canEdit ? '* Survolez l\'image principale pour la modifier.' : '* Modification réservée aux administrateurs.'}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedMuseum && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMuseum(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg transition-colors touch-manipulation active:scale-95"
            >
              <X size={18} />
            </button>

            {/* Modal Hero Image */}
            <div className="relative h-48 sm:h-56 md:h-64 w-full shrink-0">
               <img src={selectedMuseum.imageUrl} alt={selectedMuseum.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-2 shadow-sm">{selectedMuseum.name}</h2>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedMuseum.tags.map(tag => (
                        <span key={tag} className="text-[10px] sm:text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md text-white rounded border border-white/30">
                            {tag}
                        </span>
                    ))}
                  </div>
               </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                
                {/* Intro / Description */}
                <div>
                   <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-3 flex items-center">
                      <Info className="mr-2 text-secondary" size={18}/> 
                      À propos
                   </h3>
                   <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify">
                      {selectedMuseum.description}
                      <br/><br/>
                      L'expérience offerte par {selectedMuseum.name} est unique en son genre. Que vous soyez passionné d'histoire, amateur d'art ou simplement curieux, ce lieu vous transportera à travers les époques. Les collections sont régulièrement mises à jour et des guides passionnés sont souvent disponibles pour enrichir votre visite.
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-slate-100">
                    
                    {/* Practical Info */}
                    <div className="space-y-3 sm:space-y-4">
                       <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-3">Informations Pratiques</h3>
                       
                       {selectedMuseum.address && (
                         <div className="flex items-start text-slate-600 text-sm sm:text-base">
                            <MapPin size={18} className="mr-2 sm:mr-3 text-primary shrink-0 mt-1" />
                            <span>{selectedMuseum.address}</span>
                         </div>
                       )}
                       
                       {selectedMuseum.openingHours && (
                         <div className="flex items-start text-slate-600 text-sm sm:text-base">
                            <Clock size={18} className="mr-2 sm:mr-3 text-primary shrink-0 mt-1" />
                            <span className="whitespace-pre-line">{selectedMuseum.openingHours}</span>
                         </div>
                       )}

                       {selectedMuseum.price && (
                         <div className="flex items-start text-slate-600 text-sm sm:text-base">
                            <DollarSign size={18} className="mr-2 sm:mr-3 text-primary shrink-0 mt-1" />
                            <span className="whitespace-pre-line">{selectedMuseum.price}</span>
                         </div>
                       )}

                       {selectedMuseum.phone && (
                           <div className="flex items-center text-slate-600 hover:text-primary transition-colors text-sm sm:text-base">
                              <Phone size={18} className="mr-2 sm:mr-3 text-primary shrink-0" />
                              <a href={`tel:${selectedMuseum.phone}`} className="touch-manipulation">{selectedMuseum.phone}</a>
                           </div>
                       )}

                       {selectedMuseum.email && (
                           <div className="flex items-center text-slate-600 hover:text-primary transition-colors text-sm sm:text-base">
                              <Mail size={18} className="mr-2 sm:mr-3 text-primary shrink-0" />
                              <a href={`mailto:${selectedMuseum.email}`} className="touch-manipulation truncate">{selectedMuseum.email}</a>
                           </div>
                       )}

                       {selectedMuseum.website && (
                           <div className="flex items-center text-slate-600 hover:text-primary transition-colors text-sm sm:text-base">
                              <Globe size={18} className="mr-2 sm:mr-3 text-primary shrink-0" />
                              <a href={selectedMuseum.website} target="_blank" rel="noopener noreferrer" className="touch-manipulation truncate">Site web</a>
                           </div>
                       )}

                       {/* Social Media */}
                       {(selectedMuseum.facebook || selectedMuseum.instagram || selectedMuseum.twitter) && (
                         <div className="flex items-center space-x-3 pt-2">
                           {selectedMuseum.facebook && (
                             <a href={selectedMuseum.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                               <Facebook size={20} />
                             </a>
                           )}
                           {selectedMuseum.instagram && (
                             <a href={selectedMuseum.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-pink-600 transition-colors">
                               <Instagram size={20} />
                             </a>
                           )}
                           {selectedMuseum.twitter && (
                             <a href={selectedMuseum.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400 transition-colors">
                               <Twitter size={20} />
                             </a>
                           )}
                         </div>
                       )}

                       {selectedMuseum.practicalInfo && (
                         <div className="flex items-start text-slate-600 text-sm sm:text-base pt-2 border-t border-slate-100">
                            <Info size={18} className="mr-2 sm:mr-3 text-primary shrink-0 mt-1" />
                            <span className="whitespace-pre-line">{selectedMuseum.practicalInfo}</span>
                         </div>
                       )}
                    </div>

                    {/* Actions / Map Placeholder */}
                    <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100 flex flex-col items-center text-center justify-center">
                        <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Planifier votre visite</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
                            Consultez l'itinéraire et préparez votre venue dès maintenant.
                        </p>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMuseum.name + ' ' + selectedMuseum.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-primary text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center shadow-lg touch-manipulation text-sm sm:text-base"
                        >
                            <MapPin size={16} className="mr-2" />
                            Voir sur Google Maps
                        </a>
                        {selectedMuseum.website && (
                            <a 
                            href={selectedMuseum.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 w-full bg-white text-slate-700 border border-slate-200 font-bold py-2.5 sm:py-3 rounded-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center touch-manipulation text-sm sm:text-base"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Site Web
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-100 text-center sm:text-right sticky bottom-0">
                <button 
                  onClick={() => setSelectedMuseum(null)}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 text-slate-600 font-bold hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors touch-manipulation text-sm sm:text-base"
                >
                  Fermer
                </button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY VIEWER - Full Screen */}
      {galleryView && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setGalleryView(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Previous Button */}
            {galleryView.imageIndex > 0 && (
              <button
                onClick={() => setGalleryView({ ...galleryView, imageIndex: galleryView.imageIndex - 1 })}
                className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <img
              src={galleryView.imageIndex === 0 
                ? `${galleryView.museum.imageUrl}?t=${Date.now()}`
                : `${galleryView.museum.galleryImages?.[galleryView.imageIndex - 1]}?t=${Date.now()}`
              }
              alt={galleryView.museum.name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next Button */}
            {galleryView.imageIndex < (galleryView.museum.galleryImages?.length || 0) && (
              <button
                onClick={() => setGalleryView({ ...galleryView, imageIndex: galleryView.imageIndex + 1 })}
                className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {galleryView.imageIndex + 1} / {(galleryView.museum.galleryImages?.length || 0) + 1}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Museums;
