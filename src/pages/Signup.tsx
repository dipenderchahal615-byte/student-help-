import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function Signup() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white flex">
      <SEO title="Sign Up" />
      
      {/* Left side: Content / Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-500 transition-colors">
              SH
            </div>
            <span className="font-bold text-2xl tracking-tight text-white leading-none">StudentHelp</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">Join thousands of smart students.</h1>
          <ul className="space-y-4">
            {[
              'AI-powered study notes & flashcards',
              'Smart daily planners & progress tracking',
              'Professional resume & portfolio builder',
              'Interactive career roadmaps'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-500" size={20} />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} StudentHelp. All rights reserved.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24">
        <Link to="/" className="lg:hidden flex items-center gap-3 w-fit mb-12">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
            SH
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 leading-none">StudentHelp</span>
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to home
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create your account
          </h2>
          <p className="text-slate-500 mb-8">
            Get started with your free StudentHelp workspace today.
          </p>

          <button
            onClick={signIn}
            className="w-full flex justify-center py-4 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all items-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Secure authentication
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 max-w-xs text-center mx-auto mb-8">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-slate-700 underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-slate-700 underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
