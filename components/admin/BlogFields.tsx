import React from 'react';
import { FileText, Calendar, User, Tag, Eye } from 'lucide-react';

interface BlogFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const BlogFields: React.FC<BlogFieldsProps> = ({
  formData,
  onChange
}) => {
  const categories = [
    'Actualités',
    'Événements',
    'Découverte',
    'Patrimoine',
    'Nature',
    'Gastronomie',
    'Culture',
    'Tourisme',
    'Vie locale'
  ];

  return (
    <div className="space-y-6">
      {/* Titre et slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Titre de l'article *
          </label>
          <input
            type="text"
            value={formData.title || formData.name || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Titre accrocheur de l'article"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="mon-article-slug"
          />
        </div>
      </div>

      {/* Chapeau / Extrait */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chapeau / Extrait *
        </label>
        <textarea
          value={formData.excerpt || formData.summary || ''}
          onChange={(e) => onChange('excerpt', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Résumé court de l'article (150-200 caractères)"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.excerpt || '').length} caractères
        </p>
      </div>

      {/* Contenu complet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu de l'article *
        </label>
        <textarea
          value={formData.content || formData.description || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Contenu complet de l'article (Markdown supporté)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Vous pouvez utiliser Markdown pour la mise en forme
        </p>
      </div>

      {/* Catégorie et auteur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Catégorie
          </label>
          <select
            value={formData.category || formData.category_id || ''}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Auteur
          </label>
          <input
            type="text"
            value={formData.author || formData.author_name || ''}
            onChange={(e) => onChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nom de l'auteur"
          />
        </div>
      </div>

      {/* Date de publication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Date de publication
          </label>
          <input
            type="date"
            value={formData.published_at ? new Date(formData.published_at).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange('published_at', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Eye className="h-4 w-4 inline mr-1" />
            Nombre de vues
          </label>
          <input
            type="number"
            min="0"
            value={formData.view_count || 0}
            onChange={(e) => onChange('view_count', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            Mis à jour automatiquement
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 inline mr-1" />
          Tags (séparés par des virgules)
        </label>
        <input
          type="text"
          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
          onChange={(e) => onChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="tourisme, patrimoine, événement"
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_featured || false}
            onChange={(e) => onChange('is_featured', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Article à la une
          </span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.allow_comments !== false}
            onChange={(e) => onChange('allow_comments', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Autoriser les commentaires
          </span>
        </label>
      </div>
    </div>
  );
};

export default BlogFields;
