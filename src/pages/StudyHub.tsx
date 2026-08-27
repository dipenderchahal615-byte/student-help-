import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { db, StudyTask, StudyPlan } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../lib/AuthContext';

export default function StudyHub() {
  const { user } = useAuth();
  
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  // Task State
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here if possible
      alert(mode === 'work' ? 'Time for a break!' : 'Back to work!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const plans = await db.studyPlans.getAll();
      if (plans.length > 0) {
        const plan = plans[plans.length - 1]; // latest plan
        setActivePlanId(plan.id);
        const todayStr = new Date().toISOString().split('T')[0];
        setTasks(plan.tasks.filter(t => t.date === todayStr));
      }
    };
    fetchTasks();
  }, [user]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activePlanId || !user) return;
    
    const newTask: StudyTask = {
      id: uuidv4(),
      title: newTaskTitle,
      subject: 'General',
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskTitle('');
    
    try {
      const plans = await db.studyPlans.getAll();
      const plan = plans.find(p => p.id === activePlanId);
      if (plan) {
        plan.tasks = [...plan.tasks, newTask];
        await db.studyPlans.save(plan);
      }
    } catch (err) {
      console.error("Failed to save task to plan:", err);
    }
  };

  const toggleTask = async (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    
    const task = newTasks.find(t => t.id === id);
    if (task && task.completed) {
      db.gamification.addXP(50);
    }

    if (activePlanId && user) {
      try {
        const plans = await db.studyPlans.getAll();
        const plan = plans.find(p => p.id === activePlanId);
        if (plan) {
          plan.tasks = plan.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
          await db.studyPlans.save(plan);
        }
      } catch (err) {
        console.error("Failed to update task completion in plan:", err);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Hub</h1>
        <p className="text-slate-500 mt-1">Stay focused and manage your daily study tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pomodoro Timer */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              onClick={() => switchMode('work')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'work' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
            >
              Focus
            </button>
            <button 
              onClick={() => switchMode('break')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'break' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
            >
              Break
            </button>
          </div>
          
          <div className="text-8xl font-black text-slate-900 tracking-tighter mb-8 font-mono">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Today's Tasks</h2>
          
          <form onSubmit={addTask} className="flex gap-3 mb-6">
            <input 
              type="text"
              placeholder="What do you need to study?"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button type="submit" className="px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold flex items-center gap-2">
              <Plus size={20} /> Add
            </button>
          </form>

          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No tasks for today. Add some to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${task.completed ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200'}`}>
                  <button onClick={() => toggleTask(task.id)} className={`shrink-0 ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}>
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.subject}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
