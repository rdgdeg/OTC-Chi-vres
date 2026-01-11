import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Grid, 
  MousePointer, 
  MessageSquare,
  HelpCircle,
  FileText,
  Edit,
  Trash2,
  GripVertical,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { ContentBlock, BlockType } from '../../types/cms'

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)

  const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      type: 'text', 
      label: 'Texte', 
      icon: <Type className="w-5 h-5" />,
      description: 'Paragraphe de texte avec formatage'
    },
    { 
      type: 'image', 
      label: 'Image', 
      icon: <ImageIcon className="w-5 h-5" />,
      description: 'Image avec légende et options d\'affichage'
    },
    { 
      type: 'video', 
      label: 'Vidéo', 
      icon: <Video className="w-5 h-5" />,
      description: 'Vidéo intégrée ou lien YouTube/Vimeo'
    },
    { 
      type: 'gallery', 
      label: 'Galerie', 
      icon: <Grid className="w-5 h-5" />,
      description: 'Galerie d\'images avec navigation'
    },
    { 
      type: 'hero', 
      label: 'Hero', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Section hero avec image de fond et texte'
    },
    { 
      type: 'cta', 
      label: 'Appel à l\'action', 
      icon: <MousePointer className="w-5 h-5" />,
      description: 'Bouton d\'appel à l\'action avec lien'
    },
    { 
      type: 'testimonial', 
      label: 'Témoignage', 
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Citation ou témoignage client'
    },
    { 
      type: 'faq', 
      label: 'FAQ', 
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Questions-réponses accordéon'
    }
  ]

  const createBlock = (type: BlockType): ContentBlock => {
    const baseBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      position: blocks.length,
      settings: {
        backgroundColor: '',
        textColor: '',
        padding: 'medium',
        margin: 'medium'
      },
      media: [],
      visibility: {
        desktop: true,
        tablet: true,
        mobile: true
      }
    }

    switch (type) {
      case 'text':
        return {
          ...baseBlock,
          title: 'Nouveau paragraphe',
          content: {
            text: 'Votre texte ici...',
            html: '<p>Votre texte ici...</p>',
            format: 'paragraph'
          }
        }
      case 'image':
        return {
          ...baseBlock,
          title: 'Nouvelle image',
          content: {
            url: '',
            alt: '',
            caption: '',
            width: '100%',
            height: 'auto',
            alignment: 'center'
          }
        }
      case 'video':
        return {
          ...baseBlock,
          title: 'Nouvelle vidéo',
          content: {
            url: '',
            type: 'youtube',
            autoplay: false,
            controls: true,
            width: '100%',
            height: '400px'
          }
        }
      case 'gallery':
        return {
          ...baseBlock,
          title: 'Nouvelle galerie',
          content: {
            images: [],
            layout: 'grid',
            columns: 3,
            spacing: 'medium',
            showCaptions: true
          }
        }
      case 'hero':
        return {
          ...baseBlock,
          title: 'Nouvelle section hero',
          content: {
            title: 'Titre principal',
            subtitle: 'Sous-titre',
            backgroundImage: '',
            backgroundVideo: '',
            overlay: true,
            overlayOpacity: 0.5,
            textAlignment: 'center',
            buttonText: 'En savoir plus',
            buttonUrl: '#'
          }
        }
      case 'cta':
        return {
          ...baseBlock,
          title: 'Nouvel appel à l\'action',
          content: {
            title: 'Titre de l\'appel à l\'action',
            description: 'Description de l\'action à effectuer',
            buttonText: 'Cliquez ici',
            buttonUrl: '#',
            buttonStyle: 'primary',
            alignment: 'center'
          }
        }
      case 'testimonial':
        return {
          ...baseBlock,
          title: 'Nouveau témoignage',
          content: {
            quote: 'Votre témoignage ici...',
            author: 'Nom de l\'auteur',
            position: 'Poste ou titre',
            company: 'Entreprise',
            avatar: '',
            rating: 5
          }
        }
      case 'faq':
        return {
          ...baseBlock,
          title: 'Nouvelle FAQ',
          content: {
            items: [
              {
                question: 'Votre question ici ?',
                answer: 'Votre réponse ici...'
              }
            ],
            allowMultiple: false,
            defaultOpen: false
          }
        }
      default:
        return baseBlock
    }
  }

  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlock(type)
    const newBlocks = [...blocks, newBlock]
    onChange(newBlocks)
    setShowBlockLibrary(false)
    setSelectedBlock(newBlock.id)
  }

  const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )
    onChange(newBlocks)
  }

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
      const newBlocks = blocks.filter(block => block.id !== blockId)
      onChange(newBlocks)
      if (selectedBlock === blockId) {
        setSelectedBlock(null)
      }
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedBlock] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedBlock)

    // Mettre à jour les positions
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      position: index
    }))

    onChange(updatedBlocks)
  }

  const renderBlockContent = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text }} />
          </div>
        )
      case 'image':
        return (
          <div className="text-center">
            {block.content.url ? (
              <img 
                src={block.content.url} 
                alt={block.content.alt}
                className="max-w-full h-auto rounded"
                style={{ width: block.content.width, height: block.content.height }}
              />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucune image sélectionnée</p>
              </div>
            )}
            {block.content.caption && (
              <p className="text-sm text-gray-600 mt-2">{block.content.caption}</p>
            )}
          </div>
        )
      case 'video':
        return (
          <div className="text-center">
            {block.content.url ? (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Vidéo: {block.content.url}</span>
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucune vidéo ajoutée</p>
              </div>
            )}
          </div>
        )
      case 'hero':
        return (
          <div className="relative bg-gray-900 text-white rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>
              <p className="text-xl mb-6">{block.content.subtitle}</p>
              {block.content.buttonText && (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                  {block.content.buttonText}
                </button>
              )}
            </div>
          </div>
        )
      case 'cta':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{block.content.title}</h3>
            <p className="text-gray-600 mb-4">{block.content.description}</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
              {block.content.buttonText}
            </button>
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">Bloc {block.type}</p>
          </div>
        )
    }
  }

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                value={block.content.text || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, text: e.target.value, html: `<p>${e.target.value}</p>` }
                })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre texte ici..."
              />
            </div>
          </div>
        )
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                value={block.content.url || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, url: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte alternatif
              </label>
              <input
                type="text"
                value={block.content.alt || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, alt: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de l'image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Légende
              </label>
              <input
                type="text"
                value={block.content.caption || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, caption: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Légende de l'image"
              />
            </div>
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre principal
              </label>
              <input
                type="text"
                value={block.content.title || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Titre principal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={block.content.subtitle || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sous-titre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte du bouton
              </label>
              <input
                type="text"
                value={block.content.buttonText || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, buttonText: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="En savoir plus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien du bouton
              </label>
              <input
                type="url"
                value={block.content.buttonUrl || ''}
                onChange={(e) => handleUpdateBlock(block.id, {
                  content: { ...block.content, buttonUrl: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="text-center text-gray-500 py-4">
            Éditeur pour le type "{block.type}" à implémenter
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton d'ajout de bloc */}
      <div className="text-center">
        <button
          onClick={() => setShowBlockLibrary(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un bloc
        </button>
      </div>

      {/* Liste des blocs */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white border rounded-lg overflow-hidden ${
                        snapshot.isDragging ? 'shadow-lg' : 'shadow'
                      } ${selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      {/* En-tête du bloc */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                        <div className="flex items-center space-x-3">
                          <div {...provided.dragHandleProps} className="cursor-move">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex items-center space-x-2">
                            {blockTypes.find(bt => bt.type === block.type)?.icon}
                            <span className="font-medium text-gray-900">
                              {block.title || blockTypes.find(bt => bt.type === block.type)?.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateBlock(block.id, {
                              visibility: {
                                ...block.visibility,
                                desktop: !block.visibility.desktop
                              }
                            })}
                            className={`p-1 rounded ${
                              block.visibility.desktop ? 'text-gray-600' : 'text-gray-300'
                            }`}
                            title="Visibilité desktop"
                          >
                            {block.visibility.desktop ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contenu du bloc */}
                      <div className="p-4">
                        {renderBlockContent(block)}
                      </div>

                      {/* Éditeur du bloc (si sélectionné) */}
                      {selectedBlock === block.id && (
                        <div className="border-t bg-gray-50 p-4">
                          <h4 className="font-medium text-gray-900 mb-4">Modifier le bloc</h4>
                          {renderBlockEditor(block)}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Bibliothèque de blocs */}
      {showBlockLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter un bloc</h3>
              <button
                onClick={() => setShowBlockLibrary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => handleAddBlock(blockType.type)}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {blockType.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{blockType.label}</h4>
                    <p className="text-sm text-gray-500">{blockType.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockEditor