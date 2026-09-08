import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { 
  GraduationCap,
  Sparkles,
  FileText,
  Briefcase,
  Calculator,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000",
    title: "Your Ultimate Student Workspace.",
    subtitle: "Study smarter, build your career, create your resume and get help with powerful AI tools."
  },
  {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2000",
    title: "AI-Powered Learning.",
    subtitle: "Ask questions, simplify concepts & get smart revision notes instantly."
  },
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
    title: "Build Your Career.",
    subtitle: "Create professional, ATS-friendly resumes and plan your job applications."
  }
];

const FEATURES = [
  { path: '/study', label: 'Study Productivity', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white', desc: 'Daily planners, focus modes & progress tracking to ace your exams.' },
  { path: '/ai-tools', label: 'AI-Powered Learning', icon: Sparkles, color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white', desc: 'Ask questions, simplify concepts & get smart revision notes instantly.' },
  { path: '/resume', label: 'Resume & Portfolio', icon: FileText, color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white', desc: 'Create professional, ATS-friendly resumes and stunning portfolios.' },
  { path: '/career', label: 'Career Roadmap', icon: Briefcase, color: 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white', desc: 'Plan your career path, track job applications & practice interviews.' },
  { path: '/notes', label: 'Notes Studio', icon: BrainCircuit, color: 'bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white', desc: 'Generate revision summaries and flashcards using advanced AI.' },
  { path: '/student-tools', label: 'Student Utilities', icon: Calculator, color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white', desc: 'CGPA calculators, word counters, and quick everyday student tools.' },
];

export default function Home() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  return (
    <div className="bg-white min-h-screen">
      <SEO title="StudentHelp - Smart Digital Companion" description="Your all-in-one student workspace with AI tools, study planners, resume builders, and more." />
      
      {/* Hero Section Carousel */}
      <section className="relative overflow-hidden bg-slate-900 h-screen min-h-[600px] flex items-center justify-center pt-16 -mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-slate-900/70 z-10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
            <img src={HERO_SLIDES[currentSlide].image} alt="Hero Background" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-200 border border-blue-500/30 rounded-full text-sm font-bold tracking-wide uppercase mb-8 backdrop-blur-sm"
          >
            <Sparkles size={16} /> STUDENT SUPER WEBSITE
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.h1 
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg"
            >
              {HERO_SLIDES[currentSlide].title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p 
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              {HERO_SLIDES[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
            <Link 
              to="/features"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>

        {/* Slider Controls */}
        <div className="absolute z-20 bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
            {HERO_SLIDES.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-blue-500 w-10' : 'bg-white/40 hover:bg-white/70 w-2.5'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-20 mb-24 hidden md:block">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-slate-200 bg-white shadow-2xl p-2 overflow-hidden flex flex-col md:flex-row h-96"
        >
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-4">
             <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">SH</div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 leading-none">StudentHelp</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Smart Companion</span>
                </div>
             </div>
             <div className="space-y-2">
               <Link to="/dashboard" className="block bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-200 transition-colors cursor-pointer"><LayoutDashboard size={16}/> Dashboard</Link>
               <Link to="/study" className="block text-slate-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer"><GraduationCap size={16}/> Study Hub</Link>
               <Link to="/ai-assistant" className="block text-slate-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer"><BrainCircuit size={16}/> AI Assistant</Link>
               <Link to="/resume" className="block text-slate-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer"><FileText size={16}/> Resume</Link>
             </div>
          </div>
          <div className="flex-1 p-8 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold">Welcome back, Alex!</h3>
              <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">Level 4 Scholar</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500 mb-1">Study Streak</div>
                <div className="text-2xl font-black text-orange-500">5 Days 🔥</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500 mb-1">Total XP</div>
                <div className="text-2xl font-black text-blue-600">1,240 ⭐️</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500 mb-1">Pending Tasks</div>
                <div className="text-2xl font-black text-slate-800">4</div>
              </div>
            </div>
            <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><CheckCircle2 size={16} className="text-blue-600"/></div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-blue-600 rounded-full"></div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><CheckCircle2 size={16} className="text-orange-600"/></div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-orange-500 rounded-full"></div></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Powerful Student Tools</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to excel in academics and launch your career seamlessly.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={feature.path} className="block group h-full">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-slate-300 h-full flex flex-col relative overflow-hidden">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
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

      {/* How it Works / Benefits */}
      <section className="bg-slate-900 py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Your Personal <br/><span className="text-blue-400">AI Student Assistant</span></h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Get unstuck instantly. Ask questions, generate study plans, simplify complex topics, and create revision flashcards with our state-of-the-art AI assistant tailored for students.
            </p>
            <ul className="space-y-4 mb-8">
              {['Concept Explanations & Summaries', 'Instant Revision Notes Generation', 'Intelligent Career Roadmapping'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
              Try AI Assistant <Sparkles size={18}/>
            </Link>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"><Sparkles size={20}/></div>
                <div>
                  <h3 className="text-white font-bold text-lg">StudentHelp AI</h3>
                  <p className="text-sm text-slate-400">Always online & ready to help</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-700 text-slate-200 p-5 rounded-2xl rounded-tl-sm text-base w-5/6 shadow-inner">
                  Explain the concept of React Hooks in simple terms.
                </div>
                <div className="bg-blue-600 text-white p-5 rounded-2xl rounded-tr-sm text-base w-11/12 self-end ml-auto shadow-md">
                  Think of React Hooks as special functions that let you "hook into" React features without writing a class component. They help you manage state and side-effects elegantly...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16 tracking-tight">Built for the Modern Student</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-blue-600 mb-4">10x</div>
              <div className="text-slate-900 font-bold text-lg mb-2">Faster Planning</div>
              <div className="text-sm text-slate-500">Generate study roadmaps instantly.</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-green-600 mb-4">3+</div>
              <div className="text-slate-900 font-bold text-lg mb-2">ATS Formats</div>
              <div className="text-sm text-slate-500">Stand out in your placements.</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-purple-600 mb-4">24/7</div>
              <div className="text-slate-900 font-bold text-lg mb-2">AI Support</div>
              <div className="text-sm text-slate-500">Never get stuck on a topic again.</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-amber-600 mb-4">100%</div>
              <div className="text-slate-900 font-bold text-lg mb-2">Secure</div>
              <div className="text-sm text-slate-500">Your data is private and encrypted.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to transform your student life?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join StudentHelp today and get instant access to study planners, AI tools, resume builders, and career resources.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-xl font-black text-lg hover:bg-slate-50 transition-all shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95"
          >
            Go to Dashboard <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
