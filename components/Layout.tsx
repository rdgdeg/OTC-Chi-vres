
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, MapPin, Phone, ExternalLink, ShoppingBag, Lock, ChevronDown, Settings } from 'lucide-react';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { 
    label: 'Découvrir', 
    children: [
      { label: 'Culture & Patrimoine', path: '/musees' },
      { label: 'Nature & Balades', path: '/balades' },
      { label: 'Le Crossage', path: '/crossage/detail' },
    ]
  },
  { 
    label: 'Séjourner', 
    children: [
      { label: 'Où manger ? (Restaurants)', path: '/restaurants?type=restaurant' },
      { label: 'Se désaltérer (Cafés)', path: '/restaurants?type=cafe' },
      { label: 'Terroir & Producteurs', path: '/restaurants?type=producer' },
      { label: 'Où dormir ?', path: '/hebergements' },
    ]
  },
  { 
    label: 'Vivre & Bouger', 
    children: [
      { label: 'Expériences', path: '/experiences' },
      { label: 'Agenda', path: '/agenda' },
      // { label: 'Nos Commerçants', path: '/commercants' }, // Désactivé temporairement
    ]
  },
  { 
    label: 'Pratique', 
    children: [
      { label: 'Bulletin Communal', path: '/bulletin' },
      { label: 'Blog / Actualités', path: '/blog' },
      { label: 'Notre Équipe', path: '/equipe' },
      { label: 'Contact', path: '/contact' },
    ]
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (label: string) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header - Sticky et Responsive */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl sm:text-2xl group-hover:bg-secondary transition-colors shadow-sm shrink-0">
                V
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg md:text-xl font-serif font-bold text-slate-800 leading-none tracking-tight truncate">VisitChièvres<span className="text-secondary">.be</span></span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">Office du Tourisme</span>
              </div>
            </Link>

            {/* Desktop Navigation - Visible à partir de lg */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative group">
                   <button 
                     className="flex items-center text-sm font-bold uppercase tracking-tight text-slate-600 hover:text-primary py-2 px-3 transition-colors"
                   >
                     {item.label}
                     <ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform duration-200" />
                   </button>
                   
                   {/* Dropdown Menu */}
                   <div className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                      <div className="py-2">
                        {item.children?.map(subItem => (
                           <Link 
                             key={subItem.path} 
                             to={subItem.path!} 
                             className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary hover:pl-5 transition-all"
                           >
                             {subItem.label}
                           </Link>
                        ))}
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Boutique désactivée temporairement */}
              {/* <Link to="/boutique" className="text-primary hover:text-secondary transition-colors flex items-center border-l pl-4 ml-2 border-slate-200 font-bold uppercase text-sm">
                 <ShoppingBag size={18} className="mr-2" />
                 <span>Boutique</span>
              </Link> */}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-primary focus:outline-none active:scale-95 transition-transform touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] z-40 overflow-y-auto overscroll-contain">
            <div className="flex flex-col py-4 px-4 space-y-1 pb-safe">
              <Link
                to="/"
                className="px-4 py-3 text-base sm:text-lg font-bold text-slate-800 border-b border-slate-100 active:bg-slate-50 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>

              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-slate-100">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="w-full flex justify-between items-center px-4 py-3 text-base sm:text-lg font-medium text-slate-600 active:bg-slate-50 touch-manipulation"
                  >
                    {item.label}
                    <ChevronDown size={20} className={`transform transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === item.label && (
                    <div className="bg-slate-50 px-2 py-2 space-y-1">
                      {item.children?.map(subItem => (
                        <Link
                          key={subItem.path}
                          to={subItem.path!}
                          className="block px-4 py-3 text-sm sm:text-base text-slate-500 hover:text-primary rounded-lg active:bg-slate-100 touch-manipulation"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                  to="/boutique"
                  className="px-4 py-3 text-base sm:text-lg font-medium text-slate-600 hover:text-primary flex items-center border-b border-slate-100 active:bg-slate-50 touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag size={20} className="mr-2"/> Boutique
              </Link>
              
              <div className="pt-6 px-4">
                 <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center text-slate-400 hover:text-secondary text-sm">
                     <Lock size={14} className="mr-2"/> Espace Administration
                 </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-12 sm:pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
            {/* Brand */}
            <div>
               <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-slate-900 font-serif font-bold text-lg">
                    V
                  </div>
                  <span className="text-xl font-serif font-bold text-white leading-none">VisitChièvres<span className="text-secondary">.be</span></span>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 Découvrez la Cité des Aviateurs, son riche passé médiéval, son folklore unique et la chaleur de ses habitants.
               </p>
               <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-slate-900 transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-slate-900 transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-2">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 group">
                  <MapPin size={20} className="text-secondary shrink-0 mt-1 group-hover:text-white transition-colors" />
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Rue de Saint-Ghislain, 16<br/>7950 Chièvres, Belgique</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <Phone size={20} className="text-secondary shrink-0 group-hover:text-white transition-colors" />
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">068/ 64 59 61</span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <Mail size={20} className="text-secondary shrink-0 group-hover:text-white transition-colors" />
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">contact@otchievres.be</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-2">Découvrir</h3>
              <ul className="space-y-3">
                <li><Link to="/musees" className="text-slate-300 text-sm hover:text-secondary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>Patrimoine</Link></li>
                <li><Link to="/balades" className="text-slate-300 text-sm hover:text-secondary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>Balades</Link></li>
                <li><Link to="/crossage/detail" className="text-slate-300 text-sm hover:text-secondary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>Le Crossage</Link></li>
                <li><Link to="/bulletin" className="text-slate-300 text-sm hover:text-secondary transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>Bulletin Communal</Link></li>
              </ul>
            </div>

            {/* Hours & Admin */}
            <div>
              <h3 className="text-lg font-serif font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-2">Horaires</h3>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-slate-300 text-sm mb-2 font-semibold text-secondary">Lundi - Vendredi</p>
                <p className="text-slate-400 text-sm mb-4">
                  09:00 - 12:00<br/>
                  13:00 - 16:30
                </p>
                <p className="text-slate-300 text-sm mb-2 font-semibold text-secondary">Weekend (Mai - Sept)</p>
                <p className="text-slate-400 text-sm">
                  10:00 - 12:00
                </p>
              </div>
              <div className="mt-6">
                 <a href="https://www.chievres.be" target="_blank" rel="noopener noreferrer" className="text-slate-400 text-xs hover:text-white flex items-center mb-2">
                    <ExternalLink size={12} className="mr-1" /> Administration Communale
                 </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} Office du Tourisme de la Ville de Chièvres. Tous droits réservés.
            </p>
            <Link 
              to="/admin" 
              className="bg-slate-800 hover:bg-secondary hover:text-slate-900 text-slate-300 px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center shadow-lg border border-slate-700 hover:border-secondary group touch-manipulation"
            >
                <Settings size={14} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                Administration
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;