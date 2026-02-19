import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { createExperience, COMPANIES, ROLES, YEARS, OUTCOMES, INTERVIEW_TYPES, DIFFICULTY_LEVELS } from '../services/experiences';
import { Building2, Briefcase, Calendar, CheckCircle2, HelpCircle, Lightbulb, AlertCircle, Loader2, Plus, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareExperience() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ company: '', customCompany: '', role: '', customRole: '', year: '', interviewType: '', outcome: '', difficulty: '', rounds: '', questions: [''], tips: '', experience: '', ctcOffered: '' });

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
    setLoading(true);
    try {
      await createExperience({ company, role, year: form.year, interviewType: form.interviewType, outcome: form.outcome, difficulty: form.difficulty, rounds: form.rounds ? parseInt(form.rounds) : null, questions: form.questions.filter(q => q.trim()), tips: form.tips, experience: form.experience, ctcOffered: form.ctcOffered }, currentUser.id, userProfile);
      toast.success('Shared successfully!'); navigate('/explore');
    } catch (err) { setError('Failed to share. Try again.'); } finally { setLoading(false); }
  }

  return (
    <div className="page-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Share Your Interview Experience</h1>
            <p className="text-gray-600 dark:text-gray-400">Help fellow students prepare better</p>
          </div>

          <div className="glass-card p-6 md:p-8">
            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-red-600 dark:text-red-400 text-sm">{error}</p></motion.div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Building2 className="inline w-4 h-4 mr-1" />Company *</label><SelectCustom name="company" value={form.company} custom={form.customCompany} onChange={set} onCustom={v => setForm(p => ({ ...p, customCompany: v }))} options={COMPANIES} placeholder="Select company" disabled={loading} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Briefcase className="inline w-4 h-4 mr-1" />Role *</label><SelectCustom name="role" value={form.role} custom={form.customRole} onChange={set} onCustom={v => setForm(p => ({ ...p, customRole: v }))} options={ROLES} placeholder="Select role" disabled={loading} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Calendar className="inline w-4 h-4 mr-1" />Year *</label><select name="year" value={form.year} onChange={set} className="glass-input" disabled={loading}><option value="">Select</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label><select name="interviewType" value={form.interviewType} onChange={set} className="glass-input" disabled={loading}><option value="">Select</option>{INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><CheckCircle2 className="inline w-4 h-4 mr-1" />Outcome *</label><select name="outcome" value={form.outcome} onChange={set} className="glass-input" disabled={loading}><option value="">Select</option>{OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label><select name="difficulty" value={form.difficulty} onChange={set} className="glass-input" disabled={loading}><option value="">Select</option>{DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rounds</label><input type="number" name="rounds" value={form.rounds} onChange={set} placeholder="e.g., 4" min="1" max="10" className="glass-input" disabled={loading} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTC Offered</label><input name="ctcOffered" value={form.ctcOffered} onChange={set} placeholder="e.g., 12 LPA" className="glass-input" disabled={loading} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><HelpCircle className="inline w-4 h-4 mr-1" />Questions Asked</label>
                <div className="space-y-3">
                  {form.questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={q} onChange={e => updateQ(i, e.target.value)} placeholder={`Question ${i + 1}`} className="flex-1 glass-input" disabled={loading} />
                      {form.questions.length > 1 && <button type="button" onClick={() => removeQ(i)} className="p-3 text-gray-400 hover:text-red-500 rounded-xl" disabled={loading}><Trash2 className="w-5 h-5" /></button>}
                    </div>
                  ))}
                  <button type="button" onClick={addQ} className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium text-sm"><Plus className="w-4 h-4" />Add Question</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Experience *</label>
                <textarea name="experience" value={form.experience} onChange={set} placeholder="Share your complete interview experience..." rows={8} className="glass-input resize-none" disabled={loading} />
                <p className="mt-1 text-xs text-gray-400">{form.experience.length}/50 min</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Lightbulb className="inline w-4 h-4 mr-1" />Tips</label>
                <textarea name="tips" value={form.tips} onChange={set} placeholder="Tips for future candidates..." rows={4} className="glass-input resize-none" disabled={loading} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => navigate(-1)} className="btn-secondary" disabled={loading}>Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sharing...</> : <><CheckCircle2 className="w-5 h-5" />Share Experience</>}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SelectCustom({ name, value, custom, onChange, onCustom, options, placeholder, disabled }) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <select name={name} value={value} onChange={onChange} className="glass-input appearance-none" disabled={disabled}><option value="">{placeholder}</option>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {value === 'Other' && <input value={custom} onChange={e => onCustom(e.target.value)} placeholder={`Enter ${name}`} className="glass-input" disabled={disabled} />}
    </div>
  );
}
