import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Lock, Mail, User, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Admin {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminsManager() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const token = localStorage.getItem('admin_token');
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      } else {
        setError('Erreur lors du chargement des administrateurs');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmins([...admins, data.admin]);
        setFormData({ name: '', email: '', password: '' });
        setShowForm(false);
      } else {
        setError(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsSaving(true);
    setError('');

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_URL}/auth/admins/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmins(admins.map(a => a.id === editingId ? data.admin : a));
        setFormData({ name: '', email: '', password: '' });
        setEditingId(null);
        setShowForm(false);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/admins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAdmins(admins.filter(a => a.id !== id));
      } else {
        const data = await response.json();
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    }
  };

  const handleEdit = (admin: Admin) => {
    setFormData({ name: admin.name, email: admin.email, password: '' });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-white uppercase tracking-tight">Gestion des Administrateurs</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Créez et gérez les comptes administrateur</p>
        </div>
        <button
          onClick={() => !showForm ? setShowForm(true) : handleCancel()}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all"
        >
          <Plus size={16} /> Nouvel Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-white/5 rounded-2xl p-6"
        >
          <form onSubmit={editingId ? handleUpdateAdmin : handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} /> Nom
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom complet"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> {editingId ? 'Mot de passe (optionnel)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? '••••••••' : 'Nouveau mot de passe'}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white/5 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <X size={14} /> Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Admins List */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date Création</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admins.map((admin) => (
                <motion.tr
                  key={admin.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-white font-semibold">{admin.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Administrateur
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-white/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={admins.length <= 1}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={admins.length <= 1 ? 'Impossible de supprimer le dernier admin' : 'Supprimer'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="p-12 text-center">
            <User size={32} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm">Aucun administrateur pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
