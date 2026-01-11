import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, FileText, 
  ArrowRight, Mail, ExternalLink, Trophy, 
  Info, Heart, Play, ChevronLeft, ChevronRight, Coffee, Building
} from 'lucide-react';

const CrossageDetail: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Images du diaporama
  const crossageImages = [
    {
      url: 'https://picsum.photos/id/1070/1200/600',
      caption: 'Le crossage en action dans les rues de Chièvres'
    },
    {
      url: 'https://picsum.photos/id/1071/1200/600',
      caption: 'Ambiance conviviale et tradition séculaire'
    },
    {
      url: 'https://picsum.photos/id/1072/1200/600',
      caption: 'Participants de tous âges unis par la passion'
    },
    {
      url: 'https://picsum.photos/id/1073/1200/600',
      caption: 'Le folklore chiévrois à son apogée'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % crossageImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + crossageImages.length) % crossageImages.length);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setNewsletterStatus('loading');
    // Simulation d'inscription
    setTimeout(() => {
      setNewsletterStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Diaporama */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {crossageImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
            </div>
          ))}
        </div>

        {/* Navigation du diaporama */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicateurs */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {crossageImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-secondary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Contenu Hero */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Crossage al' tonne
            </h1>
            <p className="text-xl sm:text-2xl mb-8 leading-relaxed">
              Vivez le folklore chiévrois ! Découvrez un jeu médiéval de rue pas comme les autres… 
              Embarquez amis, crosse et cholette, et plongez dans l'ambiance unique du crossage al' tonne !
            </p>
            <a
              href="#inscription"
              className="inline-flex items-center px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Je m'inscris / Je participe
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Section "Pourquoi participer ?" */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-6">
                Pourquoi participer ?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg leading-relaxed text-slate-700 mb-6">
                  Le crossage, c'est bien plus qu'un jeu : c'est une tradition portée par les Chièvrois 
                  depuis des générations. Ambiance conviviale garantie, passion partagée, et une immersion 
                  dans le folklore local que vous ne trouverez nulle part ailleurs.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Tradition</h3>
                    <p className="text-sm text-slate-600">Folklore séculaire unique</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-slate-900" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Convivialité</h3>
                    <p className="text-sm text-slate-600">Ambiance chaleureuse</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Passion</h3>
                    <p className="text-sm text-slate-600">Expérience inoubliable</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://picsum.photos/id/1074/400/300"
                  alt="Tradition du crossage"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://picsum.photos/id/1075/400/300"
                  alt="Ambiance conviviale"
                  className="rounded-lg shadow-lg mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Infos Pratiques */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-4">
              Infos pratiques
            </h2>
            <p className="text-lg text-slate-600">Tout ce que vous devez savoir pour participer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Quand */}
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Quand</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Mercredi 18 février</strong><br />Chièvres & Vaudignies</p>
                <p><strong>Samedi 21 février</strong><br />Grosage</p>
              </div>
            </div>

            {/* Où */}
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Où</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Rues de Chièvres, Vaudignies & Grosage</p>
                <p className="text-primary font-semibold">(plans disponibles)</p>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Horaires</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Lancement :</strong> 12h00</p>
                <p><strong>Fin :</strong> Coucher du soleil<br />(+/- 18h00)</p>
              </div>
            </div>

            {/* Inscription */}
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Inscription</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Tarif :</strong> 8€ / 10€</p>
                <p>Formulaire en ligne</p>
                <p>Paiement liquide</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-lg">
              Voir le règlement
            </button>
            <button className="px-8 py-4 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-slate-50 transition-all">
              Règles du jeu
            </button>
          </div>
        </div>
      </section>

      {/* Programme des festivités */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-4">
              Programme des festivités
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Coffee size={24} className="text-primary mr-3" />
                  Buvettes & Animations
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 shrink-0"></span>
                    Gobelets réutilisables (caution 1€)
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 shrink-0"></span>
                    Animations tout au long de la journée
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 shrink-0"></span>
                    Ambiance musicale traditionnelle
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 shrink-0"></span>
                    Restauration locale
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Trophy size={24} className="text-secondary mr-3" />
                  Soumonces du Crossage
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-slate-800">Tournoi d'entraînement</h4>
                    <p className="text-slate-600 text-sm">Perfectionnez votre technique avant le grand jour</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-bold text-slate-800">Élection Roi & Reine 2026</h4>
                    <p className="text-slate-600 text-sm">Compétition adultes pour le titre prestigieux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Crossage */}
      <section id="inscription" className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                <Mail size={32} className="text-slate-900" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                Restez informés
              </h2>
              <p className="text-lg text-slate-200 leading-relaxed">
                Ne ratez rien de l'événement : inscrivez-vous à la newsletter Crossage pour recevoir 
                toutes les infos, le jour J et les prochaines éditions.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-6 py-4 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-secondary/30"
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'S\'inscrire'
                  )}
                </button>
              </div>
              
              {newsletterStatus === 'success' && (
                <p className="mt-4 text-secondary font-semibold">
                  Merci ! Vous recevrez toutes les infos du Crossage.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* À découvrir aussi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              À découvrir aussi
            </h2>
            <p className="text-lg text-slate-600">
              Prolongez votre découverte de Chièvres
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              to="/"
              className="group bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                <MapPin size={32} className="text-white group-hover:text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                Découvrir Chièvres
              </h3>
              <p className="text-slate-600 text-sm">
                Explorez la Cité des Aviateurs
              </p>
            </Link>

            <Link
              to="/musees"
              className="group bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                <Building size={32} className="text-white group-hover:text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                Patrimoine
              </h3>
              <p className="text-slate-600 text-sm">
                Musées et monuments historiques
              </p>
            </Link>

            <Link
              to="/agenda"
              className="group bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                <Calendar size={32} className="text-white group-hover:text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                Agenda
              </h3>
              <p className="text-slate-600 text-sm">
                Tous les événements à venir
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrossageDetail;