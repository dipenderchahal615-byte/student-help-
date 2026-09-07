import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Circle, Trash2, AlertCircle } from 'lucide-react';
import { db, DailyGoal } from '../../lib/db';

export function DailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await db.dailyGoals.getAll();
      const todaysGoals = data.filter(g => g.date === todayStr);
      setGoals(todaysGoals);
    } catch (e) {
      console.error(e);
      setError('Unable to load goals.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError('');
    
    try {
      const goal: DailyGoal = {
        id: crypto.randomUUID(),
        userId: '',
        title: newTitle.trim(),
        date: todayStr,
        completed: false,
        createdAt: Date.now()
      };
      await db.dailyGoals.save(goal);
      setNewTitle('');
      setShowAdd(false);
      await loadGoals();
    } catch (e: any) {
      setError('Unable to save your goal. Please try again.');
    }
  };

  const toggleComplete = async (goal: DailyGoal) => {
    try {
      const updated = { ...goal, completed: !goal.completed };
      // Optimistic update
      setGoals(goals.map(g => g.id === goal.id ? updated : g));
      await db.dailyGoals.save(updated);
    } catch (e) {
      setError('Unable to update goal.');
      await loadGoals(); // revert
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setGoals(goals.filter(g => g.id !== id));
      await db.dailyGoals.delete(id);
    } catch (e) {
      setError('Unable to delete goal.');
      await loadGoals();
    }
  };

  if (loading) return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[200px]">
      <div className="animate-spin text-blue-600"><Target size={24}/></div>
    </div>
  );

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Target size={18} className="text-blue-600" /> Daily Goals
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Your progress for today</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
        >
          <Plus size={14}/> Add
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 flex items-center gap-2">
          <AlertCircle size={14}/> {error}
        </div>
      )}

      {totalCount > 0 && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="24" className="stroke-slate-200" strokeWidth="6" fill="none" />
              <circle cx="28" cy="28" r="24" className="stroke-blue-600 transition-all duration-1000 ease-in-out" strokeWidth="6" fill="none" strokeDasharray={24 * 2 * Math.PI} strokeDashoffset={24 * 2 * Math.PI - (percentage / 100) * 24 * 2 * Math.PI} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{percentage}%</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">{percentage}% Complete</p>
            <p className="text-xs text-slate-500 font-medium">{completedCount} of {totalCount} goals completed</p>
          </div>
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
          <input 
            type="text" 
            autoFocus
            required
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)}
            placeholder="What's your goal today?" 
            className="flex-1 text-sm border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
          />
          <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-4 rounded-xl hover:bg-blue-700 transition-colors">Add</button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {totalCount === 0 && !showAdd ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full">
            <Target size={32} className="text-slate-200 mb-3"/>
            <p className="text-sm font-medium text-slate-500 mb-3">No goals for today</p>
            <button onClick={() => setShowAdd(true)} className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">Add Today's Goal</button>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors group ${goal.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
              <div className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1" onClick={() => toggleComplete(goal)}>
                {goal.completed ? (
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle size={20} className="text-slate-300 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                )}
                <span className={`text-sm font-medium truncate ${goal.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {goal.title}
                </span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(goal.id); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-opacity rounded-lg hover:bg-red-50" aria-label="Delete goal">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
