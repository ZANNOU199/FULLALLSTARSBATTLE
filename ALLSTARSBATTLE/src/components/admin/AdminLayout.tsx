
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Music, 
  Users, 
  Calendar, 
  Newspaper, 
  Trophy, 
  Ticket, 
  History, 
  Handshake, 
  Settings,
  ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/admin' },
  { icon: Music, label: 'Scène Artistique', path: '/admin/scene' },
  { icon: Users, label: 'Participants & Jury', path: '/admin/participants' },
  { icon: Calendar, label: 'Programme & Planning', path: '/admin/program' },
  { icon: Newspaper, label: 'Blog & Actualités', path: '/admin/blog' },
  { icon: Trophy, label: 'Compétition & Brackets', path: '/admin/competition' },
  { icon: Ticket, label: 'Billetterie & FAQ', path: '/admin/tickets-faq' },
  { icon: History, label: 'Histoire & Légendes', path: '/admin/history' },
  { icon: Handshake, label: 'Partenaires & Médias', path: '/admin/partners' },
  { icon: Settings, label: 'Configuration Globale', path: '/admin/config' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-luxury-glow">
            ASBI <span className="text-primary">CMS</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="px-4 pb-8 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(211,95,23,0.3)]" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-8 pt-8 border-t border-white/5 mt-auto pb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            VOIR LE SITE PUBLIC
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
