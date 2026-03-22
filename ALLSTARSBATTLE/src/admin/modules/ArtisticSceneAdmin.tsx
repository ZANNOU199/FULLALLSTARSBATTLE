import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X,
  Loader2,
  Globe,
  User,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { UploadService } from '../../services/uploadService';

interface Company {
  id: string;
  name: string;
  choreographer: string;
  piece: string;
  origin: string;
  image: string;
  description: string;
  bio: string;
  performances: string[];
}

const ArtisticSceneAdmin = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    choreographer: '',
    piece: '',
    origin: '',
    image: '',
    description: '',
    bio: '',
    performances: []
  });  const [isUploading, setIsUploading] = useState(false);
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
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would fetch from Laravel
      // const response = await api.get('/artistic-scene');
      // setCompanies(response.data);
      
      // For now, let's simulate with mock data if the API isn't ready
      setTimeout(() => {
        setCompanies([
          {
            id: '1',
            name: 'Compagnie Käfig',
            choreographer: 'Mourad Merzouki',
            piece: 'PIXEL',
            origin: 'FRANCE',
            image: 'https://picsum.photos/seed/kafig/800/600',
            description: 'Fusion entre danse et arts numériques.',
            bio: 'Mourad Merzouki est un pionnier du hip-hop.',
            performances: ['15 Juillet - 20h30']
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setIsLoading(false);
    }
  };

  const handleOpenModal = (company: Company | null = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        choreographer: '',
        piece: '',
        origin: '',
        image: '',
        description: '',
        bio: '',
        performances: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCompany) {
        // await api.put(`/artistic-scene/${editingCompany.id}`, formData);
        setCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...formData } as Company : c));
      } else {
        // const response = await api.post('/artistic-scene', formData);
        const newCompany = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Company;
        setCompanies([...companies, newCompany]);
      }
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving company:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compagnie ?')) {
      setIsLoading(true);
      try {
        // await api.delete(`/artistic-scene/${id}`);
        setCompanies(companies.filter(c => c.id !== id));
        setIsLoading(false);
      } catch (error) {
        console.error('Error deleting company:', error);
        setIsLoading(false);
      }
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.choreographer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tight">Gestion Scène Artistique</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Gérez les compagnies et les spectacles chorégraphiques</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={16} /> Ajouter une Compagnie
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
        <Search className="text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher une compagnie ou un chorégraphe..." 
          className="bg-transparent border-none text-white text-sm w-full focus:ring-0 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Chargement des données...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <motion.div
              key={company.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={company.image} 
                  alt={company.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(company)}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-primary hover:text-background-dark transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(company.id)}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary text-background-dark px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded">
                    {company.origin}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-heading text-white uppercase tracking-wide">{company.name}</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">{company.choreographer}</p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Music size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">"{company.piece}"</span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {company.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                <h2 className="text-2xl font-heading text-white uppercase tracking-tight">
                  {editingCompany ? 'Modifier Compagnie' : 'Nouvelle Compagnie'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} /> Nom de la Compagnie
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                        placeholder="Ex: Compagnie Käfig"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User size={12} /> Chorégraphe
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                        placeholder="Ex: Mourad Merzouki"
                        value={formData.choreographer}
                        onChange={(e) => setFormData({...formData, choreographer: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Music size={12} /> Titre de la Pièce
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                        placeholder="Ex: PIXEL"
                        value={formData.piece}
                        onChange={(e) => setFormData({...formData, piece: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Globe size={12} /> Origine (Pays)
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                        placeholder="Ex: FRANCE"
                        value={formData.origin}
                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Media & Description */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ImageIcon size={12} /> Image de la Compagnie
                      </label>
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
                        {formData.image && (
                          <div className="flex justify-center">
                            <img src={formData.image} alt="Aperçu" className="max-w-32 max-h-32 object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Description Courte</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all resize-none"
                        placeholder="Résumé de la pièce..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Biographie du Chorégraphe</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all resize-none"
                        placeholder="Parcours du chorégraphe..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-background-dark px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary/10"
                  >
                    <Save size={16} /> Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtisticSceneAdmin;
