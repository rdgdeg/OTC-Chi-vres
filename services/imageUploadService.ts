import { supabase } from './supabaseClient';

/**
 * Vérifier si l'utilisateur a les permissions pour uploader des images
 */
const checkUploadPermissions = (): boolean => {
  // Vérifier si l'utilisateur est authentifié avec les bonnes permissions
  // Pour l'instant, on vérifie juste s'il y a une session admin
  const adminAuth = sessionStorage.getItem('admin_authenticated');
  
  if (adminAuth === 'true') {
    return true;
  }
  
  // TODO: Ajouter la vérification Supabase quand elle sera implémentée
  // const { data: { session } } = await supabase.auth.getSession();
  // return session?.user && hasPermission(session.user, 'media', 'create');
  
  return false;
};

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - Optional folder path (e.g., 'museums', 'restaurants')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
  try {
    // Vérifier les permissions avant l'upload
    if (!checkUploadPermissions()) {
      throw new Error('Permissions insuffisantes pour uploader des images. Veuillez vous connecter en tant qu\'administrateur.');
    }
    
    console.log('Starting image upload:', { fileName: file.name, size: file.size, folder });
    
    // Generate unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('Generated filename:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from upload');
    }

    console.log('Upload successful, getting public URL for:', data.path);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    console.log('Public URL generated:', publicUrl);

    return publicUrl;
  } catch (error: any) {
    console.error('Upload exception:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param files - Array of image files
 * @param folder - Optional folder path
 * @returns Array of public URLs
 */
export const uploadMultipleImages = async (files: File[], folder: string = 'general'): Promise<string[]> => {
  // Vérifier les permissions avant l'upload
  if (!checkUploadPermissions()) {
    throw new Error('Permissions insuffisantes pour uploader des images. Veuillez vous connecter en tant qu\'administrateur.');
  }
  
  const uploadPromises = files.map(file => uploadImage(file, folder));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Vérifier les permissions avant la suppression
    if (!checkUploadPermissions()) {
      throw new Error('Permissions insuffisantes pour supprimer des images. Veuillez vous connecter en tant qu\'administrateur.');
    }
    
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/images/');
    if (pathParts.length < 2) return false;
    
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
};

/**
 * Replace an image (delete old, upload new)
 * @param oldImageUrl - URL of the image to replace
 * @param newFile - New image file
 * @param folder - Optional folder path
 * @returns The public URL of the new image
 */
export const replaceImage = async (oldImageUrl: string, newFile: File, folder: string = 'general'): Promise<string | null> => {
  // Vérifier les permissions avant le remplacement
  if (!checkUploadPermissions()) {
    throw new Error('Permissions insuffisantes pour remplacer des images. Veuillez vous connecter en tant qu\'administrateur.');
  }
  
  // Upload new image first
  const newUrl = await uploadImage(newFile, folder);
  
  if (newUrl && oldImageUrl) {
    // Delete old image (don't wait for it)
    deleteImage(oldImageUrl).catch(console.error);
  }
  
  return newUrl;
};
