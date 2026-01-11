import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageContent, ContentBlock } from '../types/content';

interface ContentContextType {
  pages: PageContent[];
  currentPage: PageContent | null;
  isEditing: boolean;
  selectedBlock: ContentBlock | null;
  
  // Actions
  loadPage: (slug: string) => Promise<void>;
  savePage: (page: PageContent) => Promise<void>;
  updateBlock: (blockId: string, updates: Partial<ContentBlock>) => void;
  addBlock: (block: ContentBlock, position?: { section: string; order: number }) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, newPosition: { section: string; order: number }) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Editor state
  setEditing: (editing: boolean) => void;
  selectBlock: (block: ContentBlock | null) => void;
  
  // Templates
  applyTemplate: (templateId: string) => void;
  saveAsTemplate: (name: string, description: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);

  // Simulation de données - à remplacer par des appels API
  const mockPages: PageContent[] = [
    {
      id: '1',
      slug: 'home',
      title: 'Page d\'Accueil',
      blocks: [],
      metadata: {
        description: 'Page d\'accueil de l\'Office du Tourisme',
        keywords: ['tourisme', 'chièvres', 'accueil'],
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      }
    },
    {
      id: '2',
      slug: 'crossage-detail',
      title: 'Crossage al\' tonne',
      blocks: [],
      metadata: {
        description: 'Page dédiée au Crossage',
        keywords: ['crossage', 'folklore', 'tradition'],
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      }
    },
    {
      id: '3',
      slug: 'musees',
      title: 'Musées et Patrimoine',
      blocks: [],
      metadata: {
        description: 'Découvrez le patrimoine de Chièvres',
        keywords: ['musées', 'patrimoine', 'culture'],
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      }
    }
  ];

  useEffect(() => {
    // Charger les pages depuis l'API/localStorage
    const savedPages = localStorage.getItem('cms-pages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      setPages(mockPages);
    }
  }, []);

  const loadPage = async (slug: string) => {
    const page = pages.find(p => p.slug === slug);
    if (page) {
      setCurrentPage(page);
    }
  };

  const savePage = async (page: PageContent) => {
    const updatedPages = pages.map(p => p.id === page.id ? page : p);
    setPages(updatedPages);
    setCurrentPage(page);
    
    // Sauvegarder dans localStorage (à remplacer par API)
    localStorage.setItem('cms-pages', JSON.stringify(updatedPages));
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    if (!currentPage) return;

    const updatedBlocks = currentPage.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );

    const updatedPage = {
      ...currentPage,
      blocks: updatedBlocks,
      metadata: {
        ...currentPage.metadata,
        lastModified: new Date().toISOString()
      }
    };

    savePage(updatedPage);
  };

  const addBlock = (block: ContentBlock, position?: { section: string; order: number }) => {
    if (!currentPage) return;

    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: position || {
        section: 'main',
        order: currentPage.blocks.length
      }
    };

    const updatedPage = {
      ...currentPage,
      blocks: [...currentPage.blocks, newBlock],
      metadata: {
        ...currentPage.metadata,
        lastModified: new Date().toISOString()
      }
    };

    savePage(updatedPage);
  };

  const removeBlock = (blockId: string) => {
    if (!currentPage) return;

    const updatedBlocks = currentPage.blocks.filter(block => block.id !== blockId);
    const updatedPage = {
      ...currentPage,
      blocks: updatedBlocks,
      metadata: {
        ...currentPage.metadata,
        lastModified: new Date().toISOString()
      }
    };

    savePage(updatedPage);
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const moveBlock = (blockId: string, newPosition: { section: string; order: number }) => {
    if (!currentPage) return;

    const updatedBlocks = currentPage.blocks.map(block =>
      block.id === blockId 
        ? { ...block, position: newPosition }
        : block
    );

    const updatedPage = {
      ...currentPage,
      blocks: updatedBlocks,
      metadata: {
        ...currentPage.metadata,
        lastModified: new Date().toISOString()
      }
    };

    savePage(updatedPage);
  };

  const duplicateBlock = (blockId: string) => {
    if (!currentPage) return;

    const blockToDuplicate = currentPage.blocks.find(block => block.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        ...blockToDuplicate.position,
        order: blockToDuplicate.position.order + 1
      }
    };

    addBlock(duplicatedBlock);
  };

  const setEditing = (editing: boolean) => {
    setIsEditing(editing);
    if (!editing) {
      setSelectedBlock(null);
    }
  };

  const selectBlock = (block: ContentBlock | null) => {
    setSelectedBlock(block);
  };

  const applyTemplate = (templateId: string) => {
    // Logique pour appliquer un template
    console.log('Applying template:', templateId);
  };

  const saveAsTemplate = (name: string, description: string) => {
    // Logique pour sauvegarder comme template
    console.log('Saving as template:', name, description);
  };

  const value: ContentContextType = {
    pages,
    currentPage,
    isEditing,
    selectedBlock,
    loadPage,
    savePage,
    updateBlock,
    addBlock,
    removeBlock,
    moveBlock,
    duplicateBlock,
    setEditing,
    selectBlock,
    applyTemplate,
    saveAsTemplate
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;