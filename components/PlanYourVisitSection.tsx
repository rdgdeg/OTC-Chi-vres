import React from 'react';
import { Link } from 'react-router-dom';
import { BedIcon as Bed, Utensils, Calendar, ArrowRight, MapPin } from 'lucide-react';

const PlanYourVisitSection: React.FC = () => {
  const visitOptions = [
    {
      icon: Bed,
      title: 'Où dormir ?',
      description: 'Trouvez l\'hébergement parfait pour votre séjour',
      path: '/hebergements',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: Utensils,
      title: 'Boire et Manger',
      description: 'Découvrez nos restaurants et cafés locaux',
      path: '/restaurants',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: Calendar,
      title: 'Agenda',
      description: 'Ne manquez aucun événement à Chièvres',
      path: '/agenda',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <MapPin size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-4">
            Planifiez votre visite
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour organiser votre séjour à Chièvres
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {visitOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={index}
                to={option.path}
                className="group bg-white border-2 border-slate-100 rounded-2xl p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} ${option.hoverColor} rounded-full mb-6 transition-colors group-hover:scale-110 transform duration-300`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {option.description}
                </p>
                
                <div className="flex items-center justify-center text-primary font-semibold group-hover:text-secondary transition-colors">
                  <span className="mr-2">Découvrir</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlanYourVisitSection;