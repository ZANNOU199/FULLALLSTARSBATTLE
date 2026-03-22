import React, { useState } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Layout,
  Search,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

const SettingsAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    siteTitle: 'All Stars Battle International 2026',
    siteDescription: 'Le plus grand événement de danse urbaine au Togo.',
    contactEmail: 'contact@asbi.tg',
    contactPhone: '+228 90 00 00 00',
    address: 'Lomé, Togo',
    socials: {
      instagram: 'https://instagram.com/asbi_togo',
      facebook: 'https://facebook.com/asbi_togo',
      twitter: 'https://twitter.com/asbi_togo',
      youtube: 'https://youtube.com/asbi_togo'
    },
    hero: {
      title: 'TOGO 2026',
      subtitle: 'ALL STARS BATTLE INTERNATIONAL',
      date: '15 - 20 JUILLET 2026',
      location: 'LOMÉ, TOGO'
    },
    stats: {
      spectators: '5000+',
      dancers: '200+',
      countries: '15+',
      prizePool: '10M FCFA'
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Configuration enregistrée avec succès !');
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tight">Configuration Globale</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Gérez les informations générales et le SEO du site</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary text-background-dark px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all"
        >
          <Save size={16} /> Enregistrer Tout
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO & General */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-heading text-white uppercase tracking-wider flex items-center gap-2">
              <Search size={20} className="text-primary" /> SEO & Général
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Titre du Site</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.siteTitle} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description SEO</label>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none resize-none" value={settings.siteDescription} onChange={(e) => setSettings({...settings, siteDescription: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-heading text-white uppercase tracking-wider flex items-center gap-2">
              <Layout size={20} className="text-primary" /> Hero Section
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Titre Principal</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.hero.title} onChange={(e) => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sous-titre</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.hero.subtitle} onChange={(e) => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dates</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.hero.date} onChange={(e) => setSettings({...settings, hero: {...settings.hero, date: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lieu</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.hero.location} onChange={(e) => setSettings({...settings, hero: {...settings.hero, location: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-heading text-white uppercase tracking-wider flex items-center gap-2">
              <Mail size={20} className="text-primary" /> Contact & Réseaux
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.contactEmail} onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Téléphone</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.contactPhone} onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Instagram size={12} /> Instagram</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.socials.instagram} onChange={(e) => setSettings({...settings, socials: {...settings.socials, instagram: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Facebook size={12} /> Facebook</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.socials.facebook} onChange={(e) => setSettings({...settings, socials: {...settings.socials, facebook: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-heading text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" /> Statistiques Accueil
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spectateurs</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.stats.spectators} onChange={(e) => setSettings({...settings, stats: {...settings.stats, spectators: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Danseurs</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.stats.dancers} onChange={(e) => setSettings({...settings, stats: {...settings.stats, dancers: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pays</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.stats.countries} onChange={(e) => setSettings({...settings, stats: {...settings.stats, countries: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prize Pool</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={settings.stats.prizePool} onChange={(e) => setSettings({...settings, stats: {...settings.stats, prizePool: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
