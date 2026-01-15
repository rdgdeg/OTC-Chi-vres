import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { homepageService } from '../../services/homepageService';
import { supabase } from '../../services/supabaseClient';

const HomeBannerManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Bienvenue à Chièvres',
    subtitle: 'La cité des aviateurs vous accueille',
    content: 'Découvrez une commune riche en histoire, en traditions et en nature. Entre patrimoine exceptionnel et modernité, Chièvres vous invite à explorer ses trésors cachés.',
    image_url: ''
  });

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    setLoading(true);
    try {
      const data = await homepageService.getHero();
      if (data) {
        setFormData({
          title: data.title || formData.title,
          subtitle: data.subtitle || formData.subtitle,
          content: data.content || formData.content,
          image_url: data.image_url || formData.image_url
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une image' });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `home-banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setMessage({ type: 'success', text: 'Image téléchargée avec succès' });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du téléchargement de l\'image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const success = await homepageService.updateHero({
        title: formData.title,
        subtitle: formData.subtitle,
        content: formData.content,
        image_url: formData.image_url
      });

      if (success) {
        setMessage({ type: 'success', text: 'Bannière mise à jour avec succès' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bannière d'accueil
        </h2>
        <p className="text-gray-600">
          Gérez le contenu et l'image de la bannière principale de la page d'accueil
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image de fond */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de fond
          </label>
          
          {formData.image_url && (
            <div className="mb-4 relative h-48 rounded-lg overflow-hidden">
              <img
                src={formData.image_url}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {uploading ? 'Téléchargement...' : 'Choisir une image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            
            {formData.image_url && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Supprimer l'image
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Format recommandé : 1920x1080px, max 5MB
          </p>
        </div>

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Bienvenue à Chièvres"
            required
          />
        </div>

        {/* Sous-titre */}
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <input
            type="text"
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="La cité des aviateurs vous accueille"
            required
          />
        </div>

        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Texte descriptif
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Découvrez une commune riche en histoire..."
            required
          />
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={loadBannerData}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Aperçu */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
        <div className="relative h-64 rounded-lg overflow-hidden">
          {formData.image_url ? (
            <img
              src={formData.image_url}
              alt="Aperçu bannière"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl font-bold mb-2">{formData.title}</h1>
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">{formData.subtitle}</h2>
              <p className="text-sm max-w-2xl">{formData.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBannerManager;
