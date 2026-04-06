import React from 'react';
import { CMSData, ProgramDay, Activity } from '../../types';
import { Layout, Users, Music, Crown, Image, Newspaper, BookOpen, Trash2, Plus } from 'lucide-react';
import IconSelector from '../components/IconSelector';



export default function HomepageContent({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  
  const updateSection = (section: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        [section]: { ...prev.globalConfig[section as keyof typeof prev.globalConfig], [field]: value }
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
        stats: newStats
      }
    }));
  };

  const updateProgramDay = (dayIndex: number, field: 'label' | 'date', value: string) => {
    const newProgram = [...data.program];
    newProgram[dayIndex] = { ...newProgram[dayIndex], [field]: value };
    setData(prev => ({
      ...prev,
      program: newProgram
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: string) => {
    const newProgram = [...data.program];
    newProgram[dayIndex].activities[activityIndex] = {
      ...newProgram[dayIndex].activities[activityIndex],
      [field]: value
    } as Activity;
    setData(prev => ({
      ...prev,
      program: newProgram
    }));
  };

  const updateVipFeature = (featureIndex: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newFeatures = [...data.globalConfig.vip.features];
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], [field]: value };
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        vip: {
          ...prev.globalConfig.vip,
          features: newFeatures
        }
      }
    }));
  };

  const addVipFeature = () => {
    const newFeatures = [...data.globalConfig.vip.features];
    newFeatures.push({
      icon: 'Star',
      title: 'Nouvelle Fonctionnalité',
      description: 'Description de la fonctionnalité'
    });
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        vip: {
          ...prev.globalConfig.vip,
          features: newFeatures
        }
      }
    }));
  };

  const removeVipFeature = (featureIndex: number) => {
    const newFeatures = [...data.globalConfig.vip.features];
    newFeatures.splice(featureIndex, 1);
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        vip: {
          ...prev.globalConfig.vip,
          features: newFeatures
        }
      }
    }));
  };

  const addActivity = (dayIndex: number) => {
    const newProgram = [...data.program];
    const newActivity: Activity = {
      id: Date.now().toString(),
      time: '00:00 - 00:00',
      title: 'Nouvelle Activité',
      location: 'Location',
      description: 'Description',
      category: 'other'
    };
    newProgram[dayIndex].activities.push(newActivity);
    setData(prev => ({
      ...prev,
      program: newProgram
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newProgram = [...data.program];
    newProgram[dayIndex].activities.splice(activityIndex, 1);
    setData(prev => ({
      ...prev,
      program: newProgram
    }));
  };

  return (
    <div className="space-y-12">
      {/* Dancers Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Users size={20} className="text-primary" /> Section LES DANSEURS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sous-titre</label>
            <input 
              type="text" 
              value={data.globalConfig.dancers.sectionSubtitle} 
              onChange={e => updateSection('dancers', 'sectionSubtitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Section</label>
            <input 
              type="text" 
              value={data.globalConfig.dancers.sectionTitle} 
              onChange={e => updateSection('dancers', 'sectionTitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>
 

      {/* VIP Section */}
      <div className="bg-[#111] border border-white/10 p-4 sm:p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-base sm:text-lg flex items-center gap-2"><Crown size={20} className="text-primary" /> Section EXPERIENCE VIP</h4>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Section</label>
          <input 
            type="text" 
            value={data.globalConfig.vip.sectionTitle} 
            onChange={e => updateSection('vip', 'sectionTitle', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
          <textarea 
            rows={3}
            value={data.globalConfig.vip.sectionDescription} 
            onChange={e => updateSection('vip', 'sectionDescription', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none min-h-[100px] sm:min-h-[80px]"
          />
        </div>

        {/* VIP Features */}
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <h5 className="text-sm font-bold text-white">Fonctionnalités VIP</h5>
            <button 
              onClick={addVipFeature}
              className="flex items-center gap-1 text-xs sm:text-xs bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-2 sm:px-3 py-2 transition-all whitespace-nowrap min-h-[36px]"
            >
              <Plus size={14} /> <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
          {data.globalConfig.vip.features.map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl space-y-3 sm:space-y-4">
              {/* Header avec bouton supprimer */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400">Fonctionnalité {idx + 1}</span>
                <button 
                  onClick={() => removeVipFeature(idx)}
                  className="text-accent-red hover:text-accent-red/80 transition-colors flex-shrink-0 p-2 hover:bg-accent-red/10 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Champ Icône - Pleine largeur sur mobile */}
              <div className="w-full space-y-2">
                <IconSelector 
                  value={feature.icon} 
                  onChange={e => updateVipFeature(idx, 'icon', e)}
                />
              </div>

              {/* Champs Titre et Description - Stack sur mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2 min-w-0">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Titre</label>
                  <input 
                    type="text" 
                    value={feature.title} 
                    onChange={e => updateVipFeature(idx, 'title', e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-primary transition-all min-h-[44px]"
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Description</label>
                  <input 
                    type="text" 
                    value={feature.description} 
                    onChange={e => updateVipFeature(idx, 'description', e.target.value)}
                    className="w-full bg-background-dark border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-primary transition-all min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#111] border border-white/10 p-4 sm:p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-base sm:text-lg flex items-center gap-2"><Image size={20} className="text-primary" /> Statistiques Clés (Section Compétition)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Partners Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Layout size={20} className="text-primary" /> Section PARTENAIRES & SPONSORS</h4>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Section</label>
          <input 
            type="text" 
            value={data.globalConfig.partners.sectionTitle} 
            onChange={e => updateSection('partners', 'sectionTitle', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Blog Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><Newspaper size={20} className="text-primary" /> Section ACTUALITÉS & NEWS</h4>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Section</label>
          <input 
            type="text" 
            value={data.globalConfig.blog.sectionTitle} 
            onChange={e => updateSection('blog', 'sectionTitle', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="font-heading text-lg flex items-center gap-2"><BookOpen size={20} className="text-primary" /> FOOTER</h4>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description Footer</label>
          <textarea 
            rows={3}
            value={data.globalConfig.footer.description} 
            onChange={e => updateSection('footer', 'description', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Texte Copyright</label>
          <input 
            type="text" 
            value={data.globalConfig.footer.copyright} 
            onChange={e => updateSection('footer', 'copyright', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
          />
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
