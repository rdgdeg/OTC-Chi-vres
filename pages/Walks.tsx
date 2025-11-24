
import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useData } from '../contexts/DataContext';
import { Info } from 'lucide-react';

const Walks: React.FC = () => {
  const { walks, pageContent } = useData();
  const content = pageContent['walks'] || {};

  return (
    <div>
      <Hero 
        title={content.heroTitle || "Balades & Nature"}
        subtitle={content.heroSubtitle || "Partez à la découverte de nos sentiers."}
        imageUrl={content.heroImage || "https://picsum.photos/id/1036/1920/600"}
        height="medium"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-3/4">
                <div className="mb-10">
                    <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">{content.introTitle || "Nos itinéraires balisés"}</h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        {content.introText || "Découvrez nos sentiers..."}
                    </p>
                    <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg flex items-start">
                        <Info className="text-primary mr-3 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-slate-700">
                            Les cartes détaillées (format GPX et papier) sont disponibles gratuitement à l'Office du Tourisme (Rue de Saint-Ghislain, 16).
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {walks.map((place) => (
                    <Card key={place.id} place={place} />
                ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                    <h3 className="font-serif font-bold text-xl mb-4 text-slate-800">Infos Pratiques</h3>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="pb-4 border-b border-slate-100">
                            <strong className="block text-slate-800 mb-1">Code du promeneur</strong>
                            Respectez la nature, ne jetez pas vos déchets et tenez votre chien en laisse.
                        </li>
                        <li className="pb-4 border-b border-slate-100">
                            <strong className="block text-slate-800 mb-1">Période de chasse</strong>
                            D'octobre à janvier, certains bois peuvent être inaccessibles. Renseignez-vous à l'office.
                        </li>
                        <li>
                            <strong className="block text-slate-800 mb-1">Secours</strong>
                            En cas d'urgence, composez le 112.
                        </li>
                    </ul>
                </div>
                
                <div className="bg-primary text-white p-6 rounded-xl shadow-md">
                    <h3 className="font-serif font-bold text-xl mb-2">Besoin d'un guide ?</h3>
                    <p className="text-slate-200 text-sm mb-4">
                        Nos guides nature peuvent accompagner votre groupe pour découvrir la faune et la flore locale.
                    </p>
                    <button className="w-full py-2 bg-secondary text-slate-900 font-bold rounded hover:bg-white transition-colors text-sm">
                        Contactez-nous
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Walks;
