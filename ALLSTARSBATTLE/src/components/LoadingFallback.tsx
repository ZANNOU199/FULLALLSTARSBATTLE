import React from 'react';
import { motion } from 'motion/react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background-dark flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Spinner animation */}
        <motion.div 
          className="w-16 h-16 border-4 border-white/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Loading text */}
        <motion.div 
          className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Chargement en cours...
        </motion.div>
      </div>
    </div>
  );
};
