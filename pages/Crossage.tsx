
import React from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { Info, Beer, Calendar, MapPin, Download, AlertTriangle, Trophy, Mail, CheckCircle, ArrowRight, User } from 'lucide-react';

const Crossage: React.FC = () => {
  const { pageContent } = useData();
  const content = pageContent['crossage'] || {};

  return (
    <div>
      <Hero 
        title={content.heroTitle || "CROSSAGE 2025"}
        subtitle={content.heroSubtitle || "Le folklore chiévrois par excellence."}
        imageUrl={content.heroImage || "https://picsum.photos/id/1058/1920/600"}
        height="medium"
      />
      
      {/* Intro Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-3/5">
                <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">{content.introTitle}</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-6 whitespace-pre-wrap text-justify border-l-4 border-secondary pl-6">
                    {content.introText}
                </p>
            </div>
            <div className="lg:w-2/5">
                <div className="grid grid-cols-2 gap-4 h-[400px]">
                    <img src="https://picsum.photos/id/1058/400/600" alt="Crossage action" className="rounded-xl shadow-lg w-full h-full object-cover transform translate-y-8" />
                    <img src="https://picsum.photos/id/1069/400/600" alt="Ambiance Crossage" className="rounded-xl shadow-lg w-full h-full object-cover" />
                </div>
            </div>
        </div>
      </section>

      {/* Banner / Diaporama Hook */}
      <section className="bg-slate-900 py-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1056/1920/800')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 container mx-auto px-4">
              <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6">Vivez le folklore chiévrois !</h3>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Découvrez un jeu médiéval de rue pas comme les autres… Embarquez amis, crosse et cholette, et plongez dans l’ambiance unique du crossage al’ tonne !
              </p>
              <a href="#inscriptions" className="inline-flex items-center bg-secondary text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-white transition-colors">
                 Je participe <ArrowRight size={20} className="ml-2" />
              </a>
          </div>
      </section>

      {/* Practical Info Grid */}
      <section className="py-20 bg-slate-50" id="infos">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">Infos Pratiques</h2>
                  <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Quand */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar size={32} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Quand ?</h3>
                      <p className="text-slate-600 text-sm">
                          <strong>Mercredi 5 Mars</strong><br/>Chièvres & Vaudignies<br/><br/>
                          <strong>Samedi 8 Mars</strong><br/>Grosage
                      </p>
                  </div>

                  {/* Horaire */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Info size={32} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Horaire</h3>
                      <p className="text-slate-600 text-sm">
                          Coup d'envoi dès <strong>12h00</strong>.<br/>
                          Fin dans les rues au coucher du soleil (≈ vers 18h).
                      </p>
                  </div>

                  {/* Où */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin size={32} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Lieu</h3>
                      <p className="text-slate-600 text-sm">
                          Dans les rues du centre-ville, sécurisées pour l'occasion.<br/>
                          <a href="#plans" className="text-secondary font-bold underline mt-2 block">Voir les plans</a>
                      </p>
                  </div>

                  {/* Assurance */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle size={32} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Sécurité</h3>
                      <p className="text-slate-600 text-sm">
                          <strong>Assurance Obligatoire</strong><br/>
                          Pré-vente : 8 €<br/>
                          Jour J : 10 €
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Inscriptions & Details */}
      <section className="py-16 bg-white" id="inscriptions">
         <div className="container mx-auto px-4">
             <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg">
                 <div className="md:w-1/2 p-8 lg:p-12">
                     <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Inscriptions & Assurances</h3>
                     <ul className="space-y-4 text-slate-600 mb-8">
                         <li className="flex items-start">
                             <CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={18} />
                             <span>Les inscriptions se font <strong>uniquement</strong> à l'Office du Tourisme (Maison de Cité).</span>
                         </li>
                         <li className="flex items-start">
                             <CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={18} />
                             <span>Dès le <strong>Lundi 27/01</strong> : lancement de la vente.</span>
                         </li>
                         <li className="flex items-start">
                             <CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={18} />
                             <span><strong>Le 01/03 (10h-14h)</strong> : vente spéciale à l'Hôtel de Ville.</span>
                         </li>
                         <li className="flex items-start">
                             <CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={18} />
                             <span>Paiement en <strong>liquide</strong> sur place uniquement.</span>
                         </li>
                     </ul>

                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                         <p className="text-sm text-yellow-800 font-bold">
                             ⚠️ Important : Badges personnalisés obligatoires à porter le jour J pour prouver l'assurance.
                             Si participation aux 2 journées (Chièvres + Grosage) → 2 assurances requises.
                         </p>
                     </div>
                 </div>
                 <div className="md:w-1/2 bg-primary text-white p-8 lg:p-12 flex flex-col justify-center">
                     <h3 className="text-2xl font-serif font-bold mb-6">Documents Utiles</h3>
                     <div className="space-y-4">
                        <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 px-6 py-4 rounded-lg transition-colors border border-white/20">
                            <span className="font-bold flex items-center"><Download size={20} className="mr-3" /> Fiche Assurances (Équipe)</span>
                            <span className="text-xs uppercase bg-secondary text-slate-900 px-2 py-1 rounded">PDF</span>
                        </button>
                        <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 px-6 py-4 rounded-lg transition-colors border border-white/20">
                            <span className="font-bold flex items-center"><Download size={20} className="mr-3" /> Règlement du Jeu</span>
                            <span className="text-xs uppercase bg-secondary text-slate-900 px-2 py-1 rounded">PDF</span>
                        </button>
                        <div id="plans" className="pt-4 grid grid-cols-3 gap-2">
                             <button className="text-xs border border-white/30 rounded py-2 hover:bg-white hover:text-primary transition-colors">Plan Chièvres</button>
                             <button className="text-xs border border-white/30 rounded py-2 hover:bg-white hover:text-primary transition-colors">Plan Vaudignies</button>
                             <button className="text-xs border border-white/30 rounded py-2 hover:bg-white hover:text-primary transition-colors">Plan Grosage</button>
                        </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Soumonces Section */}
      <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
             <div className="flex flex-col lg:flex-row items-center gap-16">
                 <div className="lg:w-1/2 order-2 lg:order-1">
                     <img src="https://picsum.photos/id/1057/800/600" alt="Soumonces" className="rounded-2xl shadow-2xl border-4 border-slate-800" />
                 </div>
                 <div className="lg:w-1/2 order-1 lg:order-2">
                     <div className="flex items-center space-x-2 text-secondary font-bold uppercase tracking-widest mb-2">
                         <Trophy size={20} />
                         <span>Événement Spécial</span>
                     </div>
                     <h2 className="text-4xl font-serif font-bold mb-6">{content.extraTitle}</h2>
                     <div className="space-y-6 text-slate-300 text-lg">
                         <p>
                             {content.extraText}
                         </p>
                         <ul className="space-y-3 text-sm">
                             <li className="flex items-center"><Calendar className="mr-3 text-secondary" /> Samedi 22 Février 2025</li>
                             <li className="flex items-center"><MapPin className="mr-3 text-secondary" /> Étang de Hove (rue de la Carrière)</li>
                             <li className="flex items-center"><Info className="mr-3 text-secondary" /> Inscription sur place (11h-14h) : 10€ (cholette incluse)</li>
                         </ul>
                         <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                             <p className="italic text-sm">
                                 "Le but : aller vers les différentes tonnes en le moins de coups possible. Pas de décholage !
                                 À la clé : un chèque de 100€ pour le Roi ou la Reine !"
                             </p>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </section>

      {/* Eco & Buvettes */}
      <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full text-green-700 mb-6">
                  <Beer size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">Buvettes & Durabilité</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                  Pour améliorer la propreté de nos rues et respecter l'environnement, <strong>30 000 gobelets réutilisables</strong> seront mis en circulation.
                  <br/><br/>
                  Le principe est simple : <strong>1 gobelet = 1 utilisation</strong>.<br/>
                  Un système de caution de <strong>1 €</strong> sera d'application. Merci de jouer le jeu !
              </p>
          </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
              <Mail size={48} className="mx-auto mb-6 text-secondary" />
              <h2 className="text-3xl font-serif font-bold mb-4">Restez informés</h2>
              <p className="text-slate-200 mb-8">
                  Ne ratez rien de l’événement : inscrivez-vous à la newsletter Crossage pour recevoir les dernières infos, le plan des rues et les résultats des Soumonces.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className="flex-grow px-6 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <button type="button" className="bg-secondary text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors">
                      S'inscrire
                  </button>
              </form>
          </div>
      </section>

      {/* Footer Contact Specific */}
      <section className="py-12 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 text-center">
              <p className="text-slate-500 text-sm mb-2">Une question ?</p>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Office du Tourisme de Chièvres</h3>
              <div className="flex flex-col md:flex-row justify-center gap-8 text-slate-600 text-sm">
                  <span className="flex items-center justify-center"><MapPin size={16} className="mr-2 text-primary"/> Rue de Saint-Ghislain, 16, 7950 Chièvres</span>
                  <span className="flex items-center justify-center"><User size={16} className="mr-2 text-primary"/> 068/ 64 59 61</span>
                  <span className="flex items-center justify-center"><Mail size={16} className="mr-2 text-primary"/> contact@otchievres.be</span>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Crossage;
