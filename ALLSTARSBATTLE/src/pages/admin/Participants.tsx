
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { Participant } from '../../types';

export default function Participants() {
  const { state, updateState } = useCMSStore();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Participant>>({ socials: {} });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const item = current as Participant;
    
    updateState(prev => {
      const exists = prev.participants.find(p => p.id === item.id);
      if (exists) {
        return {
          ...prev,
          participants: prev.participants.map(p => p.id === item.id ? item : p)
        };
      } else {
        return {
          ...prev,
          participants: [...prev.participants, { ...item, id: Date.now().toString() }]
        };
      }
    });
    setIsEditing(false);
    setCurrent({ socials: {} });
  };

  const handleDelete = (id: string) => {
    updateState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id)
    }));
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Participants & Jury</h2>
          <p className="text-zinc-500 mt-1">Gérez les B-Boys, B-Girls, Crews, juges, DJs et MCs de l'événement.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrent({ socials: {} }); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Ajouter un Participant
        </button>
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nom / Alias</label>
              <input 
                required
                value={current.name || ''}
                onChange={e => setCurrent({...current, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: B-Boy Lilou"
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
                <option value="b-boy">B-Boy</option>
                <option value="b-girl">B-Girl</option>
                <option value="crew">Crew</option>
                <option value="judge">Juge</option>
                <option value="dj">DJ</option>
                <option value="mc">MC</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pays</label>
              <input 
                required
                value={current.country || ''}
                onChange={e => setCurrent({...current, country: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: France"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Spécialité</label>
              <input 
                required
                value={current.specialty || ''}
                onChange={e => setCurrent({...current, specialty: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: Power Moves"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Photo (URL)</label>
              <input 
                required
                value={current.photo || ''}
                onChange={e => setCurrent({...current, photo: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Instagram</label>
              <input 
                value={current.socials?.instagram || ''}
                onChange={e => setCurrent({...current, socials: { ...current.socials, instagram: e.target.value }})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Biographie</label>
            <textarea 
              required
              rows={4}
              value={current.bio || ''}
              onChange={e => setCurrent({...current, bio: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none"
              placeholder="Parcours et palmarès..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.participants.map(p => (
            <div key={p.id} className="glass rounded-3xl overflow-hidden group">
              <div className="aspect-square overflow-hidden relative">
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setCurrent(p); setIsEditing(true); }}
                    className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-primary transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black tracking-tight">{p.name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mt-1">
                  <Globe size={12} />
                  {p.country}
                </div>
                <p className="text-xs text-zinc-400 mt-4 line-clamp-2">{p.bio}</p>
                
                <div className="flex gap-3 mt-6">
                  {p.socials.instagram && <Instagram size={16} className="text-zinc-500 hover:text-white cursor-pointer" />}
                  {p.socials.facebook && <Facebook size={16} className="text-zinc-500 hover:text-white cursor-pointer" />}
                  {p.socials.twitter && <Twitter size={16} className="text-zinc-500 hover:text-white cursor-pointer" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
