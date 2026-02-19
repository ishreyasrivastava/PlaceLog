import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center page-bg">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">{text}</p>
      </motion.div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2" />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
