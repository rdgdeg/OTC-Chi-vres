import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { Save, X, MapPin, Clock, Footprints, Mountain, Download, FileText, Star, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface WalkEditorProps {
  walk?: Place | null;
  onSave: (walkData: Partial<Place>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const WalkEditor: React.FC<WalkEditorProps> = ({ walk, onSave, onCancel, isNew = false }) => {
  const [formData, setFormData] = useState<Partial<Place>>({
    id: '',
    name: '',
    description: '',
    address: '',
    imageUrl: '',
    type: 'walk',
    distance: '',
    duration: '',
    difficulty: 'Facile',
    downloadUrl: '',
    documentUrl: '',
    tags: [],
    lat: undefined,
    lng: undefined,
    phone: '',
    website: '',
    rating: undefined,
    galleryImages: []
  });

  useEffect(() => {
    if (walk) {
      setFormData(walk);
    }
  }, [walk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name || !formData.description || !formData.address) {
      alert('Veuillez remplir tous les champs obligatoires (nom, description, adresse)');
      return;
    }

    // Générer un ID si nouveau
    if (isNew && !formData.id) {
      const id = formData.name?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 20) || 'new_walk';
      setFormData(prev => ({ ...prev, id }));
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof Place, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleInputChange('tags', tags);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'imageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop volumineuse (> 2Mo). Veuillez la compresser.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleInputChange(fieldName, base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">
              {isNew ? 'Nouvelle balade' : `Modifier "${formData.name}"`}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                <MapPin size={20} />
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nom de la balade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Circuit des Moulins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Point de départ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Parking de l'église, Rue de..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Décrivez la balade, ses points d'intérêt, ce qu'on peut y voir..."
                />
              </div>
            </div>

            {/* Caractéristiques de la balade */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                <Footprints size={20} />
                Caractéristiques de la balade
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Distance *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distance || ''}
                    onChange={(e) => handleInputChange('distance', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ex: 5 km"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Durée estimée *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ex: 1h30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Niveau de difficulté *
                  </label>
                  <select
                    required
                    value={formData.difficulty || 'Facile'}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Téléchargements */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-orange-900 flex items-center gap-2">
                <Download size={20} />
                Liens de téléchargement
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Lien du tracé (OpenRunner, GPX...)
                  </label>
                  <input
                    type="url"
                    value={formData.downloadUrl || ''}
                    onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="https://www.openrunner.com/route-details/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Document explicatif (PDF...)
                  </label>
                  <input
                    type="url"
                    value={formData.documentUrl || ''}
                    onChange={(e) => handleInputChange('documentUrl', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Image principale */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-purple-900 flex items-center gap-2">
                <ImageIcon size={20} />
                Image principale
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition-colors">
                    <Upload className="text-purple-500 mb-2" size={32} />
                    <span className="text-sm font-bold text-purple-700">Cliquez pour uploader une image</span>
                    <span className="text-xs text-purple-500 mt-1">PNG, JPG (max 2Mo)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'imageUrl')}
                    />
                  </label>
                </div>

                <div className="text-center text-sm text-slate-500">ou</div>

                <div>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="URL de l'image (https://...)"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="relative h-48 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={formData.imageUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Galerie d'images */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-slate-800">Galerie d'images</h3>
              <ImageUploader
                currentImages={formData.galleryImages || []}
                onImagesChange={(images) => handleInputChange('galleryImages', images)}
                maxImages={8}
                folder="walks"
                label="Images de la balade"
              />
            </div>

            {/* Informations complémentaires */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-slate-800">Informations complémentaires</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Téléphone de contact
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="+32 68 65 XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Évaluation (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating || ''}
                    onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="Famille, Nature, Facile, Patrimoine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Latitude (optionnel)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat || ''}
                    onChange={(e) => handleInputChange('lat', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="50.5891"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Longitude (optionnel)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng || ''}
                    onChange={(e) => handleInputChange('lng', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    placeholder="3.8075"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors"
            >
              <Save size={18} />
              {isNew ? 'Créer la balade' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkEditor;