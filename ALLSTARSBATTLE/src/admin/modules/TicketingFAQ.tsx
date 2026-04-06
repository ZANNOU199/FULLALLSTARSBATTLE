import React, { useState, useEffect } from 'react';
import { CMSData, FAQItem } from '../../types';
import { Plus, Trash2, HelpCircle, Edit } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

export default function TicketingFAQ({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faqFormData, setFaqFormData] = useState<Partial<FAQItem>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Listen for changes from other admin modules
  useEffect(() => {
    const handleCMSDataChanged = async () => {
      console.log('TicketingFAQ: CMS data changed, reloading');
      try {
        const updatedData = await cmsService.getData();
        setData(updatedData);
      } catch (error) {
        console.error('Failed to reload data:', error);
      }
    };
    
    window.addEventListener('cmsDataChanged', handleCMSDataChanged);
    return () => window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
  }, [setData]);

  const handleAddFAQ = async () => {
    if (!faqFormData.question || !faqFormData.answer) {
      alert('Question et réponse sont obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        question: faqFormData.question,
        answer: faqFormData.answer,
      };

      console.log('TicketingFAQ: Creating FAQ via API:', payload);
      await cmsService.addFAQ(payload);
      
      setIsAdding(false);
      setFaqFormData({});
      alert('FAQ créée avec succès!');
    } catch (error: any) {
      console.error('Failed to add FAQ:', error);
      alert('Erreur lors de la création de la FAQ');
    }
    setIsLoading(false);
  };

  const handleEditFAQ = (faq: FAQItem) => {
    console.log('TicketingFAQ: Editing FAQ:', faq);
    setEditingId(faq.id);
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsAdding(true);
    console.log('TicketingFAQ: Set editingId to:', faq.id, 'formData:', { question: faq.question, answer: faq.answer });
  };

  const handleUpdateFAQ = async () => {
    if (!faqFormData.question || !faqFormData.answer) {
      alert('Question et réponse sont obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        question: faqFormData.question,
        answer: faqFormData.answer,
      };

      console.log('TicketingFAQ: Updating FAQ via API:', editingId, payload);
      await cmsService.updateFAQ(editingId!, payload);
      
      setEditingId(null);
      setIsAdding(false);
      setFaqFormData({});
      alert('FAQ modifiée avec succès!');
      console.log('TicketingFAQ: FAQ updated successfully');
    } catch (error: any) {
      console.error('Failed to update FAQ:', error);
      alert('Erreur lors de la modification de la FAQ');
    }
    setIsLoading(false);
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette FAQ?')) return;
    
    try {
      console.log('TicketingFAQ: Deleting FAQ via API:', faqId);
      await cmsService.deleteFAQ(faqId);
      alert('FAQ supprimée avec succès!');
    } catch (error: any) {
      console.error('Failed to delete FAQ:', error);
      alert('Erreur lors de la suppression de la FAQ');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-heading text-lg flex items-center gap-2"><HelpCircle size={20} className="text-primary" /> Foire Aux Questions</h4>
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl" aria-label="Ajouter une nouvelle question FAQ"><Plus size={18} /> Ajouter une Question</button>
        </div>

        {isAdding && (
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-heading text-white">
                {editingId ? '✏️ Modifier la FAQ' : '➕ Ajouter une Nouvelle FAQ'}
              </h5>
              {editingId && (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                  Modification de la FAQ #{editingId}
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Question</label>
                <input 
                  type="text" 
                  value={faqFormData.question || ''} 
                  onChange={e => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Réponse</label>
                <textarea 
                  rows={4}
                  value={faqFormData.answer || ''} 
                  onChange={e => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => { setIsAdding(false); setEditingId(null); setFaqFormData({}); }} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500" aria-label="Annuler l'ajout de question">Annuler</button>
              <button onClick={editingId ? handleUpdateFAQ : handleAddFAQ} disabled={isLoading} className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50" aria-label={editingId ? "Mettre à jour la question" : "Enregistrer la question"}>Enregistrer</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(data?.ticketing?.faqs || []).map(item => (
            <div key={item.id} className={`bg-[#111] border p-6 rounded-2xl group hover:border-white/10 transition-all ${editingId === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-white/5'}`}>
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  {item.question}
                  {editingId === item.id && <span className="text-xs text-primary">✏️ En modification</span>}
                </h5>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditFAQ(item)}
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteFAQ(item.id)}
                    className="p-2 text-slate-500 hover:text-accent-red transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
