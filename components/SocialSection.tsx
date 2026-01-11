import React from 'react';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';

const SocialSection: React.FC = () => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-4">
            Suivez-nous !
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Pour ne rien manquer de nos actualités, événements et nouveautés, 
            suivez-nous sur Facebook !
          </p>
          
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com/otchievres"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-[#1877F2] text-white px-8 py-4 rounded-lg hover:bg-[#166FE5] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Facebook size={24} />
              <span className="font-semibold">Facebook</span>
              <ExternalLink size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <a
              href="https://instagram.com/otchievres"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Instagram size={24} />
              <span className="font-semibold">Instagram</span>
              <ExternalLink size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          
          <p className="text-xs text-slate-500 mt-6">
            Rejoignez notre communauté et découvrez Chièvres autrement !
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;