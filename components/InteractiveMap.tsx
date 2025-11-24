
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '../types';

interface InteractiveMapProps {
  items: Place[];
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ items, height = '400px' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState(false);

  // Token Mapbox fourni
  const MAPBOX_TOKEN = 'pk.eyJ1IjoicmRnZGVnIiwiYSI6ImNtaWJ1dTR4NTA1d3gybHF6OTRqd3R1ZHYifQ.C8-jjFMIF80CPjH9wtGbOQ';

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    try {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [3.8075, 50.5891], // Centré par défaut sur Chièvres
          zoom: 12,
          cooperativeGestures: true // Permet de scroller la page sans rester coincé dans la carte sur mobile
        });

        // Contrôles de navigation (zoom, rotation)
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Échelle métrique
        map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' }));

        // Gestion du redimensionnement responsive
        const resizeObserver = new ResizeObserver(() => {
            map.current?.resize();
        });
        resizeObserver.observe(mapContainer.current);

        return () => {
            resizeObserver.disconnect();
        };

    } catch (error) {
        console.error("Failed to initialize Mapbox map:", error);
        setMapError(true);
    }
  }, []);

  useEffect(() => {
    if (!map.current) return;

    try {
        // Supprimer les anciens marqueurs
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Ajouter les nouveaux marqueurs
        items.forEach(place => {
          if (place.lat && place.lng) {
            // Création de la Popup avec image et style
            const popupContent = `
              <div class="text-slate-800 font-sans min-w-[200px]">
                ${place.imageUrl ? 
                  `<div class="h-32 w-full mb-2 rounded bg-slate-100 overflow-hidden -mt-1">
                      <img src="${place.imageUrl}" alt="${place.name}" class="h-full w-full object-cover" style="display:block;" />
                   </div>` : ''
                }
                <h3 class="font-bold text-sm mb-1 leading-tight">${place.name}</h3>
                <p class="text-xs text-slate-600 mb-2 line-clamp-1">${place.address}</p>
                <span class="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-600 uppercase tracking-wide">${place.type}</span>
              </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '240px' }).setHTML(popupContent);

            // Couleur du marqueur selon le type
            let color = '#1a5f7a'; // Par défaut (Primary)
            switch(place.type) {
                case 'restaurant': case 'cafe': color = '#e8af30'; break; // Secondary
                case 'producer': color = '#16a34a'; break; // Green
                case 'shop': color = '#f97316'; break; // Orange
                case 'hotel': color = '#8b5cf6'; break; // Violet
                case 'walk': color = '#059669'; break; // Emerald
            }

            const marker = new mapboxgl.Marker({ color: color })
              .setLngLat([place.lng, place.lat])
              .setPopup(popup)
              .addTo(map.current!);

            markers.current.push(marker);
          }
        });

        // Ajuster la vue (Bounds)
        if (items.length > 0 && map.current) {
            const bounds = new mapboxgl.LngLatBounds();
            let hasValidCoords = false;

            items.forEach(place => {
                if(place.lng && place.lat) {
                    bounds.extend([place.lng, place.lat]);
                    hasValidCoords = true;
                }
            });

            if (hasValidCoords) {
                // Si un seul point, on centre et zoom modérément
                if (items.length === 1 && items[0].lat && items[0].lng) {
                    map.current.flyTo({ center: [items[0].lng, items[0].lat], zoom: 15 });
                } else {
                    // Sinon on englobe tous les points avec du padding
                    map.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });
                }
            }
        } else {
             // Retour à Chièvres si aucun élément
             map.current.flyTo({ center: [3.8075, 50.5891], zoom: 12 });
        }
    } catch (error) {
        console.error("Error updating map markers:", error);
    }

  }, [items]);

  if (mapError) {
      return (
        <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 my-8 bg-slate-50 flex items-center justify-center" style={{ height: height }}>
            <div className="text-center p-4">
                <p className="text-slate-500 font-bold mb-2">Carte indisponible</p>
                <p className="text-xs text-slate-400">Vérifiez votre connexion</p>
            </div>
        </div>
      );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 my-8 bg-slate-100 relative group">
        <div ref={mapContainer} style={{ height: height, width: '100%' }} />
        <div className="absolute bottom-1 left-2 text-[10px] text-slate-500 bg-white/80 px-1 rounded pointer-events-none z-10">
            Mapbox
        </div>
    </div>
  );
};

export default InteractiveMap;
