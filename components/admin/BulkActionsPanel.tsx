import React, { useState } from 'react';
import { 
  Check, X, Eye, EyeOff, Archive, Trash2, 
  AlertCircle, ChevronDown 
} from 'lucide-react';

interface BulkActionsPanelProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClear: () => void;
}

export const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({
  selectedCount,
  onAction,
  onClear
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'publish',
      label: 'Publier',
      icon: Eye,
      color: 'text-green-600',
      description: 'Rendre visible sur le site'
    },
    {
      id: 'unpublish',
      label: 'Dépublier',
      icon: EyeOff,
      color: 'text-yellow-600',
      description: 'Masquer du site (brouillon)'
    },
    {
      id: 'archive',
      label: 'Archiver',
      icon: Archive,
      color: 'text-gray-600',
      description: 'Archiver les éléments'
    },
    {
      id: 'delete',
      label: 'Supprimer',
      icon: Trash2,
      color: 'text-red-600',
      description: 'Supprimer définitivement',
      dangerous: true
    }
  ];

  const handleAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    
    if (action?.dangerous) {
      setConfirmAction(actionId);
    } else {
      onAction(actionId);
      setShowDropdown(false);
    }
  };

  const confirmDangerousAction = () => {
    if (confirmAction) {
      onAction(confirmAction);
      setConfirmAction(null);
      setShowDropdown(false);
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
              >
                Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {actions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${action.color}`}
                      >
                        <action.icon className="h-4 w-4 mr-3" />
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">
                            {action.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={onClear}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Désélectionner tout"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation pour les actions dangereuses */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer l'action
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir{' '}
                <strong>
                  {actions.find(a => a.id === confirmAction)?.label.toLowerCase()}
                </strong>{' '}
                {selectedCount} élément{selectedCount > 1 ? 's' : ''} ?
                {confirmAction === 'delete' && (
                  <span className="block mt-2 text-red-600 font-medium">
                    Cette action est irréversible.
                  </span>
                )}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDangerousAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};