import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  AlertTriangle
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

  useEffect(() => {
    async function fetchData() {
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
    }
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-white">
      {/* Demo Mode Notice */}
      {!isFirebaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Demo Mode:</strong> Firebase is not configured. Showing sample data. 
                <a href="https://github.com/ishreyasrivastava/PlaceLog#2-set-up-firebase" 
                   className="underline ml-1 hover:text-amber-900" target="_blank" rel="noopener noreferrer">
                  Set up Firebase
                </a> to enable all features.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Real Interview Experiences from Real Students
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Crack Your Dream
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Campus Placement
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Learn from real interview experiences shared by students. 
              Get insights on questions asked, tips to prepare, and what to expect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transition-all"
              >
                <Search className="w-5 h-5" />
                Explore Experiences
              </Link>
              
              {currentUser ? (
                <Link
                  to="/share"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Share Your Experience
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              icon={BookOpen} 
              value={stats.total} 
              label="Experiences Shared" 
              color="indigo"
            />
            <StatCard 
              icon={Building2} 
              value={stats.companies} 
              label="Companies Covered" 
              color="purple"
            />
            <StatCard 
              icon={TrendingUp} 
              value={stats.selected} 
              label="Success Stories" 
              color="green"
            />
            <StatCard 
              icon={Users} 
              value="50+" 
              label="Active Students" 
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why PlaceLog?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get the inside scoop on campus placements from students who've been there.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Targeted Preparation"
              description="Know exactly what companies ask. Filter by company, role, and year to find relevant experiences."
            />
            <FeatureCard
              icon={Shield}
              title="Real & Verified"
              description="Authentic experiences shared by real students from your campus and batch."
            />
            <FeatureCard
              icon={Sparkles}
              title="Tips That Work"
              description="Learn from success stories. Understand what worked and what to avoid."
            />
          </div>
        </div>
      </section>

      {/* Recent Experiences */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recent Experiences
              </h2>
              <p className="text-gray-600">
                Fresh insights from recent campus interviews
              </p>
            </div>
            <Link
              to="/explore"
              className="hidden md:inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <GridSkeleton count={6} />
          ) : error ? (
            <EmptyState variant="error" onRetry={() => window.location.reload()} />
          ) : recentExperiences.length === 0 ? (
            <EmptyState variant="no-experiences" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentExperiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-indigo-600 font-medium"
            >
              View All Experiences
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to ace your placements?
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Join your peers and start preparing smarter, not harder.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">PlaceLog</span>
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

function StatCard({ icon: Icon, value, label, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className={`w-12 h-12 mx-auto rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
