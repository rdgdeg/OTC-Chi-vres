import { supabase } from '../supabaseClient'
import { MediaItem, MediaFilters, MediaMetadata, MediaUsage, ContentType } from '../../types/cms'

export class UnifiedMediaService {
  // Upload Operations
  async upload(file: File, folder: string = 'general', metadata?: MediaMetadata): Promise<MediaItem> {
    try {
      // Générer un nom de fichier unique
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`
      const filePath = `${folder}/${filename}`

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      // Extraire les métadonnées du fichier
      const fileMetadata = await this.extractFileMetadata(file)

      // Créer l'enregistrement en base
      const mediaData = {
        filename,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        width: fileMetadata.width,
        height: fileMetadata.height,
        duration: fileMetadata.duration,
        url: publicUrl,
        thumbnail_url: await this.generateThumbnail(publicUrl, file.type),
        folder,
        tags: [],
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: media, error: dbError } = await supabase
        .from('media')
        .insert(mediaData)
        .select()
        .single()

      if (dbError) throw dbError

      // Log audit
      await this.logAudit('upload', media.id, { filename, folder, size: file.size })

      return this.formatMediaItem(media)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      throw error
    }
  }

  async uploadMultiple(files: File[], folder: string = 'general'): Promise<MediaItem[]> {
    try {
      const results: MediaItem[] = []

      for (const file of files) {
        const media = await this.upload(file, folder)
        results.push(media)
      }

      return results
    } catch (error) {
      console.error('Erreur lors de l\'upload multiple:', error)
      throw error
    }
  }

  async uploadFromUrl(url: string, folder: string = 'general'): Promise<MediaItem> {
    try {
      // Télécharger le fichier depuis l'URL
      const response = await fetch(url)
      if (!response.ok) throw new Error('Impossible de télécharger le fichier')

      const blob = await response.blob()
      const filename = url.split('/').pop() || 'uploaded-file'
      const file = new File([blob], filename, { type: blob.type })

      return await this.upload(file, folder)
    } catch (error) {
      console.error('Erreur lors de l\'upload depuis URL:', error)
      throw error
    }
  }

  // Management Operations
  async get(id: string): Promise<MediaItem> {
    try {
      const { data: media, error } = await supabase
        .from('media')
        .select(`
          *,
          content_media (
            content_id,
            position,
            content_items (
              id,
              type,
              title
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!media) throw new Error('Média non trouvé')

      return this.formatMediaItem(media)
    } catch (error) {
      console.error('Erreur lors de la récupération du média:', error)
      throw error
    }
  }

  async list(filters: MediaFilters = {}): Promise<MediaItem[]> {
    try {
      let query = supabase
        .from('media')
        .select(`
          *,
          content_media (
            content_id,
            position,
            content_items (
              id,
              type,
              title
            )
          )
        `)

      // Appliquer les filtres
      if (filters.folder) {
        query = query.eq('folder', filters.folder)
      }
      if (filters.mimeType) {
        query = query.like('mime_type', `${filters.mimeType}%`)
      }
      if (filters.search) {
        query = query.or(`filename.ilike.%${filters.search}%,original_name.ilike.%${filters.search}%`)
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      // Tri par date de création
      query = query.order('created_at', { ascending: false })

      const { data: media, error } = await query

      if (error) throw error

      return media?.map(this.formatMediaItem) || []
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste:', error)
      throw error
    }
  }

  async search(query: string, folder?: string): Promise<MediaItem[]> {
    try {
      const filters: MediaFilters = { search: query }
      if (folder) filters.folder = folder

      return await this.list(filters)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Récupérer les infos du média
      const media = await this.get(id)

      // Supprimer les relations de contenu
      await supabase
        .from('content_media')
        .delete()
        .eq('media_id', id)

      // Supprimer le fichier du storage
      const filePath = `${media.folder}/${media.filename}`
      await supabase.storage
        .from('media')
        .remove([filePath])

      // Supprimer l'enregistrement en base
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log audit
      await this.logAudit('delete', id, { filename: media.filename })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.delete(id)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error)
      throw error
    }
  }

  // Organization Operations
  async move(id: string, newFolder: string): Promise<MediaItem> {
    try {
      const media = await this.get(id)
      const oldPath = `${media.folder}/${media.filename}`
      const newPath = `${newFolder}/${media.filename}`

      // Déplacer le fichier dans le storage
      const { data: file } = await supabase.storage
        .from('media')
        .download(oldPath)

      if (file) {
        await supabase.storage
          .from('media')
          .upload(newPath, file)

        await supabase.storage
          .from('media')
          .remove([oldPath])
      }

      // Mettre à jour l'enregistrement
      const { data: updatedMedia, error } = await supabase
        .from('media')
        .update({ 
          folder: newFolder,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log audit
      await this.logAudit('move', id, { oldFolder: media.folder, newFolder })

      return this.formatMediaItem(updatedMedia)
    } catch (error) {
      console.error('Erreur lors du déplacement:', error)
      throw error
    }
  }

  async rename(id: string, newName: string): Promise<MediaItem> {
    try {
      const { data: media, error } = await supabase
        .from('media')
        .update({ 
          original_name: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log audit
      await this.logAudit('rename', id, { newName })

      return this.formatMediaItem(media)
    } catch (error) {
      console.error('Erreur lors du renommage:', error)
      throw error
    }
  }

  async updateMetadata(id: string, metadata: Partial<MediaMetadata>): Promise<MediaItem> {
    try {
      const { data: media, error } = await supabase
        .from('media')
        .update({ 
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log audit
      await this.logAudit('update_metadata', id, metadata)

      return this.formatMediaItem(media)
    } catch (error) {
      console.error('Erreur lors de la mise à jour des métadonnées:', error)
      throw error
    }
  }

  // Optimization Operations
  async generateThumbnail(url: string, mimeType: string, width: number = 300, height: number = 300): Promise<string> {
    try {
      // Pour les images, générer une miniature
      if (mimeType.startsWith('image/')) {
        // Utiliser l'API de transformation d'images de Supabase ou un service externe
        return `${url}?width=${width}&height=${height}&resize=cover`
      }
      
      // Pour les vidéos, retourner une image par défaut
      if (mimeType.startsWith('video/')) {
        return '/images/video-thumbnail.png'
      }

      // Pour les autres types, retourner une icône par défaut
      return '/images/file-thumbnail.png'
    } catch (error) {
      console.error('Erreur lors de la génération de miniature:', error)
      return url
    }
  }

  async generateVariants(id: string, sizes: { width: number; height: number; name: string }[]): Promise<Record<string, string>> {
    try {
      const media = await this.get(id)
      const variants: Record<string, string> = {}

      for (const size of sizes) {
        variants[size.name] = await this.generateThumbnail(media.url, media.mimeType, size.width, size.height)
      }

      return variants
    } catch (error) {
      console.error('Erreur lors de la génération de variantes:', error)
      throw error
    }
  }

  async optimizeImage(id: string): Promise<MediaItem> {
    try {
      // Implémenter l'optimisation d'image (compression, format WebP, etc.)
      const media = await this.get(id)
      
      // Log audit
      await this.logAudit('optimize', id, {})

      return media
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error)
      throw error
    }
  }

  // Usage Tracking
  async trackUsage(mediaId: string, contentId: string, contentType: ContentType): Promise<void> {
    try {
      // Cette fonction est gérée par les relations content_media
      // Pas besoin d'implémentation supplémentaire
    } catch (error) {
      console.error('Erreur lors du tracking d\'utilisation:', error)
    }
  }

  async getUsage(mediaId: string): Promise<MediaUsage[]> {
    try {
      const { data: usage, error } = await supabase
        .from('content_media')
        .select(`
          content_id,
          position,
          created_at,
          content_items (
            type,
            title
          )
        `)
        .eq('media_id', mediaId)

      if (error) throw error

      return usage?.map((u: any) => ({
        contentId: u.content_id,
        contentType: u.content_items.type,
        position: u.position,
        createdAt: u.created_at
      })) || []
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisation:', error)
      throw error
    }
  }

  async findUnused(): Promise<MediaItem[]> {
    try {
      const { data: unusedMedia, error } = await supabase
        .from('media')
        .select(`
          *,
          content_media (
            content_id
          )
        `)
        .is('content_media.content_id', null)

      if (error) throw error

      return unusedMedia?.map(this.formatMediaItem) || []
    } catch (error) {
      console.error('Erreur lors de la recherche de médias non utilisés:', error)
      throw error
    }
  }

  async cleanupUnused(): Promise<void> {
    try {
      const unusedMedia = await this.findUnused()
      
      for (const media of unusedMedia) {
        await this.delete(media.id)
      }

      // Log audit
      await this.logAudit('cleanup_unused', 'bulk', { count: unusedMedia.length })
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error)
      throw error
    }
  }

  // Utility Methods
  private async extractFileMetadata(file: File): Promise<{ width?: number; height?: number; duration?: number }> {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => resolve({})
        img.src = URL.createObjectURL(file)
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.onloadedmetadata = () => {
          resolve({ 
            width: video.videoWidth, 
            height: video.videoHeight, 
            duration: video.duration 
          })
        }
        video.onerror = () => resolve({})
        video.src = URL.createObjectURL(file)
      } else {
        resolve({})
      }
    })
  }

  private formatMediaItem(data: any): MediaItem {
    return {
      ...data,
      usage: data.content_media?.map((cm: any) => ({
        contentId: cm.content_id,
        contentType: cm.content_items?.type,
        position: cm.position,
        createdAt: cm.created_at
      })) || []
    }
  }

  private async logAudit(action: string, resourceId: string, changes: any): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          action,
          resource: 'media',
          resource_id: resourceId,
          changes,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Erreur lors du log d\'audit:', error)
    }
  }
}

export const unifiedMediaService = new UnifiedMediaService()