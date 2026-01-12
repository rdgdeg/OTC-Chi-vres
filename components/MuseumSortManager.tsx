import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Save, RotateCcw, Eye, EyeOff, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { museumSortService } from '../services/museumSortService';
import { Place } from '../types';

interface MuseumSortManagerProps {
  onClose?: () => void;
}

const MuseumSortManager: React.FC<MuseumSortManagerProps> = ({ onClose }) => {
  const { museums, refreshData } = useData();
  const [sortedMuseums, setSortedMuseums] = useState<(Place & { sort_order: number })[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [sortSupported, setSortSupported] = useState(false);

  // Initialiser la liste triée
  useEffect(() => {
    loadMuseumsWithSort();
  }, [museums]);

  const loadMuseumsWithSort = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si le tri est supporté
      const supported = await museumSortService.isSortOrderSupported();
      setSortSupported(supported);
      
      if (!supported) {
        setMessage({ 
          type: 'warning', 
          text: 'Le tri en base de données n\'est pas disponible. Les modifications seront temporaires.' 
        });
      }
      
      // Charger les musées avec leur ordre
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

    const items = Array.from(sortedMuseums);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSortedMuseums(items);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Extraire les IDs dans l'ordre
      const orderedIds = sortedMuseums.map(museum => museum.id);
      
      // Utiliser le service de tri
      const success = await museumSortService.reorderMuseums(orderedIds);
      
      if (success) {
        setHasChanges(false);
        setMessage({ type: 'success', text: 'Ordre sauvegardé avec succès' });
        
        // Actualiser les données
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

  const clearMessage = () => {
    setMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Chargement des musées...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion de l'ordre des Musées & Patrimoine</h2>
          <p className="text-gray-600 mt-1">
            Glissez-déposez les éléments pour modifier leur ordre d'affichage sur le site
          </p>
        </div>
        <div className="flex items-center space-x-3">
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

      {/* Aperçu de l'ordre actuel */}
      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Aperçu de l'ordre sur le site</h3>
          <div className="space-y-2">
            {sortedMuseums.map((museum, index) => (
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
                <div className="flex flex-wrap gap-1">
                  {museum.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
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
                Liste des éléments ({sortedMuseums.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="museums">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''} transition-colors rounded-lg p-2`}
                >
                  {sortedMuseums.map((museum, index) => (
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
                                  const isMuseumTag = tag.toLowerCase().includes('musée') || tag.toLowerCase().includes('museum');
                                  const isPatrimoineTag = tag.toLowerCase().includes('patrimoine') || 
                                                        tag.toLowerCase().includes('église') || 
                                                        tag.toLowerCase().includes('chapelle');
                                  
                                  let tagColor = 'bg-gray-100 text-gray-600';
                                  if (isMuseumTag) tagColor = 'bg-blue-100 text-blue-700';
                                  if (isPatrimoineTag) tagColor = 'bg-amber-100 text-amber-700';
                                  
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

                            {/* Ordre actuel */}
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Ordre actuel</div>
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
        </div>
      </div>

      {/* Informations d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Comment utiliser le tri</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Glissez-déposez les éléments pour modifier leur ordre</li>
          <li>• L'élément en position 1 s'affichera en premier sur le site</li>
          <li>• Utilisez l'aperçu pour voir le résultat final</li>
          <li>• N'oubliez pas de sauvegarder vos modifications</li>
          <li>• Les changements sont visibles immédiatement sur le site après sauvegarde</li>
        </ul>
      </div>
    </div>
  );
};

export default MuseumSortManager;