import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cmsService } from './services/cmsService';
import { MediaItem } from './types';

interface MediaProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  pageBackgrounds?: any;
}

const Media = ({ selectedYear: initialYear = 2026, onYearChange, pageBackgrounds }: MediaProps) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryPage, setGalleryPage] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  useEffect(() => {
    cmsService.getData().then(data => {
      setMediaItems(data.media || []);
    });
  }, []);

  useEffect(() => {
    setSelectedYear(initialYear);
  }, [initialYear]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fallback data if CMS is empty
  const fallbackPhotos: string[] = [];

  const fallbackVideos: any[] = [];

  const filteredPhotos = mediaItems
    .filter(item => item.year === selectedYear && item.type === 'photo')
    .map(item => item.url);

  const filteredVideos = mediaItems
    .filter(item => item.year === selectedYear && item.type === 'video')
    .map(item => ({
      title: item.title,
      desc: item.description,
      thumb: item.thumbnail || item.url,
      duration: item.duration,
      tag: item.tag,
      id: item.id,
      url: item.url
    }));

  // Pagination settings
  const itemsPerPageMobile = 4;
  const itemsPerPageDesktop = 6;
  const galleryPageSize = 10;

  // Get current content to display
  const currentData = activeTab === 'photos' ? filteredPhotos : filteredVideos;
  
  // Desktop pagination - display 6 items per page
  const desktopPageSize = itemsPerPageDesktop;
  const desktopPages = Math.ceil(currentData.length / desktopPageSize);
  const currentDesktopItems = currentData.slice(desktopPage * desktopPageSize, (desktopPage + 1) * desktopPageSize);
  
  // Mobile preview + gallery pagination
  const previewItems = isMobile ? currentData.slice(0, itemsPerPageMobile) : currentData.slice(0, desktopPageSize);
  const galleryItems = currentData;
  const galleryPages = Math.ceil(galleryItems.length / galleryPageSize);
  const currentGalleryItems = galleryItems.slice(galleryPage * galleryPageSize, (galleryPage + 1) * galleryPageSize);
  
  // Reset pages when switching tabs or years
  useEffect(() => {
    setDesktopPage(0);
    setGalleryPage(0);
  }, [activeTab, selectedYear]);

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen grainy-bg">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] pt-32 pb-20 flex items-center justify-center overflow-hidden border-b-8 border-accent-red">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: `url('${pageBackgrounds?.media.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_lpERPa9NunQSXwBDnHkdYXWkWpPCZMYYseIzSoRmKm4vZyvNzQzNYYxesAdYo7uITZV1CGIzvOMNgq2zMbsZ0YM5r5bob_CqY5vvtRF0LHXklp0FBEiBzsRQd8MGQcOqRDEQ-nteRAphfCZguHeVY2srcWophQCcWOiCsWBRV8CPIhO-xFulocGbbn-79wPdP2NYI99Sctefrm22L4q-PFYaPO5yxBe-dX1VBTFJadgPPA_4MUtIr7zkWToK5Qzec3jUGGRGqKqj'}')` }}
        ></div>
        <div className="relative z-20 text-center px-4 max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl leading-none tracking-tighter text-white drop-shadow-2xl uppercase"
          >
            MÉDIAS & <span className="text-primary">HIGHLIGHTS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm sm:text-lg md:text-xl font-light uppercase tracking-[0.3em] sm:tracking-[0.5em] text-slate-300 max-w-2xl mx-auto border-y border-white/20 py-4"
          >
            Revivez l'intensité brute et l'énergie pure de la scène
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!showMediaGallery ? (
          /* Empty State Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
          >
            <div>
              <h2 className="font-heading text-5xl md:text-7xl text-white uppercase mb-4 leading-none">
                Galerie de <span className="text-primary">Médias</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                Explorez les photos, vidéos et aftermovies ajoutés par nos équipes. Filtrez par année et type de contenu.
              </p>
            </div>
            <button
              onClick={() => setShowMediaGallery(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent-red hover:shadow-2xl text-black font-black uppercase tracking-widest rounded-lg transition-all transform hover:scale-105"
            >
              <Play size={24} className="fill-current" />
              Voir les médias
            </button>
          </motion.div>
        ) : (
          <>
            {/* Year Filter */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 border-b border-white/10 pb-8">
              {[2026, 2025, 2024, 2023, 2022, 2020, 2018, 2016, 2015].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`text-lg sm:text-xl font-heading tracking-widest transition-all ${selectedYear === year ? 'text-primary scale-110 sm:scale-125' : 'text-slate-500 hover:text-white'}`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              {['photos', 'vidéos', 'aftermovies'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 font-black uppercase tracking-widest rounded-lg skew-x-[-12deg] transition-all ${activeTab === tab ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                >
                  <span className="inline-block skew-x-[12deg]">{tab}</span>
            </button>
          ))}
        </div>

        {activeTab === 'photos' && (
          <motion.div 
            key={`${selectedYear}-photos`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            {/* Mobile Preview */}
            {isMobile && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {previewItems.map((src: string, i: number) => (
                    <div key={i} className="relative group overflow-hidden rounded-lg border border-white/5 hover:border-primary transition-all">
                      <img 
                        src={src} 
                        alt={`Gallery ${i}`} 
                        className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                {currentData.length > itemsPerPageMobile && (
                  <button
                    onClick={() => {
                      setShowGalleryModal(true);
                      setGalleryPage(0);
                    }}
                    className="w-full bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest mb-12"
                  >
                    Voir la galerie complète ({currentData.length})
                  </button>
                )}
              </>
            )}

            {/* Desktop Full Gallery */}
            {!isMobile && (
              <>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-12">
                  {currentDesktopItems.map((src: string, i: number) => (
                    <div key={i} className="masonry-item relative group overflow-hidden rounded-xl border-2 border-white/5 hover:border-primary transition-all">
                      <img 
                        src={src} 
                        alt={`Gallery ${i}`} 
                        className="w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-primary font-bold uppercase tracking-widest">Edition {selectedYear}</p>
                        <p className="text-xs text-slate-400">Lomé, Togo</p>
                      </div>
                    </div>
                  ))}
                </div>
                {desktopPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pb-12">
                    <button
                      onClick={() => setDesktopPage(p => Math.max(0, p - 1))}
                      disabled={desktopPage === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-bold uppercase tracking-widest text-sm"
                    >
                      <ChevronLeft size={18} /> Précédent
                    </button>
                    <span className="text-white font-bold text-sm">
                      Page {desktopPage + 1} / {desktopPages}
                    </span>
                    <button
                      onClick={() => setDesktopPage(p => Math.min(desktopPages - 1, p + 1))}
                      disabled={desktopPage === desktopPages - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-bold uppercase tracking-widest text-sm"
                    >
                      Suivant <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {(activeTab === 'vidéos' || activeTab === 'aftermovies') && (
          <motion.div 
            key={`${selectedYear}-videos`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            {/* Mobile Preview */}
            {isMobile && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {previewItems.map((video: any, i: number) => (
                    <div key={i} className="relative group overflow-hidden rounded-lg border border-white/10 hover:border-primary transition-all cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
                      <div className="relative aspect-video">
                        <img 
                          src={video.thumb} 
                          alt={video.title} 
                          className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="text-black w-6 h-6 fill-current" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 bg-accent-red text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{video.tag}</span>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{video.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {currentData.length > itemsPerPageMobile && (
                  <button
                    onClick={() => {
                      setShowGalleryModal(true);
                      setGalleryPage(0);
                    }}
                    className="w-full bg-primary/20 hover:bg-primary/40 text-primary rounded-lg px-6 py-3 transition-all font-bold uppercase tracking-widest mb-12"
                  >
                    Voir la galerie complète ({currentData.length})
                  </button>
                )}
              </>
            )}

            {/* Desktop Full Gallery */}
            {!isMobile && (
              <>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="font-heading text-6xl text-white uppercase">REPLAYS <span className="text-accent-red">&</span> EXCLUSIFS {selectedYear}</h2>
                  <div className="h-1 flex-grow bg-gradient-to-r from-accent-red to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {currentDesktopItems.map((video: any, i: number) => (
                    <div key={i} className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
                      <div className="relative aspect-video">
                        <img 
                          src={video.thumb} 
                          alt={video.title} 
                          className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="text-black w-10 h-10 fill-current" />
                          </div>
                        </div>
                        <span className="absolute top-4 left-4 bg-accent-red text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest">{video.tag}</span>
                        <span className="absolute bottom-4 right-4 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">{video.duration}</span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                        <p className="text-slate-400 text-sm">{video.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {desktopPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setDesktopPage(p => Math.max(0, p - 1))}
                      disabled={desktopPage === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-bold uppercase tracking-widest text-sm"
                    >
                      <ChevronLeft size={18} /> Précédent
                    </button>
                    <span className="text-white font-bold text-sm">
                      Page {desktopPage + 1} / {desktopPages}
                    </span>
                    <button
                      onClick={() => setDesktopPage(p => Math.min(desktopPages - 1, p + 1))}
                      disabled={desktopPage === desktopPages - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-bold uppercase tracking-widest text-sm"
                    >
                      Suivant <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
        </>
      )}
      </div>

      {/* Mobile Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-xl font-bold uppercase text-white">
                {activeTab === 'photos' ? 'Galerie Photos' : 'Galerie Vidéos'} {selectedYear}
              </h2>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className={`grid ${
                currentGalleryItems.length <= 2 ? 'grid-cols-2' : 
                currentGalleryItems.length <= 3 ? 'grid-cols-3' : 
                'grid-cols-2 gap-3'
              } gap-3`}>
                {activeTab === 'photos' ? (
                  currentGalleryItems.map((src: string, i: number) => (
                    <div key={i} className="relative overflow-hidden rounded-lg border border-white/10 aspect-square">
                      <img 
                        src={src} 
                        alt={`Photo ${i}`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))
                ) : (
                  currentGalleryItems.map((video: any, i: number) => (
                    <div key={i} className="relative overflow-hidden rounded-lg border border-white/10 aspect-video cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
                      <img 
                        src={video.thumb} 
                        alt={video.title} 
                        className="w-full h-full object-cover brightness-50"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="text-primary w-6 h-6 fill-current" />
                      </div>
                      <span className="absolute top-1 left-1 bg-accent-red text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">{video.tag}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {galleryPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <button 
                  onClick={() => setGalleryPage(p => Math.max(0, p - 1))}
                  disabled={galleryPage === 0}
                  className="p-2 hover:bg-white/10 disabled:opacity-50 transition-all rounded-lg"
                >
                  <ChevronLeft className="text-white" size={20} />
                </button>
                <span className="text-white font-bold text-sm">
                  Page {galleryPage + 1} / {galleryPages}
                </span>
                <button 
                  onClick={() => setGalleryPage(p => Math.min(galleryPages - 1, p + 1))}
                  disabled={galleryPage === galleryPages - 1}
                  className="p-2 hover:bg-white/10 disabled:opacity-50 transition-all rounded-lg"
                >
                  <ChevronRight className="text-white" size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Media;
