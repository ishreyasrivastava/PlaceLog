import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Search,
  Home,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  }, [logout, navigate, loggingOut]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass shadow-lg shadow-indigo-500/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              aria-label="PlaceLog Home"
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PlaceLog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" active={isActive('/')}>
                <Home className="w-4 h-4" />
                Home
              </NavLink>
              <NavLink to="/explore" active={isActive('/explore')}>
                <Search className="w-4 h-4" />
                Explore
              </NavLink>
              
              {currentUser ? (
                <>
                  <NavLink to="/share" active={isActive('/share')}>
                    <Plus className="w-4 h-4" />
                    Share
                  </NavLink>
                  <NavLink to="/profile" active={isActive('/profile')}>
                    <User className="w-4 h-4" />
                    Profile
                  </NavLink>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-2 disabled:opacity-50"
                    aria-label="Logout"
                  >
                    <LogOut className={`w-4 h-4 ${loggingOut ? 'animate-spin' : ''}`} />
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink to="/login" active={isActive('/login')}>
                    Login
                  </NavLink>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/signup"
                      className="ml-3 px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                    >
                      Sign Up Free
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden"
            >
              <nav className="p-3 space-y-1">
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)} active={isActive('/')}>
                  <Home className="w-5 h-5" />
                  Home
                </MobileNavLink>
                <MobileNavLink to="/explore" onClick={() => setMobileMenuOpen(false)} active={isActive('/explore')}>
                  <Search className="w-5 h-5" />
                  Explore
                </MobileNavLink>
                
                {currentUser ? (
                  <>
                    <MobileNavLink to="/share" onClick={() => setMobileMenuOpen(false)} active={isActive('/share')}>
                      <Plus className="w-5 h-5" />
                      Share Experience
                    </MobileNavLink>
                    <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)} active={isActive('/profile')}>
                      <User className="w-5 h-5" />
                      My Profile
                    </MobileNavLink>
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-5 h-5" />
                        {loggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)} active={isActive('/login')}>
                      Login
                    </MobileNavLink>
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center px-4 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl"
                      >
                        Sign Up Free
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
        active
          ? 'text-indigo-600 bg-indigo-50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 bg-indigo-50 rounded-xl -z-10"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, onClick, active, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-colors ${
        active
          ? 'text-indigo-600 bg-indigo-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
}
