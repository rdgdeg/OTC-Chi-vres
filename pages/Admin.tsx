
import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit, Save, LogIn, RefreshCw, Image as ImageIcon, ExternalLink, FileText, Layers, Upload, Check, AlertCircle, Database } from 'lucide-react';
import { PageContent } from '../types';
import ImageUploader from '../components/ImageUploader';
import WalksDatabaseUpdater from '../components/WalksDatabaseUpdater';
import WalkEditor from '../components/WalkEditor';

const Admin: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('museum');
  // Edit items (places, events)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  // Edit page content
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [tempPageContent, setTempPageContent] = useState<PageContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    museums, restaurants, accommodation, merchants, walks, experiences, events, products, pageContent,
    updateItem, addItem, deleteItem, updatePageContent, syncMockDataToSupabase, isLoading, refreshData 
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      // Login successful
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

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (editingItem.isNew) {
        const { isNew, ...itemToSave } = editingItem;
        await addItem(collections[activeTab].type, { ...itemToSave }); // ID generated in DataContext if needed
      } else {
        await updateItem(collections[activeTab].type, editingItem);
      }
      setEditingItem(null);
    }
  };

  const handleSavePageContent = async (e: React.FormEvent) => {
      e.preventDefault();
      if(editingPageId && tempPageContent) {
          await updatePageContent(editingPageId, tempPageContent);
          alert('Contenu de la page mis à jour !');
      }
  };

  const handleSync = async () => {
    if(window.confirm("Cela va envoyer toutes les données par défaut vers votre base de données Supabase. Utile pour la première initialisation. Continuer ?")) {
        await syncMockDataToSupabase();
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isPageContext: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 2MB (Base64 in DB limit suggestion)
    if (file.size > 2 * 1024 * 1024) {
        alert("Attention : L'image est trop volumineuse (> 2Mo). Veuillez la compresser avant de l'uploader.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        
        if (isPageContext && tempPageContent) {
            setTempPageContent({ ...tempPageContent, [fieldName]: base64String });
        } else if (!isPageContext && editingItem) {
            setEditingItem({ ...editingItem, [fieldName]: base64String });
        }
    };
    reader.readAsDataURL(file);
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
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-serif font-bold">Tableau de Bord</h1>
                <p className="text-slate-400">Gérez le contenu du site VisitChièvres.be via Supabase</p>
            </div>
            <div className="flex space-x-3">
                <button 
                    onClick={refreshData} 
                    disabled={isLoading} 
                    className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-xs uppercase font-bold tracking-wider disabled:opacity-50 transition-colors"
                    title="Rafraîchir les données depuis la base"
                >
                    <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> 
                    {isLoading ? 'Chargement...' : 'Rafraîchir'}
                </button>
                <button 
                    onClick={handleSync} 
                    disabled={isLoading} 
                    className="flex items-center px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-xs uppercase font-bold tracking-wider disabled:opacity-50"
                >
                    <Database size={16} className={`mr-2 ${isLoading ? 'animate-pulse' : ''}`} /> 
                    {isLoading ? 'Chargement...' : 'Initialiser DB'}
                </button>
            </div>
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
                onClick={() => { setActiveTab('pages'); setEditingPageId('home'); setTempPageContent(pageContent['home'] || {} as PageContent); }}
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
                                onClick={() => { setEditingPageId(page.id); setTempPageContent(pageContent[page.id] || {} as PageContent); }}
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
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image de fond</label>
                                            <div className="flex flex-col space-y-3">
                                                {/* File Upload */}
                                                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors group">
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="text-slate-400 group-hover:text-secondary mb-1" />
                                                        <span className="text-xs text-slate-500 font-bold uppercase">Télécharger une image</span>
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileUpload(e, 'heroImage', true)} 
                                                    />
                                                </label>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-slate-400 font-bold">OU URL :</span>
                                                    <input 
                                                        type="text" 
                                                        className="flex-grow p-2 border border-slate-300 rounded-lg font-mono text-sm"
                                                        value={tempPageContent.heroImage || ''}
                                                        onChange={e => setTempPageContent({...tempPageContent, heroImage: e.target.value})}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>

                                            {tempPageContent.heroImage && (
                                                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200">
                                                    <img src={tempPageContent.heroImage} className="w-full h-full object-cover" alt="Preview"/>
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full"><Check size={12}/></div>
                                                </div>
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
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image Extra</label>
                                            
                                            <div className="flex flex-col space-y-2">
                                                <label className="flex items-center justify-center w-full p-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <Upload size={16} className="text-slate-400 mr-2" />
                                                    <span className="text-xs text-slate-500 font-bold">Uploader</span>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileUpload(e, 'extraImage', true)} 
                                                    />
                                                </label>
                                                <input 
                                                    type="text" 
                                                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
                                                    value={tempPageContent.extraImage || ''}
                                                    onChange={e => setTempPageContent({...tempPageContent, extraImage: e.target.value})}
                                                    placeholder="Ou URL image..."
                                                />
                                            </div>
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

                {/* Composant spécial pour la mise à jour des balades */}
                {activeTab === 'walk' && !editingItem && (
                    <div className="mb-8">
                        <WalksDatabaseUpdater />
                    </div>
                )}

                {editingItem ? (
                // Utiliser l'éditeur spécialisé pour les balades
                activeTab === 'walk' ? (
                    <WalkEditor
                        walk={editingItem.isNew ? null : editingItem}
                        isNew={editingItem.isNew}
                        onSave={async (walkData) => {
                            if (editingItem.isNew) {
                                await addItem('walk', walkData);
                            } else {
                                await updateItem('walk', { ...editingItem, ...walkData });
                            }
                            setEditingItem(null);
                        }}
                        onCancel={() => setEditingItem(null)}
                    />
                ) : (
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
                                    <ImageIcon size={14} className="mr-1"/> Image (Photo)
                                    </label>
                                    <div className="flex items-center text-[10px] text-slate-400">
                                        <AlertCircle size={10} className="mr-1"/> Max 2Mo recommandé
                                    </div>
                                </div>
                                
                                {/* Upload Box */}
                                <div className="mb-3">
                                    <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 rounded-lg p-6 transition-all group">
                                        <div className="bg-white p-2 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                            <Upload className="text-blue-500" size={20} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Cliquez pour uploader une image</span>
                                        <span className="text-xs text-slate-400 mt-1">PNG, JPG (sera converti en Base64)</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden" 
                                            onChange={(e) => handleFileUpload(e, 'imageUrl')}
                                        />
                                    </label>
                                </div>

                                <div className="relative flex items-center mb-2">
                                     <div className="flex-grow border-t border-slate-200"></div>
                                     <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Ou via URL</span>
                                     <div className="flex-grow border-t border-slate-200"></div>
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
                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md"><Check size={14}/></div>
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
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                            <input 
                                                type="email" 
                                                value={editingItem.email || ''} 
                                                onChange={e => setEditingItem({...editingItem, email: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="contact@..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Site Web</label>
                                        <input 
                                            type="text" 
                                            value={editingItem.website || ''} 
                                            onChange={e => setEditingItem({...editingItem, website: e.target.value})}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Facebook</label>
                                            <input 
                                                type="text" 
                                                value={editingItem.facebook || ''} 
                                                onChange={e => setEditingItem({...editingItem, facebook: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="https://facebook.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Instagram</label>
                                            <input 
                                                type="text" 
                                                value={editingItem.instagram || ''} 
                                                onChange={e => setEditingItem({...editingItem, instagram: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Twitter</label>
                                            <input 
                                                type="text" 
                                                value={editingItem.twitter || ''} 
                                                onChange={e => setEditingItem({...editingItem, twitter: e.target.value})}
                                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="https://twitter.com/..."
                                            />
                                        </div>
                                    </div>

                                    {collections[activeTab].type === 'museum' && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Horaires d'ouverture</label>
                                                <textarea 
                                                    rows={3}
                                                    value={editingItem.openingHours || ''} 
                                                    onChange={e => setEditingItem({...editingItem, openingHours: e.target.value})}
                                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Ex: Mardi-Dimanche: 10h-18h&#10;Fermé le lundi"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prix / Tarifs</label>
                                                <textarea 
                                                    rows={2}
                                                    value={editingItem.price || ''} 
                                                    onChange={e => setEditingItem({...editingItem, price: e.target.value})}
                                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Ex: Adulte: 8€ / Enfant: 5€ / Gratuit -6 ans"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Informations Pratiques</label>
                                                <textarea 
                                                    rows={3}
                                                    value={editingItem.practicalInfo || ''} 
                                                    onChange={e => setEditingItem({...editingItem, practicalInfo: e.target.value})}
                                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Ex: Parking gratuit disponible&#10;Accessible PMR&#10;Visites guidées sur réservation"
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <ImageUploader
                                                    currentImages={editingItem.galleryImages || []}
                                                    onImagesChange={(images) => setEditingItem({...editingItem, galleryImages: images})}
                                                    maxImages={10}
                                                    folder="museums"
                                                    label="Galerie d'images"
                                                />
                                                <p className="text-xs text-slate-500 mt-2 italic">
                                                    💡 Astuce : La première image sera utilisée comme image principale dans la galerie. 
                                                    Vous pouvez uploader jusqu'à 10 images.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    
                                    {collections[activeTab].type === 'restaurant' && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Horaires d'ouverture</label>
                                                <textarea 
                                                    rows={3}
                                                    value={editingItem.openingHours || ''} 
                                                    onChange={e => setEditingItem({...editingItem, openingHours: e.target.value})}
                                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Ex: Lundi-Vendredi: 12h-14h, 18h-22h"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Gamme de prix</label>
                                                <input 
                                                    type="text" 
                                                    value={editingItem.price || ''} 
                                                    onChange={e => setEditingItem({...editingItem, price: e.target.value})}
                                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Ex: €€ (15-30€) ou Menu du jour: 15€"
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <ImageUploader
                                                    currentImages={editingItem.galleryImages || []}
                                                    onImagesChange={(images) => setEditingItem({...editingItem, galleryImages: images})}
                                                    maxImages={8}
                                                    folder="restaurants"
                                                    label="Galerie d'images"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {collections[activeTab].type === 'hotel' && (
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <ImageUploader
                                                currentImages={editingItem.galleryImages || []}
                                                onImagesChange={(images) => setEditingItem({...editingItem, galleryImages: images})}
                                                maxImages={10}
                                                folder="accommodation"
                                                label="Galerie d'images"
                                            />
                                        </div>
                                    )}

                                    {collections[activeTab].type === 'shop' && (
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <ImageUploader
                                                currentImages={editingItem.galleryImages || []}
                                                onImagesChange={(images) => setEditingItem({...editingItem, galleryImages: images})}
                                                maxImages={6}
                                                folder="merchants"
                                                label="Galerie d'images"
                                            />
                                        </div>
                                    )}
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
                )
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
