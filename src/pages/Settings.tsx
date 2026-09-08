import { Moon, Sun, Bell, Globe, Shield, Database } from 'lucide-react';
import { useState } from 'react';
import { SEO } from '../components/SEO';

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEO title="Settings" description="Manage your application preferences, appearance, and account settings." />
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold">Appearance</button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">Notifications</button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">Language & Region</button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">Privacy</button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">Data Management</button>
        </div>

        <div className="md:col-span-2 space-y-8">
          {/* Appearance */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Sun size={20} className="text-amber-500" /> Appearance
            </h2>
            <p className="text-sm text-slate-500 mb-4">Customize how the application looks on this device.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
              >
                <Sun size={24} />
                <span className="font-bold">Light Mode</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
              >
                <Moon size={24} />
                <span className="font-bold">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Bell size={20} className="text-purple-500" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Push Notifications</h3>
                  <p className="text-sm text-slate-500">Receive alerts for study sessions and deadlines.</p>
                </div>
                <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div>
                  <h3 className="font-bold text-slate-800">Email Digests</h3>
                  <p className="text-sm text-slate-500">Weekly progress reports and recommendations.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-slate-300 relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-0.5"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Shield size={20} className="text-green-500" /> Privacy & Data
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Export My Data</h3>
                  <p className="text-sm text-slate-500">Download a copy of your notes and resumes.</p>
                </div>
                <Database size={20} className="text-slate-400" />
              </button>
              <button className="w-full text-left p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                <h3 className="font-bold text-red-700">Delete Account</h3>
                <p className="text-sm text-red-600/80">Permanently remove all your data and account.</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
