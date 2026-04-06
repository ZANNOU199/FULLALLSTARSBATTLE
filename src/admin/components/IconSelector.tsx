import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { LUCIDE_ICONS } from '../../utils/lucideIcons';

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Component to render an icon safely
function IconRenderer({ iconName, size = 18, className = '' }: { iconName: string; size?: number; className?: string }) {
  const Icon = (LucideIcons as any)[iconName];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les icônes selon la recherche
  const filteredIcons = LUCIDE_ICONS.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Icône (nom Lucide)</label>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Aperçu de l'icône */}
          <div className="w-full sm:w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {value ? (
              <IconRenderer iconName={value} size={24} className="text-primary" />
            ) : (
              <span className="text-slate-400 text-xs">—</span>
            )}
          </div>

          {/* Champ de saisie / sélection */}
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-background-dark border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-primary transition-all text-left flex justify-between items-center hover:border-white/20 min-h-[44px]"
            >
              <span className="text-white truncate">{value || 'Sélectionner une icône'}</span>
              <span className="text-white/60 flex-shrink-0 ml-2">{isOpen ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown des icônes */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-dark border border-white/20 rounded-lg shadow-xl z-50 max-h-96 sm:max-h-64 overflow-hidden flex flex-col">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-white/10 flex-shrink-0">
            <input
              type="text"
              placeholder="Chercher une icône..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-xs outline-none focus:border-primary transition-all min-h-[40px]"
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Liste des icônes */}
          <div className="overflow-y-auto flex-1 grid grid-cols-5 sm:grid-cols-4 gap-2 p-3">
            {filteredIcons.length > 0 ? (
              filteredIcons.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  title={iconName}
                  className={`p-3 sm:p-2 rounded-lg transition-all flex items-center justify-center hover:bg-white/10 min-h-[44px] sm:min-h-[40px] ${
                    value === iconName ? 'bg-primary/30 border border-primary' : 'border border-white/10 hover:border-white/20'
                  }`}
                >
                  <IconRenderer 
                    iconName={iconName} 
                    size={20} 
                    className={value === iconName ? 'text-primary' : 'text-white/60'} 
                  />
                </button>
              ))
            ) : (
              <div className="col-span-5 sm:col-span-4 text-center py-4 text-xs text-slate-400">
                Aucune icône trouvée
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
