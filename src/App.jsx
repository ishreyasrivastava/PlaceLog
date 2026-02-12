import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { Suspense, lazy } from 'react';
import { FullPageLoader } from './components/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ShareExperience = lazy(() => import('./pages/ShareExperience'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));
const EditExperience = lazy(() => import('./pages/EditExperience'));
const Profile = lazy(() => import('./pages/Profile'));

// 404 Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="text-center px-4">
        <div className="text-8xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <Suspense fallback={<FullPageLoader text="Loading..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/experience/:id" element={<ExperienceDetail />} />

                {/* Protected Routes */}
                <Route
                  path="/share"
                  element={
                    <ProtectedRoute>
                      <ShareExperience />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditExperience />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>

          {/* Toast Notifications - Premium styling */}
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{
              top: 80,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#1f2937',
                padding: '16px 20px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                border: '1px solid #f3f4f6',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '400px',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
                },
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                  border: '1px solid #ddd6fe',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
