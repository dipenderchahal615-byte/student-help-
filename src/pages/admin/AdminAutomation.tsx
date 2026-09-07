import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Play, RefreshCw, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { blogDb, AutomationSettings, AutomationRun } from '../../lib/blog-db';

export default function AdminAutomation() {
  const [settings, setSettings] = useState<AutomationSettings>({
    id: 'main',
    enabled: true,
    scheduleTime: '07:00 PM',
    timezone: 'Asia/Kolkata',
    autoPublish: false,
    defaultLanguage: 'English',
    defaultCategory: 'Education',
    defaultTone: 'Professional',
    defaultLength: 'Medium',
    targetAudience: 'Students',
    topicPreferences: 'General Student Advice',
    primaryTopics: 'Study tips, Exam preparation, Career guidance, Student productivity, AI tools for students, Digital skills',
    excludeTopics: 'Politics, Religion'
  });
  
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const s = await blogDb.settings.get();
    if (s) setSettings(s);
    const r = await blogDb.automationRuns.getAll();
    setRuns(r);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    await blogDb.settings.save(settings);
    setSaving(false);
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRunNow = async () => {
    setRunning(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/automation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setMessage('Automation executed successfully!');
        await fetchData(); // refresh runs
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Failed to run'}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
    setRunning(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading automation settings...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Automation Settings</h1>
          <p className="text-slate-500">Configure the daily 7:00 PM IST AI blog generation.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRunNow} disabled={running} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70">
            {running ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} />}
            {running ? 'Running...' : 'Run Now'}
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70">
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Master Switch</h3>
                <p className="text-sm text-slate-500">Enable or disable daily AI generation.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.enabled} onChange={e => setSettings({...settings, enabled: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Auto Publish</h3>
                <p className="text-sm text-slate-500">If disabled, blogs are saved as Drafts for manual review.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.autoPublish} onChange={e => setSettings({...settings, autoPublish: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Default Category</label>
                <input type="text" value={settings.defaultCategory} onChange={e => setSettings({...settings, defaultCategory: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Language</label>
                <input type="text" value={settings.defaultLanguage} onChange={e => setSettings({...settings, defaultLanguage: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tone</label>
                <input type="text" value={settings.defaultTone} onChange={e => setSettings({...settings, defaultTone: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Length</label>
                <input type="text" value={settings.defaultLength} onChange={e => setSettings({...settings, defaultLength: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                <input type="text" value={settings.targetAudience} onChange={e => setSettings({...settings, targetAudience: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Topics (Comma separated)</label>
                <textarea rows={3} value={settings.primaryTopics} onChange={e => setSettings({...settings, primaryTopics: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={18} /> Schedule Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Execution Time</p>
                <p className="font-bold">{settings.scheduleTime}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Timezone</p>
                <p className="font-bold">{settings.timezone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Frequency</p>
                <p className="font-bold">Daily</p>
              </div>
            </div>
            <div className="mt-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-200">
              The automated job runs purely on the server independent of active browser sessions.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Automation Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {runs.map(run => (
                <div key={run.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">{new Date(run.startedAt).toLocaleString()}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${run.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {run.status}
                    </span>
                  </div>
                  {run.errorMessage && <p className="text-xs text-red-500 mt-1">{run.errorMessage}</p>}
                </div>
              ))}
              {runs.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No logs available.</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
