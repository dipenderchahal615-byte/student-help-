import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Search, Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { blogDb, BlogPost } from '../../lib/blog-db';
import { Link } from 'react-router-dom';

export default function AdminPosts() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    const b = await blogDb.blogs.getAll();
    setBlogs(b);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await blogDb.blogs.delete(id);
      fetchBlogs();
    }
  };

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.status.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Posts</h1>
          <p className="text-slate-500">Create, edit, and manage your blog articles.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/posts/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18} /> Create Manual Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-72">
            <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No posts found.</td></tr>
              ) : (
                filtered.map(blog => (
                  <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        {blog.author} {blog.isAIGenerated && <span className="bg-purple-100 text-purple-700 px-1.5 rounded text-[10px] font-bold">AI</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{blog.category}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/blog/${blog.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"><Eye size={16} /></Link>
                        <Link to={`/admin/posts/${blog.id}/edit`} className="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit2 size={16} /></Link>
                        <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
