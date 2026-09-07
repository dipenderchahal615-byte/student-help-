import { useState, useRef, useEffect } from 'react';
import { db, ResumeData } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Download, Printer, Save, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../lib/AuthContext';

const DEFAULT_RESUME: ResumeData = {
  id: 'default',
  userId: 'local',
  personal: { name: '', email: '', phone: '', address: '', linkedin: '', github: '' },
  objective: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  lastUpdated: Date.now()
};

export default function ResumeBuilder() {
  const { user, loading: authLoading } = useAuth();
  const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeStyle, setResumeStyle] = useState<'classic' | 'modern' | 'minimal'>('modern');
  const [dataLoading, setDataLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const fetchResume = async () => {
    if (!user) {
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    try {
      const resumes = await db.resumes.getAll();
      if (resumes.length > 0) {
        setResume(resumes[0]);
      } else {
        setResume({ ...DEFAULT_RESUME, id: uuidv4(), userId: user.uid });
      }
    } catch (e) {
      console.error("Error fetching resume:", e);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchResume();
    }
  }, [user, authLoading]);

  const save = async () => {
    if (!user) return;
    const data = { ...resume, lastUpdated: Date.now() };
    await db.resumes.save(data);
    setResume(data);
    alert('Resume saved!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resume.personal.name || 'Student'}_Resume.pdf`);
  };

  const addField = (field: 'education' | 'experience' | 'projects' | 'certificates') => {
    const newItems: any = { id: uuidv4() };
    if (field === 'education') newItems.degree = '';
    setResume({ ...resume, [field]: [...resume[field], newItems] });
  };

  const removeField = (field: 'education' | 'experience' | 'projects' | 'certificates', id: string) => {
    setResume({ ...resume, [field]: resume[field].filter((i: any) => i.id !== id) });
  };

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
        <p className="text-slate-500 max-w-md">Please sign in to build and save your professional resume.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24 flex flex-col gap-6">
      
      {/* Progress Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 overflow-x-auto hide-scrollbar">
          {['personal', 'objective', 'education', 'skills', 'experience', 'projects', 'certificates'].map((tab, idx, arr) => {
            const isActive = activeTab === tab;
            const isCompleted = arr.indexOf(tab) < arr.indexOf(activeTab);
            return (
              <div key={tab} className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 font-bold text-sm transition-colors ${
                  isActive ? 'text-blue-600' : (isCompleted ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600')
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : (
                      isCompleted ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-400'
                    )
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="capitalize">{tab}</span>
                </button>
                {idx < arr.length - 1 && <div className="w-8 h-px bg-slate-200 ml-3"></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Editor Side */}
        <div className="w-full xl:w-1/2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[800px] print:hidden">
          
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" value={resume.personal.name} onChange={e=>setResume({...resume, personal: {...resume.personal, name: e.target.value}})} />
              <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" value={resume.personal.email} onChange={e=>setResume({...resume, personal: {...resume.personal, email: e.target.value}})} />
              <input type="text" placeholder="Phone" className="w-full p-3 border rounded-xl" value={resume.personal.phone} onChange={e=>setResume({...resume, personal: {...resume.personal, phone: e.target.value}})} />
              <input type="text" placeholder="Address / Location" className="w-full p-3 border rounded-xl" value={resume.personal.address} onChange={e=>setResume({...resume, personal: {...resume.personal, address: e.target.value}})} />
              <input type="text" placeholder="LinkedIn URL" className="w-full p-3 border rounded-xl" value={resume.personal.linkedin} onChange={e=>setResume({...resume, personal: {...resume.personal, linkedin: e.target.value}})} />
              <input type="text" placeholder="GitHub URL" className="w-full p-3 border rounded-xl" value={resume.personal.github} onChange={e=>setResume({...resume, personal: {...resume.personal, github: e.target.value}})} />
            </div>
          )}

          {activeTab === 'objective' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Career Objective</h3>
              <textarea rows={6} placeholder="Briefly describe your career goals..." className="w-full p-3 border rounded-xl" value={resume.objective} onChange={e=>setResume({...resume, objective: e.target.value})} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Skills (comma separated)</h3>
              <textarea rows={4} placeholder="JavaScript, React, Communication..." className="w-full p-3 border rounded-xl" value={resume.skills.join(', ')} onChange={e=>setResume({...resume, skills: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Education</h3>
                <button onClick={() => addField('education')} className="text-green-600 bg-green-50 p-2 rounded-lg hover:bg-green-100"><Plus size={18}/></button>
              </div>
              {resume.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 border rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeField('education', edu.id)} className="absolute top-3 right-3 text-red-500"><Trash2 size={16}/></button>
                  <input type="text" placeholder="Degree / Course" className="w-full p-2 border rounded-lg" value={edu.degree} onChange={e => { const newEdu = [...resume.education]; newEdu[idx].degree = e.target.value; setResume({...resume, education: newEdu}); }} />
                  <input type="text" placeholder="Institution" className="w-full p-2 border rounded-lg" value={edu.institution} onChange={e => { const newEdu = [...resume.education]; newEdu[idx].institution = e.target.value; setResume({...resume, education: newEdu}); }} />
                  <div className="flex gap-3">
                    <input type="text" placeholder="Year (e.g. 2021-2025)" className="w-1/2 p-2 border rounded-lg" value={edu.year} onChange={e => { const newEdu = [...resume.education]; newEdu[idx].year = e.target.value; setResume({...resume, education: newEdu}); }} />
                    <input type="text" placeholder="Score / CGPA" className="w-1/2 p-2 border rounded-lg" value={edu.score} onChange={e => { const newEdu = [...resume.education]; newEdu[idx].score = e.target.value; setResume({...resume, education: newEdu}); }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Projects</h3>
                <button onClick={() => addField('projects')} className="text-green-600 bg-green-50 p-2 rounded-lg hover:bg-green-100"><Plus size={18}/></button>
              </div>
              {resume.projects.map((proj, idx) => (
                <div key={proj.id} className="p-4 border rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeField('projects', proj.id)} className="absolute top-3 right-3 text-red-500"><Trash2 size={16}/></button>
                  <input type="text" placeholder="Project Title" className="w-full p-2 border rounded-lg" value={proj.title} onChange={e => { const newProj = [...resume.projects]; newProj[idx].title = e.target.value; setResume({...resume, projects: newProj}); }} />
                  <input type="text" placeholder="Link (Optional)" className="w-full p-2 border rounded-lg" value={proj.link} onChange={e => { const newProj = [...resume.projects]; newProj[idx].link = e.target.value; setResume({...resume, projects: newProj}); }} />
                  <textarea placeholder="Description" rows={3} className="w-full p-2 border rounded-lg" value={proj.description} onChange={e => { const newProj = [...resume.projects]; newProj[idx].description = e.target.value; setResume({...resume, projects: newProj}); }} />
                </div>
              ))}
            </div>
          )}
          
          {/* Implement Experience and Certificates similarly for MVP */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Experience / Internships</h3>
                <button onClick={() => addField('experience')} className="text-green-600 bg-green-50 p-2 rounded-lg hover:bg-green-100"><Plus size={18}/></button>
              </div>
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 border rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeField('experience', exp.id)} className="absolute top-3 right-3 text-red-500"><Trash2 size={16}/></button>
                  <input type="text" placeholder="Role / Position" className="w-full p-2 border rounded-lg" value={exp.role} onChange={e => { const newExp = [...resume.experience]; newExp[idx].role = e.target.value; setResume({...resume, experience: newExp}); }} />
                  <input type="text" placeholder="Company / Organization" className="w-full p-2 border rounded-lg" value={exp.company} onChange={e => { const newExp = [...resume.experience]; newExp[idx].company = e.target.value; setResume({...resume, experience: newExp}); }} />
                  <input type="text" placeholder="Duration (e.g. June 2023 - Aug 2023)" className="w-full p-2 border rounded-lg" value={exp.duration} onChange={e => { const newExp = [...resume.experience]; newExp[idx].duration = e.target.value; setResume({...resume, experience: newExp}); }} />
                  <textarea placeholder="Description of your work and achievements" rows={3} className="w-full p-2 border rounded-lg" value={exp.description} onChange={e => { const newExp = [...resume.experience]; newExp[idx].description = e.target.value; setResume({...resume, experience: newExp}); }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Certifications</h3>
                <button onClick={() => addField('certificates')} className="text-green-600 bg-green-50 p-2 rounded-lg hover:bg-green-100"><Plus size={18}/></button>
              </div>
              {resume.certificates.map((cert, idx) => (
                <div key={cert.id} className="p-4 border rounded-xl relative space-y-3 bg-slate-50">
                  <button onClick={() => removeField('certificates', cert.id)} className="absolute top-3 right-3 text-red-500"><Trash2 size={16}/></button>
                  <input type="text" placeholder="Certificate Name" className="w-full p-2 border rounded-lg" value={cert.name} onChange={e => { const newCert = [...resume.certificates]; newCert[idx].name = e.target.value; setResume({...resume, certificates: newCert}); }} />
                  <div className="flex gap-3">
                    <input type="text" placeholder="Issuer (e.g. Coursera)" className="w-1/2 p-2 border rounded-lg" value={cert.issuer} onChange={e => { const newCert = [...resume.certificates]; newCert[idx].issuer = e.target.value; setResume({...resume, certificates: newCert}); }} />
                    <input type="text" placeholder="Year" className="w-1/2 p-2 border rounded-lg" value={cert.year} onChange={e => { const newCert = [...resume.certificates]; newCert[idx].year = e.target.value; setResume({...resume, certificates: newCert}); }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button onClick={save} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"><Save size={18}/> Save Data</button>
          <button onClick={handleDownloadPDF} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"><Download size={18}/> Download PDF</button>
          <button onClick={handlePrint} className="bg-slate-200 hover:bg-slate-300 text-slate-800 p-3 rounded-xl font-medium"><Printer size={18}/></button>
        </div>
      </div>

      {/* Preview Side */}
      <div className="w-full xl:w-1/2 bg-slate-200 rounded-3xl flex flex-col overflow-hidden print:w-full print:bg-white print:block shadow-sm">
        <div className="p-4 bg-white border-b flex justify-between items-center print:hidden">
          <h3 className="font-bold text-slate-800">Live Preview</h3>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {(['classic', 'modern', 'minimal'] as const).map(style => (
              <button
                key={style}
                onClick={() => setResumeStyle(style)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                  resumeStyle === style ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center print:p-0">
          <div 
            ref={previewRef}
            className={`bg-white w-[210mm] min-h-[297mm] shadow-lg p-[20mm] text-slate-800 shrink-0 print:shadow-none print:p-0 ${
              resumeStyle === 'classic' ? 'font-serif' : 
              resumeStyle === 'minimal' ? 'font-mono tracking-tight' : 'font-sans'
            }`}
          >
            {/* Header */}
            <div className={`border-b-2 ${resumeStyle === 'classic' ? 'border-slate-800 border-double' : 'border-slate-300'} pb-6 mb-6`}>
              <h1 className={`text-3xl font-bold uppercase tracking-wider text-slate-900 mb-2 ${resumeStyle === 'minimal' ? 'lowercase tracking-tight text-slate-700' : ''}`}>
                {resumeStyle === 'minimal' ? (resume.personal.name || 'your name').toLowerCase() : (resume.personal.name || 'YOUR NAME')}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {resume.personal.email && <span>{resume.personal.email}</span>}
              {resume.personal.phone && <span>• {resume.personal.phone}</span>}
              {resume.personal.address && <span>• {resume.personal.address}</span>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-600 mt-1">
              {resume.personal.linkedin && <span>{resume.personal.linkedin}</span>}
              {resume.personal.github && <span>• {resume.personal.github}</span>}
            </div>
          </div>

          {/* Objective */}
          {resume.objective && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2 border-b pb-1">Objective</h2>
              <p className="text-sm leading-relaxed">{resume.objective}</p>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1">Education</h2>
              <div className="space-y-4">
                {resume.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{edu.degree || 'Degree Name'}</h3>
                      <p className="text-sm">{edu.institution || 'Institution Name'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{edu.year}</p>
                      {edu.score && <p className="text-sm text-slate-500">{edu.score}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1">Skills</h2>
              <p className="text-sm leading-relaxed">{resume.skills.join(' • ')}</p>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1">Projects</h2>
              <div className="space-y-4">
                {resume.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-800">{proj.title || 'Project Title'}</h3>
                      {proj.link && <span className="text-xs text-blue-600">{proj.link}</span>}
                    </div>
                    <p className="text-sm leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1">Experience</h2>
              <div className="space-y-4">
                {resume.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-800">{exp.role || 'Role'}</h3>
                      <span className="text-sm font-medium">{exp.duration}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mb-1">{exp.company || 'Company'}</div>
                    <p className="text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {resume.certificates.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1">Certifications</h2>
              <ul className="list-disc list-inside space-y-1">
                {resume.certificates.map(cert => (
                  <li key={cert.id} className="text-sm">
                    <span className="font-bold text-slate-800">{cert.name || 'Certificate'}</span>
                    {cert.issuer && <span> — {cert.issuer}</span>}
                    {cert.year && <span> ({cert.year})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
