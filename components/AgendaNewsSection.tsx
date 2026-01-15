import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { contentService, Event, BlogPost } from '../services/contentService';

const AgendaNewsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les événements et articles de blog depuis l'admin
      const { events: eventsData, blogPosts: blogData } = await contentService.getHomePageContent();
      setEvents(eventsData);
      setBlogPosts(blogData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* En-tête avec onglets */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">
            Actualités & Agenda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Restez informé de nos dernières actualités et ne manquez aucun événement
          </p>

          {/* Onglets */}
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Actualités
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'news' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Aucun article disponible pour le moment.</p>
                </div>
              ) : (
                blogPosts.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                  >
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {article.is_featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                              À la une
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                        {article.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded">{article.category}</span>
                        )}
                        {article.read_time && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.read_time}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {article.published_at && (
                          <span className="text-sm text-gray-500">
                            {formatDate(article.published_at)}
                          </span>
                        )}
                        <Link
                          to={`/blog/${article.id}`}
                          className="inline-flex items-center text-primary hover:text-secondary font-semibold"
                        >
                          Lire la suite
                          <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Aucun événement à venir pour le moment.</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                  >
                    {event.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                            <div className="text-primary font-bold text-lg">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-gray-600 text-xs uppercase">
                              {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          {formatDate(event.date)}
                          {event.time && ` à ${event.time}`}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {event.category && (
                          <span className="text-sm font-semibold text-primary">
                            {event.category}
                          </span>
                        )}
                        {event.link_url ? (
                          <Link
                            to={event.link_url}
                            className="inline-flex items-center text-primary hover:text-secondary font-semibold"
                          >
                            En savoir plus
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </Link>
                        ) : (
                          <Link
                            to={`/agenda/${event.id}`}
                            className="inline-flex items-center text-primary hover:text-secondary font-semibold"
                          >
                            Détails
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Call-to-action */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/blog"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold"
            >
              Tous les articles
            </Link>
            <Link
              to="/agenda"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
            >
              Agenda complet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaNewsSection;