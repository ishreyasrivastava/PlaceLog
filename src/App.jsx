import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { Suspense, lazy } from 'react';
import { FullPageLoader } from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ShareExperience = lazy(() => import('./pages/ShareExperience'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));
const EditExperience = lazy(() => import('./pages/EditExperience'));
const Profile = lazy(() => import('./pages/Profile'));

function NotFound() {
  return (
    <div className="page-bg flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-brand-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
              <Navbar />
              <Suspense fallback={<FullPageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/experience/:id" element={<ExperienceDetail />} />
                  <Route path="/share" element={<ProtectedRoute><ShareExperience /></ProtectedRoute>} />
                  <Route path="/edit/:id" element={<ProtectedRoute><EditExperience /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster position="top-center" gutter={12} containerStyle={{ top: 80 }} toastOptions={{ duration: 4000, style: { padding: '16px 20px', borderRadius: '16px', fontSize: '14px', fontWeight: '500', maxWidth: '400px' } }} />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
