import { useState, useEffect } from 'react';
import { db, StudyPlan, SavedNote, CareerRoadmap, User as DBUser, UpcomingExam, DailyGoal } from '../lib/db';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  BookOpen, BrainCircuit, Map, Trash2, ArrowRight, Loader2, AlertCircle,
  Trophy, Flame, Target, CalendarDays, Plus, Briefcase, FileText, Sparkles, MessagesSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_STUDY_DATA = [
  { day: 'Mon', hours: 2.5, completed: 3 },
  { day: 'Tue', hours: 3.8, completed: 5 },
  { day: 'Wed', hours: 1.5, completed: 2 },
  { day: 'Thu', hours: 4.2, completed: 6 },
  { day: 'Fri', hours: 3.0, completed: 4 },
  { day: 'Sat', hours: 5.5, completed: 8 },
  { day: 'Sun', hours: 4.0, completed: 5 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }
    try {
      setDataLoading(true);
      const [u, p, n, r, e, g] = await Promise.all([
        db.user.get(),
        db.studyPlans.getAll(),
        db.notes.getAll(),
        db.roadmaps.getAll(),
        db.exams.getAll(),
        db.dailyGoals.getAll()
      ]);
      setDbUser(u);
      setPlans(p);
      setNotes(n);
      setRoadmaps(r);
      
      // Sort exams to find the nearest
      const validExams = e.filter(ex => new Date(ex.date) >= new Date(new Date().setHours(0,0,0,0)));
      validExams.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setExams(validExams);

      // Filter today's goals
      const todayStr = new Date().toISOString().split('T')[0];
      setGoals(g.filter(goal => goal.date === todayStr));
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

  const nearestExam = exams[0];
  let daysToExam = '--';
  if (nearestExam) {
    const diffTime = new Date(nearestExam.date).getTime() - new Date(new Date().setHours(0,0,0,0)).getTime();
    daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
  }

  const completedGoalsCount = goals.filter(g => g.completed).length;
  const totalGoalsCount = goals.length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 space-y-10">
      <SEO title="Student Dashboard" description="Track your study plans, career roadmap, saved notes and exam schedule on your personalized student dashboard." />
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>}
      
      {/* Header & 4-Card Layout */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Good morning, {user.displayName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 text-lg">Here's your progress for today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Study Progress */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><Trophy size={20}/></div>
               <div className="font-bold text-slate-700">Study Progress</div>
             </div>
             <div className="flex items-end gap-2 mb-2">
               <span className="text-3xl font-black text-slate-900">{level}</span>
               <span className="text-sm font-medium text-slate-500 mb-1">Lvl</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressToNextLevel}%` }}></div>
             </div>
             <div className="text-xs text-slate-500 mt-2 text-right">{xp} / {nextLevelXP} XP</div>
          </div>
          
          {/* Study Streak */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600"><Flame size={20}/></div>
               <div className="font-bold text-slate-700">Study Streak</div>
             </div>
             <div className="flex items-end gap-2 mt-2">
               <span className="text-3xl font-black text-slate-900">{streak}</span>
               <span className="text-sm font-medium text-slate-500 mb-1">Days</span>
             </div>
          </div>

          {/* Tasks */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600"><Target size={20}/></div>
               <div className="font-bold text-slate-700">Today's Tasks</div>
             </div>
             <div className="flex items-end gap-2 mt-2">
               <span className="text-3xl font-black text-slate-900">{completedGoalsCount}/{totalGoalsCount}</span>
               <span className="text-sm font-medium text-slate-500 mb-1">Done</span>
             </div>
          </div>

          {/* Upcoming Exam */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600"><CalendarDays size={20}/></div>
               <div className="font-bold text-slate-700">Upcoming Exam</div>
             </div>
             <div className="flex items-end gap-2 mt-2">
               <span className="text-3xl font-black text-slate-900">{daysToExam}</span>
               <span className="text-sm font-medium text-slate-500 mb-1">Days</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Daily Goals & Exams */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
          <DailyGoals />
          <ExamCountdown />
        </div>
        
        {/* Right Col: Quick Actions & Stats */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Ask AI', tooltip: 'Ask StudentHelp AI for study help', icon: Sparkles, color: 'text-violet-600 bg-violet-50 hover:bg-violet-600 hover:text-white', path: '/ai-assistant' },
                { label: 'Create Notes', tooltip: 'Create and organize AI-powered study notes', icon: BrainCircuit, color: 'text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-600 hover:text-white', path: '/notes' },
                { label: 'Plan Study', tooltip: 'Create a personalized study plan', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white', path: '/study-planner' },
                { label: 'Build Resume', tooltip: 'Create or edit your professional student resume', icon: FileText, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white', path: '/resume-builder' },
                { label: 'Career Roadmap', tooltip: 'Explore skills and build your career roadmap', icon: Map, color: 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white', path: '/career-roadmap' },
                { label: 'Practice Interview', tooltip: 'Practice interview questions with AI', icon: MessagesSquare, color: 'text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white', path: '/interview-practice' }
              ].map((action, i) => (
                <Link key={i} to={action.path} aria-label={action.tooltip} className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-slate-200 ${action.color} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 outline-none`}>
                  <action.icon size={22} className="mb-2 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs font-bold text-center">{action.label}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] text-center px-3 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-visible:opacity-100 group-focus-visible:visible transition-all z-10 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900 shadow-xl" role="tooltip">
                    {action.tooltip}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg text-white">
            <h2 className="font-bold flex items-center gap-2 mb-4 text-lg"><Map size={20} className="text-blue-400"/> Career Progress</h2>
            {roadmaps.length === 0 ? (
              <div className="bg-slate-800 p-6 rounded-2xl text-center border border-slate-700">
                <p className="text-slate-400 text-sm mb-4">Start planning your future career path.</p>
                <Link to="/career" className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                  Explore Careers
                </Link>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {roadmaps.slice(0, 3).map(rm => (
                  <div key={rm.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <h3 className="font-bold text-sm text-slate-200 truncate mb-2">{rm.career}</h3>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                ))}
                <Link to="/career" className="block text-center mt-4 text-sm font-bold text-blue-400 hover:text-blue-300">
                  View Full Roadmap
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Weekly Study Progress</h2>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Hours Studied</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Tasks Completed</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_STUDY_DATA} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Full-width Recent Notes Bottom Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 text-xl"><BrainCircuit size={22} className="text-blue-600"/> Recent Notes & Activity</h2>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg">{notes.length} saved</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 col-span-full border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <p className="text-slate-500 text-sm font-medium">No saved notes.</p>
            </div>
          ) : (
            notes.slice(0, 4).map(note => (
              <div key={note.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-slate-300 hover:shadow-md transition-all group flex justify-between items-start">
                <div className="truncate pr-4">
                  <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{note.topic}</h3>
                  <p className="text-xs text-slate-500 capitalize font-medium">{note.type.replace('_', ' ')}</p>
                </div>
                <button onClick={() => handleDeleteNote(note.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        {notes.length > 0 && (
          <div className="mt-6 text-center">
            <Link to="/notes" className="inline-flex items-center justify-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-6 py-2.5 rounded-xl transition-colors">
              View All Notes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
