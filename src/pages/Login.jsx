import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Loader2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// Error message mapping for better UX
const errorMessages = {
  'auth/user-not-found': 'No account found with this email address',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'default': 'Failed to sign in. Please try again.'
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const from = location.state?.from?.pathname || '/';

  // Validation
  const emailError = touched.email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) 
    ? 'Please enter a valid email address' 
    : '';
  const passwordError = touched.password && password.length < 1 
    ? 'Password is required' 
    : '';

  // Clear error when user types
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    // Validate
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const message = errorMessages[err.code] || errorMessages['default'];
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate, from]);

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue to PlaceLog</p>
          </div>

          {/* Error Alert */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6"
              >
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  onBlur={() => handleBlur('email')}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input ${emailError ? 'input-error' : ''}`}
                  disabled={loading}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input pr-12 ${passwordError ? 'input-error' : ''}`}
                  disabled={loading}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">New to PlaceLog?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="block w-full text-center py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
