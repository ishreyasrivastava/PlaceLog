import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserExperiences } from '../services/experiences';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Mail, GraduationCap, Calendar, Plus } from 'lucide-react';

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getUserExperiences(currentUser.id).then(data => {
      setExperiences(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="page-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-950/50 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 text-2xl font-bold">
              {userProfile?.display_name?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{userProfile?.display_name || 'User'}</h1>
              <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" />{currentUser?.email}</span>
                {userProfile?.college && <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" />{userProfile.college}</span>}
                {userProfile?.batch && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Batch {userProfile.batch}</span>}
              </div>
            </div>
            <Link to="/share" className="btn-primary"><Plus className="w-5 h-5" />Share Experience</Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Experiences</h2>
              <p className="text-gray-500 dark:text-gray-400">Your shared interview experiences ({experiences.length})</p>
            </div>
          </div>
          {loading ? <GridSkeleton count={3} /> : experiences.length === 0 ? <EmptyState variant="no-user-experiences" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{experiences.map((e) => <ExperienceCard key={e.id} experience={e} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
