import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Users, 
  Building2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Shield,
  AlertTriangle,
  Zap,
  Award,
  MessageCircle,
  ChevronRight,
  Star
} from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getAllExperiences } from '../services/experiences';
import { useAuth } from '../contexts/AuthContext';
import { isFirebaseConfigured } from '../services/firebase';

export default function Home() {
  const { currentUser } = useAuth();
  const [recentExperiences, setRecentExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, companies: 0, selected: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const experiences = await getAllExperiences();
      setRecentExperiences(experiences.slice(0, 6));
      
      // Calculate stats
      const companies = new Set(experiences.map(e => e.company));
      const selected = experiences.filter(e => e.outcome === 'Selected').length;
      setStats({
        total: experiences.length,
        companies: companies.size,
        selected
      });
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen">
      {/* Demo Mode Notice */}
      <AnimatePresence>
        {!isFirebaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold">Demo Mode:</span> Showing sample data. 
                  <a 
                    href="https://github.com/ishreyasrivastava/PlaceLog#2-set-up-firebase" 
                    className="underline ml-1 hover:text-amber-900 font-medium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Set up Firebase →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Real Interview Experiences from Real Students
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
            >
              Crack Your Dream
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campus Placement
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Learn from real interview experiences shared by students. 
              Get insights on questions asked, tips to prepare, and what to expect.
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/explore"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Search className="w-5 h-5" />
                Explore Experiences
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {currentUser ? (
                <Link
                  to="/share"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Share Your Story
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                Student Community
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                Real Experiences
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard 
              icon={BookOpen} 
              value={stats.total} 
              label="Experiences" 
              color="indigo"
              delay={0}
            />
            <StatCard 
              icon={Building2} 
              value={stats.companies} 
              label="Companies" 
              color="purple"
              delay={0.1}
            />
            <StatCard 
              icon={Award} 
              value={stats.selected} 
              label="Success Stories" 
              color="emerald"
              delay={0.2}
            />
            <StatCard 
              icon={Users} 
              value="50+" 
              label="Active Students" 
              color="blue"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why PlaceLog?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Get the inside scoop on campus placements from students who've been there.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={Target}
              title="Targeted Preparation"
              description="Know exactly what companies ask. Filter by company, role, and year to find relevant experiences."
              gradient="from-indigo-500 to-blue-500"
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Real & Verified"
              description="Authentic experiences shared by real students from your campus and batch."
              gradient="from-purple-500 to-pink-500"
              delay={0.1}
            />
            <FeatureCard
              icon={Zap}
              title="Tips That Work"
              description="Learn from success stories. Understand what worked and what to avoid."
              gradient="from-amber-500 to-orange-500"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Recent Experiences */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              >
                Recent Experiences
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600"
              >
                Fresh insights from recent campus interviews
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/explore"
                className="group inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          {loading ? (
            <GridSkeleton count={6} />
          ) : error ? (
            <EmptyState variant="error" onRetry={fetchData} />
          ) : recentExperiences.length === 0 ? (
            <EmptyState variant="no-experiences" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentExperiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Ready to ace your placements?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-indigo-100 mb-10"
            >
              Join your peers and start preparing smarter, not harder.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">PlaceLog</span>
            </div>
            <p className="text-sm">
              Built with ❤️ for campus placements
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, delay = 0 }) {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', glow: 'shadow-indigo-500/20' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', glow: 'shadow-purple-500/20' },
    emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', glow: 'shadow-emerald-500/20' },
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600', glow: 'shadow-blue-500/20' }
  };
  
  const colors = colorClasses[color] || colorClasses.indigo;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <div className={`w-14 h-14 mx-auto rounded-2xl ${colors.bg} flex items-center justify-center mb-4 shadow-lg ${colors.glow}`}>
        <Icon className={`w-7 h-7 ${colors.icon}`} />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-500 font-medium">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/60 transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
