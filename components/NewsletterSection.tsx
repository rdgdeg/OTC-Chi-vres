import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setStatus('loading');
    
    // Simulation d'un appel API
    setTimeout(() => {
      setStatus('success');
      setMessage('Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-slate-800 text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
              <Mail size={32} className="text-slate-900" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Inscrivez-vous à notre newsletter
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Restez connecté avec Chièvres ! Recevez nos actus, événements et bons plans 
              directement dans votre boîte mail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-secondary/30 transition-all"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-secondary text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </div>
            
            {message && (
              <div className={`mt-4 p-4 rounded-lg flex items-center justify-center space-x-2 ${
                status === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}>
                {status === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}
          </form>

          <p className="text-xs text-slate-300 mt-6 max-w-lg mx-auto">
            En vous inscrivant, vous acceptez de recevoir nos communications. 
            Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;