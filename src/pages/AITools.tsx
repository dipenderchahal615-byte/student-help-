import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Bot, BrainCircuit, PenTool, Sparkles, 
  CalendarDays, AlignLeft, Briefcase, MessageSquare, ArrowRight
} from 'lucide-react';

const AI_TOOLS = [
  {
    title: 'AI Student Assistant',
    icon: Bot,
    desc: 'Chat with an advanced AI trained to explain academic concepts simply.',
    path: '/ai-assistant',
    color: 'text-violet-600 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Notes Studio',
    icon: BrainCircuit,
    desc: 'Generate perfect revision notes, flashcards, and summaries instantly.',
    path: '/notes',
    color: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Quiz Generator',
    icon: PenTool,
    desc: 'Test your knowledge by generating customized MCQs on any topic.',
    path: '/notes', // Integrates with notes studio
    color: 'text-fuchsia-600 bg-fuchsia-50 group-hover:bg-fuchsia-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Study Planner',
    icon: CalendarDays,
    desc: 'Let AI build an optimal study schedule based on your exams.',
    path: '/study-planner',
    color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Summarizer',
    icon: AlignLeft,
    desc: 'Paste long articles or lectures and get concise, readable summaries.',
    path: '/notes',
    color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Career Helper',
    icon: Briefcase,
    desc: 'Get tailored career advice, roadmap suggestions, and job matching.',
    path: '/career-roadmap',
    color: 'text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white border-transparent'
  },
  {
    title: 'AI Interview Coach',
    icon: MessageSquare,
    desc: 'Practice technical and HR interviews with real-time AI feedback.',
    path: '/interview-practice',
    color: 'text-sky-600 bg-sky-50 group-hover:bg-sky-600 group-hover:text-white border-transparent'
  }
];

export default function AITools() {
  return (
    <div className="space-y-8 px-6 py-8 max-w-6xl mx-auto">
      <SEO title="AI Tools" description="A marketplace of powerful AI tools designed for students to improve learning, writing, and career preparation." />
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">AI Tools Marketplace</h1>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto">Supercharge your learning with our suite of intelligent academic tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_TOOLS.map((tool, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-3 ${tool.color}`}>
              <tool.icon size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">{tool.title}</h3>
            <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">{tool.desc}</p>
            <Link 
              to={tool.path}
              className="inline-flex items-center justify-between w-full px-4 py-3 bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white rounded-xl font-bold text-sm transition-all duration-300"
            >
              Use Tool <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
