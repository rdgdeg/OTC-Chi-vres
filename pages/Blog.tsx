
import React from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { ArrowRight, Calendar, User } from 'lucide-react';

const Blog: React.FC = () => {
  const { articles } = useData();

  return (
    <div>
      <Hero 
        title="Actualités"
        subtitle="Restez informé des dernières nouvelles de l'Office du Tourisme et de la ville."
        imageUrl="https://picsum.photos/id/1047/1920/600"
        height="small"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
                <article key={article.id} className="flex flex-col group">
                    <div className="h-64 rounded-2xl overflow-hidden mb-6 relative shadow-md">
                        <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
                            {article.category}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                        <div className="flex items-center"><Calendar size={14} className="mr-1"/> {article.date}</div>
                        <div className="flex items-center"><User size={14} className="mr-1"/> {article.author}</div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-800 mb-3 leading-tight group-hover:text-primary transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                        {article.excerpt}
                    </p>
                    
                    <button className="text-primary font-bold text-sm uppercase tracking-wide flex items-center hover:text-secondary transition-colors self-start">
                        Lire l'article <ArrowRight size={16} className="ml-2" />
                    </button>
                </article>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;