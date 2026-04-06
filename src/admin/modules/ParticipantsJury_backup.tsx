import React, { useState, useEffect } from 'react';
import { CMSData, Participant } from '../../types';
import { Plus, Trash2, Edit, Save, X, User, Globe, Instagram, Search } from 'lucide-react';

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

  const handleAdd = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: formData.name || '',
      country: formData.country || '',
      countryCode: formData.countryCode || '',
      specialty: formData.specialty || '',
      bio: formData.bio || '',
      photo: formData.photo || 'https://picsum.photos/seed/person/400/600',
      socialLinks: formData.socialLinks || {},
      category: formData.category || 'dancer'
    };
    setData(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
    setIsAdding(false);
    setFormData({});
    setCountrySearch('');
  };

  const handleUpdate = () => {
    setData(prev => ({
      ...prev,
      participants: prev.participants.map(p => p.id === editingId ? { ...p, ...formData } : p)
    }));
    setEditingId(null);
    setFormData({});
    setCountrySearch('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce participant ?')) {
      setData(prev => ({ ...prev, participants: prev.participants.filter(p => p.id !== id) }));
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

  const category = (formData.category || 'dancer') as Participant['category'];
  const showCountry = category === 'dancer' || category === 'judge' || category === 'dj' || category === 'mc';
  const showSpecialty = category !== 'judge';
  const specialtyLabel = category === 'dancer' ? 'Spécialité (Style)'
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
          {['all', 'dancer', 'judge', 'dj', 'mc'].map(cat => (
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
              {cat === 'all' ? 'Tous' : cat === 'dancer' ? 'Danseurs' : cat === 'judge' ? 'Juges' : cat.toUpperCase()}
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
            <button onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); setCountrySearch(''); }} className="text-slate-500 hover:text-white"><X size={20} /></button>
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
                value={formData.category || 'dancer'} 
                onChange={e => handleCategoryChange(e.target.value as Participant['category'])}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="dancer">Danseur (All Star)</option>
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Photo (URL)</label>
              <input 
                type="text" 
                value={formData.photo || ''} 
                onChange={e => setFormData({ ...formData, photo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
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
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-primary/20">
                <img src={participant.photo} alt={participant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(participant)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"><Edit size={16} /></button>
                <button onClick={() => handleDelete(participant.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-accent-red transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="text-lg font-bold">{participant.name}</h4>
            <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-3">{participant.category}</p>
            <div className="space-y-2 text-xs text-slate-400">
              {(participant.category === 'dancer' || participant.category === 'judge') && (
                <p className="flex items-center gap-2"><Globe size={12} /> {participant.country}</p>
              )}
              <p className="flex items-center gap-2"><User size={12} /> {participant.specialty}</p>
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
