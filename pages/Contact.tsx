
import React from 'react';
import Hero from '../components/Hero';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div>
      <Hero 
        title="Contactez-nous"
        subtitle="Notre équipe est à votre écoute pour organiser votre visite."
        imageUrl="https://picsum.photos/id/1011/1920/600"
        height="small"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Restons en contact</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Vous avez une question sur un hébergement, une balade ou un événement ? 
                N'hésitez pas à nous contacter ou à venir nous voir directement à l'Office du Tourisme.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <MapPin className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">Adresse</h3>
                <p className="text-slate-600">Rue de Saint-Ghislain, 16<br/>7950 Chièvres</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Phone className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">Téléphone</h3>
                <p className="text-slate-600">068/ 64 59 61</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Mail className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">Email</h3>
                <p className="text-slate-600">contact@otchievres.be</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Clock className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-bold text-slate-800 mb-2">Horaires</h3>
                <p className="text-slate-600 text-sm">
                  Lun - Ven: 9h - 12h / 13h - 16h30<br/>
                  Weekend (Mai-Sept): 10h - 12h
                </p>
              </div>
            </div>

            {/* Fake Map */}
            <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <MapPin size={40} className="mx-auto mb-2 text-slate-400" />
                  <p>Carte Google Maps Intégrée Ici</p>
                </div>
              </div>
              {/* Simulated Map Image */}
              <img src="https://picsum.photos/id/1082/800/400" className="w-full h-full object-cover opacity-50" alt="Carte" />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Envoyer un message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Jean" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nom</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Dupont" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="jean.dupont@example.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sujet</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                  <option>Demande d'information générale</option>
                  <option>Réservation de visite guidée</option>
                  <option>Hébergement</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>

              <button type="button" className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg transform hover:-translate-y-1">
                Envoyer le message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
