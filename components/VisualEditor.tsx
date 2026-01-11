import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { ContentBlock, TextBlock, ImageBlock, HeroBlock } from '../types/content';
import { 
  Edit3, Plus, Trash2, Copy, Move, Eye, EyeOff, 
  Type, Image as ImageIcon, Layout, Square,
  List, Grid, Save, Undo, Redo, Settings, Palette
} from 'lucide-react';

interface VisualEditorProps {
  pageSlug: string;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ pageSlug }) => {
  const {
    currentPage,
    isEditing,
    selectedBlock,
    loadPage,
    savePage,
    updateBlock,
    addBlock,
    removeBlock,
    duplicateBlock,
    setEditing,
    selectBlock
  } = useContent();

  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);

  React.useEffect(() => {
    loadPage(pageSlug);
  }, [pageSlug, loadPage]);

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Texte', description: 'Ajouter du texte' },
    { type: 'image', icon: ImageIcon, label: 'Image', description: 'Ajouter une image' },
    { type: 'hero', icon: Layout, label: 'Hero', description: 'Section hero avec image de fond' },
    { type: 'button', icon: Square, label: 'Bouton', description: 'Bouton d\'action' },
    { type: 'list', icon: List, label: 'Liste', description: 'Liste à puces ou numérotée' },
    { type: 'gallery', icon: Grid, label: 'Galerie', description: 'Galerie d\'images' }
  ];

  const createNewBlock = (type: string): ContentBlock => {
    const baseBlock = {
      id: '',
      type: type as any,
      content: {},
      position: { section: 'main', order: 0 },
      styles: {}
    };

    switch (type) {
      case 'text':
        return {
          ...baseBlock,
          type: 'text',
          content: {
            text: 'Nouveau texte',
            tag: 'p'
          }
        } as TextBlock;
      
      case 'image':
        return {
          ...baseBlock,
          type: 'image',
          content: {
            src: 'https://picsum.photos/400/300',
            alt: 'Nouvelle image',
            caption: ''
          }
        } as ImageBlock;
      
      case 'hero':
        return {
          ...baseBlock,
          type: 'hero',
          content: {
            title: 'Nouveau titre',
            subtitle: 'Nouveau sous-titre',
            backgroundImage: 'https://picsum.photos/1920/1080',
            buttons: []
          }
        } as HeroBlock;
      
      default:
        return baseBlock;
    }
  };

  const handleAddBlock = (type: string) => {
    const newBlock = createNewBlock(type);
    addBlock(newBlock);
    setShowBlockLibrary(false);
  };

  const renderBlock = (block: ContentBlock) => {
    const isSelected = selectedBlock?.id === block.id;
    const blockStyles = {
      ...block.styles,
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      position: 'relative' as const
    };

    const handleBlockClick = (e: React.MouseEvent) => {
      if (isEditing) {
        e.stopPropagation();
        selectBlock(block);
      }
    };

    const BlockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div
        style={blockStyles}
        onClick={handleBlockClick}
        className={`${isEditing ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-300' : ''} ${isSelected ? 'relative' : ''}`}
      >
        {children}
        {isEditing && isSelected && (
          <div className="absolute -top-10 left-0 flex space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStylePanel(true);
              }}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <Palette size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBlock(block.id);
              }}
              className="hover:bg-red-600 p-1 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    );

    switch (block.type) {
      case 'text':
        const textBlock = block as TextBlock;
        const TextTag = textBlock.content.tag;
        return (
          <BlockWrapper key={block.id}>
            <TextTag
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                if (isEditing) {
                  updateBlock(block.id, {
                    content: {
                      ...textBlock.content,
                      text: e.currentTarget.textContent || ''
                    }
                  });
                }
              }}
              className={`${textBlock.content.tag.startsWith('h') ? 'font-bold' : ''} outline-none`}
            >
              {textBlock.content.text}
            </TextTag>
          </BlockWrapper>
        );

      case 'image':
        const imageBlock = block as ImageBlock;
        return (
          <BlockWrapper key={block.id}>
            <div className="text-center">
              <img
                src={imageBlock.content.src}
                alt={imageBlock.content.alt}
                className="max-w-full h-auto rounded-lg"
                style={{
                  width: imageBlock.content.width || 'auto',
                  height: imageBlock.content.height || 'auto'
                }}
              />
              {imageBlock.content.caption && (
                <p className="text-sm text-gray-600 mt-2">{imageBlock.content.caption}</p>
              )}
            </div>
          </BlockWrapper>
        );

      case 'hero':
        const heroBlock = block as HeroBlock;
        return (
          <BlockWrapper key={block.id}>
            <div
              className="relative h-96 flex items-center justify-center text-white"
              style={{
                backgroundImage: `url(${heroBlock.content.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center z-10">
                <h1
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    if (isEditing) {
                      updateBlock(block.id, {
                        content: {
                          ...heroBlock.content,
                          title: e.currentTarget.textContent || ''
                        }
                      });
                    }
                  }}
                  className="text-4xl font-bold mb-4 outline-none"
                >
                  {heroBlock.content.title}
                </h1>
                <p
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    if (isEditing) {
                      updateBlock(block.id, {
                        content: {
                          ...heroBlock.content,
                          subtitle: e.currentTarget.textContent || ''
                        }
                      });
                    }
                  }}
                  className="text-xl mb-6 outline-none"
                >
                  {heroBlock.content.subtitle}
                </p>
              </div>
            </div>
          </BlockWrapper>
        );

      default:
        return (
          <BlockWrapper key={block.id}>
            <div className="p-4 bg-gray-100 rounded">
              Type de bloc non supporté: {block.type}
            </div>
          </BlockWrapper>
        );
    }
  };

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'outils */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">{currentPage.title}</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isEditing ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                {isEditing ? 'Aperçu' : 'Éditer'}
              </button>
              
              {isEditing && (
                <>
                  <button
                    onClick={() => setShowBlockLibrary(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={18} className="mr-2" />
                    Ajouter
                  </button>
                  
                  <button
                    onClick={() => savePage(currentPage)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Save size={18} className="mr-2" />
                    Sauvegarder
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Dernière modification: {new Date(currentPage.metadata.lastModified).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu de la page */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm min-h-96">
          {currentPage.blocks.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Layout size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Cette page est vide</p>
                <p className="text-sm">Cliquez sur "Ajouter" pour commencer à créer du contenu</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {currentPage.blocks
                .sort((a, b) => a.position.order - b.position.order)
                .map(renderBlock)}
            </div>
          )}
        </div>
      </div>

      {/* Bibliothèque de blocs */}
      {showBlockLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Ajouter un bloc</h2>
              <button
                onClick={() => setShowBlockLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockTypes.map((blockType) => {
                const IconComponent = blockType.icon;
                return (
                  <button
                    key={blockType.type}
                    onClick={() => handleAddBlock(blockType.type)}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{blockType.label}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{blockType.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Panneau de styles */}
      {showStylePanel && selectedBlock && (
        <StylePanel
          block={selectedBlock}
          onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
          onClose={() => setShowStylePanel(false)}
        />
      )}
    </div>
  );
};

// Composant pour le panneau de styles
const StylePanel: React.FC<{
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onClose: () => void;
}> = ({ block, onUpdate, onClose }) => {
  const [styles, setStyles] = useState(block.styles || {});

  const handleStyleChange = (property: string, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    onUpdate({ styles: newStyles });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Styles</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur de fond
            </label>
            <input
              type="color"
              value={styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du texte
            </label>
            <input
              type="color"
              value={styles.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille de police
            </label>
            <select
              value={styles.fontSize || '16px'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="32px">32px</option>
              <option value="48px">48px</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignement du texte
            </label>
            <select
              value={styles.textAlign || 'left'}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="left">Gauche</option>
              <option value="center">Centre</option>
              <option value="right">Droite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espacement interne
            </label>
            <input
              type="text"
              value={styles.padding || '0px'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              placeholder="ex: 16px ou 16px 24px"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espacement externe
            </label>
            <input
              type="text"
              value={styles.margin || '0px'}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              placeholder="ex: 16px ou 16px 24px"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bordure arrondie
            </label>
            <input
              type="text"
              value={styles.borderRadius || '0px'}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              placeholder="ex: 8px"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;