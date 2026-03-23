import React, { useState } from 'react';
import { CMSData, ThemeConfig } from '../../types';
import { Palette, RotateCcw, Save } from 'lucide-react';

export default function ThemeSettings({ data, setData, onSave }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>>, onSave?: (data: CMSData) => Promise<void> }) {
  const [themeData, setThemeData] = useState<ThemeConfig>(data.theme);
  const [isSaved, setIsSaved] = useState(false);

  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    setThemeData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    const updatedData = {
      ...data,
      theme: themeData
    };

    try {
      if (onSave) {
        await onSave(updatedData);
      }
      // Only update local state after successful backend save
      setData(updatedData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('ThemeSettings: Failed to save:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez votre connexion.');
    }
  };

  const handleReset = () => {
    const defaultTheme: ThemeConfig = {
      primary: '#d35f17',
      accent: '#f4d125',
      accentRed: '#dc2626',
      background: '#0a0807',
      surface: '#1a1a1a',
      text: '#ffffff',
      mutedText: '#94a3b8'
    };
    setThemeData(defaultTheme);
    setData(prev => ({
      ...prev,
      theme: defaultTheme
    }));
  };

  const colorFields = [
    { key: 'primary' as const, label: 'Couleur Primaire', description: 'Couleur principale du site' },
    { key: 'accent' as const, label: 'Couleur Accent', description: 'Accent doré/clair' },
    { key: 'accentRed' as const, label: 'Couleur Accent Rouge', description: 'Accent rouge' },
    { key: 'background' as const, label: 'Fond Sombre', description: 'Couleur de fond principal' },
    { key: 'surface' as const, label: 'Couleur Surface', description: 'Couleur des surfaces secondaires' },
    { key: 'text' as const, label: 'Couleur Texte', description: 'Couleur du texte principal' },
    { key: 'mutedText' as const, label: 'Texte Atténué', description: 'Couleur du texte secondaire' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Palette className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-2xl font-heading">Paramètres du Thème</h3>
          <p className="text-slate-400 text-sm">Personnalisez les couleurs de votre site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {colorFields.map(field => (
          <div key={field.key} className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                {field.label}
              </label>
              <p className="text-[10px] text-slate-600">{field.description}</p>
            </div>
            
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={themeData[field.key]}
                onChange={e => handleColorChange(field.key, e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/10 hover:border-primary/50 transition-all"
              />
              <input
                type="text"
                value={themeData[field.key]}
                onChange={e => handleColorChange(field.key, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs font-mono focus:border-primary outline-none transition-all"
                placeholder="#000000"
              />
            </div>

            {/* Aperçu */}
            <div className="pt-2 border-t border-white/5">
              <div className="text-[10px] text-slate-600 mb-2">Aperçu:</div>
              <div
                className="w-full h-12 rounded-lg border-2 border-white/10 transition-all"
                style={{ backgroundColor: themeData[field.key] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Aperçu complet */}
      <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
        <h4 className="text-lg font-heading">Aperçu Complet</h4>
        
        <div className="space-y-4">
          {/* Exemple d'une section */}
          <div
            className="p-8 rounded-lg"
            style={{ backgroundColor: themeData.background }}
          >
            <div style={{ color: themeData.primary }} className="text-2xl font-bold mb-2">
              Titre Primaire
            </div>
            <div style={{ color: themeData.text }} className="text-base mb-4">
              Ceci est un exemple de texte principal avec la couleur sélectionnée.
            </div>
            <div style={{ color: themeData.mutedText }} className="text-sm mb-4">
              Ceci est un exemple de texte atténué pour les descriptions secondaires.
            </div>

            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: themeData.primary }}
              >
                Bouton Primaire
              </button>
              <button
                className="px-4 py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: themeData.accentRed }}
              >
                Bouton Accent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-background-dark font-bold rounded-lg hover:shadow-[0_0_20px_rgba(211,95,23,0.4)] transition-all"
        >
          <Save size={18} /> Enregistrer les couleurs
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
        >
          <RotateCcw size={18} /> Réinitialiser aux couleurs par défaut
        </button>
      </div>

      {/* Message de succès */}
      {isSaved && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-lg font-bold text-sm">
          ✓ Thème enregistré avec succès!
        </div>
      )}

      {/* Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Note:</strong> Les changements de couleur s'appliqueront au rechargement du site. Certains éléments peuvent nécessiter un rechargement complet du navigateur pour voir les changements.
        </p>
      </div>
    </div>
  );
}
