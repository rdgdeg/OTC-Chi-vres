import React from 'react';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 size={24} />
          Tableau de Bord Analytique
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Eye size={32} className="mx-auto text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-800">12,543</h3>
            <p className="text-slate-600">Vues ce mois</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users size={32} className="mx-auto text-green-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-800">2,847</h3>
            <p className="text-slate-600">Visiteurs uniques</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp size={32} className="mx-auto text-purple-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-800">+15%</h3>
            <p className="text-slate-600">Croissance</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-center">
            Intégration Google Analytics et autres métriques à venir
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;