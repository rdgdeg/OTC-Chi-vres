import React, { useState, useEffect } from 'react';
import { 
  Save, Eye, Image, Type, Layout, Bell, 
  Newspaper, Heart, AlertCircle, CheckCircle, X 
} from 'lucide-react';
import { homepageService, HomepageContent } from '../../services/homepageService';
import EditableImage from '../EditableImage';

type SectionType = 'banner' | 'hero' | 'pages';

interface Message {
  type: 'success' | 'error';
  text: string;
}

const PageStructureManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('hero');
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = (type: Message['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion de la Structure des Pages
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Modifiez les bannières, images et textes de vos pages
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveSection('banner')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeSection === 'banner'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Bannière d'Information</span>
              </button>
              <button
                onClick={() => setActiveSection('hero')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeSection === 'hero'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Image className="h-4 w-4" />
                <span>Bannière Principale (Hero)</span>
              </button>
              <button
                onClick={() => setActiveSection('pages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeSection === 'pages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layout className="h-4 w-4" />
                <span>Pages du Site</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeSection === 'banner' && (
              <InfoBannerEditor onSuccess={() => showMessage('success', 'Bannière mise à jour')} />
            )}
            {activeSection === 'hero' && (
              <HeroEditor onSuccess={() => showMessage('success', 'Hero mis à jour')} />
            )}
            {activeSection === 'pages' && (
              <PagesEditor onSuccess={() => showMessage('success', 'Page mise à jour')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== ÉDITEUR DE BANNIÈRE D'INFORMATION =====
interface InfoBannerEditorProps {
  onSuccess: () => void;
}

const InfoBannerEditor: React.FC<InfoBannerEditorProps> = ({ onSuccess }) => {
  const [banner, setBanner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    type: 'info' as 'info' | 'warning' | 'error' | 'success' | 'announcement',
    dismissible: true,
    showIcon: true
  });

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      setIsLoading(true);
      const bannerData = await homepageService.getBanner();
      
      if (bannerData) {
        setBanner(bannerData);
        setTitle(bannerData.title || '');
        setSubtitle(bannerData.subtitle || '');
        setIsActive(bannerData.is_active);
        setSettings({
          type: bannerData.settings?.type || 'info',
          dismissible: bannerData.settings?.dismissible ?? true,
          showIcon: bannerData.settings?.showIcon ?? true
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const success = await homepageService.updateBanner({
        title: title.trim(),
        subtitle: subtitle.trim(),
        is_active: isActive,
        settings: settings
      });

      if (success) {
        onSuccess();
        await loadBanner();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Bannière d'Information (en haut du site)
        </h3>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Eye className="h-4 w-4" />
          <span>{previewMode ? 'Masquer' : 'Aperçu'}</span>
        </button>
      </div>

      {previewMode && (title || subtitle) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Aperçu</h4>
          <div className={`border-b p-3 ${
            settings.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            settings.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            settings.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            settings.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            'bg-primary border-primary-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {settings.showIcon && <AlertCircle className="h-5 w-5" />}
                <div>
                  {title && <p className="font-medium text-sm">{title}</p>}
                  {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
                </div>
              </div>
              {settings.dismissible && <X className="h-4 w-4" />}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Afficher la bannière sur le site
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Fermeture exceptionnelle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Réouverture le 12 novembre"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de bannière
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { value: 'info', label: 'Information', color: 'bg-blue-100 text-blue-800' },
              { value: 'warning', label: 'Attention', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'error', label: 'Erreur', color: 'bg-red-100 text-red-800' },
              { value: 'success', label: 'Succès', color: 'bg-green-100 text-green-800' },
              { value: 'announcement', label: 'Annonce', color: 'bg-primary text-white' }
            ].map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="bannerType"
                  value={type.value}
                  checked={settings.type === type.value}
                  onChange={(e) => setSettings({ ...settings, type: e.target.value as any })}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                  settings.type === type.value 
                    ? `${type.color} border-current` 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                }`}>
                  {type.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="dismissible"
              checked={settings.dismissible}
              onChange={(e) => setSettings({ ...settings, dismissible: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dismissible" className="text-sm text-gray-700">
              Permettre de fermer la bannière
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="showIcon"
              checked={settings.showIcon}
              onChange={(e) => setSettings({ ...settings, showIcon: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showIcon" className="text-sm text-gray-700">
              Afficher l'icône
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== ÉDITEUR DE HERO (Grande Bannière) =====
interface HeroEditorProps {
  onSuccess: () => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ onSuccess }) => {
  const [hero, setHero] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setIsLoading(true);
      const heroData = await homepageService.getHero();
      
      if (heroData) {
        setHero(heroData);
        setTitle(heroData.title || '');
        setSubtitle(heroData.subtitle || '');
        setContent(heroData.content || '');
        setImageUrl(heroData.image_url || '');
        setCtaText(heroData.cta_text || '');
        setCtaUrl(heroData.cta_url || '');
        setVideoUrl(heroData.settings?.videoUrl || '');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const success = await homepageService.updateHero({
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        image_url: imageUrl,
        cta_text: ctaText.trim(),
        cta_url: ctaUrl.trim(),
        settings: { videoUrl: videoUrl.trim() }
      });

      if (success) {
        onSuccess();
        await loadHero();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpdate = async (newUrl: string) => {
    setImageUrl(newUrl);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Bannière Principale (Hero)
        </h3>
        <p className="text-sm text-gray-600">
          Grande bannière affichée en haut de la page d'accueil avec image/vidéo de fond
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="h-4 w-4 inline mr-1" />
            Image de fond
          </label>
          <EditableImage
            src={imageUrl || 'https://picsum.photos/1920/1080?grayscale'}
            alt="Hero background"
            onImageUpdate={handleImageUpdate}
            folder="hero"
            className="w-full h-64 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommandé : 1920x1080px minimum
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Bienvenue à Chièvres,"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: la Cité des Aviateurs !"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte de description
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Texte d'introduction..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du bouton
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Ex: Découvrir Chièvres"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien du bouton
            </label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="Ex: /musees"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de la vidéo (optionnel)
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Ex: /videos/chievres-intro.mp4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si renseigné, la vidéo sera affichée à la place de l'image
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== ÉDITEUR DE PAGES =====
interface PagesEditorProps {
  onSuccess: () => void;
}

const PagesEditor: React.FC<PagesEditorProps> = ({ onSuccess }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pages du Site
        </h3>
        <p className="text-sm text-gray-600">
          Pour modifier le contenu des pages, utilisez le gestionnaire "Contenu des pages" dans le menu principal
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 Les pages individuelles (Hébergements, Restaurants, Musées, etc.) sont gérées via le menu "Contenu" dans le tableau de bord admin.
        </p>
      </div>
    </div>
  );
};

export default PageStructureManager;
