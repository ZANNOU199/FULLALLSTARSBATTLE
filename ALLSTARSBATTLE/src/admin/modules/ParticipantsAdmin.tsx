import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User,
  Globe,
  Save,
  X,
  Loader2,
  Tag,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';
    instagram?: string;
    facebook?: string;
  };
}

const ParticipantsAdmin = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<Participant>>({
    name: '',
    country: '',
    category: 'b-boy',
    specialty: '',
    image: '',
    bio: '',
    socials: { instagram: '', facebook: '' }
  });
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

  useEffect(() => {
    fetchParticipants();

    // Listen for cache changes from other operations (addParticipant, updateParticipant, deleteParticipant)
    const handleCMSDataChanged = () => {
      console.log('ParticipantsAdmin: CMS data changed, reloading participants');
      fetchParticipants();
    };

    window.addEventListener('cmsDataChanged', handleCMSDataChanged);

    return () => {
      window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
    };
  }, []);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const data = await cmsService.getData();
      // Map API field names (photo, socialLinks) to component field names (image, socials)
      const mappedParticipants = data.participants.map((p: any) => ({
        id: p.id,
        name: p.name,
        country: p.country,
        category: p.category,
        specialty: p.specialty,
        image: p.photo || '', // Map photo to image
        bio: p.bio,
        socials: {
          instagram: p.socialLinks?.instagram || '',
          facebook: p.socialLinks?.facebook || ''
        }
      }));
      setParticipants(mappedParticipants);
      console.log('Participants loaded and mapped:', mappedParticipants);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (participant: Participant | null = null) => {
    if (participant) {
      setEditingParticipant(participant);
      setFormData(participant);
    } else {
      setEditingParticipant(null);
      setFormData({
        name: '',
        country: '',
        category: 'b-boy',
        specialty: '',
        image: '',
        bio: '',
        socials: { instagram: '', facebook: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const participantPayload = {
        name: formData.name,
        country: formData.country,
        category: formData.category,
        specialty: formData.specialty || '',
        image: formData.image || '',
        bio: formData.bio || '',
        countryCode: (formData as any).countryCode || '', // Preserve countryCode if available
      };

      console.log('Sending payload:', participantPayload);

      if (editingParticipant) {
        await cmsService.updateParticipant(editingParticipant.id, participantPayload);
      } else {
        await cmsService.addParticipant(participantPayload);
      }
      
      setIsModalOpen(false);
      await fetchParticipants(); // Reload the list
    } catch (error: any) {
      console.error('Failed to save participant:', error.response?.data || error.message);
      alert(`Erreur: ${error.response?.data?.error || error.message || 'Erreur lors de la sauvegarde'}`);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce participant ?')) {
      try {
        await cmsService.deleteParticipant(id);
        fetchParticipants(); // Reload the list
      } catch (error) {
        console.error('Failed to delete participant:', error);
        alert('Erreur lors de la suppression du participant');
      }
    }
  };

  const showSpecialty = formData.category !== 'crew';

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tight">Participants & Jury</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Gérez les B-Boys, B-Girls, Crews, juges, DJs et MCs</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={16} /> Ajouter un Participant
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-slate-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <Search className="text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou pays..." 
            className="bg-transparent border-none text-white text-sm w-full focus:ring-0 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'b-boy', 'b-girl', 'crew', 'judge', 'dj', 'mc'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filterCategory === cat 
                  ? 'bg-primary text-background-dark' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat === 'b-boy' ? 'B-Boy' : cat === 'b-girl' ? 'B-Girl' : cat === 'crew' ? 'Crew' : cat === 'judge' ? 'Juges' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map((p) => (
            <motion.div
              key={p.id}
              layout
              className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleOpenModal(p)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-primary hover:text-background-dark transition-all" aria-label="Modifier le participant"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all" aria-label="Supprimer le participant"><Trash2 size={16} /></button>
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                  <span className="bg-primary text-background-dark px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded self-start">
                    {p.category}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded self-start">
                    {p.country}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading text-white uppercase tracking-wide">{p.name}</h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">{p.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-heading text-white uppercase tracking-tight">{editingParticipant ? 'Modifier' : 'Ajouter'} Participant</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white" aria-label="Fermer la fenêtre modale"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom Complet</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pays</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catégorie</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})}>
                      <option value="b-boy">B-Boy</option>
                      <option value="b-girl">B-Girl</option>
                      <option value="crew">Crew</option>
                      <option value="judge">Juge</option>
                      <option value="dj">DJ</option>
                      <option value="mc">MC</option>
                    </select>
                  </div>
                  {showSpecialty && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spécialité</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Image du Participant</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setFormData({ ...formData, image: uploadedUrl });
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
                    {formData.image && !isUploading && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Upload size={16} />
                        Image uploadée avec succès
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Formats acceptés: JPEG, PNG, WebP, GIF (max 10MB)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biographie</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none resize-none" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-xs" aria-label="Annuler les modifications">Annuler</button>
                  <button type="submit" className="bg-primary text-background-dark px-10 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all" aria-label="Enregistrer les modifications">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantsAdmin;
