
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Trash2, Edit2, History as HistoryIcon, Star } from 'lucide-react';

export default function History() {
  const { state, updateState } = useCMSStore();
  const [activeTab, setActiveTab] = useState<'timeline' | 'legends'>('timeline');

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Histoire & Légendes</h2>
        <p className="text-zinc-500 mt-1">Gérez la timeline historique et les icônes de la danse.</p>
      </header>

      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'timeline' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          TIMELINE
        </button>
        <button
          onClick={() => setActiveTab('legends')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'legends' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          LÉGENDES
        </button>
      </div>

      {activeTab === 'timeline' ? (
        <div className="space-y-6">
          {state.timeline.map(event => (
            <div key={event.id} className="glass p-6 rounded-3xl flex gap-8 group">
              <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                <img src={event.image} alt={event.year} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black tracking-tighter text-primary">{event.year}</h3>
                  <button onClick={() => updateState(prev => ({ ...prev, timeline: prev.timeline.filter(e => e.id !== event.id) }))} className="p-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-lg font-bold mb-2">Champion: {event.champion}</p>
                <p className="text-sm text-zinc-400">{event.description}</p>
              </div>
            </div>
          ))}
          <button 
            onClick={() => updateState(prev => ({ ...prev, timeline: [...prev.timeline, { id: Date.now().toString(), year: '2025', champion: 'Nom', description: 'Description', image: 'https://picsum.photos/seed/new/400/300' }] }))}
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl text-zinc-500 hover:text-white hover:border-white/20 transition-all flex flex-col items-center gap-2"
          >
            <Plus size={24} />
            <span className="text-xs font-black uppercase tracking-widest">Ajouter un événement historique</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {state.legends.map(legend => (
            <div key={legend.id} className="glass p-6 rounded-3xl text-center group relative">
              <button onClick={() => updateState(prev => ({ ...prev, legends: prev.legends.filter(l => l.id !== legend.id) }))} className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all">
                <Trash2 size={14} />
              </button>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 ring-2 ring-primary/20">
                <img src={legend.photo} alt={legend.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">{legend.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{legend.description}</p>
            </div>
          ))}
          <button 
            onClick={() => updateState(prev => ({ ...prev, legends: [...prev.legends, { id: Date.now().toString(), name: 'Nom', description: 'Bio courte', photo: 'https://picsum.photos/seed/newleg/400/400' }] }))}
            className="border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
          >
            <Plus size={24} className="mb-2" />
            <span className="text-xs font-black uppercase tracking-widest">Ajouter une légende</span>
          </button>
        </div>
      )}
    </div>
  );
}
