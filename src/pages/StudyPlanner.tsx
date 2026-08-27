import { useState, useEffect } from 'react';
import { db, StudyPlan } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Circle, Clock, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function StudyPlanner() {
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    course: '',
    subjects: '',
    examDate: '',
    hoursPerDay: 4,
    weakSubjects: '',
    strongSubjects: ''
  });

  const fetchPlans = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    const p = await db.studyPlans.getAll();
    setPlans(p);
    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPlans();
    }
  }, [user, authLoading]);

  const generateTasks = (form: typeof formData) => {
    // Simple heuristic algorithm for generating a mock schedule
    const subjects = form.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const weak = form.weakSubjects.split(',').map(s => s.trim()).filter(Boolean);
    
    const tasks = [];
    const today = new Date();
    
    // Generate tasks for the next 7 days
    for (let day = 0; day < 7; day++) {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + day);
      
      let dailyHours = form.hoursPerDay;
      const subPerDay = Math.min(subjects.length, Math.ceil(dailyHours / 1.5)); // max 1.5h per block
      
      for(let i=0; i<subPerDay; i++) {
        // give preference to weak subjects slightly
        const sub = (day % 2 === 0 && weak.length > 0) 
            ? weak[i % weak.length] 
            : subjects[(day + i) % subjects.length];
            
        if (!sub) continue;
        
        tasks.push({
          id: uuidv4(),
          title: `Study Chapter ${day + 1} of ${sub}`,
          subject: sub,
          date: taskDate.toISOString().split('T')[0],
          duration: Math.floor((dailyHours / subPerDay) * 60),
          completed: false
        });
      }
    }
    return tasks;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newPlan: StudyPlan = {
      id: uuidv4(),
      userId: user.uid,
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()),
      weakSubjects: formData.weakSubjects.split(',').map(s => s.trim()),
      strongSubjects: formData.strongSubjects.split(',').map(s => s.trim()),
      tasks: generateTasks(formData),
      createdAt: Date.now()
    };
    await db.studyPlans.save(newPlan);
    fetchPlans();
    setIsCreating(false);
  };

  const toggleTask = async (planId: string, taskId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const task = plan.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    await db.studyPlans.save(plan);
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    await db.studyPlans.delete(id);
    fetchPlans();
  };

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
        <p className="text-slate-500 max-w-md">Please sign in to create and manage study plans.</p>
      </div>
    );
  }

  const activePlan = plans[plans.length - 1];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Planner</h1>
          <p className="text-slate-500 mt-1">Organize your daily and weekly study routines.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> New Plan
          </button>
        )}
      </div>

      {isCreating ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Create Study Plan</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Class / Course</label>
                <input required type="text" placeholder="e.g., B.Tech 3rd Year" className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Exam Date</label>
                <input required type="date" className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Subjects (comma separated)</label>
                <input required type="text" placeholder="Maths, Physics, CS" className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Weak Subjects</label>
                <input type="text" placeholder="Physics" className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.weakSubjects} onChange={e => setFormData({...formData, weakSubjects: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Daily Study Hours</label>
                <input required type="number" min="1" max="16" className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formData.hoursPerDay} onChange={e => setFormData({...formData, hoursPerDay: parseInt(e.target.value) || 4})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors">Generate Plan</button>
            </div>
          </form>
        </motion.div>
      ) : activePlan ? (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activePlan.course}</h2>
              <p className="text-slate-500 mt-1">Target: {new Date(activePlan.examDate).toLocaleDateString()} • {activePlan.hoursPerDay}hrs/day</p>
            </div>
            <button onClick={() => deletePlan(activePlan.id)} className="text-red-600 bg-red-50 p-2.5 rounded-xl hover:bg-red-100 flex items-center justify-center transition-colors">
              <Trash2 size={20} />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Today's Tasks</h3>
            <div className="grid gap-3">
              {activePlan.tasks.filter(t => t.date === todayStr).length === 0 && (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-slate-500">No tasks scheduled for today.</div>
              )}
              {activePlan.tasks.filter(t => t.date === todayStr).map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(activePlan.id, task.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    task.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-blue-100 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <button className={`${task.completed ? 'text-green-500' : 'text-slate-300'}`}>
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>{task.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{task.subject}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {task.duration} mins</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-400">Upcoming This Week</h3>
            <div className="grid gap-3 opacity-70">
              {activePlan.tasks.filter(t => t.date !== todayStr).slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-700">{task.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {new Date(task.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})} • {task.subject}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-12">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Study Plan Yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Create a personalized daily schedule based on your subjects, exam date, and available time.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Create My First Plan
          </button>
        </div>
      )}
    </div>
  );
}
