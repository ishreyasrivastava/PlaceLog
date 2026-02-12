import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...', className = '' }) {
  const sizes = {
    sm: { spinner: 'w-5 h-5', text: 'text-sm' },
    md: { spinner: 'w-8 h-8', text: 'text-base' },
    lg: { spinner: 'w-12 h-12', text: 'text-lg' }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
      <div className="relative">
        {/* Outer glow */}
        <div className={`absolute inset-0 ${sizeConfig.spinner} bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse`} />
        
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizeConfig.spinner} rounded-full border-3 border-indigo-100 border-t-indigo-600`}
          style={{ borderWidth: size === 'lg' ? '4px' : '3px' }}
        />
      </div>
      
      {text && (
        <p className={`${sizeConfig.text} text-gray-500 font-medium`}>{text}</p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50/50 via-white to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-6">
          {/* Background glow */}
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse" />
          
          {/* Logo spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="relative w-20 h-20 mx-auto"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="200"
                strokeDashoffset="50"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      </motion.div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="relative">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="h-7 w-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-7 w-20 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-7 w-14 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-40 bg-gray-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
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

export function InlineLoader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full"
      />
      <span className="text-sm">{text}</span>
    </div>
  );
}
