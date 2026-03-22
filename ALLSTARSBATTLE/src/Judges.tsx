import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cmsService } from './services/cmsService';
import { 
  ChevronDown, 
  ArrowRight,
  Arrow,
  ArrowLeft,
  Globe,
  PlayCircle,
  Share2,
  Eye,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

const Judges = () => {
  const [expandedStaff, setExpandedStaff] = React.useState<string | null>(null);
  const [judgesData, setJudgesData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [djsMcsData, setDjsMcsData] = useState<any[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
  const [organizersConfig, setOrganizersConfig] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await cmsService.getData();
        
        setJudgesData(data.participants.filter(p => p.category === 'judge').map(p => ({
          id: p.id,
          name: p.name,
          country: p.country,
          countryCode: p.countryCode,
          role: p.specialty,
          desc: p.bio,
          image: p.photo
        })));

        setDjsMcsData(data.participants.filter(p => (p.category === 'dj' || p.category === 'mc')).map(p => ({
          id: p.id,
          name: p.name,
          origin: p.country,
          countryCode: p.countryCode,
          role: p.category === 'dj' ? 'DJ' : 'MC',
          desc: p.bio,
          img: p.photo
        })));

        // Load organizers from CMS with all details
        const organizers = data.organizers || [];
        setStaffData(organizers.map(org => ({
          id: org.id,
          name: org.name,
          role: org.role,
          bio: org.bio,
          image: org.photo,
          socialLinks: org.socialLinks || {}
        })));

        setOrganizersConfig(data.organizersConfig);
      } catch (error) {
        console.error('Failed to load judges data:', error);
      }
    };
    
    loadData();

    // Listen for CMS data changes from admin panel
    const handleCMSDataChanged = (event: any) => {
      console.log('Judges page: CMS data changed, reloading...');
      loadData();
    };

    window.addEventListener('cmsDataChanged', handleCMSDataChanged);
    return () => window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedJudge, selectedArtist]);

  const toggleStaff = (name: string) => {
    setExpandedStaff(expandedStaff === name ? null : name);
  };

  // Judge Detail View
  if (selectedJudge) {
    return (
      <div className="bg-background-dark min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => setSelectedJudge(null)}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12 uppercase font-black tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste des juges
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src={selectedJudge.image} 
                alt={selectedJudge.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={`https://flagcdn.com/w40/${selectedJudge.countryCode}.png`}
                    alt={selectedJudge.country}
                    className="w-6 h-auto rounded-sm"
                  />
                  <span className="text-white font-bold uppercase tracking-widest text-sm">{selectedJudge.country}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-heading text-white uppercase leading-none">{selectedJudge.name}</h1>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 border-b border-primary/20 pb-2 inline-block">Biographie</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  {selectedJudge.desc}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Artist (DJ/MC) Detail View
  if (selectedArtist) {
    return (
      <div className="bg-background-dark min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => setSelectedArtist(null)}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12 uppercase font-black tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste des artistes
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src={selectedArtist.img} 
                alt={selectedArtist.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={`https://flagcdn.com/w40/${selectedArtist.countryCode}.png`}
                    alt={selectedArtist.origin}
                    className="w-6 h-auto rounded-sm"
                  />
                  <span className="text-white font-bold uppercase tracking-widest text-sm">{selectedArtist.origin}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-heading text-white uppercase leading-none">{selectedArtist.name}</h1>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <div className="bg-surface-dark border border-white/5 p-6 rounded-xl">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Rôle</span>
                <span className="text-white font-bold uppercase tracking-widest text-2xl text-primary">{selectedArtist.role}</span>
              </div>

              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 border-b border-primary/20 pb-2 inline-block">Biographie</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  {selectedArtist.desc}
                </p>
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
      <section className="relative pt-40 pb-24 px-6 grainy-bg border-b-4 border-accent-red overflow-hidden">
        <div className="absolute inset-0 diagonal-bg opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-red font-bold tracking-[0.3em] text-xs uppercase mb-4"
          >
            International Breaking Summit
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl text-white leading-none mb-6 uppercase"
          >
            JUGES & <span className="text-primary italic">ORGANISATION</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-slate-400 text-lg md:text-xl border-l-2 border-primary pl-6 py-2 text-left"
          >
            L’expertise au service de la culture. Une sélection d'élite pour garantir l'excellence du breaking mondial au Togo.
          </motion.p>
        </div>
      </section>

      {/* Judges Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-heading text-5xl text-white uppercase mb-2 tracking-tight">JURY INTERNATIONAL</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>
          <p className="text-slate-400 text-sm max-w-xs uppercase tracking-wider font-light">
            Cinq icônes mondiales, représentant les cinq piliers du jugement technique et artistique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {judgesData.map((judge, index) => (
            <motion.div 
              key={judge.id || judge.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedJudge(judge)}
              className="group bg-surface-dark p-2 border border-white/10 relative overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                {/* Hover Overlay */}
                <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-background-dark/80 p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Eye className="text-primary w-6 h-6" />
                  </div>
                </div>

                <img 
                  src={judge.image} 
                  alt={judge.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-primary text-background-dark px-3 py-1 font-heading text-xl flex items-center gap-2">
                  <img 
                    src={`https://flagcdn.com/w40/${judge.countryCode}.png`}
                    alt={judge.country}
                    className="w-6 h-auto rounded-sm shadow-sm"
                  />
                  {judge.country}
                </div>
              </div>
              <div className="px-2 pb-4">
                <h3 className="font-heading text-3xl text-white group-hover:text-primary transition-colors leading-none mb-1">{judge.name}</h3>
                <p className="text-accent-red text-[10px] font-black tracking-widest uppercase mb-3">{judge.role}</p>
                <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2">
                  {judge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DJs & MCs Section */}
      <section className="py-24 bg-surface-dark/30 grainy-bg border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <h2 className="font-heading text-5xl text-white uppercase tracking-tight">DJS & MC<span className="text-accent-red">S</span></h2>
            <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-bold">The heart and soul of the battle</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {djsMcsData.map((artist) => (
              <div 
                key={artist.id || artist.name} 
                onClick={() => setSelectedArtist(artist)}
                className="flex gap-4 p-4 border border-white/5 bg-background-dark group hover:border-primary/40 transition-all duration-300 cursor-pointer"
              >
                <div className="size-20 bg-primary/10 overflow-hidden flex-shrink-0 relative">
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Eye className="text-primary w-5 h-5" />
                  </div>

                  <img 
                    src={artist.img} 
                    alt={artist.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-heading text-2xl text-white leading-none mb-1 group-hover:text-primary transition-colors">{artist.name}</h4>
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://flagcdn.com/w40/${artist.countryCode}.png`}
                      alt={artist.origin}
                      className="w-4 h-auto rounded-sm shadow-sm"
                    />
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{artist.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Team Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <h2 className="font-heading text-6xl text-white uppercase leading-none mb-6 tracking-tighter">{organizersConfig?.sectionTitle?.split('ORGANISATION')[0] || 'L\'EQUIPE'} <br/><span className="text-accent-red italic">ORGANISATION</span></h2>
            <p className="text-slate-400 leading-relaxed font-light">
              {organizersConfig?.sectionDescription || 'Derrière le plus grand événement de breaking d\'Afrique de l\'Ouest, se trouve une équipe passionnée d\'activistes culturels et d\'experts en événementiel.'}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-0.5 bg-primary"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{organizersConfig?.organizationName || 'ASBI Togo 2026'}</span>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {staffData.map((staff) => (
              <div key={staff.name} className="border-b border-white/10">
                <div 
                  onClick={() => toggleStaff(staff.name)}
                  className="group flex items-center justify-between py-6 hover:bg-white/5 px-4 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="size-16 rounded-full overflow-hidden border border-primary/20 flex-shrink-0 cursor-pointer hover:border-primary transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrganizer(staff);
                      }}
                    >
                      <img 
                        src={staff.image} 
                        alt={staff.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 
                        className="font-heading text-3xl text-white uppercase group-hover:text-primary transition-colors leading-none mb-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrganizer(staff);
                        }}
                      >{staff.name}</h4>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{staff.role}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedStaff === staff.name ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedStaff === staff.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 px-24 text-slate-400 text-sm font-light leading-relaxed max-w-xl">
                        {staff.bio}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Détails Organisateur */}
      <AnimatePresence>
        {selectedOrganizer && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#111] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="sticky top-0 bg-[#111]/95 backdrop-blur border-b border-white/10 flex justify-between items-center p-6">
                <h2 className="text-2xl font-heading text-white">{selectedOrganizer.name}</h2>
                <button 
                  onClick={() => setSelectedOrganizer(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Photo */}
                <div className="flex justify-center">
                  <img 
                    src={selectedOrganizer.image} 
                    alt={selectedOrganizer.name}
                    className="w-full max-w-sm h-96 object-cover rounded-2xl border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Photo';
                    }}
                  />
                </div>

                {/* Rôle & Organisation */}
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold mb-2">Rôle/Titre</p>
                    <p className="text-lg text-primary font-bold">{selectedOrganizer.role}</p>
                  </div>
                </div>

                {/* Biographie */}
                <div className="space-y-3">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Biographie</p>
                  <p className="text-white leading-relaxed text-base">{selectedOrganizer.bio}</p>
                </div>

                {/* Réseaux Sociaux */}
                {selectedOrganizer.socialLinks && Object.keys(selectedOrganizer.socialLinks).length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Réseaux Sociaux</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrganizer.socialLinks.instagram && (
                        <a 
                          href={`https://instagram.com/${selectedOrganizer.socialLinks.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 rounded-xl transition-all group"
                        >
                          <Instagram size={24} className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Instagram</p>
                            <p className="text-white">@{selectedOrganizer.socialLinks.instagram}</p>
                          </div>
                        </a>
                      )}
                      {selectedOrganizer.socialLinks.facebook && (
                        <a 
                          href={`https://facebook.com/${selectedOrganizer.socialLinks.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all group"
                        >
                          <Facebook size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Facebook</p>
                            <p className="text-white">{selectedOrganizer.socialLinks.facebook}</p>
                          </div>
                        </a>
                      )}
                      {selectedOrganizer.socialLinks.twitter && (
                        <a 
                          href={`https://twitter.com/${selectedOrganizer.socialLinks.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 rounded-xl transition-all group"
                        >
                          <Twitter size={24} className="text-sky-400 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Twitter</p>
                            <p className="text-white">@{selectedOrganizer.socialLinks.twitter}</p>
                          </div>
                        </a>
                      )}
                      {selectedOrganizer.socialLinks.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${selectedOrganizer.socialLinks.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-600/30 rounded-xl transition-all group"
                        >
                          <Linkedin size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">LinkedIn</p>
                            <p className="text-white">{selectedOrganizer.socialLinks.linkedin}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Bouton Fermer */}
                <button 
                  onClick={() => setSelectedOrganizer(null)}
                  className="w-full mt-8 px-6 py-3 bg-primary text-background-dark rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(211,95,23,0.4)]"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Judges;
