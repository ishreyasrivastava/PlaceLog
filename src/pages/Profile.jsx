import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserExperiences } from '../services/experiences';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar,
  BookOpen,
  Plus,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, selected: 0 });

  useEffect(() => {
    async function fetchUserExperiences() {
      if (!currentUser) return;
      
      try {
        const data = await getUserExperiences(currentUser.uid);
        setExperiences(data);
        
        // Calculate stats
        const selected = data.filter(e => e.outcome === 'Selected').length;
        setStats({
          total: data.length,
          selected
        });
      } catch (err) {
        console.error('Error fetching user experiences:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserExperiences();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {userProfile?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {userProfile?.displayName || 'User'}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-gray-500">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {currentUser?.email}
                </span>
                {userProfile?.college && (
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {userProfile.college}
                  </span>
                )}
                {userProfile?.batch && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Batch {userProfile.batch}
                  </span>
                )}
              </div>
            </div>

            {/* Action */}
            <Link
              to="/share"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Share Experience
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            <StatCard 
              icon={BookOpen} 
              value={stats.total} 
              label="Experiences Shared"
              color="indigo"
            />
            <StatCard 
              icon={CheckCircle2} 
              value={stats.selected} 
              label="Success Stories"
              color="green"
            />
            <StatCard 
              icon={Clock} 
              value={experiences.length > 0 ? 'Active' : 'New'} 
              label="Status"
              color="purple"
            />
            <StatCard 
              icon={User} 
              value={userProfile?.batch || '-'} 
              label="Batch Year"
              color="blue"
            />
          </div>
        </motion.div>

        {/* User's Experiences */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Experiences</h2>
              <p className="text-gray-500">Experiences you've shared with the community</p>
            </div>
          </div>

          {loading ? (
            <GridSkeleton count={3} />
          ) : experiences.length === 0 ? (
            <EmptyState variant="no-user-experiences" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600'
  };
  
  return (
    <div className="text-center p-4 bg-gray-50 rounded-xl">
      <div className={`w-10 h-10 mx-auto rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
