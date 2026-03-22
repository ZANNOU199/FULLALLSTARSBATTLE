import React from 'react';
import { CMSData } from '../../types';
import { Globe, Mail, Phone, MapPin, TrendingUp, Layout, Calendar, Trophy } from 'lucide-react';

export default function GlobalConfigSEO({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const updateContact = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        contact: { ...prev.globalConfig.contact, [field]: value }
      }
    }));
  };

  const updateSEO = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        seo: { ...prev.globalConfig.seo, [field]: value }
      }
    }));
  };

  const updateHero = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        hero: { ...prev.globalConfig.hero, [field]: value }
      }
    }));
  };

  const updateEventDate = (value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        eventDate: value
      }
    }));
  };

  const updateSocials = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        socials: { ...prev.globalConfig.socials, [field]: value }
      }
    }));
  };

  const updateCompetition = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        competition: { ...prev.globalConfig.competition, [field]: value }
      }
    }));
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...data.globalConfig.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        stats: newStats,
        homepageStats: newStats  // Keep both in sync
      }
    }));
  };

  return (
    <div className="space-y-12">
      {/* Competition Event Date */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Calendar size={20} className="text-primary" /> Date de la Compétition</h4>
        <div className="space-y-4 max-w-md">
          <p className="text-sm text-slate-400">
            Modifiez la date de débuts de la compétition pour que le décompte en premier page se met à jour en temps réel.
          </p>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date et Heure de Début</label>
            <input 
              type="datetime-local" 
              value={data.globalConfig.eventDate.slice(0, 16)} 
              onChange={e => updateEventDate(e.target.value + ':00')}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="bg-white/5 border border-primary/30 rounded-lg p-3">
            <p className="text-xs text-slate-400">Valeur actuelle: <span className="text-primary font-mono">{data.globalConfig.eventDate}</span></p>
          </div>
        </div>
      </div>

      {/* Competition Details */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Trophy size={20} className="text-primary" /> Détails de la Compétition (Section Hero)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dates (ex: 14 - 16 AOÛT 2026)</label>
            <input 
              type="text" 
              value={data.globalConfig.competition.dateStart} 
              onChange={e => updateCompetition('dateStart', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lieu (ex: PALAIS DES CONGRÈS DE LOMÉ, TOGO)</label>
            <input 
              type="text" 
              value={data.globalConfig.competition.location} 
              onChange={e => updateCompetition('location', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description de la Compétition</label>
          <textarea 
            rows={5}
            value={data.globalConfig.competition.description} 
            onChange={e => updateCompetition('description', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Layout size={20} className="text-primary" /> Hero Section (Accueil)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Localisation (Texte au-dessus du titre)</label>
            <input 
              type="text" 
              value={data.globalConfig.hero.location} 
              onChange={e => updateHero('location', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre Principal</label>
            <input 
              type="text" 
              value={data.globalConfig.hero.title} 
              onChange={e => updateHero('title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sous-titre / Accroche</label>
            <input 
              type="text" 
              value={data.globalConfig.hero.subtitle} 
              onChange={e => updateHero('subtitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image de Fond (URL)</label>
            <input 
              type="text" 
              value={data.globalConfig.hero.backgroundImage} 
              onChange={e => updateHero('backgroundImage', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vidéo de Fond (URL)</label>
            <input 
              type="text" 
              value={data.globalConfig.hero.videoUrl} 
              onChange={e => updateHero('videoUrl', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Social Networks Links */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Globe size={20} className="text-primary" /> Réseaux Sociaux</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Instagram</label>
            <input 
              type="url" 
              value={data.globalConfig.socials.instagram} 
              onChange={e => updateSocials('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Facebook</label>
            <input 
              type="url" 
              value={data.globalConfig.socials.facebook} 
              onChange={e => updateSocials('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Twitter / X</label>
            <input 
              type="url" 
              value={data.globalConfig.socials.twitter} 
              onChange={e => updateSocials('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">YouTube</label>
            <input 
              type="url" 
              value={data.globalConfig.socials.youtube} 
              onChange={e => updateSocials('youtube', e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Statistiques Clés</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.globalConfig.stats.map((stat, idx) => (
            <div key={idx} className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Libellé</label>
                <input 
                  type="text" 
                  value={stat.label} 
                  onChange={e => updateStat(idx, 'label', e.target.value)}
                  className="w-full bg-background-dark border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valeur</label>
                <input 
                  type="text" 
                  value={stat.value} 
                  onChange={e => updateStat(idx, 'value', e.target.value)}
                  className="w-full bg-background-dark border border-white/10 rounded-lg p-2 text-xl font-heading text-primary outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
          <h4 className="font-heading text-lg flex items-center gap-2"><Mail size={20} className="text-primary" /> Informations de Contact</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</label>
              <input 
                type="email" 
                value={data.globalConfig.contact.email} 
                onChange={e => updateContact('email', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Téléphone</label>
              <input 
                type="text" 
                value={data.globalConfig.contact.phone} 
                onChange={e => updateContact('phone', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Adresse</label>
              <input 
                type="text" 
                value={data.globalConfig.contact.address} 
                onChange={e => updateContact('address', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SEO Config */}
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
          <h4 className="font-heading text-lg flex items-center gap-2"><Globe size={20} className="text-primary" /> SEO & Référencement</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre du Site (Google)</label>
              <input 
                type="text" 
                value={data.globalConfig.seo.title} 
                onChange={e => updateSEO('title', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description Meta</label>
              <textarea 
                rows={3}
                value={data.globalConfig.seo.description} 
                onChange={e => updateSEO('description', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mots-clés (séparés par des virgules)</label>
              <input 
                type="text" 
                value={data.globalConfig.seo.keywords} 
                onChange={e => updateSEO('keywords', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => {
            if (onSave) {
              onSave(data);
            } else {
              alert('Enregistrement local, mais pas de persistance : config manquante.');
            }
          }}
          className="px-6 py-3 bg-primary text-background-dark rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
