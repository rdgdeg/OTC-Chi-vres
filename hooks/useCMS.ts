import { useState, useEffect, useCallback } from 'react'
import { ContentItem, ContentType, ContentFilters, MediaItem, MediaFilters } from '../types/cms'
import { contentService } from '../services/cms/ContentService'
import { unifiedMediaService } from '../services/cms/UnifiedMediaService'

interface UseCMSReturn {
  // Content
  contents: ContentItem[]
  selectedContent: ContentItem | null
  contentLoading: boolean
  contentError: string | null
  
  // Media
  media: MediaItem[]
  selectedMedia: MediaItem[]
  mediaLoading: boolean
  mediaError: string | null
  
  // Actions
  loadContent: (filters?: ContentFilters) => Promise<void>
  loadMedia: (filters?: MediaFilters) => Promise<void>
  createContent: (type: ContentType, data: Partial<ContentItem>) => Promise<ContentItem>
  updateContent: (id: string, data: Partial<ContentItem>) => Promise<ContentItem>
  deleteContent: (id: string) => Promise<void>
  publishContent: (id: string) => Promise<ContentItem>
  uploadMedia: (files: File[], folder?: string) => Promise<MediaItem[]>
  deleteMedia: (id: string) => Promise<void>
  
  // Selection
  selectContent: (content: ContentItem | null) => void
  selectMedia: (media: MediaItem[]) => void
  
  // Search
  searchContent: (query: string, type?: ContentType) => Promise<ContentItem[]>
  searchMedia: (query: string, folder?: string) => Promise<MediaItem[]>
}

export const useCMS = (): UseCMSReturn => {
  // State pour le contenu
  const [contents, setContents] = useState<ContentItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)
  
  // State pour les médias
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  // Charger le contenu
  const loadContent = useCallback(async (filters?: ContentFilters) => {
    setContentLoading(true)
    setContentError(null)
    try {
      const data = await contentService.list(filters)
      setContents(data)
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error)
      setContentError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setContentLoading(false)
    }
  }, [])

  // Charger les médias
  const loadMedia = useCallback(async (filters?: MediaFilters) => {
    setMediaLoading(true)
    setMediaError(null)
    try {
      const data = await unifiedMediaService.list(filters)
      setMedia(data)
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error)
      setMediaError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setMediaLoading(false)
    }
  }, [])

  // Créer du contenu
  const createContent = useCallback(async (type: ContentType, data: Partial<ContentItem>) => {
    try {
      const newContent = await contentService.create(type, data)
      setContents(prev => [newContent, ...prev])
      return newContent
    } catch (error) {
      console.error('Erreur lors de la création du contenu:', error)
      throw error
    }
  }, [])

  // Mettre à jour le contenu
  const updateContent = useCallback(async (id: string, data: Partial<ContentItem>) => {
    try {
      const updatedContent = await contentService.update(id, data)
      setContents(prev => prev.map(c => c.id === id ? updatedContent : c))
      if (selectedContent?.id === id) {
        setSelectedContent(updatedContent)
      }
      return updatedContent
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu:', error)
      throw error
    }
  }, [selectedContent])

  // Supprimer le contenu
  const deleteContent = useCallback(async (id: string) => {
    try {
      await contentService.delete(id)
      setContents(prev => prev.filter(c => c.id !== id))
      if (selectedContent?.id === id) {
        setSelectedContent(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu:', error)
      throw error
    }
  }, [selectedContent])

  // Publier le contenu
  const publishContent = useCallback(async (id: string) => {
    try {
      const publishedContent = await contentService.publish(id)
      setContents(prev => prev.map(c => c.id === id ? publishedContent : c))
      if (selectedContent?.id === id) {
        setSelectedContent(publishedContent)
      }
      return publishedContent
    } catch (error) {
      console.error('Erreur lors de la publication du contenu:', error)
      throw error
    }
  }, [selectedContent])

  // Upload de médias
  const uploadMedia = useCallback(async (files: File[], folder = 'general') => {
    try {
      const uploadedMedia = await unifiedMediaService.uploadMultiple(files, folder)
      setMedia(prev => [...uploadedMedia, ...prev])
      return uploadedMedia
    } catch (error) {
      console.error('Erreur lors de l\'upload des médias:', error)
      throw error
    }
  }, [])

  // Supprimer un média
  const deleteMedia = useCallback(async (id: string) => {
    try {
      await unifiedMediaService.delete(id)
      setMedia(prev => prev.filter(m => m.id !== id))
      setSelectedMedia(prev => prev.filter(m => m.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression du média:', error)
      throw error
    }
  }, [])

  // Sélectionner du contenu
  const selectContent = useCallback((content: ContentItem | null) => {
    setSelectedContent(content)
  }, [])

  // Sélectionner des médias
  const selectMedia = useCallback((media: MediaItem[]) => {
    setSelectedMedia(media)
  }, [])

  // Rechercher du contenu
  const searchContent = useCallback(async (query: string, type?: ContentType) => {
    try {
      return await contentService.search(query, type)
    } catch (error) {
      console.error('Erreur lors de la recherche de contenu:', error)
      throw error
    }
  }, [])

  // Rechercher des médias
  const searchMedia = useCallback(async (query: string, folder?: string) => {
    try {
      return await unifiedMediaService.search(query, folder)
    } catch (error) {
      console.error('Erreur lors de la recherche de médias:', error)
      throw error
    }
  }, [])

  // Charger les données initiales
  useEffect(() => {
    loadContent()
    loadMedia()
  }, [loadContent, loadMedia])

  return {
    // Content
    contents,
    selectedContent,
    contentLoading,
    contentError,
    
    // Media
    media,
    selectedMedia,
    mediaLoading,
    mediaError,
    
    // Actions
    loadContent,
    loadMedia,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    uploadMedia,
    deleteMedia,
    
    // Selection
    selectContent,
    selectMedia,
    
    // Search
    searchContent,
    searchMedia
  }
}

// Hook spécialisé pour un type de contenu spécifique
export const useContentType = (type: ContentType) => {
  const cms = useCMS()
  
  const typeContents = cms.contents.filter(c => c.type === type)
  
  const loadTypeContent = useCallback(() => {
    return cms.loadContent({ type })
  }, [cms.loadContent, type])
  
  const createTypeContent = useCallback((data: Partial<ContentItem>) => {
    return cms.createContent(type, data)
  }, [cms.createContent, type])
  
  return {
    ...cms,
    contents: typeContents,
    loadContent: loadTypeContent,
    createContent: createTypeContent
  }
}

// Hook pour les statistiques
export const useCMSStats = () => {
  const { contents, media } = useCMS()
  
  const stats = {
    totalContent: contents.length,
    publishedContent: contents.filter(c => c.status === 'published').length,
    draftContent: contents.filter(c => c.status === 'draft').length,
    archivedContent: contents.filter(c => c.status === 'archived').length,
    totalMedia: media.length,
    mediaSize: media.reduce((sum, m) => sum + m.size, 0),
    contentByType: contents.reduce((acc, content) => {
      acc[content.type] = (acc[content.type] || 0) + 1
      return acc
    }, {} as Record<ContentType, number>),
    mediaByType: media.reduce((acc, mediaItem) => {
      const type = mediaItem.mimeType.split('/')[0]
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
  
  return stats
}

export default useCMS