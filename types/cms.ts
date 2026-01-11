// Types pour le CMS unifié
export type ContentType = 
  | 'place'
  | 'accommodation'
  | 'experience'
  | 'event'
  | 'article'
  | 'product'
  | 'page'
  | 'block'

export type ContentStatus = 'draft' | 'published' | 'archived'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  slug: string
  status: ContentStatus
  content: Record<string, any>
  metadata: ContentMetadata
  media: MediaReference[]
  seo: SEOData
  permissions: PermissionSet
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  version: number
  history?: ContentVersion[]
}

export interface ContentMetadata {
  description?: string
  keywords?: string[]
  category?: string
  tags?: string[]
  featured?: boolean
  pinned?: boolean
  customFields?: Record<string, any>
}

export interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  canonicalUrl?: string
}

export interface ContentBlock {
  id: string
  type: BlockType
  title?: string
  content: Record<string, any>
  settings: BlockSettings
  media: MediaReference[]
  position: number
  visibility: BlockVisibility
}

export type BlockType = 
  | 'text'
  | 'image'
  | 'video'
  | 'gallery'
  | 'hero'
  | 'cta'
  | 'testimonial'
  | 'faq'
  | 'form'
  | 'custom'

export interface BlockSettings {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  customCSS?: string
  animation?: string
}

export interface BlockVisibility {
  desktop: boolean
  tablet: boolean
  mobile: boolean
  roles?: string[]
}

export interface ContentVersion {
  id: string
  version: number
  content: Record<string, any>
  createdAt: string
  createdBy: string
  changeDescription?: string
}

export interface MediaReference {
  id: string
  mediaId: string
  position: number
  caption?: string
  altText?: string
  width?: number
  height?: number
}

export interface PermissionSet {
  public: boolean
  roles: Record<string, boolean>
  users: Record<string, boolean>
}

export interface MediaItem {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  duration?: number
  url: string
  thumbnailUrl?: string
  folder: string
  tags: string[]
  metadata: MediaMetadata
  usage: MediaUsage[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface MediaMetadata {
  altText?: string
  caption?: string
  copyright?: string
  photographer?: string
  license?: string
  customFields?: Record<string, any>
}

export interface MediaUsage {
  contentId: string
  contentType: ContentType
  position?: number
  createdAt: string
}

export interface ContentFilters {
  type?: ContentType
  status?: ContentStatus
  category?: string
  tags?: string[]
  author?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface MediaFilters {
  folder?: string
  mimeType?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface BulkAction {
  action: 'publish' | 'unpublish' | 'archive' | 'delete' | 'update'
  contentIds: string[]
  updates?: Partial<ContentItem>
}

export interface CMSConfig {
  blockTypes: BlockType[]
  contentTypes: ContentType[]
  mediaFolders: string[]
  permissions: Record<string, string[]>
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
  }
}