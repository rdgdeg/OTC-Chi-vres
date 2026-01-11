import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, AlertCircle, Calendar, Image as ImageIcon } from 'lucide-react';

interface InfoBannerData {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'announcement';
  enabled: boolean;
  dismissible: boolean;
}

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

const AdminHomePage: React.FC = () => {
  // État pour le bandeau d'information
  const [infoBanner, setInfoBanner] = useState<InfoBannerData>({
    id: '1',
    message: 'Fermeture du bureau le 11 novembre (férié) - Réouverture le 12 novembre à 9h',
    type: 'announcement',
    enabled: true,
    dismissible: true
  });

  // État pour les actualités
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Ouverture de la nouvelle exposition au Musée de la Vie Rurale",
      excerpt: "Découvrez \"Artisans d'autrefois\", une exposition temporaire qui met en lumière les métiers traditionnels de notre région.",
      image: "https://picsum.photos/id/1051/400/300",
      date: "15 janvier 2026",
      category: "Culture",
      readTime: "3 min"
    },
    {
      id: 2,
      title: "Festival du Crossage 2026 : Save the Date !",
      excerpt: "Le traditionnel Festival du Crossage al'tonne aura lieu le premier weekend de septembre. Préparez-vous à vivre une expérience unique !",
      image: "https://picsum.photos/id/1052/400/300",
      date: "12 janvier 2026",
      category: "Événement",
      readTime: "2 min"
    },
    {
      id: 3,
      title: "Nouveaux circuits de randonnée balisés",
      excerpt: "Trois nouveaux parcours de découverte ont été aménagés pour vous faire découvrir les trésors cachés de notre campagne.",
      image: "https://picsum.photos/id/1053/400/300",
      date: "8 janvier 2026",
      category: "Nature",
      readTime: "4 min"
    }
  ]);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);

  const handleSaveBanner = () => {
    // Ici, vous intégreriez avec votre API/base de données
    console.log('Sauvegarde du bandeau:', infoBanner);
    alert('Bandeau d\'information sauvegardé !');
  };

  const handleSaveNews = (newsItem: NewsItem) => {
    if (editingNews) {
      // Modification d'une actualité existante
      setNewsItems(prev => prev.map(item => 
        item.id === newsItem.id ? newsItem : item
      ));
    } else {
      // Ajout d'une nouvelle actualité
      const newItem = {
        ...newsItem,
        id: Math.max(...newsItems.map(n => n.id)) + 1
      };
      setNewsItems(prev => [newItem, ...prev]);
    }
    setEditingNews(null);
    setShowNewsForm(false);
    alert('Actualité sauvegardée !');
  };

  const handleDeleteNews = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      setNewsItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const NewsForm: React.FC<{ 
    item?: NewsItem; 
    onSave: (item: NewsItem) => void; 
    onCancel: () => void; 
  }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState<NewsItem>(
      item || {
        id: 0,
        title: '',
        excerpt: '',
        image: '',
        date: new Date().toLocaleDateString('fr-FR'),
        category: 'Actualité',
        readTime: '2 min'
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            {item ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description courte
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Actualité">Actualité</option>
                  <option value="Culture">Culture</option>
                  <option value="Événement">Événement</option>
                  <option value="Nature">Nature</option>
                  <option value="Patrimoine">Patrimoine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Temps de lecture
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ex: 3 min"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-200 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Gestion du Bandeau d'Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <AlertCircle size={24} className="text-primary mr-3" />
            Bandeau d'Information
          </h2>
          <button
            onClick={handleSaveBanner}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Save size={18} className="mr-2" />
            Sauvegarder
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={infoBanner.message}
              onChange={(e) => setInfoBanner(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Votre message d'information..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type
              </label>
              <select
                value={infoBanner.type}
                onChange={(e) => setInfoBanner(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="info">Information</option>
                <option value="warning">Avertissement</option>
                <option value="announcement">Annonce</option>
              </select>
            </div>

            <div className="flex items-center space-x-6 pt-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={infoBanner.enabled}
                  onChange={(e) => setInfoBanner(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-slate-700">Activé</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={infoBanner.dismissible}
                  onChange={(e) => setInfoBanner(prev => ({ ...prev, dismissible: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-slate-700">Peut être fermé</span>
              </label>
            </div>
          </div>

          {/* Aperçu du bandeau */}
          {infoBanner.enabled && (
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Aperçu :</h4>
              <div className={`p-4 rounded-lg text-white text-center ${
                infoBanner.type === 'info' ? 'bg-blue-600' :
                infoBanner.type === 'warning' ? 'bg-orange-600' : 'bg-primary'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">{infoBanner.message}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gestion des Actualités */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Calendar size={24} className="text-primary mr-3" />
            Actualités de la Page d'Accueil
          </h2>
          <button
            onClick={() => setShowNewsForm(true)}
            className="flex items-center px-6 py-3 bg-secondary text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
          >
            <Plus size={18} className="mr-2" />
            Nouvelle actualité
          </button>
        </div>

        <div className="space-y-4">
          {newsItems.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                    <span className="text-xs text-slate-500">{item.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{item.excerpt}</p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const nextElement = target.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <ImageIcon size={20} className="text-slate-400 hidden" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setShowNewsForm(true);
                    }}
                    className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {newsItems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucune actualité pour le moment</p>
          </div>
        )}
      </div>

      {/* Formulaire d'actualité */}
      {showNewsForm && (
        <NewsForm
          item={editingNews || undefined}
          onSave={handleSaveNews}
          onCancel={() => {
            setShowNewsForm(false);
            setEditingNews(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminHomePage;