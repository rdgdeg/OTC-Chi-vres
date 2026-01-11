// Service de géocodage pour convertir les adresses en coordonnées GPS
export class GeocodingService {
  
  // Géocodage via l'API Nominatim (OpenStreetMap) - gratuite
  static async geocodeAddress(address: string, village?: string): Promise<{lat: number, lng: number} | null> {
    try {
      // Construire l'adresse complète
      const fullAddress = village ? `${address}, ${village}, Chièvres, Belgique` : `${address}, Chièvres, Belgique`;
      
      // Encoder l'adresse pour l'URL
      const encodedAddress = encodeURIComponent(fullAddress);
      
      // Appel à l'API Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=be`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors du géocodage');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  }
  
  // Coordonnées par défaut pour Chièvres
  static getDefaultCoordinates(): {lat: number, lng: number} {
    return {
      lat: 50.5897, // Chièvres centre
      lng: 3.8014
    };
  }
  
  // Géocodage avec fallback vers les coordonnées par défaut
  static async geocodeWithFallback(address: string, village?: string): Promise<{lat: number, lng: number}> {
    const coords = await this.geocodeAddress(address, village);
    return coords || this.getDefaultCoordinates();
  }
  
  // Géocodage en lot pour plusieurs hébergements
  static async geocodeAccommodations(accommodations: Array<{id: string, address: string, village?: string}>): Promise<Array<{id: string, lat: number, lng: number}>> {
    const results = [];
    
    for (const accommodation of accommodations) {
      console.log(`Géocodage de: ${accommodation.address}`);
      
      const coords = await this.geocodeWithFallback(accommodation.address, accommodation.village);
      results.push({
        id: accommodation.id,
        lat: coords.lat,
        lng: coords.lng
      });
      
      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}