import React, { useState } from 'react';
import { CMSData, TimelineEvent, Legend } from '../../types';
import { Plus, Trash2, Edit, Save, X, History, User, AlertCircle } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { UploadService } from '../../services/uploadService';
import { motion } from 'motion/react';

export default function HistoryLegends({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'legends' | 'config'>('timeline');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timelineFormData, setTimelineFormData] = useState<Partial<TimelineEvent>>({});
  const [legendFormData, setLegendFormData] = useState<Partial<Legend>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [configFormData, setConfigFormData] = useState({
    hero: data.history.hero || {
      sinceYear: '2013',
      totalEditions: '12',
      title: 'L\'HISTOIRE',
      titleHighlight: 'DE ALLSTARBATTLE',
      description: 'Tracing the evolution of urban-luxury breakdance from Genesis to the Global Stage.'
    },
    stats: data.history.stats || {
      years: '13',
      editions: '12',
      countries: '45+',
      participants: '500+',
      prize: '10M'
    },
    wallOfFame: data.history.wallOfFame || {
      title: 'WALL OF FAME',
      subtitle: 'The Legends Who Defined ASB'
    }
  });

  // Save current data to backend
  const saveToBackend = async (dataToSave: CMSData) => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await cmsService.saveData(dataToSave);
      setSaveMessage({ type: 'success', text: 'Données sauvegardées avec succès!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde. Réessayez.' });
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleAddTimeline = async () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      year: timelineFormData.year || '',
      title: timelineFormData.title || '',
      champion: timelineFormData.champion || '',
      description: timelineFormData.description || '',
      image: timelineFormData.image || 'https://picsum.photos/seed/hist/800/600'
    };
    const updatedData = { ...data, history: { ...data.history, timeline: [...data.history.timeline, newEvent] } };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
      setIsAdding(false); // Fermer le formulaire après enregistrement
      setTimelineFormData({});
      setEditingId(null); // Réinitialiser l'édition
    } catch (error) {
      console.error('Failed to add timeline event:', error);
      // Don't update local state if backend fails
    }
  };

  const handleEditTimeline = async () => {
    if (!editingId) return;
    const updatedData = {
      ...data,
      history: {
        ...data.history,
        timeline: data.history.timeline.map(e =>
          e.id === editingId ? { ...e, ...timelineFormData } : e
        )
      }
    };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
      setIsAdding(false); // Fermer le formulaire après enregistrement
      setTimelineFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Failed to edit timeline event:', error);
      // Don't update local state if backend fails
    }
  };

  const startEditTimeline = (event: TimelineEvent) => {
    setEditingId(event.id);
    setTimelineFormData(event);
    setIsAdding(true); // Ouvrir le formulaire automatiquement
  };

  const handleAddLegend = async () => {
    const newLegend: Legend = {
      id: Date.now().toString(),
      name: legendFormData.name || '',
      bio: legendFormData.bio || '',
      photo: legendFormData.photo || 'https://picsum.photos/seed/legend/400/600',
      title: legendFormData.title || '',
      category: legendFormData.category as 'bboy' | 'bgirl' | 'crew' | undefined || 'bboy',
      year: legendFormData.year || new Date().getFullYear(),
      type: legendFormData.type as 'champion-1v1' | 'footwork' | 'powermoves' | 'last-chance' | 'crew-vs-crew' | '2v2' | undefined
    };
    const updatedData = { ...data, history: { ...data.history, legends: [...data.history.legends, newLegend] } };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
      setIsAdding(false);
      setLegendFormData({});
    } catch (error) {
      console.error('Failed to add legend:', error);
      // Don't update local state if backend fails
    }
  };

  const handleEditLegend = async () => {
    if (!editingId) return;
    const updatedData = {
      ...data,
      history: {
        ...data.history,
        legends: data.history.legends.map(l =>
          l.id === editingId ? { ...l, ...legendFormData } : l
        )
      }
    };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
      setEditingId(null);
      setLegendFormData({});
    } catch (error) {
      console.error('Failed to edit legend:', error);
      // Don't update local state if backend fails
    }
  };

  const handleDeleteLegend = async (legendId: string) => {
    const updatedData = {
      ...data,
      history: {
        ...data.history,
        legends: data.history.legends.filter(l => l.id !== legendId)
      }
    };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
    } catch (error) {
      console.error('Failed to delete legend:', error);
      // Don't update local state if backend fails
    }
  };

  const handleDeleteTimeline = async (eventId: string) => {
    const updatedData = {
      ...data,
      history: {
        ...data.history,
        timeline: data.history.timeline.filter(e => e.id !== eventId)
      }
    };
    
    // Save to backend FIRST before updating local state
    try {
      await saveToBackend(updatedData);
      setData(updatedData);
    } catch (error) {
      console.error('Failed to delete timeline event:', error);
      // Don't update local state if backend fails
    }
  };

  const handleSaveConfig = () => {
    const updatedData = {
      ...data,
      history: {
        ...data.history,
        hero: configFormData.hero,
        stats: configFormData.stats,
        wallOfFame: configFormData.wallOfFame
      }
    };
    setData(updatedData);
    saveToBackend(updatedData);
  };

  const startEdit = (legend: Legend) => {
    setEditingId(legend.id);
    setLegendFormData(legend);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      {/* Save Status Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            saveMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-accent-red/10 border-accent-red/30 text-accent-red'
          }`}
        >
          <AlertCircle size={18} />
          <span className="text-sm font-bold">{saveMessage.text}</span>
        </motion.div>
      )}

      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button 
          onClick={() => { setActiveTab('timeline'); setIsAdding(false); setEditingId(null); }}
          className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
        >
          Timeline Historique
        </button>
        <button 
          onClick={() => { setActiveTab('legends'); setIsAdding(false); setEditingId(null); }}
          className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'legends' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
        >
          Légendes de la Danse
        </button>
        <button 
          onClick={() => { setActiveTab('config'); setIsAdding(false); setEditingId(null); }}
          className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'config' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
        >
          Configuration Histoire
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-heading text-lg flex items-center gap-2"><History size={20} className="text-primary" /> Événements Historiques</h4>
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl"><Plus size={18} /> Ajouter une Année</button>
          </div>

          {isAdding && (
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Année</label>
                  <select 
                    value={timelineFormData.year || ''} 
                    onChange={e => setTimelineFormData({ ...timelineFormData, year: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                  >
                    <option value="" className="bg-background-dark">Sélectionner une année</option>
                    {Array.from({ length: 4 }, (_, i) => 2013 + i).map(year => (
                      <option key={year} value={year.toString()} className="bg-background-dark">{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Champion</label>
                  <input 
                    type="text" 
                    value={timelineFormData.champion || ''} 
                    onChange={e => setTimelineFormData({ ...timelineFormData, champion: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre de l'Événement</label>
                  <input 
                    type="text" 
                    value={timelineFormData.title || ''} 
                    onChange={e => setTimelineFormData({ ...timelineFormData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Photo de l'Événement</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setTimelineFormData({ ...timelineFormData, image: uploadedUrl });
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
                    {timelineFormData.image && !isUploading && (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <img src={timelineFormData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">Image uploadée</p>
                          <p className="text-xs text-slate-500 truncate">{timelineFormData.image}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea 
                    rows={3}
                    value={timelineFormData.description || ''} 
                    onChange={e => setTimelineFormData({ ...timelineFormData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => { setIsAdding(false); setEditingId(null); setTimelineFormData({}); }} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Annuler</button>
                <button onClick={editingId ? handleEditTimeline : handleAddTimeline} className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold text-xs uppercase tracking-widest">{editingId ? 'Mettre à Jour' : 'Enregistrer'}</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {data.history.timeline.map(event => (
              <div key={event.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center gap-6 group hover:border-white/10 transition-all">
                <div className="text-4xl font-heading text-primary w-24 shrink-0">{event.year}</div>
                <div className="flex-1">
                  <h5 className="font-bold text-white text-lg">{event.champion}</h5>
                  <p className="text-sm text-slate-400 mt-1">{event.title}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditTimeline(event)}
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteTimeline(event.id)}
                    className="p-2 text-slate-500 hover:text-accent-red transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'legends' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-heading text-lg flex items-center gap-2"><User size={20} className="text-primary" /> Icônes de la Danse</h4>
            {!editingId && <button onClick={() => { setIsAdding(true); setLegendFormData({}); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl"><Plus size={18} /> Ajouter une Légende</button>}
          </div>

          {(isAdding || editingId) && (
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-bold text-white">{editingId ? 'Modifier la Légende' : 'Ajouter une Nouvelle Légende'}</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nom</label>
                  <input 
                    type="text" 
                    value={legendFormData.name || ''} 
                    onChange={e => setLegendFormData({ ...legendFormData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Année</label>
                  <select 
                    value={legendFormData.year || new Date().getFullYear()} 
                    onChange={e => setLegendFormData({ ...legendFormData, year: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                  >
                    {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => 2014 + i).reverse().map(year => (
                      <option key={year} value={year} className="bg-background-dark">{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type de Compétition</label>
                  <select 
                    value={legendFormData.type || 'champion-1v1'} 
                    onChange={e => setLegendFormData({ ...legendFormData, type: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                  >
                    <option value="champion-1v1" className="bg-background-dark">CHAMPION 1VS1</option>
                    <option value="footwork" className="bg-background-dark">Footwork</option>
                    <option value="powermoves" className="bg-background-dark">Powermoves</option>
                    <option value="last-chance" className="bg-background-dark">Last Chance</option>
                    <option value="crew-vs-crew" className="bg-background-dark">CREW VS CREW</option>
                    <option value="2v2" className="bg-background-dark">2 VS 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Catégorie</label>
                  <select 
                    value={legendFormData.category || 'bboy'} 
                    onChange={e => setLegendFormData({ ...legendFormData, category: e.target.value as 'bboy' | 'bgirl' | 'crew' })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                  >
                    <option value="bboy" className="bg-background-dark">B-Boy</option>
                    <option value="bgirl" className="bg-background-dark">B-Girl</option>
                    <option value="crew" className="bg-background-dark">Crew</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Photo de la Légende</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setLegendFormData({ ...legendFormData, photo: uploadedUrl });
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
                    {legendFormData.photo && !isUploading && (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <img src={legendFormData.photo} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">Image uploadée</p>
                          <p className="text-xs text-slate-500 truncate">{legendFormData.photo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre (Champion)</label>
                  <input 
                    type="text" 
                    placeholder="ex: B-Boy Champion 2023"
                    value={legendFormData.title || ''} 
                    onChange={e => setLegendFormData({ ...legendFormData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bio</label>
                  <textarea 
                    rows={3}
                    value={legendFormData.bio || ''} 
                    onChange={e => setLegendFormData({ ...legendFormData, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => { setIsAdding(false); setEditingId(null); setLegendFormData({}); }} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Annuler</button>
                <button onClick={editingId ? handleEditLegend : handleAddLegend} className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold text-xs uppercase tracking-widest">{editingId ? 'Mettre à Jour' : 'Enregistrer'}</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.history.legends.map(legend => (
              <div key={legend.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-primary/20">
                    <img src={legend.photo} alt={legend.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(legend)}
                      className="p-2 text-slate-500 hover:text-primary transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLegend(legend.id)}
                      className="p-2 text-slate-500 hover:text-accent-red transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h5 className="font-bold text-white">{legend.name}</h5>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{legend.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-heading text-lg mb-6">Section Héro de la Page Histoire</h4>
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Depuis Année</label>
                  <input 
                    type="text" 
                    value={configFormData.hero.sinceYear} 
                    onChange={e => setConfigFormData({ ...configFormData, hero: { ...configFormData.hero, sinceYear: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Éditions</label>
                  <input 
                    type="text" 
                    value={configFormData.hero.totalEditions} 
                    onChange={e => setConfigFormData({ ...configFormData, hero: { ...configFormData.hero, totalEditions: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre Principal</label>
                  <input 
                    type="text" 
                    value={configFormData.hero.title} 
                    onChange={e => setConfigFormData({ ...configFormData, hero: { ...configFormData.hero, title: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre Surligne</label>
                  <input 
                    type="text" 
                    value={configFormData.hero.titleHighlight} 
                    onChange={e => setConfigFormData({ ...configFormData, hero: { ...configFormData.hero, titleHighlight: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea 
                    rows={2}
                    value={configFormData.hero.description} 
                    onChange={e => setConfigFormData({ ...configFormData, hero: { ...configFormData.hero, description: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-6">Statistiques Globales</h4>
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Années</label>
                  <input 
                    type="text" 
                    value={configFormData.stats.years} 
                    onChange={e => setConfigFormData({ ...configFormData, stats: { ...configFormData.stats, years: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Éditions</label>
                  <input 
                    type="text" 
                    value={configFormData.stats.editions} 
                    onChange={e => setConfigFormData({ ...configFormData, stats: { ...configFormData.stats, editions: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pays</label>
                  <input 
                    type="text" 
                    value={configFormData.stats.countries} 
                    onChange={e => setConfigFormData({ ...configFormData, stats: { ...configFormData.stats, countries: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Participants</label>
                  <input 
                    type="text" 
                    value={configFormData.stats.participants} 
                    onChange={e => setConfigFormData({ ...configFormData, stats: { ...configFormData.stats, participants: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prix</label>
                  <input 
                    type="text" 
                    value={configFormData.stats.prize} 
                    onChange={e => setConfigFormData({ ...configFormData, stats: { ...configFormData.stats, prize: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-6">Configuration Wall of Fame</h4>
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre</label>
                  <input 
                    type="text" 
                    value={configFormData.wallOfFame.title} 
                    onChange={e => setConfigFormData({ ...configFormData, wallOfFame: { ...configFormData.wallOfFame, title: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sous-titre</label>
                  <input 
                    type="text" 
                    value={configFormData.wallOfFame.subtitle} 
                    onChange={e => setConfigFormData({ ...configFormData, wallOfFame: { ...configFormData.wallOfFame, subtitle: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              onClick={() => setData(prev => ({ ...prev, history: { ...prev.history, hero: configFormData.hero, stats: configFormData.stats, wallOfFame: configFormData.wallOfFame } }))}
              className="flex items-center gap-2 px-8 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
            >
              <Save size={18} /> Aperçu Local
            </button>
            <button 
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Save size={18} /> {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
