import React, { useState, useEffect } from 'react';
import { 
  GripVertical, RotateCcw, Save, AlertCircle, CheckCircle,
  ArrowUp, ArrowDown, Hash, Eye, Edit3
} from 'lucide-react';
import UniversalSortService, { SortableItem } from '../../services/admin/UniversalSortService';

interface UniversalSortManagerProps {
  tableKey: string;
  title: string;
  description?: string;
  onItemEdit?: (itemId: string) => void;
  onItemView?: (itemId: string) => void;
}

const UniversalSortManager: React.FC<UniversalSortManagerProps> = ({
  tableKey,
  title,
  description,
  onItemEdit,
  onItemView
}) => {
  const [items, setItems] = useState<SortableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<{ total: number; withSortOrder: number; withoutSortOrder: number }>({
    total: 0,
    withSortOrder: 0,
    withoutSortOrder: 0
  });

  useEffect(() => {
    loadItems();
    loadStats();
  }, [tableKey]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await UniversalSortService.getSortedItems(tableKey);
      setItems(data);
      setHasChanges(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showMessage('error', 'Erreur lors du chargement des éléments');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await UniversalSortService.getSortStats(tableKey);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    // Réorganiser les éléments
    const newItems = [...items];
    const [draggedElement] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedElement);

    // Mettre à jour les sort_order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));

    setItems(updatedItems);
    setHasChanges(true);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= items.length) return;

    const newItems = [...items];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];

    // Mettre à jour les sort_order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));

    setItems(updatedItems);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const orderedIds = items.map(item => item.id);
      const success = await UniversalSortService.reorderItems(tableKey, orderedIds);
      
      if (success) {
        setHasChanges(false);
        showMessage('success', 'Ordre sauvegardé avec succès !');
        await loadStats(); // Recharger les stats
      } else {
        showMessage('error', 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const resetToAlphabetical = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser l\'ordre alphabétique ?')) {
      return;
    }

    setSaving(true);
    try {
      const success = await UniversalSortService.resetToAlphabeticalOrder(tableKey);
      
      if (success) {
        await loadItems();
        showMessage('success', 'Ordre alphabétique restauré !');
      } else {
        showMessage('error', 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      showMessage('error', 'Erreur lors de la réinitialisation');
    } finally {
      setSaving(false);
    }
  };

  const initializeMissingOrders = async () => {
    setSaving(true);
    try {
      const success = await UniversalSortService.initializeMissingSortOrders(tableKey);
      
      if (success) {
        await loadItems();
        await loadStats();
        showMessage('success', 'Ordres initialisés pour les éléments manquants !');
      } else {
        showMessage('error', 'Erreur lors de l\'initialisation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      showMessage('error', 'Erreur lors de l\'initialisation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        
        {/* Statistiques */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-800">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.withSortOrder}</div>
                <div className="text-sm text-green-800">Avec ordre</div>
              </div>
              {stats.withoutSortOrder > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.withoutSortOrder}</div>
                  <div className="text-sm text-orange-800">Sans ordre</div>
                </div>
              )}
            </div>
            
            {stats.withoutSortOrder > 0 && (
              <button
                onClick={initializeMissingOrders}
                disabled={saving}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                Initialiser les ordres manquants
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={saveOrder}
            disabled={!hasChanges || saving}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              hasChanges
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder l\'ordre'}
          </button>

          <button
            onClick={resetToAlphabetical}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Ordre alphabétique
          </button>
        </div>

        {hasChanges && (
          <div className="flex items-center text-orange-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            Modifications non sauvegardées
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Liste triable */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun élément à trier
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Glissez-déposez les éléments pour changer leur ordre d'affichage sur le site
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                  draggedItem === item.id ? 'opacity-50' : ''
                } ${
                  dragOverIndex === index ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                {/* Poignée de glissement */}
                <div className="flex items-center mr-4">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                </div>

                {/* Numéro d'ordre */}
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mr-4">
                  {index + 1}
                </div>

                {/* Nom de l'élément */}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    Ordre: {item.sort_order || 'Non défini'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Boutons de déplacement */}
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Monter"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Descendre"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  {/* Actions personnalisées */}
                  {onItemView && (
                    <button
                      onClick={() => onItemView(item.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onItemEdit && (
                    <button
                      onClick={() => onItemEdit(item.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Glissez-déposez les éléments pour changer leur ordre</li>
          <li>• Utilisez les flèches ↑↓ pour des ajustements précis</li>
          <li>• Cliquez sur "Sauvegarder l'ordre" pour appliquer les changements</li>
          <li>• L'ordre sera immédiatement visible sur le site public</li>
        </ul>
      </div>
    </div>
  );
};

export default UniversalSortManager;