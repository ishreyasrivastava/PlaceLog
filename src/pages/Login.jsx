import { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try { await login(email, password); toast.success('Welcome back!'); navigate(from, { replace: true }); }
    catch (err) { setError(err.message || 'Failed to sign in.'); }
    finally { setLoading(false); }
  }, [email, password, login, navigate, from]);

  return (
    <div className="page-bg flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-300 dark:bg-brand-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-300 dark:bg-violet-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"><ArrowLeft className="w-4 h-4" />Back to home</Link>

        <div className="glass-card p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30"><BookOpen className="w-7 h-7 text-white" /></div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to continue to PlaceLog</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" disabled={loading} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input pr-12" disabled={loading} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" tabIndex={-1}>
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end"><Link to="/forgot-password" className="text-sm text-brand-600 dark:text-brand-400 font-medium">Forgot password?</Link></div>
            <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</> : <><LogIn className="w-5 h-5" />Sign In</>}
            </button>
          </form>

          <div className="relative my-8"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white/70 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400">New to PlaceLog?</span></div></div>
          <Link to="/signup" className="block w-full text-center py-3.5 btn-secondary">Create an account</Link>
        </div>
      </motion.div>
    </div>
  );
}
