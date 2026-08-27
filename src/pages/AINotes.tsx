import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { generateNotes } from '../lib/api';
import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Save, FileText, Copy, RefreshCw, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

const TYPES = [
  { id: 'Explain', label: 'Explain' },
  { id: 'Short Notes', label: 'Short Notes' },
  { id: 'Important Points', label: 'Important Points' },
  { id: 'Quiz', label: 'Quiz' }
];

export default function AINotes() {
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState('');
  const [difficulty, setDifficulty] = useState('Standard');
  const [language, setLanguage] = useState('English');
  const [selectedType, setSelectedType] = useState(TYPES[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const fetchNotes = async (isRetry = false) => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError('');
    if (!isRetry) setResult('');
    
    try {
      const res = await generateNotes(topic, course, difficulty, language, selectedType);
      setResult(res.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes(false);
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await db.notes.save({
        id: uuidv4(),
        userId: '',
        topic,
        type: selectedType,
        content: result,
        createdAt: Date.now()
      });
      alert('Note saved to dashboard!');
    } catch (e) {
      alert('Please sign in to save notes.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  const handleClear = () => {
    setResult('');
    setTopic('');
    setCourse('');
    setError('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 flex flex-col lg:flex-row gap-8 items-start">
      
      <div className="w-full lg:w-[35%] bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            ✨
          </div>
          <h1 className="text-xl font-bold">AI Smart Notes</h1>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Topic</label>
            <input 
              type="text"
              placeholder="e.g. Newton's Laws"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Class / Course (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. 10th Science"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
              value={course}
              onChange={e => setCourse(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Difficulty</label>
              <select 
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Language</label>
              <select 
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider mt-2">Action</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`text-center px-4 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                    selectedType === type.id 
                      ? 'border-purple-600 bg-purple-50 text-purple-700' 
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !topic}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white py-3 rounded-xl text-xs font-bold transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generate Note'}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-[65%]">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex justify-between items-center">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => fetchNotes(true)} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold transition-colors flex items-center gap-1">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}
        
        {loading && !result && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 size={40} className="animate-spin text-purple-600 mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Reading textbooks and organizing thoughts...</p>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <FileText size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No notes generated yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Enter a topic on the left and choose an action to get AI-powered study material instantly.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-wrap justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800">Generated Notes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => fetchNotes(true)} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  <RefreshCw size={14} /> Retry
                </button>
                <button onClick={handleCopy} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Copy size={14} /> Copy
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                  <Save size={14} /> Save
                </button>
                <button onClick={handleClear} className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 bg-white border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                  <XCircle size={14} /> Clear
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
