import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2, 
  Briefcase, 
  Calendar,
  User,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Hourglass,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  DollarSign
} from 'lucide-react';
import { getExperience, deleteExperience } from '../services/experiences';
import { useAuth } from '../contexts/AuthContext';
import { FullPageLoader } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const outcomeConfig = {
  'Selected': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  'Rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  'Waitlisted': { icon: Hourglass, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  'In Progress': { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
};

const difficultyConfig = {
  'Easy': { color: 'text-green-600', bg: 'bg-green-100' },
  'Medium': { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'Hard': { color: 'text-red-600', bg: 'bg-red-100' }
};

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const data = await getExperience(id);
        setExperience(data);
      } catch (err) {
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchExperience();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteExperience(id);
      toast.success('Experience deleted');
      navigate('/explore');
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('Failed to delete experience');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Loading experience..." />;
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState variant="not-found" />
      </div>
    );
  }

  const {
    company,
    role,
    year,
    outcome,
    interviewType,
    difficulty,
    rounds,
    questions,
    tips,
    experience: experienceText,
    ctcOffered,
    authorName,
    authorCollege,
    authorBatch,
    userId,
    createdAt
  } = experience;

  const OutcomeIcon = outcomeConfig[outcome]?.icon || CheckCircle2;
  const outcomeStyle = outcomeConfig[outcome] || outcomeConfig['In Progress'];
  const difficultyStyle = difficultyConfig[difficulty];
  const isOwner = currentUser?.uid === userId;

  const timeAgo = createdAt?.toDate 
    ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true })
    : 'Recently';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Card */}
          <div className={`bg-white rounded-2xl border ${outcomeStyle.border} p-6 md:p-8 mb-6`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  {company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{company}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4" />
                    {role}
                  </p>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${outcomeStyle.bg} ${outcomeStyle.color} text-lg font-semibold`}>
                <OutcomeIcon className="w-5 h-5" />
                {outcome}
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <MetaTag icon={Calendar} label={year} color="gray" />
              <MetaTag label={interviewType} color="indigo" />
              {difficulty && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${difficultyStyle.bg} ${difficultyStyle.color} font-medium`}>
                  {difficulty}
                </span>
              )}
              {rounds && (
                <MetaTag label={`${rounds} Rounds`} color="purple" />
              )}
              {ctcOffered && (
                <MetaTag icon={DollarSign} label={ctcOffered} color="green" />
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{authorName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {authorCollege} • Batch {authorBatch}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {timeAgo}
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <Link
                  to={`/edit/${id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Experience Content */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Experience</h2>
            <div className="prose prose-gray max-w-none">
              {experienceText.split('\n').map((paragraph, i) => (
                <p key={i} className="text-gray-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Questions Asked */}
          {questions && questions.length > 0 && questions.some(q => q.trim()) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                Questions Asked
              </h2>
              <ul className="space-y-3">
                {questions.filter(q => q.trim()).map((question, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{question}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {tips && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Tips for Future Candidates
              </h2>
              <div className="prose prose-gray max-w-none">
                {tips.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Experience?</h3>
                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function MetaTag({ icon: Icon, label, color }) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colorClasses[color]} font-medium`}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </span>
  );
}
