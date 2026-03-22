import React from 'react';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  Handshake, 
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard = () => {
  const stats = [
    { label: 'Participants', value: '256', icon: <Users className="text-blue-500" />, trend: '+12%', color: 'blue' },
    { label: 'Événements', value: '42', icon: <Calendar className="text-primary" />, trend: '+5', color: 'primary' },
    { label: 'Articles Blog', value: '18', icon: <Newspaper className="text-emerald-500" />, trend: '+2', color: 'emerald' },
    { label: 'Partenaires', value: '24', icon: <Handshake className="text-purple-500" />, trend: '+3', color: 'purple' },
  ];

  const recentActivities = [
    { id: 1, type: 'update', user: 'Harry Zanno', action: 'a mis à jour le programme du Jour 3', time: 'Il y a 10 min' },
    { id: 2, type: 'create', user: 'Admin', action: 'a ajouté un nouveau danseur : B-Boy Victor', time: 'Il y a 45 min' },
    { id: 3, type: 'delete', user: 'Harry Zanno', action: 'a supprimé un ancien partenaire', time: 'Il y a 2 heures' },
    { id: 4, type: 'update', user: 'Admin', action: 'a modifié les prix des billets VIP', time: 'Il y a 5 heures' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading text-white uppercase tracking-tight">Tableau de Bord</h1>
          <p className="text-slate-500 text-sm uppercase tracking-widest mt-1">Bienvenue dans votre espace de gestion ASBI 2026</p>
        </div>
        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Statut du Site</p>
            <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider">En Ligne</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                {stat.icon}
              </div>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                {stat.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-heading text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-heading text-white uppercase tracking-wider">Activités Récentes</h3>
            <button className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="mt-1">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-heading text-white uppercase tracking-wider mb-6">Actions Rapides</h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-primary text-background-dark font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all">
              Nouvel Article Blog
            </button>
            <button className="w-full p-4 bg-white/5 text-white border border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all">
              Ajouter un Danseur
            </button>
            <button className="w-full p-4 bg-white/5 text-white border border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all">
              Modifier Programme
            </button>
            <div className="pt-6 mt-6 border-t border-white/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Support Technique</p>
              <a href="mailto:support@asbi.tg" className="text-sm text-primary hover:underline">support@asbi.tg</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
