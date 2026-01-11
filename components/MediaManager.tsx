import React, { useState, useEffect, useCallback } from 'react';
import { MediaFile, MediaService } from '../services/mediaService';
import { useAuth } from '../contexts/AuthContext';
import { 
  Upload, Search, Grid, List, Trash2, Edit3, Eye, 
  FolderOpen, Image as ImageIcon, File, Download,
  Filter, SortAsc, MoreVertical, X, Check
} from 'lucide-react';

interface MediaManagerProps {
  onSelect?: (media: MediaFile) => void;
  onSelectMultiple?: (media: MediaFile[]) => void;
  allowMultiple?: boolean;
  folder?: string;
  acceptedTypes?: string[];
  maxFileSize?: number; // en MB
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  onSelectMultiple,
  allowMultiple = false,
  folder,
  acceptedTypes = ['image/*'],
  maxFileSize = 10
}) => {
  const { hasPermission } = useAuth();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState(folder || 'general');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);

  // Charger les médias
  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const results = await MediaService.searchMedia(searchQuery, currentFolder);
        setMedia(results);
        setTotal(results.length);
      } else {
        const { data, total: totalCount } = await MediaService.getMedia(
          currentFolder === 'all' ? undefined : currentFolder,
          page,
          20
        );
        setMedia(data);
        setTotal(totalCount);
      }
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentFolder, page]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // Upload de fichiers
  const handleFileUpload = async (files: FileList) => {
    if (!hasPermission('media', 'create')) {
      alert('Vous n\'avez pas les permissions pour uploader des fichiers');
      return;
    }

    setUploading(true);
    try {
      const fileArray = Array.from(files);
      
      // Validation
      for (const file of fileArray) {
        if (file.size > maxFileSize * 1024 * 1024) {
          throw new Error(`Le fichier ${file.name} est trop volumineux (max ${maxFileSize}MB)`);
        }
        
        if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
          throw new Error(`Le type de fichier ${file.type} n'est pas autorisé`);
        }
      }

      // Upload
      const uploadedFiles = await MediaService.uploadMultipleFiles(fileArray, currentFolder);
      
      // Rafraîchir la liste
      await loadMedia();
      
      // Sélectionner automatiquement les fichiers uploadés si mode sélection
      if (onSelect || onSelectMultiple) {
        if (allowMultiple && onSelectMultiple) {
          setSelectedMedia(uploadedFiles);
        } else if (onSelect && uploadedFiles.length > 0) {
          setSelectedMedia([uploadedFiles[0]]);
        }
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Sélection de médias
  const handleMediaSelect = (mediaFile: MediaFile) => {
    if (allowMultiple) {
      const isSelected = selectedMedia.some(m => m.id === mediaFile.id);
      if (isSelected) {
        setSelectedMedia(prev => prev.filter(m => m.id !== mediaFile.id));
      } else {
        setSelectedMedia(prev => [...prev, mediaFile]);
      }
    } else {
      setSelectedMedia([mediaFile]);
      if (onSelect) {
        onSelect(mediaFile);
      }
    }
  };

  // Confirmer la sélection multiple
  const handleConfirmSelection = () => {
    if (onSelectMultiple && selectedMedia.length > 0) {
      onSelectMultiple(selectedMedia);
    }
  };

  // Supprimer un média
  const handleDeleteMedia = async (mediaFile: MediaFile) => {
    if (!hasPermission('media', 'delete')) {
      alert('Vous n\'avez pas les permissions pour supprimer des fichiers');
      return;
    }

    if (!confirm(`Supprimer définitivement "${mediaFile.originalName}" ?`)) {
      return;
    }

    try {
      await MediaService.deleteMedia(mediaFile.id);
      await loadMedia();
      setSelectedMedia(prev => prev.filter(m => m.id !== mediaFile.id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Mettre à jour les métadonnées
  const handleUpdateMedia = async (updates: Partial<MediaFile>) => {
    if (!editingMedia || !hasPermission('media', 'update')) return;

    try {
      await MediaService.updateMedia(editingMedia.id, updates);
      await loadMedia();
      setEditingMedia(null);
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  // Filtrer et trier les médias
  const filteredAndSortedMedia = media
    .filter(m => {
      if (filterType === 'all') return true;
      return m.mimeType.startsWith(filterType);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'size':
          return b.sizeBytes - a.sizeBytes;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Formater la taille de fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Gestionnaire de Médias</h3>
            <p className="text-sm text-slate-600">{total} fichier(s) trouvé(s)</p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            {hasPermission('media', 'create') && (
              <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium">
                <Upload size={16} className="mr-2" />
                {uploading ? 'Upload...' : 'Upload'}
                <input
                  type="file"
                  multiple={allowMultiple}
                  accept={acceptedTypes.join(',')}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
            
            {allowMultiple && selectedMedia.length > 0 && (
              <button
                onClick={handleConfirmSelection}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <Check size={16} className="mr-2" />
                Sélectionner ({selectedMedia.length})
              </button>
            )}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Dossier */}
          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          >
            <option value="all">Tous les dossiers</option>
            <option value="general">Général</option>
            <option value="museums">Musées</option>
            <option value="restaurants">Restaurants</option>
            <option value="accommodation">Hébergement</option>
            <option value="merchants">Commerces</option>
            <option value="events">Événements</option>
            <option value="articles">Articles</option>
          </select>

          {/* Type de fichier */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          >
            <option value="all">Tous les types</option>
            <option value="image">Images</option>
            <option value="video">Vidéos</option>
            <option value="application">Documents</option>
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          >
            <option value="date">Date</option>
            <option value="name">Nom</option>
            <option value="size">Taille</option>
          </select>

          {/* Mode d'affichage */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAndSortedMedia.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Aucun fichier trouvé</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAndSortedMedia.map((mediaFile) => (
              <MediaGridItem
                key={mediaFile.id}
                media={mediaFile}
                isSelected={selectedMedia.some(m => m.id === mediaFile.id)}
                onSelect={() => handleMediaSelect(mediaFile)}
                onEdit={() => setEditingMedia(mediaFile)}
                onDelete={() => handleDeleteMedia(mediaFile)}
                canEdit={hasPermission('media', 'update')}
                canDelete={hasPermission('media', 'delete')}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedMedia.map((mediaFile) => (
              <MediaListItem
                key={mediaFile.id}
                media={mediaFile}
                isSelected={selectedMedia.some(m => m.id === mediaFile.id)}
                onSelect={() => handleMediaSelect(mediaFile)}
                onEdit={() => setEditingMedia(mediaFile)}
                onDelete={() => handleDeleteMedia(mediaFile)}
                canEdit={hasPermission('media', 'update')}
                canDelete={hasPermission('media', 'delete')}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingMedia && (
        <MediaEditModal
          media={editingMedia}
          onSave={handleUpdateMedia}
          onClose={() => setEditingMedia(null)}
        />
      )}
    </div>
  );
};

// Composant pour l'affichage en grille
const MediaGridItem: React.FC<{
  media: MediaFile;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}> = ({ media, isSelected, onSelect, onEdit, onDelete, canEdit, canDelete }) => {
  const isImage = media.mimeType.startsWith('image/');

  return (
    <div
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square bg-slate-100 flex items-center justify-center">
        {isImage ? (
          <img
            src={media.publicUrl}
            alt={media.altText || media.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <File size={32} className="text-slate-400" />
        )}
      </div>
      
      {/* Overlay avec actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); window.open(media.publicUrl, '_blank'); }}
            className="p-2 bg-white rounded-full hover:bg-slate-100"
            title="Voir"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 bg-white rounded-full hover:bg-slate-100"
              title="Éditer"
            >
              <Edit3 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 bg-white rounded-full hover:bg-red-100 text-red-600"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nom du fichier */}
      <div className="p-2 bg-white">
        <p className="text-xs text-slate-600 truncate" title={media.originalName}>
          {media.originalName}
        </p>
      </div>

      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
  );
};

// Composant pour l'affichage en liste
const MediaListItem: React.FC<{
  media: MediaFile;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ media, isSelected, onSelect, onEdit, onDelete, canEdit, canDelete, formatFileSize }) => {
  const isImage = media.mimeType.startsWith('image/');

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
        {isImage ? (
          <img
            src={media.publicUrl}
            alt={media.altText || media.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <File size={20} className="text-slate-400" />
        )}
      </div>

      {/* Informations */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 truncate">{media.originalName}</p>
        <p className="text-sm text-slate-500">
          {formatFileSize(media.sizeBytes)} • {media.folder}
          {media.width && media.height && ` • ${media.width}×${media.height}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); window.open(media.publicUrl, '_blank'); }}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          title="Voir"
        >
          <Eye size={16} />
        </button>
        {canEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            title="Éditer"
          >
            <Edit3 size={16} />
          </button>
        )}
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
  );
};

// Modal d'édition des métadonnées
const MediaEditModal: React.FC<{
  media: MediaFile;
  onSave: (updates: Partial<MediaFile>) => void;
  onClose: () => void;
}> = ({ media, onSave, onClose }) => {
  const [altText, setAltText] = useState(media.altText || '');
  const [caption, setCaption] = useState(media.caption || '');
  const [folder, setFolder] = useState(media.folder);

  const handleSave = () => {
    onSave({ altText, caption, folder });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Éditer le média</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Aperçu */}
          <div className="text-center">
            {media.mimeType.startsWith('image/') ? (
              <img
                src={media.publicUrl}
                alt={media.originalName}
                className="max-w-full h-32 object-contain mx-auto rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                <File size={32} className="text-slate-400" />
              </div>
            )}
            <p className="text-sm text-slate-600 mt-2">{media.originalName}</p>
          </div>

          {/* Formulaire */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Texte alternatif
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Description de l'image pour l'accessibilité"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Légende
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Légende ou description du média"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dossier
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="general">Général</option>
              <option value="museums">Musées</option>
              <option value="restaurants">Restaurants</option>
              <option value="accommodation">Hébergement</option>
              <option value="merchants">Commerces</option>
              <option value="events">Événements</option>
              <option value="articles">Articles</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaManager;