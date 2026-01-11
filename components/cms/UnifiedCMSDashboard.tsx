import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Image, 
  Settings, 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  Upload,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { ContentItem, ContentType, MediaItem } from '../../types/cms'
import { contentService } from '../../services/cms/ContentService'
import { unifiedMediaService } from '../../services/cms/UnifiedMediaService'
import { UnifiedContentEditor } from './UnifiedContentEditor'
import { UnifiedMediaLibrary } from './UnifiedMediaLibrary'

interface UnifiedCMSDashboardProps {
  onClose?: () => void
}

type DashboardView = 'overview' | 'content' | 'media' | 'settings' | 'analytics'
type ContentView = 'list' | 'grid' | 'editor'

export const UnifiedCMSDashboard: React.FC<UnifiedCMSDashboardProps> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview')
  const [contentView, setContentView] = useState<ContentView>('list')
  const [selectedContentType, setSelectedContentType] = useState<ContentType | 'all'>('all')
  const [contents, setContents] = useState<ContentItem[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Statistiques
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalMedia: 0,
    mediaSize: 0
  })

  useEffect(() => {
    loadData()
  }, [selectedContentType, searchQuery])

  const loadData = async () => {
    setLoading(true)
    try {
      // Charger le contenu
      const contentFilters = {
        ...(selectedContentType !== 'all' && { type: selectedContentType }),
        ...(searchQuery && { search: searchQuery })
      }
      const contentData = await contentService.list(contentFilters)
      setContents(contentData)

      // Charger les médias
      const mediaData = await unifiedMediaService.list()
      setMedia(mediaData)

      // Calculer les statistiques
      setStats({
        totalContent: contentData.length,
        publishedContent: contentData.filter(c => c.status === 'published').length,
        draftContent: contentData.filter(c => c.status === 'draft').length,
        totalMedia: mediaData.length,
        mediaSize: mediaData.reduce((sum, m) => sum + m.size, 0)
      })
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContent = (type: ContentType) => {
    setSelectedContent({
      id: '',
      type,
      title: '',
      slug: '',
      status: 'draft',
      content: {},
      metadata: {},
      media: [],
      seo: {},
      permissions: { public: true, roles: {}, users: {} },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '',
      updatedBy: '',
      version: 1
    })
    setContentView('editor')
  }

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content)
    setContentView('editor')
  }

  const handleSaveContent = async (content: ContentItem) => {
    try {
      if (content.id) {
        await contentService.update(content.id, content)
      } else {
        await contentService.create(content.type, content)
      }
      setSelectedContent(null)
      setContentView('list')
      loadData()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleDeleteContent = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await contentService.delete(id)
        loadData()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const contentTypes: { type: ContentType; label: string; icon: React.ReactNode }[] = [
    { type: 'place', label: 'Lieux', icon: <FileText className="w-4 h-4" /> },
    { type: 'accommodation', label: 'Hébergements', icon: <FileText className="w-4 h-4" /> },
    { type: 'experience', label: 'Expériences', icon: <FileText className="w-4 h-4" /> },
    { type: 'event', label: 'Événements', icon: <FileText className="w-4 h-4" /> },
    { type: 'article', label: 'Articles', icon: <FileText className="w-4 h-4" /> },
    { type: 'product', label: 'Produits', icon: <FileText className="w-4 h-4" /> },
    { type: 'page', label: 'Pages', icon: <FileText className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">CMS Unifié</h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'overview'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setCurrentView('content')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'content'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Contenu
                </button>
                <button
                  onClick={() => setCurrentView('media')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'media'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Image className="w-4 h-4 inline mr-2" />
                  Médias
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'analytics'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Paramètres
                </button>
              </nav>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Vue d'ensemble */}
        {currentView === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Statistiques */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Contenu</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Publié</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.publishedContent}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Edit className="w-8 h-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Brouillons</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.draftContent}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Image className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Médias</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMedia}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(stats.mediaSize)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contentTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => handleCreateContent(type.type)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {type.icon}
                    <span className="ml-2 text-sm font-medium">Créer {type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gestion du contenu */}
        {currentView === 'content' && (
          <div className="p-6">
            {contentView === 'editor' && selectedContent ? (
              <UnifiedContentEditor
                content={selectedContent}
                onSave={handleSaveContent}
                onCancel={() => {
                  setSelectedContent(null)
                  setContentView('list')
                }}
              />
            ) : (
              <>
                {/* Barre d'outils */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher du contenu..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <select
                        value={selectedContentType}
                        onChange={(e) => setSelectedContentType(e.target.value as ContentType | 'all')}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Tous les types</option>
                        {contentTypes.map((type) => (
                          <option key={type.type} value={type.type}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setContentView('list')}
                        className={`p-2 rounded ${
                          contentView === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setContentView('grid')}
                        className={`p-2 rounded ${
                          contentView === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Liste/Grille du contenu */}
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : contentView === 'list' ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Titre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modifié
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contents.map((content) => (
                          <tr key={content.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {content.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {content.slug}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {contentTypes.find(t => t.type === content.type)?.label || content.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                content.status === 'published' 
                                  ? 'bg-green-100 text-green-800'
                                  : content.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {content.status === 'published' ? 'Publié' : 
                                 content.status === 'draft' ? 'Brouillon' : 'Archivé'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(content.updatedAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditContent(content)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContent(content.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contents.map((content) => (
                      <div key={content.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {contentTypes.find(t => t.type === content.type)?.label || content.type}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditContent(content)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {content.metadata.description || 'Aucune description'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            content.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : content.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {content.status === 'published' ? 'Publié' : 
                             content.status === 'draft' ? 'Brouillon' : 'Archivé'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(content.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Gestion des médias */}
        {currentView === 'media' && (
          <div className="p-6">
            <UnifiedMediaLibrary />
          </div>
        )}

        {/* Analytics */}
        {currentView === 'analytics' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
              <p className="text-gray-500">Tableau de bord analytics à venir...</p>
            </div>
          </div>
        )}

        {/* Paramètres */}
        {currentView === 'settings' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h2>
              <p className="text-gray-500">Paramètres du CMS à venir...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedCMSDashboard