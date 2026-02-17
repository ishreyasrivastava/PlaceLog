import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserExperiences } from '../services/experiences';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { User, Mail, GraduationCap, Calendar, BookOpen, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, selected: 0 });

  useEffect(() => {
    if (!currentUser) return;
    getUserExperiences(currentUser.id).then(data => {
      setExperiences(data);
      setStats({ total: data.length, selected: data.filter(e => e.outcome === 'Selected').length });
    }).catch(console.error).finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="page-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/20">
              {userProfile?.display_name?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{userProfile?.display_name || 'User'}</h1>
              <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" />{currentUser?.email}</span>
                {userProfile?.college && <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" />{userProfile.college}</span>}
                {userProfile?.batch && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Batch {userProfile.batch}</span>}
              </div>
            </div>
            <Link to="/share" className="btn-primary"><Plus className="w-5 h-5" />Share Experience</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800/50">
            {[
              { icon: BookOpen, value: stats.total, label: 'Shared', color: 'brand' },
              { icon: CheckCircle2, value: stats.selected, label: 'Success', color: 'emerald' },
              { icon: Clock, value: experiences.length > 0 ? 'Active' : 'New', label: 'Status', color: 'violet' },
              { icon: User, value: userProfile?.batch || '-', label: 'Batch', color: 'blue' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <div className={`w-10 h-10 mx-auto rounded-lg bg-${color === 'brand' ? 'brand' : color === 'emerald' ? 'emerald' : color === 'violet' ? 'violet' : 'blue'}-100 dark:bg-${color === 'brand' ? 'brand' : color === 'emerald' ? 'emerald' : color === 'violet' ? 'violet' : 'blue'}-950/50 flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 text-${color === 'brand' ? 'brand' : color === 'emerald' ? 'emerald' : color === 'violet' ? 'violet' : 'blue'}-600 dark:text-${color === 'brand' ? 'brand' : color === 'emerald' ? 'emerald' : color === 'violet' ? 'violet' : 'blue'}-400`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Experiences</h2>
              <p className="text-gray-500 dark:text-gray-400">Your shared interview experiences</p>
            </div>
          </div>
          {loading ? <GridSkeleton count={3} /> : experiences.length === 0 ? <EmptyState variant="no-user-experiences" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{experiences.map((e, i) => <ExperienceCard key={e.id} experience={e} index={i} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
