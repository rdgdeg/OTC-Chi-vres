
import React from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Map, Compass, Utensils, Landmark } from 'lucide-react';
import { EVENTS } from '../data/mockData';
import { useData } from '../contexts/DataContext';

const Home: React.FC = () => {
  // Use CMS Data for text content
  const { pageContent, events } = useData();
  const content = pageContent['home'] || {};

  return (
    <div>
      <Hero 
        title={content.heroTitle || "Bienvenue à Chièvres"}
        subtitle={content.heroSubtitle || "La Cité des Aviateurs vous ouvre ses portes."}
        imageUrl={content.heroImage || "https://picsum.photos/id/1047/1920/1080"}
        height="large"
      />

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
               <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full z-0"></div>
               <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
              <img 
                src={content.extraImage || "https://picsum.photos/id/1028/800/600"}
                alt="Chièvres Introduction" 
                className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                  <h3 className="text-secondary font-bold uppercase tracking-widest text-sm mb-2">Découverte</h3>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 leading-tight">
                    {content.introTitle || "Chièvres, Terre d'Histoire"}
                  </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg text-justify whitespace-pre-wrap">
                {content.introText || "Bienvenue sur le site de l'Office du Tourisme."}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/musees" className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center">
                  Visiter le patrimoine <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/balades" className="px-8 py-4 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center">
                   Voir les balades <Compass size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">Envie de...</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link to="/musees" className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src="https://picsum.photos/id/1035/800/600" alt="Culture" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full z-20 shadow-sm">
                    <Landmark size={24} className="text-primary" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Culture & Patrimoine</h3>
                <p className="text-slate-600 mb-4">Explorez nos musées, nos églises et nos monuments historiques classés.</p>
                <span className="text-secondary font-bold text-sm flex items-center uppercase tracking-wide">En savoir plus <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/experiences" className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="h-64 overflow-hidden relative">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src="https://picsum.photos/id/1060/800/600" alt="Gastronomie" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full z-20 shadow-sm">
                    <Utensils size={24} className="text-primary" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Vivre une expérience</h3>
                <p className="text-slate-600 mb-4">Activités insolites, jeux de piste pour enfants et défis teambuilding.</p>
                <span className="text-secondary font-bold text-sm flex items-center uppercase tracking-wide">En savoir plus <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/balades" className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="h-64 overflow-hidden relative">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src="https://picsum.photos/id/1018/800/600" alt="Nature" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full z-20 shadow-sm">
                    <Compass size={24} className="text-primary" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Nature & Balades</h3>
                <p className="text-slate-600 mb-4">Des kilomètres de sentiers balisés à travers la campagne et les villages.</p>
                <span className="text-secondary font-bold text-sm flex items-center uppercase tracking-wide">En savoir plus <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Agenda Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">À l'agenda</h2>
              <p className="text-slate-500">Les événements à ne pas manquer</p>
            </div>
            <Link to="/agenda" className="hidden md:flex items-center text-primary font-bold hover:text-secondary transition-colors">
              Tout l'agenda <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col">
                {/* Image de l'événement */}
                {event.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-primary text-white text-center px-3 py-1">
                        <span className="text-xs font-bold uppercase">{event.month}</span>
                      </div>
                      <div className="bg-white text-slate-800 text-center px-3 py-2">
                        <span className="text-2xl font-bold">{event.day}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-secondary mb-3 bg-secondary/10 w-fit px-3 py-1 rounded-full">
                    <Calendar size={14} className="mr-2" />
                    <span className="text-xs font-bold uppercase">{event.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <span className="text-xs text-slate-400 font-medium">{event.date}</span>
                      <span className="text-xs text-primary font-bold uppercase">En savoir plus</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
