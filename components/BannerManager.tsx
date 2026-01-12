import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, AlertCircle, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { homepageService, HomepageContent } from '../services/homepageService';

interface BannerSettings {
  type: 'info' | 'warning' | 'error' | 'success' | 'announcement';
  dismissible: boolean;
  showIcon: boolean;
}

const BannerManager: React.FC = () => {
  const [banner, setBanner] = useState<HomepageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // États du formulaire
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<BannerSettings>({
    type: 'info',
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
      console.error('Erreur lors du chargement de la bannière:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement de la bannière' });
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
        setMessage({ type: 'success', text: 'Bannière mise à jour avec succès' });
        await loadBanner(); // Recharger pour avoir les données à jour
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'announcement':
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getBannerStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'announcement':
      default:
        return 'bg-primary border-primary-600 text-white';
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion de la bannière d'information</h2>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{previewMode ? 'Masquer l\'aperçu' : 'Aperçu'}</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <span>{message.text}</span>
            <button onClick={clearMessage} className="ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Aperçu de la bannière */}
      {previewMode && (title || subtitle) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Aperçu de la bannière</h3>
          <div className={`border-b ${getBannerStyles(settings.type)} transition-all duration-300`}>
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3 flex-1">
                  {settings.showIcon && (
                    <div className="flex-shrink-0">
                      {getIcon(settings.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      {title && (
                        <p className="font-medium text-sm sm:text-base">
                          {title}
                        </p>
                      )}
                      {subtitle && (
                        <p className="text-sm opacity-90">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {settings.dismissible && (
                  <button className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/10 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* Activation de la bannière */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Afficher la bannière sur le site
            </label>
          </div>

          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre principal
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fermeture du bureau le 11 novembre (férié)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Sous-titre ou détails
            </label>
            <input
              type="text"
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Réouverture le 12 novembre à 9h"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Type de bannière */}
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

          {/* Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Options d'affichage</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="dismissible"
                checked={settings.dismissible}
                onChange={(e) => setSettings({ ...settings, dismissible: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="dismissible" className="text-sm text-gray-700">
                Permettre aux utilisateurs de fermer la bannière
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showIcon"
                checked={settings.showIcon}
                onChange={(e) => setSettings({ ...settings, showIcon: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="showIcon" className="text-sm text-gray-700">
                Afficher l'icône
              </label>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informations sur l'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Comment utiliser la bannière</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• La bannière s'affiche en haut de toutes les pages du site</li>
          <li>• Utilisez le titre pour le message principal et le sous-titre pour les détails</li>
          <li>• Choisissez le type approprié selon l'importance du message</li>
          <li>• Si "dismissible" est activé, les utilisateurs peuvent fermer la bannière (elle ne réapparaîtra pas pendant leur session)</li>
          <li>• Désactivez la bannière quand elle n'est plus nécessaire</li>
        </ul>
      </div>
    </div>
  );
};

export default BannerManager;