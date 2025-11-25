import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImages = [],
  onImagesChange,
  maxImages = 5,
  folder = 'general',
  label = 'Images'
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max images limit
    if (previewImages.length + files.length > maxImages) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    setUploading(true);

    try {
      // Import the upload service dynamically
      const { uploadMultipleImages } = await import('../services/imageUploadService');
      const uploadedUrls = await uploadMultipleImages(files, folder);

      if (uploadedUrls.length > 0) {
        const newImages = [...previewImages, ...uploadedUrls];
        setPreviewImages(newImages);
        onImagesChange(newImages);
      } else {
        alert('Erreur lors de l\'upload des images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = previewImages[index];
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    onImagesChange(newImages);

    // Delete from storage
    try {
      const { deleteImage } = await import('../services/imageUploadService');
      await deleteImage(imageToRemove);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-700">
          {label} ({previewImages.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || previewImages.length >= maxImages}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Upload...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previewImages.map((img, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-100">
            <img
              src={img}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                Principal
              </div>
            )}
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, Math.min(3, maxImages - previewImages.length)) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={32} className="text-slate-300" />
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 italic">
        * La première image sera utilisée comme image principale. Glissez pour réorganiser.
      </p>
    </div>
  );
};

export default ImageUploader;
