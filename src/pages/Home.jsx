import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Building2, ArrowRight, Sparkles, BookOpen, Target, Shield, Zap, Award, Star, ChevronRight } from 'lucide-react';
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
  const [stats, setStats] = useState({ total: 0, companies: 0, selected: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const exp = await getAllExperiences();
      setRecent(exp.slice(0, 6));
      const companies = new Set(exp.map(e => e.company));
      setStats({ total: exp.length, companies: companies.size, selected: exp.filter(e => e.outcome === 'Selected').length });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden page-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400 dark:bg-brand-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-violet-400 dark:bg-violet-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
              <Sparkles className="w-4 h-4" />Real Interview Experiences from Real Students
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Crack Your Dream<span className="block mt-2 text-gradient">Campus Placement</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn from real interview experiences shared by students. Get insights on questions asked, tips to prepare, and what to expect.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore" className="btn-primary text-lg !px-8 !py-4 !shadow-xl"><Search className="w-5 h-5" />Explore Experiences<ChevronRight className="w-5 h-5" /></Link>
              {currentUser ? (
                <Link to="/share" className="btn-secondary text-lg !px-8 !py-4"><Plus className="w-5 h-5" />Share Your Story</Link>
              ) : (
                <Link to="/signup" className="btn-secondary text-lg !px-8 !py-4">Get Started Free<ArrowRight className="w-5 h-5" /></Link>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-500" />100% Free</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" />Student Community</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" />Real Experiences</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats removed */}

      {/* Features */}
      <section className="py-16 md:py-24 page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why PlaceLog?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Get the inside scoop on campus placements.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Targeted Prep', desc: 'Know exactly what companies ask. Filter by company, role, and year.', gradient: 'from-brand-500 to-blue-500' },
              { icon: Shield, title: 'Real & Verified', desc: 'Authentic experiences shared by real students from your campus.', gradient: 'from-violet-500 to-purple-500' },
              { icon: Zap, title: 'Tips That Work', desc: 'Learn from success stories. What worked and what to avoid.', gradient: 'from-amber-500 to-orange-500' },
            ].map(({ icon: Icon, title, desc, gradient }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass-card p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}><Icon className="w-7 h-7 text-white" /></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recent Experiences</h2>
              <p className="text-gray-600 dark:text-gray-400">Fresh insights from recent interviews</p>
            </div>
            <Link to="/explore" className="group inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold">View All<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
          </div>
          {loading ? <GridSkeleton count={6} /> : error ? <EmptyState variant="error" onRetry={fetchData} /> : recent.length === 0 ? <EmptyState variant="no-experiences" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{recent.map((exp, i) => <ExperienceCard key={exp.id} experience={exp} index={i} />)}</div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-brand-600 via-violet-600 to-purple-600 relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to ace your placements?</h2>
            <p className="text-xl text-brand-100 mb-10">Join your peers and start preparing smarter.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-2xl font-semibold text-lg shadow-2xl hover:scale-[1.02] transition-all">Create Free Account<ArrowRight className="w-5 h-5" /></Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-violet-500 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
            <span className="text-white font-semibold text-lg">PlaceLog</span>
          </div>
          <p className="text-sm">Built with ❤️ for campus placements</p>
        </div>
      </footer>
    </div>
  );
}
