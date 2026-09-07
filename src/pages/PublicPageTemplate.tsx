import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function PublicPageTemplate({ title }: { title: string }) {
  return (
    <div className="bg-slate-50 min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <SEO title={title} description={`Learn more about StudentHelp on our ${title} page.`} />
      <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl mb-6">
        <Sparkles size={32} />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        {title}
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-12">
        This is a placeholder page for the public website. Join StudentHelp today to get access to all our powerful student tools and AI features.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/dashboard" 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          Go to Dashboard <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
