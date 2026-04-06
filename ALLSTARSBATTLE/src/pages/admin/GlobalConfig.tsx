
import React from 'react';
import { useCMSStore } from '../../store/useStore';
import { Save, Globe, Mail, Phone, MapPin, Share2 } from 'lucide-react';

export default function GlobalConfig() {
  const { state, updateState } = useCMSStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    updateState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        contact: {
          ...prev.config.contact,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          address: formData.get('address') as string,
        },
        seo: {
          title: formData.get('seoTitle') as string,
          description: formData.get('seoDesc') as string,
          keywords: formData.get('seoKeywords') as string,
        },
        hero: {
          ...prev.config.hero,
          title: formData.get('heroTitle') as string,
          subtitle: formData.get('heroSubtitle') as string,
        },
        stats: {
          spectators: formData.get('statSpectators') as string,
          countries: formData.get('statCountries') as string,
          prizes: formData.get('statPrizes') as string,
        }
      }
    }));
    alert('Configuration enregistrée avec succès !');
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Configuration Globale & SEO</h2>
        <p className="text-zinc-500 mt-1">Gérez les informations de base, le SEO et le contenu de la page d'accueil.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Info */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-black tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <Mail size={16} />
            Informations de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email</label>
              <input name="email" defaultValue={state.config.contact.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Téléphone</label>
              <input name="phone" defaultValue={state.config.contact.phone} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Adresse</label>
              <input name="address" defaultValue={state.config.contact.address} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-black tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <Globe size={16} />
            SEO & Référencement
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titre du site (Google)</label>
              <input name="seoTitle" defaultValue={state.config.seo.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description Meta</label>
              <textarea name="seoDesc" defaultValue={state.config.seo.description} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mots-clés (séparés par des virgules)</label>
              <input name="seoKeywords" defaultValue={state.config.seo.keywords} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-black tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <Share2 size={16} />
            Accueil - Hero Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titre d'accroche</label>
              <input name="heroTitle" defaultValue={state.config.hero.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sous-titre / Date</label>
              <input name="heroSubtitle" defaultValue={state.config.hero.subtitle} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-black tracking-widest uppercase text-zinc-400">Accueil - Statistiques Clés</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Spectateurs</label>
              <input name="statSpectators" defaultValue={state.config.stats.spectators} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pays représentés</label>
              <input name="statCountries" defaultValue={state.config.stats.countries} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cash Prize Total</label>
              <input name="statPrizes" defaultValue={state.config.stats.prizes} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 px-12 py-4 bg-primary rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            <Save size={20} />
            Enregistrer tout
          </button>
        </div>
      </form>
    </div>
  );
}
