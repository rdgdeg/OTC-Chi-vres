import React, { useState, useEffect } from 'react';
import { 
  Save, Edit3, Plus, Trash2, Eye, EyeOff, 
  Image, Type, Link, Settings, AlertCircle,
  ChevronUp, ChevronDown, GripVertical
} from 'lucide-react';
import { homepageService, HomepageContent, HomepageNews, HomepageFavorite } from '../services/homepageService';
import EditableImage from './EditableImage';

const HomepageContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'banner' | 'hero' | 'news' | 'favorites'>('banner');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // États pour chaque section
  const [banner, setBanner] = useState<HomepageContent | null>(null);
  const [hero, setHero] = useState<HomepageContent | null>(null);
  const [news, setNews] = useState<HomepageNews[]>([]);
  const [favorites, setFavorites] = useState<HomepageFavorite[]>([]);

  // États d'édition
  const [editingBanner, setEditingBanner] = useState(false);
  const [editingHero, setEditingHero] = useState(false);
  const [editingNews, setEditingNews] = useState<string | null>(null);
  const [editingFavorite, setEditingFavorite] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bannerData, heroData, newsData, favoritesData] = await Promise.all([
        homepageService.getBanner(),
        homepageService.getHero(),
        homepageService.getAllNews(),
        homepageService.getAllFavorites()
      ]);

      setBanner(bannerData);
      setHero(heroData);
      setNews(newsData);
      setFavorites(favoritesData);
    } catch (error) {
      showMessage('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const tabs = [
    { id: 'banner', label: 'Bannière d\'info', icon: AlertCircle },
    { id: 'hero', label: 'Section Hero', icon: Image },
    { id: 'news', label: 'Actualités', icon: Type },
    { id: 'favorites', label: 'Coups de cœur', icon: Link }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Page d'Accueil</h1>
          <p className="text-gray-600 mt-1">
            Modifiez le contenu, les images et les textes de la page d'accueil
          </p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'banner' && (
            <BannerEditor
              banner={banner}
              isEditing={editingBanner}
              onEdit={() => setEditingBanner(true)}
              onSave={async (data) => {
                const success = await homepageService.updateBanner(data);
                if (success) {
                  showMessage('success', 'Bannière mise à jour avec succès');
                  loadData();
                  setEditingBanner(false);
                } else {
                  showMessage('error', 'Erreur lors de la mise à jour');
                }
              }}
              onCancel={() => setEditingBanner(false)}
            />
          )}

          {activeTab === 'hero' && (
            <HeroEditor
              hero={hero}
              isEditing={editingHero}
              onEdit={() => setEditingHero(true)}
              onSave={async (data) => {
                const success = await homepageService.updateHero(data);
                if (success) {
                  showMessage('success', 'Section Hero mise à jour avec succès');
                  loadData();
                  setEditingHero(false);
                } else {
                  showMessage('error', 'Erreur lors de la mise à jour');
                }
              }}
              onCancel={() => setEditingHero(false)}
            />
          )}

          {activeTab === 'news' && (
            <NewsManager
              news={news}
              onUpdate={loadData}
              onMessage={showMessage}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesManager
              favorites={favorites}
              onUpdate={loadData}
              onMessage={showMessage}
            />
          )}
        </>
      )}
    </div>
  );
};

