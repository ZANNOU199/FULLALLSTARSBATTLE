import React from 'react';
import { CMSData } from '../../types';
import { 
  Users, 
  FileText, 
  Handshake, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Calendar,
  Settings
} from 'lucide-react';

interface DashboardOverviewProps {
  data: CMSData;
  onNavigate?: (module: string) => void;
}

export default function DashboardOverview({ data, onNavigate }: DashboardOverviewProps) {
  const stats = [
    { label: 'Articles', value: data.blog.articles.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Participants', value: data.participants.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Partenaires', value: data.partners.logos.length, icon: Handshake, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Activités', value: data.program.reduce((acc, day) => acc + day.activities.length, 0), icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <h3 className="text-3xl font-heading mb-1">{stat.value}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl">Activités Récentes</h3>
            <button 
              onClick={() => onNavigate?.('program')}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-6">
            {data.program.length > 0 ? (
              data.program.slice(0, 4).map((day) => (
                <div key={day.id} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Calendar size={16} className="text-slate-500 group-hover:text-primary" />
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold">{day.label}</p>
                      <span className="text-[10px] text-slate-500">{day.date}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {day.activities.length > 0 
                        ? `${day.activities.length} activité(s): ${day.activities.map(a => a.title).join(', ')}`
                        : 'Aucune activité planifiée'
                      }
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Aucune activité récente</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h3 className="font-heading text-xl mb-6">Actions Rapides</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate?.('blog')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Nouvel Article</span>
            </button>
            <button 
              onClick={() => onNavigate?.('participants')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                <Users size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Ajouter Danseur</span>
            </button>
            <button 
              onClick={() => onNavigate?.('program')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Modifier Planning</span>
            </button>
            <button 
              onClick={() => onNavigate?.('config')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                <Settings size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Config SEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
