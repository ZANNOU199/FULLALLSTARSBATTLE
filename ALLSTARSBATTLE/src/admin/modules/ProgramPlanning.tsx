import React, { useState, useEffect } from 'react';
import { CMSData, ProgramDay, Activity } from '../../types';
import { Plus, Trash2, Edit, Calendar, Clock, MapPin, Tag, X } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

export default function ProgramPlanning({ data, setData }: { data: CMSData, setData: React.Dispatch<React.SetStateAction<CMSData>> }) {
  const [selectedDayId, setSelectedDayId] = useState<string>(data.program[0]?.id || '');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityFormData, setActivityFormData] = useState<Partial<Activity & { startTime?: string; endTime?: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const categories = data.categories || [];

  // Listen for changes from other admin modules
  useEffect(() => {
    const handleCMSDataChanged = async () => {
      console.log('ProgramPlanning: CMS data changed, reloading');
      try {
        const updatedData = await cmsService.getData();
        setData(updatedData);
      } catch (error) {
        console.error('Failed to reload data:', error);
      }
    };

    window.addEventListener('cmsDataChanged', handleCMSDataChanged);
    return () => window.removeEventListener('cmsDataChanged', handleCMSDataChanged);
  }, [setData]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('Veuillez saisir un nom de catégorie.');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      alert('Cette catégorie existe déjà.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('ProgramPlanning: Adding category:', newCategory);
      await cmsService.addCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
      alert('Catégorie ajoutée avec succès!');
    } catch (error: any) {
      console.error('Failed to add category:', error);
      alert('Erreur lors de l\'ajout de la catégorie');
    }
    setIsLoading(false);
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete}"?`)) return;

    setIsLoading(true);
    try {
      console.log('ProgramPlanning: Deleting category:', categoryToDelete);
      await cmsService.deleteCategory(categoryToDelete);
      alert('Catégorie supprimée avec succès!');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
    setIsLoading(false);
  };

  const handleDeleteDay = async (dayId: string, dayLabel: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le ${dayLabel} et toutes ses activités?`)) return;

    setIsLoading(true);
    try {
      console.log('ProgramPlanning: Deleting program day:', dayId);
      await cmsService.deleteProgramDay(dayId);
      alert('Jour de programme supprimé avec succès!');
      
      // Si le jour supprimé était sélectionné, désélectionner
      if (selectedDayId === dayId) {
        setSelectedDayId(data.program.find(d => d.id !== dayId)?.id || '');
      }
    } catch (error: any) {
      console.error('Failed to delete program day:', error);
      alert('Erreur lors de la suppression du jour de programme');
    }
    setIsLoading(false);
  };

  const handleAddDay = async () => {
    let newLabel = '';
    let newDate = '';

    if (data.program.length === 0) {
      newLabel = 'JOUR 01';
      // Leave the first day date empty so the backend can use the configured competition start date.
      newDate = '';
    } else {
      const lastDay = data.program[data.program.length - 1];
      const lastLabelMatch = lastDay.label.match(/JOUR (\d+)/);
      if (lastLabelMatch) {
        const lastNum = parseInt(lastLabelMatch[1]);
        const nextNum = lastNum + 1;
        newLabel = `JOUR ${nextNum.toString().padStart(2, '0')}`;
      }

      if (lastDay.date) {
        try {
          const lastDate = new Date(lastDay.date);
          if (!isNaN(lastDate.getTime())) {
            lastDate.setDate(lastDate.getDate() + 1);
            newDate = lastDate.toISOString().split('T')[0];
          }
        } catch (e) {
          newDate = new Date().toISOString().split('T')[0];
        }
      }
    }

    setIsLoading(true);
    try {
      const payload: any = {
        label: newLabel,
      };
      if (newDate) {
        payload.date = newDate;
      }

      console.log('ProgramPlanning: Creating program day via API:', payload);
      await cmsService.addProgramDay(payload);
      alert('Jour de programme créé avec succès!');
    } catch (error: any) {
      console.error('Failed to add program day:', error);
      alert('Erreur lors de la création du jour de programme');
    }
    setIsLoading(false);
  };

  const handleAddActivity = async () => {
    if (!selectedDayId) {
      alert('Veuillez d\'abord sélectionner un jour de programme.');
      return;
    }

    if (!activityFormData.startTime || !activityFormData.endTime || !activityFormData.title) {
      alert('Veuillez saisir les heures de début, de fin et le titre.');
      return;
    }

    const timeString = `${activityFormData.startTime} - ${activityFormData.endTime}`;

    setIsLoading(true);
    try {
      const payload = {
        programDayId: selectedDayId,
        time: timeString,
        title: activityFormData.title,
        location: activityFormData.location || '',
        description: activityFormData.description || '',
        category: activityFormData.category || 'General',
      };

      console.log('ProgramPlanning: Creating activity via API:', payload);
      await cmsService.addActivity(payload);

      setIsAddingActivity(false);
      setActivityFormData({});
      alert('Activité créée avec succès!');
    } catch (error: any) {
      console.error('Failed to add activity:', error);
      alert('Erreur lors de la création de l\'activité: ' + (error.response?.data?.message || error.message));
    }
    setIsLoading(false);
  };

  const handleEditActivity = (activity: Activity) => {
    console.log('ProgramPlanning: Editing activity:', activity);
    setEditingActivityId(activity.id);

    const timeMatch = activity.time.match(/^(\d{1,2}:\d{2}) - (\d{1,2}:\d{2})$/);
    const startTime = timeMatch ? timeMatch[1] : '';
    const endTime = timeMatch ? timeMatch[2] : '';

    setActivityFormData({
      startTime,
      endTime,
      title: activity.title,
      location: activity.location,
      description: activity.description,
      category: activity.category,
    });
    setIsAddingActivity(true);
    console.log('ProgramPlanning: Set editingActivityId to:', activity.id);
  };

  const handleUpdateActivity = async () => {
    if (!activityFormData.startTime || !activityFormData.endTime || !activityFormData.title) {
      alert('Veuillez saisir les heures de début, de fin et le titre.');
      return;
    }

    const timeString = `${activityFormData.startTime} - ${activityFormData.endTime}`;

    setIsLoading(true);
    try {
      const payload = {
        time: timeString,
        title: activityFormData.title,
        location: activityFormData.location || '',
        description: activityFormData.description || '',
        category: activityFormData.category || 'General',
      };

      console.log('ProgramPlanning: Updating activity via API:', editingActivityId, payload);
      await cmsService.updateActivity(editingActivityId!, payload);

      setEditingActivityId(null);
      setActivityFormData({});
      alert('Activité modifiée avec succès!');
    } catch (error: any) {
      console.error('Failed to update activity:', error);
      alert('Erreur lors de la modification de l\'activité');
    }
    setIsLoading(false);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette activité?')) return;

    try {
      console.log('ProgramPlanning: Deleting activity via API:', activityId);
      await cmsService.deleteActivity(activityId);
      alert('Activité supprimée avec succès!');
    } catch (error: any) {
      console.error('Failed to delete activity:', error);
      alert('Erreur lors de la suppression de l\'activité');
    }
  };

  const selectedDay = data.program.find(d => d.id === selectedDayId);

  return (
    <div className="space-y-8">
      {/* Catégories */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-heading text-lg flex items-center gap-2"><Tag size={20} className="text-primary" /> Catégories</h4>
          <p className="text-sm text-slate-400">Les catégories apparaissent sur le site et dans la création d'activité.</p>
        </div>

        <div className="flex gap-4">
          {isAddingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Nouvelle catégorie"
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
              />
              <button onClick={handleAddCategory} disabled={isLoading} className="px-4 py-2 bg-primary text-background-dark font-bold rounded-xl disabled:opacity-50">
                Ajouter
              </button>
              <button onClick={() => { setIsAddingCategory(false); setNewCategory(''); }} className="px-4 py-2 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAddingCategory(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-primary border border-primary/20 font-bold rounded-xl hover:bg-primary/10 transition-all">
              <Plus size={18} /> Nouvelle catégorie
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <div key={category} className="flex items-center justify-between p-3 bg-[#111] border border-white/5 rounded-xl">
              <span className="font-medium">{category}</span>
              <button
                onClick={() => handleDeleteCategory(category)}
                disabled={isLoading}
                className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-accent-red transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jours du Programme */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-heading text-lg flex items-center gap-2"><Calendar size={20} className="text-primary" /> Jours du Programme</h4>
          <button onClick={handleAddDay} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark font-bold rounded-xl disabled:opacity-50">
            <Plus size={18} /> Ajouter Jour
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.program.map(day => (
            <div
              key={day.id}
              className={`p-6 rounded-2xl border cursor-pointer transition-all relative ${
                selectedDayId === day.id
                  ? 'border-primary bg-primary/10'
                  : 'border-white/5 bg-[#111] hover:border-white/10'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDay(day.id, day.label);
                }}
                disabled={isLoading}
                className="absolute top-3 right-3 p-1 hover:bg-white/5 rounded text-slate-400 hover:text-accent-red transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div onClick={() => setSelectedDayId(day.id)} className="text-center">
                <h5 className="font-bold text-xl mb-2">{day.label}</h5>
                <p className="text-slate-400 mb-4">{day.date}</p>
                <button className="px-4 py-2 bg-primary text-background-dark font-bold rounded-xl">
                  Créer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities for Selected Day */}
      {selectedDay ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-heading text-lg flex items-center gap-2"><Clock size={20} className="text-primary" /> Activités du {selectedDay.label}</h4>
            <button
              onClick={() => {
                setIsAddingActivity(true);
                setActivityFormData({ startTime: '09:00' });
              }}
              disabled={!selectedDayId}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 text-primary border border-primary/20 font-bold rounded-xl hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} /> Nouvelle Activité
            </button>
          </div>

          {(isAddingActivity || editingActivityId) && (
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-heading text-white">
                  {editingActivityId ? '✏️ Modifier l\'activité' : '➕ Nouvelle Activité'}
                </h5>
                {editingActivityId && (
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    Modification de l'activité #{editingActivityId}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heure de début</label>
                  <input
                    type="time"
                    value={activityFormData.startTime || ''}
                    onChange={e => setActivityFormData({ ...activityFormData, startTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heure de fin</label>
                  <input
                    type="time"
                    value={activityFormData.endTime || ''}
                    onChange={e => setActivityFormData({ ...activityFormData, endTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titre</label>
                  <input
                    type="text"
                    value={activityFormData.title || ''}
                    onChange={e => setActivityFormData({ ...activityFormData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lieu</label>
                  <input
                    type="text"
                    value={activityFormData.location || ''}
                    onChange={e => setActivityFormData({ ...activityFormData, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Catégorie</label>
                  <select
                    value={activityFormData.category || (categories[0] || '')}
                    onChange={e => setActivityFormData({ ...activityFormData, category: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all appearance-none"
                  >
                    {categories.filter(c => c !== 'Tous').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea
                    rows={2}
                    value={activityFormData.description || ''}
                    onChange={e => setActivityFormData({ ...activityFormData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => { setIsAddingActivity(false); setEditingActivityId(null); setActivityFormData({}); }} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">Annuler</button>
                <button onClick={editingActivityId ? handleUpdateActivity : handleAddActivity} disabled={isLoading} className="px-6 py-2 bg-primary text-background-dark rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50">Enregistrer</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {selectedDay.activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl">
                <div className="flex items-center gap-6">
                  <span className="text-primary font-mono text-sm w-24">{activity.time}</span>
                  <span className="font-bold">{activity.title}</span>
                  <span className="text-sm text-slate-400">{activity.category}</span>
                </div>
                <button onClick={() => handleDeleteActivity(activity.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-accent-red">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {selectedDay.activities.length === 0 && (
              <div className="text-center py-12 text-slate-500 italic">Aucune activité pour ce jour.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 italic bg-[#111] border border-white/5 rounded-2xl">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucun jour de programme sélectionné</p>
          <p className="text-sm">Sélectionnez un jour ci-dessus pour gérer ses activités</p>
        </div>
      )}
    </div>
  );
}
