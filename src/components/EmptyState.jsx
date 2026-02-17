import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, AlertCircle, FileX } from 'lucide-react';

const variants = {
  'no-experiences': { icon: Plus, title: 'No experiences yet', desc: 'Be the first to share!', action: 'Share Experience', link: '/share' },
  'no-results': { icon: Search, title: 'No results found', desc: 'Try adjusting your filters.', action: null, link: null },
  'no-user-experiences': { icon: Plus, title: "You haven't shared yet", desc: 'Share your interview experience.', action: 'Share Experience', link: '/share' },
  'not-found': { icon: FileX, title: 'Not found', desc: "This experience doesn't exist.", action: 'Explore', link: '/explore' },
  'error': { icon: AlertCircle, title: 'Something went wrong', desc: 'Please try again.', action: null, link: null },
};

export default function EmptyState({ variant = 'no-experiences', onRetry }) {
  const c = variants[variant] || variants['no-experiences'];
  const Icon = c.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6"><Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{c.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">{c.desc}</p>
      {c.action && c.link && <Link to={c.link} className="btn-primary">{c.action}</Link>}
      {onRetry && <button onClick={onRetry} className="btn-primary">Try Again</button>}
    </motion.div>
  );
}
