import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, Accommodation } from '../types';
import { UnifiedDataService } from '../services/unifiedDataService';

interface UnifiedDataContextType {
  // Données
  accommodations: Accommodation[];
  museums: Place[];
  restaurants: Place[];
  merchants: Place[];
  walks: Place[];
  homepageBlocks: any[];
  
  // État
  isLoading: boolean;
  lastSync: Date | null;
  
  // Actions
  refreshData: () => Promise<void>;
  forceSync: () => Promise<void>;
  
  // Getters spécialisés
  getAccommodationsByType: (type: string) => Accommodation[];
  getPublishedMuseums: () => Place[];
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État des données
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [museums, setMuseums] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [merchants, setMerchants] = useState<Place[]>([]);
  const [walks, setWalks] = useState<Place[]>([]);
  const [homepageBlocks, setHomepageBlocks] = useState<any[]>([]);
  
  // État de synchronisation
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Chargement initial
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Chargement des données unifiées...');
      
      const data = await UnifiedDataService.forceSync();
      
      setAccommodations(data.accommodations);
      setMuseums(data.museums);
      setRestaurants(data.restaurants);
      setMerchants(data.merchants);
      setWalks(data.walks);
      setHomepageBlocks(data.homepageBlocks);
      
      setLastSync(new Date());
      
      console.log('✅ Données unifiées chargées:', {
        accommodations: data.accommodations.length,
        museums: data.museums.length,
        restaurants: data.restaurants.length,
        merchants: data.merchants.length,
        walks: data.walks.length,
        homepageBlocks: data.homepageBlocks.length
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  const forceSync = async () => {
    console.log('🔧 Synchronisation forcée demandée...');
    await UnifiedDataService.ensurePublishedStatus();
    await loadAllData();
  };

  // Getters spécialisés
  const getAccommodationsByType = (type: string): Accommodation[] => {
    return accommodations.filter(acc => acc.type === type);
  };

  const getPublishedMuseums = (): Place[] => {
    return museums.filter(museum => 
      museum.status === 'published' || 
      museum.status === null || 
      museum.status === undefined
    );
  };

  const contextValue: UnifiedDataContextType = {
    // Données
    accommodations,
    museums,
    restaurants,
    merchants,
    walks,
    homepageBlocks,
    
    // État
    isLoading,
    lastSync,
    
    // Actions
    refreshData,
    forceSync,
    
    // Getters
    getAccommodationsByType,
    getPublishedMuseums
  };

  return (
    <UnifiedDataContext.Provider value={contextValue}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

export const useUnifiedData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};