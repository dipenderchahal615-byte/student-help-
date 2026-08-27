import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  Map, 
  MessagesSquare, 
  Calculator,
  Library,
  LayoutDashboard,
  Menu,
  X,
  UserCircle,
  Search,
  LogOut,
  Briefcase,
  User,
  GraduationCap,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../lib/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { path: '/', label: 'Home', icon: BookOpen },
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Study & Learn',
    items: [
      { path: '/study-hub', label: 'Study Hub', icon: GraduationCap },
      { path: '/study-planner', label: 'Planner', icon: BookOpen },
      { path: '/ai-notes', label: 'Notes Studio', icon: FileText },
      { path: '/ai-chat', label: 'AI Assistant', icon: Sparkles },
    ]
  },
  {
    title: 'Career & Jobs',
    items: [
      { path: '/career-roadmap', label: 'Roadmap', icon: Map },
      { path: '/resume-builder', label: 'Resume', icon: FileText },
      { path: '/portfolio', label: 'Portfolio', icon: User },
      { path: '/interview-practice', label: 'Interview', icon: MessagesSquare },
      { path: '/jobs', label: 'Jobs', icon: Briefcase },
    ]
  },
  {
    title: 'Utilities',
    items: [
      { path: '/tools', label: 'Tools', icon: Calculator },
      { path: '/resources', label: 'Resources', icon: Library },
      { path: '/profile', label: 'Profile', icon: UserCircle },
    ]
  }
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shadow-sm fixed top-0 bottom-0 z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              SH
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">StudentHelp</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">Smart Digital Helper</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium",
                        isActive 
                          ? "bg-blue-50 text-blue-700" 
                          : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {isActive && <div className="absolute left-4 w-1 h-5 bg-blue-600 rounded-full" />}
                      <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-500"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white text-center">
            <p className="text-xs opacity-70">Prep for Exams</p>
            <p className="text-sm font-semibold mt-1">Upgrade to Premium</p>
            <button className="w-full mt-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
              Get Access
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <BrainCircuit size={20} />
          </div>
          <span className="font-bold text-lg">StudentHelp</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-xl z-50 flex flex-col md:hidden"
            >
              <div className="p-4 flex justify-end">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {NAV_GROUPS.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="px-4 text-xs font-bold text-slate-400 mb-2">{group.title}</h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-base font-medium",
                              isActive 
                                ? "bg-blue-50 text-blue-700" 
                                : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="p-6 border-t border-slate-100">
                {user ? (
                  <button onClick={signOut} className="flex items-center justify-center gap-3 w-full bg-slate-100 text-slate-900 px-4 py-3.5 rounded-xl font-medium hover:bg-slate-200">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button onClick={signIn} className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white px-4 py-3.5 rounded-xl font-medium">
                    <UserCircle size={20} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search tools and resources..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{user.displayName || 'Student'}</p>
                  <p className="text-xs text-slate-500 truncate w-32">{user.email}</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <button onClick={signOut} className="text-slate-400 hover:text-red-500 ml-2" title="Sign Out">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={signIn} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
                <UserCircle size={18} /> Sign In
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
