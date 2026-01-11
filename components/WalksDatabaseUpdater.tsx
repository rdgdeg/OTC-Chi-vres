import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle, AlertCircle, Download, MapPin, AlertTriangle } from 'lucide-react';
import { updateWalksInDatabase, verifyWalksData, displayWalksSummary, checkDatabaseSchema } from '../scripts/update-walks-database';
import { WALKS } from '../data/mockData';

const WalksDatabaseUpdater: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [schemaCheck, setSchemaCheck] = useState<any>(null);

  const handleSchemaCheck = async () => {
    setIsUpdating(true);
    const result = await checkDatabaseSchema();
    setSchemaCheck(result);
    setIsUpdating(false);
  };

  const handleUpdateDatabase = async () => {
    if (!window.confirm(
      `Cela va remplacer toutes les balades existantes dans la base de données par les ${WALKS.length} nouvelles balades du brief client.\n\nContinuer ?`
    )) {
      return;
    }

    setIsUpdating(true);
    setUpdateResult(null);

    try {
      // Vérifier le schéma d'abord
      const schemaResult = await checkDatabaseSchema();
      if (!schemaResult.valid) {
        setUpdateResult({
          success: false,
          message: 'Schéma de base de données incompatible',
          needsMigration: true,
          error: schemaResult.error
        });
        return;
      }

      // Vérifier les données
      const verification = verifyWalksData();
      if (!verification.valid) {
        setUpdateResult({
          success: false,
          message: 'Données invalides détectées',
          issues: verification.issues
        });
        return;
      }

      // Mettre à jour la base de données
      const result = await updateWalksInDatabase();
      setUpdateResult(result);

      if (result.success) {
        // Rafraîchir la page après un délai
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setUpdateResult({
        success: false,
        message: 'Erreur inattendue',
        error: error
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      displayWalksSummary();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <MapPin className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Mise à jour des Balades</h3>
          <p className="text-sm text-slate-600">Synchroniser les nouvelles balades du brief client</p>
        </div>
      </div>

      {/* Vérification du schéma */}
      {!schemaCheck && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-600" size={16} />
            <h4 className="font-medium text-yellow-800">Vérification requise</h4>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Avant de mettre à jour les balades, il faut vérifier que la base de données contient les colonnes nécessaires.
          </p>
          <button
            onClick={handleSchemaCheck}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm"
          >
            {isUpdating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Database size={14} />
                Vérifier le schéma
              </>
            )}
          </button>
        </div>
      )}

      {/* Résultat de la vérification du schéma */}
      {schemaCheck && (
        <div className={`border rounded-lg p-4 mb-6 ${
          schemaCheck.valid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {schemaCheck.valid ? (
              <CheckCircle className="text-green-600" size={16} />
            ) : (
              <AlertCircle className="text-red-600" size={16} />
            )}
            <h4 className={`font-medium text-sm ${
              schemaCheck.valid ? 'text-green-800' : 'text-red-800'
            }`}>
              {schemaCheck.valid ? 'Schéma compatible' : 'Migration requise'}
            </h4>
          </div>
          
          {schemaCheck.needsMigration && (
            <div className="text-sm text-red-700">
              <p className="mb-2">Les colonnes nécessaires n'existent pas dans la base de données.</p>
              <p className="font-medium">Action requise :</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Aller dans l'éditeur SQL de Supabase</li>
                <li>Exécuter le script : <code className="bg-red-100 px-1 rounded">migrations/add-walks-columns.sql</code></li>
                <li>Revenir ici et re-vérifier le schéma</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Informations sur les nouvelles balades */}
      {schemaCheck?.valid && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Nouvelles balades à synchroniser :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
              <div>• Circuit "Cervia" (5 km, 1h)</div>
              <div>• La ronde des Piedsentes (7,5 km, 2h)</div>
              <div>• Circuit découverte des églises (22 km, 5h)</div>
              <div>• Circuit des châteaux (28 km, 3h vélo)</div>
              <div>• À la rencontre des moulins (18 km, 4h)</div>
              <div>• Les deux Tongre (10 km, 2h)</div>
              <div>• Ladeuze & Huissignies (10 km, 2h)</div>
              <div>• Vaudignies (5,5 km, 1h30)</div>
              <div>• Grosage (7 km, 1h45)</div>
            </div>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              Total : {WALKS.length} circuits avec liens OpenRunner et boutons de téléchargement
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={16} />
              {showPreview ? 'Masquer' : 'Prévisualiser'} les données
            </button>

            <button
              onClick={handleUpdateDatabase}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isUpdating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <Database size={16} />
                  Mettre à jour la base de données
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Prévisualisation des données */}
      {showPreview && schemaCheck?.valid && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-slate-800 mb-3">Aperçu des balades :</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {WALKS.map((walk, index) => (
              <div key={walk.id} className="bg-white p-3 rounded border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-800">{walk.name}</h5>
                    <p className="text-xs text-slate-600 mt-1">{walk.address}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <span>📏 {walk.distance}</span>
                      <span>⏱️ {walk.duration}</span>
                      <span>🎯 {walk.difficulty}</span>
                    </div>
                  </div>
                  {walk.downloadUrl && (
                    <div className="flex items-center text-xs text-green-600">
                      <Download size={12} className="mr-1" />
                      Lien
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résultat de la mise à jour */}
      {updateResult && (
        <div className={`border rounded-lg p-4 ${
          updateResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {updateResult.success ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <h4 className={`font-medium ${
              updateResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {updateResult.success ? 'Mise à jour réussie !' : 'Erreur lors de la mise à jour'}
            </h4>
          </div>
          
          <p className={`text-sm ${
            updateResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {updateResult.message}
          </p>

          {updateResult.needsMigration && (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-1">Migration requise :</p>
              <p className="text-xs text-yellow-700">
                Exécutez le script <code>migrations/add-walks-columns.sql</code> dans Supabase puis réessayez.
              </p>
            </div>
          )}

          {updateResult.walksCount && (
            <p className="text-xs text-green-600 mt-1">
              {updateResult.walksCount} balades synchronisées
            </p>
          )}

          {updateResult.issues && (
            <div className="mt-3">
              <p className="text-xs font-medium text-red-700 mb-1">Problèmes détectés :</p>
              <ul className="text-xs text-red-600 space-y-1">
                {updateResult.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {updateResult.success && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              La page va se rafraîchir automatiquement...
            </p>
          )}
        </div>
      )}

      {/* Avertissement */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">⚠️ Attention :</p>
            <p>Cette action va remplacer toutes les balades existantes par les nouvelles données du brief client. Assurez-vous d'avoir sauvegardé vos données si nécessaire.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalksDatabaseUpdater;