
import React, { useState } from 'react';
import Hero from '../components/Hero';
import { useData } from '../contexts/DataContext';
import { Calendar as CalIcon, List, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const Agenda: React.FC = () => {
  const { events } = useData();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Helper to render Fake Calendar Grid
  const renderCalendar = () => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Octobre 2024</h3>
                <div className="flex space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={20}/></button>
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight size={20}/></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-slate-400 text-sm">
                <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for offset */}
                <div className="h-24 bg-slate-50 rounded border border-slate-100"></div>
                <div className="h-24 bg-slate-50 rounded border border-slate-100"></div>
                
                {days.map(d => {
                    // Check if an event matches this "fake" day for demo purposes (mapping ID to day roughly)
                    const hasEvent = events.find(e => e.day === d);
                    return (
                        <div key={d} className={`h-24 rounded border p-2 relative transition-colors ${hasEvent ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer' : 'bg-white border-slate-100'}`}>
                            <span className={`font-bold text-sm ${hasEvent ? 'text-primary' : 'text-slate-700'}`}>{d}</span>
                            {hasEvent && (
                                <div className="mt-2 text-xs bg-primary text-white p-1 rounded truncate">
                                    {hasEvent.title}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
  };

  return (
    <div>
      <Hero 
        title="Agenda des Sorties"
        subtitle="Fêtes locales, marchés, événements culturels... Ne manquez rien de la vie chièvroise."
        imageUrl="https://picsum.photos/id/1040/1920/600"
        height="medium"
      />

      <div className="container mx-auto px-4 py-16">
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800">Prochains événements</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setView('list')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                    <List size={16} className="mr-2" /> Liste
                </button>
                <button 
                    onClick={() => setView('calendar')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                    <CalIcon size={16} className="mr-2" /> Calendrier
                </button>
            </div>
        </div>

        {view === 'list' ? (
            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center md:items-start gap-6 group">
                        <div className="shrink-0 bg-slate-100 rounded-lg p-4 text-center min-w-[100px]">
                            <span className="block text-3xl font-serif font-bold text-primary">{event.day}</span>
                            <span className="block text-sm font-bold text-slate-500 uppercase">{event.month}</span>
                        </div>
                        
                        <div className="flex-grow text-center md:text-left">
                            <div className="mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-full">{event.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                            <p className="text-slate-600 mb-4 text-sm">{event.description}</p>
                            <div className="flex items-center justify-center md:justify-start text-slate-500 text-sm">
                                <MapPin size={16} className="mr-1" />
                                {event.location}
                            </div>
                        </div>

                        <div className="shrink-0">
                            <button className="border-2 border-primary text-primary font-bold px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            renderCalendar()
        )}
        
      </div>
    </div>
  );
};

export default Agenda;