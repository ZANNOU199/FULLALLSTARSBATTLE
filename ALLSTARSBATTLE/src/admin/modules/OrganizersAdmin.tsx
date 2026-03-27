import React, { useState, useRef } from 'react';
import { CMSData, Organizer, OrganizersConfig } from '../../types';
import { Plus, Trash2, Edit, Save, X, Users, Settings, Instagram, Facebook, Twitter, Linkedin, Upload } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';

export default function OrganizersAdmin({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState(false);
  const [formData, setFormData] = useState<Partial<Organizer>>({});
  const [configFormData, setConfigFormData] = useState<Partial<OrganizersConfig>>({});
  const [selectedOrganizerDetail, setSelectedOrganizerDetail] = useState<Organizer | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

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

  const organizers = data.organizers || [];
  const organizersConfig = data.organizersConfig || {
    sectionTitle: 'L\'EQUIPE ORGANISATION',
    sectionDescription: 'Derrière le plus grand événement de breaking d\'Afrique de l\'Ouest, se trouve une équipe passionnée d\'activistes culturels et d\'experts en événementiel.',
    organizationName: 'ASB Togo 2026'
  };

  const handleUpdateConfig = () => {
    const updatedData = {
      ...data,
      organizersConfig: {
        ...data.organizersConfig,
        ...configFormData
      }
    };
    
    setData(updatedData);
    
    // Save to database
    if (onSave) {
      onSave(updatedData);
    } else {
      cmsService.saveData(updatedData);
    }
    
    setEditingConfig(false);
    setConfigFormData({});
  };

  const startEdit = (organizer: Organizer) => {
    setEditingId(organizer.id);
    setFormData(organizer);
    
    // Scroll vers le formulaire après un léger délai pour que le rendu soit fait
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ajouter une animation de highlight
      formRef.current?.classList.add('animate-pulse');
      setTimeout(() => {
        formRef.current?.classList.remove('animate-pulse');
      }, 2000);
    }, 100);
  };

  const startAdd = () => {
    setIsAdding(true);
    setFormData({});
    
    // Scroll vers le formulaire après un léger délai pour que le rendu soit fait
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ajouter une animation de highlight
      formRef.current?.classList.add('animate-pulse');
      setTimeout(() => {
        formRef.current?.classList.remove('animate-pulse');
      }, 2000);
    }, 100);
  };

  const handleAdd = () => {
    console.log('handleAdd called with formData:', formData);
    
    if (!formData.name || !formData.role) {
      alert('Veuillez remplir le nom et le rôle');
      return;
    }
    
    const newOrganizer: Organizer = {
      name: formData.name || '',
      role: formData.role || '',
      bio: formData.bio || '',
      photo: formData.photo || 'https://picsum.photos/seed/organizer/400/500',
      socialLinks: formData.socialLinks || {}
    };
    
    console.log('New organizer created:', newOrganizer);
    
    const updatedData = {
      ...data,
      organizers: [...(data.organizers || []), newOrganizer]
    };
    
    console.log('Updated data:', updatedData);
    
    setData(updatedData);
    
    // Save to database
    if (onSave) {
      console.log('Calling onSave with updatedData');
      onSave(updatedData);
    } else {
      console.log('Calling cmsService.saveData directly');
      cmsService.saveData(updatedData);
    }
    
    setIsAdding(false);
    setFormData({});
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.role) {
      alert('Veuillez remplir le nom et le rôle');
      return;
    }
    
    const updatedData = {
      ...data,
      organizers: data.organizers?.map(o => 
        o.id === editingId 
          ? { ...o, ...formData } 
          : o
      ) || []
    };
    
    setData(updatedData);
    
    // Save to database
    if (onSave) {
      onSave(updatedData);
    } else {
      cmsService.saveData(updatedData);
    }
    
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet organisateur ?')) {
      const updatedData = {
        ...data,
        organizers: data.organizers?.filter(o => o.id !== id) || []
      };
      
      setData(updatedData);
      
      // Save to database
      if (onSave) {
        onSave(updatedData);
      } else {
        cmsService.saveData(updatedData);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/20 to-accent-red/20 border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-heading text-white">L'Équipe Organisation</h3>
          </div>
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
        <p className="text-slate-400 text-sm mt-3">Gérez les membres de l'équipe organisation du All Star Battle</p>
      </div>

      {/* Section Configuration */}
      <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-heading text-white">Paramètres de la Section</h3>
          </div>
          <button 
            onClick={() => {
              setEditingConfig(true);
              setConfigFormData(organizersConfig);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
          >
            <Edit size={18} /> Modifier
          </button>
        </div>

        {editingConfig ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titre de la section</label>
              <input 
                type="text" 
                value={configFormData.sectionTitle || ''} 
                onChange={e => setConfigFormData({ ...configFormData, sectionTitle: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-400 outline-none transition-all text-white"
                placeholder="L'EQUIPE ORGANISATION"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description de la section</label>
              <textarea 
                rows={3}
                value={configFormData.sectionDescription || ''} 
                onChange={e => setConfigFormData({ ...configFormData, sectionDescription: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-400 outline-none transition-all text-white resize-none"
                placeholder="Derrière le plus grand événement..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom de l'organisation</label>
              <input 
                type="text" 
                value={configFormData.organizationName || ''} 
                onChange={e => setConfigFormData({ ...configFormData, organizationName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-400 outline-none transition-all text-white"
                placeholder="ASB Togo 2026"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => {
                  setEditingConfig(false);
                  setConfigFormData({});
                }}
                className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdateConfig}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Titre</p>
              <p className="text-white font-semibold">{organizersConfig.sectionTitle}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Description</p>
              <p className="text-white">{organizersConfig.sectionDescription}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Organisation</p>
              <p className="text-white font-semibold">{organizersConfig.organizationName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/édition */}
      {(isAdding || editingId) && (
        <div 
          ref={formRef}
          className="bg-[#111] border-2 border-primary p-8 rounded-2xl space-y-6 shadow-[0_0_30px_rgba(211,95,23,0.3)] transition-all"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-heading text-lg text-white">
              {editingId ? 'Modifier l\'organisateur' : 'Ajouter un organisateur'}
            </h4>
            <button 
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({});
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom</label>
              <input 
                type="text" 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="Ex: Elom Kodjo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rôle/Titre</label>
              <input 
                type="text" 
                value={formData.role || ''} 
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="Ex: Directeur Fondateur & Producteur"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Biographie</label>
              <textarea 
                rows={4}
                value={formData.bio || ''} 
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                placeholder="Décrivez le rôle et l'expertise de cette personne..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Photo de l'Organisateur</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const uploadedUrl = await handleFileUpload(file);
                        setFormData({ ...formData, photo: uploadedUrl });
                      } catch (error) {
                        alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                      }
                    }
                  }}
                  disabled={isUploading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
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
                {formData.photo && !isUploading && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Upload size={16} />
                    Image uploadée avec succès
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500">Formats acceptés: JPEG, PNG, WebP, GIF (max 10MB)</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Instagram</label>
              <input 
                type="text" 
                value={formData.socialLinks?.instagram || ''} 
                onChange={e => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Facebook</label>
              <input 
                type="text" 
                value={formData.socialLinks?.facebook || ''} 
                onChange={e => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Twitter</label>
              <input 
                type="text" 
                value={formData.socialLinks?.twitter || ''} 
                onChange={e => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">LinkedIn</label>
              <input 
                type="text" 
                value={formData.socialLinks?.linkedin || ''} 
                onChange={e => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                placeholder="username"
              />
            </div>
          </div>

          {formData.photo && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aperçu</label>
              <img 
                src={formData.photo} 
                alt="Preview" 
                className="w-32 h-40 object-cover rounded-xl border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=Photo';
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button 
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({});
              }}
              className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
            >
              Annuler
            </button>
            <button 
              onClick={editingId ? handleUpdate : handleAdd}
              className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold transition-all text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <Save size={16} /> {editingId ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {/* Liste des organisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizers.map(organizer => (
          <div 
            key={organizer.id}
            className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group"
          >
            <div 
              className="relative w-full h-48 bg-black overflow-hidden cursor-pointer"
              onClick={() => setSelectedOrganizerDetail(organizer)}
            >
              <img 
                src={organizer.photo} 
                alt={organizer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Photo';
                }}
              />
            </div>

            <div className="p-6 space-y-4">
              <div 
                className="cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setSelectedOrganizerDetail(organizer)}
              >
                <h4 className="text-lg font-heading text-white">{organizer.name}</h4>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{organizer.role}</p>
              </div>

              <p className="text-sm text-slate-400 line-clamp-3">{organizer.bio}</p>

              {organizer.socialLinks && (
                <div className="flex gap-4 pt-2 flex-wrap">
                  {organizer.socialLinks.instagram && (
                    <a href={`https://instagram.com/${organizer.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-pink-400 transition-colors" title="Instagram">
                      <Instagram size={14} /> @{organizer.socialLinks.instagram}
                    </a>
                  )}
                  {organizer.socialLinks.facebook && (
                    <a href={`https://facebook.com/${organizer.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-400 transition-colors" title="Facebook">
                      <Facebook size={14} /> {organizer.socialLinks.facebook}
                    </a>
                  )}
                  {organizer.socialLinks.twitter && (
                    <a href={`https://twitter.com/${organizer.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-sky-400 transition-colors" title="Twitter">
                      <Twitter size={14} /> @{organizer.socialLinks.twitter}
                    </a>
                  )}
                  {organizer.socialLinks.linkedin && (
                    <a href={`https://linkedin.com/in/${organizer.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-500 transition-colors" title="LinkedIn">
                      <Linkedin size={14} /> {organizer.socialLinks.linkedin}
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => startEdit(organizer)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/20 text-primary rounded-lg font-bold text-xs uppercase hover:bg-primary/30 transition-all"
                >
                  <Edit size={14} /> Modifier
                </button>
                <button 
                  onClick={() => handleDelete(organizer.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold text-xs uppercase hover:bg-red-500/30 transition-all"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {organizers.length === 0 && !isAdding && (
        <div className="text-center py-12 bg-[#111] border border-white/5 rounded-2xl">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-6">Aucun organisateur ajouté pour le moment</p>
          <button 
            onClick={startAdd}
            className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold transition-all"
          >
            Ajouter le premier organisateur
          </button>
        </div>
      )}

      {/* Modal Détails Organisateur */}
      {selectedOrganizerDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111]/95 backdrop-blur border-b border-white/10 flex justify-between items-center p-6">
              <h2 className="text-2xl font-heading text-white">{selectedOrganizerDetail.name}</h2>
              <button 
                onClick={() => setSelectedOrganizerDetail(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Photo */}
              <div className="flex justify-center">
                <img 
                  src={selectedOrganizerDetail.photo} 
                  alt={selectedOrganizerDetail.name}
                  className="w-full max-w-sm h-96 object-cover rounded-2xl border border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Photo';
                  }}
                />
              </div>

              {/* Rôle & Organisation */}
              <div className="space-y-4 text-center">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-2">Rôle/Titre</p>
                  <p className="text-lg text-primary font-bold">{selectedOrganizerDetail.role}</p>
                </div>
              </div>

              {/* Biographie */}
              <div className="space-y-3">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Biographie</p>
                <p className="text-white leading-relaxed text-base">{selectedOrganizerDetail.bio}</p>
              </div>

              {/* Réseaux Sociaux */}
              {selectedOrganizerDetail.socialLinks && Object.keys(selectedOrganizerDetail.socialLinks).length > 0 && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Réseaux Sociaux</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrganizerDetail.socialLinks.instagram && (
                      <a 
                        href={`https://instagram.com/${selectedOrganizerDetail.socialLinks.instagram}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 rounded-xl transition-all group"
                      >
                        <Instagram size={24} className="text-pink-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Instagram</p>
                          <p className="text-white">@{selectedOrganizerDetail.socialLinks.instagram}</p>
                        </div>
                      </a>
                    )}
                    {selectedOrganizerDetail.socialLinks.facebook && (
                      <a 
                        href={`https://facebook.com/${selectedOrganizerDetail.socialLinks.facebook}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all group"
                      >
                        <Facebook size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Facebook</p>
                          <p className="text-white">{selectedOrganizerDetail.socialLinks.facebook}</p>
                        </div>
                      </a>
                    )}
                    {selectedOrganizerDetail.socialLinks.twitter && (
                      <a 
                        href={`https://twitter.com/${selectedOrganizerDetail.socialLinks.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 rounded-xl transition-all group"
                      >
                        <Twitter size={24} className="text-sky-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Twitter</p>
                          <p className="text-white">@{selectedOrganizerDetail.socialLinks.twitter}</p>
                        </div>
                      </a>
                    )}
                    {selectedOrganizerDetail.socialLinks.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${selectedOrganizerDetail.socialLinks.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-600/30 rounded-xl transition-all group"
                      >
                        <Linkedin size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">LinkedIn</p>
                          <p className="text-white">{selectedOrganizerDetail.socialLinks.linkedin}</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Bouton Fermer */}
              <button 
                onClick={() => setSelectedOrganizerDetail(null)}
                className="w-full mt-8 px-6 py-3 bg-primary text-background-dark rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(211,95,23,0.4)]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
