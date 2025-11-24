
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, Experience, Event, Article, Product, PageContent } from '../types';
import { MUSEUMS, RESTAURANTS, ACCOMMODATION, MERCHANTS, WALKS, EXPERIENCES, EVENTS, ARTICLES, PRODUCTS, PAGES_CONTENT } from '../data/mockData';

interface DataContextType {
  museums: Place[];
  restaurants: Place[];
  accommodation: Place[];
  merchants: Place[];
  walks: Place[];
  experiences: Experience[];
  events: Event[];
  articles: Article[];
  products: Product[];
  pageContent: Record<string, PageContent>;
  updateItem: (type: string, item: any) => void;
  addItem: (type: string, item: any) => void;
  deleteItem: (type: string, id: string) => void;
  updatePageContent: (id: string, content: PageContent) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or fallback to mockData
  const usePersistedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (e) {
        console.warn(`Error reading ${key} from localStorage`, e);
        return defaultValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error: any) {
        // Handle QuotaExceededError specifically
        if (
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          console.warn(`LocalStorage quota exceeded for key "${key}". Data will be available in session but not persisted.`);
        } else {
          // Log only the message to avoid potential DataCloneError/cloning issues with the error object
          console.error(`Error saving ${key} to localStorage: ${error.message || 'Unknown error'}`);
        }
      }
    }, [key, state]);

    return [state, setState];
  };

  const [museums, setMuseums] = usePersistedState('cms_museums', MUSEUMS);
  const [restaurants, setRestaurants] = usePersistedState('cms_restaurants', RESTAURANTS);
  const [accommodation, setAccommodation] = usePersistedState('cms_accommodation', ACCOMMODATION);
  const [merchants, setMerchants] = usePersistedState('cms_merchants', MERCHANTS);
  const [walks, setWalks] = usePersistedState('cms_walks', WALKS);
  const [experiences, setExperiences] = usePersistedState('cms_experiences', EXPERIENCES);
  const [events, setEvents] = usePersistedState('cms_events', EVENTS);
  const [articles, setArticles] = usePersistedState('cms_articles', ARTICLES);
  const [products, setProducts] = usePersistedState('cms_products', PRODUCTS);
  const [pageContent, setPageContent] = usePersistedState('cms_pages_content', PAGES_CONTENT);

  const updateItem = (type: string, updatedItem: any) => {
    switch (type) {
      case 'museum': setMuseums(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'restaurant': setRestaurants(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'hotel': setAccommodation(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'shop': setMerchants(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'walk': setWalks(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'experience': setExperiences(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'event': setEvents(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'article': setArticles(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
      case 'product': setProducts(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i)); break;
    }
  };

  const addItem = (type: string, newItem: any) => {
    switch (type) {
      case 'museum': setMuseums(prev => [...prev, newItem]); break;
      case 'restaurant': setRestaurants(prev => [...prev, newItem]); break;
      case 'hotel': setAccommodation(prev => [...prev, newItem]); break;
      case 'shop': setMerchants(prev => [...prev, newItem]); break;
      case 'walk': setWalks(prev => [...prev, newItem]); break;
      case 'experience': setExperiences(prev => [...prev, newItem]); break;
      case 'event': setEvents(prev => [...prev, newItem]); break;
      case 'article': setArticles(prev => [...prev, newItem]); break;
      case 'product': setProducts(prev => [...prev, newItem]); break;
    }
  };

  const deleteItem = (type: string, id: string) => {
    switch (type) {
      case 'museum': setMuseums(prev => prev.filter(i => i.id !== id)); break;
      case 'restaurant': setRestaurants(prev => prev.filter(i => i.id !== id)); break;
      case 'hotel': setAccommodation(prev => prev.filter(i => i.id !== id)); break;
      case 'shop': setMerchants(prev => prev.filter(i => i.id !== id)); break;
      case 'walk': setWalks(prev => prev.filter(i => i.id !== id)); break;
      case 'experience': setExperiences(prev => prev.filter(i => i.id !== id)); break;
      case 'event': setEvents(prev => prev.filter(i => i.id !== id)); break;
      case 'article': setArticles(prev => prev.filter(i => i.id !== id)); break;
      case 'product': setProducts(prev => prev.filter(i => i.id !== id)); break;
    }
  };

  const updatePageContent = (id: string, content: PageContent) => {
    setPageContent(prev => ({
      ...prev,
      [id]: content
    }));
  };

  const resetData = () => {
    if(window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs par défaut ?")) {
        localStorage.clear();
        window.location.reload();
    }
  }

  return (
    <DataContext.Provider value={{
      museums, restaurants, accommodation, merchants, walks, experiences, events, articles, products, pageContent,
      updateItem, addItem, deleteItem, updatePageContent, resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
