
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { Article } from '../../types';

export default function Blog() {
  const { state, updateState } = useCMSStore();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Article>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const item = current as Article;
    
    updateState(prev => {
      const exists = prev.articles.find(a => a.id === item.id);
      if (exists) {
        return {
          ...prev,
          articles: prev.articles.map(a => a.id === item.id ? item : a)
        };
      } else {
        return {
          ...prev,
          articles: [...prev.articles, { ...item, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }]
        };
      }
    });
    setIsEditing(false);
    setCurrent({});
  };

  const handleDelete = (id: string) => {
    updateState(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a.id !== id)
    }));
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Blog & Actualités</h2>
          <p className="text-zinc-500 mt-1">Publiez des articles et tenez votre audience informée.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(true); setCurrent({}); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Nouvel Article
        </button>
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titre de l'article</label>
              <input 
                required
                value={current.title || ''}
                onChange={e => setCurrent({...current, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-black tracking-tight focus:border-primary outline-none transition-colors"
                placeholder="Titre accrocheur..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Catégorie</label>
              <input 
                required
                value={current.category || ''}
                onChange={e => setCurrent({...current, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="Ex: News, Interview, Reportage"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image de couverture (URL)</label>
              <input 
                required
                value={current.coverImage || ''}
                onChange={e => setCurrent({...current, coverImage: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contenu (Éditeur de texte riche simulé)</label>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-white/5 p-2 border-b border-white/10 flex gap-2">
                <button type="button" className="p-2 hover:bg-white/10 rounded font-bold text-xs">B</button>
                <button type="button" className="p-2 hover:bg-white/10 rounded italic text-xs">I</button>
                <button type="button" className="p-2 hover:bg-white/10 rounded underline text-xs">U</button>
                <div className="w-px h-4 bg-white/10 self-center mx-1" />
                <button type="button" className="p-2 hover:bg-white/10 rounded text-xs">Lien</button>
              </div>
              <textarea 
                required
                rows={12}
                value={current.content || ''}
                onChange={e => setCurrent({...current, content: e.target.value})}
                className="w-full bg-zinc-900 px-6 py-6 focus:outline-none transition-colors resize-none leading-relaxed"
                placeholder="Rédigez votre article ici..."
              />
            </div>
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
              Publier
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {state.articles.map(article => (
            <div key={article.id} className="glass rounded-3xl overflow-hidden group flex flex-col">
              <div className="aspect-video overflow-hidden relative">
                <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setCurrent(article); setIsEditing(true); }}
                    className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <Calendar size={12} />
                    {article.date}
                  </div>
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6">
                  {article.content}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Par Admin ASBI</span>
                  <button className="text-xs font-bold text-primary hover:underline">Lire la suite</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
