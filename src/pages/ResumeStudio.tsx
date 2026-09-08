import { Link } from 'react-router-dom';
import { FileText, Plus, Copy, Trash2, Edit2, Download, Eye } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function ResumeStudio() {
  return (
    <div className="space-y-8 px-6 py-8 max-w-6xl mx-auto">
      <SEO title="Resume Studio" description="Manage your resumes and portfolios, create ATS-friendly templates, and prepare for job applications." />
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resume Studio</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your resumes and portfolios.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/portfolio-builder" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Eye size={16} /> Portfolio Builder
          </Link>
          <Link to="/resume-builder" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Create Resume
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Resume Card */}
        <Link to="/resume-builder" className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-slate-100 hover:border-blue-400 transition-all text-slate-500 hover:text-blue-600 min-h-[300px] group shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
            <Plus size={32} />
          </div>
          <h3 className="font-bold text-lg text-slate-700 group-hover:text-blue-700 transition-colors">Create New Resume</h3>
          <p className="text-sm mt-2 text-center text-slate-400">Start from scratch or use an ATS-friendly template</p>
        </Link>

        {/* Existing Resume 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[300px]">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Updated Yesterday</span>
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-1 tracking-tight">Software Engineer 2024</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">Modern Template • 1 Page</p>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 mt-auto">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">90% Complete</p>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            <Link to="/resume-builder" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <Edit2 size={16} /> Edit
            </Link>
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Download">
              <Download size={18} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Duplicate">
              <Copy size={18} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
