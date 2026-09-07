import { useState } from 'react';
import { getInterviewQuestion, evaluateInterviewAnswer } from '../lib/api';
import { MessagesSquare, Loader2, Play, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function InterviewPractice() {
  const [field, setField] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleGenerateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!field.trim()) return;
    
    setLoading(true);
    setError('');
    setQuestion('');
    setAnswer('');
    setFeedback('');
    
    try {
      const res = await getInterviewQuestion(field, level);
      setQuestion(res.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !question) return;
    
    setEvaluating(true);
    setError('');
    setFeedback('');
    
    try {
      const res = await evaluateInterviewAnswer(question, answer);
      setFeedback(res.text);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 space-y-8">
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <MessagesSquare size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Practice</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Get AI-generated questions and personalized feedback.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleGenerateQuestion} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Career Field</label>
            <input 
              type="text"
              placeholder="e.g. Software Engineering, Marketing"
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm font-medium transition-all"
              value={field}
              onChange={e => setField(e.target.value)}
              required
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Experience Level</label>
            <select 
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm font-medium text-slate-700 transition-all"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner / Student</option>
              <option value="Internship">Internship</option>
              <option value="Junior">Junior</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading || !field}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Get Question'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {question && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white border border-blue-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-blue-50 p-5 border-b border-blue-100 flex items-center gap-2 font-bold text-blue-800">
              <Play size={18} /> Question
            </div>
            <div className="p-6 md:p-8 text-lg font-medium text-slate-800">
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
          </div>

          {!feedback ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <form onSubmit={handleSubmitAnswer}>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Your Answer</label>
                <textarea 
                  rows={6}
                  placeholder="Type your answer here as if you are speaking in an interview..."
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 mb-6 font-medium transition-all"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={evaluating || !answer}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    {evaluating ? <Loader2 size={18} className="animate-spin" /> : 'Submit for Feedback'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-emerald-50 p-5 border-b border-emerald-100 flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle size={18} /> Feedback & Evaluation
              </div>
              <div className="p-6 md:p-8 prose prose-slate max-w-none w-full markdown-body">
                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm font-medium">
                  <span className="font-bold text-slate-900 block mb-2">Your Answer:</span>
                  {answer}
                </div>
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

    </div>
  );
}
