import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileX, 
  Plus, 
  UserX, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const variants = {
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    color: 'text-gray-400'
  },
  'no-experiences': {
    icon: FileX,
    title: 'No experiences yet',
    description: 'Be the first to share your interview experience and help your peers!',
    color: 'text-indigo-400',
    actionText: 'Share Your Experience',
    actionLink: '/share'
  },
  'no-user-experiences': {
    icon: UserX,
    title: 'You haven\'t shared any experiences',
    description: 'Share your interview experiences to help fellow students prepare better.',
    color: 'text-purple-400',
    actionText: 'Share Your First Experience',
    actionLink: '/share'
  },
  'error': {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'We couldn\'t load the data. Please try again.',
    color: 'text-red-400',
    showRetry: true
  },
  'not-found': {
    icon: FileX,
    title: 'Experience not found',
    description: 'The experience you\'re looking for doesn\'t exist or has been removed.',
    color: 'text-gray-400',
    actionText: 'Browse All Experiences',
    actionLink: '/explore'
  }
};

export default function EmptyState({ 
  variant = 'no-results', 
  title,
  description,
  actionText,
  actionLink,
  onRetry
}) {
  const config = variants[variant];
  const Icon = config.icon;
  
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || config.actionText;
  const finalActionLink = actionLink || config.actionLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 ${config.color}`}
      >
        <Icon className="w-10 h-10" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {finalTitle}
      </h3>
      
      <p className="text-gray-500 text-center max-w-md mb-6">
        {finalDescription}
      </p>
      
      {finalActionLink && (
        <Link
          to={finalActionLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          {finalActionText}
        </Link>
      )}
      
      {config.showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
