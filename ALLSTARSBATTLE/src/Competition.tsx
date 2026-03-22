import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Medal, 
  Download, 
  Scale, 
  ClipboardCheck, 
  Gavel, 
  Trophy, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Competition = () => {
  return (
    <div className="bg-background-dark text-slate-100 font-display antialiased">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 urban-texture" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.85)), url('https://picsum.photos/seed/urban/1920/1080')` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl text-white tracking-tighter leading-none mb-6 drop-shadow-2xl uppercase"
          >
            LA <span className="text-primary">COMPÉTITION</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative py-6 px-4 md:px-12 border-y border-white/30 backdrop-blur-md bg-black/20">
              <p className="text-sm sm:text-lg md:text-2xl text-white font-medium uppercase tracking-[0.15em] md:tracking-[0.25em] leading-relaxed">
                Le format, les règles et l'élite du Breakdance.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-10">
          <ChevronDown className="text-4xl text-primary" />
        </div>
      </section>

      {/* Event Details Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-dark border border-white/10 p-8 hover:border-primary/50 transition-all group">
            <Calendar className="text-primary w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-1">Date</h3>
            <p className="text-white text-xl font-bold">15-20 Juillet 2026</p>
          </div>
          <div className="bg-surface-dark border border-white/10 p-8 hover:border-primary/50 transition-all group">
            <MapPin className="text-primary w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-1">Lieu</h3>
            <p className="text-white text-xl font-bold">Palais des Congrès, Lomé</p>
          </div>
          <div className="bg-surface-dark border border-white/10 p-8 hover:border-primary/50 transition-all group">
            <Users className="text-primary w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-1">Format</h3>
            <p className="text-white text-lg font-bold leading-tight">1v1 B-Boys, 1v1 B-Girls, 2v2 Crew</p>
          </div>
          <div className="bg-surface-dark border border-white/10 p-8 hover:border-primary/50 transition-all group">
            <Medal className="text-primary w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-1">Disciplines</h3>
            <p className="text-white text-xl font-bold">Breaking (Olympic Std)</p>
          </div>
        </div>
      </section>

      {/* Official Rules Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/3">
            <h2 className="font-heading text-5xl text-white mb-6 leading-none uppercase">Règlement <br/><span className="text-accent-red">Officiel</span></h2>
            <p className="text-slate-400 leading-relaxed mb-8 font-light">
              Le All Stars Battle International Togo suit les standards internationaux du WDSF Breaking avec un système de jugement "Trivium" adapté pour le spectacle.
            </p>
            <div className="inline-flex items-center gap-2 text-primary font-bold cursor-pointer hover:underline uppercase text-xs tracking-widest">
              <Download className="w-4 h-4" />
              Télécharger le PDF complet
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            {/* Accordion Item 1 */}
            <div className="bg-surface-dark border-l-4 border-primary p-6">
              <div className="flex justify-between items-center cursor-pointer">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 uppercase font-heading tracking-wider">
                  <Scale className="text-primary w-6 h-6" />
                  Critères de Jugement
                </h4>
                <ChevronUp className="w-5 h-5 text-slate-500" />
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background-dark p-4 border border-white/5">
                  <span className="text-primary font-heading text-lg uppercase tracking-wider">01. Technique</span>
                  <p className="text-sm text-slate-400 font-light mt-1">Fondations, exécution, athlétisme et propreté des mouvements.</p>
                </div>
                <div className="bg-background-dark p-4 border border-white/5">
                  <span className="text-primary font-heading text-lg uppercase tracking-wider">02. Musicalité</span>
                  <p className="text-sm text-slate-400 font-light mt-1">Capacité à s'adapter au rythme et aux breaks du DJ.</p>
                </div>
                <div className="bg-background-dark p-4 border border-white/5">
                  <span className="text-primary font-heading text-lg uppercase tracking-wider">03. Créativité</span>
                  <p className="text-sm text-slate-400 font-light mt-1">Originalité des passages, vocabulaire unique et transitions.</p>
                </div>
                <div className="bg-background-dark p-4 border border-white/5">
                  <span className="text-primary font-heading text-lg uppercase tracking-wider">04. Performance</span>
                  <p className="text-sm text-slate-400 font-light mt-1">Présence scénique, confiance et interaction avec l'adversaire.</p>
                </div>
              </div>
            </div>
            {/* Accordion Item 2 */}
            <div className="bg-surface-dark border-l-4 border-slate-700 p-6 hover:border-accent-red transition-all cursor-pointer group">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 uppercase font-heading tracking-wider group-hover:text-accent-red transition-colors">
                  <ClipboardCheck className="text-slate-400 w-6 h-6 group-hover:text-accent-red transition-colors" />
                  Qualifications
                </h4>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </div>
            </div>
            {/* Accordion Item 3 */}
            <div className="bg-surface-dark border-l-4 border-slate-700 p-6 hover:border-accent-red transition-all cursor-pointer group">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 uppercase font-heading tracking-wider group-hover:text-accent-red transition-colors">
                  <Gavel className="text-slate-400 w-6 h-6 group-hover:text-accent-red transition-colors" />
                  Code de Conduite
                </h4>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Pool Section */}
      <section className="bg-surface-dark py-24 relative overflow-hidden border-y border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-red/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-6xl text-white mb-2 uppercase tracking-tight">REWARDS & <span className="text-primary">PRIZE POOL</span></h2>
          <p className="text-slate-400 mb-16 tracking-[0.3em] uppercase text-xs font-bold">La gloire internationale et une dotation historique</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 bg-background-dark p-10 border-t-2 border-slate-400 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-400 text-background-dark font-heading px-4 py-1 text-xl uppercase tracking-widest">2ND PLACE</div>
              <Award className="text-slate-400 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-white text-3xl font-bold mb-2">2.500.000 FCFA</h3>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Trophée Argent + Package Partenaires</p>
            </div>
            {/* 1st Place */}
            <div className="order-1 md:order-2 bg-background-dark p-12 border-t-4 border-primary scale-110 shadow-2xl shadow-primary/10 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 gold-gradient text-background-dark font-heading px-6 py-2 text-2xl uppercase tracking-widest">CHAMPION</div>
              <Trophy className="text-primary w-16 h-16 mx-auto mb-4" />
              <h3 className="text-white text-5xl font-bold mb-2">5.000.000 FCFA</h3>
              <p className="text-primary text-[10px] uppercase font-black tracking-[0.2em] mb-4">Qualifié pour la Finale Mondiale</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Trophée Or + Voyage tous frais payés</p>
            </div>
            {/* 3rd Place */}
            <div className="order-3 md:order-3 bg-background-dark p-10 border-t-2 border-amber-700 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-heading px-4 py-1 text-xl uppercase tracking-widest">3RD PLACE</div>
              <Medal className="text-amber-700 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-white text-3xl font-bold mb-2">1.000.000 FCFA</h3>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Trophée Bronze + Dotation Matériel</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Competition;
