import React, { useState } from 'react';
import { CMSData, Company, FeaturedPiece } from '../../types';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Sparkles, Upload, Loader } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';

export default function SceneArtistique({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFeaturedPiece, setEditingFeaturedPiece] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [featuredFormData, setFeaturedFormData] = useState<Partial<FeaturedPiece>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (file: File, fieldName: string, isForFeatured: boolean) => {
    if (!UploadService.validateImageFile(file)) {
      alert('Fichier invalide. Seules les images (JPEG, PNG, WebP, GIF) de moins de 10MB sont acceptées.');
      return;
    }

    setIsUploading(true);
    setUploadingField(fieldName);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const fileName = UploadService.generateFileName(file.name);
      const uploadedUrl = await UploadService.uploadFile(file, fileName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (isForFeatured) {
        setFeaturedFormData({ ...featuredFormData, [fieldName]: uploadedUrl });
      } else {
        // Check if it's a gallery image
        if (fieldName.startsWith('gallery_')) {
          const currentGallery = formData.gallery || [];
          setFormData({ 
            ...formData, 
            gallery: [...currentGallery, uploadedUrl]
          });
        } else {
          setFormData({ ...formData, [fieldName]: uploadedUrl });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Erreur lors de l\'upload: ' + (error as Error).message);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadingField(null);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleAdd = async () => {
    if (editingId) {
      console.error('handleAdd called while in edit mode');
      return;
    }

    // For new companies, create with temporary ID just for local UI display
    // The real ID will be auto-generated on the backend
    const tempId = 'temp_' + Date.now();
    
    const newCompany: Company = {
      id: tempId,
      name: formData.name || '',
      choreographer: formData.choreographer || '',
      pieceTitle: formData.pieceTitle || '',
      description: formData.description || '',
      bio: formData.bio || '',
      mainImage: formData.mainImage || 'https://picsum.photos/seed/new/800/600',
      gallery: [],
      performanceDate: formData.performanceDate || '',
      performanceTime: formData.performanceTime || ''
    };
    
    // Update local state immediately for responsive UI
    const updatedData = { ...data, companies: [...data.companies, newCompany] };
    setData(updatedData);
    
    // Prepare data for backend:
    // - Send existing companies WITH their IDs
    // - Send new companies (temp_ IDs) WITHOUT the ID field (just omit it entirely)
    const existingCompanies = updatedData.companies.filter(c => !String(c.id).startsWith('temp_'));
    const newCompaniesToCreate = updatedData.companies
      .filter(c => String(c.id).startsWith('temp_'))
      .map(c => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...companyWithoutId } = c;
        return companyWithoutId as any;
      });
    
    const dataToSave: CMSData = {
      ...updatedData,
      companies: [...existingCompanies, ...newCompaniesToCreate]
    };
    
    // After save, fresh data is reloaded with real IDs from backend
    if (onSave) {
      await onSave(dataToSave);  // Use parent's save handler to prevent double auto-save
    } else {
      await cmsService.saveData(dataToSave);
    }
    
    setIsAdding(false);
    setFormData({});
  };

  const handleUpdate = async () => {
    if (!editingId) {
      console.error('handleUpdate called without editingId');
      return;
    }

    const updatedData = {
      ...data,
      companies: data.companies.map(c => c.id === editingId ? { ...c, ...formData } : c)
    };
    setData(updatedData);
    if (onSave) {
      await onSave(updatedData);
    } else {
      await cmsService.saveData(updatedData);
    }
    
    setEditingId(null);
    setFormData({});
  };

  const handleUpdateFeaturedPiece = async () => {
    const updatedData = {
      ...data,
      featuredPiece: {
        ...data.featuredPiece,
        ...featuredFormData
      } as FeaturedPiece
    };
    setData(updatedData);
    if (onSave) {
      await onSave(updatedData);
    } else {
      await cmsService.saveData(updatedData);
    }
    
    setEditingFeaturedPiece(false);
    setFeaturedFormData({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) {
      const updatedData = { ...data, companies: data.companies.filter(c => c.id !== id) };
      setData(updatedData);
      if (onSave) {
        await onSave(updatedData);
      } else {
        await cmsService.saveData(updatedData);
      }
    }
  };

  const startAdd = () => {
    cleanupLocalStorage(); // Clean up any stale data
    setIsAdding(true);
    setEditingId(null);
    setFormData({}); // Clear any previous data
  };

  const startEdit = (company: Company) => {
    cleanupLocalStorage(); // Clean up any stale data
    setEditingId(company.id);
    setFormData(company);
    setIsAdding(false);
  };

  const startEditFeaturedPiece = () => {
    setEditingFeaturedPiece(true);
    setFeaturedFormData(data.featuredPiece || {});
  };

  // Clean up any stale localStorage data that might cause persistence issues
  const cleanupLocalStorage = () => {
    try {
      // Remove any stale form data or temporary company data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('temp_company') || key.includes('formData') || key.includes('cms_backup'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* SECTION MISE EN LUMIÈRE */}
      <div className="bg-gradient-to-r from-primary/20 to-accent-red/20 border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-heading text-white">Mise en Lumière (Pièce Vedette)</h3>
          </div>
          <button 
            onClick={startEditFeaturedPiece}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
          >
            <Edit size={18} /> Modifier
          </button>
        </div>

        {editingFeaturedPiece && (
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
            <h4 className="font-heading text-lg text-white">Éditer la Pièce Vedette</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre</label>
                <input 
                  type="text" 
                  value={featuredFormData.title || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: L'ÉVEIL DES OMBRES"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Durée</label>
                <input 
                  type="text" 
                  value={featuredFormData.duration || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, duration: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: 45 MIN"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chorégraphe</label>
                <input 
                  type="text" 
                  value={featuredFormData.choreographer || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, choreographer: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: K. AFRIKA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Musique</label>
                <input 
                  type="text" 
                  value={featuredFormData.music || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, music: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: LIVE DJ SET"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image (Upload)</label>
                <div className="flex gap-3">
                  <label className="flex-1 relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'image', true);
                      }}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl p-4 hover:bg-white/10 transition-all text-center">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        {uploadingField === 'image' && isUploading ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Téléchargement: {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            Cliquez pour uploader l'image
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                  {featuredFormData.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                      <img src={featuredFormData.image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description Courte</label>
                <textarea 
                  rows={3}
                  value={featuredFormData.description || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Description affichée sur la page"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Synopsis Complet</label>
                <textarea 
                  rows={5}
                  value={featuredFormData.fullSynopsis || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, fullSynopsis: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Synopsis détaillé affiché quand on clique sur 'Synopsis complet'"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Note d'intention (Citation)</label>
                <textarea 
                  rows={3}
                  value={featuredFormData.intentionQuote || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, intentionQuote: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  placeholder="La citation du chorégraphe sur sa vision de la pièce"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Auteur de la citation</label>
                <input 
                  type="text" 
                  value={featuredFormData.intentionAuthor || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, intentionAuthor: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: K. Afrika, Chorégraphe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Interprètes</label>
                <input 
                  type="text" 
                  value={featuredFormData.performers || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, performers: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: 8 B-Boys & B-Girls"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Technologie</label>
                <input 
                  type="text" 
                  value={featuredFormData.technology || ''} 
                  onChange={e => setFeaturedFormData({ ...featuredFormData, technology: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  placeholder="Ex: Motion Capture Live"
                />
              </div>
            </div>

            {featuredFormData.image && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aperçu</label>
                <img src={featuredFormData.image} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-white/10" />
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => setEditingFeaturedPiece(false)}
                className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdateFeaturedPiece}
                className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </div>
        )}

        {!editingFeaturedPiece && data.featuredPiece && (
          <div className="bg-[#111] border border-white/5 p-6 rounded-xl">
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img src={data.featuredPiece.image} alt={data.featuredPiece.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-heading text-white mb-2">{data.featuredPiece.title}</h4>
                <div className="flex flex-wrap gap-6 mb-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Durée</p>
                    <p className="text-white font-bold">{data.featuredPiece.duration}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Chorégraphe</p>
                    <p className="text-white font-bold">{data.featuredPiece.choreographer}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Musique</p>
                    <p className="text-white font-bold">{data.featuredPiece.music}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm italic">{data.featuredPiece.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION COMPAGNIES */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading">Gestion des Compagnies</h3>
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
          >
            <Plus size={18} /> Ajouter une Compagnie
          </button>
        </div>

        {(isAdding || editingId) && (
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6 mb-6">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-lg">{isAdding ? 'Nouvelle Compagnie' : 'Modifier Compagnie'}</h4>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-500 hover:text-white" aria-label="Fermer la fenêtre"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom de la Compagnie</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chorégraphe</label>
                <input 
                  type="text" 
                  value={formData.choreographer || ''} 
                  onChange={e => setFormData({ ...formData, choreographer: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de la Pièce</label>
                <input 
                  type="text" 
                  value={formData.pieceTitle || ''} 
                  onChange={e => setFormData({ ...formData, pieceTitle: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image Principale (Upload)</label>
                <div className="flex gap-3">
                  <label className="flex-1 relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'mainImage', false);
                      }}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl p-4 hover:bg-white/10 transition-all text-center">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        {uploadingField === 'mainImage' && isUploading ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Téléchargement: {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            Cliquez pour uploader l'image
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                  {formData.mainImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.mainImage} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Galerie d'Images (Upload Multiple)</label>
                <div className="space-y-4">
                  <label className="flex-1 relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          if (file) {
                            handleFileUpload(file, `gallery_${Date.now()}_${Math.random()}`, false);
                          }
                        });
                      }}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl p-6 hover:bg-white/10 transition-all text-center cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        {isUploading && uploadingField?.startsWith('gallery') ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Téléchargement: {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            Cliquez ou glissez des images pour la galerie
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                  
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {formData.gallery.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10">
                            <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                          </div>
                          <button 
                            onClick={() => {
                              setFormData({
                                ...formData,
                                gallery: formData.gallery?.filter((_, i) => i !== idx) || []
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-accent-red text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description Longue</label>
                <textarea 
                  rows={4}
                  value={formData.description || ''} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Biographie</label>
                <textarea 
                  rows={3}
                  value={formData.bio || ''} 
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date de Passage</label>
                <input 
                  type="date" 
                  value={formData.performanceDate || ''} 
                  onChange={e => setFormData({ ...formData, performanceDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heure de Passage</label>
                <input 
                  type="time" 
                  value={formData.performanceTime || ''} 
                  onChange={e => setFormData({ ...formData, performanceTime: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }}
                className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
              <button 
                onClick={isAdding ? handleAdd : handleUpdate}
                className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {data.companies.map(company => (
            <div key={company.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center gap-6 group hover:border-white/10 transition-all">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                <img src={company.mainImage} alt={company.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold">{company.name}</h4>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{company.pieceTitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(company)}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(company.id)}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-accent-red transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2"><Edit size={12} /> {company.choreographer}</span>
                  <span className="flex items-center gap-2"><ImageIcon size={12} /> {company.gallery.length} Photos</span>
                  <span className="flex items-center gap-2 text-primary">{company.performanceDate} à {company.performanceTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
