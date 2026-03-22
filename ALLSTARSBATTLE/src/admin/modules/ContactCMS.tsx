import React, { useState } from 'react';
import { CMSData } from '../../types';
import { Save, AlertCircle } from 'lucide-react';

export default function ContactCMS({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [heroData, setHeroData] = useState(data.contact?.hero || {
    title: 'Besoin ',
    titleHighlight: 'd\'aide ?',
    description: 'L\'équipe All Stars Battle International est là pour vous accompagner.'
  });

  const [sectionsData, setSectionsData] = useState(data.contact?.sections || {
    coordinatesTitle: 'Coordonnées',
    hoursLabel: 'Horaires',
    hoursValue: 'Lun-Ven, 09h00 - 18h00',
    responseTime: 'Réponse sous 24h',
    socialLabel: 'Suivez le mouvement',
    faqTitle: 'Foire Aux Questions'
  });

  const handleSave = () => {
    const updatedData = {
      ...data,
      contact: {
        hero: heroData,
        sections: sectionsData
      }
    };
    
    setData(updatedData);
    
    // Save to database
    if (onSave) {
      onSave(updatedData);
    } else {
      // Fallback if no onSave provided
      alert('Configuration Contact sauvegardée localement!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-200 font-semibold text-sm">Note</p>
          <p className="text-blue-300 text-xs mt-1">Les données de contact (email, téléphone, adresse, réseaux sociaux) et les FAQs sont gérées dans d'autres sections.</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-heading text-white uppercase tracking-tight">Section Héro - Page Contact</h3>
        
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre Principal</label>
            <input 
              type="text" 
              value={heroData.title || ''} 
              onChange={e => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
            <p className="text-[11px] text-slate-500 italic">Ex: "Besoin "</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre Surligne (Couleur Primaire)</label>
            <input 
              type="text" 
              value={heroData.titleHighlight || ''} 
              onChange={e => setHeroData({ ...heroData, titleHighlight: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
            <p className="text-[11px] text-slate-500 italic">Ex: "d'aide ?"</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description / Sous-titre</label>
            <textarea 
              rows={3}
              value={heroData.description || ''} 
              onChange={e => setHeroData({ ...heroData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none text-white"
            />
            <p className="text-[11px] text-slate-500 italic">Texte descriptif du héro de la page contact</p>
          </div>
        </div>
      </div>

      {/* Sections Labels */}
      <div className="space-y-6">
        <h3 className="text-xl font-heading text-white uppercase tracking-tight">Labels & Textes des Sections</h3>
        
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Section Coordonnées</label>
            <input 
              type="text" 
              value={sectionsData.coordinatesTitle || ''} 
              onChange={e => setSectionsData({ ...sectionsData, coordinatesTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Label Horaires</label>
              <input 
                type="text" 
                value={sectionsData.hoursLabel || ''} 
                onChange={e => setSectionsData({ ...sectionsData, hoursLabel: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valeur Horaires</label>
              <input 
                type="text" 
                value={sectionsData.hoursValue || ''} 
                onChange={e => setSectionsData({ ...sectionsData, hoursValue: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Délai de Réponse</label>
            <input 
              type="text" 
              value={sectionsData.responseTime || ''} 
              onChange={e => setSectionsData({ ...sectionsData, responseTime: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Label Réseaux Sociaux</label>
            <input 
              type="text" 
              value={sectionsData.socialLabel || ''} 
              onChange={e => setSectionsData({ ...sectionsData, socialLabel: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Foire Aux Questions</label>
            <input 
              type="text" 
              value={sectionsData.faqTitle || ''} 
              onChange={e => setSectionsData({ ...sectionsData, faqTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
            />
            <p className="text-[11px] text-slate-500 italic">Les FAQs sont gérées dans la section Billetterie & FAQs</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-8 py-3 bg-primary text-background-dark rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all"
        >
          <Save size={18} /> Enregistrer Configuration
        </button>
      </div>
    </div>
  );
}
