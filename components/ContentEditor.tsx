import React from 'react';

interface ContentEditorProps {
  contentType: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ contentType }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Éditeur de Contenu - {contentType}
      </h2>
      <p className="text-slate-600">
        Composant d'édition pour {contentType} - À implémenter
      </p>
    </div>
  );
};

export default ContentEditor;