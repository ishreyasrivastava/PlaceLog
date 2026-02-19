import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2, ArrowRight, BookOpen } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getAllExperiences } from '../services/experiences';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const exp = await getAllExperiences();
      setRecent(exp.slice(0, 6));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              See what companies asked in campus placements
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Read real interview experiences posted by students. Filter by company, check questions asked, and prepare better.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/explore" className="btn-primary text-lg !px-6 !py-3"><Search className="w-5 h-5" />Browse Experiences</Link>
              {currentUser ? (
                <Link to="/share" className="btn-secondary text-lg !px-6 !py-3"><Plus className="w-5 h-5" />Add Yours</Link>
              ) : (
                <Link to="/signup" className="btn-secondary text-lg !px-6 !py-3">Sign Up<ArrowRight className="w-5 h-5" /></Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Recent Experiences</h2>
              <p className="text-gray-600 dark:text-gray-400">Latest interview posts</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium">View All<ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <GridSkeleton count={6} /> : error ? <EmptyState variant="error" onRetry={fetchData} /> : recent.length === 0 ? <EmptyState variant="no-experiences" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{recent.map((exp) => <ExperienceCard key={exp.id} experience={exp} />)}</div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="py-12 md:py-16 bg-brand-600">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Want to help others prepare?</h2>
            <p className="text-brand-100 mb-6">Share your interview experience — it takes 5 minutes.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Create Account<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <span className="text-white font-semibold">PlaceLog</span>
          </div>
          <p className="text-sm">Built for campus placements</p>
        </div>
      </footer>
    </div>
  );
}
