import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { db, UpcomingExam } from '../../lib/db';

export function ExamCountdown() {
  const [exams, setExams] = useState<UpcomingExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', subject: '', date: '', time: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const data = await db.exams.getAll();
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setExams(data);
    } catch (e) {
      console.error(e);
      setError('Unable to load exams.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (!newExam.name || !newExam.subject || !newExam.date) {
        throw new Error('Please fill all required fields.');
      }
      const exam: UpcomingExam = {
        ...newExam,
        id: crypto.randomUUID(),
        userId: '',
        createdAt: Date.now()
      };
      await db.exams.save(exam);
      await loadExams();
      setShowAdd(false);
      setNewExam({ name: '', subject: '', date: '', time: '', description: '' });
    } catch (e: any) {
      setError(e.message || 'Unable to save your exam. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.exams.delete(id);
      await loadExams();
    } catch (e) {
      setError('Unable to delete exam.');
    }
  };

  const calculateRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateStr);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Completed', color: 'text-slate-500' };
    if (diffDays === 0) return { text: 'Today', color: 'text-red-600' };
    if (diffDays === 1) return { text: '1 Day', color: 'text-orange-600' };
    return { text: `${diffDays} Days`, color: 'text-blue-600' };
  };

  if (loading) return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[200px]">
      <div className="animate-spin text-blue-600"><Clock size={24}/></div>
    </div>
  );

  const nearestExam = exams.find(e => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(e.date) >= today;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" /> Upcoming Exams
        </h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
        >
          <Plus size={14}/> Add
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 flex items-center gap-2">
          <AlertCircle size={14}/> {error}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exam Name</label>
            <input required type="text" value={newExam.name} onChange={e=>setNewExam({...newExam, name: e.target.value})} className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Final Examination" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
            <input required type="text" value={newExam.subject} onChange={e=>setNewExam({...newExam, subject: e.target.value})} className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mathematics" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <input required type="date" value={newExam.date} onChange={e=>setNewExam({...newExam, date: e.target.value})} className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time (Opt)</label>
              <input type="time" value={newExam.time} onChange={e=>setNewExam({...newExam, time: e.target.value})} className="w-full text-sm border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-lg mt-2">Save Exam</button>
        </form>
      )}

      {exams.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Calendar size={32} className="text-slate-200 mb-2"/>
          <p className="text-sm font-medium text-slate-500">No upcoming exams</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {nearestExam && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Clock size={100} />
              </div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{nearestExam.subject}</p>
              <h4 className="font-bold text-lg leading-tight mb-4">{nearestExam.name}</h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">{new Date(nearestExam.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} {nearestExam.time && `• ${nearestExam.time}`}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black ${calculateRemaining(nearestExam.date).color === 'text-red-600' ? 'text-red-400' : 'text-white'}`}>{calculateRemaining(nearestExam.date).text}</span>
                  {calculateRemaining(nearestExam.date).text.includes('Days') && <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining</span>}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {exams.filter(e => e.id !== nearestExam?.id).map(exam => {
              const rem = calculateRemaining(exam.date);
              return (
                <div key={exam.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{exam.subject}</p>
                    <h5 className="font-bold text-sm text-slate-900 truncate">{exam.name}</h5>
                    <p className="text-xs text-slate-500">{new Date(exam.date).toLocaleDateString()} {exam.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 ${rem.color}`}>{rem.text}</span>
                    <button onClick={() => handleDelete(exam.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
