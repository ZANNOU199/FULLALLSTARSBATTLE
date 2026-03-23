import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSData, PageBackground } from '../../types';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Video, Check, Upload } from 'lucide-react';
import { UploadService } from '../../services/uploadService';

export default function BackgroundImages({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [editingPage, setEditingPage] = useState<keyof typeof data.pageBackgrounds | null>(null);
  const [formData, setFormData] = useState<Partial<PageBackground>>({});
  const [saved, setSaved] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressImage, setUploadProgressImage] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgressVideo, setUploadProgressVideo] = useState(0);
  // Logo-specific states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadProgressLogo, setUploadProgressLogo] = useState(0);
  const [savedLogo, setSavedLogo] = useState(false);
  const [localLogoUrl, setLocalLogoUrl] = useState<string>(data.siteAssets?.logo?.url || '');
  const formRef = useRef<HTMLDivElement>(null);

  // Update local logo when data changes
  useEffect(() => {
    if (data.siteAssets?.logo?.url && !localLogoUrl) {
      setLocalLogoUrl(data.siteAssets.logo.url);
    }
  }, [data.siteAssets?.logo?.url]);

  // Fonction pour uploader un fichier image
  const handleImageUpload = async (file: File): Promise<string> => {
    if (!UploadService.validateImageFile(file)) {
      throw new Error('Fichier invalide. Seules les images (JPEG, PNG, WebP, GIF) de moins de 10MB sont acceptées.');
    }

    setIsUploadingImage(true);
    setUploadProgressImage(0);

    try {
      // Simuler la progression (puisque fetch ne supporte pas nativement la progression)
      const progressInterval = setInterval(() => {
        setUploadProgressImage(prev => Math.min(prev + 10, 90));
      }, 200);

      const fileName = UploadService.generateFileName(file.name);
      const uploadedUrl = await UploadService.uploadFile(file, fileName);

      clearInterval(progressInterval);
      setUploadProgressImage(100);

      return uploadedUrl;
    } finally {
      setTimeout(() => {
        setIsUploadingImage(false);
        setUploadProgressImage(0);
      }, 1000);
    }
  };

  // Fonction pour uploader un fichier vidéo
  const handleVideoUpload = async (file: File): Promise<string> => {
    if (!UploadService.validateVideoFile(file)) {
      throw new Error('Fichier vidéo invalide. Formats acceptés: MP4, WebM, OGG (max 100MB)');
    }

    setIsUploadingVideo(true);
    setUploadProgressVideo(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgressVideo(prev => Math.min(prev + 5, 90));
      }, 300);

      const fileName = UploadService.generateFileName(file.name);
      const uploadedUrl = await UploadService.uploadFile(file, fileName);

      clearInterval(progressInterval);
      setUploadProgressVideo(100);

      return uploadedUrl;
    } finally {
      setTimeout(() => {
        setIsUploadingVideo(false);
        setUploadProgressVideo(0);
      }, 1000);
    }
  };

  // Fonction dédiée pour uploader le logo avec ses propres états
  const handleLogoUpload = async (file: File): Promise<string> => {
    if (!UploadService.validateImageFile(file)) {
      throw new Error('Fichier invalide. Seules les images (JPEG, PNG, WebP, GIF) de moins de 10MB sont acceptées.');
    }

    setIsUploadingLogo(true);
    setUploadProgressLogo(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgressLogo(prev => Math.min(prev + 10, 90));
      }, 200);

      const fileName = UploadService.generateFileName(file.name);
      const uploadedUrl = await UploadService.uploadFile(file, fileName);

      clearInterval(progressInterval);
      setUploadProgressLogo(100);

      return uploadedUrl;
    } finally {
      setTimeout(() => {
        setIsUploadingLogo(false);
        setUploadProgressLogo(0);
      }, 1000);
    }
  };

  const pageLabels = {
    hero: '🏠 Hero (Accueil)',
    artisticScene: '🎨 Scène Artistique',
    dancers: '👯 Page Danseurs',
    media: '📸 Galerie Média',
    contact: '📧 Page Contact',
    competition: '🏆 Compétition',
    vip: '✨ Expérience VIP',
    participate: '📝 Page Participer'
  };

  const pageDescriptions = {
    hero: 'Image de fond et vidéo de la section héros de la page d\'accueil',
    artisticScene: 'Image de fond de la page Scène Artistique',
    dancers: 'Image de fond de la page Danseurs',
    media: 'Image de fond de la galerie Média',
    contact: 'Image de fond de la page Contact',
    competition: 'Image de fond de la section Compétition',
    vip: 'Image de fond de l\'expérience VIP',
    participate: 'Image de fond de la page Participer'
  };

  const handleEdit = (pageKey: keyof typeof data.pageBackgrounds) => {
    setEditingPage(pageKey);
    setFormData({ ...data.pageBackgrounds[pageKey] });
    // Scroller vers le formulaire
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSave = async () => {
    if (!editingPage || !formData.imageUrl) return;

    const updatedBackground: PageBackground = {
      imageUrl: formData.imageUrl || '',
      videoUrl: formData.videoUrl,
      width: parseInt(String(formData.width)) || 1920,
      height: parseInt(String(formData.height)) || 1080,
      lastModified: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      pageBackgrounds: {
        ...data.pageBackgrounds,
        [editingPage]: updatedBackground
      }
    };

    setData(updatedData);

    if (onSave) {
      await onSave(updatedData);
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingPage(null);
      setFormData({});
    }, 1500);
  };

  const handleCancel = () => {
    setEditingPage(null);
    setFormData({});
  };

  const currentPage = editingPage ? data.pageBackgrounds[editingPage] : null;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/20 to-accent-red/20 border border-white/10 rounded-2xl p-8">
        <h3 className="text-2xl font-heading text-primary mb-2">🎬 Gestion des Images de Fond</h3>
        <p className="text-slate-400 text-sm">Gérez toutes les images de background de vos pages principales</p>
      </div>

      <AnimatePresence mode="wait">
        {editingPage && (
          <motion.div 
            ref={formRef}
            key="form"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-primary/50 shadow-2xl shadow-primary/20 p-8 rounded-2xl space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
                  <h4 className="text-lg font-heading text-white relative">
                    Modifier: {pageLabels[editingPage as keyof typeof pageLabels]}
                  </h4>
                </div>
                <span className="px-2 py-1 bg-primary text-background-dark text-[10px] font-bold uppercase rounded-full animate-pulse">
                  EN ÉDITION
                </span>
              </div>
              <button 
                onClick={handleCancel}
                className="p-2 text-slate-500 hover:text-accent-red transition-colors hover:bg-white/5 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-green-900/30 border border-green-600/50 rounded-xl flex items-center gap-3 text-green-300"
              >
                <Check size={20} />
                <span className="font-semibold">Image mise à jour avec succès!</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image de Fond</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const uploadedUrl = await handleImageUpload(file);
                          setFormData({ ...formData, imageUrl: uploadedUrl });
                        } catch (error) {
                          alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                        }
                      }
                    }}
                    disabled={isUploadingImage}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
                  />
                  {isUploadingImage && (
                    <div className="w-full bg-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                        <span>Upload image en cours...</span>
                        <span>{uploadProgressImage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgressImage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {formData.imageUrl && !isUploadingImage && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <Upload size={16} />
                      Image uploadée avec succès
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">Formats acceptés: JPEG, PNG, WebP, GIF (max 10MB)</p>
              </div>

              {editingPage === 'hero' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Video size={14} /> Vidéo de Fond (Hero uniquement)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const uploadedUrl = await handleVideoUpload(file);
                            setFormData({ ...formData, videoUrl: uploadedUrl });
                          } catch (error) {
                            alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload de la vidéo');
                          }
                        }
                      }}
                      disabled={isUploadingVideo}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
                    />
                    {isUploadingVideo && (
                      <div className="w-full bg-white/10 rounded-lg p-2">
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                          <span>Upload vidéo en cours...</span>
                          <span>{uploadProgressVideo}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgressVideo}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {formData.videoUrl && !isUploadingVideo && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Upload size={16} />
                        Vidéo uploadée avec succès
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Formats acceptés: MP4, WebM, OGG (max 100MB)</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Largeur (px)</label>
                <input 
                  type="number" 
                  value={formData.width || 1920} 
                  onChange={e => setFormData({ ...formData, width: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hauteur (px)</label>
                <input 
                  type="number" 
                  value={formData.height || 1080} 
                  onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white"
                />
              </div>
            </div>

            {formData.imageUrl && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aperçu</label>
                <div className="relative w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+non+disponible';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-orange-600 text-background-dark rounded-xl font-bold text-xs uppercase tracking-widest hover:from-primary/90 hover:to-orange-700 transition-all shadow-lg shadow-primary/30"
              >
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.entries(data.pageBackgrounds) as [keyof typeof data.pageBackgrounds, PageBackground][]).map(([pageKey, bg]) => {
          const label = pageLabels[pageKey as keyof typeof pageLabels];
          const description = pageDescriptions[pageKey as keyof typeof pageDescriptions];
          
          return (
            <div 
              key={pageKey}
              className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group"
            >
              <div className="relative w-full h-40 bg-black overflow-hidden">
                <img 
                  src={bg.imageUrl} 
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+non+disponible';
                  }}
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h5 className="text-lg font-heading text-white">{label}</h5>
                  <p className="text-xs text-slate-400 mt-1">{description}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Résolution:</span>
                    <span className="text-white font-mono">{bg.width} × {bg.height}px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Dernière modif:</span>
                    <span className="text-white font-mono">{new Date(bg.lastModified).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {bg.videoUrl && (
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Video size={14} />
                      <span>Vidéo attachée</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleEdit(pageKey as keyof typeof data.pageBackgrounds)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/30 transition-colors"
                >
                  <Edit size={16} /> Modifier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logo Section */}
      <div className="bg-gradient-to-r from-accent-red/20 to-primary/20 border border-white/10 rounded-2xl p-8">
        <h3 className="text-2xl font-heading text-accent-red mb-2">🎨 Logo du Site</h3>
        <p className="text-slate-400 text-sm">Gérez le logo affichée dans le header du site</p>

        <div className="mt-8">
          {localLogoUrl || data.siteAssets?.logo?.url ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="bg-black border border-white/10 rounded-xl p-8 flex items-center justify-center h-40">
                  <img 
                    src={localLogoUrl || data.siteAssets?.logo?.url || ''} 
                    alt="Site Logo" 
                    className="h-32 w-auto object-contain max-w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Logo';
                    }}
                  />
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Format: PNG ou SVG recommandé</p>
                  <p>Taille optimale: 200x100px ou ratio similaire</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h5 className="text-white font-bold mb-4">Remplacer le logo</h5>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const uploadedUrl = await handleLogoUpload(file);
                          setLocalLogoUrl(uploadedUrl);
                          const updatedData = {
                            ...data,
                            siteAssets: {
                              ...data.siteAssets,
                              logo: {
                                url: uploadedUrl,
                                alt: 'All Stars Battle International Logo',
                                lastModified: new Date().toISOString()
                              }
                            }
                          };
                          setData(updatedData);
                          if (onSave) {
                            await onSave(updatedData);
                          }
                          setSavedLogo(true);
                          setTimeout(() => setSavedLogo(false), 2000);
                        } catch (error) {
                          alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                        }
                      }
                    }}
                    disabled={isUploadingLogo}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/80 disabled:opacity-50"
                  />
                  {isUploadingLogo && (
                    <div className="w-full bg-white/10 rounded-lg p-2 mt-3">
                      <div className="flex items-center justify-between text-sm text-slate-300 mb-1">
                        <span>Upload en cours...</span>
                        <span>{uploadProgressLogo}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgressLogo}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {savedLogo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-400 text-sm mt-3"
                    >
                      <Check size={16} />
                      Logo mis à jour avec succès!
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-slate-500 mb-4" />
              <h5 className="text-white font-bold mb-2">Aucun logo uploadé</h5>
              <p className="text-slate-400 text-sm mb-6">Téléchargez le logo du site pour qu'il s'affiche dans le header</p>
              <label className="inline-block px-6 py-3 bg-primary text-background-dark font-bold rounded-xl cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                Choisir une image
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const uploadedUrl = await handleLogoUpload(file);
                        setLocalLogoUrl(uploadedUrl);
                        const updatedData = {
                          ...data,
                          siteAssets: {
                            ...data.siteAssets,
                            logo: {
                              url: uploadedUrl,
                              alt: 'All Stars Battle International Logo',
                              lastModified: new Date().toISOString()
                            }
                          }
                        };
                        setData(updatedData);
                        if (onSave) {
                          await onSave(updatedData);
                        }
                        setSavedLogo(true);
                        setTimeout(() => setSavedLogo(false), 2000);
                      } catch (error) {
                        alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
                      }
                    }
                  }}
                  disabled={isUploadingLogo}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
        <h4 className="text-sm font-heading text-white mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-primary" /> Conseils
        </h4>
        <ul className="space-y-2 text-xs text-slate-400">
          <li>• Les images de fond doivent avoir une résolution minimale de 1920x1080px</li>
          <li>• Utilisez des formats optimisés (JPEG, WebP) pour une meilleure performance</li>
          <li>• La vidéo héros s'affichera en priorité, l'image comme fallback</li>
          <li>• Les URLs doivent être publiquement accessibles (HTTP/HTTPS)</li>
          <li>• Assurez-vous que les images sont bien optimisées pour le web</li>
          <li>• Pour le logo: formats PNG ou SVG recommandés, size 200x100px optimal</li>
        </ul>
      </div>
    </div>
  );
}
