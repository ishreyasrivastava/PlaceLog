import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Search, Plus, User, LogOut, Menu, X, Sun, Moon, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); navigate('/'); } catch { toast.error('Failed to log out'); }
    setOpen(false);
  };

  const isActive = (p) => location.pathname === p;
  const links = [
    { path: '/explore', label: 'Explore', icon: Search },
    ...(currentUser ? [{ path: '/share', label: 'Share', icon: Plus }, { path: '/profile', label: 'Profile', icon: User }] : []),
  ];

  return (
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Place<span className="text-gradient">Log</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive(path) ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" aria-label="Toggle theme">
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun className="w-5 h-5" /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon className="w-5 h-5" /></motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <button onClick={handleLogout} className="btn-ghost text-sm"><LogOut className="w-4 h-4" />Logout</button>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm"><LogIn className="w-4 h-4" />Sign In</Link>
                  <Link to="/signup" className="btn-primary text-sm !px-4 !py-2"><Sparkles className="w-4 h-4" />Join Free</Link>
                </>
              )}
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
            <div className="px-4 py-4 space-y-1 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl">
              {links.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(path) ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  <Icon className="w-5 h-5" />{label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                {currentUser ? (
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400"><LogOut className="w-5 h-5" />Logout</button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Sign In</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="w-full btn-primary text-sm !py-3"><Sparkles className="w-4 h-4" />Join Free</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
