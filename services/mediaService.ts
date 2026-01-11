import { supabase } from './supabaseClient';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  storagePath: string;
  publicUrl: string;
  altText?: string;
  caption?: string;
  uploadedBy?: string;
  folder: string;
  createdAt: string;
}

export class MediaService {
  
  // Upload d'un fichier avec métadonnées
  static async uploadFile(
    file: File, 
    folder: string = 'general',
    altText?: string,
    caption?: string
  ): Promise<MediaFile> {
    try {
      // Validation du fichier
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Seules les images sont autorisées');
      }

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storagePath = `${folder}/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      // Obtenir les dimensions de l'image
      const dimensions = await this.getImageDimensions(file);

      // Enregistrer les métadonnées en base
      const mediaData = {
        filename: fileName,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        width: dimensions.width,
        height: dimensions.height,
        storagePath,
        publicUrl,
        altText,
        caption,
        folder,
      };

      const { data: dbData, error: dbError } = await supabase
        .from('media')
        .insert(mediaData)
        .select()
        .single();

      if (dbError) throw dbError;

      return dbData;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: File[],
    folder: string = 'general'
  ): Promise<MediaFile[]> {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, folder)
    );
    
    return Promise.all(uploadPromises);
  }

  // Obtenir les dimensions d'une image
  static getImageDimensions(file: File): Promise<{width: number, height: number}> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // Lister les médias avec pagination
  static async getMedia(
    folder?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: MediaFile[], total: number }> {
    try {
      let query = supabase
        .from('media')
        .select('*', { count: 'exact' })
        .order('createdAt', { ascending: false });

      if (folder) {
        query = query.eq('folder', folder);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Get media error:', error);
      return { data: [], total: 0 };
    }
  }

  // Rechercher des médias
  static async searchMedia(
    query: string,
    folder?: string
  ): Promise<MediaFile[]> {
    try {
      let dbQuery = supabase
        .from('media')
        .select('*')
        .or(`originalName.ilike.%${query}%,altText.ilike.%${query}%,caption.ilike.%${query}%`)
        .order('createdAt', { ascending: false });

      if (folder) {
        dbQuery = dbQuery.eq('folder', folder);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search media error:', error);
      return [];
    }
  }

  // Mettre à jour les métadonnées d'un média
  static async updateMedia(
    id: string,
    updates: Partial<Pick<MediaFile, 'altText' | 'caption' | 'folder'>>
  ): Promise<MediaFile | null> {
    try {
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update media error:', error);
      return null;
    }
  }

  // Supprimer un média
  static async deleteMedia(id: string): Promise<boolean> {
    try {
      // Récupérer les infos du média
      const { data: media, error: fetchError } = await supabase
        .from('media')
        .select('storagePath')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Supprimer du storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([media.storagePath]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
      }

      // Supprimer de la base
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Delete media error:', error);
      return false;
    }
  }

  // Obtenir les statistiques des médias
  static async getMediaStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byFolder: Record<string, number>;
    byType: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('folder, mimeType, sizeBytes');

      if (error) throw error;

      const stats = {
        totalFiles: data.length,
        totalSize: data.reduce((sum, item) => sum + item.sizeBytes, 0),
        byFolder: {} as Record<string, number>,
        byType: {} as Record<string, number>
      };

      data.forEach(item => {
        // Par dossier
        stats.byFolder[item.folder] = (stats.byFolder[item.folder] || 0) + 1;
        
        // Par type MIME
        const type = item.mimeType.split('/')[0];
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Get media stats error:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        byFolder: {},
        byType: {}
      };
    }
  }

  // Nettoyer les médias orphelins (non utilisés)
  static async cleanupOrphanedMedia(): Promise<string[]> {
    try {
      // Cette fonction nécessiterait une analyse plus complexe
      // pour vérifier quels médias sont référencés dans les autres tables
      
      // Pour l'instant, retourner une liste vide
      // TODO: Implémenter la logique de nettoyage
      return [];
    } catch (error) {
      console.error('Cleanup error:', error);
      return [];
    }
  }

  // Générer des variantes d'image (thumbnails, etc.)
  static async generateImageVariants(
    mediaId: string,
    variants: { name: string; width: number; height?: number }[]
  ): Promise<Record<string, string>> {
    // Cette fonction nécessiterait un service de redimensionnement d'images
    // Peut être implémentée avec Supabase Edge Functions ou un service externe
    
    // Pour l'instant, retourner l'URL originale pour toutes les variantes
    try {
      const { data: media, error } = await supabase
        .from('media')
        .select('publicUrl')
        .eq('id', mediaId)
        .single();

      if (error) throw error;

      const result: Record<string, string> = {};
      variants.forEach(variant => {
        result[variant.name] = media.publicUrl;
      });

      return result;
    } catch (error) {
      console.error('Generate variants error:', error);
      return {};
    }
  }
}