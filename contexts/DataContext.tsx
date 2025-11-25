
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, Experience, Event, Article, Product, PageContent } from '../types';
import { MUSEUMS, RESTAURANTS, ACCOMMODATION, MERCHANTS, WALKS, EXPERIENCES, EVENTS, ARTICLES, PRODUCTS, PAGES_CONTENT } from '../data/mockData';
import { supabase } from '../services/supabaseClient';

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
  isLoading: boolean;
  updateItem: (type: string, item: any) => Promise<void>;
  addItem: (type: string, item: any) => Promise<void>;
  deleteItem: (type: string, id: string) => Promise<void>;
  updatePageContent: (id: string, content: PageContent) => Promise<void>;
  syncMockDataToSupabase: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state mirrors of the DB data
  const [museums, setMuseums] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [accommodation, setAccommodation] = useState<Place[]>([]);
  const [merchants, setMerchants] = useState<Place[]>([]);
  const [walks, setWalks] = useState<Place[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageContent, setPageContent] = useState<Record<string, PageContent>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    try {
      // 1. Fetch Places (Museums, Restos, etc.)
      const { data: placesData, error: placesError } = await supabase.from('places').select('*');
      
      if (placesData && placesData.length > 0) {
        setMuseums(placesData.filter((p: any) => p.type === 'museum'));
        setRestaurants(placesData.filter((p: any) => p.type === 'restaurant' || p.type === 'cafe'));
        setAccommodation(placesData.filter((p: any) => p.type === 'hotel'));
        setMerchants(placesData.filter((p: any) => p.type === 'shop' || p.type === 'producer'));
        setWalks(placesData.filter((p: any) => p.type === 'walk'));
      } else {
        // Fallback to Mock Data if DB is empty or error
        setMuseums(MUSEUMS);
        setRestaurants(RESTAURANTS);
        setAccommodation(ACCOMMODATION);
        setMerchants(MERCHANTS);
        setWalks(WALKS);
      }

      // 2. Fetch Experiences
      const { data: expData } = await supabase.from('experiences').select('*');
      if (expData && expData.length > 0) {
        setExperiences(expData);
      } else {
        setExperiences(EXPERIENCES);
      }

      // 3. Fetch Events
      const { data: eventsData } = await supabase.from('events').select('*');
      if (eventsData && eventsData.length > 0) {
        setEvents(eventsData);
      } else {
        setEvents(EVENTS);
      }

      // 4. Fetch Articles
      const { data: articlesData } = await supabase.from('articles').select('*');
      if (articlesData && articlesData.length > 0) {
        setArticles(articlesData);
      } else {
        setArticles(ARTICLES);
      }

      // 5. Fetch Products
      const { data: productsData } = await supabase.from('products').select('*');
      if (productsData && productsData.length > 0) {
        setProducts(productsData);
      } else {
        setProducts(PRODUCTS);
      }

      // 6. Fetch Page Content
      const { data: pageData } = await supabase.from('page_content').select('*');
      if (pageData && pageData.length > 0) {
        const contentMap: Record<string, PageContent> = {};
        pageData.forEach((p: any) => {
          contentMap[p.id] = p;
        });
        setPageContent(contentMap);
      } else {
        setPageContent(PAGES_CONTENT);
      }

    } catch (error) {
      console.error("Error fetching data from Supabase, using mock data:", error);
      // Fallback in case of catastrophe
      setMuseums(MUSEUMS);
      setRestaurants(RESTAURANTS);
      setAccommodation(ACCOMMODATION);
      setMerchants(MERCHANTS);
      setWalks(WALKS);
      setExperiences(EXPERIENCES);
      setEvents(EVENTS);
      setArticles(ARTICLES);
      setProducts(PRODUCTS);
      setPageContent(PAGES_CONTENT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to determine table name based on item type
  const getTableNameAndType = (type: string): { table: string, dbType?: string } => {
    switch (type) {
      case 'museum': return { table: 'places', dbType: 'museum' };
      case 'restaurant': return { table: 'places', dbType: 'restaurant' }; // or cafe
      case 'cafe': return { table: 'places', dbType: 'cafe' };
      case 'hotel': return { table: 'places', dbType: 'hotel' };
      case 'shop': return { table: 'places', dbType: 'shop' };
      case 'producer': return { table: 'places', dbType: 'producer' };
      case 'walk': return { table: 'places', dbType: 'walk' };
      case 'experience': return { table: 'experiences' };
      case 'event': return { table: 'events' };
      case 'article': return { table: 'articles' };
      case 'product': return { table: 'products' };
      default: return { table: 'places', dbType: 'unknown' };
    }
  };

  const addItem = async (type: string, item: any) => {
    const { table, dbType } = getTableNameAndType(type);
    const itemToSave = { ...item };
    
    // Assign ID if missing
    if (!itemToSave.id) itemToSave.id = Date.now().toString();
    
    // Assign type if it's the 'places' table
    if (table === 'places' && dbType) {
      itemToSave.type = dbType;
      // Handle specific overrides if type was passed as argument but item has specific sub-type
      if (item.type) itemToSave.type = item.type; 
    }

    try {
      const { error } = await supabase.from(table).insert(itemToSave);
      if (error) throw error;
      await fetchData(); // Refresh local state
    } catch (err) {
      console.error(`Error adding item to ${table}:`, err);
      alert("Erreur lors de l'ajout. Vérifiez la console.");
    }
  };

  const updateItem = async (type: string, item: any) => {
    const { table } = getTableNameAndType(type);
    try {
      const { error } = await supabase.from(table).update(item).eq('id', item.id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error(`Error updating item in ${table}:`, err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const deleteItem = async (type: string, id: string) => {
    const { table } = getTableNameAndType(type);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (err) {
      console.error(`Error deleting item from ${table}:`, err);
      alert("Erreur lors de la suppression.");
    }
  };

  const updatePageContent = async (id: string, content: PageContent) => {
    try {
      // Check if exists first
      const { data } = await supabase.from('page_content').select('id').eq('id', id).single();
      
      if (data) {
        const { error } = await supabase.from('page_content').update(content).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('page_content').insert({ ...content, id });
        if (error) throw error;
      }
      await fetchData();
    } catch (err) {
      console.error("Error updating page content:", err);
      alert("Erreur lors de la sauvegarde de la page.");
    }
  };

  // Function to seed the DB with mockData if empty
  const syncMockDataToSupabase = async () => {
    setIsLoading(true);
    try {
      // 1. Places
      const allPlaces = [...MUSEUMS, ...RESTAURANTS, ...ACCOMMODATION, ...MERCHANTS, ...WALKS];
      for (const p of allPlaces) {
        await supabase.from('places').upsert(p); 
      }

      // 2. Experiences
      for (const e of EXPERIENCES) await supabase.from('experiences').upsert(e);

      // 3. Events
      for (const ev of EVENTS) await supabase.from('events').upsert(ev);

      // 4. Articles
      for (const a of ARTICLES) await supabase.from('articles').upsert(a);

      // 5. Products
      for (const pr of PRODUCTS) await supabase.from('products').upsert(pr);

      // 6. Pages
      for (const [key, content] of Object.entries(PAGES_CONTENT)) {
         await supabase.from('page_content').upsert({ ...content, id: key });
      }

      alert("Base de données synchronisée avec succès !");
      await fetchData();

    } catch (error) {
      console.error("Sync error:", error);
      alert("Erreur lors de la synchronisation.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData(true);
  };

  return (
    <DataContext.Provider value={{
      museums, restaurants, accommodation, merchants, walks, experiences, events, articles, products, pageContent,
      isLoading,
      updateItem, addItem, deleteItem, updatePageContent, syncMockDataToSupabase, refreshData
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
