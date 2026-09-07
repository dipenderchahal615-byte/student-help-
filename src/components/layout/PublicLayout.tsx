import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Menu, X, ArrowRight, UserCircle, LogOut, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../lib/ThemeContext';

export default function PublicLayout() {
  const { user, signIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (signOut) {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Failed to log out', error);
      }
    }
  };

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Blog', path: '/blog' },
    { label: 'Study', path: '/study' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'Career', path: '/career' },
    { label: 'Resources', path: '/resources' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Public Navbar - Premium Dark Style */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 transition-all shadow-lg shadow-slate-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-blue-400 transition-colors shadow-sm">
              SH
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">StudentHelp</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Smart Digital Companion</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-10 font-medium text-slate-300 text-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`hover:text-white transform hover:scale-105 transition-all duration-300 ${location.pathname === link.path ? 'text-blue-400 font-bold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors" title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="px-5 py-2.5 text-slate-300 font-bold hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors focus:outline-none">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 shadow-sm flex items-center justify-center text-blue-400 font-bold">
                        {user.email?.charAt(0).toUpperCase() || 'S'}
                      </div>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-3 border-b border-slate-800 mb-2">
                      <p className="text-sm font-bold text-white truncate">{user.displayName || 'Student'}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <UserCircle size={18} /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <SettingsIcon size={18} /> Settings
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors mt-1">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2.5 text-slate-300 font-bold hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-sm flex items-center gap-2 hover:shadow-blue-500/20">
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors" title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col md:hidden"
            >
                <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xl dark:text-white">Menu</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2 mb-4">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 border border-slate-200 flex items-center justify-center text-blue-700 font-bold">
                          {user.email?.charAt(0).toUpperCase() || 'S'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.displayName || 'Student'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
                    >
                      Dashboard
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/profile" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        <UserCircle size={18} /> Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        <SettingsIcon size={18} /> Settings
                      </Link>
                    </div>
                    <button 
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center w-full px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center w-full px-6 py-4 bg-slate-900 text-white font-bold rounded-xl"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                SH
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white leading-none">StudentHelp</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Smart Digital Companion</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Everything Students Need. In One Place. Study smarter, build your career, create your resume and use powerful AI tools.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link to="/ai-tools" className="hover:text-blue-400 transition-colors">AI Tools</Link></li>
              <li><Link to="/study" className="hover:text-blue-400 transition-colors">Study</Link></li>
              <li><Link to="/resume" className="hover:text-blue-400 transition-colors">Resume</Link></li>
              <li><Link to="/career" className="hover:text-blue-400 transition-colors">Career</Link></li>
              <li><Link to="/student-tools" className="hover:text-blue-400 transition-colors">Student Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} StudentHelp. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
