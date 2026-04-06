import React, { useState } from 'react';
import { CMSData, Partner } from '../../types';
import { Plus, Trash2, X, Handshake, FileText, Building2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';

export default function PartnersMedia({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartnerForm, setNewPartnerForm] = useState<Partial<Partner> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Institutional' | 'Main' | 'Media'>('Institutional');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fonction pour uploader un fichier
  const handleFileUpload = async (file: File): Promise<string> => {
    if (!UploadService.validateImageFile(file)) {
      throw new Error('Fichier invalide. Seules les images (JPEG, PNG, WebP, GIF) de moins de 10MB sont acceptées.');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler la progression (puisque fetch ne supporte pas nativement la progression)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const fileName = UploadService.generateFileName(file.name);
      const uploadedUrl = await UploadService.uploadFile(file, fileName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      return uploadedUrl;
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Ensure partners data exists
  const partnersData = data.partners || {
    logos: [],
    sponsoringPdfUrl: '#',
    cta: {
      title: 'Devenez un Acteur de l\'Histoire',
      subtitle: 'Rejoignez l\'élite de la culture urbaine africaine',
      buttonText: 'Devenir Partenaire'
    }
  };

  const categories = ['Institutional', 'Main', 'Media'] as const;
  const tiers = ['Sponsor Platine', 'Sponsor Or', 'Sponsor Argent', 'Partenaire Officiel'];

  const filteredPartners = (partnersData.logos || []).filter(p => p.category === selectedCategory);

  const initAddingPartner = () => {
    setIsAddingPartner(true);
    setNewPartnerForm({
      category: selectedCategory,
      name: '',
      logo: '',
      tier: 'Partenaire Officiel'
    });
  };

  const saveNewPartner = async () => {
    if (newPartnerForm && newPartnerForm.name && newPartnerForm.logo) {
      const partner: Partner = {
        id: Date.now().toString(),
        name: newPartnerForm.name,
        logo: newPartnerForm.logo,
        category: newPartnerForm.category as 'Institutional' | 'Main' | 'Media',
        tier: newPartnerForm.tier
      };

      const updatedData: CMSData = {
        ...data,
        partners: {
          ...data.partners,
          logos: [...(data.partners?.logos || []), partner]
        }
      };

      setIsSaving(true);
      try {
        await cmsService.saveData(updatedData);
        setData(updatedData);
        setIsAddingPartner(false);
        setNewPartnerForm(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde du partenaire');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const removePartner = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire?')) {
      const updatedData: CMSData = {
        ...data,
        partners: {
          ...data.partners,
          logos: (data.partners?.logos || []).filter(p => p.id !== id)
        }
      };

      setIsSaving(true);
      try {
        await cmsService.saveData(updatedData);
        setData(updatedData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du partenaire');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: { [key: string]: string } = {
      'Institutional': 'Partenaires Institutionnels',
      'Main': 'Sponsors Majeurs',
      'Media': 'Média & Broadcasting'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="space-y-12">
      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 text-green-400"
        >
          <CheckCircle size={20} className="flex-shrink-0" />
          <span className="font-bold">Partenaire enregistré avec succès en base de données !</span>
        </motion.div>
      )}

      <header>
        <h2 className="text-3xl font-black tracking-tighter">Partenaires & Sponsors</h2>
        <p className="text-zinc-500 mt-1">Gérez tous les partenaires, sponsors et médias partenaires.</p>
      </header>

      {/* Section Partenaires */}
      <div className="space-y-8">
        {/* Sélecteur de catégorie */}
        <div className="flex gap-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-background-dark'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Ajout de partenaire */}
        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg">{getCategoryLabel(selectedCategory)}</h3>
            <button
              onClick={initAddingPartner}
              className="flex items-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-4 py-2 transition-all font-bold"
            >
              <Plus size={18} /> Ajouter Partenaire
            </button>
          </div>

          {/* Formulaire d'ajout */}
          {isAddingPartner && newPartnerForm && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type de Partenaire</label>
                  <select
                    value={newPartnerForm.tier || 'Partenaire Officiel'}
                    onChange={e => {
                      const selectedTier = e.target.value;
                      let category: 'Institutional' | 'Main' | 'Media';
                      if (selectedTier === 'Partenaire Officiel') {
                        category = 'Institutional';
                      } else if (selectedTier === 'Média & Broadcasting') {
                        category = 'Media';
                      } else {
                        category = 'Main';
                      }
                      setNewPartnerForm({ 
                        ...newPartnerForm, 
                        tier: selectedTier,
                        category: category
                      });
                      setSelectedCategory(category);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
                  >
                    <option value="Partenaire Officiel">Partenaire Officiel (Institutional)</option>
                    <option value="Sponsor Platine">Sponsor Platine (Main)</option>
                    <option value="Sponsor Or">Sponsor Or (Main)</option>
                    <option value="Sponsor Argent">Sponsor Argent (Main)</option>
                    <option value="Média & Broadcasting">Média & Broadcasting (Media)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom du Partenaire</label>
                  <input
                    type="text"
                    value={newPartnerForm.name || ''}
                    onChange={e => setNewPartnerForm({ ...newPartnerForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
                    placeholder="Nom de l'entreprise..."
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Logo du Partenaire</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setNewPartnerForm({ ...newPartnerForm, logo: uploadedUrl });
                          } catch (error) {
                            alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                          }
                        }
                      }}
                      disabled={isUploading}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
                    />
                    {isUploading && (
                      <div className="w-full bg-white/10 rounded-lg p-2">
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                          <span>Upload en cours...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Aperçu du logo */}
              {newPartnerForm.logo && (
                <div className="flex justify-center pt-4">
                  <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center p-4">
                    <img src={newPartnerForm.logo} alt={newPartnerForm.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={saveNewPartner}
                  disabled={isSaving}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Enregistrement...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle size={18} />
                      Enregistré !
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsAddingPartner(false);
                    setNewPartnerForm(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Grille des partenaires */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPartners.map(partner => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 p-4 rounded-lg group hover:border-primary/50 transition-all"
              >
                <div className="relative mb-3">
                  <div className="aspect-square bg-white/10 rounded-lg p-3 flex items-center justify-center">
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <button
                    onClick={() => removePartner(partner.id)}
                    className="absolute top-2 right-2 p-2 bg-accent-red/20 hover:bg-accent-red/40 text-accent-red rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white truncate">{partner.name}</p>
                  {partner.tier && (
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{partner.tier}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section CTA - Devenir Partenaire */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-primary" size={24} />
          <h3 className="font-heading text-lg">Section "Devenir Partenaire"</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre CTA</label>
              <input
                type="text"
                value={partnersData.cta.title}
                onChange={e => setData(prev => ({
                  ...prev,
                  partners: {
                    ...prev.partners,
                    cta: { ...prev.partners.cta, title: e.target.value }
                  }
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
                placeholder="Ex: Devenez un Acteur de l'Histoire"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sous-titre</label>
              <input
                type="text"
                value={partnersData.cta.subtitle}
                onChange={e => setData(prev => ({
                  ...prev,
                  partners: {
                    ...prev.partners,
                    cta: { ...prev.partners.cta, subtitle: e.target.value }
                  }
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
                placeholder="Ex: Rejoignez l'élite de la culture urbaine africaine"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Texte du Bouton</label>
              <input
                type="text"
                value={partnersData.cta.buttonText}
                onChange={e => setData(prev => ({
                  ...prev,
                  partners: {
                    ...prev.partners,
                    cta: { ...prev.partners.cta, buttonText: e.target.value }
                  }
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
                placeholder="Ex: Devenir Partenaire"
              />
            </div>

            <button
              onClick={async () => {
                setIsSaving(true);
                try {
                  await cmsService.saveData(data);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                } catch (error) {
                  console.error('Erreur lors de la sauvegarde:', error);
                  alert('Erreur lors de la sauvegarde des paramètres CTA');
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="w-full bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  Enregistrement...
                </>
              ) : (
                'Enregistrer CTA'
              )}
            </button>
          </div>

          {/* Aperçu CTA */}
          <div className="bg-surface-dark border border-primary/20 rounded-lg p-6 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-4xl text-white leading-tight">{partnersData.cta.title}</h2>
              <p className="text-slate-400 text-lg italic">{partnersData.cta.subtitle}</p>
              <button className="mt-4 px-8 py-3 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg font-bold uppercase tracking-widest">
                {partnersData.cta.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dossier Sponsoring */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="text-primary" size={24} />
          <h3 className="font-heading text-lg">Dossier de Sponsoring</h3>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lien du PDF (URL ou #)</label>
          <input
            type="text"
            value={partnersData.sponsoringPdfUrl}
            onChange={e => setData(prev => ({
              ...prev,
              partners: {
                ...prev.partners,
                sponsoringPdfUrl: e.target.value
              }
            }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all"
            placeholder="https://... ou # pour générer automatiquement"
          />
        </div>
        <p className="text-xs text-slate-500 italic mb-4">Le bouton "Dossier de Sponsoring" sur le site public utilisera ce lien. Si "#", le PDF será généré automatiquement.</p>

        <button
          onClick={async () => {
            setIsSaving(true);
            try {
              await cmsService.saveData(data);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            } catch (error) {
              console.error('Erreur lors de la sauvegarde:', error);
              alert('Erreur lors de la sauvegarde du dossier sponsoring');
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving}
          className="w-full bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
              Enregistrement...
            </>
          ) : (
            'Enregistrer le Lien'
          )}
        </button>
      </div>
    </div>
  );
}
