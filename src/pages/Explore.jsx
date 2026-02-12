import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { searchExperiences, COMPANIES, ROLES, YEARS, OUTCOMES, INTERVIEW_TYPES } from '../services/experiences';

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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      role: '',
      year: '',
      outcome: '',
      interviewType: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Experiences
          </h1>
          <p className="text-gray-600">
            Find interview experiences by company, role, or year
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full" />
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
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-200"
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
                <FilterSelect
                  label="Role"
                  value={filters.role}
                  onChange={(v) => handleFilterChange('role', v)}
                  options={ROLES}
                  fullWidth
                />
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <FilterTag 
                label={`Search: "${searchQuery}"`} 
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
            {filters.role && (
              <FilterTag 
                label={`Role: ${filters.role}`} 
                onRemove={() => handleFilterChange('role', '')} 
              />
            )}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <p className="text-gray-500 mb-6">
            {experiences.length} experience{experiences.length !== 1 ? 's' : ''} found
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, fullWidth = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer ${fullWidth ? 'w-full' : ''}`}
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-indigo-800">
        <X className="w-4 h-4" />
      </button>
    </span>
  );
}
