import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cmsService } from './services/cmsService';
import { 
  CheckCircle2, 
  MinusCircle, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  Send,
  Share2,
  Globe,
  PlayCircle,
  ArrowDown
} from 'lucide-react';

const Tickets = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getData();
      
      setTicketTypes((data.ticketing?.tickets || []).map((t, idx) => ({
        name: t.name,
        tag: t.tag,
        price: t.price,
        period: t.period,
        features: t.features.map(f => ({ text: f, included: true })),
        buttonText: t.buttonText,
        color: t.color,
        recommended: t.recommended,
        paymentLink: t.paymentLink
      })));

      setFaqs((data.ticketing?.faqs || []).map(f => ({
        q: f.question,
        a: f.answer
      })));
    };
    loadData();
  }, []);

  const handleTicketClick = (link: string) => {
    if (link) window.open(link, '_blank');
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display antialiased">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden grainy-bg pt-32">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay diagonal-bg"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 space-y-6 max-w-5xl"
        >
          <span className="text-accent-red font-heading text-2xl tracking-[0.3em] block uppercase">LOM├ë ÔÇó TOGO ÔÇó 2026</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading leading-[0.85] uppercase tracking-tighter">
            BILLETTERIE <br/> <span className="text-primary italic">& ACC├êS</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
            Vivez l'histoire du breakdance en direct ├á Lom├®.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <ArrowDown className="text-primary w-10 h-10" />
        </motion.div>
      </section>

      {/* Ticket Selection */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="font-heading text-5xl uppercase tracking-tight text-white">CHOISISSEZ VOTRE EXP├ëRIENCE</h2>
            <div className="h-1 w-32 bg-primary mt-4"></div>
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">3 Cat├®gories disponibles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ticketTypes.map((ticket, idx) => (
            <motion.div 
              key={ticket.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`group relative bg-surface-dark border ${ticket.recommended ? 'border-primary border-2 shadow-[0_0_40px_rgba(244,209,37,0.15)]' : 'border-white/10'} rounded-xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500`}
            >
              {ticket.recommended && (
                <div className="absolute top-0 right-0 bg-primary text-background-dark px-4 py-1 text-[10px] font-black uppercase tracking-tighter">RECOMMAND├ë</div>
              )}
              
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-heading text-3xl text-white tracking-widest">{ticket.name}</span>
                  <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${ticket.recommended ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-400'}`}>
                    {ticket.tag}
                  </span>
                </div>
                
                <div className="mb-8">
                  <span className={`text-5xl font-heading ${ticket.color === 'primary' ? 'text-primary' : ticket.color === 'accent-red' ? 'text-accent-red' : 'text-white'}`}>
                    {ticket.price}
                  </span>
                  <span className="text-slate-500 text-sm ml-2 italic">{ticket.period}</span>
                </div>

                <ul className="space-y-4">
                  {ticket.features.map((feature, fIdx) => (
                    <li key={fIdx} className={`flex items-center gap-3 text-sm ${feature.included ? 'text-slate-200' : 'text-slate-500 opacity-50'}`}>
                      {feature.included ? (
                        <CheckCircle2 className={`w-5 h-5 ${ticket.color === 'accent-red' ? 'text-accent-red' : 'text-primary'}`} />
                      ) : (
                        <MinusCircle className="w-5 h-5" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleTicketClick(ticket.paymentLink)}
                className={`w-full py-6 font-heading text-2xl tracking-widest transition-all duration-300 uppercase
                ${ticket.color === 'primary' ? 'bg-primary text-background-dark hover:bg-white' : 
                  ticket.color === 'accent-red' ? 'bg-white/5 text-white hover:bg-accent-red hover:text-white' : 
                  'bg-white/5 text-white hover:bg-primary hover:text-background-dark'}`}
              >
                {ticket.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info & FAQ */}
      <section className="bg-surface-dark/30 py-24 border-y border-white/5 grainy-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-heading text-5xl uppercase mb-12 text-white">INFOS PRATIQUES</h2>
            
            <div className="space-y-6 mb-16">
              <div className="flex gap-6 items-start p-6 bg-surface-dark rounded-lg border-l-4 border-primary shadow-xl">
                <Calendar className="text-primary w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-wider">DATES</h4>
                  <p className="text-slate-400">Du 15 au 20 D├®cembre 2026</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start p-6 bg-surface-dark rounded-lg border-l-4 border-accent-red shadow-xl">
                <MapPin className="text-accent-red w-10 h-10 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1 uppercase tracking-wider">LIEU</h4>
                  <p className="text-slate-400">Palais des Congr├¿s de Lom├®, Togo</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-3xl uppercase text-white mb-8 tracking-widest">QUESTIONS FR├ëQUENTES</h3>
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border-b border-white/10 py-6 group cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg group-hover:text-primary transition-colors">{faq.q}</span>
                    <ChevronDown className={`text-primary transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 text-slate-400 text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALnJAY4_XxqC6EeDHtB75VqgEPFi_VOaHTZZ9ZTWwKMjcsiCPYCgVjcaP7F2BC0z0C2fGnhnUI1J-dEt2S5FNouX_akQPM8-2mbqUlN-2tdVUOyup9LoUFckFZGC2wXmNftTrUJ8Xj6s2UlhrPflNK41xjuOPIy5lTG-OTtHaHJXWL6AMKR2SBC-WfwRrtx8dDXeJ1_EvTXy0Rm-AH1XMnt3h8Y9Lw4kX1VchBB0PQ3buB2cRhGNMhHyhwW0kxnBrfOoeEwe8Ik2N3" 
              alt="Lom├® Map" 
              className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent flex flex-col justify-end p-8">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="bg-primary/95 p-8 rounded shadow-2xl text-background-dark max-w-sm backdrop-blur-sm"
              >
                <p className="font-heading text-2xl uppercase tracking-wider mb-2">Point de rendez-vous</p>
                <p className="text-sm font-bold leading-relaxed">Boulevard du Mono, Lom├®. <br/>Acc├¿s porte A & B.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tickets;
