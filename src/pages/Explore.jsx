import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import { GridSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { searchExperiences, YEARS, OUTCOMES, INTERVIEW_TYPES } from '../services/experiences';

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDv(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return dv;
}

export default function Explore() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ company: '', role: '', year: '', outcome: '', interviewType: '' });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await searchExperiences({ ...filters, company: debouncedSearch || filters.company });
      setExperiences(r);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [filters, debouncedSearch]);

  useEffect(() => { fetch(); }, [fetch]);

  const setFilter = useCallback((k, v) => setFilters(p => ({ ...p, [k]: v })), []);
  const clearAll = useCallback(() => { setFilters({ company: '', role: '', year: '', outcome: '', interviewType: '' }); setSearch(''); }, []);
  const hasFilters = useMemo(() => Object.values(filters).some(v => v) || search, [filters, search]);
  const filterCount = useMemo(() => Object.values(filters).filter(v => v).length + (search ? 1 : 0), [filters, search]);

  return (
    <div className="page-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Explore Experiences</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Find interview experiences by company, role, or year</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by company..." value={search} onChange={e => setSearch(e.target.value)} className="input" />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary">
              <SlidersHorizontal className="w-5 h-5" />Filters
              {filterCount > 0 && <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">{filterCount}</span>}
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <FilterSelect label="Year" value={filters.year} onChange={v => setFilter('year', v)} options={YEARS} />
              <FilterSelect label="Outcome" value={filters.outcome} onChange={v => setFilter('outcome', v)} options={OUTCOMES} />
              <FilterSelect label="Type" value={filters.interviewType} onChange={v => setFilter('interviewType', v)} options={INTERVIEW_TYPES} />
              {hasFilters && <button onClick={clearAll} className="btn-ghost text-sm"><RotateCcw className="w-4 h-4" />Clear</button>}
            </div>
          </div>
          <AnimatePresence>{showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid grid-cols-2 gap-3">
                <FilterSelect label="Year" value={filters.year} onChange={v => setFilter('year', v)} options={YEARS} full />
                <FilterSelect label="Outcome" value={filters.outcome} onChange={v => setFilter('outcome', v)} options={OUTCOMES} full />
                <FilterSelect label="Type" value={filters.interviewType} onChange={v => setFilter('interviewType', v)} options={INTERVIEW_TYPES} full />
              </div>
              {hasFilters && <button onClick={clearAll} className="w-full mt-4 btn-ghost"><RotateCcw className="w-4 h-4" />Clear All</button>}
            </motion.div>
          )}</AnimatePresence>
        </motion.div>

        {!loading && !error && <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">{experiences.length} experience{experiences.length !== 1 ? 's' : ''} found</p>}

        {loading ? <GridSkeleton count={9} /> : error ? <EmptyState variant="error" onRetry={fetch} /> : experiences.length === 0 ? <EmptyState variant={hasFilters ? 'no-results' : 'no-experiences'} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{experiences.map((e, i) => <ExperienceCard key={e.id} experience={e} index={i} />)}</div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, full = false }) {
  return (
    <div className={`relative ${full ? 'w-full' : ''}`}>
      <select value={value} onChange={e => onChange(e.target.value)} className={`glass-input appearance-none cursor-pointer pr-10 ${full ? 'w-full' : ''} ${value ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400' : ''}`}>
        <option value="">{label}</option>{options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
