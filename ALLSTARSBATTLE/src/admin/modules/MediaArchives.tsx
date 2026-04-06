import React, { useState } from 'react';
import { CMSData, MediaItem } from '../../types';
import { Plus, Trash2, Edit2, Image as ImageIcon, Video, Archive, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadService } from '../../services/uploadService';

export default function MediaArchives({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedMediaForEdit, setSelectedMediaForEdit] = useState<string | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaForm, setNewMediaForm] = useState<MediaItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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

  // Les années disponibles historiquement
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  // Tags disponibles
  const availableTags = [
    'archive',
    'highlight',
    'aftermovie',
    'replay',
    'exclusif',
    'coulisses',
    'portraits',
    'final',
    'semi-final'
  ];

  const getOrCreateMediaArray = (): MediaItem[] => {
    if (!Array.isArray(data.media)) {
      return [];
    }
    return data.media;
  };

  const media = getOrCreateMediaArray();

  const updateMedia = (updatedMedia: MediaItem[]) => {
    setData(prev => ({
      ...prev,
      media: updatedMedia
    }));
  };

  const addMedia = () => {
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      year: new Date().getFullYear(),
      type: 'photo',
      url: '',
      title: 'Nouveau média',
      description: '',
      thumbnail: '',
      tag: 'archive'
    };
    updateMedia([...media, newMedia]);
  };

  const initAddingMedia = () => {
    setIsAddingMedia(true);
    setNewMediaForm({
      id: '',
      year: new Date().getFullYear(),
      type: 'photo',
      url: '',
      title: '',
      description: '',
      thumbnail: '',
      tag: 'archive'
    });
  };

  const cancelAddingMedia = () => {
    setIsAddingMedia(false);
    setNewMediaForm(null);
  };

  const saveNewMedia = async () => {
    if (newMediaForm && !isSaving) {
      setIsSaving(true);
      try {
        const newMedia: MediaItem = {
          ...newMediaForm,
          id: Date.now().toString()
        };
        const updatedMedia = [...media, newMedia];
        updateMedia(updatedMedia);
        setIsAddingMedia(false);
        setNewMediaForm(null);
        
        // Sauvegarder dans la base de données
        if (onSave) {
          await onSave({ ...data, media: updatedMedia });
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const removeMedia = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média?') && !isSaving) {
      setIsSaving(true);
      try {
        const updatedMedia = media.filter(m => m.id !== id);
        updateMedia(updatedMedia);
        
        // Sauvegarder dans la base de données
        if (onSave) {
          await onSave({ ...data, media: updatedMedia });
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const updateMediaField = (id: string, field: string, value: any) => {
    const updated = media.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    updateMedia(updated);
  };

  const filteredMedia = media.filter(m => {
    if (filterYear !== 'all' && m.year !== filterYear) return false;
    if (filterType !== 'all' && m.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Galerie & Archives Média</h2>
        <p className="text-zinc-500 mt-1">Gérez toutes les photos, vidéos et aftermovies par année.</p>
      </header>

      {/* Filtres et Actions */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-heading text-lg">Filtres & Actions</h3>
          <button 
            onClick={initAddingMedia}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-4 py-2 transition-all font-bold"
          >
            <Plus size={18} /> Ajouter Média
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filtre Année */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Année</label>
            <select 
              value={filterYear}
              onChange={e => setFilterYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all min-h-[44px]"
            >
              <option value="all">Toutes les années</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Filtre Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Type</label>
            <select 
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all min-h-[44px]"
            >
              <option value="all">Tous les types</option>
              <option value="photo">Photos</option>
              <option value="video">Vidéos</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-slate-400">
              Total: <span className="text-white font-bold">{filteredMedia.length}</span> média(s)
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Médias - Section cachée par défaut */}
      {!showGalleryModal && !selectedMediaForEdit && !isAddingMedia && (
        <div className="bg-[#111] border border-white/10 p-12 rounded-2xl text-center space-y-6">
          <Archive className="mx-auto text-primary" size={64} />
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Galerie de Médias</h3>
            <p className="text-slate-400">Vous avez <span className="text-white font-bold">{media.length}</span> média(s) en stock</p>
          </div>
          <button 
            onClick={() => setShowGalleryModal(true)}
            className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold"
          >
            <ImageIcon size={20} /> Voir liste des médias
          </button>
        </div>
      )}

      {/* Section Ajout Nouveau Média */}
      {isAddingMedia && newMediaForm && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Ajouter un nouveau média</h3>
            <button
              onClick={cancelAddingMedia}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-4">
            {/* Grille de champs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Année */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Année d'archivage</label>
                <select 
                  value={newMediaForm.year}
                  onChange={e => setNewMediaForm({ ...newMediaForm, year: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Type de média</label>
                <select 
                  value={newMediaForm.type}
                  onChange={e => setNewMediaForm({ ...newMediaForm, type: e.target.value as 'photo' | 'video' })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Vidéo / Aftermovie</option>
                </select>
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Titre</label>
                <input 
                  type="text" 
                  value={newMediaForm.title || ''}
                  onChange={e => setNewMediaForm({ ...newMediaForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                  placeholder="Ex: Finales 2026, Highlights Round 1..."
                />
              </div>

              {/* Tag/Catégorie */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Tag/Catégorie</label>
                <select 
                  value={newMediaForm.tag || ''}
                  onChange={e => setNewMediaForm({ ...newMediaForm, tag: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                >
                  <option value="">-- Sélectionner un tag --</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* URL ou Upload de fichier */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                  {newMediaForm.type === 'photo' ? 'Fichier image' : 'URL du média'}
                </label>
                {newMediaForm.type === 'photo' ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setNewMediaForm({ ...newMediaForm, url: uploadedUrl });
                          } catch (error) {
                            alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                          }
                        }
                      }}
                      disabled={isUploading}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
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
                    {newMediaForm.url && !isUploading && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Upload size={16} />
                        Fichier uploadé avec succès
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newMediaForm.url}
                    onChange={e => setNewMediaForm({ ...newMediaForm, url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                    placeholder="https://..."
                  />
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Description</label>
                <textarea 
                  value={newMediaForm.description || ''}
                  onChange={e => setNewMediaForm({ ...newMediaForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all resize-none"
                  placeholder="Description détaillée du média..."
                />
              </div>

              {/* Thumbnail (pour vidéos) */}
              {newMediaForm.type === 'video' && (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Thumbnail (optionnel)</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleFileUpload(file);
                            setNewMediaForm({ ...newMediaForm, thumbnail: uploadedUrl });
                          } catch (error) {
                            alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                          }
                        }
                      }}
                      disabled={isUploading}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
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
                    {newMediaForm.thumbnail && !isUploading && (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <img src={newMediaForm.thumbnail} alt="Thumbnail preview" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">Thumbnail uploadé</p>
                          <p className="text-xs text-slate-500 truncate">{newMediaForm.thumbnail}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Durée (pour vidéos) */}
              {newMediaForm.type === 'video' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Durée (optionnel)</label>
                  <input 
                    type="text" 
                    value={newMediaForm.duration || ''}
                    onChange={e => setNewMediaForm({ ...newMediaForm, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                    placeholder="4:32"
                  />
                </div>
              )}
            </div>

            {/* Aperçu */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Aperçu</p>
              {newMediaForm.type === 'photo' ? (
                <div className="w-full h-48 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  {newMediaForm.url ? (
                    <img src={newMediaForm.url} alt={newMediaForm.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23444" width="100" height="100"/%3E%3C/svg%3E'} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-white/30" size={48} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-black border border-white/10 rounded-lg flex items-center justify-center">
                  <Video className="text-white/30" size={48} />
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={saveNewMedia}
                disabled={isSaving}
                className="flex-1 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button 
                onClick={cancelAddingMedia}
                disabled={isSaving}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Édition - Affichée quand un média est sélectionné */}
      {selectedMediaForEdit && !isAddingMedia && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Édition du média</h3>
            <button
              onClick={() => setSelectedMediaForEdit(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          {media.find(m => m.id === selectedMediaForEdit) && (
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-4">
              {(() => {
                const mediaItem = media.find(m => m.id === selectedMediaForEdit)!;
                return (
                  <>
                    {/* En-tête */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {mediaItem.type === 'photo' ? (
                          <ImageIcon className="text-primary" size={24} />
                        ) : (
                          <Video className="text-primary" size={24} />
                        )}
                        <div>
                          <h4 className="font-bold text-white">{mediaItem.title || 'Sans titre'}</h4>
                          <p className="text-xs text-slate-500">{mediaItem.year} • {mediaItem.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          removeMedia(mediaItem.id);
                          setSelectedMediaForEdit(null);
                        }}
                        className="text-accent-red hover:text-accent-red/80 transition-colors p-2 hover:bg-accent-red/10 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Grille de champs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Année */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Année d'archivage</label>
                        <select 
                          value={mediaItem.year}
                          onChange={e => updateMediaField(mediaItem.id, 'year', parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                        >
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      {/* Type */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Type de média</label>
                        <select 
                          value={mediaItem.type}
                          onChange={e => updateMediaField(mediaItem.id, 'type', e.target.value as 'photo' | 'video')}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                        >
                          <option value="photo">Photo</option>
                          <option value="video">Vidéo / Aftermovie</option>
                        </select>
                      </div>

                      {/* Titre */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Titre</label>
                        <input 
                          type="text" 
                          value={mediaItem.title || ''}
                          onChange={e => updateMediaField(mediaItem.id, 'title', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                          placeholder="Ex: Finales 2026, Highlights Round 1..."
                        />
                      </div>

                      {/* Tag/Catégorie */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Tag/Catégorie</label>
                        <select 
                          value={mediaItem.tag || ''}
                          onChange={e => updateMediaField(mediaItem.id, 'tag', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                        >
                          <option value="">-- Sélectionner un tag --</option>
                          {availableTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                          ))}
                        </select>
                      </div>

                      {/* URL ou Upload de fichier */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                          {mediaItem.type === 'photo' ? 'Fichier image' : 'URL du média'}
                        </label>
                        {mediaItem.type === 'photo' ? (
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const uploadedUrl = await handleFileUpload(file);
                                    updateMediaField(mediaItem.id, 'url', uploadedUrl);
                                  } catch (error) {
                                    alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                                  }
                                }
                              }}
                              disabled={isUploading}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
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
                            {mediaItem.url && !isUploading && (
                              <div className="flex items-center gap-2 text-green-400 text-sm">
                                <Upload size={16} />
                                Image actuelle: <a href={mediaItem.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300" aria-label="Voir l'image actuelle">Voir l'image</a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={mediaItem.url}
                            onChange={e => updateMediaField(mediaItem.id, 'url', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                            placeholder="https://..."
                          />
                        )}
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Description</label>
                        <textarea 
                          value={mediaItem.description || ''}
                          onChange={e => updateMediaField(mediaItem.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all resize-none"
                          placeholder="Description détaillée du média..."
                        />
                      </div>

                      {/* Thumbnail (pour vidéos) */}
                      {mediaItem.type === 'video' && (
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">URL Thumbnail (optionnel)</label>
                          <input 
                            type="text" 
                            value={mediaItem.thumbnail || ''}
                            onChange={e => updateMediaField(mediaItem.id, 'thumbnail', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {/* Durée (pour vidéos) */}
                      {mediaItem.type === 'video' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Durée (optionnel)</label>
                          <input 
                            type="text" 
                            value={mediaItem.duration || ''}
                            onChange={e => updateMediaField(mediaItem.id, 'duration', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-all min-h-[44px]"
                            placeholder="4:32"
                          />
                        </div>
                      )}
                    </div>

                    {/* Aperçu */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Aperçu</p>
                      {mediaItem.type === 'photo' ? (
                        <div className="w-full h-48 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                          <img src={mediaItem.url} alt={mediaItem.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23444" width="100" height="100"/%3E%3C/svg%3E'} referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div
                          className="w-full h-48 bg-black border border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-black/80 transition-all"
                          onClick={() => window.open(mediaItem.url, '_blank')}
                        >
                          <Video className="text-white/50 mb-2" size={48} />
                          <span className="text-white/60 text-sm font-medium">Cliquer pour voir la vidéo</span>
                        </div>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-4 pt-4">
                      {mediaItem.type === 'video' && (
                        <button
                          onClick={() => window.open(mediaItem.url, '_blank')}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest"
                        >
                          Voir la vidéo
                        </button>
                      )}
                      <button 
                        onClick={async () => {
                          if (isSaving) return;
                          setIsSaving(true);
                          try {
                            setSelectedMediaForEdit(null);
                            // Sauvegarder dans la base de données
                            if (onSave) {
                              await onSave(data);
                            }
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex-1 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button 
                        onClick={() => setSelectedMediaForEdit(null)}
                        disabled={isSaving}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Modal Galerie */}
      <AnimatePresence>
        {showGalleryModal && !isAddingMedia && !selectedMediaForEdit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold uppercase text-white">Galerie Médias</h2>
                <p className="text-sm text-slate-400 mt-1">Total: {filteredMedia.length} média(s)</p>
              </div>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            {/* Filtres */}
            <div className="flex gap-4 p-6 border-b border-white/10 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Année</label>
                <select 
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="all">Toutes</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Type</label>
                <select 
                  value={filterType}
                  onChange={e => setFilterType(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="all">Tous</option>
                  <option value="photo">Photos</option>
                  <option value="video">Vidéos</option>
                </select>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map(mediaItem => (
                    <div key={mediaItem.id} className="group relative overflow-hidden rounded-lg border border-white/10 hover:border-primary transition-all">
                      <div className="relative aspect-square">
                        {mediaItem.type === 'photo' ? (
                          <img
                            src={mediaItem.url}
                            alt={mediaItem.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => window.open(mediaItem.url, '_blank')}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="w-full h-full bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition-all"
                            onClick={() => window.open(mediaItem.url, '_blank')}
                          >
                            <Video className="text-white/50 mb-2" size={40} />
                            <span className="text-white/60 text-xs font-medium">Voir la vidéo</span>
                          </div>
                        )}

                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {mediaItem.type === 'video' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(mediaItem.url, '_blank');
                              }}
                              className="p-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-full transition-all"
                              title="Voir la vidéo"
                            >
                              <Video size={20} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMediaForEdit(mediaItem.id);
                              setShowGalleryModal(false);
                            }}
                            className="p-3 bg-primary/80 hover:bg-primary text-black rounded-full transition-all"
                            title="Modifier"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMedia(mediaItem.id);
                            }}
                            className="p-3 bg-accent-red/80 hover:bg-accent-red text-white rounded-full transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <p className="text-[10px] font-bold text-slate-300 truncate">{mediaItem.title || 'Sans titre'}</p>
                        <p className="text-[8px] text-slate-500">{mediaItem.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Archive className="text-white/30 mb-4" size={48} />
                  <p className="text-white/60">Aucun média trouvé</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-3 transition-all font-bold uppercase tracking-widest"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
