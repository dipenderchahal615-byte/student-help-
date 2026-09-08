import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  GraduationCap, Sparkles, FileText, Briefcase, 
  BrainCircuit, Calculator, MessageSquare, BookOpen,
  ArrowRight
} from 'lucide-react';

const FEATURE_CATEGORIES = [
  {
    title: 'Study Productivity',
    icon: GraduationCap,
    color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
    desc: 'Daily planners, focus modes & progress tracking to ace your exams.',
    path: '/study'
  },
  {
    title: 'AI Tools',
    icon: Sparkles,
    color: 'text-violet-600 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white',
    desc: 'A complete marketplace of AI-powered student tools.',
    path: '/ai-tools'
  },
  {
    title: 'Notes Studio',
    icon: BrainCircuit,
    color: 'text-fuchsia-600 bg-fuchsia-50 group-hover:bg-fuchsia-600 group-hover:text-white',
    desc: 'Generate revision summaries and flashcards using advanced AI.',
    path: '/notes'
  },
  {
    title: 'Resume Studio',
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white',
    desc: 'Create professional, ATS-friendly resumes and stunning portfolios.',
    path: '/resume'
  },
  {
    title: 'Career Explorer',
    icon: Briefcase,
    color: 'text-sky-600 bg-sky-50 group-hover:bg-sky-600 group-hover:text-white',
    desc: 'Plan your career path, track job applications & discover roles.',
    path: '/career'
  },
  {
    title: 'Interview Lab',
    icon: MessageSquare,
    color: 'text-rose-600 bg-rose-50 group-hover:bg-rose-600 group-hover:text-white',
    desc: 'Practice interviews with our simulator and get instant feedback.',
    path: '/interview'
  },
  {
    title: 'Student Utilities',
    icon: Calculator,
    color: 'text-cyan-600 bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white',
    desc: 'CGPA calculators, word counters, and quick everyday student tools.',
    path: '/student-tools'
  },
  {
    title: 'Resource Center',
    icon: BookOpen,
    color: 'text-orange-600 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white',
    desc: 'Discover verified study materials and guides.',
    path: '/resources'
  }
];

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SEO title="Features" description="Explore our comprehensive suite of tools designed to help you study smarter, land jobs, and ace your academics." />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Platform Features</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Explore our comprehensive suite of tools designed to help you study smarter, land jobs, and ace your academics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FEATURE_CATEGORIES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                <Icon size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                {feature.title}
              </h2>
              <p className="text-slate-600 mb-8 flex-1 text-sm leading-relaxed">
                {feature.desc}
              </p>
              <Link 
                to={feature.path}
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold py-3 rounded-xl transition-all duration-300 text-sm"
              >
                Open Tool <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
