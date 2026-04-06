
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Image as ImageIcon, Calendar, Clock } from 'lucide-react';
import { Company } from '../../types';

export default function SceneArtistique() {
  const { state, updateState } = useCMSStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const company = currentCompany as Company;
    
    updateState(prev => {
      const exists = prev.companies.find(c => c.id === company.id);
      if (exists) {
        return {
          ...prev,
          companies: prev.companies.map(c => c.id === company.id ? company : c)
        };
      } else {
        return {
          ...prev,
          companies: [...prev.companies, { ...company, id: Date.now().toString() }]
        };
      }
    });
    setIsEditing(false);
    setCurrentCompany({});
  };

  const handleDelete = (id: string) => {
    updateState(prev => ({
      ...prev,
      companies: prev.companies.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Scène Artistique</h2>
          <p className="text-zinc-500 mt-1">Gérez les compagnies invitées et le planning de la scène.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrentCompany({}); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Ajouter une Compagnie
        </button>
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nom de la Compagnie</label>
              <input 
                required
                value={currentCompany.name || ''}
                onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: Pockemon Crew"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chorégraphe</label>
              <input 
                required
                value={currentCompany.choreographer || ''}
                onChange={e => setCurrentCompany({...currentCompany, choreographer: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Nom du chorégraphe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titre de la Pièce</label>
              <input 
                required
                value={currentCompany.pieceTitle || ''}
                onChange={e => setCurrentCompany({...currentCompany, pieceTitle: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Titre de la création"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Principale (URL)</label>
              <input 
                required
                value={currentCompany.mainImage || ''}
                onChange={e => setCurrentCompany({...currentCompany, mainImage: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Date de passage</label>
              <input 
                type="date"
                required
                value={currentCompany.performanceDate || ''}
                onChange={e => setCurrentCompany({...currentCompany, performanceDate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Heure de passage</label>
              <input 
                type="time"
                required
                value={currentCompany.performanceTime || ''}
                onChange={e => setCurrentCompany({...currentCompany, performanceTime: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Biographie / Description</label>
            <textarea 
              required
              rows={4}
              value={currentCompany.bio || ''}
              onChange={e => setCurrentCompany({...currentCompany, bio: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none"
              placeholder="Présentation de la compagnie..."
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {state.companies.map(company => (
            <div key={company.id} className="glass rounded-3xl overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-48 h-48 shrink-0">
                <img src={company.mainImage} alt={company.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black tracking-tight">{company.name}</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{company.choreographer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setCurrentCompany(company); setIsEditing(true); }}
                      className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(company.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 mt-4 line-clamp-2">{company.bio}</p>
                
                <div className="mt-auto pt-4 flex gap-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <Calendar size={12} />
                    {company.performanceDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <Clock size={12} />
                    {company.performanceTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
