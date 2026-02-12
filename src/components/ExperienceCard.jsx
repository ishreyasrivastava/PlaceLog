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
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

export default function ExperienceCard({ experience, index = 0 }) {
  const { 
    id, 
    company, 
    role, 
    year, 
    outcome, 
    interviewType,
    difficulty,
    authorName, 
    authorCollege,
    rounds,
    createdAt 
  } = experience;

  const OutcomeIcon = outcomeConfig[outcome]?.icon || CheckCircle2;
  const outcomeStyle = outcomeConfig[outcome] || outcomeConfig['In Progress'];
  const difficultyStyle = difficultyConfig[difficulty] || difficultyConfig['Medium'];

  const timeAgo = createdAt?.toDate 
    ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true })
    : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/experience/${id}`}>
        <div className={`bg-white rounded-2xl border ${outcomeStyle.border} p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {company.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                  {company}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {role}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${outcomeStyle.bg} ${outcomeStyle.color} text-sm font-medium`}>
              <OutcomeIcon className="w-4 h-4" />
              {outcome}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              {year}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-lg text-sm text-indigo-600">
              {interviewType}
            </span>
            {difficulty && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${difficultyStyle.bg} ${difficultyStyle.color}`}>
                {difficulty}
              </span>
            )}
            {rounds && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg text-sm text-purple-600">
                {rounds} rounds
              </span>
            )}
          </div>

          {/* Author & Time */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span>{authorName}</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {authorCollege}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo}
            </div>
          </div>

          {/* Read More */}
          <div className="flex items-center justify-end mt-3 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read full experience
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
