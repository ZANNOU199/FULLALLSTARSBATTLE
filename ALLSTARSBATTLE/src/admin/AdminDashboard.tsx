import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Trophy, 
  HelpCircle,
  History, 
  Handshake, 
  Settings, 
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  Image as ImageIcon,
  Search,
  ChevronRight,
  Menu,
  MessageSquare,
  X,
  Palette,
  Mail,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { cmsService, initialData } from '../services/cmsService';
import { CMSData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Modules
import DashboardOverview from './modules/DashboardOverview';
import SceneArtistique from './modules/SceneArtistique';
import ParticipantsJury from './modules/ParticipantsJury';
import ProgramPlanning from './modules/ProgramPlanning';
import BlogNews from './modules/BlogNews';
import CompetitionBrackets from './modules/CompetitionBrackets';
import TicketingFAQ from './modules/TicketingFAQ';
import HistoryLegends from './modules/HistoryLegends';
import PartnersMedia from './modules/PartnersMedia';
import MediaArchives from './modules/MediaArchives';
import GlobalConfigSEO from './modules/GlobalConfigSEO';
import HomepageContent from './modules/HomepageContent';
import ThemeSettings from './modules/ThemeSettings';
import ContactCMS from './modules/ContactCMS';
import ContactMessagesAdmin from './modules/ContactMessagesAdmin';
import ParticipateAdmin from './modules/ParticipateAdmin';
import BackgroundImages from './modules/BackgroundImages';
import SiteImagesManager from './modules/SiteImagesManager';

// Profile Form Component
function ProfileForm({ currentUser, onClose, onUpdate }: { currentUser: any, onClose: () => void, onUpdate: (user: any) => void }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profil mis à jour avec succès !');
        onUpdate(data.user);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-4 rounded-xl">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-bold text-white mb-4">Changer le mot de passe</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-6 text-slate-400 hover:text-white border border-white/10 rounded-xl transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 bg-primary text-background-dark rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
import OrganizersAdmin from './modules/OrganizersAdmin';
import AdminsManager from './modules/AdminsManager';

type ModuleId = 
  | 'dashboard' 
  | 'scene' 
  | 'participants' 
  | 'program' 
  | 'blog' 
  | 'competition' 
  | 'ticketing' 
  | 'history' 
  | 'partners' 
  | 'media'
  | 'contact'
  | 'config'
  | 'homepage'
  | 'theme'
  | 'participate'
  | 'backgrounds'
  | 'siteAssets'
  | 'organizers'
  | 'contactMessages'
  | 'admins';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [data, setData] = useState<CMSData>(initialData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [unreadContactCount, setUnreadContactCount] = useState<number>(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const skipAutoSaveRef = useRef(false);  // Flag to skip auto-save after manual saves

  // Generate initials from user name
  const getUserInitials = (name: string) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    // Load data from API
    cmsService.getData().then(loadedData => {
      setData(loadedData);
    });

    // Load current user info
    const userInfo = localStorage.getItem('admin_user');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }

    const loadUnreadCount = async () => {
      try {
        const response = await api.get('/cms/contact-messages');
        const messages = response.data as Array<{ status: string }>;
        setUnreadContactCount(messages.filter(msg => msg.status === 'unread').length);
      } catch (error) {
        console.error('Erreur chargement compteur messages non lus', error);
      }
    };

    loadUnreadCount();
    const intervalId = setInterval(loadUnreadCount, 30000); // refresh 30s
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update count when user navigates to ContactMessages admin
    const loadUnreadCountForIdle = async () => {
      try {
        const response = await api.get('/cms/contact-messages');
        const messages = response.data as Array<{ status: string }>;
        setUnreadContactCount(messages.filter(msg => msg.status === 'unread').length);
      } catch (error) {
        console.error('Erreur chargement compteur messages non lus', error);
      }
    };

    if (activeModule === 'contactMessages') {
      loadUnreadCountForIdle();
    }
  }, [activeModule]);

  // Manual save function - called only when user explicitly saves
  const manualSave = async (dataToSave: CMSData) => {
    console.log('[Admin Dashboard] manualSave called');
    console.log('[Admin Dashboard] Data to save:', dataToSave);
    setSaveStatus('saving');
    try {
      console.log('[Admin Dashboard] Calling cmsService.saveData...');
      const result = await cmsService.saveData(dataToSave);
      console.log('[Admin Dashboard] cmsService.saveData completed successfully');
      console.log('[Admin Dashboard] Result:', result);
      
      // Reload fresh data from backend after successful save
      console.log('[Admin Dashboard] Reloading fresh data from backend');
      const freshData = await cmsService.getData();
      console.log('[Admin Dashboard] Fresh data loaded:', freshData);
      setData(freshData);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('[Admin Dashboard] Save error:', error);
      setSaveStatus('idle');
      alert('Erreur lors de la sauvegarde. Détails: ' + (error as any)?.message);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'homepage', label: 'Contenu Accueil (Page)', icon: Palette },
    { id: 'backgrounds', label: 'Images de Fond', icon: ImageIcon },
    { id: 'siteAssets', label: 'Assets du Site', icon: ImageIcon },
    { id: 'scene', label: 'Scène Artistique', icon: Palette },
    { id: 'participate', label: 'Page Participer', icon: UserCheck },
    { id: 'participants', label: 'Participants & Jury', icon: Users },
    { id: 'organizers', label: 'Équipe Organisation', icon: Users },
    { id: 'admins', label: 'Administrateurs', icon: Users },
    { id: 'program', label: 'Programme & Planning', icon: Calendar },
    { id: 'blog', label: 'Blog & Actualités', icon: FileText },
    { id: 'competition', label: 'Compétition & Brackets', icon: Trophy },
    { id: 'ticketing', label: 'FAQ', icon: HelpCircle },
    { id: 'history', label: 'Histoire & Légendes', icon: History },
    { id: 'contact', label: 'Page Contact', icon: Mail },
    { id: 'contactMessages', label: 'Messages de Contact', icon: MessageSquare },
    { id: 'media', label: 'Galerie & Archives Média', icon: ImageIcon },
    { id: 'partners', label: 'Partenaires', icon: Handshake },
    { id: 'config', label: 'Configuration & SEO', icon: Settings },
    { id: 'theme', label: 'Paramètres du Thème', icon: Palette },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardOverview data={data} onNavigate={(module) => setActiveModule(module as ModuleId)} />;
      case 'homepage': return <HomepageContent data={data} setData={setData} onSave={manualSave} />;
      case 'backgrounds': return <BackgroundImages data={data} setData={setData} onSave={manualSave} />;
      case 'siteAssets': return <SiteImagesManager data={data} setData={setData} />;
      case 'admins': return <AdminsManager />;
      case 'scene': return <SceneArtistique data={data} setData={setData} onSave={manualSave} />;
      case 'participate': return <ParticipateAdmin data={data} setData={setData} onSave={manualSave} />;
      case 'participants': return <ParticipantsJury data={data} setData={setData} />;
      case 'program': return <ProgramPlanning data={data} setData={setData} />;
      case 'blog': return <BlogNews data={data} setData={setData} />;
      case 'competition': return <CompetitionBrackets data={data} setData={setData} />;
      case 'ticketing': return <TicketingFAQ data={data} setData={setData} />;
      case 'history': return <HistoryLegends data={data} setData={setData} />;
      case 'contact': return <ContactCMS data={data} setData={setData} onSave={manualSave} />;
      case 'contactMessages': return <ContactMessagesAdmin />;
      case 'media': return <MediaArchives data={data} setData={setData} onSave={manualSave} />;
      case 'partners': return <PartnersMedia data={data} setData={setData} />;
      case 'organizers': return <OrganizersAdmin data={data} setData={setData} onSave={manualSave} />;
      case 'config': return <GlobalConfigSEO data={data} setData={setData} onSave={manualSave} />;
      case 'theme': return <ThemeSettings data={data} setData={setData} onSave={manualSave} />;
      default: return <DashboardOverview data={data} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#111] border-r border-white/5 flex flex-col z-50"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary flex items-center justify-center font-heading text-xl text-background-dark font-bold">AS</div>
              <span className="font-heading text-lg tracking-tighter text-white">ADMIN</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleId)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                activeModule === item.id 
                  ? 'bg-primary text-background-dark font-bold shadow-[0_0_20px_rgba(211,95,23,0.3)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeModule === item.id ? 'text-background-dark' : ''} />
              {isSidebarOpen && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-accent-red hover:bg-accent-red/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#111]/50 backdrop-blur-md">
          <h2 className="text-lg font-heading tracking-widest uppercase">
            {menuItems.find(m => m.id === activeModule)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                saveStatus === 'saving' ? 'bg-yellow-500' : 
                saveStatus === 'saved' ? 'bg-emerald-500' : 
                'bg-slate-500'
              }`}></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {saveStatus === 'saving' ? 'Enregistrement...' : 
                 saveStatus === 'saved' ? 'Enregistré ✓' : 
                 'En Attente'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <MessageSquare className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-bold text-cyan-100 uppercase tracking-wide"></span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">{unreadContactCount}</span>
            </div>

            <button 
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs hover:bg-primary/30 transition-colors cursor-pointer"
              title="Modifier mon profil"
            >
              {currentUser ? getUserInitials(currentUser.name) : 'A'}
            </button>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading text-white uppercase tracking-tight">Mon Profil</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <ProfileForm 
                currentUser={currentUser} 
                onClose={() => setShowProfileModal(false)}
                onUpdate={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  localStorage.setItem('admin_user', JSON.stringify(updatedUser));
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
