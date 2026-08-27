import { useState } from 'react';
import { generateRoadmap } from '../lib/api';
import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Map, Loader2, Save, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../lib/AuthContext';

const CAREER_EXAMPLES = [
  'Digital Marketing', 'Web Development', 'Graphic Design', 
  'Data Analytics', 'AI', 'Cybersecurity'
];

export default function CareerRoadmap() {
  const { user } = useAuth();
  const [career, setCareer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!career.trim()) return;
    
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const res = await generateRoadmap(career);
      setResult(res.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await db.roadmaps.save({
        id: uuidv4(),
        userId: '',
        career,
        content: result,
        createdAt: Date.now()
      });
      alert('Roadmap saved to dashboard!');
    } catch (e) {
      alert('Please sign in to save roadmaps.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 flex flex-col lg:flex-row gap-8 items-start">
      
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Map size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Career Roadmap</h1>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Target Career or Skill</label>
            <input 
              type="text"
              placeholder="e.g. Data Analytics"
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
              value={career}
              onChange={e => setCareer(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Popular Examples</label>
            <div className="flex flex-wrap gap-2">
              {CAREER_EXAMPLES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setCareer(ex)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !career}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-3 rounded-xl text-xs font-bold transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-2/3">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}
        
        {loading && !result && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 size={40} className="animate-spin text-amber-600 mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Mapping out your learning journey...</p>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Navigation size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Ready to plan your future?</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Enter a career or skill and we'll generate a step-by-step roadmap from beginner to advanced.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 p-4 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Your Learning Roadmap</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
            <div className="p-6 md:p-8 prose prose-slate max-w-none w-full markdown-body">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
