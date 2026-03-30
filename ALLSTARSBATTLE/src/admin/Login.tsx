import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur de connexion');
        setIsLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      setIsLoading(false);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Erreur réseau: ${err instanceof Error ? err.message : 'Connexion impossible'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <div className="h-24 w-24 mx-auto flex items-center justify-center mb-6">
            <img 
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/logo.png`}
              alt="All Star Battle Logo"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tight">Espace Admin</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">All Star Battle International</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <User size={12} /> Email Administrateur
            </label>
            <input 
              required
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
              placeholder="nom@allstarbattle.dance"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={12} /> Mot de Passe
            </label>
            <input 
              required
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-all"
              placeholder="......"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-background-dark py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Se Connecter'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center mb-3">
            Accès sécurisé • ASB 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
