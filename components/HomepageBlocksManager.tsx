import React, { useState, useEffect } from 'react';
import { 
  Save, Edit3, Plus, Trash2, Eye, EyeOff, 
  GripVertical, ChevronUp, ChevronDown, Palette,
  Image as ImageIcon, Link as LinkIcon, Type
} from 'lucide-react';
import { homepageBlocksService, HomepageBlock, CreateHomepageBlockData } from '../services/homepageBlocksService';
import EditableImage from './EditableImage';

const HomepageBlocksManager: React.FC = () => {
  const [blocks, setBlocks] = useState<HomepageBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<HomepageBlock | null>(null);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const data = await homepageBlocksService.getAllBlocksForAdmin();
      setBlocks(data);
    } catch (error) {
      showMessage('error', 'Erreur lors du chargement des blocs');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
      const success = await homepageBlocksService.deleteBlock(id);
      if (success) {
        showMessage('success', 'Bloc supprimé avec succès');
        loadBlocks();
      } else {
        showMessage('error', 'Erreur lors de la suppression');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const success = await homepageBlocksService.toggleBlockStatus(id, !currentStatus);
    if (success) {
      showMessage('success', `Bloc ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      loadBlocks();
    } else {
      showMessage('error', 'Erreur lors de la mise à jour');
    }
  };

  const moveBlock = async (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    // Échanger les positions
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    // Mettre à jour les sort_order
    const updates = newBlocks.map((block, idx) => ({
      id: block.id,
      sort_order: idx + 1
    }));

    const success = await homepageBlocksService.reorderBlocks(updates);
    if (success) {
      showMessage('success', 'Ordre mis à jour avec succès');
      loadBlocks();
    } else {
      showMessage('error', 'Erreur lors de la réorganisation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blocs de Navigation</h2>
          <p className="text-gray-600 mt-1">
            Gérez les blocs "Envie de..." de la page d'accueil
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un bloc
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <BlockForm
          block={editingBlock}
          onSave={async (data) => {
            let success;
            if (editingBlock) {
              success = await homepageBlocksService.updateBlock(editingBlock.id, data);
            } else {
              const result = await homepageBlocksService.createBlock(data);
              success = !!result;
            }
            
            if (success) {
              showMessage('success', `Bloc ${editingBlock ? 'mis à jour' : 'créé'} avec succès`);
              loadBlocks();
              setShowForm(false);
              setEditingBlock(null);
            } else {
              showMessage('error', 'Erreur lors de la sauvegarde');
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingBlock(null);
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Image miniature */}
                  {block.image_url && (
                    <img
                      src={block.image_url}
                      alt={block.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  
                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-lg">{block.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        block.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {block.is_active ? 'Actif' : 'Inactif'}
                      </span>
                      {block.background_color && (
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: block.background_color }}
                          title={`Couleur: ${block.background_color}`}
                        ></div>
                      )}
                    </div>
                    
                    {block.subtitle && (
                      <p className="text-sm text-gray-500 mb-1">{block.subtitle}</p>
                    )}
                    
                    {block.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{block.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {block.link_url && (
                        <span className="flex items-center">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {block.link_url}
                        </span>
                      )}
                      <span>Ordre: {block.sort_order}</span>
                      {block.icon_name && (
                        <span>Icône: {block.icon_name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Réorganisation */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Monter"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Descendre"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Actions principales */}
                  <button
                    onClick={() => toggleActive(block.id, block.is_active)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={block.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {block.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingBlock(block);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Modifier"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(block.id)}
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
      )}
    </div>
  );
};

// Formulaire pour créer/éditer un bloc
interface BlockFormProps {
  block?: HomepageBlock | null;
  onSave: (data: CreateHomepageBlockData) => void;
  onCancel: () => void;
}

const BlockForm: React.FC<BlockFormProps> = ({ block, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: block?.title || '',
    subtitle: block?.subtitle || '',
    description: block?.description || '',
    image_url: block?.image_url || '',
    link_url: block?.link_url || '',
    icon_name: block?.icon_name || 'MapPin',
    background_color: block?.background_color || '#f3f4f6',
    text_color: block?.text_color || '#1f2937',
    sort_order: block?.sort_order || 0,
    is_active: block?.is_active ?? true
  });

  const iconOptions = [
    'MapPin', 'Calendar', 'Mountain', 'Utensils', 'Bed',
    'Camera', 'Users', 'Coffee', 'TreePine', 'Building'
  ];

  const colorPresets = [
    { name: 'Jaune', value: '#fef3c7' },
    { name: 'Bleu', value: '#dbeafe' },
    { name: 'Vert', value: '#dcfce7' },
    { name: 'Rose', value: '#fce7f3' },
    { name: 'Violet', value: '#f3e8ff' },
    { name: 'Orange', value: '#fed7aa' },
    { name: 'Gris', value: '#f3f4f6' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpdate = async (newUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: newUrl }));
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {block ? 'Modifier le bloc' : 'Nouveau bloc'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Sous-titre
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <EditableImage
            src={formData.image_url || 'https://picsum.photos/600/400'}
            alt="Image du bloc"
            onImageUpdate={handleImageUpdate}
            folder="homepage-blocks"
            className="w-full h-48 rounded-lg"
          />
        </div>

        {/* Lien et icône */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de destination
            </label>
            <input
              type="text"
              value={formData.link_url}
              onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: /musees"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône
            </label>
            <select
              value={formData.icon_name}
              onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Couleurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur de fond
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {colorPresets.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, background_color: color.value }))}
                  className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur du texte
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.text_color}
                onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex items-center pt-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Bloc actif</span>
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
            {block ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageBlocksManager;