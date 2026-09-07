import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, RefreshCw, Save, Send } from 'lucide-react';
import { blogDb } from '../../lib/blog-db';
import { useNavigate } from 'react-router-dom';

export default function AdminAIBlog() {
  const [formData, setFormData] = useState({
    topic: '',
    audience: 'High School & College Students',
    length: 'Medium (800 words)',
    tone: 'Professional & Encouraging',
    language: 'English'
  });
  
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!formData.topic) return setMessage("Topic is required.");
    setGenerating(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedBlog(data);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
    setGenerating(false);
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!generatedBlog) return;
    setSaving(true);
    const id = window.crypto.randomUUID();
    const now = Date.now();
    await blogDb.blogs.save({
      ...generatedBlog,
      id,
      category: 'Education',
      author: 'Admin',
      status,
      isAIGenerated: true,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'PUBLISHED' ? now : undefined
    });
    setSaving(false);
    navigate('/admin/posts');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3"><Bot className="text-blue-600" /> AI Blog Generator</h1>
        <p className="text-slate-500">Manually generate AI-powered blog posts with advanced parameters.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Topic</label>
              <textarea rows={3} placeholder="e.g. How to manage time during exams" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
              <input type="text" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Length</label>
              <select value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Short (400 words)</option>
                <option>Medium (800 words)</option>
                <option>Long (1500 words)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tone</label>
              <input type="text" value={formData.tone} onChange={e => setFormData({...formData, tone: e.target.value})} className="w-full border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button onClick={handleGenerate} disabled={generating} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4">
              {generating ? <RefreshCw className="animate-spin" size={20} /> : <Bot size={20} />}
              {generating ? 'Generating...' : 'Generate Blog'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {generatedBlog ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px]">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Generated Result</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleSave('DRAFT')} disabled={saving} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                    Save Draft
                  </button>
                  <button onClick={() => handleSave('PUBLISHED')} disabled={saving} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                    <Send size={14} /> Publish
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{generatedBlog.title}</h2>
                  <p className="text-slate-500 font-medium">Slug: /{generatedBlog.slug}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl mb-6 text-slate-600 italic">
                  "{generatedBlog.excerpt}"
                </div>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />
                
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                  <p className="text-sm"><strong className="text-slate-700">SEO Meta:</strong> {generatedBlog.metaDescription}</p>
                  <p className="text-sm"><strong className="text-slate-700">Keywords:</strong> {generatedBlog.keywords}</p>
                  <p className="text-sm"><strong className="text-slate-700">Tags:</strong> {(generatedBlog.tags || []).join(', ')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Bot size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-600">No blog generated yet</p>
              <p className="text-sm mt-2">Adjust your parameters and click Generate to create a new post.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
