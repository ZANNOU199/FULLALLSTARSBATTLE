import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronDown,
  ArrowLeft,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { cmsService } from './services/cmsService';
import { FAQItem as FAQType } from './types';

const FAQ = ({ onNavigateBack }: { onNavigateBack?: () => void }) => {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    cmsService.getData().then(data => {
      setFaqs(data.ticketing.faqs);
      setFilteredFaqs(data.ticketing.faqs);
    });
  }, []);

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleCmsUpdate = async () => {
      const data = await cmsService.getData();
      setFaqs(data.ticketing.faqs);
      setFilteredFaqs(data.ticketing.faqs);
    };
    window.addEventListener('cmsDataChanged', handleCmsUpdate);
    return () => window.removeEventListener('cmsDataChanged', handleCmsUpdate);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchTerm, faqs]);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="bg-background-dark text-slate-100 font-sans antialiased">
      {/* Header */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-6 overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2000')" }}
          ></div>
        </div>

        <div className="relative z-20 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block bg-accent-pink px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            Support & Aide
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-heading text-white uppercase tracking-tighter italic leading-[0.9] mb-6"
          >
            Foire Aux <span className="text-primary">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto font-light italic leading-relaxed"
          >
            Trouvez rapidement les réponses à vos questions sur l'événement, les inscriptions et la billetterie.
          </motion.p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher une question ou un mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-dark border border-white/10 text-white rounded-sm py-6 pl-16 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-slate-600 transition-all text-lg"
            />
          </div>
          {searchTerm && (
            <p className="text-slate-500 text-sm mt-4 text-center">
              {filteredFaqs.length} résultat{filteredFaqs.length !== 1 ? 's' : ''} trouvé{filteredFaqs.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 md:px-20 pb-32">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredFaqs.length > 0 ? (
              <motion.div
                key={searchTerm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-surface-dark border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <HelpCircle className="text-primary w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white pr-4">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-primary transition-transform duration-300 shrink-0 ${
                          openItems.has(faq.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openItems.has(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-8 pt-4 border-t border-white/5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-accent-pink/10 flex items-center justify-center shrink-0 mt-1">
                                <MessageCircle className="text-accent-pink w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-300 leading-relaxed text-lg">{faq.answer}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-500 mb-4">Aucun résultat trouvé</h3>
                <p className="text-slate-600 text-lg">
                  Essayez de reformuler votre recherche ou vérifiez l'orthographe.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Back Button */}
      {onNavigateBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNavigateBack}
          className="fixed bottom-8 left-8 bg-primary text-background-dark p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 group z-50"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" aria-label="Retour à la page précédente" />
        </motion.button>
      )}
    </div>
  );
};

export default FAQ;