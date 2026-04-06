
import React, { useState } from 'react';
import { useCMSStore } from '../../store/useStore';
import { Plus, Trash2, Edit2, Ticket as TicketIcon, HelpCircle } from 'lucide-react';
import { Ticket, FAQItem } from '../../types';

export default function TicketsFAQ() {
  const { state, updateState } = useCMSStore();
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');

  const handleDeleteTicket = (id: string) => {
    updateState(prev => ({ ...prev, tickets: prev.tickets.filter(t => t.id !== id) }));
  };

  const handleDeleteFAQ = (id: string) => {
    updateState(prev => ({ ...prev, faq: prev.faq.filter(f => f.id !== id) }));
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Billetterie & FAQ</h2>
        <p className="text-zinc-500 mt-1">Gérez les tarifs des tickets et les questions fréquentes.</p>
      </header>

      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'tickets' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          TICKETS
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'faq' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          FAQ
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.tickets.map(ticket => (
            <div key={ticket.id} className="glass p-8 rounded-3xl relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDeleteTicket(ticket.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
              <TicketIcon className="text-primary mb-6" size={32} />
              <h3 className="text-xl font-black tracking-tight mb-2">{ticket.name}</h3>
              <p className="text-3xl font-black text-white mb-6">{ticket.price}</p>
              <ul className="space-y-3 mb-8">
                {ticket.benefits.map((b, i) => (
                  <li key={i} className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                Modifier le lien
              </button>
            </div>
          ))}
          <button 
            onClick={() => updateState(prev => ({ ...prev, tickets: [...prev.tickets, { id: Date.now().toString(), name: 'Nouveau Pass', price: '0 FCFA', benefits: [], paymentLink: '#' }] }))}
            className="border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
          >
            <Plus size={32} className="mb-2" />
            <span className="text-xs font-black uppercase tracking-widest">Ajouter un ticket</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.faq.map(item => (
            <div key={item.id} className="glass p-6 rounded-2xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <HelpCircle className="text-primary shrink-0" size={20} />
                  <h3 className="font-bold">{item.question}</h3>
                </div>
                <button onClick={() => handleDeleteFAQ(item.id)} className="p-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
              </div>
              <p className="text-sm text-zinc-400 ml-9">{item.answer}</p>
            </div>
          ))}
          <button 
            onClick={() => updateState(prev => ({ ...prev, faq: [...prev.faq, { id: Date.now().toString(), question: 'Nouvelle question ?', answer: 'Réponse ici...' }] }))}
            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Ajouter une question</span>
          </button>
        </div>
      )}
    </div>
  );
}
