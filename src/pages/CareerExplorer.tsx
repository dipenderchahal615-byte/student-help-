import { useState } from 'react';
import { Briefcase, Map, Code, Database, Palette, Shield, LineChart, Cpu, Cloud, PenTool, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const CAREERS = [
  { name: 'Web Development', icon: Code, color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white' },
  { name: 'Data Analytics', icon: LineChart, color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white' },
  { name: 'UI/UX Design', icon: Palette, color: 'text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white' },
  { name: 'Cybersecurity', icon: Shield, color: 'text-rose-600 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white' },
  { name: 'AI & Machine Learning', icon: BrainCircuit, color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white' }, // Wait I need to import BrainCircuit, let's use Cpu
  { name: 'Cloud Computing', icon: Cloud, color: 'text-cyan-600 bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white' },
  { name: 'Software Engineering', icon: Database, color: 'text-slate-600 bg-slate-100 group-hover:bg-slate-600 group-hover:text-white' },
  { name: 'Content Creation', icon: PenTool, color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white' },
];

import { BrainCircuit } from 'lucide-react';

export default function CareerExplorer() {
  return (
    <div className="space-y-8 px-6 py-8 max-w-6xl mx-auto">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Career Explorer</h1>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto">Discover career paths, understand required skills, and navigate your professional journey.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex items-center gap-3">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search for careers (e.g. Data Scientist, Frontend Developer)..." 
          className="flex-1 bg-transparent border-none outline-none text-slate-900 font-medium placeholder:text-slate-400"
        />
        <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {CAREERS.map((career, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-3 ${career.color}`}>
              <career.icon size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">{career.name}</h3>
            <p className="text-sm text-slate-500 mb-6">Explore the skills, tools, and roadmap to become a professional in {career.name.toLowerCase()}.</p>
            <Link 
              to="/career-roadmap" 
              className="inline-flex items-center justify-center w-full bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-300"
            >
              View Roadmap
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
