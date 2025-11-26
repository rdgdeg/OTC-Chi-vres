import React from 'react';
import Hero from '../components/Hero';
import { Mail, Phone } from 'lucide-react';

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Marie Dubois",
      role: "Directrice",
      email: "marie.dubois@otchievres.be",
      phone: "068/ 64 59 61",
      description: "Passionnée par le patrimoine local, Marie coordonne l'ensemble des activités de l'Office du Tourisme."
    },
    {
      name: "Sophie Martin",
      role: "Responsable Communication",
      email: "sophie.martin@otchievres.be",
      phone: "068/ 64 59 62",
      description: "Sophie gère la communication et les réseaux sociaux pour promouvoir notre belle région."
    },
    {
      name: "Pierre Leroy",
      role: "Guide Touristique",
      email: "pierre.leroy@otchievres.be",
      phone: "068/ 64 59 63",
      description: "Guide expérimenté, Pierre vous fera découvrir les secrets et l'histoire de Chièvres."
    },
    {
      name: "Julie Renard",
      role: "Accueil et Information",
      email: "julie.renard@otchievres.be",
      phone: "068/ 64 59 64",
      description: "Julie vous accueille et vous conseille pour organiser votre séjour dans la région."
    },
    {
      name: "Thomas Bernard",
      role: "Coordinateur Événements",
      email: "thomas.bernard@otchievres.be",
      phone: "068/ 64 59 65",
      description: "Thomas organise les événements culturels et festifs tout au long de l'année."
    },
    {
      name: "Isabelle Petit",
      role: "Chargée de Projets",
      email: "isabelle.petit@otchievres.be",
      phone: "068/ 64 59 66",
      description: "Isabelle développe de nouveaux projets touristiques pour valoriser notre territoire."
    }
  ];

  return (
    <div>
      <Hero 
        title="Notre Équipe"
        subtitle="Des passionnés à votre service pour vous faire découvrir Chièvres"
        imageUrl="https://picsum.photos/id/1015/1920/600"
        height="small"
      />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4 sm:mb-6">
            Une équipe dévouée et passionnée
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            L'équipe de l'Office du Tourisme de Chièvres est composée de professionnels passionnés 
            par leur région. Nous sommes là pour vous accueillir, vous conseiller et vous faire 
            découvrir les richesses de notre territoire.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Photo */}
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img 
                  src="https://picsum.photos/id/1005/400/400"
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
                  {member.description}
                </p>

                {/* Contact */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <a 
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm group touch-manipulation"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="break-all">{member.email}</span>
                  </a>
                  <a 
                    href={`tel:${member.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm group touch-manipulation"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{member.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 bg-slate-50 rounded-2xl p-6 sm:p-10 text-center border border-slate-100">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 mb-3 sm:mb-4">
            Besoin d'aide pour organiser votre visite ?
          </h3>
          <p className="text-slate-600 text-base sm:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous aider à préparer votre séjour à Chièvres.
          </p>
          <a 
            href="#/contact"
            className="inline-block bg-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-slate-800 active:scale-98 transition-all shadow-lg touch-manipulation text-sm sm:text-base"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;
