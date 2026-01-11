import React, { useState, useEffect } from 'react';
import { BulkActionsService, BulkActionResult } from '../services/bulkActionsService';
import { 
  Eye, EyeOff, Trash2, Archive, CheckSquare, Square, 
  AlertTriangle, Check, X, Loader, BarChart3
} from 'lucide-react';

interface BulkActionsPanelProps {
  itemType: string;
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  onActionComplete: () => void;
  totalItems: number;
}

const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({
  itemType,
  selectedItems,
  onSelectionChange,
  onActionComplete,
  totalItems
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<BulkActionResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const globalStats = await BulkActionsService.getGlobalStats();
      setStats(globalStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleBulkAction = async (action: string, targetStatus?: string) => {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un élément');
      return;
    }

    const confirmMessage = getConfirmMessage(action, selectedItems.length);
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      let result: BulkActionResult;

      switch (action) {
        case 'activate':
          result = await BulkActionsService.bulkToggleStatus(
            itemType, 
            selectedItems, 
            targetStatus || 'published'
          );
          break;
        case 'deactivate':
          result = await BulkActionsService.bulkToggleStatus(
            itemType, 
            selectedItems, 
            targetStatus || 'draft'
          );
          break;
        case 'archive':
          result = await BulkActionsService.bulkToggleStatus(
            itemType, 
            selectedItems, 
            'archived'
          );
          break;
        case 'delete':
          result = await BulkActionsService.bulkDeleteItems(itemType, selectedItems);
          break;
        default:
          throw new Error(`Action non supportée: ${action}`);
      }

      setLastResult(result);
      setShowResult(true);
      
      // Réinitialiser la sélection et recharger les données
      onSelectionChange([]);
      onActionComplete();
      
      // Recharger les stats
      await loadStats();

    } catch (error) {
      console.error('Erreur lors de l\'action en lot:', error);
      setLastResult({
        success: 0,
        failed: selectedItems.length,
        errors: [`Erreur: ${error}`]
      });
      setShowResult(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfirmMessage = (action: string, count: number): string => {
    const itemText = count === 1 ? 'élément' : 'éléments';
    
    switch (action) {
      case 'activate':
        return `Êtes-vous sûr de vouloir activer ${count} ${itemText} ?`;
      case 'deactivate':
        return `Êtes-vous sûr de vouloir désactiver ${count} ${itemText} ?`;
      case 'archive':
        return `Êtes-vous sûr de vouloir archiver ${count} ${itemText} ?`;
      case 'delete':
        return `Êtes-vous sûr de vouloir supprimer définitivement ${count} ${itemText} ? Cette action est irréversible.`;
      default:
        return `Êtes-vous sûr de vouloir effectuer cette action sur ${count} ${itemText} ?`;
    }
  };

  const handleSelectAll = () => {
    // Cette fonction devrait être implémentée par le composant parent
    // pour sélectionner tous les éléments visibles
    console.log('Sélectionner tout - à implémenter par le parent');
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  if (selectedItems.length === 0 && !stats) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Statistiques globales */}
      {stats && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">Statistiques globales</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.activeItems}</div>
              <div className="text-gray-600">Actifs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.inactiveItems}</div>
              <div className="text-gray-600">Inactifs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{stats.archivedItems}</div>
              <div className="text-gray-600">Archivés</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions en lot */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Tout sélectionner
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Tout désélectionner
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isProcessing ? (
              <div className="flex items-center text-blue-600">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Traitement...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Activer
                </button>
                
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  Désactiver
                </button>
                
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archiver
                </button>
                
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Résultat de l'action */}
      {showResult && lastResult && (
        <div className="mt-4 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {lastResult.failed === 0 ? (
                <Check className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              )}
              <h4 className="font-medium text-gray-900">
                Résultat de l'action
              </h4>
            </div>
            <button
              onClick={() => setShowResult(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-700">
            <div className="flex space-x-4">
              <span className="text-green-600">
                ✓ {lastResult.success} réussi{lastResult.success > 1 ? 's' : ''}
              </span>
              {lastResult.failed > 0 && (
                <span className="text-red-600">
                  ✗ {lastResult.failed} échoué{lastResult.failed > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {lastResult.errors.length > 0 && (
              <div className="mt-2">
                <details className="cursor-pointer">
                  <summary className="text-red-600 hover:text-red-800">
                    Voir les erreurs ({lastResult.errors.length})
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs text-red-600">
                    {lastResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsPanel;