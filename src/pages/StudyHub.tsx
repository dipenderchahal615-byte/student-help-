import { useState } from 'react';
import { Target, CheckCircle2, Clock, CalendarDays, BookOpen, Plus, Play, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

import { useFocusMode } from '../lib/FocusContext';

const SUBJECTS = [
  { name: 'Computer Networks', progress: 65, pending: 3, nextRevision: 'Today' },
  { name: 'Database Systems', progress: 40, pending: 5, nextRevision: 'Tomorrow' },
  { name: 'Data Structures', progress: 85, pending: 1, nextRevision: 'Friday' },
];

export default function StudyHub() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  
  return (
    <div className="space-y-8 px-6 py-8 max-w-7xl mx-auto">
      <SEO title="Study Hub" description="Manage your study sessions, track subjects, and enter focus mode." />
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Your dedicated academic workspace.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleFocusMode} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Play size={16} /> {isFocusMode ? 'End Focus Session' : 'Start Focus Session'}
          </button>
          <Link to="/study-planner" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} /> Create Study Plan
          </Link>
        </div>
      </div>

      {!isFocusMode && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-1 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Study Streak</div>
          <div className="flex items-end gap-2 mb-1">
            <div className="text-4xl font-black text-orange-600 leading-none">5</div>
            <div className="text-lg font-bold text-orange-600 mb-1">Days 🔥</div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Keep it up! You're doing great.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-1 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Today's Progress</div>
          <div className="flex items-end gap-2 mb-1">
            <div className="text-4xl font-black text-blue-600 leading-none">2<span className="text-slate-300 text-3xl">/5</span></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tasks completed today</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl shadow-lg md:col-span-2 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Upcoming Exam</div>
            <div className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Midterms: Computer Networks</div>
            <p className="text-sm text-slate-400 font-medium">In 12 days • Covering Chapters 1-4</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">View Details</button>
          </div>
          <CalendarDays size={80} className="text-slate-800 absolute right-4 bottom-4 transform rotate-12" />
        </div>
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={isFocusMode ? "lg:col-span-3 space-y-6" : "lg:col-span-2 space-y-6"}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Subjects</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBJECTS.map((sub, i) => {
              const colors = ['text-blue-600 bg-blue-50', 'text-indigo-600 bg-indigo-50', 'text-violet-600 bg-violet-50'];
              const barColors = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600'];
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[i % colors.length]}`}>
                      <BookOpen size={22} />
                    </div>
                    <button className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-lg"><MoreVertical size={16} /></button>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 truncate group-hover:text-slate-800 transition-colors">{sub.name}</h3>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-3">
                    <span>{sub.pending} tasks pending</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Revise: {sub.nextRevision}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${barColors[i % barColors.length]} h-2 rounded-full transition-all duration-1000`} style={{ width: `${sub.progress}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isFocusMode && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Today's Tasks</h2>
            <button className="text-slate-400 hover:text-slate-600"><Plus size={20}/></button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3">
            {[
              { title: 'Read Chapter 3: Routing', time: '45 mins', done: true },
              { title: 'Complete DB Assignment', time: '1 hr', done: true },
              { title: 'Revise Graph Algorithms', time: '30 mins', done: false },
              { title: 'Practice SQL Queries', time: '45 mins', done: false },
            ].map((task, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${task.done ? 'opacity-60' : 'hover:bg-slate-50'}`}>
                <button className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'}`}>
                  <CheckCircle2 size={16} />
                </button>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-900'}`}>{task.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium"><Clock size={12}/> {task.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
