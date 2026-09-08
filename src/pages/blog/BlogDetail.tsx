import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { blogDb, BlogPost } from '../../lib/blog-db';
import ReactMarkdown from 'react-markdown';
import { SEO } from '../../components/SEO';
import { useBlogSEO } from '../../hooks/useBlogSEO';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      blogDb.blogs.getBySlug(slug).then(async (data) => {
        setBlog(data);
        if (data) {
          const allBlogs = await blogDb.blogs.getAll();
          const related = allBlogs
            .filter(b => b.id !== data.id && b.status === 'published' && (b.category === data.category || b.tags.some(t => data.tags.includes(t))))
            .slice(0, 3);
          
          if (related.length === 0) {
            setRelatedBlogs(allBlogs.filter(b => b.id !== data.id && b.status === 'published').slice(0, 3));
          } else {
            setRelatedBlogs(related);
          }
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const seoData = useBlogSEO(blog);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-slate-100 rounded-lg mb-8"></div>
          <div className="h-12 bg-slate-100 rounded-xl mb-6"></div>
          <div className="h-12 bg-slate-100 rounded-xl w-3/4 mb-10"></div>
          <div className="h-64 bg-slate-100 rounded-3xl mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Article Not Found</h2>
        <p className="text-slate-500 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO 
        title={seoData.title} 
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        url={`https://studenthelp.com/blog/${blog.slug}`}
        type="article"
        article={{
          publishedTime: new Date(blog.createdAt).toISOString(),
          modifiedTime: new Date(blog.updatedAt).toISOString(),
          author: blog.authorName,
          tags: blog.tags
        }}
        breadcrumbs={[
          { name: 'Home', url: 'https://studenthelp.com/' },
          { name: 'Blog', url: 'https://studenthelp.com/blog' },
          { name: blog.title, url: `https://studenthelp.com/blog/${blog.slug}` }
        ]}
      />
      
      <div className="border-b border-slate-100 bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors mb-8">
            <ArrowLeft size={18} className="mr-2" /> Back to all articles
          </Link>
          
          <div className="mb-6 flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
            {blog.isAIGenerated && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                AI Generated
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
            {blog.title}
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            {blog.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2"><User size={16} /> {blog.author}</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> {blog.readingTime} min read</div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
        {blog.featuredImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white mb-16 h-[400px]">
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          </motion.div>
        )}
        
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-2xl">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </article>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Tag size={16} /> Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="container mx-auto px-4 max-w-4xl mt-16 pt-16 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <Link 
                key={relatedBlog.id} 
                to={`/blog/${relatedBlog.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-blue-200 flex flex-col"
              >
                <div className="h-40 bg-slate-100 overflow-hidden">
                  {relatedBlog.featuredImage ? (
                    <img src={relatedBlog.featuredImage} alt={relatedBlog.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <span className="font-bold text-3xl">{relatedBlog.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{relatedBlog.category}</span>
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedBlog.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Clock size={14} /> {relatedBlog.readingTime} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
