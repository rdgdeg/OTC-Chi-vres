import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { ContentItem, ContentType, MediaItem, CMSConfig } from '../types/cms'
import { contentService } from '../services/cms/ContentService'
import { unifiedMediaService } from '../services/cms/UnifiedMediaService'

// Types pour le contexte
interface CMSState {
  // Configuration
  config: CMSConfig
  
  // Contenu
  contents: ContentItem[]
  selectedContent: ContentItem | null
  contentLoading: boolean
  contentError: string | null
  
  // Médias
  media: MediaItem[]
  selectedMedia: MediaItem[]
  mediaLoading: boolean
  mediaError: string | null
  
  // UI State
  currentView: 'overview' | 'content' | 'media' | 'settings' | 'analytics'
  sidebarOpen: boolean
  
  // Éditeur
  editorMode: 'visual' | 'code' | 'preview'
  isDirty: boolean
}

// Actions
type CMSAction =
  | { type: 'SET_CONFIG'; payload: CMSConfig }
  | { type: 'SET_CONTENTS'; payload: ContentItem[] }
  | { type: 'ADD_CONTENT'; payload: ContentItem }
  | { type: 'UPDATE_CONTENT'; payload: { id: string; content: ContentItem } }
  | { type: 'DELETE_CONTENT'; payload: string }
  | { type: 'SELECT_CONTENT'; payload: ContentItem | null }
  | { type: 'SET_CONTENT_LOADING'; payload: boolean }
  | { type: 'SET_CONTENT_ERROR'; payload: string | null }
  | { type: 'SET_MEDIA'; payload: MediaItem[] }
  | { type: 'ADD_MEDIA'; payload: MediaItem[] }
  | { type: 'DELETE_MEDIA'; payload: string }
  | { type: 'SELECT_MEDIA'; payload: MediaItem[] }
  | { type: 'SET_MEDIA_LOADING'; payload: boolean }
  | { type: 'SET_MEDIA_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_VIEW'; payload: CMSState['currentView'] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_EDITOR_MODE'; payload: CMSState['editorMode'] }
  | { type: 'SET_DIRTY'; payload: boolean }

// État initial
const initialState: CMSState = {
  config: {
    blockTypes: ['text', 'image', 'video', 'gallery', 'hero', 'cta', 'testimonial', 'faq'],
    contentTypes: ['place', 'accommodation', 'experience', 'event', 'article', 'product', 'page'],
    mediaFolders: ['general', 'accommodations', 'places', 'events', 'articles', 'homepage'],
    permissions: {
      'super_admin': ['*:*'],
      'admin': ['content:*', 'media:*', 'audit:read'],
      'editor': ['content:create', 'content:read', 'content:update', 'content:publish', 'media:create', 'media:read', 'media:update'],
      'viewer': ['content:read', 'media:read']
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      backgroundColor: '#F9FAFB',
      textColor: '#111827'
    }
  },
  contents: [],
  selectedContent: null,
  contentLoading: false,
  contentError: null,
  media: [],
  selectedMedia: [],
  mediaLoading: false,
  mediaError: null,
  currentView: 'overview',
  sidebarOpen: true,
  editorMode: 'visual',
  isDirty: false
}

// Reducer
const cmsReducer = (state: CMSState, action: CMSAction): CMSState => {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.payload }
    
    case 'SET_CONTENTS':
      return { ...state, contents: action.payload }
    
    case 'ADD_CONTENT':
      return { 
        ...state, 
        contents: [action.payload, ...state.contents] 
      }
    
    case 'UPDATE_CONTENT':
      return {
        ...state,
        contents: state.contents.map(c => 
          c.id === action.payload.id ? action.payload.content : c
        ),
        selectedContent: state.selectedContent?.id === action.payload.id 
          ? action.payload.content 
          : state.selectedContent
      }
    
    case 'DELETE_CONTENT':
      return {
        ...state,
        contents: state.contents.filter(c => c.id !== action.payload),
        selectedContent: state.selectedContent?.id === action.payload 
          ? null 
          : state.selectedContent
      }
    
    case 'SELECT_CONTENT':
      return { ...state, selectedContent: action.payload }
    
    case 'SET_CONTENT_LOADING':
      return { ...state, contentLoading: action.payload }
    
    case 'SET_CONTENT_ERROR':
      return { ...state, contentError: action.payload }
    
    case 'SET_MEDIA':
      return { ...state, media: action.payload }
    
    case 'ADD_MEDIA':
      return { 
        ...state, 
        media: [...action.payload, ...state.media] 
      }
    
    case 'DELETE_MEDIA':
      return {
        ...state,
        media: state.media.filter(m => m.id !== action.payload),
        selectedMedia: state.selectedMedia.filter(m => m.id !== action.payload)
      }
    
    case 'SELECT_MEDIA':
      return { ...state, selectedMedia: action.payload }
    
    case 'SET_MEDIA_LOADING':
      return { ...state, mediaLoading: action.payload }
    
    case 'SET_MEDIA_ERROR':
      return { ...state, mediaError: action.payload }
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload }
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    
    case 'SET_EDITOR_MODE':
      return { ...state, editorMode: action.payload }
    
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload }
    
    default:
      return state
  }
}

// Interface du contexte
interface CMSContextType {
  state: CMSState
  dispatch: React.Dispatch<CMSAction>
  
  // Actions de contenu
  loadContent: (filters?: any) => Promise<void>
  createContent: (type: ContentType, data: Partial<ContentItem>) => Promise<ContentItem>
  updateContent: (id: string, data: Partial<ContentItem>) => Promise<ContentItem>
  deleteContent: (id: string) => Promise<void>
  publishContent: (id: string) => Promise<ContentItem>
  
