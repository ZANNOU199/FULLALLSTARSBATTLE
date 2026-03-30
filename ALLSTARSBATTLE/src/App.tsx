import React, { useState, useEffect, useRef, ComponentType, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Lazy load page components for optimal performance
const Competition = lazy(() => import('./Competition'));
const Dancers = lazy(() => import('./Dancers'));
const Judges = lazy(() => import('./Judges'));
const Media = lazy(() => import('./Media'));
const History = lazy(() => import('./History'));
const Tickets = lazy(() => import('./Tickets'));
const Program = lazy(() => import('./Program'));
const News = lazy(() => import('./News'));
const ArtisticScene = lazy(() => import('./ArtisticScene'));
const Contact = lazy(() => import('./Contact'));
const Partners = lazy(() => import('./Partners'));
const Participate = lazy(() => import('./Participate'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const Login = lazy(() => import('./admin/Login'));
const FAQ = lazy(() => import('./FAQ'));

import { LoadingFallback } from './components/LoadingFallback';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeApply } from './hooks/useThemeApply';
import OptimizedImage from './components/OptimizedImage';
import OptimizedVideo from './components/OptimizedVideo';
import { usePagination } from './hooks/usePagination';
import ProtectedRoute from './admin/ProtectedRoute';

// Extraire les icônes nécessaires
const { Menu, X, ChevronsDown, ChevronDown, Verified, Star, Instagram, Facebook, Twitter, Youtube, Calendar, MapPin, ArrowRight, GlassWater, Megaphone, Globe, Mail, Trophy, User } = LucideIcons as any;

// Fonction pour obtenir une icône dynamiquement
const getIcon = (iconName: string): ComponentType<{ size?: number; className?: string }> => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Verified; // Default to Verified if not found
};

const NavLink = ({ href, children, active = false, red = false, onClick }: { href: string, children: React.ReactNode, active?: boolean, red?: boolean, onClick?: (e: React.MouseEvent) => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className={`text-xs font-bold tracking-widest uppercase transition-colors hover:text-primary cursor-pointer whitespace-nowrap ${active ? 'text-primary' : red ? 'text-accent-red' : 'text-white'}`}
  >
    {children}
  </a>
);

const NavDropdown = ({ label, items, active = false }: { label: string, items: { label: string, onClick: (e: React.MouseEvent) => void, active?: boolean }[], active?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={`flex items-center gap-1 text-xs font-bold tracking-widest uppercase transition-colors hover:text-primary cursor-pointer whitespace-nowrap ${active ? 'text-primary' : 'text-white'}`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-background-dark border border-white/10 py-2 shadow-2xl z-50"
          >
            {items.map((item, idx) => (
              <a
                key={idx}
                href="#"
                onClick={item.onClick}
                className={`block px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-white/5 hover:text-primary ${item.active ? 'text-primary' : 'text-slate-400'}`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CountdownItem = ({ value, label }: { value: number | string, label: string }) => (
  <div className="flex flex-col">
    <span className="text-4xl md:text-6xl font-heading text-primary">{value}</span>
    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
  </div>
);

const DancerCard = ({ name, origin, image }: { name: string, origin: string, image: string }) => (
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

const ProgramItem = ({ time, title, desc, color = "primary" }: { time: string, title: string, desc: string, color?: "primary" | "accent-red" }) => (
  <div className={`group/item border-l-2 ${color === "primary" ? "border-primary/30 hover:border-primary" : "border-accent-red/30 hover:border-accent-red"} pl-4 py-2 transition-all duration-300 hover:bg-white/5`}>
    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${color === "primary" ? "text-slate-500 group-hover/item:text-primary" : "text-slate-500 group-hover/item:text-accent-red"}`}>{time}</span>
    <h4 className="text-white font-bold text-sm uppercase tracking-tight mt-1">{title}</h4>
    <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">{desc}</p>
  </div>
);

interface NewsCardProps {
  date: string;
  title: string;
  desc: string;
  tag: string;
  coverImage?: string;
  color?: "primary" | "accent-red";
  onClick?: (e: React.MouseEvent) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ date, title, desc, tag, coverImage, color = "primary", onClick }) => (
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
  // Use bracket data if provided, otherwise use fallback
  const data = brackets || { pouleA: { huitiemes: [], quarts: [], semis: [] }, pouleB: { huitiemes: [], quarts: [], semis: [] }, final: {} };
  
  return (
  <div className="grid grid-cols-7 gap-0 items-stretch py-12 min-h-[1600px] md:min-h-[800px]">
    {/* Poule A: Top 16 (Left) */}
    <div className="flex flex-col h-full">
      <h3 className="font-heading text-lg md:text-xl text-primary mb-8 text-center shrink-0">HUITIÈMES (A)</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleA?.huitiemes?.map((match: any, idx: number) => (
          <BracketMatch
            key={match.id}
            player1={match.player1}
            country1={match.country1}
            countryCode1={match.countryCode1}
            player2={match.player2}
            country2={match.country2}
            countryCode2={match.countryCode2}
            score1={match.score1}
            score2={match.score2}
            color={idx % 2 === 0 ? "accent-red" : "primary"}
          />
        )) || (
          <>
            <BracketMatch player1="VICTOR" country1="USA" countryCode1="us" player2="TBD" country2="--" countryCode2="un" color="accent-red" />
            <BracketMatch player1="PHIL WIZARD" country1="CAN" countryCode1="ca" player2="TBD" country2="--" countryCode2="un" />
            <BracketMatch player1="DANY DANN" country1="FRA" countryCode1="fr" player2="TBD" country2="--" countryCode2="un" color="accent-red" />
            <BracketMatch player1="SHIGEKIX" country1="JPN" countryCode1="jp" player2="TBD" country2="--" countryCode2="un" />
          </>
        )}
      </div>
    </div>

    {/* Poule A: Quarts (Left) */}
    <div className="flex flex-col h-full pl-8">
      <h3 className="font-heading text-lg md:text-xl text-slate-400 mb-8 text-center shrink-0">QUARTS</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleA?.quarts?.[0] && (
          <BracketMatch
            player1={data.pouleA.quarts[0].player1 || 'TBD'}
            player2={data.pouleA.quarts[0].player2 || 'TBD'}
            country1={data.pouleA.quarts[0].country1 || '--'}
            country2={data.pouleA.quarts[0].country2 || '--'}
            countryCode1={data.pouleA.quarts[0].countryCode1 || 'un'}
            countryCode2={data.pouleA.quarts[0].countryCode2 || 'un'}
            score1={data.pouleA.quarts[0].score1 || '--'}
            score2={data.pouleA.quarts[0].score2 || '--'}
          />
        ) || (
          <div className="flex flex-col gap-1 bg-white/5 p-4 rounded border-l-4 border-white/20">
            <div className="text-xs md:text-[10px] uppercase text-slate-500 mb-2">Match A1/A2</div>
            <div className="flex justify-between items-center opacity-50"><span className="text-2xl md:text-sm font-bold">TBD</span> <span className="text-primary text-2xl md:text-sm">--</span></div>
            <div className="h-[1px] bg-white/10 my-2"></div>
            <div className="flex justify-between items-center opacity-50"><span className="text-2xl md:text-sm font-bold">TBD</span> <span className="text-primary text-2xl md:text-sm">--</span></div>
          </div>
        )}
        {data.pouleA?.quarts?.[1] && (
          <BracketMatch
            player1={data.pouleA.quarts[1].player1 || 'TBD'}
            player2={data.pouleA.quarts[1].player2 || 'TBD'}
            country1={data.pouleA.quarts[1].country1 || '--'}
            country2={data.pouleA.quarts[1].country2 || '--'}
            countryCode1={data.pouleA.quarts[1].countryCode1 || 'un'}
            countryCode2={data.pouleA.quarts[1].countryCode2 || 'un'}
            score1={data.pouleA.quarts[1].score1 || '--'}
            score2={data.pouleA.quarts[1].score2 || '--'}
          />
        ) || (
          <div className="flex flex-col gap-1 bg-white/5 p-4 rounded border-l-4 border-white/20">
            <div className="text-xs md:text-[10px] uppercase text-slate-500 mb-2">Match A3/A4</div>
            <div className="flex justify-between items-center opacity-50"><span className="text-2xl md:text-sm font-bold">TBD</span> <span className="text-primary text-2xl md:text-sm">--</span></div>
            <div className="h-[1px] bg-white/10 my-2"></div>
            <div className="flex justify-between items-center opacity-50"><span className="text-2xl md:text-sm font-bold">TBD</span> <span className="text-primary text-2xl md:text-sm">--</span></div>
          </div>
        )}
      </div>
    </div>

    {/* Poule A: Semis (Left) */}
    <div className="flex flex-col h-full pr-8 pl-8">
      <h3 className="font-heading text-lg md:text-xl text-accent-red mb-8 text-center uppercase shrink-0">DEMI-FINALE</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleA?.semis?.[0] ? (
          <BracketMatch
            player1={data.pouleA.semis[0].player1 || 'TBD'}
            player2={data.pouleA.semis[0].player2 || 'TBD'}
            country1={data.pouleA.semis[0].country1 || '--'}
            country2={data.pouleA.semis[0].country2 || '--'}
            countryCode1={data.pouleA.semis[0].countryCode1 || 'un'}
            countryCode2={data.pouleA.semis[0].countryCode2 || 'un'}
            score1={data.pouleA.semis[0].score1 || '--'}
            score2={data.pouleA.semis[0].score2 || '--'}
            color="accent-red"
          />
        ) : (
          <div className="flex flex-col gap-1 bg-accent-red/10 p-6 rounded border border-accent-red/30">
            <div className="flex justify-between items-center opacity-30"><span className="text-2xl md:text-sm font-bold uppercase">WINNER A1/2</span></div>
            <div className="h-[1px] bg-white/10 my-4 text-center text-xs text-white/20 font-heading">VS</div>
            <div className="flex justify-between items-center opacity-30"><span className="text-2xl md:text-sm font-bold uppercase">WINNER A3/4</span></div>
          </div>
        )}
      </div>
    </div>

    {/* Center: Final */}
    <div className="flex flex-col h-full items-center justify-center px-4">
      <div className="text-center mb-12 shrink-0">
        <Trophy className="text-primary w-16 h-16 mx-auto mb-4" />
        <h2 className="font-heading text-6xl md:text-5xl text-white tracking-widest uppercase">GRANDE FINALE</h2>
      </div>
      {data.final?.player1 && data.final?.player2 ? (
        <div className="w-full max-w-[260px] md:max-w-[300px] p-1 bg-gradient-to-b from-primary via-accent-red to-primary rounded-xl shadow-[0_0_60px_rgba(244,209,37,0.3)]">
          <div className="bg-background-dark p-6 md:p-8 rounded-lg flex flex-col items-center gap-6 md:gap-8">
            {/* Poule A Finalist */}
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4 justify-center w-full mb-4">
                {data.final.countryCode1 && data.final.countryCode1 !== 'un' ? (
                  <img src={`https://flagcdn.com/w40/${data.final.countryCode1.toLowerCase()}.png`} alt={data.final.country1} className="w-8 h-6 rounded" />
                ) : (
                  <div className="w-8 h-6 bg-slate-400/30 rounded flex items-center justify-center text-xs">UN</div>
                )}
                <span className="text-lg font-bold text-white text-center">{data.final.player1}</span>
              </div>
              <span className="text-xs text-slate-400 text-center">{data.final.country1 || '--'}</span>
            </div>
            
            {/* VS Divider */}
            <div className="w-full flex items-center gap-4 md:gap-6">
              <div className="h-px bg-white/10 grow"></div>
              <span className="text-sm text-primary font-heading">VS</span>
              <div className="h-px bg-white/10 grow"></div>
            </div>
            
            {/* Poule B Finalist */}
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4 justify-center w-full mb-4">
                {data.final.countryCode2 && data.final.countryCode2 !== 'un' ? (
                  <img src={`https://flagcdn.com/w40/${data.final.countryCode2.toLowerCase()}.png`} alt={data.final.country2} className="w-8 h-6 rounded" />
                ) : (
                  <div className="w-8 h-6 bg-slate-400/30 rounded flex items-center justify-center text-xs">UN</div>
                )}
                <span className="text-lg font-bold text-white text-center">{data.final.player2}</span>
              </div>
              <span className="text-xs text-slate-400 text-center">{data.final.country2 || '--'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[260px] md:max-w-[300px] p-1 bg-gradient-to-b from-primary via-accent-red to-primary rounded-xl shadow-[0_0_60px_rgba(244,209,37,0.3)]">
          <div className="bg-background-dark p-6 md:p-8 rounded-lg flex flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 bg-white/5 flex items-center justify-center mb-4 md:mb-6">
                <User className="w-10 h-10 md:w-12 md:h-12 text-slate-700" />
              </div>
              <span className="font-heading text-3xl md:text-3xl text-slate-500 uppercase text-center">À DÉTERMINER</span>
            </div>
            <div className="w-full flex items-center gap-4 md:gap-6">
              <div className="h-px bg-white/10 grow"></div>
              <div className="h-px bg-white/10 grow"></div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Poule B: Semis (Right) */}
    <div className="flex flex-col h-full pl-8 pr-8">
      <h3 className="font-heading text-lg md:text-xl text-accent-red mb-8 text-center uppercase shrink-0">DEMI-FINALE</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleB?.semis?.[0] ? (
          <BracketMatch
            player1={data.pouleB.semis[0].player1 || 'TBD'}
            player2={data.pouleB.semis[0].player2 || 'TBD'}
            country1={data.pouleB.semis[0].country1 || '--'}
            country2={data.pouleB.semis[0].country2 || '--'}
            countryCode1={data.pouleB.semis[0].countryCode1 || 'un'}
            countryCode2={data.pouleB.semis[0].countryCode2 || 'un'}
            score1={data.pouleB.semis[0].score1 || '--'}
            score2={data.pouleB.semis[0].score2 || '--'}
            color="accent-red"
            side="right"
          />
        ) : (
          <div className="flex flex-col gap-1 bg-accent-red/10 p-6 rounded border border-accent-red/30">
            <div className="flex justify-between items-center opacity-30"><span className="text-2xl md:text-sm font-bold uppercase">WINNER B1/2</span></div>
            <div className="h-[1px] bg-white/10 my-4 text-center text-xs text-white/20 font-heading">VS</div>
            <div className="flex justify-between items-center opacity-30"><span className="text-2xl md:text-sm font-bold uppercase">WINNER B3/4</span></div>
          </div>
        )}
      </div>
    </div>

    {/* Poule B: Quarts (Right) */}
    <div className="flex flex-col h-full pr-8">
      <h3 className="font-heading text-lg md:text-xl text-slate-400 mb-8 text-center shrink-0">QUARTS</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleB?.quarts?.[0] && (
          <BracketMatch
            player1={data.pouleB.quarts[0].player1 || 'TBD'}
            player2={data.pouleB.quarts[0].player2 || 'TBD'}
            country1={data.pouleB.quarts[0].country1 || '--'}
            country2={data.pouleB.quarts[0].country2 || '--'}
            countryCode1={data.pouleB.quarts[0].countryCode1 || 'un'}
            countryCode2={data.pouleB.quarts[0].countryCode2 || 'un'}
            score1={data.pouleB.quarts[0].score1 || '--'}
            score2={data.pouleB.quarts[0].score2 || '--'}
            side="right"
          />
        ) || (
          <div className="flex flex-col gap-1 bg-white/5 p-4 rounded border-r-4 border-white/20">
            <div className="text-xs md:text-[10px] uppercase text-slate-500 mb-2 text-right">Match B1/B2</div>
            <div className="flex justify-between items-center opacity-50"><span className="text-primary text-2xl md:text-sm">--</span> <span className="text-2xl md:text-sm font-bold">TBD</span></div>
            <div className="h-[1px] bg-white/10 my-2"></div>
            <div className="flex justify-between items-center opacity-50"><span className="text-primary text-2xl md:text-sm">--</span> <span className="text-2xl md:text-sm font-bold">TBD</span></div>
          </div>
        )}
        {data.pouleB?.quarts?.[1] && (
          <BracketMatch
            player1={data.pouleB.quarts[1].player1 || 'TBD'}
            player2={data.pouleB.quarts[1].player2 || 'TBD'}
            country1={data.pouleB.quarts[1].country1 || '--'}
            country2={data.pouleB.quarts[1].country2 || '--'}
            countryCode1={data.pouleB.quarts[1].countryCode1 || 'un'}
            countryCode2={data.pouleB.quarts[1].countryCode2 || 'un'}
            score1={data.pouleB.quarts[1].score1 || '--'}
            score2={data.pouleB.quarts[1].score2 || '--'}
            side="right"
          />
        ) || (
          <div className="flex flex-col gap-1 bg-white/5 p-4 rounded border-r-4 border-white/20">
            <div className="text-xs md:text-[10px] uppercase text-slate-500 mb-2 text-right">Match B3/B4</div>
            <div className="flex justify-between items-center opacity-50"><span className="text-primary text-2xl md:text-sm">--</span> <span className="text-2xl md:text-sm font-bold">TBD</span></div>
            <div className="h-[1px] bg-white/10 my-2"></div>
            <div className="flex justify-between items-center opacity-50"><span className="text-primary text-2xl md:text-sm">--</span> <span className="text-2xl md:text-sm font-bold">TBD</span></div>
          </div>
        )}
      </div>
    </div>

    {/* Poule B: Top 16 (Right) */}
    <div className="flex flex-col h-full">
      <h3 className="font-heading text-lg md:text-xl text-primary mb-8 text-center shrink-0">HUITIÈMES (B)</h3>
      <div className="flex-1 flex flex-col justify-around py-4">
        {data.pouleB?.huitiemes?.map((match: any, idx: number) => (
          <BracketMatch
            key={match.id}
            player1={match.player1}
            country1={match.country1}
            countryCode1={match.countryCode1}
            player2={match.player2}
            country2={match.country2}
            countryCode2={match.countryCode2}
            score1={match.score1}
            score2={match.score2}
            side="right"
            color={idx % 2 === 0 ? "accent-red" : "primary"}
          />
        )) || (
          <>
            <BracketMatch player1="LIGEE" country1="CHN" countryCode1="cn" player2="TBD" country2="--" countryCode2="un" side="right" color="accent-red" />
            <BracketMatch player1="KUZYA" country1="UKR" countryCode1="ua" player2="TBD" country2="--" countryCode2="un" side="right" />
            <BracketMatch player1="LEE" country1="NLD" countryCode1="nl" player2="TBD" country2="--" countryCode2="un" side="right" color="accent-red" />
            <BracketMatch player1="QUAKE" country1="TPE" countryCode1="tw" player2="TBD" country2="--" countryCode2="un" side="right" />
          </>
        )}
      </div>
    </div>
  </div>
);
};

import { cmsService } from './services/cmsService';
import { GlobalConfig, MediaItem } from './types';

const AppContent = () => {
  // Apply theme colors from CMS
  useThemeApply();

  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from URL
  const getCurrentPageFromUrl = (): 'home' | 'competition' | 'dancers' | 'judges' | 'media' | 'history' | 'tickets' | 'program' | 'news' | 'artistic' | 'contact' | 'partners' | 'participate' | 'admin' | 'faq' => {
    const path = location.pathname.slice(1) || 'home'; // Remove leading slash
    
    // Handle admin sub-routes
    if (path.startsWith('admin')) {
      return 'admin';
    }
    
    const pathToPage: Record<string, any> = {
      '': 'home',
      'competition': 'competition',
      'dancers': 'dancers',
      'judges': 'judges',
      'media': 'media',
      'history': 'history',
      'tickets': 'tickets',
      'program': 'program',
      'news': 'news',
      'artistic': 'artistic',
      'contact': 'contact',
      'partners': 'partners',
      'participate': 'participate',
      'faq': 'faq'
    };
    return pathToPage[path] || 'home';
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'competition' | 'dancers' | 'judges' | 'media' | 'history' | 'tickets' | 'program' | 'news' | 'artistic' | 'contact' | 'partners' | 'participate' | 'admin' | 'faq'>(getCurrentPageFromUrl());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('article') || undefined;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [pageBackgrounds, setPageBackgrounds] = useState<any>(null);
  const [featuredPiece, setFeaturedPiece] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [programData, setProgramData] = useState<any[]>([]);
  const [bracketData, setBracketData] = useState<any>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [participateData, setParticipateData] = useState<any>(null);
  const [logo, setLogo] = useState<any>(() => {
    // Load logo from localStorage for instant display on page load
    try {
      const cached = localStorage.getItem('asbi_logo');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [selectedMediaYear, setSelectedMediaYear] = useState<number>(() => {
    const urlParams = new URLSearchParams(location.search);
    const year = urlParams.get('year');
    return year ? parseInt(year) : 2026;
  });

  // Meta tags configuration for each page
  const getMetaTagsConfig = () => {
    const baseUrl = 'https://allstarsbattle.com';
    const pageConfigs: Record<string, any> = {
      home: {
        title: 'All STAR BATTLE 2026 - Compétition Mondiale de Breakdance',
        description: 'La plus grande compétition de breakdance d\'Afrique. Danseurs d\'élite. Jugement international. Togo 2026.',
        image: 'https://cdn.example.com/og-image.jpg',
        url: baseUrl,
        type: 'website'
      },
      competition: {
        title: 'La Compétition - All STAR BATTLE 2026',
        description: 'Découvrez le format, les brackets et les détails de la compétition mondiale de breakdance.',
        image: 'https://cdn.example.com/competition.jpg',
        url: `${baseUrl}/competition`,
        type: 'website'
      },
      dancers: {
        title: 'Les Danseurs - All STAR BATTLE 2026',
        description: 'Rencontrez les meilleurs b-boys et b-girls du monde participant à la compétition.',
        image: 'https://cdn.example.com/dancers.jpg',
        url: `${baseUrl}/dancers`,
        type: 'website'
      },
      judges: {
        title: 'Les Juges - All STAR BATTLE 2026',
        description: 'Découvrez le panel international de juges avec leur expertise et expérience.',
        image: 'https://cdn.example.com/judges.jpg',
        url: `${baseUrl}/judges`,
        type: 'website'
      },
      tickets: {
        title: 'Billetterie - All STAR BATTLE 2026',
        description: 'Réservez vos billets pour la compétition. Offres VIP et régulières disponibles.',
        image: 'https://cdn.example.com/tickets.jpg',
        url: `${baseUrl}/tickets`,
        type: 'website'
      },
      program: {
        title: 'Programme - All STAR BATTLE 2026',
        description: 'Consultez le programme complet des 3 jours de compétition et d\'événements.',
        image: 'https://cdn.example.com/program.jpg',
        url: `${baseUrl}/program`,
        type: 'website'
      },
      news: {
        title: 'Blog & Actualités - All STAR BATTLE 2026',
        description: 'Retrouvez toutes les actualités et mises à jour sur la compétition.',
        image: 'https://cdn.example.com/news.jpg',
        url: `${baseUrl}/news`,
        type: 'website'
      },
      media: {
        title: 'Galerie Médias - All STAR BATTLE 2026',
        description: 'Photos et vidéos exclusives des éditions précédentes et de la préparation.',
        image: 'https://cdn.example.com/media.jpg',
        url: `${baseUrl}/media`,
        type: 'website'
      },
      history: {
        title: 'Histoire du Festival - All STAR BATTLE 2026',
        description: 'Découvrez l\'histoire riche et l\'évolution du festival All Star Battle.',
        image: 'https://cdn.example.com/history.jpg',
        url: `${baseUrl}/history`,
        type: 'website'
      },
      artistic: {
        title: 'Scène Artistique - All STAR BATTLE 2026',
        description: 'Découvrez les performances artistiques et événements culturels du festival.',
        image: 'https://cdn.example.com/artistic.jpg',
        url: `${baseUrl}/artistic`,
        type: 'website'
      },
      partners: {
        title: 'Partenaires - All STAR BATTLE 2026',
        description: 'Explorez nos partenaires institutionnels et sponsors officiels.',
        image: 'https://cdn.example.com/partners.jpg',
        url: `${baseUrl}/partners`,
        type: 'website'
      },
      participate: {
        title: 'Participer - All STAR BATTLE 2026',
        description: 'Comment participer à la compétition All Star Battle 2026. Conditions et inscription.',
        image: 'https://cdn.example.com/participate.jpg',
        url: `${baseUrl}/participate`,
        type: 'website'
      },
      contact: {
        title: 'Contact - All STAR BATTLE 2026',
        description: 'Contactez-nous pour vos questions, partenariats ou demandes spéciales.',
        image: 'https://cdn.example.com/og-image.jpg',
        url: `${baseUrl}/contact`,
        type: 'website'
      },
      faq: {
        title: 'FAQ - All STAR BATTLE 2026',
        description: 'Questions fréquemment posées sur le festival, les billettes et la compétition.',
        image: 'https://cdn.example.com/og-image.jpg',
        url: `${baseUrl}/faq`,
        type: 'website'
      }
    };

    return pageConfigs[currentPage] || pageConfigs.home;
  };

  // Update meta tags when page changes
  useEffect(() => {
    const config = getMetaTagsConfig();
    
    // Mettre à jour le titre
    document.title = config.title;

    // Mettre à jour ou créer meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', config.description);

    // Open Graph - og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', config.title);

    // Open Graph - og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', config.description);

    // Open Graph - og:image
    if (config.image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', config.image);
    }

    // Open Graph - og:url
    if (config.url) {
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', config.url);
    }

    // Open Graph - og:type
    if (config.type) {
      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) {
        ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        document.head.appendChild(ogType);
      }
      ogType.setAttribute('content', config.type);
    }

    // Twitter - twitter:title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', config.title);

    // Twitter - twitter:description
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', config.description);

    // Twitter - twitter:image
    if (config.image) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', config.image);
    }

    // Twitter - twitter:creator
    if (config.twitterHandle) {
      let twitterCreator = document.querySelector('meta[name="twitter:creator"]');
      if (!twitterCreator) {
        twitterCreator = document.createElement('meta');
        twitterCreator.setAttribute('name', 'twitter:creator');
        document.head.appendChild(twitterCreator);
      }
      twitterCreator.setAttribute('content', config.twitterHandle);
    }
  }, [currentPage]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname.slice(1) || 'home';
      const urlParams = new URLSearchParams(window.location.search);
      const articleId = urlParams.get('article');
      const year = urlParams.get('year');

      const pathToPage: Record<string, typeof currentPage> = {
        '': 'home',
        'competition': 'competition',
        'dancers': 'dancers',
        'judges': 'judges',
        'media': 'media',
        'history': 'history',
        'tickets': 'tickets',
        'program': 'program',
        'news': 'news',
        'artistic': 'artistic',
        'contact': 'contact',
        'partners': 'partners',
        'participate': 'participate',
        'admin': 'admin',
        'faq': 'faq'
      };

      const pageFromUrl = pathToPage[currentPath] || 'home';
      setCurrentPage(pageFromUrl);
      
      if (articleId) {
        setSelectedArticleId(articleId);
      } else {
        setSelectedArticleId(undefined);
      }
      
      if (year) {
        setSelectedMediaYear(parseInt(year));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save navigation state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedArticleId) {
      localStorage.setItem('selectedArticleId', selectedArticleId);
    } else {
      localStorage.removeItem('selectedArticleId');
    }
  }, [selectedArticleId]);

  useEffect(() => {
    localStorage.setItem('selectedMediaYear', selectedMediaYear.toString());
  }, [selectedMediaYear]);

  const loadCMSData = async () => {
    const data = await cmsService.getData();
    setConfig(data.globalConfig);
    setPageBackgrounds(data.pageBackgrounds);
    setFeaturedPiece(data.featuredPiece);
    setStats(data.globalConfig.homepageStats);
    setRecentNews(data.blog.articles.slice(0, 3));
    setParticipants(data.participants);
    setProgramData(data.program);
    setBracketData(data.competition.brackets);
    setMediaItems(data.media || []);
    setPartnerData(data.partners);
    setParticipateData(data.participate);
    
    // Cache logo in localStorage for instant display on next page load
    if (data.siteAssets?.logo) {
      localStorage.setItem('asbi_logo', JSON.stringify(data.siteAssets.logo));
      setLogo(data.siteAssets.logo);
    }
  };

  useEffect(() => {
    loadCMSData();
  }, []);

  // Recharge la config quand on revient de l'admin avec les nouvelles données
  useEffect(() => {
    if (currentPage !== 'admin') {
      loadCMSData();
    }
  }, [currentPage]);

  // Listen for admin changes to sync data in real-time
  useEffect(() => {
    const handleCMSDataChanged = async () => {
      console.log('App.tsx: CMS data changed, reloading homepage data');
      try {
        const updatedData = await cmsService.getData();
        setConfig(updatedData.globalConfig);
        setPageBackgrounds(updatedData.pageBackgrounds);
        setFeaturedPiece(updatedData.featuredPiece);
        setStats(updatedData.globalConfig.homepageStats);
        setRecentNews(updatedData.blog.articles.slice(0, 3));
        setParticipants(updatedData.participants);
        setProgramData(updatedData.program);
        setBracketData(updatedData.competition.brackets);
        setMediaItems(updatedData.media || []);
        setPartnerData(updatedData.partners);
        setParticipateData(updatedData.participate);
        
        // Cache logo in localStorage for instant display
        if (updatedData.siteAssets?.logo) {
          localStorage.setItem('asbi_logo', JSON.stringify(updatedData.siteAssets.logo));
          setLogo(updatedData.siteAssets.logo);
        }
        
        console.log('App.tsx: Homepage data updated with latest articles from API');
      } catch (error) {
        console.error('Failed to reload homepage data:', error);
      }
    };
    
    window.addEventListener('cmsDataChanged', handleCMSDataChanged);
    return () => window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = config?.eventDate ? new Date(config.eventDate) : new Date('2026-03-20T00:00:00');
    
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateTo = (page: 'home' | 'competition' | 'dancers' | 'judges' | 'media' | 'history' | 'tickets' | 'program' | 'news' | 'artistic' | 'contact' | 'partners' | 'participate' | 'admin' | 'faq', anchor?: string, articleId?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setCurrentPage(page);
    setSelectedArticleId(articleId);
    setIsMenuOpen(false);
    
    // Update URL using React Router
    const pageToPath: Record<string, string> = {
      'home': '/',
      'competition': '/competition',
      'dancers': '/dancers',
      'judges': '/judges',
      'media': '/media',
      'history': '/history',
      'tickets': '/tickets',
      'program': '/program',
      'news': '/news',
      'artistic': '/artistic',
      'contact': '/contact',
      'partners': '/partners',
      'participate': '/participate',
      'admin': '/admin',
      'faq': '/faq'
    };
    
    const path = pageToPath[page] || '/';
    const url = articleId ? `${path}?article=${articleId}` : path;
    navigate(url);
    
    if (anchor) {
      setTimeout(() => {
        const element = document.getElementById(anchor.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const changePage = (page: typeof currentPage, articleId?: string) => {
    setCurrentPage(page);
    setSelectedArticleId(articleId);
    
    // Update URL using React Router
    const pageToPath: Record<string, string> = {
      'home': '/',
      'competition': '/competition',
      'dancers': '/dancers',
      'judges': '/judges',
      'media': '/media',
      'history': '/history',
      'tickets': '/tickets',
      'program': '/program',
      'news': '/news',
      'artistic': '/artistic',
      'contact': '/contact',
      'partners': '/partners',
      'participate': '/participate',
      'admin': '/admin',
      'faq': '/faq'
    };
    
    const path = pageToPath[page] || '/';
    const url = articleId ? `${path}?article=${articleId}` : path;
    navigate(url);
  };
  const [scrolled, setScrolled] = useState(false);
  const [bracketScale, setBracketScale] = useState(1);
  const [bracketHeight, setBracketHeight] = useState(1600);
  const bracketHeightRef = useRef(bracketHeight);
  const bracketContainerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bracketHeightRef.current = bracketHeight;
  }, [bracketHeight]);

  useEffect(() => {
    const updateScale = () => {
      if (!bracketContainerRef.current) return;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const targetWidth = 1200;
      const targetHeight = Math.max(800, bracketHeightRef.current);

      // Sur PC/tablette on doit voir le bracket à taille réelle (scale = 1).
      // On réduit uniquement quand la taille de l'écran est plus petite que le visuel.
      const scaleWidth = (containerWidth - 24) / targetWidth;
      const scaleHeight = (containerHeight - 200) / targetHeight; // Espace pour header/footer

      // Sur PC / tablette, on affiche le bracket à taille réelle (scale=1) pour prendre toute la largeur.
      // Sur mobile, on le scale pour tenir dans l'écran.
      let scale = containerWidth >= targetWidth ? 1 : scaleWidth;

      // Ne jamais descendre sous 0.25 pour garder lisible
      scale = Math.max(0.25, scale);

      setBracketScale(scale);
    };

    updateScale();
    const timer = setTimeout(updateScale, 500);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (measureRef.current) {
        const height = measureRef.current.offsetHeight;
        if (height > 100) {
          setBracketHeight(height);
        }
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (measureRef.current) {
      resizeObserver.observe(measureRef.current);
      updateHeight();
    }

    const interval = setInterval(updateHeight, 1000);
    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAVBAR */}
      {currentPage !== 'admin' && (
        <>
          <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background-dark/95 backdrop-blur-md border-b border-primary/10 h-16' : 'bg-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              {logo?.url && (
                <img 
                  src={logo.url} 
                  alt={logo.alt || "Site Logo"} 
                  className="h-16 w-auto max-w-[300px] object-contain cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  onClick={navigateTo('home')}
                />
              )}
            </div>
            
            <div className="hidden xl:flex items-center space-x-8">
              <NavLink href="#home" active={currentPage === 'home'} onClick={navigateTo('home')}>Accueil</NavLink>
              
              <NavDropdown 
                label="Le Festival" 
                active={currentPage === 'history' || currentPage === 'program' || currentPage === 'artistic' || currentPage === 'partners'}
                items={[
                  { label: "Histoire", onClick: navigateTo('history'), active: currentPage === 'history' },
                  { label: "Programme", onClick: navigateTo('program'), active: currentPage === 'program' },
                  { label: "Scène Artistique", onClick: navigateTo('artistic'), active: currentPage === 'artistic' },
                  { label: "Partenaires", onClick: navigateTo('partners'), active: currentPage === 'partners' }
                ]} 
              />

              <NavDropdown 
                label="Compétition" 
                active={currentPage === 'competition' || currentPage === 'dancers' || currentPage === 'judges'}
                items={[
                  { label: "Brackets", onClick: navigateTo('home', '#brackets') },
                  { label: "Les Danseurs", onClick: navigateTo('dancers'), active: currentPage === 'dancers' },
                  { label: "Les Juges", onClick: navigateTo('judges'), active: currentPage === 'judges' }
                ]} 
              />

              <NavLink href="#tickets" active={currentPage === 'tickets'} onClick={navigateTo('tickets')}>Billetterie</NavLink>
              <NavLink href="#media" active={currentPage === 'media'} onClick={navigateTo('media')}>Médias</NavLink>
              <NavLink href="#news" active={currentPage === 'news'} onClick={navigateTo('news')}>Blog</NavLink>
              <NavLink href="#vip" red onClick={navigateTo('home', '#vip')}>VIP</NavLink>
              <NavLink href="#faq" active={currentPage === 'faq'} onClick={navigateTo('faq')}>FAQ</NavLink>
              <NavLink href="#contact" active={currentPage === 'contact'} onClick={navigateTo('contact')}>Contact</NavLink>
            </div>

            <div className="flex items-center gap-4">
              <button className="xl:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background-dark pt-24 px-6 xl:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-8 text-left max-w-md mx-auto">
              <a href="#home" onClick={navigateTo('home')} className={`text-3xl font-heading uppercase ${currentPage === 'home' ? 'text-primary' : 'text-white'}`}>Accueil</a>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase">Le Festival</p>
                <div className="flex flex-col space-y-4 pl-4 border-l border-white/10">
                  <a href="#history" onClick={navigateTo('history')} className={`text-xl font-heading uppercase ${currentPage === 'history' ? 'text-primary' : 'text-white'}`}>Histoire</a>
                  <a href="#program" onClick={navigateTo('program')} className={`text-xl font-heading uppercase ${currentPage === 'program' ? 'text-primary' : 'text-white'}`}>Programme</a>
                  <a href="#artistic" onClick={navigateTo('artistic')} className={`text-xl font-heading uppercase ${currentPage === 'artistic' ? 'text-primary' : 'text-white'}`}>Scène Artistique</a>
                  <a href="#partners" onClick={navigateTo('partners')} className={`text-xl font-heading uppercase ${currentPage === 'partners' ? 'text-primary' : 'text-white'}`}>Partenaires</a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase">Compétition</p>
                <div className="flex flex-col space-y-4 pl-4 border-l border-white/10">
                  <a href="#brackets" onClick={navigateTo('home', '#brackets')} className="text-xl font-heading text-white uppercase">Brackets</a>
                  <a href="#dancers" onClick={navigateTo('dancers')} className={`text-xl font-heading uppercase ${currentPage === 'dancers' ? 'text-primary' : 'text-white'}`}>Danseurs</a>
                  <a href="#judges" onClick={navigateTo('judges')} className={`text-xl font-heading uppercase ${currentPage === 'judges' ? 'text-primary' : 'text-white'}`}>Juges & Organistaion</a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase">Expérience</p>
                <div className="flex flex-col space-y-4 pl-4 border-l border-white/10">
                  <a href="#tickets" onClick={navigateTo('tickets')} className={`text-xl font-heading uppercase ${currentPage === 'tickets' ? 'text-primary' : 'text-white'}`}>Billetterie</a>
                  <a href="#media" onClick={navigateTo('media')} className={`text-xl font-heading uppercase ${currentPage === 'media' ? 'text-primary' : 'text-white'}`}>Médias</a>
                  <a href="#news" onClick={navigateTo('news')} className={`text-xl font-heading uppercase ${currentPage === 'news' ? 'text-primary' : 'text-white'}`}>Blog</a>
                  <a href="#vip" onClick={navigateTo('home', '#vip')} className="text-xl font-heading text-accent-red uppercase">Espace VIP</a>
                </div>
              </div>

              <a href="#contact" onClick={navigateTo('contact')} className={`text-3xl font-heading uppercase ${currentPage === 'contact' ? 'text-primary' : 'text-white'}`}>Contact</a>
              
              <a href="#faq" onClick={navigateTo('faq')} className={`text-3xl font-heading uppercase ${currentPage === 'faq' ? 'text-primary' : 'text-white'}`}>FAQ</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}

      {currentPage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section id="home" className="relative min-h-screen flex flex-col justify-center items-center pt-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          {/* Video for Tablet & PC */}
          <div className="hidden md:block w-full h-full absolute">
            <OptimizedVideo
              src={pageBackgrounds?.hero.videoUrl}
              poster={pageBackgrounds?.hero.imageUrl}
              className="w-full h-full opacity-50 scale-105"
              muted={true}
              autoPlay={true}
              loop={true}
              controls={false}
              loading="eager"
              quality="medium"
            />
          </div>
          
          {/* Photo for Mobile */}
          {pageBackgrounds?.hero.imageUrl && (
            <div className="md:hidden w-full h-full absolute">
              <OptimizedImage
                src={pageBackgrounds.hero.imageUrl}
                alt="Hero background"
                className="w-full h-full opacity-60 scale-110"
                objectFit="cover"
                loading="eager"
                quality={75}
                maxWidth={1080}
              />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/70 via-background-dark/20 to-background-dark/80"></div>
          <div className="absolute inset-0 grainy-bg opacity-20"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-red font-heading text-2xl tracking-[0.3em] block uppercase mb-6"
          >
            {config?.hero.location || "TOGO 2026"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none mb-4 tracking-tighter text-white text-luxury-glow"
          >
            {config?.hero.title.split(' ').slice(0, -1).join(' ') || "All STAR BATTLE"} <br/>
            <span className="text-primary">{config?.hero.title.split(' ').slice(-1) || "INTERNATIONAL"}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl font-light tracking-[0.5em] uppercase mb-12 text-slate-400"
          >
            {config?.hero.subtitle || "Le Trône. Le Respect. La Légende."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16 border-y border-white/10 py-8"
          >
            <CountdownItem value={timeLeft.days} label="Jours" />
            <CountdownItem value={timeLeft.hours} label="Heures" />
            <CountdownItem value={timeLeft.minutes} label="Minutes" />
            <CountdownItem value={timeLeft.seconds} label="Secondes" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto"
          >
            <button onClick={navigateTo('participate')} className="btn-luxury-primary shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm">
              PARTICIPER
            </button>
            <button onClick={navigateTo('history')} className="btn-luxury-secondary shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm">
              DÉCOUVRIR LE FESTIVAL
            </button>
            <button onClick={navigateTo('partners')} className="btn-luxury-accent shimmer-effect flex-1 sm:flex-none md:flex-1 lg:flex-none px-6 md:px-8 lg:px-10 py-3 md:py-4 text-xs md:text-sm">
              DEVENIR PARTENAIRE
            </button>
          </motion.div>

          {/* Social Media Icons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center gap-4 max-w-md mx-auto"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Suivez-nous :</span>
            <div className="flex gap-8">
              <a href={config?.socials.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-all hover:scale-125"><Instagram className="w-5 h-5" /></a>
              <a href={config?.socials.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-all hover:scale-125"><Facebook className="w-5 h-5" /></a>
              <a href={config?.socials.twitter || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-all hover:scale-125"><Twitter className="w-5 h-5" /></a>
              <a href={config?.socials.youtube || '#'} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-all hover:scale-125"><Youtube className="w-5 h-5" /></a>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronsDown className="text-primary w-8 h-8" />
        </div>
      </section>

      {/* LA COMPÉTITION */}
      <section id="competition" className="py-24 bg-surface-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent-red/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 aspect-video w-full bg-cover bg-center rounded-sm border-l-4 border-primary overflow-hidden">
              {pageBackgrounds?.competition?.imageUrl && (
                <img 
                  src={pageBackgrounds.competition.imageUrl} 
                  alt="Competition" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Aperçu</span>
            <h2 className="font-heading text-5xl md:text-7xl text-white mb-6 uppercase">LA COMPÉTITION</h2>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4 text-slate-300">
                <Calendar className="text-primary w-5 h-5" />
                <span className="text-lg font-bold">{config?.competition.dateStart || '14 - 16 AOÛT 2026'}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <MapPin className="text-primary w-5 h-5" />
                <span className="text-lg font-bold">{config?.competition.location || 'PALAIS DES CONGRÈS DE LOMÉ, TOGO'}</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 text-lg">
              {config?.competition.description || 'L\'élite mondiale du breaking et du hip-hop se réunit sur les terres du Togo pour la plus grande battle d\'Afrique. 3 jours de compétition intense, de workshops et de culture urbaine. Le vainqueur n\'emporte pas seulement le titre, il entre dans l\'histoire.'}
            </p>
            <a href="#program" onClick={navigateTo('program')} className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase hover:underline cursor-pointer">
              Détails du tournoi <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* LES DANSEURS */}
      <section id="dancers" className="py-24 bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent-red font-bold tracking-[0.3em] uppercase text-xs">{config?.dancers.sectionSubtitle || 'Featured'}</span>
              <h2 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none">{config?.dancers.sectionTitle || 'LES DANSEURS'}</h2>
            </div>
            <a href="#dancers" onClick={navigateTo('dancers')} className="text-slate-500 hover:text-white transition-colors uppercase font-bold text-xs tracking-widest pb-2 cursor-pointer">Voir tous les profils</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {participants
              .filter(p => ['b-boy', 'b-girl', 'crew'].includes(p.category))
              .slice(0, 4)
              .map((dancer) => (
                <DancerCard 
                  key={dancer.id}
                  name={dancer.name} 
                  origin={`${dancer.country} | ${dancer.specialty}`} 
                  image={dancer.photo} 
                />
              ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section id="program" className="py-24 bg-surface-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-5xl md:text-7xl text-white uppercase text-center mb-16 tracking-tight">{config?.programmation.sectionTitle || 'PROGRAMMATION'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programData.slice(0, 3).map((day, dayIdx) => (
              <div 
                key={day.id} 
                className={`border p-8 group relative overflow-hidden transition-all ${
                  dayIdx === 1 
                    ? 'border-2 border-primary bg-primary/5 shadow-[0_0_30px_rgba(211,95,23,0.1)]' 
                    : 'border-white/10 hover:border-primary bg-background-dark/40'
                }`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl ${
                  dayIdx === 1 
                    ? 'bg-primary/10' 
                    : 'bg-accent-red/5 group-hover:bg-accent-red/10'
                } transition-colors`}></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-4xl font-heading text-primary">{day.label}</span>
                    {day.activities.length > 0 && (
                      <span className="text-xs font-bold tracking-[0.2em] text-accent-red mt-1 uppercase">
                        {day.activities[0]?.title.split(' ')[0] || 'Événement'}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 ${
                    dayIdx === 1 
                      ? 'bg-primary text-background-dark' 
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' }).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-6 relative z-10">
                  {day.activities.slice(0, 3).map((activity, actIdx) => {
                    const isRedLine = actIdx % 2 === 0;
                    return (
                      <div 
                        key={activity.id} 
                        className={`${
                          isRedLine 
                            ? 'border-l-2 border-accent-red/30 hover:border-accent-red hover:shadow-[inset_12px_0_12px_rgba(220,38,38,0.6)]' 
                            : 'border-l-2 border-primary/30 hover:border-primary hover:shadow-[inset_12px_0_12px_rgba(211,95,23,0.6)]'
                        } pl-4 py-2 transition-all duration-300 cursor-pointer`}
                      >
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{activity.time}</span>
                        <h4 className="text-white font-bold text-sm uppercase">{activity.title}</h4>
                        <p className="text-slate-400 text-xs mt-1">{activity.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a 
              href="#program" 
              onClick={navigateTo('program')}
              className="inline-block border border-white/20 px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-background-dark transition-all cursor-pointer"
            >
              Consulter le programme complet
            </a>
          </div>
        </div>
      </section>

      {/* BRACKETS SECTION */}
      <section id="brackets" className="py-32 bg-background-dark overflow-hidden relative border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none grain-texture z-0 opacity-5"></div>
        <div className="absolute inset-0 pointer-events-none diagonal-lines z-0 opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center mb-16 relative z-10">
          <div className="inline-block px-4 py-1 border border-primary/30 bg-primary/10 rounded-full mb-6">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Phase Finale - Lomé, Togo</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl text-white mb-4 tracking-tight uppercase">
            TABLEAU DES BATTLES <span className="text-primary">-</span> TOP 16
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-sm md:text-lg">
            Suivez en temps réel l'ascension des meilleurs B-Boys et B-Girls du monde vers le titre suprême de l'All Star Battle International 2026.
          </p>
        </div>

        <div ref={bracketContainerRef} className="w-full relative z-10 overflow-hidden" style={{ height: `${bracketHeight * bracketScale + 40}px`, minHeight: '400px' }}>
          {/* Hidden clone for measurement */}
          <div 
            ref={measureRef} 
            className="absolute top-0 left-0 invisible pointer-events-none" 
            style={{ width: '1200px' }}
          >
            <BracketContent brackets={bracketData} />
          </div>

          {/* Scaled visible content */}
          <div 
            style={{ 
              width: '1200px',
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: `translateX(-50%) scale(${bracketScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform'
            }}
          >
            <BracketContent brackets={bracketData} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-white/5 p-8 rounded-xl border border-white/10 hover:border-${idx === 0 ? 'primary' : idx === 1 ? 'accent-red' : 'white'}/30 transition-all`}>
              <h4 className={`font-heading text-4xl text-${idx === 0 ? 'primary' : idx === 1 ? 'accent-red' : 'white'} mb-2`}>{stat.value}</h4>
              <p className="text-slate-400 uppercase text-xs font-bold tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIP EXPERIENCE */}
      <section id="vip" className="py-24 relative">
        <div className="absolute inset-0 bg-cover bg-fixed opacity-20" style={{ backgroundImage: pageBackgrounds?.vip?.imageUrl ? `url('${pageBackgrounds.vip.imageUrl}')` : 'none' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-surface-dark to-black border border-primary/30 p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 border-[1px] border-primary/20 rounded-full"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold tracking-[0.5em] uppercase text-xs">Exclusif</span>
                <h2 className="font-heading text-6xl md:text-8xl text-white mb-6 uppercase leading-none">{config?.vip.sectionTitle?.split(' ').slice(0, -1).join(' ') || 'EXPÉRIENCE'} <span className="text-accent-red">{config?.vip.sectionTitle?.split(' ').slice(-1) || 'VIP'}</span></h2>
                <p className="text-slate-300 text-lg mb-10 font-light leading-relaxed">
                  {config?.vip.sectionDescription || 'Plongez au cœur de l\'action avec un accès privilégié. Vivez le All Star Battle International dans les meilleures conditions possibles.'}
                </p>
                <div className="space-y-6 mb-12">
                  {config?.vip?.features?.map((feature, idx) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <IconComponent className="text-primary w-6 h-6 mt-1" />
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm">{feature.title}</h4>
                          <p className="text-slate-400 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    );
                  }) || (
                    <>
                      <div className="flex items-start gap-4">
                        <Verified className="text-primary w-6 h-6 mt-1" />
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Platinum Backstage</h4>
                          <p className="text-slate-400 text-sm">Rencontrez les juges et les danseurs dans la zone athlètes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <GlassWater className="text-primary w-6 h-6 mt-1" />
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Lounge Exclusif</h4>
                          <p className="text-slate-400 text-sm">Open bar et buffet gastronomique dans une ambiance premium.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button onClick={navigateTo('tickets')} className="btn-luxury-vip shimmer-effect">DÉCOUVRIR LES OFFRES</button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-red rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black rounded-lg p-4">
                  <OptimizedImage
                    src={pageBackgrounds?.vip?.imageUrl}
                    alt="VIP Experience"
                    className="w-full h-auto rounded"
                    objectFit="cover"
                    quality={85}
                    maxWidth={600}
                    showSkeleton={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIAS */}
      <section id="media" className="py-24 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Archives</span>
              <h2 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none">MÉDIAS</h2>
            </div>
            <a href="#media" onClick={navigateTo('media')} className="text-slate-500 hover:text-white transition-colors uppercase font-bold text-xs tracking-widest pb-2 underline decoration-primary underline-offset-8 cursor-pointer">Accéder à la galerie</a>
          </div>

          {/* Media Gallery with Pagination - Display only 6 items at a time */}
          {mediaItems.filter(item => item.type === 'photo').length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaItems
                  .filter(item => item.type === 'photo')
                  .sort((a, b) => b.year - a.year)
                  .slice(0, 6)
                  .map((media, idx) => (
                    <div 
                      key={media.id}
                      className={`bg-surface-dark overflow-hidden group relative ${idx === 1 ? 'md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
                    >
                      <OptimizedImage
                        src={media.url}
                        alt={media.title || `Photo ${idx + 1}`}
                        className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                        objectFit="cover"
                        quality={80}
                        maxWidth={1000}
                        loading="lazy"
                        showSkeleton={true}
                      />
                    </div>
                  ))}
              </div>
              {mediaItems.filter(item => item.type === 'photo').length > 6 && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={navigateTo('media')}
                    className="px-8 py-3 bg-primary hover:bg-primary/80 text-background-dark font-black uppercase tracking-widest rounded-lg transition-all transform hover:scale-105"
                  >
                    Voir tous les médias
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>Aucun média disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="py-24 bg-background-dark border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full grainy-bg opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-accent-red font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Réseau Officiel</span>
            <h2 className="font-heading text-6xl md:text-8xl text-white uppercase leading-none">{config?.partners.sectionTitle?.split(' & ')[0] || 'PARTENAIRES'} & <span className="text-primary">{config?.partners.sectionTitle?.split(' & ')[1] || 'SPONSORS'}</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-red to-primary mx-auto mt-6"></div>
          </div>
          
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Partenaires Institutionnels */}
              {partnerData?.logos && partnerData.logos.filter((p: any) => p.category === 'Institutional').length > 0 && (
                <div>
                  <h3 className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px] text-center mb-8 border-b border-white/5 pb-4">Partenaires Institutionnels</h3>
                  <div className="grid grid-cols-2 gap-6 items-center">
                    {partnerData.logos
                      .filter((p: any) => p.category === 'Institutional')
                      .map((partner: any, idx: number) => (
                        <div key={partner.id || idx} className="bg-surface-dark/40 border border-white/5 p-6 flex items-center justify-center grayscale hover:grayscale-0 hover:border-primary/30 transition-all duration-500">
                          <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Sponsors Majeurs */}
              {partnerData?.logos && partnerData.logos.filter((p: any) => p.category === 'Main').length > 0 && (
                <div>
                  <h3 className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] text-center mb-8 border-b border-primary/30 pb-4">Sponsors</h3>
                  <div className="grid grid-cols-2 gap-6 items-center">
                    {partnerData.logos
                      .filter((p: any) => p.category === 'Main')
                      .map((sponsor: any, idx: number) => (
                        <div key={sponsor.id || idx} className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/30 p-6 flex items-center justify-center hover:border-primary transition-all duration-500 group hover:shadow-[0_0_20px_rgba(211,95,23,0.2)]">
                          <img src={sponsor.logo} alt={sponsor.name} className="h-12 w-auto object-contain grayscale hover:grayscale-0 group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Media & Broadcasting */}
            {partnerData?.logos && partnerData.logos.filter((p: any) => p.category === 'Media').length > 0 && (
              <div>
                <h3 className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px] text-center mb-12 border-b border-white/5 pb-4">Media & Broadcasting</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
                  {partnerData.logos
                    .filter((p: any) => p.category === 'Media')
                    .map((media: any, idx: number) => (
                      <div key={media.id || idx} className="bg-white/5 border border-white/10 hover:border-accent-red/40 p-6 flex items-center justify-center grayscale contrast-125 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <img src={media.logo} alt={media.name} className="max-h-12 w-auto object-contain" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-20 text-center">
            <a 
              href="#partners" 
              onClick={navigateTo('partners')}
              className="btn-luxury-primary inline-block shimmer-effect"
            >
              DEVENIR PARTENAIRE
            </a>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em] mt-6">Rejoignez l'élite de la culture urbaine africaine</p>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="py-24 bg-background-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent-red font-bold tracking-[0.3em] uppercase text-xs">Blog Officiel</span>
              <h2 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none">{config?.blog.sectionTitle || 'ACTUALITÉS & NEWS'}</h2>
            </div>
            <a 
              href="#news" 
              onClick={navigateTo('news')}
              className="text-slate-500 hover:text-white transition-colors uppercase font-bold text-xs tracking-widest pb-2 border-b border-primary/30"
            >
              Voir toutes les actualités
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((article, idx) => (
              <NewsCard 
                key={article.id}
                date={article.date} 
                title={article.title} 
                desc={article.content} 
                tag={article.category}
                coverImage={article.coverImage || article.photo}
                color={idx === 1 ? "accent-red" : "primary"}
                onClick={navigateTo('news', undefined, article.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  ) : currentPage === 'competition' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Competition />
    </Suspense>
  ) : currentPage === 'dancers' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Dancers onViewPerformances={() => changePage('media')} pageBackgrounds={pageBackgrounds} />
    </Suspense>
  ) : currentPage === 'judges' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Judges />
    </Suspense>
  ) : currentPage === 'history' ? (
    <Suspense fallback={<LoadingFallback />}>
      <History onViewGallery={navigateToMediaYear} />
    </Suspense>
  ) : currentPage === 'tickets' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Tickets onNavigateToFAQ={() => changePage('faq')} />
    </Suspense>
  ) : currentPage === 'program' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Program onReserveTickets={() => changePage('tickets')} />
    </Suspense>
  ) : currentPage === 'news' ? (
    <Suspense fallback={<LoadingFallback />}>
      <News onBack={() => changePage('home')} initialArticleId={selectedArticleId} />
    </Suspense>
  ) : currentPage === 'artistic' ? (
    <Suspense fallback={<LoadingFallback />}>
      <ArtisticScene 
        onNavigateToProgram={() => changePage('program')} 
        onNavigateToTickets={() => changePage('tickets')}
        pageBackgrounds={pageBackgrounds}
        featuredPiece={featuredPiece}
      />
    </Suspense>
  ) : currentPage === 'contact' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Contact onNavigateToFAQ={() => changePage('faq')} pageBackgrounds={pageBackgrounds} />
    </Suspense>
  ) : currentPage === 'participate' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Participate onBack={() => changePage('home')} data={participateData} pageBackgrounds={pageBackgrounds} />
    </Suspense>
  ) : currentPage === 'partners' ? (
    <Suspense fallback={<LoadingFallback />}>
      <Partners onContactClick={navigateTo('contact')} />
    </Suspense>
  ) : currentPage === 'admin' ? (
    location.pathname === '/admin/login' ? (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ) : (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute>
          <AdminDashboard onLogout={() => {
            setIsAdminLoggedIn(false);
            changePage('home');
          }} />
        </ProtectedRoute>
      </Suspense>
    )
  ) : currentPage === 'faq' ? (
    <Suspense fallback={<LoadingFallback />}>
      <FAQ onNavigateBack={() => changePage('home')} />
    </Suspense>
  ) : (
    <Suspense fallback={<LoadingFallback />}>
      <Media selectedYear={selectedMediaYear} onYearChange={setSelectedMediaYear} pageBackgrounds={pageBackgrounds} />
    </Suspense>
  )}

  {/* FOOTER */}
  {currentPage !== 'admin' && (
      <footer id="footer" className="bg-background-dark pt-24 pb-12 border-t border-primary/20 grainy-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
              {logo?.url && (
                <img 
                  src={logo.url} 
                  alt={logo.alt || "Site Logo"} 
                  className="h-16 w-auto max-w-[200px] object-contain mb-8"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              )}
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {config?.footer.description || 'L\'événement de breakdance ultime qui définit le trône de la culture urbaine en Afrique. Vivez l\'excellence du mouvement, du rythme et de la compétition internationale au cœur du Togo.'}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm hover:bg-primary hover:text-background-dark transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm hover:bg-primary hover:text-background-dark transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-sm hover:bg-primary hover:text-background-dark transition-all duration-300">
                  <Megaphone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-white font-heading text-xl uppercase tracking-widest mb-8 border-b border-primary/30 pb-2 inline-block">Le Festival</h4>
              <ul className="space-y-4">
                <li><a href="#home" onClick={navigateTo('home')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Accueil</a></li>
                <li><a href="#history" onClick={navigateTo('history')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Histoire</a></li>
                <li><a href="#program" onClick={navigateTo('program')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Programme</a></li>
                <li><a href="#artistic" onClick={navigateTo('artistic')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Scène Artistique</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-heading text-xl uppercase tracking-widest mb-8 border-b border-primary/30 pb-2 inline-block">Compétition</h4>
              <ul className="space-y-4">
                <li><a href="#brackets" onClick={navigateTo('home', '#brackets')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Brackets</a></li>
                <li><a href="#dancers" onClick={navigateTo('dancers')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Les Danseurs</a></li>
                <li><a href="#judges" onClick={navigateTo('judges')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Les Juges</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white font-heading text-xl uppercase tracking-widest mb-8 border-b border-primary/30 pb-2 inline-block">Expérience</h4>
              <ul className="space-y-4">
                <li><a href="#tickets" onClick={navigateTo('tickets')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Billetterie</a></li>
                <li><a href="#media" onClick={navigateTo('media')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Médias</a></li>
                <li><a href="#vip" onClick={navigateTo('home', '#vip')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Espace VIP</a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <h4 className="text-white font-heading text-xl uppercase tracking-widest mb-8 border-b border-primary/30 pb-2 inline-block">Contact</h4>
              <ul className="space-y-4">
                <li><a href="#contact" onClick={navigateTo('contact')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">Nous Contacter</a></li>
                <li><a href="#faq" onClick={navigateTo('faq')} className="text-slate-400 hover:text-primary transition-colors text-[10px] font-bold tracking-widest uppercase">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row gap-8 items-center border-t border-white/5 pt-8">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Suivez l'actualité :</span>
            <div className="flex gap-8">
              <a href="#" className="text-white hover:text-primary transition-all hover:scale-125"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white hover:text-primary transition-all hover:scale-125"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-white hover:text-primary transition-all hover:scale-125"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-white hover:text-primary transition-all hover:scale-125"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
              {config?.footer.copyright || '© 2026 All STAR BATTLE INTERNATIONAL. TOUS DROITS RÉSERVÉS.'}
            </p>
            <div className="flex space-x-12 text-[10px] uppercase font-black tracking-[0.3em] text-slate-500">
              <a href="#" onClick={navigateTo('admin')} className="hover:text-primary transition-colors">Administration</a>
              <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-primary transition-colors">Presse</a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
