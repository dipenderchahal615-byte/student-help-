import { useEffect } from 'react';
import { BlogPost } from '../lib/blog-db';

export function useBlogSEO(blog: BlogPost | null) {
  useEffect(() => {
    if (!blog) return;
    
    // Fallbacks
    const title = blog.title ? `${blog.title} | StudentHelp Blog` : 'Blog Post | StudentHelp';
    
    // Auto-generate description from excerpt or content
    let desc = blog.excerpt || '';
    if (!desc && blog.content) {
      // Create an excerpt from the content (strip markdown/HTML roughly and take first 150 chars)
      const stripped = blog.content.replace(/<[^>]*>?/gm, '').replace(/[#*_~`\[\]]/g, '');
      desc = stripped.substring(0, 150).trim() + '...';
    }
    const description = desc || 'Read this insightful blog post on StudentHelp.';
    
    // Meta keywords from tags
    const keywords = blog.tags ? blog.tags.join(', ') : 'student, education, AI, study';
    
    // Note: To cleanly integrate with react-helmet-async without creating a wrapper component,
    // we can either return these values to pass into the <SEO /> component, or we can just 
    // rely on returning them so the page can use <SEO /> natively.
    
    // Here we'll just return the values so the component can use them in the <SEO /> tag.
  }, [blog]);
  
  if (!blog) {
    return { title: 'Loading...', description: 'Loading blog post...', keywords: '' };
  }
  
  let desc = blog.excerpt || '';
  if (!desc && blog.content) {
    const stripped = blog.content.replace(/<[^>]*>?/gm, '').replace(/[#*_~`\[\]]/g, '');
    desc = stripped.substring(0, 150).trim() + '...';
  }
  
  return {
    title: blog.title ? `${blog.title} | StudentHelp Blog` : 'Blog Post | StudentHelp',
    description: desc || 'Read this insightful blog post on StudentHelp.',
    keywords: blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'student, education, AI, study',
    image: blog.featuredImage || ''
  };
}
