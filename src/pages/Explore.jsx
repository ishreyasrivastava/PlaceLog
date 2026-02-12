import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { searchExperiences, YEARS, OUTCOMES, INTERVIEW_TYPES } from '../services/experiences';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

export default function Explore() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    year: '',
    outcome: '',
    interviewType: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchFilters = {
        ...filters,
        company: debouncedSearch || filters.company
      };
      const results = await searchExperiences(searchFilters);
      setExperiences(results);
    } catch (err) {
      console.error('Error searching experiences:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      company: '',
      role: '',
      year: '',
      outcome: '',
      interviewType: ''
    });
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => 
    Object.values(filters).some(v => v) || searchQuery,
    [filters, searchQuery]
  );

  const activeFilterCount = useMemo(() => 
    Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0),
    [filters, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore Experiences
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Find interview experiences by company, role, or year
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium text-gray-700 transition-colors border-2 border-gray-100"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              <FilterSelect
                label="Year"
                value={filters.year}
                onChange={(v) => handleFilterChange('year', v)}
                options={YEARS}
              />
              <FilterSelect
                label="Outcome"
                value={filters.outcome}
                onChange={(v) => handleFilterChange('outcome', v)}
                options={OUTCOMES}
              />
              <FilterSelect
                label="Type"
                value={filters.interviewType}
                onChange={(v) => handleFilterChange('interviewType', v)}
                options={INTERVIEW_TYPES}
              />
              
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-100 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FilterSelect
                    label="Year"
                    value={filters.year}
                    onChange={(v) => handleFilterChange('year', v)}
                    options={YEARS}
                    fullWidth
                  />
                  <FilterSelect
                    label="Outcome"
                    value={filters.outcome}
                    onChange={(v) => handleFilterChange('outcome', v)}
                    options={OUTCOMES}
                    fullWidth
                  />
                  <FilterSelect
                    label="Type"
                    value={filters.interviewType}
                    onChange={(v) => handleFilterChange('interviewType', v)}
                    options={INTERVIEW_TYPES}
                    fullWidth
                  />
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Filter Tags */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {searchQuery && (
                <FilterTag 
                  label={`Search: "${searchQuery.slice(0, 20)}${searchQuery.length > 20 ? '...' : ''}"`} 
                  onRemove={() => setSearchQuery('')} 
                />
              )}
              {filters.year && (
                <FilterTag 
                  label={`Year: ${filters.year}`} 
                  onRemove={() => handleFilterChange('year', '')} 
                />
              )}
              {filters.outcome && (
                <FilterTag 
                  label={`Outcome: ${filters.outcome}`} 
                  onRemove={() => handleFilterChange('outcome', '')} 
                />
              )}
              {filters.interviewType && (
                <FilterTag 
                  label={`Type: ${filters.interviewType}`} 
                  onRemove={() => handleFilterChange('interviewType', '')} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {!loading && !error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 mb-6 font-medium"
          >
            {experiences.length} experience{experiences.length !== 1 ? 's' : ''} found
          </motion.p>
        )}

        {/* Results */}
        {loading ? (
          <GridSkeleton count={9} />
        ) : error ? (
          <EmptyState 
            variant="error" 
            onRetry={fetchExperiences} 
          />
        ) : experiences.length === 0 ? (
          <EmptyState 
            variant={hasActiveFilters ? 'no-results' : 'no-experiences'}
            actionText={hasActiveFilters ? null : 'Share Your Experience'}
            actionLink={hasActiveFilters ? null : '/share'}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, fullWidth = false }) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none cursor-pointer
          px-4 py-2.5 pr-10 
          bg-gray-50 hover:bg-gray-100 
          border-2 border-gray-100 hover:border-gray-200
          rounded-xl text-gray-700 font-medium
          focus:outline-none focus:border-indigo-300 focus:bg-white
          transition-all
          ${fullWidth ? 'w-full' : ''}
          ${value ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}
        `}
      >
        <option value="">{label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
    >
      {label}
      <button 
        onClick={onRemove} 
        className="hover:text-indigo-900 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.span>
  );
}
