import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Briefcase, Calendar, User, GraduationCap, CheckCircle2, XCircle, Hourglass, TrendingUp, HelpCircle, Lightbulb, Clock, Edit2, Trash2, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { getExperience, deleteExperience } from '../services/experiences';
import { useAuth } from '../contexts/AuthContext';
import { FullPageLoader } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const outcomeConfig = {
  'Selected': { icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200 dark:border-emerald-800/50' },
  'Rejected': { icon: XCircle, cls: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50', border: 'border-red-200 dark:border-red-800/50' },
  'Waitlisted': { icon: Hourglass, cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200 dark:border-amber-800/50' },
  'In Progress': { icon: TrendingUp, cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200 dark:border-blue-800/50' }
};

const diffStyles = { 'Easy': 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400', 'Medium': 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400', 'Hard': 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400' };

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => { getExperience(id).then(d => { setExp(d); setLoading(false); }).catch(() => setLoading(false)); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteExperience(id); toast.success('Deleted'); navigate('/explore'); }
    catch { toast.error('Failed to delete'); } finally { setDeleting(false); }
  };

  if (loading) return <FullPageLoader text="Loading..." />;
  if (!exp) return <div className="page-bg flex items-center justify-center"><EmptyState variant="not-found" /></div>;

  const o = outcomeConfig[exp.outcome] || outcomeConfig['In Progress'];
  const OIcon = o.icon;
  const isOwner = currentUser?.id === exp.userId;
  const timeAgo = exp.createdAt ? formatDistanceToNow(new Date(exp.createdAt), { addSuffix: true }) : 'Recently';

  return (
    <div className="page-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"><ArrowLeft className="w-4 h-4" />Back to Explore</Link>

        <div>
          {/* Header */}
          <div className={`glass-card p-6 md:p-8 mb-6 border ${o.border}`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-100 dark:bg-brand-950/50 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-2xl">{exp.company.charAt(0)}</div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{exp.company}</h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1"><Briefcase className="w-4 h-4" />{exp.role}</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-semibold ${o.cls}`}><OIcon className="w-5 h-5" />{exp.outcome}</div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Tag label={exp.year} />
              <Tag label={exp.interviewType} color="brand" />
              {exp.difficulty && <span className={`px-3 py-1.5 rounded-lg font-medium ${diffStyles[exp.difficulty] || ''}`}>{exp.difficulty}</span>}
              {exp.rounds && <Tag label={`${exp.rounds} Rounds`} />}
              {exp.ctcOffered && <Tag label={exp.ctcOffered} color="emerald" icon={DollarSign} />}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-500 dark:text-gray-400" /></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{exp.authorName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" />{exp.authorCollege} • Batch {exp.authorBatch}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><Clock className="w-4 h-4" />{timeAgo}</div>
            </div>

            {isOwner && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <Link to={`/edit/${id}`} className="btn-ghost"><Edit2 className="w-4 h-4" />Edit</Link>
                <button onClick={() => setShowDelete(true)} className="btn-ghost text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"><Trash2 className="w-4 h-4" />Delete</button>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="glass-card p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interview Experience</h2>
            <div className="prose dark:prose-invert max-w-none">{exp.experience.split('\n').map((p, i) => <p key={i} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{p}</p>)}</div>
          </div>

          {/* Questions */}
          {exp.questions?.length > 0 && exp.questions.some(q => q.trim()) && (
            <div className="glass-card p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-brand-500" />Questions Asked</h2>
              <ul className="space-y-3">{exp.questions.filter(q => q.trim()).map((q, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-sm font-medium">{i + 1}</span>
                  <span className="text-gray-700 dark:text-gray-300">{q}</span>
                </li>
              ))}</ul>
            </div>
          )}

          {/* Tips */}
          {exp.tips && (
            <div className="glass-card p-6 md:p-8 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />Tips</h2>
              <div className="prose dark:prose-invert max-w-none">{exp.tips.split('\n').map((p, i) => <p key={i} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{p}</p>)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
              <div><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete?</h3><p className="text-gray-500 dark:text-gray-400 text-sm">This can't be undone.</p></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className="flex-1 btn-secondary" disabled={deleting}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-primary !from-red-600 !to-red-600">
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, color = 'gray', icon: Icon }) {
  const cls = color === 'brand' ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
    : color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${cls}`}>{Icon && <Icon className="w-4 h-4" />}{label}</span>;
}
