import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Calendar, AlertCircle, Loader2, CheckCircle2, BookOpen, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BATCHES = ['2024', '2025', '2026', '2027', '2028'];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', college: '', batch: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwReqs = useMemo(() => [
    { text: '8+ characters', met: form.password.length >= 8 },
    { text: 'Contains number', met: /\d/.test(form.password) },
    { text: 'Contains letter', met: /[a-zA-Z]/.test(form.password) },
  ], [form.password]);

  const allReqsMet = pwReqs.every(r => r.met);
  const pwMatch = form.password === form.confirmPassword;

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); setError('');
    if (!form.name || !form.email || !form.password || !form.college || !form.batch) { setError('Please fill all fields'); return; }
    if (!allReqsMet) { setError('Password does not meet requirements'); return; }
    if (!pwMatch) { setError('Passwords do not match'); return; }
    setLoading(true);
    try { await signup(form.email, form.password, form.name, form.college, form.batch); toast.success('Account created!'); navigate('/'); }
    catch (err) { setError(err.message || 'Failed to create account.'); }
    finally { setLoading(false); }
  }, [form, signup, navigate, allReqsMet, pwMatch]);

  return (
    <div className="page-bg flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-300 dark:bg-violet-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"><ArrowLeft className="w-4 h-4" />Back to home</Link>

        <div className="glass-card p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30"><BookOpen className="w-7 h-7 text-white" /></div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join PlaceLog and help your peers</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-red-600 dark:text-red-400 text-sm flex-1">{error}</p>
              <button onClick={() => setError('')} className="text-red-400"><X className="w-4 h-4" /></button>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input" disabled={loading} /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" disabled={loading} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">College *</label>
                <div className="relative"><GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="college" value={form.college} onChange={handleChange} placeholder="JUIT" className="input" disabled={loading} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch *</label>
                <div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select name="batch" value={form.batch} onChange={handleChange} className="input appearance-none cursor-pointer" disabled={loading}>
                  <option value="">Select</option>{BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input pr-12" disabled={loading} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" tabIndex={-1}>{showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
              <AnimatePresence>{form.password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-1.5">
                  {pwReqs.map((r, i) => <div key={i} className={`flex items-center gap-2 text-xs ${r.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}><CheckCircle2 className={`w-3.5 h-3.5 ${r.met ? 'opacity-100' : 'opacity-30'}`} />{r.text}</div>)}
                </motion.div>
              )}</AnimatePresence>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input pr-12" disabled={loading} />
              {form.confirmPassword && <span className="absolute right-4 top-1/2 -translate-y-1/2">{pwMatch ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-red-500" />}</span>}</div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5 mt-6">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400">Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
