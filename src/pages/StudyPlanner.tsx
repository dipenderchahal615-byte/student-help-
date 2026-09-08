import { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Trash2, Edit2, Play, ChevronRight, Save, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { generateStudyPlan } from '../lib/api';
import { db } from '../lib/db';
import { useAuth } from '../lib/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';

interface Task {
  title: string;
  subject: string;
  duration: number;
}

interface DayPlan {
  day: string;
  hours: number;
  tasks: Task[];
}

export default function StudyPlanner() {
  const { user } = useAuth();
  
  // Form State
  const [course, setCourse] = useState('');
  const [subjects, setSubjects] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hours, setHours] = useState('');
  const [weakSubjects, setWeakSubjects] = useState('');
  const [time, setTime] = useState('Morning (6AM - 12PM)');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<DayPlan[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = { course, subjects, examDate, hours, weakSubjects, time };
      const result = await generateStudyPlan(data);
      if (result.plan && Array.isArray(result.plan)) {
        setPlan(result.plan);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;
    try {
      // Flatten tasks to save to DB format if needed, or save as JSON.
      // The DB schema for StudyPlan expects tasks with { id, title, subject, duration, date, completed }
      const tasksToSave = plan.flatMap(dayPlan => {
        // approximate date based on day of week starting from next monday...
        // For simplicity, we just save them sequentially for the next 7 days
        return dayPlan.tasks.map(t => ({
          id: uuidv4(),
          title: t.title,
          subject: t.subject,
          duration: t.duration,
          date: new Date().toISOString().split('T')[0], // Placeholder date
          completed: false
        }));
      });
      
      await db.studyPlans.save({
        id: uuidv4(),
        userId: '', // populated by db wrapper
        course,
        subjects: subjects.split(',').map(s => s.trim()),
        examDate,
        hoursPerDay: parseInt(hours) || 4,
        weakSubjects: weakSubjects.split(',').map(s => s.trim()),
        strongSubjects: [],
        createdAt: Date.now(),
        tasks: tasksToSave
      });
      alert('Plan saved successfully!');
    } catch (err) {
      alert('Sign in to save plans.');
    }
  };

  return (
    <div className="space-y-8 px-6 py-8 h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto">
      <SEO title="Study Planner Generator" description="Create personalized study schedules tailored to your exams and weak subjects using AI." />
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Planner</h1>
          <p className="text-slate-500 font-medium mt-1">Generate a structured study schedule.</p>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex items-center gap-2 text-sm font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">1</div>
            <span className="hidden sm:inline">Details</span>
          </div>
          <div className="w-4 h-px bg-slate-300"></div>
          <div className={`flex items-center gap-2 ${loading ? 'text-blue-600' : (plan ? 'text-blue-600' : 'text-slate-400')}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${loading || plan ? 'bg-blue-100' : 'bg-slate-100'}`}>2</div>
            <span className="hidden sm:inline">Generate</span>
          </div>
          <div className="w-4 h-px bg-slate-300"></div>
          <div className={`flex items-center gap-2 ${plan ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan ? 'bg-emerald-100' : 'bg-slate-100'}`}>3</div>
            <span className="hidden sm:inline">Review & Save</span>
          </div>
        </div>

        {plan && (
          <div className="flex gap-3">
            <button onClick={() => setPlan(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Save size={16} /> Save Plan
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2 font-medium text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* LEFT: Input Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-y-auto custom-scrollbar">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl">
            <CalendarIcon size={24} className="text-blue-600" /> Plan Details
          </h2>
          <form className="space-y-6" onSubmit={handleGenerate}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Course / Major</label>
              <input required type="text" value={course} onChange={e=>setCourse(e.target.value)} placeholder="e.g. Computer Science B.Tech" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subjects to Cover</label>
              <textarea required value={subjects} onChange={e=>setSubjects(e.target.value)} placeholder="Networking, OS, Databases" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Exam Date</label>
                <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Daily Hours</label>
                <input required type="number" min="1" max="24" value={hours} onChange={e=>setHours(e.target.value)} placeholder="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Weak Subjects (Need more time)</label>
              <input type="text" value={weakSubjects} onChange={e=>setWeakSubjects(e.target.value)} placeholder="e.g. Operating Systems" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Study Time</label>
              <select value={time} onChange={e=>setTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700">
                <option>Morning (6AM - 12PM)</option>
                <option>Afternoon (12PM - 5PM)</option>
                <option>Evening (5PM - 10PM)</option>
                <option>Night Owl (10PM - 3AM)</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-colors mt-6 shadow-sm flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18}/>}
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </form>
        </div>

        {/* RIGHT: Generated Schedule */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8">
               <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
               <h3 className="text-xl font-bold text-slate-900">Designing your perfect plan...</h3>
               <p className="text-sm text-slate-500 mt-2">Analyzing your subjects and available hours.</p>
             </div>
          ) : !plan ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center text-blue-500 mb-6">
                <CalendarIcon size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Plan Generated</h3>
              <p className="text-slate-500 max-w-sm text-base">Fill out your details on the left and click "Generate Plan" to create your structured study schedule.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-2xl tracking-tight">Your Weekly Schedule</h2>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Generated by AI</span>
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {plan.map((dayPlan, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={dayPlan.day} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <span className="text-xs font-bold">{dayPlan.day.slice(0,3)}</span>
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 text-lg">{dayPlan.day}</h3>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{dayPlan.hours} Hours</span>
                      </div>
                      <div className="space-y-3">
                        {dayPlan.tasks.map((task, j) => (
                          <div key={j} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-colors group/task border border-transparent hover:border-slate-100">
                            <button className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-transparent hover:border-emerald-500 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={12} />
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">{task.title}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                <Clock size={12} className="text-slate-400"/> {task.duration} mins 
                                <span className="mx-1">•</span> 
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600">{task.subject}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
