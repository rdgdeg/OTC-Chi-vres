import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Bed, ArrowRight, Clock, Users } from 'lucide-react';

const DiscoverSection: React.FC = () => {
  const discoverItems = [
    {
      id: 'culture',
      title: 'Culture & Patrimoine',
      subtitle: 'Plongez dans l\'histoire',
      description: 'Découvrez nos musées, monuments historiques et sites emblématiques qui racontent l\'histoire fascinante de Chièvres.',
      image: 'https://picsum.photos/id/1041/600/400',
      icon: Camera,
      link: '/musees',
      highlights: ['Église Saint-Martin (XIIe siècle)', 'Musée de la Vie Rurale', 'Château de Ladeuze'],
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'crossage',
      title: 'Le Crossage',
      subtitle: 'Tradition unique',
      description: 'Vivez une expérience authentique avec le crossage al\'tonne, tradition folklorique emblématique de Chièvres.',
      image: 'https://picsum.photos/id/1042/600/400',
      icon: Users,
      link: '/crossage',
      highlights: ['Expérience interactive', 'Tradition centenaire', 'Animations toute l\'année'],
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'accommodation',
      title: 'Où Dormir',
      subtitle: 'Séjournez à Chièvres',
      description: 'Trouvez l\'hébergement parfait pour votre séjour : gîtes authentiques, chambres d\'hôtes chaleureuses et plus encore.',
      image: 'https://picsum.photos/id/1080/600/400',
      icon: Bed,
      link: '/hebergements',
      highlights: ['Gîtes de charme', 'Chambres d\'hôtes', 'Hébergements insolites'],
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-800 mb-6">
            Découvrir Chièvres
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Trois expériences incontournables pour découvrir l'âme de notre cité des aviateurs
          </p>
        </div>

        {/* Grille des découvertes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {discoverItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Image de fond */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80`}></div>
                  
                  {/* Icône */}
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Badge numéro */}
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Points forts */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {item.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bouton d'action */}
                  <Link
                    to={item.link}
                    className="inline-flex items-center justify-between w-full px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-primary transition-all group-hover:bg-primary"
                  >
                    <span className="font-semibold">Découvrir</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call-to-action global */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-slate-700 font-medium">
              Planifiez votre visite complète
            </span>
            <Link
              to="/agenda"
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors font-semibold"
            >
              Voir l'agenda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;