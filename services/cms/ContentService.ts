import { supabase } from '../supabaseClient'
import { ContentItem, ContentType, ContentFilters, ContentVersion, BulkAction, MediaReference } from '../../types/cms'

export class ContentService {
  // CRUD Operations
  async create(type: ContentType, data: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const contentData = {
        type,
        title: data.title || 'Nouveau contenu',
        slug: data.slug || this.generateSlug(data.title || 'nouveau-contenu'),
        status: data.status || 'draft',
        content: data.content || {},
        metadata: data.metadata || {},
        seo: data.seo || {},
        permissions: data.permissions || { public: true, roles: {}, users: {} },
        version: 1,
        created_by: data.createdBy,
        updated_by: data.createdBy
      }

      const { data: content, error } = await supabase
        .from('content_items')
        .insert(contentData)
        .select()
        .single()

      if (error) throw error

      // Log audit
      await this.logAudit('create', content.id, contentData)

      return content
    } catch (error) {
      console.error('Erreur lors de la création du contenu:', error)
      throw error
    }
  }

  async read(id: string): Promise<ContentItem> {
    try {
      const { data: content, error } = await supabase
        .from('content_items')
        .select(`
          *,
          content_media (
            id,
            media_id,
            position,
            caption,
            alt_text,
            width,
            height,
            media (
              id,
              filename,
              url,
              thumbnail_url,
              mime_type,
              size,
              width,
              height
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!content) throw new Error('Contenu non trouvé')

      return this.formatContentItem(content)
    } catch (error) {
      console.error('Erreur lors de la lecture du contenu:', error)
      throw error
    }
  }

  async update(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    try {
      // Récupérer la version actuelle
      const currentContent = await this.read(id)
      
      // Créer une nouvelle version
      await this.createVersion(id, currentContent)

      const updateData = {
        ...updates,
        version: currentContent.version + 1,
        updated_at: new Date().toISOString(),
        updated_by: updates.updatedBy
      }

      const { data: content, error } = await supabase
        .from('content_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log audit
      await this.logAudit('update', id, updates)

      return content
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Supprimer les relations média
      await supabase
        .from('content_media')
        .delete()
        .eq('content_id', id)

      // Supprimer les versions
      await supabase
        .from('content_versions')
        .delete()
        .eq('content_id', id)

      // Supprimer le contenu
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Log audit
      await this.logAudit('delete', id, {})
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu:', error)
      throw error
    }
  }

  // Listing & Filtering
  async list(filters: ContentFilters = {}): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_media (
            id,
            media_id,
            position,
            caption,
            alt_text,
            media (
              id,
              filename,
              url,
              thumbnail_url
            )
          )
        `)

      // Appliquer les filtres
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.author) {
        query = query.eq('created_by', filters.author)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content->>'description'.ilike.%${filters.search}%`)
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      // Tri par date de modification
      query = query.order('updated_at', { ascending: false })

      const { data: contents, error } = await query

      if (error) throw error

      return contents?.map(this.formatContentItem) || []
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste:', error)
      throw error
    }
  }

  async search(query: string, type?: ContentType): Promise<ContentItem[]> {
    try {
      const filters: ContentFilters = { search: query }
      if (type) filters.type = type

      return await this.list(filters)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw error
    }
  }

  async getBySlug(slug: string, type?: ContentType): Promise<ContentItem> {
    try {
      let query = supabase
        .from('content_items')
        .select(`
          *,
          content_media (
            id,
            media_id,
            position,
            caption,
            alt_text,
            media (
              id,
              filename,
              url,
              thumbnail_url
            )
          )
        `)
        .eq('slug', slug)

      if (type) {
        query = query.eq('type', type)
      }

      const { data: content, error } = await query.single()

      if (error) throw error
      if (!content) throw new Error('Contenu non trouvé')

      return this.formatContentItem(content)
    } catch (error) {
      console.error('Erreur lors de la récupération par slug:', error)
      throw error
    }
  }

  // Status Management
  async publish(id: string): Promise<ContentItem> {
    return await this.update(id, { status: 'published' })
  }

  async unpublish(id: string): Promise<ContentItem> {
    return await this.update(id, { status: 'draft' })
  }

  async archive(id: string): Promise<ContentItem> {
    return await this.update(id, { status: 'archived' })
  }

  // Versioning
  async getHistory(id: string): Promise<ContentVersion[]> {
    try {
      const { data: versions, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', id)
        .order('version', { ascending: false })

      if (error) throw error

      return versions || []
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      throw error
    }
  }

  async revertToVersion(id: string, versionId: string): Promise<ContentItem> {
    try {
      // Récupérer la version
      const { data: version, error: versionError } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId)
        .single()

      if (versionError) throw versionError

      // Restaurer le contenu
      return await this.update(id, {
        content: version.content,
        updatedBy: version.created_by
      })
    } catch (error) {
      console.error('Erreur lors de la restauration de version:', error)
      throw error
    }
  }

  // Bulk Operations
  async bulkUpdate(ids: string[], updates: Partial<ContentItem>): Promise<ContentItem[]> {
    try {
      const results: ContentItem[] = []

      for (const id of ids) {
        const updated = await this.update(id, updates)
        results.push(updated)
      }

      return results
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse:', error)
      throw error
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.delete(id)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error)
      throw error
    }
  }

  async bulkPublish(ids: string[]): Promise<ContentItem[]> {
    return await this.bulkUpdate(ids, { status: 'published' })
  }

  async bulkAction(action: BulkAction): Promise<ContentItem[] | void> {
    switch (action.action) {
      case 'publish':
        return await this.bulkPublish(action.contentIds)
      case 'unpublish':
        return await this.bulkUpdate(action.contentIds, { status: 'draft' })
      case 'archive':
        return await this.bulkUpdate(action.contentIds, { status: 'archived' })
      case 'delete':
        return await this.bulkDelete(action.contentIds)
      case 'update':
        if (action.updates) {
          return await this.bulkUpdate(action.contentIds, action.updates)
        }
        break
    }
  }

  // Media Management
  async attachMedia(contentId: string, mediaId: string, position?: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_media')
        .insert({
          content_id: contentId,
          media_id: mediaId,
          position: position || 0
        })

      if (error) throw error

      // Log audit
      await this.logAudit('attach_media', contentId, { mediaId, position })
    } catch (error) {
      console.error('Erreur lors de l\'attachement du média:', error)
      throw error
    }
  }

  async detachMedia(contentId: string, mediaId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_media')
        .delete()
        .eq('content_id', contentId)
        .eq('media_id', mediaId)

      if (error) throw error

      // Log audit
      await this.logAudit('detach_media', contentId, { mediaId })
    } catch (error) {
      console.error('Erreur lors du détachement du média:', error)
      throw error
    }
  }

  async reorderMedia(contentId: string, mediaIds: string[]): Promise<void> {
    try {
      for (let i = 0; i < mediaIds.length; i++) {
        await supabase
          .from('content_media')
          .update({ position: i })
          .eq('content_id', contentId)
          .eq('media_id', mediaIds[i])
      }

      // Log audit
      await this.logAudit('reorder_media', contentId, { mediaIds })
    } catch (error) {
      console.error('Erreur lors de la réorganisation des médias:', error)
      throw error
    }
  }

  // Utility Methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private formatContentItem(data: any): ContentItem {
    return {
      ...data,
      media: data.content_media?.map((cm: any) => ({
        id: cm.id,
        mediaId: cm.media_id,
        position: cm.position,
        caption: cm.caption,
        altText: cm.alt_text,
        width: cm.width,
        height: cm.height,
        media: cm.media
      })) || []
    }
  }

  private async createVersion(contentId: string, content: ContentItem): Promise<void> {
    try {
      await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          version: content.version,
          content: content.content,
          created_by: content.updatedBy,
          change_description: 'Version automatique'
        })
    } catch (error) {
      console.error('Erreur lors de la création de version:', error)
    }
  }

  private async logAudit(action: string, resourceId: string, changes: any): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          action,
          resource: 'content',
          resource_id: resourceId,
          changes,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Erreur lors du log d\'audit:', error)
    }
  }
}

export const contentService = new ContentService()