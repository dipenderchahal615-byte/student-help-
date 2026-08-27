import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  GraduationCap,
  Sparkles,
  FileText,
  Briefcase,
  Calculator,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Map,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const FEATURES = [
  { path: '/study-hub', label: 'Study Hub', icon: GraduationCap, color: 'bg-blue-100 text-blue-600', desc: 'Daily planners, focus modes & progress tracking.' },
  { path: '/ai-chat', label: 'AI Assistant', icon: Sparkles, color: 'bg-purple-100 text-purple-600', desc: 'Ask questions, simplify concepts & get answers.' },
  { path: '/resume-builder', label: 'Resume Builder', icon: FileText, color: 'bg-green-100 text-green-600', desc: 'Create professional, ATS-friendly resumes.' },
  { path: '/jobs', label: 'Job Tracker', icon: Briefcase, color: 'bg-amber-100 text-amber-600', desc: 'Manage internships, applications & interviews.' },
  { path: '/ai-notes', label: 'Notes Studio', icon: BrainCircuit, color: 'bg-indigo-100 text-indigo-600', desc: 'Generate revision summaries and flashcards.' },
  { path: '/tools', label: 'Student Tools', icon: Calculator, color: 'bg-rose-100 text-rose-600', desc: 'CGPA calculators, word counters & quick tools.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-32 md:pb-32 border-b border-slate-100 bg-slate-50">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold mb-6 border border-blue-200/50"
          >
            <Sparkles size={16} />
            <span>Student Super App</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Everything Students Need.<br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">In One Place.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Study smarter, build your career, create your resume and use powerful AI tools from one comprehensive student platform.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to={user ? "/dashboard" : "/study-hub"}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              Start Learning <ArrowRight size={20} />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Explore Tools
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium"
          >
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> No credit card required</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Secure Cloud Sync</div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Powerful Student Tools</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to excel in academics and launch your career seamlessly.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={feature.path} className="block group h-full">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-200 h-full flex flex-col relative overflow-hidden">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.label}
                    </h3>
                    <p className="text-slate-600 mb-6 flex-1 leading-relaxed">
                      {feature.desc}
                    </p>
                    <div className="flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      Explore feature <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Unified Platform Preview */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Your Personal <br/><span className="text-blue-400">AI Student Assistant</span></h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Get unstuck instantly. Ask questions, generate study plans, simplify complex topics, and create revision flashcards with our state-of-the-art AI assistant tailored for students.
            </p>
            <ul className="space-y-4 mb-8">
              {['Concept Explanations & Summaries', 'Instant Revision Notes Generation', 'Multi-language Support (English, Hindi)'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/ai-chat" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors">
              Try AI Assistant <Sparkles size={18}/>
            </Link>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><Sparkles size={20}/></div>
                <div>
                  <h4 className="text-white font-bold">StudentHelp AI</h4>
                  <p className="text-xs text-slate-400">Always online</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-sm w-5/6">
                  Explain the concept of React Hooks in simple terms.
                </div>
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm w-11/12 self-end ml-auto">
                  Think of React Hooks as special functions that let you "hook into" React features...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Built for the Modern Student</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">10x</div>
              <div className="text-slate-900 font-bold mb-1">Faster Planning</div>
              <div className="text-sm text-slate-500">Generate study roadmaps instantly.</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">3+</div>
              <div className="text-slate-900 font-bold mb-1">ATS Resume Formats</div>
              <div className="text-sm text-slate-500">Stand out in your placements.</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">24/7</div>
              <div className="text-slate-900 font-bold mb-1">AI Support</div>
              <div className="text-sm text-slate-500">Never get stuck on a topic again.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SH</div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">StudentHelp</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} StudentHelp. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
