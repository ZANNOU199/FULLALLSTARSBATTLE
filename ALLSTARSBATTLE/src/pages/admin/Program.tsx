
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Clock, MapPin, Calendar } from 'lucide-react';
import { ProgramActivity } from '../../types';

export default function Program() {
  const { state, updateState } = useCMSStore();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<ProgramActivity>>({ day: 1 });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const item = current as ProgramActivity;
    
    updateState(prev => {
      const exists = prev.program.find(p => p.id === item.id);
      if (exists) {
        return {
          ...prev,
          program: prev.program.map(p => p.id === item.id ? item : p)
        };
      } else {
        return {
          ...prev,
          program: [...prev.program, { ...item, id: Date.now().toString() }]
        };
      }
    });
    setIsEditing(false);
    setCurrent({ day: 1 });
  };

  const handleDelete = (id: string) => {
    updateState(prev => ({
      ...prev,
      program: prev.program.filter(p => p.id !== id)
    }));
  };

  const days = Array.from(new Set(state.program.map(p => p.day))).sort((a: number, b: number) => a - b);
  const [activeDay, setActiveDay] = useState(days[0] || 1);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Programme & Planning</h2>
          <p className="text-zinc-500 mt-1">Gérez le planning heure par heure de l'événement.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrent({ day: activeDay }); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Ajouter une Activité
        </button>
      </header>

      {/* Day Tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeDay === day 
                ? 'bg-white text-black shadow-xl' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            JOUR {day}
          </button>
        ))}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titre de l'activité</label>
              <input 
                required
                value={current.title || ''}
                onChange={e => setCurrent({...current, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: Workshop Breaking"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Catégorie</label>
              <select 
                required
                value={current.category || ''}
                onChange={e => setCurrent({...current, category: e.target.value as any})}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Workshop">Workshop</option>
                <option value="Battle">Battle</option>
                <option value="After-party">After-party</option>
                <option value="Showcase">Showcase</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Heure</label>
              <input 
                type="time"
                required
                value={current.time || ''}
                onChange={e => setCurrent({...current, time: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lieu</label>
              <input 
                required
                value={current.location || ''}
                onChange={e => setCurrent({...current, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: Studio A / Scène Principale"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jour</label>
              <input 
                type="number"
                min="1"
                required
                value={current.day || 1}
                onChange={e => setCurrent({...current, day: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</label>
            <textarea 
              required
              rows={3}
              value={current.description || ''}
              onChange={e => setCurrent({...current, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none"
              placeholder="Détails de l'activité..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-10 py-3 bg-primary rounded-xl font-bold text-sm"
            >
              Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {state.program
            .filter(p => p.day === activeDay)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(activity => (
              <div key={activity.id} className="glass p-6 rounded-2xl flex items-center gap-8 group">
                <div className="w-24 shrink-0">
                  <p className="text-2xl font-black tracking-tighter">{activity.time}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Heure</p>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {activity.category}
                    </span>
                    <h3 className="text-lg font-black tracking-tight">{activity.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {activity.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setCurrent(activity); setIsEditing(true); }}
                    className="p-3 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="p-3 hover:bg-red-500/20 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          
          {state.program.filter(p => p.day === activeDay).length === 0 && (
            <div className="py-20 text-center glass rounded-3xl">
              <Calendar className="mx-auto text-zinc-700 mb-4" size={48} />
              <p className="text-zinc-500 font-medium">Aucune activité prévue pour ce jour.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
