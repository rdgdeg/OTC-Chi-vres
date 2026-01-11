import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PageContent {
  id: string;
  name: string;
  path: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  lastModified?: string;
}

interface PageContentContextType {
  getPageContent: (pageId: string) => PageContent | null;
  updatePageContent: (pageId: string, content: Partial<PageContent>) => void;
  getAllPages: () => PageContent[];
}

const PageContentContext = createContext<PageContentContextType | undefined>(undefined);

// Configuration par défaut de toutes les pages du site
const defaultPages: PageContent[] = [
  {
    id: 'home',
    name: 'Accueil',
    path: '/',
    title: 'Bienvenue à Chièvres',
    subtitle: 'Découvrez la Cité des Aviateurs',
    heroImage: 'https://picsum.photos/id/1080/1920/600',
    description: 'Chièvres, la Cité des Aviateurs, vous accueille au cœur du Hainaut occidental.',
    metaTitle: 'Chièvres - Office de Tourisme',
    metaDescription: 'Découvrez Chièvres et ses villages : hébergements, restaurants, balades, patrimoine et activités touristiques.'
  },
  {
    id: 'museums',
    name: 'Musées & Patrimoine',
    path: '/musees',
    title: 'Musées & Patrimoine',
    subtitle: 'Découvrez l\'histoire et la culture de Chièvres',
    heroImage: 'https://picsum.photos/id/1040/1920/600',
    description: 'Plongez dans l\'histoire fascinante de Chièvres à travers ses musées et son patrimoine architectural.',
    metaTitle: 'Musées et Patrimoine - Chièvres',
    metaDescription: 'Visitez les musées et découvrez le patrimoine historique de Chièvres et ses villages.'
  },
  {
    id: 'accommodations',
    name: 'Hébergements',
    path: '/hebergements',
    title: 'Dormir à Chièvres',
    subtitle: 'Envie d\'une escale à Chièvres ?',
    heroImage: 'https://picsum.photos/id/1080/1920/600',
    description: 'Chièvres et ses villages vous accueillent dans des hébergements chaleureux pour un séjour authentique et convivial.',
    metaTitle: 'Hébergements à Chièvres',
    metaDescription: 'Gîtes, chambres d\'hôtes et hébergements insolites à Chièvres et ses villages.'
  },
  {
    id: 'dining',
    name: 'Gastronomie & Terroir',
    path: '/restaurants',
    title: 'Gastronomie & Terroir',
    subtitle: 'Savourez les délices de Chièvres, de la fourche à la fourchette.',
    heroImage: 'https://picsum.photos/id/1080/1920/600',
    description: 'Découvrez les restaurants, cafés et producteurs locaux de Chièvres.',
    metaTitle: 'Restaurants et Gastronomie - Chièvres',
    metaDescription: 'Restaurants, cafés et producteurs locaux à Chièvres. Savourez le terroir local.'
  },
  {
    id: 'merchants',
    name: 'Commerces',
    path: '/commercants',
    title: 'Commerces & Artisans',
    subtitle: 'Découvrez les commerces locaux de Chièvres',
    heroImage: 'https://picsum.photos/id/1050/1920/600',
    description: 'Boutiques, artisans et commerces de proximité à Chièvres et ses villages.',
    metaTitle: 'Commerces et Artisans - Chièvres',
    metaDescription: 'Découvrez les commerces, boutiques et artisans de Chièvres et ses villages.'
  },
  {
    id: 'walks',
    name: 'Balades & Randonnées',
    path: '/balades',
    title: 'Balades & Randonnées',
    subtitle: 'Explorez la nature chiévroise',
    heroImage: 'https://picsum.photos/id/1018/1920/600',
    description: 'Circuits de randonnée, balades à vélo et promenades nature à Chièvres.',
    metaTitle: 'Balades et Randonnées - Chièvres',
    metaDescription: 'Circuits de randonnée, balades à vélo et promenades nature à Chièvres et ses villages.'
  },
  {
    id: 'experiences',
    name: 'Expériences',
    path: '/experiences',
    title: 'Expériences Uniques',
    subtitle: 'Vivez des moments inoubliables à Chièvres',
    heroImage: 'https://picsum.photos/id/1060/1920/600',
    description: 'Activités, visites guidées et expériences authentiques à Chièvres.',
    metaTitle: 'Expériences et Activités - Chièvres',
    metaDescription: 'Activités, visites guidées et expériences uniques à Chièvres et ses villages.'
  },
  {
    id: 'agenda',
    name: 'Agenda & Événements',
    path: '/agenda',
    title: 'Agenda & Événements',
    subtitle: 'Ne manquez rien de l\'actualité chiévroise',
    heroImage: 'https://picsum.photos/id/1070/1920/600',
    description: 'Événements, festivités et animations à Chièvres tout au long de l\'année.',
    metaTitle: 'Agenda et Événements - Chièvres',
    metaDescription: 'Calendrier des événements, festivités et animations à Chièvres et ses villages.'
  },
  {
    id: 'blog',
    name: 'Blog & Actualités',
    path: '/blog',
    title: 'Blog & Actualités',
    subtitle: 'Toute l\'actualité de Chièvres',
    heroImage: 'https://picsum.photos/id/1090/1920/600',
    description: 'Articles, actualités et bons plans pour découvrir Chièvres.',
    metaTitle: 'Blog et Actualités - Chièvres',
    metaDescription: 'Blog, actualités et bons plans pour découvrir Chièvres et ses villages.'
  },
  {
    id: 'shop',
    name: 'Boutique',
    path: '/boutique',
    title: 'La Boutique',
    subtitle: 'Emportez un morceau de Chièvres avec vous : terroir, souvenirs et livres.',
    heroImage: 'https://picsum.photos/id/1059/1920/600',
    description: 'Produits du terroir, souvenirs et publications sur Chièvres.',
    metaTitle: 'Boutique - Chièvres',
    metaDescription: 'Boutique en ligne : produits du terroir, souvenirs et publications sur Chièvres.'
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    title: 'Nous Contacter',
    subtitle: 'Office de Tourisme de Chièvres',
    heroImage: 'https://picsum.photos/id/1100/1920/600',
    description: 'Informations pratiques et coordonnées de l\'Office de Tourisme de Chièvres.',
    metaTitle: 'Contact - Office de Tourisme Chièvres',
    metaDescription: 'Contactez l\'Office de Tourisme de Chièvres : horaires, adresse, téléphone et email.'
  },
  {
    id: 'team',
    name: 'Notre Équipe',
    path: '/equipe',
    title: 'Notre Équipe',
    subtitle: 'L\'équipe de l\'Office de Tourisme de Chièvres',
    heroImage: 'https://picsum.photos/id/1110/1920/600',
    description: 'Rencontrez l\'équipe passionnée de l\'Office de Tourisme de Chièvres.',
    metaTitle: 'Notre Équipe - Office de Tourisme Chièvres',
    metaDescription: 'Découvrez l\'équipe de l\'Office de Tourisme de Chièvres, passionnée par sa région.'
  },
  {
    id: 'crossage',
    name: 'Crossage',
    path: '/crossage',
    title: 'Crossage',
    subtitle: 'Découvrez le Crossage à Chièvres',
    heroImage: 'https://picsum.photos/id/1120/1920/600',
    description: 'Informations sur le Crossage, activité unique à Chièvres.',
    metaTitle: 'Crossage - Chièvres',
    metaDescription: 'Découvrez le Crossage, une activité unique proposée à Chièvres.'
  },
  {
    id: 'bulletin',
    name: 'Bulletin Municipal',
    path: '/bulletin',
    title: 'Bulletin Municipal',
    subtitle: 'Toute l\'actualité municipale de Chièvres',
    heroImage: 'https://picsum.photos/id/1130/1920/600',
    description: 'Consultez le bulletin municipal de Chièvres et restez informé.',
    metaTitle: 'Bulletin Municipal - Chièvres',
    metaDescription: 'Bulletin municipal de Chièvres : actualités, informations pratiques et vie locale.'
  }
];

export const PageContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageContent[]>(defaultPages);

  useEffect(() => {
    // Charger les pages depuis le localStorage
    const savedPages = localStorage.getItem('pageContents');
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        setPages(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des pages:', error);
        setPages(defaultPages);
      }
    }
  }, []);

  const getPageContent = (pageId: string): PageContent | null => {
    return pages.find(page => page.id === pageId) || null;
  };

  const updatePageContent = (pageId: string, content: Partial<PageContent>) => {
    const updatedPages = pages.map(page => 
      page.id === pageId 
        ? { ...page, ...content, lastModified: new Date().toISOString() }
        : page
    );
    setPages(updatedPages);
    localStorage.setItem('pageContents', JSON.stringify(updatedPages));
  };

  const getAllPages = (): PageContent[] => {
    return pages;
  };

  return (
    <PageContentContext.Provider value={{
      getPageContent,
      updatePageContent,
      getAllPages
    }}>
      {children}
    </PageContentContext.Provider>
  );
};

export const usePageContent = () => {
  const context = useContext(PageContentContext);
  if (context === undefined) {
    throw new Error('usePageContent must be used within a PageContentProvider');
  }
  return context;
};

export type { PageContent };