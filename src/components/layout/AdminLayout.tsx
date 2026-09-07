import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Bot, List, Tag, Image, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { auth, signOut } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'All Posts', path: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'AI Blog Generator', path: '/admin/ai-blog', icon: <Bot size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <List size={20} /> },
    { name: 'Tags', path: '/admin/tags', icon: <Tag size={20} /> },
    { name: 'Media Library', path: '/admin/media', icon: <Image size={20} /> },
    { name: 'Automation', path: '/admin/automation', icon: <Settings size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-900 text-white w-64">
      <div className="p-6">
        <Link to="/admin" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">A</span>
          </div>
          AdminPanel
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-4">Management</div>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white transition-all font-medium">
          <ArrowLeft size={20} /> Back to App
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all font-medium text-left">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full shadow-xl z-20">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between z-10">
          <div className="font-black text-slate-800 text-xl">AdminPanel</div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
