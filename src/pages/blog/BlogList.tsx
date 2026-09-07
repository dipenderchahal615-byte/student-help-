import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogDb, BlogPost } from '../../lib/blog-db';
import { SEO } from '../../components/SEO';

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    blogDb.blogs.getAll('PUBLISHED').then(data => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO title="Blog - Tips & Strategies" description="Insights, tips, and strategies for modern students to excel in academics and career." />
      {/* Header */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">StudentHelp Blog</h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">Insights, tips, and strategies for modern students to excel in academics and career.</p>
        
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search articles, guides, or topics..." 
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 rounded-full py-4 pl-12 pr-6 outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-blue-200" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-96 border border-slate-200"></div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No blogs found</h3>
            <p className="text-slate-500">We couldn't find any articles matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }}
                key={blog.id} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  {blog.featuredImage ? (
                    <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <span className="font-bold text-4xl">{blog.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">{blog.excerpt}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {blog.readingTime} min</div>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blog.slug}`} className="mt-6 flex items-center justify-center w-full py-3 bg-slate-50 text-blue-600 font-semibold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Read Article <ChevronRight size={18} className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