// Composant pour éditer la bannière
interface BannerEditorProps {
  banner: HomepageContent | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const BannerEditor: React.FC<BannerEditorProps> = ({ banner, isEditing, onEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    is_active: banner?.is_active ?? true,
    settings: banner?.settings || { type: 'announcement', dismissible: true }
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        is_active: banner.is_active,
        settings: banner.settings || { type: 'announcement', dismissible: true }
      });
    }
  }, [banner]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bannière d'information</h2>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message principal
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Fermeture du bureau le 11 novembre"
            />
          ) : (
            <div className="text-lg font-medium">{banner?.title}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détails
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Réouverture le 12 novembre à 9h"
            />
          ) : (
            <div className="text-gray-600">{banner?.subtitle}</div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              disabled={!isEditing}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Bannière active</span>
          </label>

          {isEditing && (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.dismissible}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  settings: { ...prev.settings, dismissible: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Peut être fermée par l'utilisateur</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour éditer le hero
interface HeroEditorProps {
  hero: HomepageContent | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ hero, isEditing, onEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: hero?.title || '',
    subtitle: hero?.subtitle || '',
    content: hero?.content || '',
    image_url: hero?.image_url || hero?.settings?.backgroundImage || '',
    cta_text: hero?.cta_text || 'Découvrir Chièvres',
    cta_url: hero?.cta_url || '/musees'
  });

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        content: hero.content || '',
        image_url: hero.image_url || hero.settings?.backgroundImage || '',
        cta_text: hero.cta_text || 'Découvrir Chièvres',
        cta_url: hero.cta_url || '/musees'
      });
    }
  }, [hero]);

  const handleSave = () => {
    onSave({
      ...formData,
      settings: {
        ...hero?.settings,
        backgroundImage: formData.image_url
      }
    });
  };

  const handleImageUpdate = (newUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: newUrl }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Section Hero (Bannière principale)</h2>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Image de fond */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de fond
          </label>
          {isEditing ? (
            <EditableImage
              src={formData.image_url || 'https://picsum.photos/1920/1080?grayscale'}
              alt="Image de fond Hero"
              onImageUpdate={handleImageUpdate}
              folder="hero"
              className="w-full h-64 rounded-lg"
            />
          ) : (
            <img
              src={formData.image_url || 'https://picsum.photos/1920/1080?grayscale'}
              alt="Image de fond Hero"
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Titre principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-2xl font-bold">{hero?.title}</div>
          )}
        </div>

        {/* Sous-titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-xl text-gray-600">{hero?.subtitle}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="text-gray-700">{hero?.content}</div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du bouton
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-700">{formData.cta_text}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien du bouton
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.cta_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="text-gray-700">{formData.cta_url}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour gérer les actualités
interface NewsManagerProps {
  news: HomepageNews[];
  onUpdate: () => void;
  onMessage: (type: 'success' | 'error', text: string) => void;
}

const NewsManager: React.FC<NewsManagerProps> = ({ news, onUpdate, onMessage }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      const success = await homepageService.deleteNews(id);
      if (success) {
        onMessage('success', 'Actualité supprimée avec succès');
        onUpdate();
      } else {
        onMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const success = await homepageService.updateNews(id, { is_published: !currentStatus });
    if (success) {
      onMessage('success', `Actualité ${!currentStatus ? 'publiée' : 'dépubliée'} avec succès`);
      onUpdate();
    } else {
      onMessage('error', 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Actualités de la page d'accueil</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une actualité
        </button>
      </div>

      {showForm && (
        <NewsForm
          onSave={async (data) => {
            const result = await homepageService.createNews(data);
            if (result) {
              onMessage('success', 'Actualité créée avec succès');
              onUpdate();
              setShowForm(false);
            } else {
              onMessage('error', 'Erreur lors de la création');
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  {item.is_featured && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      À la une
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{item.category}</span>
                  <span>{item.read_time}</span>
                  <span>{new Date(item.published_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => togglePublished(item.id, item.is_published)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={item.is_published ? 'Dépublier' : 'Publier'}
                >
                  {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setEditingId(item.id)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="Modifier"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour gérer les coups de cœur
interface FavoritesManagerProps {
  favorites: HomepageFavorite[];
  onUpdate: () => void;
  onMessage: (type: 'success' | 'error', text: string) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({ favorites, onUpdate, onMessage }) => {
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce coup de cœur ?')) {
      const success = await homepageService.deleteFavorite(id);
      if (success) {
        onMessage('success', 'Coup de cœur supprimé avec succès');
        onUpdate();
      } else {
        onMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const success = await homepageService.updateFavorite(id, { is_active: !currentStatus });
    if (success) {
      onMessage('success', `Coup de cœur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      onUpdate();
    } else {
      onMessage('error', 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Coups de cœur</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un coup de cœur
        </button>
      </div>

      {showForm && (
        <FavoriteForm
          onSave={async (data) => {
            const result = await homepageService.createFavorite(data);
            if (result) {
              onMessage('success', 'Coup de cœur créé avec succès');
              onUpdate();
              setShowForm(false);
            } else {
              onMessage('error', 'Erreur lors de la création');
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Ordre: {item.sort_order}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(item.id, item.is_active)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title={item.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Formulaire pour créer/éditer une actualité
interface NewsFormProps {
  news?: HomepageNews;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ news, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    excerpt: news?.excerpt || '',
    content: news?.content || '',
    image_url: news?.image_url || '',
    category: news?.category || 'Actualité',
    read_time: news?.read_time || '2 min',
    is_featured: news?.is_featured || false,
    is_published: news?.is_published ?? true,
    sort_order: news?.sort_order || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {news ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extrait *
          </label>
          <textarea
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l'image
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Actualité">Actualité</option>
              <option value="Culture">Culture</option>
              <option value="Événement">Événement</option>
              <option value="Nature">Nature</option>
              <option value="Patrimoine">Patrimoine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temps de lecture
            </label>
            <input
              type="text"
              value={formData.read_time}
              onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 3 min"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">À la une</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Publié</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {news ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Formulaire pour créer/éditer un coup de cœur
interface FavoriteFormProps {
  favorite?: HomepageFavorite;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const FavoriteForm: React.FC<FavoriteFormProps> = ({ favorite, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: favorite?.title || '',
    description: favorite?.description || '',
    image_url: favorite?.image_url || '',
    link_url: favorite?.link_url || '',
    is_active: favorite?.is_active ?? true,
    sort_order: favorite?.sort_order || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {favorite ? 'Modifier le coup de cœur' : 'Nouveau coup de cœur'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l'image *
          </label>
          <input
            type="url"
            required
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lien (optionnel)
          </label>
          <input
            type="text"
            value={formData.link_url}
            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: /musees"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Actif</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {favorite ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageContentManager;