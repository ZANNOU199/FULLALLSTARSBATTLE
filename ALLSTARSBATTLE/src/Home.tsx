import React, { useState, useEffect, useRef, ComponentType } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import OptimizedImage from './components/OptimizedImage';
import { GlobalConfig, MediaItem } from './types';

const { Menu, X, ChevronsDown, ChevronDown, Verified, Star, Instagram, Facebook, Twitter, Youtube, Calendar, MapPin, ArrowRight, GlassWater, Megaphone, Globe, Mail, Trophy, User } = LucideIcons as any;

const getIcon = (iconName: string): ComponentType<{ size?: number; className?: string }> => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Verified;
};

interface HomeProps {
  config: GlobalConfig | null;
  pageBackgrounds: any;
  featuredPiece: any;
  stats: any[];
  recentNews: any[];
  participants: any[];
  programData: any[];
  bracketData: any;
  mediaItems: MediaItem[];
  partnerData: any;
  logo: any;
}

export const CountdownItem = ({ value, label }: { value: number | string, label: string }) => (
  <div className="flex flex-col">
    <span className="text-4xl md:text-6xl font-heading text-primary">{value}</span>
    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
  </div>
);

export const DancerCard = ({ name, origin, image }: { name: string, origin: string, image: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -10 }}
    className="group relative overflow-hidden aspect-[3/4] bg-surface-dark shadow-2xl transition-all duration-500"
  >
    <OptimizedImage
      src={image}
      alt={name}
      className="w-full h-full group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
      objectFit="cover"
      quality={85}
      maxWidth={800}
      showSkeleton={true}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
    <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
      <p className="text-primary font-black text-2xl font-heading tracking-widest text-luxury-glow">{name}</p>
      <p className="text-[10px] uppercase text-slate-400 tracking-widest font-bold">{origin}</p>
    </div>
  </motion.div>
);

export const NewsCard = ({ date, title, desc, tag, coverImage, color = "primary", onClick }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`group bg-surface-dark border border-white/5 overflow-hidden transition-all duration-500 hover:border-${color}/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
  >
    <div className="aspect-video bg-zinc-800 relative overflow-hidden">
      <OptimizedImage
        src={coverImage}
        alt={title}
        className="w-full h-full group-hover:scale-110 transition-transform duration-700"
        objectFit="cover"
        quality={85}
        maxWidth={1200}
        showSkeleton={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent z-10 opacity-60"></div>
      <div className={`absolute top-4 left-4 z-20 ${color === "primary" ? "bg-primary text-background-dark" : "bg-accent-red text-white"} px-3 py-1 text-[10px] font-black tracking-widest`}>
        {tag}
      </div>
    </div>
    <div className="p-8 relative">
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{date}</span>
      <h3 className={`text-white font-heading text-2xl mt-3 mb-4 group-hover:text-${color} transition-colors leading-tight`}>{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">{desc}</p>
      <button 
        onClick={onClick}
        className={`inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-white group-hover:text-${color === "primary" ? "primary" : "accent-red"} transition-all`}
      >
        DÉCOUVRIR <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </motion.div>
);

const BracketMatch = ({ player1, player2, score1 = "--", score2 = "--", country1, country2, countryCode1, countryCode2, side = "left", color = "primary" }: any) => (
  <div className={`flex flex-col gap-1 bg-white/5 p-2 md:p-4 rounded border-${side === "left" ? "l" : "r"}-4 ${color === "primary" ? "border-primary" : "border-accent-red"} relative transition-all hover:bg-white/10`}>
    <div className={`flex justify-between items-center ${side === "right" ? "flex-row-reverse" : ""}`}>
      <span className="font-bold text-xl sm:text-2xl md:text-sm uppercase leading-tight flex items-center gap-1 md:gap-2">
        {player1} 
        {countryCode1 !== 'un' ? (
          <img src={`https://flagcdn.com/w20/${countryCode1}.png`} alt={country1} className="w-5 sm:w-6 h-auto rounded-sm" />
        ) : (
          <span className="text-slate-500">--</span>
        )}
      </span>
      <span className="text-primary font-mono text-xl sm:text-2xl md:text-sm">{score1}</span>
    </div>
    <div className="h-[1px] bg-white/10 my-1 md:my-2"></div>
    <div className={`flex justify-between items-center ${side === "right" ? "flex-row-reverse" : ""}`}>
      <span className="font-bold text-xl sm:text-2xl md:text-sm uppercase leading-tight flex items-center gap-1 md:gap-2">
        {player2} 
        {countryCode2 !== 'un' ? (
          <img src={`https://flagcdn.com/w20/${countryCode2}.png`} alt={country2} className="w-5 sm:w-6 h-auto rounded-sm" />
        ) : (
          <span className="text-slate-500">--</span>
        )}
      </span>
      <span className="text-primary font-mono text-xl sm:text-2xl md:text-sm">{score2}</span>
    </div>
  </div>
);

