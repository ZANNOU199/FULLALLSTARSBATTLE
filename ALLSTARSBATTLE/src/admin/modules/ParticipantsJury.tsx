import React, { useState, useEffect } from 'react';
import { CMSData, Participant } from '../../types';
import { Plus, Trash2, Edit, Save, X, User, Globe, Instagram, Search } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';

interface Country {
  name: string;
  code: string;
  flag: string;
}

export default function ParticipantsJury({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Participant>>({});
  const [filter, setFilter] = useState<Participant['category'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width < 768) return setItemsPerPage(2);
    if (width < 1024) return setItemsPerPage(4);
    return setItemsPerPage(6);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
        const data = await response.json();
        const formattedCountries = data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2.toLowerCase(),
          flag: country.flag
        })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback countries
        setCountries([
          { name: 'France', code: 'fr', flag: '🇫🇷' },
          { name: 'États-Unis', code: 'us', flag: '🇺🇸' },
          { name: 'Togo', code: 'tg', flag: '🇹🇬' },
          { name: 'Japon', code: 'jp', flag: '🇯🇵' },
          { name: 'Chine', code: 'cn', flag: '🇨🇳' },
          { name: 'Ukraine', code: 'ua', flag: '🇺🇦' },
          { name: 'Pays-Bas', code: 'nl', flag: '🇳🇱' },
          { name: 'Taïwan', code: 'tw', flag: '🇹🇼' }
        ]);
      }
    };
    fetchCountries();
  }, []);

  // Listen for changes from ParticipantsAdmin (when participants are created/updated/deleted)
  useEffect(() => {
    const handleCMSDataChanged = async () => {
      console.log('ParticipantsJury: CMS data changed, reloading from API');
      try {
        const updatedData = await cmsService.getData();
        setData(updatedData);
      } catch (error) {
        console.error('Failed to reload participants:', error);
      }
    };
    
    window.addEventListener('cmsDataChanged', handleCMSDataChanged);
    return () => window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
  }, [setData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update country search when form data changes
  useEffect(() => {
    if (formData.country && !countrySearch) {
      setCountrySearch(formData.country);
    }
  }, [formData.country, countrySearch]);

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

  const handleAdd = async () => {
    try {
      const payload = {
        name: formData.name || '',
        country: formData.country || '',
        category: formData.category || 'b-boy',
        specialty: formData.specialty || '',
        bio: formData.bio || '',
        image: formData.photo || '',
        countryCode: formData.countryCode || '',
      };
      
      console.log('ParticipantsJury: Creating participant via API:', payload);
      await cmsService.addParticipant(payload);
      
      setIsAdding(false);
      setFormData({});
      setCountrySearch('');
      alert('Participant créé avec succès!');
    } catch (error: any) {
      console.error('Failed to add participant:', error);
      alert('Erreur lors de la création du participant');
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const payload = {
        name: formData.name || '',
        country: formData.country || '',
        category: formData.category || 'b-boy',
        specialty: formData.specialty || '',
        bio: formData.bio || '',
        image: formData.photo || '',
        countryCode: formData.countryCode || '',
      };
      
      console.log('ParticipantsJury: Updating participant via API:', editingId, payload);
      await cmsService.updateParticipant(editingId, payload);
      
      setEditingId(null);
      setFormData({});
      alert('Participant mis à jour avec succès!');
    } catch (error: any) {
      console.error('Failed to update participant:', error);
      alert('Erreur lors de la mise à jour du participant');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce participant ?')) {
      try {
        console.log('ParticipantsJury: Deleting participant via API:', id);
        await cmsService.deleteParticipant(id);
        alert('Participant supprimé avec succès!');
      } catch (error: any) {
        console.error('Failed to delete participant:', error);
        alert('Erreur lors de la suppression du participant');
      }
    }
  };

  const startEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setFormData(participant);
    setCountrySearch(participant.country || '');
  };

  const filteredParticipants = filter === 'all' 
    ? data.participants 
    : data.participants.filter(p => p.category === filter);

  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / itemsPerPage));
  const paginatedParticipants = filteredParticipants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const category = (formData.category || 'b-boy') as Participant['category'];
  const showCountry = category === 'b-boy' || category === 'b-girl' || category === 'crew' || category === 'judge' || category === 'dj' || category === 'mc';
  const showSpecialty = category === 'b-boy' || category === 'b-girl';
  const specialtyLabel = category === 'b-boy' || category === 'b-girl' ? 'Spécialité (Style)'
    : category === 'dj' ? 'Genre / Set'
    : category === 'mc' ? 'Voix'
    : '';

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setFormData({
      ...formData,
      country: country.name,
      countryCode: country.code
    });
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };



  const handleCategoryChange = (newCategory: Participant['category']) => {
    setFormData({
      ...formData,
      category: newCategory,
      specialty: '' // Reset specialty when category changes
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          {['all', 'b-boy', 'b-girl', 'crew', 'judge', 'dj', 'mc'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === cat ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat === 'b-boy' ? 'B-Boy' : cat === 'b-girl' ? 'B-Girl' : cat === 'crew' ? 'Crew' : cat === 'judge' ? 'Juges' : cat.toUpperCase()}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-heading text-lg">{isAdding ? 'Nouveau Participant' : 'Modifier Participant'}</h4>
            <button onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); setCountrySearch(''); }} className="text-slate-500 hover:text-white" aria-label="Fermer la fenêtre d'ajout"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom Complet</label>
              <input 
                type="text" 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Catégorie</label>
              <select 
                value={formData.category || 'b-boy'} 
                onChange={e => handleCategoryChange(e.target.value as Participant['category'])}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="b-boy">B-Boy</option>
                <option value="b-girl">B-Girl</option>
                <option value="crew">Crew</option>
                <option value="judge">Juge</option>
                <option value="dj">DJ</option>
                <option value="mc">MC</option>
              </select>
            </div>
            {showCountry && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pays</label>
                <div className="relative country-dropdown">
                  <div className="relative">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={e => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder="Rechercher un pays..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-10 focus:border-primary outline-none transition-all"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                  {showCountryDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl max-h-48 overflow-y-auto">
                      {filteredCountries.map(country => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full text-left px-4 py-2 hover:bg-white/5 transition-all flex items-center gap-3"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm">{country.name}</span>
                          <span className="text-xs text-slate-500 ml-auto">{country.code.toUpperCase()}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="px-4 py-2 text-slate-500 text-sm">Aucun pays trouvé</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {showSpecialty && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{specialtyLabel}</label>
                <input 
                  type="text" 
                  value={formData.specialty || ''} 
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Photo du Participant</label>
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
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <img src={formData.photo} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">Image uploadée</p>
                      <p className="text-xs text-slate-500 truncate">{formData.photo}</p>
                    </div>
                  </div>
                )}
              </div>
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
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); setCountrySearch(''); }}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedParticipants.map(participant => (
          <div key={participant.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-primary/20 flex items-center justify-center">
                {participant.photo ? (
                  <img src={participant.photo} alt={participant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-bold text-slate-500">{participant.name.split(' ')[0][0]}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(participant)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all" aria-label="Modifier le participant"><Edit size={16} /></button>
                <button onClick={() => handleDelete(participant.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-accent-red transition-all" aria-label="Supprimer le participant"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-lg font-bold">{participant.name}</h4>
            <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-3">{participant.category}</p>
            <div className="space-y-2 text-xs text-slate-400">
              {(participant.category === 'dancer' || participant.category === 'judge') && (
                <p className="flex items-center gap-2"><Globe size={12} /> {participant.country}</p>
              )}
              {participant.specialty && (
                <p className="flex items-center gap-2"><User size={12} /> {participant.specialty}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-bold uppercase tracking-widest"
          >
            Précédent
          </button>
          <span className="text-[10px] font-bold text-slate-400">Page {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-bold uppercase tracking-widest"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
