import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CMSData, BracketMatch } from '../../types';
import { Save, Trophy, Users, Info, ChevronDown, Search, X, CheckCircle } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

interface Country {
  code: string;
  name: string;
}

// Liste statique en fallback
const DEFAULT_COUNTRIES: Country[] = [
  { code: 'us', name: 'États-Unis' },
  { code: 'ca', name: 'Canada' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japon' },
  { code: 'cn', name: 'Chine' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'nl', name: 'Pays-Bas' },
  { code: 'tw', name: 'Taïwan' },
  { code: 'tg', name: 'Togo' },
  { code: 'de', name: 'Allemagne' },
  { code: 'es', name: 'Espagne' },
  { code: 'it', name: 'Italie' },
  { code: 'uk', name: 'Royaume-Uni' },
  { code: 'br', name: 'Brésil' },
  { code: 'mx', name: 'Mexique' },
  { code: 'kr', name: 'Corée du Sud' },
  { code: 'au', name: 'Australie' },
  { code: 'nz', name: 'Nouvelle-Zélande' },
  { code: 'za', name: 'Afrique du Sud' },
  { code: 'ng', name: 'Nigéria' },
  { code: 'ke', name: 'Kenya' },
  { code: 'eg', name: 'Égypte' },
  { code: 'in', name: 'Inde' },
  { code: 'id', name: 'Indonésie' },
  { code: 'th', name: 'Thaïlande' },
  { code: 'sg', name: 'Singapour' },
  { code: 'ph', name: 'Philippines' },
  { code: 'ru', name: 'Russie' },
  { code: 'ma', name: 'Maroc' },
  { code: 'ci', name: 'Côte d\'Ivoire' },
  { code: 'at', name: 'Autriche' },
  { code: 'be', name: 'Belgique' },
  { code: 'ch', name: 'Suisse' },
  { code: 'se', name: 'Suède' },
  { code: 'no', name: 'Norvège' },
  { code: 'dk', name: 'Danemark' },
  { code: 'fi', name: 'Finlande' },
  { code: 'pl', name: 'Pologne' },
  { code: 'gr', name: 'Grèce' },
  { code: 'pt', name: 'Portugal' },
  { code: 'ir', name: 'Iran' },
  { code: 'iq', name: 'Irak' },
  { code: 'sa', name: 'Arabie Saoudite' },
  { code: 'ae', name: 'Émirats Arabes Unis' },
  { code: 'il', name: 'Israël' },
  { code: 'tr', name: 'Turquie' },
  { code: 'ar', name: 'Argentine' },
  { code: 'cl', name: 'Chili' },
  { code: 'co', name: 'Colombie' },
  { code: 'pe', name: 'Pérou' },
  { code: 've', name: 'Venezuela' },
  { code: 'my', name: 'Malaisie' },
  { code: 'vn', name: 'Viêt Nam' },
  { code: 'kh', name: 'Cambodge' },
  { code: 'la', name: 'Laos' },
  { code: 'mm', name: 'Birmanie' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'lk', name: 'Sri Lanka' },
  { code: 'np', name: 'Népal' },
  { code: 'hk', name: 'Hong Kong' },
  { code: 'mo', name: 'Macao' },
  { code: 'kg', name: 'Kirghizistan' },
  { code: 'kz', name: 'Kazakhstan' },
  { code: 'tn', name: 'Tunisie' },
  { code: 'dz', name: 'Algérie' },
  { code: 'sd', name: 'Soudan' },
  { code: 'et', name: 'Éthiopie' },
  { code: 'gh', name: 'Ghana' },
  { code: 'cm', name: 'Cameroun' },
];

// Composant séparé pour éviter les re-renders
const CountrySearchSelect = ({ value, onChange, countries }: { value: string; onChange: (code: string) => void; countries: Country[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.code === value);
  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toUpperCase().includes(searchTerm.toUpperCase())
  );

  // Fermer en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus sur l'input quand on ouvre
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCountries.length > 0) {
        handleSelect(filteredCountries[0].code);
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-left flex justify-between items-center focus:border-primary outline-none hover:bg-white/10 transition text-white"
      >
        <span className="truncate text-xs">{selectedCountry ? selectedCountry.code.toUpperCase() : 'Pays'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded shadow-lg">
          <div className="p-2 sticky top-0 bg-[#111]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Chercher pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition ${
                    value === c.code ? 'bg-primary/20 text-primary font-bold' : 'text-slate-300'
                  }`}
                >
                  <span className="font-mono">{c.code.toUpperCase()}</span> - {c.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-slate-500 text-center">Aucun pays trouvé</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CompetitionBrackets({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [activeTab, setActiveTab] = useState<'brackets'>('brackets');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [competitionMode, setCompetitionMode] = useState<'pre' | 'post'>('pre'); // Mode pré ou post compétition
  const [bracketScale, setBracketScale] = useState(1);
  const [bracketHeight, setBracketHeight] = useState(500);
  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const bracketHeightRef = useRef(bracketHeight);
  const bracketContainerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Charger les pays depuis l'API avec fallback
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name');
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        const countriesList: Country[] = data
          .map((country: any) => ({
            code: country.cca2.toLowerCase(),
            name: country.name.common || country.name.official || country.cca2
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(countriesList);
      } catch (error) {
        console.log('Utilisation des pays par défaut');
        setCountries(DEFAULT_COUNTRIES);
      }
    };
    fetchCountries();
  }, []);

  const updateMatch = (poule: 'pouleA' | 'pouleB', round: 'huitiemes' | 'quarts' | 'semis', matchIndex: number, field: keyof BracketMatch, value: string) => {
    setData(prev => {
      const currentRound = prev.competition?.brackets?.[poule]?.[round] || [];
      const paddedRound = makeMatchList(currentRound, 4, poule, round);
      const updatedRound = paddedRound.map((m, idx) => idx === matchIndex ? { ...m, [field]: value } : m);

      return {
        ...prev,
        competition: {
          ...prev.competition,
          brackets: {
            ...prev.competition.brackets,
            [poule]: {
              ...prev.competition.brackets[poule],
              [round]: updatedRound
            }
          }
        }
      };
    });
  };

  const updateFinal = (field: keyof BracketMatch, value: string) => {
    setData(prev => ({
      ...prev,
      competition: {
        ...prev.competition,
        brackets: {
          ...prev.competition.brackets,
          final: { ...prev.competition.brackets.final, [field]: value }
        }
      }
    }));
  };

  const updateGlobalConfig = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      globalConfig: {
        ...prev.globalConfig,
        competition: {
          ...prev.globalConfig.competition,
          [field]: value
        }
      }
    }));
  };

  useEffect(() => {
    bracketHeightRef.current = bracketHeight;
  }, [bracketHeight]);

  useEffect(() => {
    const updateScale = () => {
      if (!bracketContainerRef.current) return;

      const container = bracketContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const targetWidth = 900;
      const targetHeight = 600;

      // Utilise la plus petite dimension disponible pour calculer le scale
      // Cela garantit que le bracket rentre complètement dans le conteneur
      const scaleX = (containerWidth * 0.98) / targetWidth; // 98% de la largeur (2% margin)
      const scaleY = (containerHeight * 0.98) / targetHeight; // 98% de la hauteur
      
      // Prend le scale le plus restrictif pour tout faire rentrer
      const scale = Math.min(scaleX, scaleY, 1); // Max 100%
      
      // Minimum de 0.2 pour les très petits écrans
      setBracketScale(Math.max(0.2, scale));
    };

    // Attendre que le DOM soit prêt
    const timer = setTimeout(updateScale, 100);
    updateScale();
    
    // Recalculate on resize
    window.addEventListener('resize', updateScale);
    const resizeObserver = new ResizeObserver(updateScale);
    if (bracketContainerRef.current) {
      resizeObserver.observe(bracketContainerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateScale);
      resizeObserver.disconnect();
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

  const BracketMatch = ({ player1, player2, country1, country2, countryCode1, countryCode2, side = "left", color = "primary" }: any) => (
    <div className={`flex flex-col gap-2 sm:gap-1 bg-white/5 p-4 sm:p-3 rounded border-${side === "left" ? "l" : "r"}-4 ${color === "primary" ? "border-primary" : "border-accent-red"} relative transition-all hover:bg-white/10 whitespace-normal overflow-hidden`}>
      <div className={`flex justify-between items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <span className="font-bold text-sm sm:text-xs uppercase leading-tight flex items-center gap-2 sm:gap-1 truncate flex-shrink min-w-0">
          <span className="truncate">{player1}</span>
          {countryCode1 !== 'un' && <img src={`https://flagcdn.com/${countryCode1}.svg`} alt={country1} className="w-6 h-5 sm:w-4 sm:h-3 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
        </span>
      </div>
      <div className="h-[1px] bg-white/10 my-1 sm:my-0"></div>
      <div className={`flex justify-between items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <span className="font-bold text-sm sm:text-xs uppercase leading-tight flex items-center gap-2 sm:gap-1 truncate flex-shrink min-w-0">
          <span className="truncate">{player2}</span>
          {countryCode2 !== 'un' && <img src={`https://flagcdn.com/${countryCode2}.svg`} alt={country2} className="w-6 h-5 sm:w-4 sm:h-3 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
        </span>
      </div>
    </div>
  );

  const makeMatchList = (matches: any[], count = 4, poule: string, round: string) => {
    const result = [...matches];
    while (result.length < count) {
      result.push({
        id: `${poule}-${round}-${result.length + 1}`,
        player1: '',
        player2: '',
        country1: '--',
        country2: '--',
        countryCode1: 'un',
        countryCode2: 'un',
        score1: '--',
        score2: '--'
      });
    }
    return result.slice(0, count);
  };

  const eightA = useMemo(() => makeMatchList(data.competition?.brackets?.pouleA?.huitiemes || [], 4, 'pouleA', 'huitiemes'), [data.competition?.brackets?.pouleA?.huitiemes]);
  const eightB = useMemo(() => makeMatchList(data.competition?.brackets?.pouleB?.huitiemes || [], 4, 'pouleB', 'huitiemes'), [data.competition?.brackets?.pouleB?.huitiemes]);

  const BracketContent = () => {
    const containerWidth = bracketContainerRef.current?.clientWidth || 400;
    const isSmallMobile = containerWidth < 480;
    const isMobile = containerWidth < 768;

    // Tailles dynamiques basées sur la largeur du conteneur
    const textSizeTitle = isSmallMobile ? 'text-[10px]' : isMobile ? 'text-xs' : 'text-sm';
    const textSizeMatch = isSmallMobile ? 'text-[11px]' : isMobile ? 'text-sm' : 'text-sm';
    const textSizeVs = isSmallMobile ? 'text-[8px]' : isMobile ? 'text-[9px]' : 'text-xs';
    const minHeightBracket = isSmallMobile ? '1000px' : isMobile ? '900px' : '600px';
    const gapMatch = isSmallMobile ? 'gap-2' : isMobile ? 'gap-2' : 'gap-1';
    const gapCol = isSmallMobile ? 'gap-1.5' : isMobile ? 'gap-1.5' : 'gap-1';
    const paddingMatch = isSmallMobile ? 'p-3' : isMobile ? 'p-3' : 'p-2';
    const paddingFinal = isSmallMobile ? 'p-2' : isMobile ? 'p-2' : 'p-1';
    const flagSize = isSmallMobile ? 'w-6 h-5' : isMobile ? 'w-5 h-4' : 'w-4 h-3';
    const trophySize = isSmallMobile ? 'w-6 h-6' : isMobile ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
    <div className={`grid grid-cols-7 ${gapCol} items-stretch py-2 px-0.5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent rounded-lg`} style={{ minHeight: minHeightBracket, minWidth: '900px', overflow: 'visible' }}>
      {/* Poule A: Top 16 (Left) */}
      <div className="flex flex-col h-full justify-between">
        <h3 className={`font-heading ${textSizeTitle} text-primary mb-1 text-center shrink-0 font-bold leading-tight`}>HUITIÈMES<br className={isSmallMobile ? 'hidden' : ''}></br>(A)</h3>
        <div className={`flex-1 flex flex-col justify-around ${gapMatch}`}>
          {data.competition.brackets.pouleA.huitiemes.map((match, idx) => (
            <BracketMatch 
              key={match.id}
              player1={match.player1} 
              country1={match.country1} 
              countryCode1={match.countryCode1} 
              player2={match.player2} 
              country2={match.country2} 
              countryCode2={match.countryCode2}
              color={idx % 2 === 0 ? "accent-red" : "primary"}
            />
          ))}
        </div>
      </div>

      {/* Poule A: Quarts (Left) */}
      <div className="flex flex-col h-full justify-between px-0.5">
        <h3 className={`font-heading ${textSizeTitle} text-slate-400 mb-1 text-center shrink-0 font-bold`}>QUARTS</h3>
        <div className={`flex-1 flex flex-col justify-around ${gapMatch}`}>
          {data.competition.brackets.pouleA.quarts.map((match) => (
            <BracketMatch 
              key={match.id}
              player1={competitionMode === 'pre' ? 'TBD' : match.player1} 
              country1="" 
              countryCode1="un" 
              player2={competitionMode === 'pre' ? 'TBD' : match.player2} 
              country2="" 
              countryCode2="un"
            />
          ))}
        </div>
      </div>

      {/* Poule A: Semis (Left) */}
      <div className="flex flex-col h-full justify-between px-1">
        <h3 className="font-heading text-xs sm:text-[10px] text-accent-red mb-2 text-center uppercase shrink-0 font-bold">DEMI</h3>
        <div className="flex-1 flex flex-col justify-around gap-2 sm:gap-1">
          {data.competition.brackets.pouleA.semis.map((match) => (
            <div key={match.id} className="flex flex-col gap-2 sm:gap-1 bg-accent-red/10 p-3 sm:p-2 rounded border border-accent-red/30 text-xs">
              <div className="text-center font-bold text-white uppercase text-sm sm:text-[10px] truncate">{competitionMode === 'pre' ? 'TBD' : match.player1}</div>
              <div className="text-center text-primary font-mono text-[10px] sm:text-[8px]">--</div>
              <div className="text-center font-bold text-white uppercase text-sm sm:text-[10px] truncate">{competitionMode === 'pre' ? 'TBD' : match.player2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Final */}
      <div className="flex flex-col h-full items-center justify-center px-1">
        <div className="text-center mb-2 shrink-0">
          <Trophy className="text-primary w-7 h-7 sm:w-6 sm:h-6 mx-auto mb-1" />
          <h2 className="font-heading text-[11px] sm:text-[10px] text-white uppercase font-bold">FINALE</h2>
        </div>
        <div className="w-full max-w-[110px] sm:max-w-[100px] p-1 bg-gradient-to-b from-primary via-accent-red to-primary rounded shadow-[0_0_20px_rgba(244,209,37,0.2)]">
          <div className="bg-black p-2 sm:p-1 rounded-sm flex flex-col items-center gap-2 sm:gap-1">
            <div className="text-center">
              <h3 className="font-heading text-[10px] sm:text-[9px] text-white uppercase font-bold truncate">{competitionMode === 'pre' ? 'TBD' : (data.competition.brackets.final.player1 || 'TBD')}</h3>
            </div>
            <span className="text-[8px]">•</span>
            <div className="text-center">
              <h3 className="font-heading text-[10px] sm:text-[9px] text-white uppercase font-bold truncate">{competitionMode === 'pre' ? 'TBD' : (data.competition.brackets.final.player2 || 'TBD')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Poule B: Semis (Right) */}
      <div className="flex flex-col h-full justify-between px-1">
        <h3 className="font-heading text-xs sm:text-[10px] text-accent-red mb-2 text-center uppercase shrink-0 font-bold">DEMI</h3>
        <div className="flex-1 flex flex-col justify-around gap-2 sm:gap-1">
          {data.competition.brackets.pouleB.semis.map((match) => (
            <div key={match.id} className="flex flex-col gap-2 sm:gap-1 bg-accent-red/10 p-3 sm:p-2 rounded border border-accent-red/30 text-xs">
              <div className="text-center font-bold text-white uppercase text-sm sm:text-[10px] truncate">{competitionMode === 'pre' ? 'TBD' : match.player1}</div>
              <div className="text-center text-primary font-mono text-[10px] sm:text-[8px]">--</div>
              <div className="text-center font-bold text-white uppercase text-sm sm:text-[10px] truncate">{competitionMode === 'pre' ? 'TBD' : match.player2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Poule B: Quarts (Right) */}
      <div className="flex flex-col h-full justify-between px-1">
        <h3 className="font-heading text-xs sm:text-[10px] text-slate-400 mb-2 text-center shrink-0 font-bold">QUARTS</h3>
        <div className="flex-1 flex flex-col justify-around gap-2 sm:gap-1">
          {data.competition.brackets.pouleB.quarts.map((match) => (
            <BracketMatch 
              key={match.id}
              player1={competitionMode === 'pre' ? 'TBD' : match.player1} 
              country1="" 
              countryCode1="un" 
              player2={competitionMode === 'pre' ? 'TBD' : match.player2} 
              country2="" 
              countryCode2="un"
              side="right"
            />
          ))}
        </div>
      </div>

      {/* Poule B: Top 16 (Right) */}
      <div className="flex flex-col h-full justify-between">
        <h3 className="font-heading text-xs sm:text-[10px] text-primary mb-2 text-center shrink-0 font-bold">HUITIÈMES (B)</h3>
        <div className="flex-1 flex flex-col justify-around gap-2 sm:gap-1">
          {data.competition.brackets.pouleB.huitiemes.map((match, idx) => (
            <BracketMatch 
              key={match.id}
              player1={match.player1} 
              country1={match.country1} 
              countryCode1={match.countryCode1} 
              player2={match.player2} 
              country2={match.country2} 
              countryCode2={match.countryCode2}
              side="right"
              color={idx % 2 === 0 ? "accent-red" : "primary"}
            />
          ))}
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="space-y-8">
      {/* MODE DE COMPÉTITION */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
        <h3 className="font-heading text-xl md:text-2xl text-primary mb-6">MODE DE REMPLISSAGE DU BRACKET</h3>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCompetitionMode('pre')}
            className={`px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all ${
              competitionMode === 'pre'
                ? 'bg-primary/20 border-2 border-primary text-primary'
                : 'bg-white/5 border-2 border-white/10 text-slate-400 hover:border-primary/50'
            }`}
          >
            Pré-Compétition (Huitièmes seulement)
          </button>
          <button
            onClick={() => setCompetitionMode('post')}
            className={`px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all ${
              competitionMode === 'post'
                ? 'bg-primary/20 border-2 border-primary text-primary'
                : 'bg-white/5 border-2 border-white/10 text-slate-400 hover:border-primary/50'
            }`}
          >
            Post-Compétition (Bracket complet)
          </button>
        </div>
        <p className="text-sm text-slate-400">
          {competitionMode === 'pre'
            ? "Mode pré-compétition : remplissez seulement les huitièmes de finale. Les autres tours resteront vides (TBD)."
            : "Mode post-compétition : remplissez le bracket complet jusqu'à la finale."
          }
        </p>
      </div>

      {/* BRACKETS */}
      <div className="space-y-6 md:space-y-8">
        {/* ÉDITION DES MATCHES */}
        <div className="bg-[#111] border border-white/10 p-4 md:p-6 lg:p-8 rounded-2xl space-y-6 md:space-y-8">
          <h3 className="font-heading text-xl md:text-2xl lg:text-3xl text-primary flex items-center gap-2">✏️ Édition des Matches</h3>
            
            {/* HUITIÈMES A */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-heading text-sm md:text-base lg:text-lg text-accent-red border-l-4 border-accent-red pl-2 md:pl-4">HUITIÈMES (A) — 8 MATCHS = 16 PARTICIPANTS</h4>
              <p className="text-[11px] text-slate-400">Remplissez les deux combattants et le pays pour chaque match de la poule A. Les RHS sont automatiquement envoyés au backend via la fonction saveData().</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                {eightA.map((match, idx) => (
                  <div key={`match-a-${idx}`} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                    <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Match A{idx + 1}</div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={match.player1} 
                          onChange={e => updateMatch('pouleA', 'huitiemes', idx, 'player1', e.target.value)} 
                          placeholder="Joueur 1" 
                          className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm uppercase focus:border-primary outline-none font-bold" 
                        />
                        <label className="text-[9px] text-slate-500 uppercase tracking-wider block">Pays</label>
                        <CountrySearchSelect 
                          value={match.countryCode1} 
                          onChange={code => updateMatch('pouleA', 'huitiemes', idx, 'countryCode1', code)} 
                          countries={countries} 
                        />
                      </div>
                      <div className="text-center text-primary font-mono text-xs md:text-sm font-bold py-2">--</div>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={match.player2} 
                          onChange={e => updateMatch('pouleA', 'huitiemes', idx, 'player2', e.target.value)} 
                          placeholder="Joueur 2" 
                          className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm uppercase focus:border-primary outline-none font-bold" 
                        />
                        <label className="text-[9px] text-slate-500 uppercase tracking-wider block">Pays</label>
                        <CountrySearchSelect 
                          value={match.countryCode2} 
                          onChange={code => updateMatch('pouleA', 'huitiemes', idx, 'countryCode2', code)} 
                          countries={countries} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HUITIÈMES B */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-heading text-sm md:text-base lg:text-lg text-primary border-l-4 border-primary pl-2 md:pl-4">HUITIÈMES (B) — 8 MATCHS = 16 PARTICIPANTS</h4>
              <p className="text-[11px] text-slate-400">Remplissez les deux combattants et le pays pour chaque match de la poule B.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                {eightB.map((match, idx) => (
                  <div key={`match-b-${idx}`} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                    <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Match B{idx + 1}</div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={match.player1} 
                          onChange={e => updateMatch('pouleB', 'huitiemes', idx, 'player1', e.target.value)} 
                          placeholder="Joueur 1" 
                          className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm uppercase focus:border-primary outline-none font-bold" 
                        />
                        <label className="text-[9px] text-slate-500 uppercase tracking-wider block">Pays</label>
                        <CountrySearchSelect 
                          value={match.countryCode1} 
                          onChange={code => updateMatch('pouleB', 'huitiemes', idx, 'countryCode1', code)} 
                          countries={countries} 
                        />
                      </div>
                      <div className="text-center text-primary font-mono text-xs md:text-sm font-bold py-2">--</div>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={match.player2} 
                          onChange={e => updateMatch('pouleB', 'huitiemes', idx, 'player2', e.target.value)} 
                          placeholder="Joueur 2" 
                          className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm uppercase focus:border-primary outline-none font-bold" 
                        />
                        <label className="text-[9px] text-slate-500 uppercase tracking-wider block">Pays</label>
                        <CountrySearchSelect 
                          value={match.countryCode2} 
                          onChange={code => updateMatch('pouleB', 'huitiemes', idx, 'countryCode2', code)} 
                          countries={countries} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUARTS A & B */}
            {competitionMode === 'post' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-slate-400 border-l-4 border-slate-400 pl-2 md:pl-4">QUARTS DE FINALE</h4>
                <p className="text-[11px] text-slate-500">Remplissez les quarts de finale manuellement ou laissez les auto-remplir depuis les huitièmes.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                  {data.competition.brackets.pouleA.quarts.map((match, idx) => (
                    <div key={match.id} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Quart A{idx + 1}</div>
                      <input type="text" value={match.player1} onChange={e => updateMatch('pouleA', 'quarts', match.id, 'player1', e.target.value)} placeholder="Joueur 1" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                      <div className="text-center text-primary font-mono text-xs md:text-sm">--</div>
                      <input type="text" value={match.player2} onChange={e => updateMatch('pouleA', 'quarts', match.id, 'player2', e.target.value)} placeholder="Joueur 2" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                    </div>
                  ))}
                  {data.competition.brackets.pouleB.quarts.map((match, idx) => (
                    <div key={match.id} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Quart B{idx + 1}</div>
                      <input type="text" value={match.player1} onChange={e => updateMatch('pouleB', 'quarts', match.id, 'player1', e.target.value)} placeholder="Joueur 1" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                      <div className="text-center text-primary font-mono text-xs md:text-sm">--</div>
                      <input type="text" value={match.player2} onChange={e => updateMatch('pouleB', 'quarts', match.id, 'player2', e.target.value)} placeholder="Joueur 2" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {competitionMode === 'pre' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-slate-400 border-l-4 border-slate-400 pl-2 md:pl-4">QUARTS DE FINALE</h4>
                <div className="bg-slate-800/30 border border-slate-600/30 p-6 rounded-xl">
                  <p className="text-center text-slate-500 font-bold uppercase tracking-widest">TBD - À DÉTERMINER</p>
                  <p className="text-center text-slate-400 text-sm mt-2">Les quarts de finale seront déterminés après les huitièmes.</p>
                </div>
              </div>
            )}

            {/* DEMI-FINALES */}
            {competitionMode === 'post' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-accent-red border-l-4 border-accent-red pl-2 md:pl-4">DEMI-FINALES</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                  {data.competition.brackets.pouleA.semis.map((match, idx) => (
                    <div key={match.id} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Demi A{idx + 1}</div>
                      <input type="text" value={match.player1} onChange={e => updateMatch('pouleA', 'semis', match.id, 'player1', e.target.value)} placeholder="Joueur 1" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                      <div className="text-center text-primary font-mono text-xs md:text-sm">--</div>
                      <input type="text" value={match.player2} onChange={e => updateMatch('pouleA', 'semis', match.id, 'player2', e.target.value)} placeholder="Joueur 2" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                    </div>
                  ))}
                  {data.competition.brackets.pouleB.semis.map((match, idx) => (
                    <div key={match.id} className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">Demi B{idx + 1}</div>
                      <input type="text" value={match.player1} onChange={e => updateMatch('pouleB', 'semis', match.id, 'player1', e.target.value)} placeholder="Joueur 1" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                      <div className="text-center text-primary font-mono text-xs md:text-sm">--</div>
                      <input type="text" value={match.player2} onChange={e => updateMatch('pouleB', 'semis', match.id, 'player2', e.target.value)} placeholder="Joueur 2" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {competitionMode === 'pre' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-accent-red border-l-4 border-accent-red pl-2 md:pl-4">DEMI-FINALES</h4>
                <div className="bg-slate-800/30 border border-slate-600/30 p-6 rounded-xl">
                  <p className="text-center text-slate-500 font-bold uppercase tracking-widest">TBD - À DÉTERMINER</p>
                  <p className="text-center text-slate-400 text-sm mt-2">Les demi-finales seront déterminées après les quarts de finale.</p>
                </div>
              </div>
            )}

            {/* GRANDE FINALE */}
            {competitionMode === 'post' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-primary border-l-4 border-primary pl-2 md:pl-4">GRANDE FINALE</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                  <div className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                    <input type="text" value={data.competition.brackets.final.player1} onChange={e => updateFinal('player1', e.target.value)} placeholder="Joueur 1" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                    <div className="text-center text-primary font-mono text-xs md:text-sm">--</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl space-y-2 md:space-y-3">
                    <input type="text" value={data.competition.brackets.final.player2} onChange={e => updateFinal('player2', e.target.value)} placeholder="Joueur 2" className="w-full bg-white/5 border border-white/10 rounded p-1.5 md:p-2 text-xs md:text-sm uppercase focus:border-primary outline-none" />
                  </div>
                </div>
              </div>
            )}

            {competitionMode === 'pre' && (
              <div className="space-y-3 md:space-y-4">
                <h4 className="font-heading text-sm md:text-base lg:text-lg text-primary border-l-4 border-primary pl-2 md:pl-4">GRANDE FINALE</h4>
                <div className="w-full max-w-[260px] md:max-w-[300px] p-1 bg-gradient-to-b from-primary via-accent-red to-primary rounded-xl shadow-[0_0_60px_rgba(244,209,37,0.3)] mx-auto">
                  <div className="bg-background-dark p-6 md:p-8 rounded-lg flex flex-col items-center gap-6 md:gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 bg-white/5 flex items-center justify-center mb-4 md:mb-6">
                        <Trophy className="w-10 h-10 md:w-12 md:h-12 text-slate-700" />
                      </div>
                      <span className="font-heading text-3xl md:text-3xl text-slate-500 uppercase text-center">CHAMPION 2026</span>
                    </div>
                    <div className="w-full flex items-center gap-4 md:gap-6">
                      <div className="h-px bg-white/10 grow"></div>
                      <div className="h-px bg-white/10 grow"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOUTON ENREGISTRER */}
            <div className="mt-8 md:mt-12 pt-8 border-t border-white/10 flex items-center justify-center">
              <button
                onClick={async () => {
                  setIsSaving(true);
                  setSaveSuccess(false);
                  try {
                    await cmsService.saveData(data);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className={`px-8 md:px-12 py-3 md:py-4 font-heading text-sm md:text-base lg:text-lg uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 ${
                  saveSuccess
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                    : isSaving
                    ? 'bg-primary/20 border-2 border-primary text-primary'
                    : 'bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/30'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle size={24} />
                    Enregistré!
                  </>
                ) : isSaving ? (
                  <>
                    <span className="animate-spin"><Save size={24} /></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    Enregistrer les Modifications
                  </>
                )}
              </button>
            </div>


        </div>
      </div>
    </div>
  );
}
