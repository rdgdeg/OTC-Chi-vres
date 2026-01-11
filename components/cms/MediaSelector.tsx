import React from 'react'
import { MediaItem } from '../../types/cms'
import { UnifiedMediaLibrary } from './UnifiedMediaLibrary'

interface MediaSelectorProps {
  onSelect: (media: MediaItem) => void
  onClose: () => void
  allowMultiple?: boolean
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  onSelect,
  onClose,
  allowMultiple = false
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Sélectionner {allowMultiple ? 'des médias' : 'un média'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <UnifiedMediaLibrary
            onSelectMedia={onSelect}
            allowMultiple={allowMultiple}
            selectionMode={true}
          />
        </div>
      </div>
    </div>
  )
}

export default MediaSelector