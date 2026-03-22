import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cmsService } from './services/cmsService';
import { 
  Search, 
  ChevronDown,
  Eye,
  ArrowLeft,
  Trophy,
  Zap,
  X
} from 'lucide-react';

const dancersData = []; // Removed hardcoded data

interface DancersProps {
  onViewPerformances?: () => void;
  pageBackgrounds?: any;
}

const Dancers = ({ onViewPerformances, pageBackgrounds }: DancersProps) => {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selectedDancer, setSelectedDancer] = useState<any>(null);
  const [dancersData, setDancersData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cmsService.getData().then(data => {
      const dancers = data.participants.filter(p => ['b-boy', 'b-girl', 'crew'].includes(p.category)).map(p => ({
        id: p.id,
        name: p.name,
        origin: p.country,
        countryCode: p.countryCode,
        style: p.specialty,
        status: 'Qualifier', // Default status
        image: p.photo,
        category: p.category === 'b-boy' ? 'B-Boy' : p.category === 'b-girl' ? 'B-Girl' : 'Crew', // Map to display names
        bio: p.bio
      }));
      setDancersData(dancers);
    });
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedDancer]);

  const filteredDancers = dancersData.filter(d => {
    const matchesFilter = filter === 'All' || d.category === filter;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.origin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Initial display counts to fill exactly 2 lines:
  // Mobile (1 col): 2
  // Tablet (2 cols): 4
  // Desktop (3 cols): 6
  // Large Desktop (4 cols): 8
  const getInitialCount = () => {
    if (typeof window === 'undefined') return 6;
    if (window.innerWidth >= 1280) return 8; // xl: 4 cols * 2 lines
    if (window.innerWidth >= 1024) return 6; // lg: 3 cols * 2 lines
    if (window.innerWidth >= 640) return 4;  // sm: 2 cols * 2 lines
    return 2;                                // mobile: 1 col * 2 lines
  };

  const initialCount = getInitialCount();
  const displayedDancers = showAll ? filteredDancers : filteredDancers.slice(0, initialCount);

  if (selectedDancer) {
    return (
      <div className="bg-background-dark min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => setSelectedDancer(null)}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12 uppercase font-black tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src={selectedDancer.image} 
                alt={selectedDancer.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={`https://flagcdn.com/w40/${selectedDancer.countryCode}.png`}
                    alt={selectedDancer.origin}
                    className="w-6 h-auto rounded-sm"
                  />
                  <span className="text-white font-bold uppercase tracking-widest text-sm">{selectedDancer.origin}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-heading text-white uppercase leading-none">{selectedDancer.name}</h1>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface-dark border border-white/5 p-6 rounded-xl">
                  <Trophy className="text-primary w-6 h-6 mb-4" />
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Statut</span>
                  <span className="text-white font-bold uppercase tracking-widest text-lg">{selectedDancer.status}</span>
                </div>
                <div className="bg-surface-dark border border-white/5 p-6 rounded-xl">
                  <Zap className="text-primary w-6 h-6 mb-4" />
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Style</span>
                  <span className="text-white font-bold uppercase tracking-widest text-lg">{selectedDancer.style}</span>
                </div>
              </div>

              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 border-b border-primary/20 pb-2 inline-block">Biographie</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  {selectedDancer.bio}
                </p>
              </div>

              <div className="pt-10 border-t border-white/5">
                <button 
                  onClick={onViewPerformances}
                  className="btn-luxury-primary w-full md:w-auto"
                >
                  VOIR SES PERFORMANCES
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-slate-100 font-display antialiased">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 urban-texture" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.85)), url('https://picsum.photos/seed/dancers/1920/1080')` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl gold-gradient-text tracking-tighter leading-none mb-6 drop-shadow-2xl uppercase"
          >
            LES DANSEURS STARS
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative py-6 px-4 md:px-12 border-y border-white/30 backdrop-blur-md bg-black/20">
              <p className="text-sm sm:text-lg md:text-2xl text-white font-medium uppercase tracking-[0.15em] md:tracking-[0.25em] leading-relaxed">
                L'élite de la danse urbaine réunie pour la bataille ultime en Afrique de l'Ouest.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-10">
          <ChevronDown className="text-4xl text-primary" />
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="w-full md:w-auto">
              <span className="text-primary/50 text-[10px] font-black uppercase tracking-widest whitespace-nowrap block mb-3 md:mb-0">Filtrer par :</span>
              <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-4">
                {['All', 'B-Boy', 'B-Girl', 'Crew'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat);
                      setShowAll(false);
                    }}
                    className={`px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap text-center ${
                      filter === cat 
                        ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(244,209,37,0.3)]' 
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="RECHERCHER UN DANSEUR..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-dark/50 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[10px] uppercase tracking-widest text-white focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dancers Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className={`grid gap-8 ${showAll ? 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {displayedDancers.map((dancer, index) => (
            <motion.div
              key={dancer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedDancer(dancer)}
              className="group relative bg-surface-dark border border-white/5 p-2 rounded-xl overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10 opacity-60"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-background-dark/80 p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Eye className="text-primary w-6 h-6" />
                  </div>
                </div>

                <img 
                  src={dancer.image} 
                  alt={dancer.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-2 right-2 z-20 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${
                  dancer.status === 'Champion' ? 'bg-primary text-background-dark' : 'bg-white/20 backdrop-blur-md text-white'
                }`}>
                  {dancer.status}
                </div>
              </div>
              
              <div className="mt-4 px-2 pb-2">
                <h3 className="font-heading text-xl text-white group-hover:text-primary transition-colors leading-none truncate">{dancer.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <img 
                    src={`https://flagcdn.com/w40/${dancer.countryCode}.png`}
                    alt={dancer.origin}
                    className="w-4 h-auto rounded-sm"
                  />
                  <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">{dancer.origin}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAll && filteredDancers.length > initialCount && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="btn-luxury-primary shimmer-effect"
            >
              VOIR PLUS DE DANSEURS
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dancers;
