import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2, XCircle, Hourglass, TrendingUp, ChevronRight, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const outcomeStyles = {
  'Selected': { icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200/50 dark:border-emerald-800/30' },
  'Rejected': { icon: XCircle, cls: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50', border: 'border-red-200/50 dark:border-red-800/30' },
  'Waitlisted': { icon: Hourglass, cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200/50 dark:border-amber-800/30' },
  'In Progress': { icon: TrendingUp, cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200/50 dark:border-blue-800/30' }
};

const diffStyles = {
  'Easy': 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400',
  'Medium': 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  'Hard': 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
};

export default function ExperienceCard({ experience, index = 0 }) {
  const { id, company, role, year, outcome, interviewType, difficulty, ctcOffered, authorName, createdAt } = experience;
  const style = outcomeStyles[outcome] || outcomeStyles['In Progress'];
  const Icon = style.icon;
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Recently';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link to={`/experience/${id}`} className="block group">
        <div className={`glass-card-hover p-6 border ${style.border}`}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">{company.charAt(0)}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{company}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{role}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${style.cls}`}><Icon className="w-3.5 h-3.5" />{outcome}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"><Calendar className="w-3.5 h-3.5" />{year}</span>
            {interviewType && <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">{interviewType}</span>}
            {difficulty && <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${diffStyles[difficulty] || ''}`}>{difficulty}</span>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/50">
            <span className="text-xs text-gray-400 dark:text-gray-500">by {authorName} • {timeAgo}</span>
            {ctcOffered && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><DollarSign className="w-3 h-3" />{ctcOffered}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
