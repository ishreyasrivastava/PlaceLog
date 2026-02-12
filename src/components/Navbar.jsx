import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Search,
  Home
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PlaceLog
              </span>
            </Link>
          </div>

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
                  Share Experience
                </NavLink>
                <NavLink to="/profile" active={isActive('/profile')}>
                  <User className="w-4 h-4" />
                  My Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" active={isActive('/login')}>
                  Login
                </NavLink>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-gray-200"
        >
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              <Home className="w-5 h-5" />
              Home
            </MobileNavLink>
            <MobileNavLink to="/explore" onClick={() => setMobileMenuOpen(false)}>
              <Search className="w-5 h-5" />
              Explore
            </MobileNavLink>
            
            {currentUser ? (
              <>
                <MobileNavLink to="/share" onClick={() => setMobileMenuOpen(false)}>
                  <Plus className="w-5 h-5" />
                  Share Experience
                </MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-5 h-5" />
                  My Profile
                </MobileNavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </MobileNavLink>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
