import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileX, 
  Plus, 
  UserX, 
  AlertCircle,
  RefreshCw,
  Inbox,
  Sparkles
} from 'lucide-react';

const variants = {
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-100'
  },
  'no-experiences': {
    icon: Inbox,
    title: 'No experiences yet',
    description: 'Be the first to share your interview experience and help your peers succeed!',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-100',
    actionText: 'Share Your Experience',
    actionLink: '/share'
  },
  'no-user-experiences': {
    icon: Sparkles,
    title: 'You haven\'t shared any experiences',
    description: 'Share your interview journey to help fellow students prepare better. Your insights could make a difference!',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-100',
    actionText: 'Share Your First Experience',
    actionLink: '/share'
  },
  'error': {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'We couldn\'t load the data. Please check your connection and try again.',
    color: 'from-red-400 to-rose-500',
    bgColor: 'bg-red-100',
    showRetry: true
  },
  'not-found': {
    icon: FileX,
    title: 'Experience not found',
    description: 'The experience you\'re looking for doesn\'t exist or has been removed.',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-100',
    actionText: 'Browse All Experiences',
    actionLink: '/explore'
  },
  'offline': {
    icon: AlertCircle,
    title: 'You\'re offline',
    description: 'Please check your internet connection and try again.',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-100',
    showRetry: true
  }
};

export default function EmptyState({ 
  variant = 'no-results', 
  title,
  description,
  actionText,
  actionLink,
  onRetry,
  className = ''
}) {
  const config = variants[variant] || variants['no-results'];
  const Icon = config.icon;
  
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || config.actionText;
  const finalActionLink = actionLink || config.actionLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      {/* Icon Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="relative mb-6"
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 ${config.bgColor} rounded-full blur-2xl opacity-60 scale-150`} />
        
        {/* Icon circle */}
        <div className={`
          relative w-20 h-20 rounded-2xl 
          bg-gradient-to-br ${config.color}
          flex items-center justify-center
          shadow-lg
        `}>
          <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>
      
      {/* Title */}
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2 text-center"
      >
        {finalTitle}
      </motion.h3>
      
      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-center max-w-md mb-8 leading-relaxed"
      >
        {finalDescription}
      </motion.p>
      
      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {finalActionLink && (
          <Link
            to={finalActionLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            {finalActionText}
          </Link>
        )}
        
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// Compact version for inline use
export function EmptyStateInline({ message = 'No items found', icon: CustomIcon }) {
  const Icon = CustomIcon || Inbox;
  
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
