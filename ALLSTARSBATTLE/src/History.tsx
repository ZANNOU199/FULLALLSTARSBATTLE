import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsService } from './services/cmsService';
import { 
  ArrowRight, 
  ChevronDown,
  Trophy,
  Users,
  Globe,
  Zap
} from 'lucide-react';

import { TimelineEvent, Legend } from './types';

interface HistoryProps {
  onViewGallery?: (year: number) => (e: React.MouseEvent) => void;
}

const History = ({ onViewGallery }: HistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [wallOfFameYear, setWallOfFameYear] = useState<number | null>(null);
  const [wallOfFamePage, setWallOfFamePage] = useState(0);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [olderEvents, setOlderEvents] = useState<any[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [filteredLegends, setFilteredLegends] = useState<any[]>([]);
  const [legendFilter, setLegendFilter] = useState<'all' | 'bboy' | 'bgirl' | 'crew'>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [heroConfig, setHeroConfig] = useState({
    sinceYear: '2013',
    totalEditions: '12',
    title: 'L\'HISTOIRE',
    titleHighlight: 'DE ALLSTARBATTLE',
    description: 'Tracing the evolution of urban-luxury breakdance from Genesis to the Global Stage.'
  });
  const [statsConfig, setStatsConfig] = useState({
    years: '13',
    editions: '12',
    countries: '45+',
    participants: '500+',
    prize: '10M'
  });
  const [wallOfFameConfig, setWallOfFameConfig] = useState({
    title: 'WALL OF FAME',
    subtitle: 'The Legends Who Defined ASBI'
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getData();
      
      // Load hero and stats config from store
      if (data.history?.hero) {
        setHeroConfig(data.history.hero);
      }
      if (data.history?.stats) {
        setStatsConfig(data.history.stats);
      }
      if (data.history?.wallOfFame) {
        setWallOfFameConfig(data.history.wallOfFame);
      }
      
      // Check if history data exists and has timeline
      if (data.history?.timeline && Array.isArray(data.history.timeline)) {
        // Sort events by year descending
        const sortedEvents = [...data.history.timeline].sort((a, b) => parseInt(b.year) - parseInt(a.year));
        
        const formattedEvents = sortedEvents.map((event: TimelineEvent, index) => ({
          year: event.year,
          title: event.title,
          champion: event.champion,
          desc: event.description,
          image: event.image || `https://picsum.photos/seed/${event.year}/800/450`,
          current: index === 0,
          side: index % 2 === 0 ? 'left' : 'right'
        }));

        setTimelineEvents(formattedEvents.slice(0, 5));
        setOlderEvents(formattedEvents.slice(5));
      } else {
        // Use default data if history.timeline is not available
        const defaultEvents = [
          {
            year: '2024',
            title: 'L\'Éveil de Lomé',
            champion: 'B-BOY RYU',
            desc: 'Une édition mémorable au Japon.',
            image: 'https://picsum.photos/seed/hist1/800/600',
            current: true,
            side: 'left'
          }
        ];
        setTimelineEvents(defaultEvents);
        setOlderEvents([]);
      }

      // Check if history data exists and has legends
      if (data.history?.legends && Array.isArray(data.history.legends)) {
        const legsData = data.history.legends.map(l => ({
          id: l.id,
          name: l.name,
          title: l.title || 'Champion',
          origin: l.bio,
          image: l.photo,
          category: l.category || 'bboy',
          year: l.year || new Date().getFullYear(),
          type: l.type
        }));
        setLegends(legsData);
        
        // Extract unique years and sort descending
        const uniqueYears = [...new Set(legsData.map(l => l.year as number))].sort((a, b) => b - a);
        setAvailableYears(uniqueYears);
        
        // Initialize with "ALL YEARS" (null)
        setWallOfFameYear(null);
        filterLegendsByYear(legsData, null, 'all');
      } else {
        // Use default legend if no data available
        const defaultLegends = [{
          id: '1',
          name: 'Storm',
          title: 'Champion',
          origin: 'Légende du breaking européen.',
          image: 'https://picsum.photos/seed/legend1/400/600',
          category: 'bboy',
          year: 2024,
          type: 'individual'
        }];
        setLegends(defaultLegends);
        setAvailableYears([2024]);
        setWallOfFameYear(null);
        filterLegendsByYear(defaultLegends, null, 'all');
      }
    };

    loadData();
  }, []);

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleCmsUpdate = () => {
      cmsService.getData().then((data) => {
        if (data.history?.hero) {
          setHeroConfig(data.history.hero);
        }
        if (data.history?.stats) {
          setStatsConfig(data.history.stats);
        }
        if (data.history?.wallOfFame) {
          setWallOfFameConfig(data.history.wallOfFame);
        }

        // Update timeline if data exists
        if (data.history?.timeline && Array.isArray(data.history.timeline)) {
          const sortedEvents = [...data.history.timeline].sort((a, b) => parseInt(b.year) - parseInt(a.year));
          const formattedEvents = sortedEvents.map((event: TimelineEvent, index) => ({
            year: event.year,
            title: event.title,
            champion: event.champion,
            desc: event.description,
            image: event.image || `https://picsum.photos/seed/${event.year}/800/450`,
            current: index === 0,
            side: index % 2 === 0 ? 'left' : 'right'
          }));

          setTimelineEvents(formattedEvents.slice(0, 5));
          setOlderEvents(formattedEvents.slice(5));
        }

        // Update legends if data exists
        if (data.history?.legends && Array.isArray(data.history.legends)) {
          const legsData = data.history.legends.map(l => ({
            id: l.id,
            name: l.name,
            title: l.title || 'Champion',
            origin: l.bio,
            image: l.photo,
            category: l.category || 'bboy',
            year: l.year || new Date().getFullYear(),
            type: l.type
          }));
          setLegends(legsData);

          // Extract unique years and sort descending
          const uniqueYears = [...new Set(legsData.map(l => l.year as number))].sort((a, b) => b - a);
          setAvailableYears(uniqueYears);

          // Re-filter with current selections
          if (uniqueYears.length > 0) {
            filterLegendsByYear(legsData, wallOfFameYear, legendFilter);
          }
        }
      });
    };

    window.addEventListener('cmsDataChanged', handleCmsUpdate);
    return () => window.removeEventListener('cmsDataChanged', handleCmsUpdate);
  }, [wallOfFameYear, legendFilter]);

  const handleLegendFilter = (filter: 'all' | 'bboy' | 'bgirl' | 'crew') => {
    setLegendFilter(filter);
    setWallOfFamePage(0);
    filterLegendsByYear(legends, wallOfFameYear, filter);
  };

  const filterLegendsByYear = (legsData: any[], year: number | null, categoryFilter: 'all' | 'bboy' | 'bgirl' | 'crew') => {
    let filtered = legsData;

    // Filter by year
    if (year) {
      filtered = filtered.filter(leg => leg.year === year);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      const categoryMap: Record<string, string> = {
        bboy: 'bboy',
        bgirl: 'bgirl',
        crew: 'crew'
      };
      const targetCategory = categoryMap[categoryFilter];
      filtered = filtered.filter(leg => leg.category === targetCategory);
    }

    setFilteredLegends(filtered);
  };

  const handleYearChange = (year: number) => {
    const yearValue = year === 0 ? null : year;
    setWallOfFameYear(yearValue);
    setWallOfFamePage(0);
    filterLegendsByYear(legends, yearValue, legendFilter);
  };

  // Calculate pagination values
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredLegends.length / itemsPerPage);
  const startIndex = wallOfFamePage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLegends = filteredLegends.slice(startIndex, endIndex);

  return (
    <div className="bg-background-dark text-slate-100 font-display antialiased">
      {/* Hero Section - Improved responsiveness */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grainy-bg pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd1VTyAZyyZGaq3VJUTbCIx1IiDThn8h-wO9I1BZhj_dPmDpq8TGCvt5HQBTEq7lWaJlOG8kajuntaJ6Iir74MgDLTAWr3cy8XLHGVG28pxHr_E2oHY7hMYFpc1sfe26HnZA2ZI7q1P18lXBLZW0bgqZ3Bhd16m-sJOphITZXDisohjsTGokeXh9_rsuiqFvxrrFXh_a9wTldDbaUA48rqyOPi0uqku-S0_YGtb94_dkhOawO2sRvlwJKOleSukCppSESR_L9RB6EI" 
            alt="Heritage Background"
          />
        </div>
        <div className="relative z-20 text-center px-4 w-full max-w-5xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-red font-bold tracking-[0.4em] text-xs sm:text-sm mb-4 block"
          >
            DEPUIS {heroConfig.sinceYear} • {heroConfig.totalEditions} ÉDITIONS
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl text-white tracking-tighter leading-none mb-6 uppercase"
          >
            {heroConfig.title} <span className="text-primary italic">{heroConfig.titleHighlight}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg uppercase tracking-[0.2em] font-light px-4"
          >
            {heroConfig.description}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-6"
          >
            <button 
              onClick={() => {
                const el = document.getElementById('timeline');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-luxury-primary w-full sm:w-auto !px-10 !py-4 shimmer-effect"
            >
              EXPLORE TIMELINE
            </button>
            <button className="btn-luxury-secondary w-full sm:w-auto !px-10 !py-4">REWATCH FINALS</button>
          </motion.div>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="bg-surface-dark/50 border-b border-white/5 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {[
              { icon: Zap, value: statsConfig.years, label: 'ANNÉES' },
              { icon: Trophy, value: statsConfig.editions, label: 'ÉDITIONS' },
              { icon: Globe, value: statsConfig.countries, label: 'PAYS' },
              { icon: Users, value: statsConfig.participants, label: 'PARTICIPANTS' },
              { icon: Trophy, value: statsConfig.prize, label: 'FCFA DE PRIX' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-4 text-primary" />
                  <p className="font-heading text-4xl md:text-5xl text-white mb-2">{stat.value}</p>
                  <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vertical Timeline Section */}
      <section id="timeline" className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary/50 via-accent-red/50 to-transparent hidden lg:block"></div>
        
        <div className="space-y-24 lg:space-y-40">
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={event.year}
              initial={{ opacity: 0, x: event.side === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative group ${event.side === 'right' ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Year for Mobile */}
              <div className="lg:hidden w-full text-center mb-4">
                <span className="font-heading text-6xl text-primary/40 tracking-widest">{event.year}</span>
              </div>

              <div className={`lg:w-1/2 hidden lg:block ${event.side === 'left' ? 'text-right' : 'text-left'}`}>
                <h3 className="font-heading text-[10rem] text-stroke opacity-30 group-hover:opacity-100 transition-all duration-700">
                  {event.year}
                </h3>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden lg:flex items-center justify-center">
                <div className="size-4 rounded-full bg-primary ring-8 ring-primary/20"></div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-surface-dark border border-white/10 p-2 rounded-xl group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                  <div className="aspect-video overflow-hidden rounded-lg mb-6 lg:mb-8 relative">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      src={event.image} 
                      alt={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 lg:mb-6">
                      <div>
                        <h4 className="font-heading text-3xl lg:text-4xl text-white tracking-wide mb-2">{event.title}</h4>
                        <p className="text-accent-red font-bold text-xs tracking-widest uppercase">{event.champion}</p>
                      </div>
                      {event.current && (
                        <span className="bg-primary/20 text-primary font-bold text-[10px] px-3 py-1 rounded uppercase tracking-widest border border-primary/30">
                          CURRENT EDITION
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 font-light mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                      {event.desc}
                    </p>
                    <button 
                      onClick={onViewGallery ? () => onViewGallery(parseInt(event.year)) : undefined}
                      className="flex items-center gap-3 text-primary font-bold text-xs tracking-[0.2em] uppercase group/btn">
                      VIEW GALLERY <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Show More Button */}
          {!showAll && (
            <div className="flex justify-center pt-10 lg:pt-20 relative z-20">
              <button 
                onClick={() => setShowAll(true)}
                className="group flex flex-col items-center gap-4 text-primary"
              >
                <span className="text-[10px] lg:text-xs font-bold tracking-[0.4em] uppercase text-center">VOIR LES ÉDITIONS PRÉCÉDENTES</span>
                <div className="size-10 lg:size-12 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                  <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 animate-bounce" />
                </div>
              </button>
            </div>
          )}

          {/* Older Events */}
          <AnimatePresence>
            {showAll && (
              <div className="space-y-24 lg:space-y-40 mt-24 lg:mt-40">
                {olderEvents.map((event, index) => (
                  <motion.div 
                    key={event.year}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative group ${event.side === 'right' ? 'lg:flex-row-reverse' : ''}`}
                  >
                    {/* Year for Mobile */}
                    <div className="lg:hidden w-full text-center mb-4">
                      <span className="font-heading text-6xl text-primary/40 tracking-widest">{event.year}</span>
                    </div>

                    <div className={`lg:w-1/2 hidden lg:block ${event.side === 'left' ? 'text-right' : 'text-left'}`}>
                      <h3 className="font-heading text-[10rem] text-stroke opacity-30 group-hover:opacity-100 transition-all duration-700">
                        {event.year}
                      </h3>
                    </div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden lg:flex items-center justify-center">
                      <div className="size-4 rounded-full bg-primary ring-8 ring-primary/20"></div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                      <div className="bg-surface-dark border border-white/10 p-2 rounded-xl group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                        <div className="aspect-video overflow-hidden rounded-lg mb-6 lg:mb-8 relative">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            src={event.image} 
                            alt={event.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
                        </div>
                        <div className="p-6 lg:p-8">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 lg:mb-6">
                            <div>
                              <h4 className="font-heading text-3xl lg:text-4xl text-white tracking-wide mb-2">{event.title}</h4>
                              <p className="text-accent-red font-bold text-xs tracking-widest uppercase">{event.champion}</p>
                            </div>
                          </div>
                          <p className="text-slate-400 font-light mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
                            {event.desc}
                          </p>
                          <button 
                            onClick={onViewGallery ? () => onViewGallery(parseInt(event.year)) : undefined}
                            className="flex items-center gap-3 text-primary font-bold text-xs tracking-[0.2em] uppercase group/btn">
                            VIEW GALLERY <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Wall of Fame */}
      <section id="wall-of-fame" className="py-32 bg-surface-dark/30 border-y border-white/5 grainy-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-heading text-6xl md:text-8xl text-white mb-4 uppercase tracking-tight">{wallOfFameConfig.title}</h2>
            <p className="text-slate-500 font-bold tracking-[0.4em] uppercase text-xs">{wallOfFameConfig.subtitle}</p>
            <div className="w-24 h-1 bg-primary mx-auto mt-8"></div>
          </div>

          {/* Year Filter Select */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <select
                value={wallOfFameYear || ''}
                onChange={(e) => handleYearChange(e.target.value ? parseInt(e.target.value) : 0)}
                className="px-6 py-3 rounded-full bg-surface-dark border border-primary/50 text-white font-bold text-xs tracking-[0.1em] uppercase appearance-none cursor-pointer hover:border-primary/80 transition-all duration-300 pr-10"
              >
                <option value="">ALL YEARS</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'all', label: 'TOUS LES CHAMPIONS' },
              { id: 'bboy', label: 'B-BOY' },
              { id: 'bgirl', label: 'B-GIRL' },
              { id: 'crew', label: 'CREW' }
            ].map(filter => (
              <motion.button
                key={filter.id}
                onClick={() => handleLegendFilter(filter.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  legendFilter === filter.id
                    ? 'bg-primary text-background-dark border border-primary shadow-lg shadow-primary/50'
                    : 'border border-primary/30 text-primary hover:border-primary/60'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>

          {/* Legends Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${legendFilter}-${wallOfFameYear}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12"
            >
              {paginatedLegends.map((legend, index) => (
                <motion.div
                  key={legend.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl bg-background-dark border border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      src={legend.image}
                      alt={legend.name}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 p-4 md:p-6 lg:p-8 w-full">
                    <p className="text-primary font-heading text-lg md:text-2xl lg:text-3xl mb-2 line-clamp-2">{legend.name}</p>
                    <p className="text-accent-red font-bold text-[9px] tracking-widest uppercase mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {legend.title}
                    </p>
                    <p className="text-slate-400 text-[11px] font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
                      {legend.origin}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 mb-8">
              <motion.button
                onClick={() => setWallOfFamePage(Math.max(0, wallOfFamePage - 1))}
                disabled={wallOfFamePage === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  wallOfFamePage === 0
                    ? 'opacity-50 cursor-not-allowed border border-primary/20 text-primary/50'
                    : 'border border-primary/50 text-primary hover:border-primary bg-primary/10'
                }`}
              >
                ← PREVIOUS
              </motion.button>

              <div className="text-center">
                <p className="text-primary font-bold text-sm tracking-[0.1em]">
                  PAGE {wallOfFamePage + 1} OF {totalPages}
                </p>
              </div>

              <motion.button
                onClick={() => setWallOfFamePage(Math.min(totalPages - 1, wallOfFamePage + 1))}
                disabled={wallOfFamePage === totalPages - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  wallOfFamePage === totalPages - 1
                    ? 'opacity-50 cursor-not-allowed border border-primary/20 text-primary/50'
                    : 'border border-primary/50 text-primary hover:border-primary bg-primary/10'
                }`}
              >
                NEXT →
              </motion.button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default History;
