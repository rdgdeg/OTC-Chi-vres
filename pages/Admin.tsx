
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit, Save, LogIn, RefreshCw, Image as ImageIcon, ExternalLink, FileText, Layers } from 'lucide-react';
import { PageContent } from '../types';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('museum');
  // Edit items (places, events)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  // Edit page content
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [tempPageContent, setTempPageContent] = useState<PageContent | null>(null);

  const { 
    museums, restaurants, accommodation, merchants, walks, experiences, events, products, pageContent,
    updateItem, addItem, deleteItem, updatePageContent, resetData 
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const collections: { [key: string]: { label: string, data: any[], type: string } } = {
    museum: { label: 'Musées & Patrimoine', data: museums, type: 'museum' },
    hotel: { label: 'Hébergements', data: accommodation, type: 'hotel' },
    restaurant: { label: 'Restaurants', data: restaurants, type: 'restaurant' },
    shop: { label: 'Commerçants', data: merchants, type: 'shop' },
    walk: { label: 'Balades', data: walks, type: 'walk' },
    experience: { label: 'Expériences', data: experiences, type: 'experience' },
    event: { label: 'Agenda / Événements', data: events, type: 'event' },
    product: { label: 'Boutique', data: products, type: 'product' },
  };

  const pagesList = [
      { id: 'home', label: 'Page d\'Accueil' },
      { id: 'museums', label: 'Page Patrimoine' },
      { id: 'walks', label: 'Page Balades' },
      { id: 'crossage', label: 'Page Crossage' },
      { id: 'bulletin', label: 'Page Bulletin' },
  ];

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (editingItem.isNew) {
        const { isNew, ...itemToSave } = editingItem;
        addItem(collections[activeTab].type, { ...itemToSave, id: Date.now().toString() });
      } else {
        updateItem(collections[activeTab].type, editingItem);
      }
      setEditingItem(null);
    }
  };

  const handleSavePageContent = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingPageId && tempPageContent) {
          updatePageContent(editingPageId, tempPageContent);
          alert('Contenu de la page mis à jour !');
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                <LogIn size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center text-slate-800 mb-6">Administration</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (admin)"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary hover:text-slate-900 transition-colors">
            Connexion
          </button>
          <p className="text-center text-sm text-slate-400 mt-4">Mot de passe par défaut: admin</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-serif font-bold">Tableau de Bord</h1>
                <p className="text-slate-400">Gérez le contenu du site VisitChièvres.be</p>
            </div>
            <button onClick={resetData} className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-xs uppercase font-bold tracking-wider">
                <RefreshCw size={16} className="mr-2" /> Réinitialiser les données
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-100 border-r border-slate-200 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
            {/* Header Data Section */}
            <div className="hidden md:block px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Données (Fiches)
            </div>
            {Object.entries(collections).map(([key, info]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setEditingItem(null); setEditingPageId(null); }}
                className={`px-6 py-3 text-left font-medium text-sm whitespace-nowrap md:whitespace-normal transition-colors flex items-center ${
                  activeTab === key && !editingPageId
                    ? 'bg-white text-primary border-l-4 border-primary shadow-sm' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
                }`}
              >
                <Layers size={16} className="mr-2 opacity-50" />
                {info.label}
              </button>
            ))}

            <div className="hidden md:block px-6 py-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200">
                Contenu (Pages)
            </div>
            <button
                onClick={() => { setActiveTab('pages'); setEditingPageId('home'); setTempPageContent(pageContent['home']); }}
                className={`px-6 py-3 text-left font-medium text-sm whitespace-nowrap md:whitespace-normal transition-colors flex items-center ${
                  activeTab === 'pages'
                    ? 'bg-white text-secondary border-l-4 border-secondary shadow-sm' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
                }`}
            >
                <FileText size={16} className="mr-2 opacity-50" />
                Gestion des Pages
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow p-6 md:p-8">
            
            {/* --- MODE PAGES --- */}
            {activeTab === 'pages' ? (
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Éditer le contenu des pages</h2>
                    
                    {/* Page Selector Tabs */}
                    <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                        {pagesList.map(page => (
                            <button
                                key={page.id}
                                onClick={() => { setEditingPageId(page.id); setTempPageContent(pageContent[page.id] || {}); }}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                                    editingPageId === page.id 
                                    ? 'bg-secondary text-slate-900' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                {page.label}
                            </button>
                        ))}
                    </div>

                    {editingPageId && tempPageContent && (
                        <form onSubmit={handleSavePageContent} className="space-y-6 max-w-3xl animate-in fade-in">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Hero Section */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center"><ImageIcon className="mr-2" size={20}/> Bannière (Haut de page)</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Titre Principal</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.heroTitle || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, heroTitle: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sous-titre</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.heroSubtitle || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, heroSubtitle: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image de fond (URL)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm"
                                                value={tempPageContent.heroImage || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, heroImage: e.target.value})}
                                            />
                                            {tempPageContent.heroImage && (
                                                <img src={tempPageContent.heroImage} className="mt-2 h-32 w-full object-cover rounded-lg opacity-80" alt="Preview"/>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Intro Section */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center"><FileText className="mr-2" size={20}/> Contenu Principal</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Titre Introductif</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.introTitle || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, introTitle: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Texte Introductif</label>
                                            <textarea 
                                                rows={6}
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.introText || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, introText: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Extra Section (Optional) */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4 text-slate-700">Contenu Supplémentaire (Optionnel)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Titre Extra</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.extraTitle || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, extraTitle: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image Extra (URL)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm"
                                                value={tempPageContent.extraImage || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, extraImage: e.target.value})}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Texte Extra</label>
                                            <textarea 
                                                rows={4}
                                                className="w-full p-3 border border-slate-300 rounded-lg"
                                                value={tempPageContent.extraText || ''}
                                                onChange={e => setTempPageContent({...tempPageContent, extraText: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    type="submit"
                                    className="flex items-center px-8 py-3 bg-secondary text-slate-900 rounded-lg hover:bg-yellow-500 font-bold shadow-md transition-colors"
                                >
                                    <Save size={18} className="mr-2" /> Enregistrer la page
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
            /* --- MODE ITEMS (Legacy) --- */
            <>
                <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">{collections[activeTab].label}</h2>
                <button 
                    onClick={() => setEditingItem({ isNew: true, type: collections[activeTab].type, tags: [] })}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold text-sm"
                >
                    <Plus size={18} className="mr-2" /> Ajouter
                </button>
                </div>

                {editingItem ? (
                <form onSubmit={handleSaveItem} className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-10 duration-300">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-lg mb-4 border-b border-blue-200 pb-2 text-blue-900">
                            {editingItem.isNew ? 'Ajouter un élément' : 'Modifier l\'élément'}
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {/* Common Fields */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom / Titre</label>
                                <input 
                                    type="text" 
                                    required
                                    value={editingItem.name || editingItem.title || ''} 
                                    onChange={e => setEditingItem({...editingItem, name: e.target.value, title: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nom de l'établissement ou titre"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                <textarea 
                                    rows={4}
                                    required
                                    value={editingItem.description || ''} 
                                    onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Description détaillée..."
                                />
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 flex items-center">
                                    <ImageIcon size={14} className="mr-1"/> Image URL (Photo)
                                    </label>
                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                                    <ExternalLink size={10} className="mr-1" /> Copiez le lien d'une image web
                                    </span>
                                </div>
                                <input 
                                    type="text" 
                                    value={editingItem.imageUrl || ''} 
                                    onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
                                    placeholder="https://..."
                                />
                                {editingItem.imageUrl && (
                                    <div className="relative h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
                                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Location Fields (Museums, Hotels, Restos, Shops) */}
                            {(['museum', 'hotel', 'restaurant', 'shop'].includes(collections[activeTab].type)) && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Adresse</label>
                                        <input 
                                            type="text" 
                                            value={editingItem.address || ''} 
                                            onChange={e => setEditingItem({...editingItem, address: e.target.value})}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Rue de..., 7950 Chièvres"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Téléphone</label>
                                            <input 
                                                type="text" 
                                                value={editingItem.phone || ''} 
                                                onChange={e => setEditingItem({...editingItem, phone: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="+32..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Site Web / Facebook</label>
                                            <input 
                                                type="text" 
                                                value={editingItem.website || ''} 
                                                onChange={e => setEditingItem({...editingItem, website: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Generic Tags Input */}
                            {(collections[activeTab].type !== 'event') && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tags / Catégorie (séparés par des virgules)</label>
                                    <input 
                                        type="text" 
                                        value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : (editingItem.category || '')} 
                                        onChange={e => {
                                            if(collections[activeTab].type === 'product' || collections[activeTab].type === 'article') {
                                                setEditingItem({...editingItem, category: e.target.value});
                                            } else {
                                                setEditingItem({...editingItem, tags: e.target.value.split(',').map((t: string) => t.trim())});
                                            }
                                        }}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Ex: Famille, Extérieur, Gratuit..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-blue-200">
                            <button 
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit"
                                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors"
                            >
                                <Save size={18} className="mr-2" /> Enregistrer
                            </button>
                        </div>
                    </div>
                </form>
                ) : (
                <div className="grid gap-4">
                    {collections[activeTab].data.map((item: any) => (
                    <div key={item.id} className="flex items-center bg-white border border-slate-100 p-4 rounded-lg hover:shadow-md transition-shadow group">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 bg-slate-100 border border-slate-200" />
                        <div className="flex-grow">
                        <h3 className="font-bold text-slate-800 text-lg">{item.name || item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Éditer"
                        >
                            <Edit size={20} />
                        </button>
                        <button 
                            onClick={() => { if(window.confirm('Supprimer cet élément définitivement ?')) deleteItem(collections[activeTab].type, item.id) }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Supprimer"
                        >
                            <Trash2 size={20} />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
