import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Utensils, Mountain, 
  Clock, Phone, Mail, ExternalLink 
} from 'lucide-react';

const PlanVisitSection: React.FC = () => {
  const quickLinks = [
    {
      icon: Calendar,
      title: 'Agenda',
      description: 'Événements & festivités',
      link: '/agenda',
      color: 'bg-blue-500'
    },
    {
      icon: Utensils,
      title: 'Restaurants',
      description: 'Saveurs locales',
      link: '/restaurants',
      color: 'bg-orange-500'
    },
    {
      icon: Mountain,
      title: 'Balades',
      description: 'Circuits & randonnées',
      link: '/balades',
      color: 'bg-green-500'
    }
  ];

  const practicalInfo = [
    {
      icon: Clock,
      title: 'Horaires Office',
      info: 'Lun-Ven: 9h-17h | Sam: 9h-12h'
    },
    {
      icon: Phone,
      title: 'Contact',
      info: '+32 68 64 14 00'
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'info@chievres-tourisme.be'
    }
  ];

  return (
    <section className="py-16 bg-primary text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -translate-x-32 translate-y-32"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne gauche - Liens rapides */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Planifiez votre visite
            </h2>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              Tout ce dont vous avez besoin pour découvrir Chièvres en un clin d'œil
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.link}
                    className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 text-center"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-200">{item.description}</p>
                    <ExternalLink className="h-4 w-4 text-slate-300 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>

            {/* Bouton principal */}
            <div className="text-center sm:text-left">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Colonne droite - Informations pratiques */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-secondary" />
              Infos pratiques
            </h3>

            <div className="space-y-6">
              {practicalInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-200 text-sm">{item.info}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Localisation */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Office de Tourisme</h4>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Grand-Place 1<br />
                    7950 Chièvres, Belgique
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-secondary hover:text-yellow-400 transition-colors text-sm mt-2 font-medium"
                  >
                    Voir sur la carte
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanVisitSection;