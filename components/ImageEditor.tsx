import React, { useState, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Crop, RotateCw, 
  Palette, Sliders, Download, X, Check,
  ZoomIn, ZoomOut, Move, Square
} from 'lucide-react';

interface ImageEditorProps {
  initialImage?: string;
  onSave: (imageData: { src: string; alt: string; caption?: string }) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onSave, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string>(initialImage || '');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'edit' | 'library'>('upload');
  const [editMode, setEditMode] = useState<'crop' | 'rotate' | 'filter' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Images de la bibliothèque (simulation)
  const libraryImages = [
    'https://picsum.photos/id/1015/400/300',
    'https://picsum.photos/id/1016/400/300',
    'https://picsum.photos/id/1018/400/300',
    'https://picsum.photos/id/1019/400/300',
    'https://picsum.photos/id/1020/400/300',
    'https://picsum.photos/id/1021/400/300',
    'https://picsum.photos/id/1022/400/300',
    'https://picsum.photos/id/1023/400/300',
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setActiveTab('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onSave({
        src: selectedImage,
        alt: altText,
        caption: caption || undefined
      });
    }
  };

  const tabs = [
    { id: 'upload', label: 'Télécharger', icon: Upload },
    { id: 'library', label: 'Bibliothèque', icon: ImageIcon },
    { id: 'edit', label: 'Éditer', icon: Sliders, disabled: !selectedImage }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Éditeur d'Images</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                disabled={tab.disabled}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden flex">
          {/* Zone principale */}
          <div className="flex-1 p-6">
            {activeTab === 'upload' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Télécharger une image
                      </p>
                      <p className="text-sm text-gray-500">
                        Cliquez ou glissez-déposez votre image ici
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG, WebP jusqu'à 10MB
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {libraryImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedImage(image);
                        setActiveTab('edit');
                      }}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'edit' && selectedImage && (
              <div className="h-full flex flex-col">
                {/* Barre d'outils d'édition */}
                <div className="flex items-center space-x-2 mb-4 p-4 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => setEditMode(editMode === 'crop' ? null : 'crop')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      editMode === 'crop'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Crop size={16} className="mr-2" />
                    Recadrer
                  </button>
                  <button
                    onClick={() => setEditMode(editMode === 'rotate' ? null : 'rotate')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      editMode === 'rotate'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <RotateCw size={16} className="mr-2" />
                    Rotation
                  </button>
                  <button
                    onClick={() => setEditMode(editMode === 'filter' ? null : 'filter')}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      editMode === 'filter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Palette size={16} className="mr-2" />
                    Filtres
                  </button>
                </div>

                {/* Zone d'édition */}
                <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Image à éditer"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Panneau latéral */}
          {selectedImage && (
            <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétés de l'image</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte alternatif (Alt)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Description de l'image"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Important pour l'accessibilité et le SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Légende (optionnel)
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Légende de l'image"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Aperçu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aperçu
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={selectedImage}
                      alt={altText}
                      className="w-full h-32 object-cover"
                    />
                    {caption && (
                      <div className="p-2 bg-gray-100 text-xs text-gray-600">
                        {caption}
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations techniques */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informations</h4>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Format: JPG</div>
                    <div>Taille: 1920 × 1080 px</div>
                    <div>Poids: 245 KB</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedImage ? 'Image sélectionnée' : 'Aucune image sélectionnée'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedImage}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Check size={16} className="mr-2" />
              Utiliser cette image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;