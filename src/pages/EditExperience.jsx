import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getExperience, updateExperience, COMPANIES, ROLES, YEARS, OUTCOMES, INTERVIEW_TYPES, DIFFICULTY_LEVELS } from '../services/experiences';
import { Building2, Briefcase, Calendar, CheckCircle2, HelpCircle, Lightbulb, AlertCircle, Loader2, Plus, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function EditExperience() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ company: '', customCompany: '', role: '', customRole: '', year: '', interviewType: '', outcome: '', difficulty: '', rounds: '', questions: [''], tips: '', experience: '', ctcOffered: '' });

  useEffect(() => {
    if (!currentUser) return;
    getExperience(id).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return; }
      if (data.userId !== currentUser?.id) { toast.error('You can only edit your own'); navigate('/profile'); return; }
      const isCustComp = !COMPANIES.includes(data.company);
      const isCustRole = !ROLES.includes(data.role);
      setForm({
        company: isCustComp ? 'Other' : data.company, customCompany: isCustComp ? data.company : '',
        role: isCustRole ? 'Other' : data.role, customRole: isCustRole ? data.role : '',
        year: data.year || '', interviewType: data.interviewType || '', outcome: data.outcome || '',
        difficulty: data.difficulty || '', rounds: data.rounds?.toString() || '',
        questions: data.questions?.length > 0 ? data.questions : [''],
        tips: data.tips || '', experience: data.experience || '', ctcOffered: data.ctcOffered || ''
      });
      setLoading(false);
    }).catch(() => { setError('Failed to load'); setLoading(false); });
  }, [id, currentUser, navigate]);

  const set = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };
  const addQ = () => setForm(p => ({ ...p, questions: [...p.questions, ''] }));
  const updateQ = (i, v) => { const q = [...form.questions]; q[i] = v; setForm(p => ({ ...p, questions: q })); };
  const removeQ = (i) => { if (form.questions.length > 1) setForm(p => ({ ...p, questions: p.questions.filter((_, j) => j !== i) })); };

  async function handleSubmit(e) {
    e.preventDefault(); setError('');
    const company = form.company === 'Other' ? form.customCompany : form.company;
    const role = form.role === 'Other' ? form.customRole : form.role;
    if (!company || !role || !form.year || !form.interviewType || !form.outcome) { setError('Fill all required fields'); return; }
    if (!form.experience || form.experience.length < 50) { setError('Experience must be at least 50 characters'); return; }
    setSaving(true);
    try {
      await updateExperience(id, { company, role, year: form.year, interviewType: form.interviewType, outcome: form.outcome, difficulty: form.difficulty, rounds: form.rounds ? parseInt(form.rounds) : null, questions: form.questions.filter(q => q.trim()), tips: form.tips, experience: form.experience, ctcOffered: form.ctcOffered });
      toast.success('Updated!'); navigate(`/experience/${id}`);
    } catch { setError('Failed to update.'); } finally { setSaving(false); }
  }

  if (loading) return <FullPageLoader text="Loading..." />;
  if (notFound) return <div className="page-bg flex items-center justify-center"><EmptyState variant="not-found" /></div>;

  return (
    <div className="page-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/experience/${id}`} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"><ArrowLeft className="w-4 h-4" />Back</Link>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Experience</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your interview experience</p>
          </div>

          <div className="glass-card p-6 md:p-8">
            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-red-600 dark:text-red-400 text-sm">{error}</p></div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Building2 className="inline w-4 h-4 mr-1" />Company *</label><Sel name="company" value={form.company} custom={form.customCompany} onChange={set} onCustom={v => setForm(p => ({ ...p, customCompany: v }))} options={COMPANIES} placeholder="Select" disabled={saving} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Briefcase className="inline w-4 h-4 mr-1" />Role *</label><Sel name="role" value={form.role} custom={form.customRole} onChange={set} onCustom={v => setForm(p => ({ ...p, customRole: v }))} options={ROLES} placeholder="Select" disabled={saving} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Calendar className="inline w-4 h-4 mr-1" />Year *</label><select name="year" value={form.year} onChange={set} className="glass-input" disabled={saving}><option value="">Select</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label><select name="interviewType" value={form.interviewType} onChange={set} className="glass-input" disabled={saving}><option value="">Select</option>{INTERVIEW_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><CheckCircle2 className="inline w-4 h-4 mr-1" />Outcome *</label><select name="outcome" value={form.outcome} onChange={set} className="glass-input" disabled={saving}><option value="">Select</option>{OUTCOMES.map(o => <option key={o}>{o}</option>)}</select></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label><select name="difficulty" value={form.difficulty} onChange={set} className="glass-input" disabled={saving}><option value="">Select</option>{DIFFICULTY_LEVELS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rounds</label><input type="number" name="rounds" value={form.rounds} onChange={set} placeholder="4" min="1" max="10" className="glass-input" disabled={saving} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTC</label><input name="ctcOffered" value={form.ctcOffered} onChange={set} placeholder="12 LPA" className="glass-input" disabled={saving} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><HelpCircle className="inline w-4 h-4 mr-1" />Questions</label>
                <div className="space-y-3">
                  {form.questions.map((q, i) => (
                    <div key={i} className="flex gap-2"><input value={q} onChange={e => updateQ(i, e.target.value)} placeholder={`Q ${i+1}`} className="flex-1 glass-input" disabled={saving} />
                    {form.questions.length > 1 && <button type="button" onClick={() => removeQ(i)} className="p-3 text-gray-400 hover:text-red-500 rounded-xl" disabled={saving}><Trash2 className="w-5 h-5" /></button>}</div>
                  ))}
                  <button type="button" onClick={addQ} className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium text-sm" disabled={saving}><Plus className="w-4 h-4" />Add</button>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience *</label><textarea name="experience" value={form.experience} onChange={set} rows={8} className="glass-input resize-none" disabled={saving} /><p className="mt-1 text-xs text-gray-400">{form.experience.length}/50 min</p></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Lightbulb className="inline w-4 h-4 mr-1" />Tips</label><textarea name="tips" value={form.tips} onChange={set} rows={4} className="glass-input resize-none" disabled={saving} /></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => navigate(`/experience/${id}`)} className="btn-secondary" disabled={saving}>Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">{saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : <><CheckCircle2 className="w-5 h-5" />Save</>}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sel({ name, value, custom, onChange, onCustom, options, placeholder, disabled }) {
  return (
    <div className="space-y-2">
      <div className="relative"><select name={name} value={value} onChange={onChange} className="glass-input appearance-none" disabled={disabled}><option value="">{placeholder}</option>{options.map(o => <option key={o}>{o}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
      {value === 'Other' && <input value={custom} onChange={e => onCustom(e.target.value)} placeholder={`Enter ${name}`} className="glass-input" disabled={disabled} />}
    </div>
  );
}
