import { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, ExternalLink, Calendar, MapPin, Building, Trash2 } from 'lucide-react';
import { db, JobApplication } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../lib/AuthContext';

const STATUS_COLORS = {
  Saved: 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Interview: 'bg-purple-50 text-purple-700 border-purple-200',
  Selected: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200'
};

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('Saved');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const data = await db.applications.getAll();
        setJobs(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchJobs();
  }, [user]);

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !company || !user) return;

    const newJob: JobApplication = {
      id: uuidv4(),
      userId: user.uid,
      role,
      company,
      location,
      link,
      status,
      appliedDate: status === 'Applied' ? Date.now() : undefined
    };

    try {
      await db.applications.save(newJob);
      setJobs([newJob, ...jobs]);
      setShowForm(false);
      setRole(''); setCompany(''); setLocation(''); setLink(''); setStatus('Saved');
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: string, newStatus: JobApplication['status']) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    
    const updatedJob = { ...job, status: newStatus };
    try {
      await db.applications.save(updatedJob);
      setJobs(jobs.map(j => j.id === id ? updatedJob : j));
    } catch(e) {
      console.error(e);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await db.applications.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Job Tracker</h1>
          <p className="text-slate-500 mt-1">Manage your internship and job applications.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Plus size={18}/> Add Job
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Track New Application</h2>
          <form onSubmit={handleSaveJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Job Role (e.g. Frontend Developer Intern)" required value={role} onChange={e=>setRole(e.target.value)} className="p-3 border rounded-xl" />
            <input type="text" placeholder="Company Name" required value={company} onChange={e=>setCompany(e.target.value)} className="p-3 border rounded-xl" />
            <input type="text" placeholder="Location (e.g. Remote, Bangalore)" value={location} onChange={e=>setLocation(e.target.value)} className="p-3 border rounded-xl" />
            <input type="url" placeholder="Job Link" value={link} onChange={e=>setLink(e.target.value)} className="p-3 border rounded-xl" />
            
            <select value={status} onChange={e=>setStatus(e.target.value as any)} className="p-3 border rounded-xl bg-white">
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">Save to Tracker</button>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"><Briefcase size={28}/></div>
            <h3 className="font-bold text-slate-700 text-lg">No jobs tracked yet</h3>
            <p className="text-slate-500">Add a job to start tracking your applications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map(job => (
              <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{job.role}</h3>
                    {job.link && (
                      <a href={job.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                        <ExternalLink size={16}/>
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Building size={16}/> {job.company}</span>
                    {job.location && <span className="flex items-center gap-1.5"><MapPin size={16}/> {job.location}</span>}
                    {job.appliedDate && <span className="flex items-center gap-1.5"><Calendar size={16}/> Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    value={job.status} 
                    onChange={e => updateStatus(job.id, e.target.value as any)}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold border outline-none cursor-pointer appearance-none ${STATUS_COLORS[job.status]}`}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  
                  <button onClick={() => deleteJob(job.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
