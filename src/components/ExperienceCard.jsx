import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  User, 
  GraduationCap,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  TrendingUp,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const outcomeConfig = {
  'Selected': { 
    icon: CheckCircle2, 
    color: 'text-emerald-600', 
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50', 
    border: 'border-emerald-200/50',
    glow: 'shadow-emerald-500/10'
  },
  'Rejected': { 
    icon: XCircle, 
    color: 'text-red-500', 
    bg: 'bg-gradient-to-r from-red-50 to-rose-50', 
    border: 'border-red-200/50',
    glow: 'shadow-red-500/10'
  },
  'Waitlisted': { 
    icon: Hourglass, 
    color: 'text-amber-600', 
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
    border: 'border-amber-200/50',
    glow: 'shadow-amber-500/10'
  },
  'In Progress': { 
    icon: TrendingUp, 
    color: 'text-blue-600', 
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', 
    border: 'border-blue-200/50',
    glow: 'shadow-blue-500/10'
  }
};

const difficultyConfig = {
  'Easy': { color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  'Medium': { color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  'Hard': { color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-500' }
};

// Company logo colors
const companyColors = {
  'Google': 'from-blue-500 to-green-500',
  'Microsoft': 'from-blue-600 to-cyan-500',
  'Amazon': 'from-orange-500 to-yellow-500',
  'Meta': 'from-blue-600 to-indigo-600',
  'Apple': 'from-gray-700 to-gray-900',
  'Netflix': 'from-red-600 to-red-800',
  'TCS': 'from-purple-600 to-indigo-600',
  'Infosys': 'from-blue-600 to-blue-800',
  'Wipro': 'from-purple-500 to-pink-500',
  'default': 'from-indigo-500 to-purple-600'
};

function ExperienceCard({ experience, index = 0 }) {
  const { 
    id, 
    company, 
    role, 
    year, 
    outcome, 
    interviewType,
    difficulty,
    rounds,
    ctcOffered,
    authorName, 
    authorCollege,
    createdAt 
  } = experience;

  const OutcomeIcon = outcomeConfig[outcome]?.icon || TrendingUp;
  const outcomeStyle = outcomeConfig[outcome] || outcomeConfig['In Progress'];
  const difficultyStyle = difficultyConfig[difficulty];
  const companyGradient = companyColors[company] || companyColors['default'];

  const timeAgo = useMemo(() => {
    try {
      const date = createdAt?.toDate?.() || new Date(createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  }, [createdAt]);

  // Sanitize display text
  const safeCompany = company?.slice(0, 50) || 'Unknown';
  const safeRole = role?.slice(0, 60) || 'Unknown Role';
  const safeAuthor = authorName?.slice(0, 30) || 'Anonymous';
  const safeCollege = authorCollege?.slice(0, 40) || 'College';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={`/experience/${id}`} className="block">
        <article className={`
          relative bg-white rounded-2xl overflow-hidden
          border ${outcomeStyle.border}
          shadow-lg ${outcomeStyle.glow}
          hover:shadow-2xl hover:shadow-indigo-500/10
          transition-all duration-300
        `}>
          {/* Gradient accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${companyGradient}`} />
          
          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center 
                  text-white font-bold text-lg sm:text-xl
                  bg-gradient-to-br ${companyGradient}
                  shadow-lg shadow-indigo-500/20
                  flex-shrink-0
                `}>
                  {safeCompany.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-indigo-600 transition-colors">
                    {safeCompany}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{safeRole}</span>
                  </p>
                </div>
              </div>
              
              {/* Outcome Badge */}
              <div className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                ${outcomeStyle.bg} ${outcomeStyle.color} 
                text-sm font-semibold whitespace-nowrap
                border ${outcomeStyle.border}
              `}>
                <OutcomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{outcome}</span>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tag">
                <Calendar className="w-3.5 h-3.5" />
                {year}
              </span>
              <span className="tag bg-indigo-50 text-indigo-600 border border-indigo-100">
                {interviewType}
              </span>
              {difficulty && difficultyStyle && (
                <span className={`tag ${difficultyStyle.bg} ${difficultyStyle.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${difficultyStyle.dot}`} />
                  {difficulty}
                </span>
              )}
              {rounds && (
                <span className="tag bg-purple-50 text-purple-600 border border-purple-100">
                  {rounds} {rounds === 1 ? 'Round' : 'Rounds'}
                </span>
              )}
              {ctcOffered && (
                <span className="tag bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <DollarSign className="w-3 h-3" />
                  {ctcOffered}
                </span>
              )}
            </div>

            {/* Author & Time */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">
              <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
                <div className="w-7 h-7 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <span className="font-medium text-gray-700 truncate">{safeAuthor}</span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{safeCollege}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{timeAgo}</span>
                <span className="sm:hidden">{timeAgo.replace(' ago', '')}</span>
              </div>
            </div>

            {/* Read More - appears on hover */}
            <div className="flex items-center justify-end gap-1 mt-3 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Read full experience
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ExperienceCard);
