import React, { useState } from 'react'
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Grid, 
  MousePointer, 
  MessageSquare,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

export interface Block {
  id: string
  type: 'text' | 'image' | 'video' | 'gallery' | 'button' | 'testimonial'
  content: any
  order: number
}

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

const blockTypes = [
  { type: 'text', label: 'Texte', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'video', label: 'Vidéo', icon: Video },
  { type: 'gallery', label: 'Galerie', icon: Grid },
  { type: 'button', label: 'Bouton', icon: MousePointer },
  { type: 'testimonial', label: 'Témoignage', icon: MessageSquare }
]

export default function SimpleBlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: blocks.length
    }
    onChange([...blocks, newBlock])
    setShowAddMenu(false)
  }

  const updateBlock = (id: string, content: any) => {
    onChange(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return
    }

    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap blocks
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp

    // Update order
    newBlocks.forEach((block, i) => {
      block.order = i
    })

    onChange(newBlocks)
  }

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'text':
        return { text: '', format: 'paragraph' }
      case 'image':
        return { url: '', alt: '', caption: '' }
      case 'video':
        return { url: '', title: '' }
      case 'gallery':
        return { images: [] }
      case 'button':
        return { text: 'Cliquez ici', url: '', style: 'primary' }
      case 'testimonial':
        return { text: '', author: '', role: '' }
      default:
        return {}
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {React.createElement(
                blockTypes.find(t => t.type === block.type)?.icon || Type,
                { className: "w-4 h-4" }
              )}
              <span className="text-sm font-medium">
                {blockTypes.find(t => t.type === block.type)?.label}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => moveBlock(block.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveBlock(block.id, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteBlock(block.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <BlockContent
            block={block}
            onChange={(content) => updateBlock(block.id, content)}
          />
        </div>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un bloc</span>
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
            <div className="p-2 grid grid-cols-2 gap-2">
              {blockTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="p-3 text-left hover:bg-gray-50 rounded flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BlockContent({ block, onChange }: { block: Block; onChange: (content: any) => void }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <select
            value={block.content.format || 'paragraph'}
            onChange={(e) => onChange({ ...block.content, format: e.target.value })}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="paragraph">Paragraphe</option>
            <option value="heading1">Titre 1</option>
            <option value="heading2">Titre 2</option>
            <option value="heading3">Titre 3</option>
          </select>
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onChange({ ...block.content, text: e.target.value })}
            placeholder="Saisissez votre texte..."
            className="w-full p-2 border rounded resize-none"
            rows={4}
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={block.content.url || ''}
            onChange={(e) => onChange({ ...block.content, url: e.target.value })}
            placeholder="URL de l'image"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={block.content.alt || ''}
            onChange={(e) => onChange({ ...block.content, alt: e.target.value })}
            placeholder="Texte alternatif"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={block.content.caption || ''}
            onChange={(e) => onChange({ ...block.content, caption: e.target.value })}
            placeholder="Légende (optionnel)"
            className="w-full p-2 border rounded"
          />
        </div>
      )

    case 'button':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.text || ''}
            onChange={(e) => onChange({ ...block.content, text: e.target.value })}
            placeholder="Texte du bouton"
            className="w-full p-2 border rounded"
          />
          <input
            type="url"
            value={block.content.url || ''}
            onChange={(e) => onChange({ ...block.content, url: e.target.value })}
            placeholder="URL de destination"
            className="w-full p-2 border rounded"
          />
          <select
            value={block.content.style || 'primary'}
            onChange={(e) => onChange({ ...block.content, style: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="primary">Primaire</option>
            <option value="secondary">Secondaire</option>
            <option value="outline">Contour</option>
          </select>
        </div>
      )

    default:
      return (
        <div className="text-gray-500 text-sm">
          Éditeur pour le type "{block.type}" à implémenter
        </div>
      )
  }
}