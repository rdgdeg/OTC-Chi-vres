import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  GripVertical, Save, RotateCcw, Eye, EyeOff, MapPin, Image as ImageIcon, 
  Plus, Edit, Trash2, Building, Landmark, Filter, Search, AlertCircle,
  Tag, Calendar, User
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { museumSortService } from '../services/museumSortService';
import MuseumPatrimoineEditor from './MuseumPatrimoineEditor';
import { Place } from '../types';

interface MuseumPatrimoineManagerProps {
  onClose?: () => void;
}

type SubCategory = 'all' | 'musee' | 'patrimoine';

const MuseumPatrimoineManager: React.FC<MuseumPatrimoineManagerProps> = ({ onClose }) => {
  const { museums, updateItem, addItem, deleteItem, refreshData } = useData();
  const { hasPermission } = useAuth();
  
  // États principaux
  const [sortedMuseums, setSortedMuseums] = useState<(Place & { sort_order: number })[]>([]);
  const [filteredMuseums, setFilteredMuseums] = useState<(Place & { sort_order: number })[]>([]);
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États d'interface
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Place | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [sortSupported, setSortSupported] = useState(false);

  // Permissions
  const canEdit = hasPermission('places', 'update');
  const canCreate = hasPermission('places', 'create');
  const canDelete = hasPermission('places', 'delete');

  // Charger les données
  useEffect(() => {
    loadMuseumsWithSort();
  }, [museums]);

  // Filtrer selon la sous-catégorie et la recherche
  useEffect(() => {
    let filtered = sortedMuseums;

    // Filtrer par sous-catégorie
    if (activeSubCategory !== 'all') {
      filtered = sortedMuseums.filter(museum => {
        const hasMuseumTag = museum.tags.some(tag => 
          tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
        );
        const hasPatrimoineTag = museum.tags.some(tag => 
          tag.toLowerCase().includes('patrimoine') || 
          tag.toLowerCase().includes('église') || 
          tag.toLowerCase().includes('chapelle') ||
          tag.toLowerCase().includes('monument') ||
          tag.toLowerCase().includes('architecture')
        );
        
        if (activeSubCategory === 'musee') return hasMuseumTag;
        if (activeSubCategory === 'patrimoine') return hasPatrimoineTag;
        return true;
      });
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(museum =>
        museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        museum.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        museum.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredMuseums(filtered);
  }, [sortedMuseums, activeSubCategory, searchTerm]);

  const loadMuseumsWithSort = async () => {
    try {
      setIsLoading(true);
      
      const supported = await museumSortService.isSortOrderSupported();
      setSortSupported(supported);
      
      if (!supported) {
        setMessage({ 
          type: 'warning', 
          text: 'Le tri en base de données n\'est pas disponible. Les modifications seront temporaires.' 
        });
      }
      
      const museumsWithOrder = await museumSortService.getMuseumsWithSortOrder();
      setSortedMuseums(museumsWithOrder);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredMuseums);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculer les ordres pour tous les éléments
    const reorderedWithNewOrder = items.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));

    // Mettre à jour la liste filtrée
    setFilteredMuseums(reorderedWithNewOrder);
    
    // Mettre à jour la liste complète
    const updatedSorted = sortedMuseums.map(museum => {
      const reordered = reorderedWithNewOrder.find(r => r.id === museum.id);
      return reordered || museum;
    });
    setSortedMuseums(updatedSorted);
    
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const orderedIds = sortedMuseums
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(museum => museum.id);
      
      const success = await museumSortService.reorderMuseums(orderedIds);
      
      if (success) {
        setHasChanges(false);
        setMessage({ type: 'success', text: 'Ordre sauvegardé avec succès' });
        await refreshData();
        await loadMuseumsWithSort();
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      await loadMuseumsWithSort();
      setHasChanges(false);
      setMessage({ type: 'success', text: 'Ordre réinitialisé' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (museum: Place) => {
    setEditingItem(museum);
    setShowAddForm(true);
  };

  const handleSaveItem = async (itemData: Omit<Place, 'id'> & { id?: string }) => {
    try {
      if (itemData.id) {
        // Modification
        await updateItem('museum', itemData as Place);
        setMessage({ type: 'success', text: 'Élément modifié avec succès' });
      } else {
        // Ajout
        await addItem('museum', itemData);
        setMessage({ type: 'success', text: 'Élément ajouté avec succès' });
      }
      
      setShowAddForm(false);
      setEditingItem(null);
      await loadMuseumsWithSort();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (museum: Place) => {
    if (!canDelete) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${museum.name}" ?`)) {
      try {
        await deleteItem('museum', museum.id);
        setMessage({ type: 'success', text: 'Élément supprimé avec succès' });
        await loadMuseumsWithSort();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const getSubCategoryFromTags = (tags: string[]): 'musee' | 'patrimoine' | 'autre' => {
    const hasMuseumTag = tags.some(tag => 
      tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum')
    );
    const hasPatrimoineTag = tags.some(tag => 
      tag.toLowerCase().includes('patrimoine') || 
      tag.toLowerCase().includes('église') || 
      tag.toLowerCase().includes('chapelle') ||
      tag.toLowerCase().includes('monument')
    );
    
    if (hasMuseumTag) return 'musee';
    if (hasPatrimoineTag) return 'patrimoine';
    return 'autre';
  };

  const clearMessage = () => {
    setMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Chargement des musées et patrimoine...</span>
      </div>
    );
  }

  // Compter les éléments par catégorie
  const categoryCounts = {
    all: sortedMuseums.length,
    musee: sortedMuseums.filter(m => getSubCategoryFromTags(m.tags) === 'musee').length,
    patrimoine: sortedMuseums.filter(m => getSubCategoryFromTags(m.tags) === 'patrimoine').length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Musées & Patrimoine</h2>
          <p className="text-gray-600 mt-1">
            Gérez l'ordre d'affichage et le contenu de vos lieux culturels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {canCreate && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          )}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{previewMode ? 'Masquer l\'aperçu' : 'Aperçu'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : message.type === 'warning'
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {message.type === 'warning' && <AlertCircle className="h-4 w-4 mr-2" />}
              <span>{message.text}</span>
            </div>
            <button onClick={clearMessage} className="ml-2 text-current opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filtres par sous-catégorie */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter size={20} />
              <span className="font-medium">Catégorie :</span>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tout', icon: null, count: categoryCounts.all },
                { id: 'musee', label: 'Musées', icon: Building, count: categoryCounts.musee },
                { id: 'patrimoine', label: 'Patrimoine', icon: Landmark, count: categoryCounts.patrimoine }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveSubCategory(category.id as SubCategory)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeSubCategory === category.id
                      ? category.id === 'musee' 
                        ? 'bg-blue-600 text-white'
                        : category.id === 'patrimoine'
                        ? 'bg-amber-600 text-white'
                        : 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.icon && <category.icon size={16} />}
                  <span>{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeSubCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Aperçu de l'ordre */}
      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Aperçu de l'ordre sur le site</h3>
          <div className="space-y-2">
            {filteredMuseums.map((museum, index) => (
              <div key={museum.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg border">
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {index + 1}
                </span>
                <img 
                  src={museum.imageUrl} 
                  alt={museum.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{museum.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {museum.address}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getSubCategoryFromTags(museum.tags) === 'musee' && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Musée</span>
                  )}
                  {getSubCategoryFromTags(museum.tags) === 'patrimoine' && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Patrimoine</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interface de tri */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Liste des éléments ({filteredMuseums.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {activeSubCategory !== 'all' && `Filtré par ${activeSubCategory === 'musee' ? 'Musées' : 'Patrimoine'} • `}
                Glissez les éléments pour modifier leur ordre
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                disabled={!hasChanges || isSaving || isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Réinitialiser</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving || isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder l\'ordre'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredMuseums.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeSubCategory === 'musee' ? (
                  <Building size={24} className="text-gray-400" />
                ) : activeSubCategory === 'patrimoine' ? (
                  <Landmark size={24} className="text-gray-400" />
                ) : (
                  <MapPin size={24} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun élément trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `Aucun résultat pour "${searchTerm}"`
                  : `Aucun ${activeSubCategory === 'musee' ? 'musée' : activeSubCategory === 'patrimoine' ? 'site patrimonial' : 'élément'} disponible`
                }
              </p>
              {(searchTerm || activeSubCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveSubCategory('all');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Voir tous les éléments
                </button>
              )}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="museums">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''} transition-colors rounded-lg p-2`}
                  >
                    {filteredMuseums.map((museum, index) => (
                      <Draggable key={museum.id} draggableId={museum.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg p-4 transition-all ${
                              snapshot.isDragging 
                                ? 'shadow-lg border-primary bg-blue-50' 
                                : 'hover:shadow-md border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              {/* Handle de glissement */}
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              {/* Numéro d'ordre */}
                              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full">
                                {index + 1}
                              </div>

                              {/* Image */}
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {museum.imageUrl ? (
                                  <img 
                                    src={museum.imageUrl} 
                                    alt={museum.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Informations */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                  {museum.name}
                                </h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{museum.address}</span>
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {museum.tags.slice(0, 3).map(tag => {
                                    const subCategory = getSubCategoryFromTags([tag]);
                                    let tagColor = 'bg-gray-100 text-gray-600';
                                    if (subCategory === 'musee') tagColor = 'bg-blue-100 text-blue-700';
                                    if (subCategory === 'patrimoine') tagColor = 'bg-amber-100 text-amber-700';
                                    
                                    return (
                                      <span key={tag} className={`text-xs px-2 py-1 rounded ${tagColor}`}>
                                        {tag}
                                      </span>
                                    );
                                  })}
                                  {museum.tags.length > 3 && (
                                    <span className="text-xs text-gray-400">
                                      +{museum.tags.length - 3} autres
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2">
                                {canEdit && (
                                  <button
                                    onClick={() => handleEdit(museum)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => handleDelete(museum)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>

                              {/* Ordre actuel */}
                              <div className="text-right">
                                <div className="text-xs text-gray-500">Ordre</div>
                                <div className="text-lg font-bold text-gray-700">
                                  {museum.sort_order || 'Non défini'}
                                </div>
                                {!sortSupported && (
                                  <div className="text-xs text-yellow-600 mt-1">
                                    Temporaire
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Informations d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Utilisation du gestionnaire</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• **Tri** : Glissez-déposez les éléments pour modifier leur ordre d'affichage</li>
          <li>• **Filtres** : Utilisez les catégories et la recherche pour trouver des éléments spécifiques</li>
          <li>• **Sous-catégories** : Musées et Patrimoine sont automatiquement détectés via les tags</li>
          <li>• **Sauvegarde** : L'ordre défini ici sera appliqué sur la page publique du site</li>
          <li>• **Aperçu** : Visualisez le résultat final avant de sauvegarder</li>
        </ul>
      </div>

      {/* Modal d'édition */}
      {showAddForm && (
        <MuseumPatrimoineEditor
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={handleCancelEdit}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default MuseumPatrimoineManager;