  // Actions de média
  loadMedia: (filters?: any) => Promise<void>
  uploadMedia: (files: File[], folder?: string) => Promise<MediaItem[]>
  deleteMedia: (id: string) => Promise<void>
  
  // Actions UI
  setCurrentView: (view: CMSState['currentView']) => void
  toggleSidebar: () => void
  setEditorMode: (mode: CMSState['editorMode']) => void
  setDirty: (dirty: boolean) => void
}

// Créer le contexte
const CMSContext = createContext<CMSContextType | undefined>(undefined)

// Provider
export const UnifiedCMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cmsReducer, initialState)

  // Actions de contenu
  const loadContent = async (filters?: any) => {
    dispatch({ type: 'SET_CONTENT_LOADING', payload: true })
    dispatch({ type: 'SET_CONTENT_ERROR', payload: null })
    
    try {
      const contents = await contentService.list(filters)
      dispatch({ type: 'SET_CONTENTS', payload: contents })
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error)
      dispatch({ 
        type: 'SET_CONTENT_ERROR', 
        payload: error instanceof Error ? error.message : 'Erreur inconnue' 
      })
    } finally {
      dispatch({ type: 'SET_CONTENT_LOADING', payload: false })
    }
  }

  const createContent = async (type: ContentType, data: Partial<ContentItem>) => {
    try {
      const newContent = await contentService.create(type, data)
      dispatch({ type: 'ADD_CONTENT', payload: newContent })
      return newContent
    } catch (error) {
      console.error('Erreur lors de la création du contenu:', error)
      throw error
    }
  }

  const updateContent = async (id: string, data: Partial<ContentItem>) => {
    try {
      const updatedContent = await contentService.update(id, data)
      dispatch({ 
        type: 'UPDATE_CONTENT', 
        payload: { id, content: updatedContent } 
      })
      return updatedContent
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu:', error)
      throw error
    }
  }

  const deleteContent = async (id: string) => {
    try {
      await contentService.delete(id)
      dispatch({ type: 'DELETE_CONTENT', payload: id })
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu:', error)
      throw error
    }
  }

  const publishContent = async (id: string) => {
    try {
      const publishedContent = await contentService.publish(id)
      dispatch({ 
        type: 'UPDATE_CONTENT', 
        payload: { id, content: publishedContent } 
      })
      return publishedContent
    } catch (error) {
      console.error('Erreur lors de la publication du contenu:', error)
      throw error
    }
  }

  // Actions de média
  const loadMedia = async (filters?: any) => {
    dispatch({ type: 'SET_MEDIA_LOADING', payload: true })
    dispatch({ type: 'SET_MEDIA_ERROR', payload: null })
    
    try {
      const media = await unifiedMediaService.list(filters)
      dispatch({ type: 'SET_MEDIA', payload: media })
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error)
      dispatch({ 
        type: 'SET_MEDIA_ERROR', 
        payload: error instanceof Error ? error.message : 'Erreur inconnue' 
      })
    } finally {
      dispatch({ type: 'SET_MEDIA_LOADING', payload: false })
    }
  }

  const uploadMedia = async (files: File[], folder = 'general') => {
    try {
      const uploadedMedia = await unifiedMediaService.uploadMultiple(files, folder)
      dispatch({ type: 'ADD_MEDIA', payload: uploadedMedia })
      return uploadedMedia
    } catch (error) {
      console.error('Erreur lors de l\'upload des médias:', error)
      throw error
    }
  }

  const deleteMedia = async (id: string) => {
    try {
      await unifiedMediaService.delete(id)
      dispatch({ type: 'DELETE_MEDIA', payload: id })
    } catch (error) {
      console.error('Erreur lors de la suppression du média:', error)
      throw error
    }
  }

  // Actions UI
  const setCurrentView = (view: CMSState['currentView']) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view })
  }

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  const setEditorMode = (mode: CMSState['editorMode']) => {
    dispatch({ type: 'SET_EDITOR_MODE', payload: mode })
  }

  const setDirty = (dirty: boolean) => {
    dispatch({ type: 'SET_DIRTY', payload: dirty })
  }

  // Charger les données initiales
  useEffect(() => {
    loadContent()
    loadMedia()
  }, [])

  const contextValue: CMSContextType = {
    state,
    dispatch,
    loadContent,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    loadMedia,
    uploadMedia,
    deleteMedia,
    setCurrentView,
    toggleSidebar,
    setEditorMode,
    setDirty
  }

  return (
    <CMSContext.Provider value={contextValue}>
      {children}
    </CMSContext.Provider>
  )
}

// Hook pour utiliser le contexte
export const useUnifiedCMS = () => {
  const context = useContext(CMSContext)
  if (context === undefined) {
    throw new Error('useUnifiedCMS must be used within a UnifiedCMSProvider')
  }
  return context
}

// Hook pour les statistiques
export const useCMSStatistics = () => {
  const { state } = useUnifiedCMS()
  
  const stats = {
    totalContent: state.contents.length,
    publishedContent: state.contents.filter(c => c.status === 'published').length,
    draftContent: state.contents.filter(c => c.status === 'draft').length,
    archivedContent: state.contents.filter(c => c.status === 'archived').length,
    totalMedia: state.media.length,
    mediaSize: state.media.reduce((sum, m) => sum + m.size, 0),
    contentByType: state.contents.reduce((acc, content) => {
      acc[content.type] = (acc[content.type] || 0) + 1
      return acc
    }, {} as Record<ContentType, number>),
    mediaByType: state.media.reduce((acc, mediaItem) => {
      const type = mediaItem.mimeType.split('/')[0]
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
  
  return stats
}

export default UnifiedCMSProvider