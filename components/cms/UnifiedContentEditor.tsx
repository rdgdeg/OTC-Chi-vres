import React, { useState, useEffect } from 'react'
import { 
  Save, 
  Eye, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Type, 
  Video, 
  Grid, 
  MousePointer,
  Settings,
  Tag,
  Globe,
  Lock,
  Clock,
  User
} from 'lucide-react'
import { ContentItem, ContentBlock, BlockType } from '../../types/cms'
import { BlockEditor } from './BlockEditor'
import { MediaSelector } from './MediaSelector'

interface UnifiedContentEditorProps {
  content: ContentItem
  onSave: (content: ContentItem) => void
  onCancel: () => void
}

export const UnifiedContentEditor: React.FC<UnifiedContentEditorProps> = ({
  content: initialContent,
  onSave,
  onCancel
}) => {
  const [content, setContent] = useState<ContentItem>(initialContent)
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'seo' | 'media' | 'settings'>('content')
  const [isDirty, setIsDirty] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [showMediaSelector, setShowMediaSelector] = useState(false)

  useEffect(() => {
    setIsDirty(JSON.stringify(content) !== JSON.stringify(initialContent))
  }, [content, initialContent])

  const handleContentChange = (field: keyof ContentItem, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleBlocksChange = (blocks: ContentBlock[]) => {
    setContent(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks
      }
    }))
  }

  const handleSave = () => {
    onSave(content)
  }

  const handlePublish = () => {
    const publishedContent = {
      ...content,
      status: 'published' as const
    }
    onSave(publishedContent)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    handleContentChange('title', title)
    if (!content.slug || content.slug === generateSlug(content.title)) {
      handleContentChange('slug', generateSlug(title))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {content.id ? 'Modifier' : 'Créer'} - {content.type}
                </h1>
                <p className="text-sm text-gray-500">
                  {content.title || 'Nouveau contenu'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isPreview
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </button>

              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isDirty
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>

              <button
                onClick={handlePublish}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                <Globe className="w-4 h-4 mr-2" />
                {content.status === 'published' ? 'Republier' : 'Publier'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Contenu principal */}
        <div className="flex-1 p-6">
          {isPreview ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
              <div className="prose max-w-none">
                {/* Rendu des blocs en mode aperçu */}
                {content.content.blocks?.map((block: ContentBlock) => (
                  <div key={block.id} className="mb-6">
                    {block.type === 'text' && (
                      <div dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text }} />
                    )}
                    {block.type === 'image' && (
                      <img 
                        src={block.content.url} 
                        alt={block.content.alt}
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    {/* Autres types de blocs... */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informations de base */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={content.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Titre du contenu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={content.slug}
                      onChange={(e) => handleContentChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="slug-du-contenu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={content.metadata.description || ''}
                      onChange={(e) => handleContentChange('metadata', {
                        ...content.metadata,
                        description: e.target.value
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description du contenu"
                    />
                  </div>
                </div>
              </div>

              {/* Éditeur de blocs */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Contenu</h3>
                </div>
                <div className="p-6">
                  <BlockEditor
                    blocks={content.content.blocks || []}
                    onChange={handleBlocksChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="w-80 bg-white border-l border-gray-200">
          {/* Onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'content', label: 'Contenu', icon: Type },
                { id: 'metadata', label: 'Métadonnées', icon: Tag },
                { id: 'seo', label: 'SEO', icon: Globe },
                { id: 'media', label: 'Médias', icon: ImageIcon },
                { id: 'settings', label: 'Paramètres', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-3 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 space-y-4">
            {/* Onglet Contenu */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={content.status}
                    onChange={(e) => handleContentChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={content.metadata.category || ''}
                    onChange={(e) => handleContentChange('metadata', {
                      ...content.metadata,
                      category: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Catégorie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={content.metadata.tags?.join(', ') || ''}
                    onChange={(e) => handleContentChange('metadata', {
                      ...content.metadata,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={content.metadata.featured || false}
                    onChange={(e) => handleContentChange('metadata', {
                      ...content.metadata,
                      featured: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Contenu mis en avant
                  </label>
                </div>
              </div>
            )}

            {/* Onglet Métadonnées */}
            {activeTab === 'metadata' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    value={content.metadata.keywords?.join(', ') || ''}
                    onChange={(e) => handleContentChange('metadata', {
                      ...content.metadata,
                      keywords: e.target.value.split(',').map(kw => kw.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="mot-clé1, mot-clé2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={content.metadata.pinned || false}
                    onChange={(e) => handleContentChange('metadata', {
                      ...content.metadata,
                      pinned: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pinned" className="ml-2 block text-sm text-gray-900">
                    Épinglé
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informations
                  </label>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Créé: {new Date(content.createdAt).toLocaleString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Modifié: {new Date(content.updatedAt).toLocaleString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Version: {content.version}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    value={content.seo.title || ''}
                    onChange={(e) => handleContentChange('seo', {
                      ...content.seo,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description SEO
                  </label>
                  <textarea
                    value={content.seo.description || ''}
                    onChange={(e) => handleContentChange('seo', {
                      ...content.seo,
                      description: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description pour les moteurs de recherche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL canonique
                  </label>
                  <input
                    type="url"
                    value={content.seo.canonicalUrl || ''}
                    onChange={(e) => handleContentChange('seo', {
                      ...content.seo,
                      canonicalUrl: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>
            )}

            {/* Onglet Médias */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowMediaSelector(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un média
                </button>

                <div className="space-y-2">
                  {content.media.map((mediaRef) => (
                    <div key={mediaRef.id} className="flex items-center p-2 border border-gray-200 rounded">
                      <ImageIcon className="w-8 h-8 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Média {mediaRef.mediaId}</p>
                        <p className="text-xs text-gray-500">Position: {mediaRef.position}</p>
                      </div>
                      <button
                        onClick={() => {
                          const newMedia = content.media.filter(m => m.id !== mediaRef.id)
                          handleContentChange('media', newMedia)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Paramètres */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibilité
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="public"
                        checked={content.permissions.public}
                        onChange={(e) => handleContentChange('permissions', {
                          ...content.permissions,
                          public: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="public" className="ml-2 block text-sm text-gray-900">
                        Public
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de sélection de médias */}
      {showMediaSelector && (
        <MediaSelector
          onSelect={(media) => {
            const newMediaRef = {
              id: Date.now().toString(),
              mediaId: media.id,
              position: content.media.length,
              caption: '',
              altText: media.metadata.altText || ''
            }
            handleContentChange('media', [...content.media, newMediaRef])
            setShowMediaSelector(false)
          }}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  )
}

export default UnifiedContentEditor