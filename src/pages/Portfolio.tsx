import { useState, useEffect } from 'react';
import { db, ResumeData, PortfolioData } from '../lib/db';
import { Link2, Globe, ExternalLink, Loader2, Save, PenTool } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function Portfolio() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [theme, setTheme] = useState<'light' | 'dark' | 'colorful'>('light');
  const [slug, setSlug] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [portfolios, resumes] = await Promise.all([
          db.portfolios.getAll(),
          db.resumes.getAll()
        ]);
        
        if (resumes.length > 0) setResume(resumes[0]);
        
        if (portfolios.length > 0) {
          const p = portfolios[0];
          setPortfolio(p);
          setTheme(p.theme);
          setSlug(p.slug);
          setIsPublic(p.isPublic);
        } else {
          // Defaults
          const generatedSlug = user.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || uuidv4().slice(0,8);
          setSlug(generatedSlug);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user || !resume) return;
    setSaving(true);
    try {
      const data: PortfolioData = {
        id: portfolio?.id || uuidv4(),
        userId: user.uid,
        slug,
        theme,
        isPublic,
        resumeId: resume.id,
        createdAt: portfolio?.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      await db.portfolios.save(data);
      setPortfolio(data);
    } catch (e) {
      console.error(e);
      alert('Failed to save portfolio settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  }

  if (!user) {
    return <div className="p-12 text-center">Please sign in to generate your portfolio.</div>;
  }

  if (!resume) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-24 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"><PenTool size={32}/></div>
        <h2 className="text-2xl font-bold text-slate-900">You need a Resume First</h2>
        <p className="text-slate-500 mb-6">Your portfolio is generated automatically from your resume data. Please build your resume first.</p>
        <a href="/resume-builder" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Go to Resume Builder</a>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portfolio Generator</h1>
        <p className="text-slate-500 mt-1">Turn your resume into a beautiful personal website in one click.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Side */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Settings</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Custom Link</label>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="bg-slate-50 px-3 py-3 text-sm text-slate-500 border-r border-slate-200 flex items-center">studenthelp.app/p/</span>
                  <input type="text" value={slug} onChange={e=>setSlug(e.target.value)} className="w-full px-3 py-3 text-sm outline-none font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTheme('light')} className={`p-4 border rounded-xl text-center font-bold transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>Light</button>
                  <button onClick={() => setTheme('dark')} className={`p-4 border rounded-xl text-center font-bold transition-all ${theme === 'dark' ? 'border-blue-600 bg-slate-900 text-white' : 'border-slate-200 bg-slate-900 text-white opacity-50 hover:opacity-100'}`}>Dark</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-bold text-sm">Publish Portfolio</p>
                  <p className="text-xs text-slate-500">Make it visible to everyone</p>
                </div>
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isPublic ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isPublic ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Changes
              </button>
            </div>
          </div>

          {portfolio && portfolio.isPublic && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm text-center">
              <Globe className="text-emerald-500 mx-auto mb-3" size={32}/>
              <h3 className="font-bold text-emerald-800 mb-1">Your Portfolio is Live!</h3>
              <p className="text-sm text-emerald-600 mb-4">Share this link with recruiters.</p>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 truncate">studenthelp.app/p/{portfolio.slug}</span>
                <button onClick={() => navigator.clipboard.writeText(`https://studenthelp.app/p/${portfolio.slug}`)} className="text-blue-600 hover:text-blue-800 p-1"><Link2 size={16}/></button>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Side */}
        <div className="lg:col-span-2">
          <div className="bg-slate-100 rounded-3xl p-2 border border-slate-200 shadow-inner h-[800px] overflow-hidden flex flex-col">
            <div className="bg-white px-4 py-2 flex items-center justify-center border-b shadow-sm gap-2 text-sm text-slate-500 rounded-t-2xl font-mono">
              <ExternalLink size={14}/> studenthelp.app/p/{slug}
            </div>
            
            <div className={`flex-1 overflow-y-auto p-8 md:p-16 transition-colors ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
              <div className="max-w-2xl mx-auto space-y-12">
                
                <header className="text-center space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight">{resume.personal.name || 'Your Name'}</h1>
                  <p className={`text-lg md:text-xl font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {resume.objective || 'Aspiring Student & Professional'}
                  </p>
                  <div className={`flex flex-wrap justify-center gap-4 text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {resume.personal.email && <span>{resume.personal.email}</span>}
                    {resume.personal.github && <span>GitHub</span>}
                    {resume.personal.linkedin && <span>LinkedIn</span>}
                  </div>
                </header>

                {resume.skills.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-2 opacity-80">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map(s => (
                        <span key={s} className={`px-4 py-2 rounded-full text-sm font-bold ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {resume.projects.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-2 opacity-80">Projects</h2>
                    <div className="space-y-8">
                      {resume.projects.map(p => (
                        <div key={p.id} className="space-y-2">
                          <h3 className="text-2xl font-bold">{p.title}</h3>
                          <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{p.description}</p>
                          {p.link && <a href={p.link} className="text-blue-500 font-bold text-sm inline-flex items-center gap-1">View Project <ExternalLink size={14}/></a>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {resume.education.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-2 opacity-80">Education</h2>
                    <div className="space-y-6">
                      {resume.education.map(e => (
                        <div key={e.id} className="flex justify-between items-baseline border-l-2 pl-4 border-slate-300">
                          <div>
                            <h3 className="text-lg font-bold">{e.degree}</h3>
                            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{e.institution}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold opacity-70">{e.year}</span>
                            {e.score && <p className="text-sm opacity-50">{e.score}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
