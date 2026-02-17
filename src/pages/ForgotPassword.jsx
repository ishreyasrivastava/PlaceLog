import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError('');
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    try { await resetPassword(email); setSuccess(true); toast.success('Reset email sent!'); }
    catch (err) { setError(err.message || 'Failed to send reset email.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="page-bg flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" /></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">We've sent a reset link to <strong>{email}</strong></p>
              <div className="space-y-3">
                <button onClick={() => setSuccess(false)} className="w-full btn-secondary">Try Another Email</button>
                <Link to="/login" className="w-full btn-primary">Back to Sign In</Link>
              </div>
            </motion.div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"><ArrowLeft className="w-4 h-4" />Back to login</Link>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-gray-500 dark:text-gray-400">We'll send you reset instructions.</p>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" disabled={loading} /></div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
