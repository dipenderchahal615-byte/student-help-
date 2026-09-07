import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Save, Image as ImageIcon, Send, ArrowLeft } from 'lucide-react';
import { blogDb, BlogPost } from '../../lib/blog-db';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Education',
    tags: [],
    status: 'DRAFT',
    seoTitle: '',
    metaDescription: '',
    keywords: '',
    featuredImage: '',
    readingTime: 5
  });

  useEffect(() => {
    if (id) {
      // Find blog by ID (Need a getById in blogDb, or we fetch all and find)
      blogDb.blogs.getAll().then(blogs => {
        const b = blogs.find(x => x.id === id);
        if (b) setFormData(b);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title || !formData.content) return alert("Title and content required");
    setSaving(true);
    
    const blogId = id || window.crypto.randomUUID();
    const now = Date.now();
    
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const post: BlogPost = {
      id: blogId,
      title: formData.title || '',
      slug,
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      featuredImage: formData.featuredImage || '',
      author: formData.author || 'Admin',
      category: formData.category || 'Education',
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(s=>s.trim()) : (formData.tags || []),
      status,
      isAIGenerated: formData.isAIGenerated || false,
      seoTitle: formData.seoTitle || formData.title || '',
      metaDescription: formData.metaDescription || formData.excerpt || '',
      keywords: formData.keywords || '',
      createdAt: formData.createdAt || now,
      updatedAt: now,
      publishedAt: status === 'PUBLISHED' && !formData.publishedAt ? now : formData.publishedAt,
      readingTime: formData.readingTime || Math.ceil((formData.content?.split(' ').length || 0) / 200) || 5
    };

    await blogDb.blogs.save(post);
    setSaving(false);
    navigate('/admin/posts');
  };

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-400 hover:text-slate-600 mb-2 flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
          <h1 className="text-3xl font-black text-slate-900">{id ? 'Edit Post' : 'Create New Post'}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave('DRAFT')} disabled={saving} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
            <Save size={18} /> Save Draft
          </button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Send size={18} /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Post title" className="w-full border-slate-200 rounded-lg p-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Content (Markdown supported)</label>
              <textarea rows={20} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Write your content here..." className="w-full border-slate-200 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Excerpt</label>
              <textarea rows={3} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Short summary..." className="w-full border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Publishing</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
              <span className={`px-2 py-1 rounded text-xs font-bold ${formData.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{formData.status}</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="auto-generated" className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (comma separated)</label>
              <input type="text" value={typeof formData.tags === 'string' ? formData.tags : (formData.tags||[]).join(', ')} onChange={e => setFormData({...formData, tags: e.target.value as any})} className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Media</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Featured Image URL</label>
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-slate-400" />
                <input type="text" value={formData.featuredImage} onChange={e => setFormData({...formData, featuredImage: e.target.value})} placeholder="https://..." className="flex-1 border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {formData.featuredImage && (
                <div className="mt-3 h-32 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                  <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">SEO</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SEO Title</label>
              <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Description</label>
              <textarea rows={2} value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Keywords</label>
              <input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="w-full border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
