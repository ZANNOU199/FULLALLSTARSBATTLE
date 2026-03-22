import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Newspaper, 
  Trophy, 
  Ticket, 
  History, 
  Handshake, 
  Settings, 
  LogOut,
  Menu,
  X,
  Palette
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Palette size={20} />, label: 'Scène Artistique', path: '/admin/artistic' },
    { icon: <Users size={20} />, label: 'Participants & Jury', path: '/admin/participants' },
    { icon: <Calendar size={20} />, label: 'Programme', path: '/admin/program' },
    { icon: <Newspaper size={20} />, label: 'Blog & News', path: '/admin/news' },
    { icon: <Trophy size={20} />, label: 'Compétition', path: '/admin/competition' },
    { icon: <Ticket size={20} />, label: 'Billetterie & FAQ', path: '/admin/tickets' },
    { icon: <History size={20} />, label: 'Histoire & Légendes', path: '/admin/history' },
    { icon: <Handshake size={20} />, label: 'Partenaires', path: '/admin/partners' },
    { icon: <Settings size={20} />, label: 'Configuration', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 border-r border-white/5 transition-all duration-300 flex flex-col z-50`}
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

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-background-dark font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-background-dark' : 'text-primary group-hover:text-primary'}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm uppercase tracking-wider">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm uppercase tracking-wider">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Harry Zanno</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Super Administrateur</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
              HZ
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
