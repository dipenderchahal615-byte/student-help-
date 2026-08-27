import React, { useState } from 'react';
import { Calculator, Percent, Clock, Hash } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentTools() {
  const [activeTool, setActiveTool] = useState('percentage');
  
  // States for tools
  const [pctValues, setPctValues] = useState({ obtained: '', total: '' });
  const [cgpaValues, setCgpaValues] = useState({ credits: '', grades: '' });
  const [textVal, setTextVal] = useState('');

  const renderTool = () => {
    switch (activeTool) {
      case 'percentage':
        const pct = pctValues.total ? (Number(pctValues.obtained) / Number(pctValues.total)) * 100 : 0;
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Percentage Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Marks Obtained</label>
                <input type="number" className="w-full p-4 border border-slate-200 bg-slate-50 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" value={pctValues.obtained} onChange={e=>setPctValues({...pctValues, obtained: e.target.value})}/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Total Marks</label>
                <input type="number" className="w-full p-4 border border-slate-200 bg-slate-50 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" value={pctValues.total} onChange={e=>setPctValues({...pctValues, total: e.target.value})}/>
              </div>
            </div>
            <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <span className="text-sm font-bold text-blue-800 block uppercase tracking-wider mb-1">Result</span>
              <span className="text-5xl font-black text-blue-600 tracking-tight">{!isFinite(pct) || isNaN(pct) ? '0' : pct.toFixed(2)}%</span>
            </div>
          </div>
        );
      
      case 'cgpa':
        return (
          <div className="space-y-4 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calculator size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-800">CGPA Calculator</h3>
            <p className="text-slate-500 mb-4">Calculate your semester CGPA based on credits and grades.</p>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
              Coming Soon
            </div>
          </div>
        );

      case 'wordcount':
        const words = textVal.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = textVal.length;
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Word Counter</h3>
            <textarea 
              rows={8}
              className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              placeholder="Paste your essay, assignment, or text here..."
              value={textVal}
              onChange={e=>setTextVal(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span className="text-sm font-bold text-slate-500 block uppercase tracking-wider mb-1">Words</span>
                <span className="text-4xl font-black text-blue-600">{words}</span>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span className="text-sm font-bold text-slate-500 block uppercase tracking-wider mb-1">Characters</span>
                <span className="text-4xl font-black text-blue-600">{chars}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Tools</h1>
        <p className="text-slate-500 mt-1">Helpful calculators and utilities for students.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-3 shrink-0">
          <button 
            onClick={() => setActiveTool('percentage')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTool === 'percentage' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Percent size={20} /> Percentage
          </button>
          <button 
            onClick={() => setActiveTool('cgpa')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTool === 'cgpa' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Calculator size={20} /> CGPA Calculator
          </button>
          <button 
            onClick={() => setActiveTool('wordcount')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTool === 'wordcount' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Hash size={20} /> Word Counter
          </button>
          <button 
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-400 opacity-60 cursor-not-allowed font-bold"
          >
            <div className="flex items-center gap-3">
              <Clock size={20} /> Attendance
            </div>
            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">Soon</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderTool()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
