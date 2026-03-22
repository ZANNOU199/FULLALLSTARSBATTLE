
import React from 'react';
import { useCMSStore } from '../../store/useStore';
import { Users, Music, Newspaper, Trophy, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { state } = useCMSStore();

  const stats = [
    { label: 'Articles', value: state.articles.length, icon: Newspaper, color: 'text-blue-500' },
    { label: 'Participants', value: state.participants.length, icon: Users, color: 'text-emerald-500' },
    { label: 'Compagnies', value: state.companies.length, icon: Music, color: 'text-purple-500' },
    { label: 'Partenaires', value: state.partners.length, icon: Trophy, color: 'text-amber-500' },
  ];

  const chartData = [
    { name: 'Articles', count: state.articles.length },
    { name: 'Participants', count: state.participants.length },
    { name: 'Compagnies', count: state.companies.length },
    { name: 'Partenaires', count: state.partners.length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b'];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Tableau de Bord</h2>
        <p className="text-zinc-500 mt-1">Vue d'ensemble de votre plateforme CMS.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className={stat.color}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-zinc-600" />
            </div>
            <div>
              <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl">
          <h3 className="text-sm font-black tracking-widest uppercase mb-8 text-zinc-400">Répartition des Données</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontWeight: 'bold' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-sm font-black tracking-widest uppercase mb-8 text-zinc-400 flex items-center gap-2">
            <Activity size={16} />
            Dernières Activités
          </h3>
          <div className="space-y-6">
            {[
              { text: 'Nouvel article publié', time: 'Il y a 2h', type: 'blog' },
              { text: 'Participant "Lilou" ajouté', time: 'Il y a 5h', type: 'user' },
              { text: 'Planning mis à jour', time: 'Hier', type: 'calendar' },
              { text: 'Nouveau partenaire ajouté', time: 'Il y a 2 jours', type: 'partner' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
