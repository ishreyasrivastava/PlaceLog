import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  GraduationCap,
  Calendar,
  AlertCircle, 
  Loader2,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const BATCHES = ['2024', '2025', '2026', '2027', '2028'];

// Error message mapping
const errorMessages = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password is too weak. Please use a stronger password.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'default': 'Failed to create account. Please try again.'
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 100); // Limit length
};

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    batch: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  // Password requirements
  const passwordRequirements = useMemo(() => [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Contains a letter', met: /[a-zA-Z]/.test(formData.password) },
    { text: 'Contains a special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ], [formData.password]);

  const allRequirementsMet = passwordRequirements.filter(r => r.met).length >= 3;
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Field validation
  const validations = useMemo(() => ({
    name: formData.name.length >= 2 && formData.name.length <= 50,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: allRequirementsMet,
    confirmPassword: passwordsMatch && formData.confirmPassword.length > 0,
    college: formData.college.length >= 2 && formData.college.length <= 50,
    batch: BATCHES.includes(formData.batch)
  }), [formData, allRequirementsMet, passwordsMatch]);

  // Clear error when form changes
  useEffect(() => {
    if (error) setError('');
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase().trim() : sanitizeInput(value)
    }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      college: true,
      batch: true
    });
    
    // Check all validations
    const allValid = Object.values(validations).every(v => v);
    if (!allValid) {
      setError('Please fill in all fields correctly');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(
        formData.email, 
        formData.password, 
        sanitizeInput(formData.name),
        sanitizeInput(formData.college),
        formData.batch
      );
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      const message = errorMessages[err.code] || errorMessages['default'];
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [formData, signup, navigate, validations, passwordsMatch]);

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    if (!validations[field]) {
      switch (field) {
        case 'name': return 'Name must be 2-50 characters';
        case 'email': return 'Please enter a valid email';
        case 'password': return 'Password does not meet requirements';
        case 'confirmPassword': return formData.confirmPassword ? 'Passwords do not match' : 'Please confirm your password';
        case 'college': return 'College name must be 2-50 characters';
        case 'batch': return 'Please select your batch';
        default: return 'Invalid input';
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join PlaceLog and help your peers</p>
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
                  <p className="text-red-600 text-sm flex-1">{error}</p>
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="John Doe"
                  autoComplete="name"
                  maxLength={50}
                  className={`input ${getFieldError('name') ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('name')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input ${getFieldError('email') ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('email')}</p>
              )}
            </div>

            {/* College & Batch Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    onBlur={() => handleBlur('college')}
                    placeholder="JUIT"
                    maxLength={50}
                    className={`input ${getFieldError('college') ? 'input-error' : ''}`}
                    disabled={loading}
                  />
                </div>
                {getFieldError('college') && (
                  <p className="mt-1 text-sm text-red-500">{getFieldError('college')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    onBlur={() => handleBlur('batch')}
                    className={`input appearance-none cursor-pointer ${getFieldError('batch') ? 'input-error' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    {BATCHES.map(batch => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>
                {getFieldError('batch') && (
                  <p className="mt-1 text-sm text-red-500">{getFieldError('batch')}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input pr-12 ${getFieldError('password') ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password requirements */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-1.5"
                  >
                    {passwordRequirements.map((req, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          req.met ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 transition-opacity ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                        {req.text}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input ${getFieldError('confirmPassword') ? 'input-error' : ''}`}
                  disabled={loading}
                />
                {formData.confirmPassword && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
