import React, { useState, useEffect, useCallback } from 'react'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Trash2, 
  Edit, 
  Download,
  Eye,
  MoreHorizontal,
  FolderPlus,
  Folder
} from 'lucide-react'
import { MediaItem, MediaFilters } from '../../types/cms'
import { unifiedMediaService } from '../../services/cms/UnifiedMediaService'

interface UnifiedMediaLibraryProps {
  onSelectMedia?: (media: MediaItem | MediaItem[]) => void
  allowMultiple?: boolean
  selectionMode?: boolean
}

export const UnifiedMediaLibrary: React.FC<UnifiedMediaLibraryProps> = ({
  onSelectMedia,
  allowMultiple = false,
  selectionMode = false
}) => {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filters, setFilters] = useState<MediaFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [currentFolder, setCurrentFolder] = useState('general')
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [selectedForAction, setSelectedForAction] = useState<MediaItem | null>(null)

  const folders = [
    { name: 'general', label: 'Général' },
    { name: 'accommodations', label: 'Hébergements' },
    { name: 'places', label: 'Lieux' },
    { name: 'events', label: 'Événements' },
    { name: 'articles', label: 'Articles' },
    { name: 'homepage', label: 'Page d\'accueil' }
  ]

  useEffect(() => {
    loadMedia()
  }, [filters, searchQuery, currentFolder])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const mediaFilters = {
        ...filters,
        folder: currentFolder,
        ...(searchQuery && { search: searchQuery })
      }
      const mediaData = await unifiedMediaService.list(mediaFilters)
      setMedia(mediaData)
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const fileArray = Array.from(files)
      const uploadedMedia = await unifiedMediaService.uploadMultiple(fileArray, currentFolder)
      setMedia(prev => [...uploadedMedia, ...prev])
      setShowUploadZone(false)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [currentFolder])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleSelectMedia = (mediaItem: MediaItem) => {
    if (selectionMode) {
      if (allowMultiple) {
        setSelectedMedia(prev => {
          const isSelected = prev.find(m => m.id === mediaItem.id)
          if (isSelected) {
            return prev.filter(m => m.id !== mediaItem.id)
          } else {
            return [...prev, mediaItem]
          }
        })
      } else {
        setSelectedMedia([mediaItem])
        onSelectMedia?.(mediaItem)
      }
    } else {
      setSelectedForAction(mediaItem)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      try {
        await unifiedMediaService.delete(mediaId)
        setMedia(prev => prev.filter(m => m.id !== mediaId))
        setSelectedMedia(prev => prev.filter(m => m.id !== mediaId))
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />
    } else if (mimeType.startsWith('video/')) {
      return <Video className="w-5 h-5" />
    } else {
      return <FileText className="w-5 h-5" />
    }
  }

  const isSelected = (mediaItem: MediaItem) => {
    return selectedMedia.find(m => m.id === mediaItem.id) !== undefined
  }

  return (
    <div className="space-y-6">
      {/* Barre d'outils */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des médias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sélecteur de dossier */}
            <select
              value={currentFolder}
              onChange={(e) => setCurrentFolder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {folders.map((folder) => (
                <option key={folder.name} value={folder.name}>
                  {folder.label}
                </option>
              ))}
            </select>

            {/* Filtre par type */}
            <select
              value={filters.mimeType || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, mimeType: e.target.value || undefined }))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="application">Documents</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode d'affichage */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>

            {/* Upload */}
            <button
              onClick={() => setShowUploadZone(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Sélection multiple */}
        {selectionMode && selectedMedia.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm text-blue-700">
              {selectedMedia.length} média(s) sélectionné(s)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSelectMedia?.(allowMultiple ? selectedMedia : selectedMedia[0])}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Confirmer la sélection
              </button>
              <button
                onClick={() => setSelectedMedia([])}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zone d'upload */}
      {showUploadZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload de médias</h3>
              <button
                onClick={() => setShowUploadZone(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Glissez-déposez vos fichiers ici ou
              </p>
              <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                Parcourir
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Images, vidéos, documents (max 10MB par fichier)
              </p>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Upload en cours...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((mediaItem) => (
            <div
              key={mediaItem.id}
              onClick={() => handleSelectMedia(mediaItem)}
              className={`relative bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-all ${
                isSelected(mediaItem) ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
            >
              {/* Aperçu */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {mediaItem.mimeType.startsWith('image/') ? (
                  <img
                    src={mediaItem.thumbnailUrl || mediaItem.url}
                    alt={mediaItem.metadata.altText || mediaItem.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getFileIcon(mediaItem.mimeType)}
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="p-2">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {mediaItem.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(mediaItem.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(mediaItem.url, '_blank')
                    }}
                    className="p-1 bg-white rounded shadow text-gray-600 hover:text-gray-800"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMedia(mediaItem.id)
                    }}
                    className="p-1 bg-white rounded shadow text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Indicateur de sélection */}
              {isSelected(mediaItem) && (
                <div className="absolute top-2 left-2">
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ajouté
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {media.map((mediaItem) => (
                <tr
                  key={mediaItem.id}
                  onClick={() => handleSelectMedia(mediaItem)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    isSelected(mediaItem) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {mediaItem.mimeType.startsWith('image/') ? (
                          <img
                            src={mediaItem.thumbnailUrl || mediaItem.url}
                            alt={mediaItem.originalName}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            {getFileIcon(mediaItem.mimeType)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mediaItem.originalName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mediaItem.filename}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {mediaItem.mimeType.split('/')[0]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(mediaItem.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mediaItem.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(mediaItem.url, '_blank')
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMedia(mediaItem.id)
                        }}
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
      )}

      {/* Message si aucun média */}
      {!loading && media.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun média trouvé</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par uploader des fichiers.'}
          </p>
          <button
            onClick={() => setShowUploadZone(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload des médias
          </button>
        </div>
      )}
    </div>
  )
}

export default UnifiedMediaLibrary