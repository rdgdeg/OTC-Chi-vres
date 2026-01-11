import React, { useState } from 'react'
import { Save, Eye, X, Settings, Tag, Globe, Lock } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  content: string
  type: 'page' | 'post' | 'accommodation' | 'walk'
  status: 'draft' | 'published'
  slug: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
}

interface SimpleContentEditorProps {
  item?: ContentItem
  onSave: (item: ContentItem) => void
  onCancel: () => void
}

export default function SimpleContentEditor({ item, onSave, onCancel }: SimpleContentEditorProps) {
  const [formData, setFormData] = useState<ContentItem>(
    item || {
      id: '',
      title: '',
      content: '',
      type: 'page',
      status: 'draft',
      slug: '',
      meta_title: '',
      meta_description: '',
      tags: []
    }
  )

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')

  const handleSave = () => {
    // Générer un slug automatiquement si vide
    if (!formData.slug && formData.title) {
      formData.slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    onSave(formData)
  }

  const updateField = (field: keyof ContentItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {item ? 'Modifier le contenu' : 'Nouveau contenu'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'content', label: 'Contenu', icon: Type },
            { id: 'seo', label: 'SEO', icon: Globe },
            { id: 'settings', label: 'Paramètres', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 flex items-center space-x-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Titre du contenu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={15}
                  placeholder="Rédigez votre contenu ici..."
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="url-de-la-page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta titre
                </label>
                <input
                  type="text"
                  value={formData.meta_title || ''}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Titre pour les moteurs de recherche"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta description
                </label>
                <textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  className="w-full p-2 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Description pour les moteurs de recherche"
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de contenu
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="page">Page</option>
                  <option value="post">Article</option>
                  <option value="accommodation">Hébergement</option>
                  <option value="walk">Balade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.status === 'published' ? 'Contenu public' : 'Contenu en brouillon'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}