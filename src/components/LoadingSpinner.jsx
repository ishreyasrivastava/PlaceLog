import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizes[size]} text-indigo-600`} />
      </motion.div>
      {text && (
        <p className="text-gray-500 text-sm">{text}</p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-7 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-100 rounded-lg" />
        <div className="h-6 w-20 bg-gray-100 rounded-lg" />
        <div className="h-6 w-14 bg-gray-100 rounded-lg" />
      </div>
      <div className="pt-4 border-t border-gray-100">
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
