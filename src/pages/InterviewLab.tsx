import { Link } from 'react-router-dom';
import { MessageSquare, Users, Code, Target, Play, History, Star } from 'lucide-react';

export default function InterviewLab() {
  return (
    <div className="space-y-8 px-6 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Lab</h1>
          <p className="text-slate-500 font-medium mt-1">Practice with AI-powered mock interviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Setup Mock Interview</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Role</label>
                <input type="text" placeholder="e.g. Frontend Developer" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Experience Level</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option>Intern / Fresher</option>
                  <option>Junior (1-3 years)</option>
                  <option>Mid-Level (3-5 years)</option>
                  <option>Senior (5+ years)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Interview Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Technical', icon: Code, active: true },
                  { label: 'Behavioral', icon: Users, active: false },
                  { label: 'HR Round', icon: Target, active: false },
                  { label: 'General', icon: MessageSquare, active: false }
                ].map((type, i) => (
                  <button key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${type.active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}>
                    <type.icon size={24} className="mb-2" />
                    <span className="text-sm font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link to="/interview-practice" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Play fill="currentColor" size={20} /> Start Interview Session
              </Link>
            </div>
          </div>
        </div>

        {/* History / Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 shadow-lg">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-lg"><Star size={20} className="text-amber-400"/> Overall Performance</h3>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-black">7.8</span>
              <span className="text-slate-400 font-medium mb-1 text-lg">/ 10</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
              <div className="bg-amber-400 h-2 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: '78%' }}></div>
            </div>
            <p className="text-sm text-slate-400 font-medium">Based on your last 5 mock interviews.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6 text-lg"><History size={20} className="text-blue-600"/> Previous Sessions</h3>
            <div className="space-y-4">
              {[
                { role: 'Frontend Engineer', type: 'Technical', score: '8.2/10', date: '2 days ago' },
                { role: 'Product Manager', type: 'Behavioral', score: '7.5/10', date: '1 week ago' },
                { role: 'Software Engineer', type: 'HR Round', score: '8.0/10', date: '2 weeks ago' },
              ].map((session, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{session.role}</h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{session.score}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{session.type} • {session.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
