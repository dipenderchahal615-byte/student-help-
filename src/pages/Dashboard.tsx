import { useState, useEffect } from 'react';
import { db, StudyPlan, SavedNote, CareerRoadmap, User as DBUser } from '../lib/db';
import { Link } from 'react-router-dom';
import { 
  BookOpen, BrainCircuit, Map, Trash2, ArrowRight, Loader2, AlertCircle,
  Trophy, Flame, Target, CalendarDays, Plus, Briefcase, FileText, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }
    try {
      setDataLoading(true);
      const [u, p, n, r] = await Promise.all([
        db.user.get(),
        db.studyPlans.getAll(),
        db.notes.getAll(),
        db.roadmaps.getAll()
      ]);
      setDbUser(u);
      setPlans(p);
      setNotes(n);
      setRoadmaps(r);
    } catch (e) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleDeleteNote = async (id: string) => {
    try {
      await db.notes.delete(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
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
      <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
        <p className="text-slate-500 max-w-md">Please sign in to access your gamified dashboard, saved notes, study plans, and career roadmaps.</p>
      </div>
    );
  }

  const activePlan = plans[plans.length - 1];
  const todayStr = new Date().toISOString().split('T')[0];
  
  let totalTasks = 0;
  let completedTasks = 0;

  if (activePlan) {
    totalTasks = activePlan.tasks.length;
    completedTasks = activePlan.tasks.filter(t => t.completed).length;
  }

  const xp = dbUser?.xp || 0;
  const level = dbUser?.level || 1;
  const streak = dbUser?.streak || 0;
  const nextLevelXP = level * 1000;
  const progressToNextLevel = Math.round((xp / nextLevelXP) * 100);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 space-y-10">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>}
      
      {/* Header & Gamification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back, {user.displayName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 text-lg">Let's make today productive.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-orange-50 border border-orange-100 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Flame size={20}/></div>
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-0.5">Day Streak</div>
              <div className="text-xl font-black text-orange-900 leading-none">{streak}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm min-w-[160px]">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Trophy size={20}/></div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Level {level}</span>
                <span className="text-xs font-bold text-blue-800">{xp} XP</span>
              </div>
              <div className="w-full bg-blue-200/50 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progressToNextLevel}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Ask AI', icon: Sparkles, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', path: '/ai-chat' },
            { label: 'Create Notes', icon: BrainCircuit, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100', path: '/ai-notes' },
            { label: 'Plan Study', icon: BookOpen, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', path: '/study-hub' },
            { label: 'Build Resume', icon: FileText, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100', path: '/resume-builder' },
            { label: 'Job Tracker', icon: Briefcase, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100', path: '/jobs' },
          ].map((action, i) => (
            <Link key={i} to={action.path} className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-colors ${action.color}`}>
              <action.icon size={24} className="mb-2" />
              <span className="text-sm font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Study Plan & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Target size={22} className="text-blue-500"/> Today's Goals</h2>
              <Link to="/study-hub" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">Open Hub <ArrowRight size={16}/></Link>
            </div>
            
            {activePlan ? (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-6">{activePlan.course} • {completedTasks}/{totalTasks} total tasks completed</p>
                <div className="space-y-3">
                  {activePlan.tasks.filter(t => t.date === todayStr).length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500 font-medium">No tasks scheduled for today.</p>
                      <Link to="/study-hub" className="text-blue-600 text-sm font-bold mt-2 inline-block">Add tasks</Link>
                    </div>
                  )}
                  {activePlan.tasks.filter(t => t.date === todayStr).map((task, i) => {
                    const colors = ['bg-blue-500', 'bg-orange-400', 'bg-emerald-400', 'bg-purple-500'];
                    const dotColor = colors[i % colors.length];
                    return (
                      <div key={task.id} className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 transition-colors rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0`}></div>
                        <div className="flex-1">
                          <p className={`text-base font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>{task.title}</p>
                          <p className="text-sm text-slate-500">{task.duration} mins • {task.subject}</p>
                        </div>
                        <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${task.completed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {task.completed ? 'Done' : 'Pending'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CalendarDays size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-4">You haven't set up a study plan yet.</p>
                <Link to="/study-planner" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                  <Plus size={18} /> Create Plan
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Stats & Notes */}
        <div className="space-y-8">
          
          {/* AI Notes Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><BrainCircuit size={20} className="text-purple-500"/> Recent Notes</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{notes.length} saved</span>
            </div>
            
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm">No saved notes.</p>
                </div>
              ) : (
                notes.slice(0, 4).map(note => (
                  <div key={note.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors group flex justify-between items-center">
                    <div className="truncate pr-4">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{note.topic}</h4>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">{note.type.replace('_', ' ')}</p>
                    </div>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {notes.length > 0 && (
              <Link to="/ai-notes" className="block text-center text-sm font-bold text-blue-600 mt-4 hover:underline">View All Notes</Link>
            )}
          </div>

          {/* Career Roadmaps Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg text-white">
            <h2 className="font-bold flex items-center gap-2 mb-4"><Map size={20} className="text-amber-400"/> Career Roadmaps</h2>
            {roadmaps.length === 0 ? (
              <p className="text-slate-400 text-sm mb-6">Start planning your future career path.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {roadmaps.slice(0, 2).map(rm => (
                  <div key={rm.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-sm truncate">{rm.career}</h4>
                  </div>
                ))}
              </div>
            )}
            <Link to="/career-roadmap" className="inline-flex items-center justify-center w-full bg-white text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Explore Careers
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
