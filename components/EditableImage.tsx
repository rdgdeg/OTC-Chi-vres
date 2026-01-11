import React, { useState } from 'react';
import { Edit, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/imageUploadService';

interface EditableImageProps {
  src: string;
  alt: string;
  onImageUpdate: (newUrl: string) => Promise<void>;
  folder?: string;
  className?: string;
  editable?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onImageUpdate,
  folder = 'general',
  className = '',
  editable = true,
  aspectRatio = 'auto'
}) => {
  const [uploading, setUploading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Update currentSrc when src prop changes (after DB refresh)
  React.useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: ''
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop volumineuse. Taille maximale : 5 Mo');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    setUploading(true);
    try {
      console.log('Uploading image:', { fileName: file.name, size: file.size, folder });
      
      const imageUrl = await uploadImage(file, folder);
      
      if (!imageUrl) {
        throw new Error('Échec de l\'upload de l\'image vers Supabase Storage');
      }

      console.log('Image uploaded successfully:', imageUrl);
      
      // Update via callback
      await onImageUpdate(imageUrl);
      
      // Update local state
      setCurrentSrc(imageUrl);
      
      console.log('Image updated successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.message || 'Erreur inconnue';
      alert(`❌ Erreur : ${errorMessage}\n\nVérifiez que le bucket "images" existe et est public dans Supabase Storage.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative group overflow-hidden bg-slate-100 ${aspectClasses[aspectRatio]} ${className}`}>
      <img 
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover"
        key={currentSrc}
        onError={(e) => {
          // Fallback image on error
          (e.target as HTMLImageElement).src = 'https://picsum.photos/800/600?text=Image+Non+Disponible';
        }}
      />
      
      {editable && (
        <label 
          htmlFor={`upload-${alt.replace(/\s/g, '-')}`}
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uploading ? (
            <div className="text-white text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <span className="text-sm font-semibold">Upload en cours...</span>
            </div>
          ) : (
            <div className="text-white text-center">
              <Edit className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-semibold">Modifier l'image</span>
              <p className="text-xs mt-1 opacity-80">Cliquez pour uploader</p>
            </div>
          )}
          <input
            id={`upload-${alt.replace(/\s/g, '-')}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};

export default EditableImage;
