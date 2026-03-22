
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Trash2, FileText, ExternalLink } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

export default function Partners() {
  const { state, updateState } = useCMSStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const removePartner = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire?')) {
      setIsDeleting(true);
      try {
        const updatedPartners = state.partners.filter(p => p.id !== id);
        updateState(prev => ({ ...prev, partners: updatedPartners }));
        
        // Also save to database
        const cmsData = await cmsService.getData();
        const updatedData = {
          ...cmsData,
          partners: {
            ...cmsData.partners,
            logos: updatedPartners
          }
        };
        await cmsService.saveData(updatedData);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du partenaire');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const addPartner = async (category: string) => {
    const newPartner = { id: Date.now().toString(), name: 'Nouveau', logo: 'https://picsum.photos/seed/logo/200/100', category: category as any };
    const updatedPartners = [...state.partners, newPartner];
    updateState(prev => ({ ...prev, partners: updatedPartners }));
    
    try {
      // Also save to database
      const cmsData = await cmsService.getData();
      const updatedData = {
        ...cmsData,
        partners: {
          ...cmsData.partners,
          logos: updatedPartners
        }
      };
      await cmsService.saveData(updatedData);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du partenaire');
    }
  };

  const categories = ['Institutional', 'Sponsor', 'Media'];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Partenaires & Médias</h2>
        <p className="text-zinc-500 mt-1">Gérez les logos des partenaires et le dossier de sponsoring.</p>
      </header>

      {/* Sponsoring PDF */}
      <div className="glass p-8 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Dossier de Sponsoring</h3>
            <p className="text-sm text-zinc-500">Lien actuel: <span className="text-zinc-300">{state.config.sponsoringPdfUrl}</span></p>
          </div>
        </div>
        <button 
          onClick={() => {
            const url = prompt('Nouveau lien PDF:', state.config.sponsoringPdfUrl);
            if (url) updateState(prev => ({ ...prev, config: { ...prev.config, sponsoringPdfUrl: url } }));
          }}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all"
        >
          Mettre à jour
        </button>
      </div>

      {/* Partners Grid */}
      <div className="space-y-12">
        {categories.map(cat => (
          <div key={cat} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black tracking-widest uppercase text-zinc-400">{cat}</h3>
              <button 
                onClick={() => addPartner(cat)}
                className="p-2 hover:bg-white/5 rounded-lg text-primary"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {state.partners.filter(p => p.category === cat).map(partner => (
                <div key={partner.id} className="glass p-6 rounded-2xl aspect-[2/1] flex items-center justify-center group relative">
                  <button 
                    onClick={() => removePartner(partner.id)}
                    disabled={isDeleting}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full transition-all shadow-lg disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                  </button>
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
