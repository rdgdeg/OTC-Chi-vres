
import React from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { FileText, Download } from 'lucide-react';

const Bulletin: React.FC = () => {
  const { pageContent } = useData();
  const content = pageContent['bulletin'] || {};

  return (
    <div>
      <Hero 
        title={content.heroTitle || "Bulletin Communal"}
        subtitle={content.heroSubtitle || "Informations officielles"}
        imageUrl={content.heroImage || "https://picsum.photos/id/1016/1920/600"}
        height="small"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">{content.introTitle}</h2>
                <p className="text-slate-600">{content.introText}</p>
            </div>

            {/* Simulated PDF Viewer Area */}
            <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl h-[600px] relative flex flex-col items-center justify-center text-white mb-12">
                <FileText size={64} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Chièvres Info - Édition du Mois</h3>
                <p className="text-slate-400 mb-8">Visualisation du PDF</p>
                <button className="bg-secondary text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-white transition-colors flex items-center">
                    <Download size={20} className="mr-2" /> Télécharger le PDF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white flex items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-primary mr-4 shrink-0">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Bulletin N°{100-i}</h4>
                            <span className="text-xs text-slate-500">Archives mois précédents</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Bulletin;
