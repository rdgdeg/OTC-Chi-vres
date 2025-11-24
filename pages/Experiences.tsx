
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

      <div className="container mx-auto px-4 py-16">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === cat.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-12">
          {filteredExperiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow">
              <div className="md:w-2/5 relative">
                <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover min-h-[300px]" />
                <div className="absolute top-4 left-4 bg-secondary text-slate-900 text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                  {exp.category}
                </div>
              </div>
              
              <div className="md:w-3/5 p-8 flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">{exp.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6 flex-grow">
                  {exp.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {exp.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-slate-600 text-sm">
                      <CheckCircle size={16} className="text-green-500 mr-2 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-6 mt-auto gap-4">
                  <div className="flex space-x-6 text-slate-600">
                    <div className="flex items-center">
                      <Clock size={20} className="text-secondary mr-2" />
                      <span className="font-semibold">{exp.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Euro size={20} className="text-secondary mr-2" />
                      <span className="font-semibold">{exp.price}</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary transition-colors">
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