const BracketContent = ({ brackets }: { brackets?: any }) => {
  const data = brackets || { pouleA: { huitiemes: [], quarts: [], semis: [] }, pouleB: { huitiemes: [], quarts: [], semis: [] }, final: {} };
  return (
    <div className="grid grid-cols-7 gap-0 items-stretch py-12 min-h-[1600px] md:min-h-[800px]">
      {/* Poule A: Top 16 (Left) */}
      <div className="flex flex-col h-full">
        <h3 className="font-heading text-lg md:text-xl text-primary mb-8 text-center shrink-0">HUITIÈMES (A)</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleA?.huitiemes?.map((match: any, idx: number) => (
            <BracketMatch key={match.id} player1={match.player1} country1={match.country1} countryCode1={match.countryCode1} player2={match.player2} country2={match.country2} countryCode2={match.countryCode2} score1={match.score1} score2={match.score2} color={idx % 2 === 0 ? "accent-red" : "primary"} />
          )) || (
            <>
              <BracketMatch player1="VICTOR" country1="USA" countryCode1="us" player2="TBD" country2="--" countryCode2="un" color="accent-red" />
              <BracketMatch player1="PHIL WIZARD" country1="CAN" countryCode1="ca" player2="TBD" country2="--" countryCode2="un" />
            </>
          )}
        </div>
      </div>

      {/* Poule A: Quarts (Left) */}
      <div className="flex flex-col h-full pl-8">
        <h3 className="font-heading text-lg md:text-xl text-slate-400 mb-8 text-center shrink-0">QUARTS</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleA?.quarts?.map((match: any) => (
            <BracketMatch key={match.id} player1={match.player1 || 'TBD'} player2={match.player2 || 'TBD'} country1={match.country1 || '--'} country2={match.country2 || '--'} countryCode1={match.countryCode1 || 'un'} countryCode2={match.countryCode2 || 'un'} score1={match.score1 || '--'} score2={match.score2 || '--'} />
          ))}
        </div>
      </div>

      {/* Poule A: Semis (Left) */}
      <div className="flex flex-col h-full pr-8 pl-8">
        <h3 className="font-heading text-lg md:text-xl text-accent-red mb-8 text-center uppercase shrink-0">DEMI-FINALE</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleA?.semis?.map((match: any) => (
            <BracketMatch key={match.id} player1={match.player1 || 'TBD'} player2={match.player2 || 'TBD'} country1={match.country1 || '--'} country2={match.country2 || '--'} countryCode1={match.countryCode1 || 'un'} countryCode2={match.countryCode2 || 'un'} score1={match.score1 || '--'} score2={match.score2 || '--'} color="accent-red" />
          ))}
        </div>
      </div>

      {/* Center: Final */}
      <div className="flex flex-col h-full items-center justify-center px-4">
        <div className="text-center mb-12 shrink-0">
          <Trophy className="text-primary w-16 h-16 mx-auto mb-4" />
          <h2 className="font-heading text-6xl md:text-5xl text-white tracking-widest uppercase">FINALE</h2>
        </div>
      </div>

      {/* Poule B: Semis (Right) */}
      <div className="flex flex-col h-full pl-8 pr-8">
        <h3 className="font-heading text-lg md:text-xl text-accent-red mb-8 text-center uppercase shrink-0">DEMI-FINALE</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleB?.semis?.map((match: any) => (
            <BracketMatch key={match.id} player1={match.player1 || 'TBD'} player2={match.player2 || 'TBD'} country1={match.country1 || '--'} country2={match.country2 || '--'} countryCode1={match.countryCode1 || 'un'} countryCode2={match.countryCode2 || 'un'} score1={match.score1 || '--'} score2={match.score2 || '--'} color="accent-red" side="right" />
          ))}
        </div>
      </div>

      {/* Poule B: Quarts (Right) */}
      <div className="flex flex-col h-full pr-8">
        <h3 className="font-heading text-lg md:text-xl text-slate-400 mb-8 text-center shrink-0">QUARTS</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleB?.quarts?.map((match: any) => (
            <BracketMatch key={match.id} player1={match.player1 || 'TBD'} player2={match.player2 || 'TBD'} country1={match.country1 || '--'} country2={match.country2 || '--'} countryCode1={match.countryCode1 || 'un'} countryCode2={match.countryCode2 || 'un'} score1={match.score1 || '--'} score2={match.score2 || '--'} side="right" />
          ))}
        </div>
      </div>

      {/* Poule B: Top 16 (Right) */}
      <div className="flex flex-col h-full">
        <h3 className="font-heading text-lg md:text-xl text-primary mb-8 text-center shrink-0">HUITIÈMES (B)</h3>
        <div className="flex-1 flex flex-col justify-around py-4">
          {data.pouleB?.huitiemes?.map((match: any, idx: number) => (
            <BracketMatch key={match.id} player1={match.player1} country1={match.country1} countryCode1={match.countryCode1} player2={match.player2} country2={match.country2} countryCode2={match.countryCode2} score1={match.score1} score2={match.score2} side="right" color={idx % 2 === 0 ? "accent-red" : "primary"} />
          )) || (
            <>
              <BracketMatch player1="LIGEE" country1="CHN" countryCode1="cn" player2="TBD" country2="--" countryCode2="un" side="right" color="accent-red" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ config, pageBackgrounds, featuredPiece, stats, recentNews, participants, programData, bracketData, mediaItems, partnerData, logo }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = config?.eventDate ? new Date(config.eventDate) : new Date('2026-07-15T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config?.eventDate]);

  return (
    <div className="space-y-0">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-40 min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: `linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.85)), url('https://picsum.photos/seed/hero/1920/1080')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto">
          <motion.h1 
            key="hero-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none mb-4 tracking-tighter text-white text-luxury-glow uppercase"
          >
            THE ULTIMATE <br/>
            <span className="text-primary">BREAKING COMPETITION</span>
          </motion.h1>
          
          <motion.div
            key="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative py-6 px-4 md:px-12 border-y border-white/30 backdrop-blur-md bg-black/20">
              <p className="text-sm sm:text-lg md:text-2xl text-white font-medium uppercase tracking-[0.15em] md:tracking-[0.25em] leading-relaxed">
                {config?.hero?.subtitle || "JULY 15-20 2026 • LOMÉ, TOGO"}
              </p>
            </div>
          </motion.div>

          <motion.div 
            key="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none mb-4 tracking-tighter text-white text-luxury-glow mt-8"
          >
            {config?.hero?.title?.split(' ').slice(0, -1).join(' ') || "All STAR BATTLE"} <br/>
            <span className="text-primary">{config?.hero?.title?.split(' ').slice(-1) || "INTERNATIONAL"}</span>
          </motion.div>
          
          <motion.p 
            key="hero-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl font-light tracking-[0.5em] uppercase mb-12 text-slate-400"
          >
            {config?.hero?.tagline || "Le Trône. Le Respect. La Légende."}
          </motion.p>

          <motion.div 
            key="hero-countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16 border-y border-white/10 py-8"
          >
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Minutes" />
            <CountdownItem value={timeLeft.seconds} label="Seconds" />
          </motion.div>

          <motion.div 
            key="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto"
          >
            <Link to="/participate" className="btn-luxury-primary shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm inline-block text-center">
              PARTICIPATE
            </Link>
            <Link to="/history" className="btn-luxury-secondary shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm inline-block text-center">
              DISCOVER FESTIVAL
            </Link>
            <Link to="/partners" className="btn-luxury-accent shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm inline-block text-center">
              BECOME PARTNER
            </Link>
          </motion.div>

          <motion.div 
            key="hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center gap-4 max-w-md mx-auto"
          >
            <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronsDown className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
