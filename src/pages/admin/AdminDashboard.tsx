import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, Bot, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { blogDb, BlogPost, AutomationRun } from '../../lib/blog-db';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Mon', views: 4000, visitors: 2400 },
  { name: 'Tue', views: 3000, visitors: 1398 },
  { name: 'Wed', views: 2000, visitors: 9800 },
  { name: 'Thu', views: 2780, visitors: 3908 },
  { name: 'Fri', views: 1890, visitors: 4800 },
  { name: 'Sat', views: 2390, visitors: 3800 },
  { name: 'Sun', views: 3490, visitors: 4300 },
];

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      blogDb.blogs.getAll(),
      blogDb.automationRuns.getAll()
    ]).then(([b, r]) => {
      setBlogs(b);
      setRuns(r);
      setLoading(false);
    });
  }, []);

  const published = blogs.filter(b => b.status === 'PUBLISHED').length;
  const drafts = blogs.filter(b => b.status === 'DRAFT').length;
  const aiGenerated = blogs.filter(b => b.isAIGenerated).length;
  const todayRuns = runs.filter(r => r.runDate === new Date().toISOString().split('T')[0]);
  const lastRun = runs[0];

  const StatCard = ({ title, value, icon, bg }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome to the StudentHelp CMS.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/posts/new" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
            + New Post
          </Link>
          <Link to="/admin/ai-blog" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            AI Generator
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Posts" value={blogs.length} icon={<FileText className="text-blue-600" />} bg="bg-blue-50" />
            <StatCard title="Published" value={published} icon={<CheckCircle2 className="text-emerald-600" />} bg="bg-emerald-50" />
            <StatCard title="Drafts" value={drafts} icon={<Clock className="text-amber-600" />} bg="bg-amber-50" />
            <StatCard title="AI Generated" value={aiGenerated} icon={<Bot className="text-purple-600" />} bg="bg-purple-50" />
          </div>

          {/* Chart Widget */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Blog Views & Engagement</h3>
                <p className="text-sm text-slate-500">Weekly traffic overview across all posts.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Views</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Visitors</div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Posts</h3>
                <Link to="/admin/posts" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
              </div>
              <div className="space-y-4">
                {blogs.slice(0, 5).map(blog => (
                  <div key={blog.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                        {blog.featuredImage ? <img src={blog.featuredImage} className="w-full h-full object-cover" alt="" /> : <FileText size={18} className="text-slate-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {blog.status}
                      </span>
                      <Link to={`/admin/posts/${blog.id}/edit`} className="text-slate-400 hover:text-blue-600">Edit</Link>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && <p className="text-slate-500 text-center py-8">No posts yet.</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Daily AI Automation</h3>
                <Link to="/admin/automation" className="text-sm font-medium text-blue-600 hover:text-blue-700">Settings</Link>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Next Run</p>
                  <p className="text-lg font-black text-slate-800">Today, 07:00 PM IST</p>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-3">Last Run Status</p>
                  {lastRun ? (
                    <div className="flex items-start gap-3">
                      {lastRun.status === 'SUCCESS' ? <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} /> : <AlertCircle className="text-red-500 mt-0.5" size={18} />}
                      <div>
                        <p className={`font-medium ${lastRun.status === 'SUCCESS' ? 'text-emerald-700' : 'text-red-700'}`}>{lastRun.status}</p>
                        <p className="text-xs text-slate-500">{new Date(lastRun.startedAt).toLocaleString()}</p>
                        {lastRun.errorMessage && <p className="text-xs text-red-500 mt-1 line-clamp-2">{lastRun.errorMessage}</p>}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No runs recorded yet.</p>
                  )}
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-600 mb-2">Today's Generation</p>
                  {todayRuns.length > 0 ? (
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">COMPLETED</span>
                  ) : (
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">PENDING</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
