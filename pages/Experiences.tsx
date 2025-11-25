
import React, { useState } from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { Users, Clock, Euro, CheckCircle } from 'lucide-react';

const Experiences: React.FC = () => {
  const { experiences } = useData();
  const [filter, setFilter] = useState<'all' | 'adulte' | 'enfant' | 'teambuilding' | 'famille'>('all');

  const filteredExperiences = filter === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === filter);

  const categories = [
    { id: 'all', label: 'Tout voir' },
    { id: 'famille', label: 'Famille' },
    { id: 'enfant', label: 'Enfants' },
    { id: 'adulte', label: 'Adultes' },
    { id: 'teambuilding', label: 'Teambuilding' },
  ];

  return (
    <div>
      <Hero 
        title="Expériences à Vivre"
        subtitle="Créez des souvenirs inoubliables avec nos activités thématiques pour tous les âges."
        imageUrl="https://picsum.photos/id/1068/1920/600"
        height="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all text-xs sm:text-sm md:text-base touch-manipulation ${
                filter === cat.id 
                  ? 'bg-primary text-white shadow-md scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          {filteredExperiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow touch-manipulation">
              <div className="md:w-2/5 relative">
                <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover min-h-[200px] sm:min-h-[250px] md:min-h-[300px]" />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-secondary text-slate-900 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded uppercase tracking-widest">
                  {exp.category}
                </div>
              </div>
              
              <div className="md:w-3/5 p-5 sm:p-6 md:p-8 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 mb-3 sm:mb-4">{exp.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 flex-grow">
                  {exp.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                  {exp.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-slate-600 text-xs sm:text-sm">
                      <CheckCircle size={14} className="text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-4 sm:pt-6 mt-auto gap-3 sm:gap-4">
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-slate-600 text-sm sm:text-base">
                    <div className="flex items-center">
                      <Clock size={18} className="text-secondary mr-2" />
                      <span className="font-semibold">{exp.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Euro size={18} className="text-secondary mr-2" />
                      <span className="font-semibold">{exp.price}</span>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto bg-slate-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-primary active:scale-95 transition-all touch-manipulation text-sm sm:text-base">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences;