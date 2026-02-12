import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  createExperience, 
  COMPANIES, 
  ROLES, 
  YEARS, 
  OUTCOMES, 
  INTERVIEW_TYPES,
  DIFFICULTY_LEVELS
} from '../services/experiences';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareExperience() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company: '',
    customCompany: '',
    role: '',
    customRole: '',
    year: '',
    interviewType: '',
    outcome: '',
    difficulty: '',
    rounds: '',
    questions: [''],
    tips: '',
    experience: '',
    ctcOffered: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    const company = formData.company === 'Other' ? formData.customCompany : formData.company;
    const role = formData.role === 'Other' ? formData.customRole : formData.role;

    if (!company || !role || !formData.year || !formData.interviewType || !formData.outcome) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.experience || formData.experience.length < 50) {
      setError('Please share your experience in detail (at least 50 characters)');
      return;
    }

    setLoading(true);
    try {
      const data = {
        company,
        role,
        year: formData.year,
        interviewType: formData.interviewType,
        outcome: formData.outcome,
        difficulty: formData.difficulty,
        rounds: formData.rounds ? parseInt(formData.rounds) : null,
        questions: formData.questions.filter(q => q.trim()),
        tips: formData.tips,
        experience: formData.experience,
        ctcOffered: formData.ctcOffered
      };

      await createExperience(data, currentUser.uid, userProfile);
      toast.success('Experience shared successfully!');
      navigate('/explore');
    } catch (err) {
      console.error('Error creating experience:', err);
      setError('Failed to share experience. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Interview Experience
            </h1>
            <p className="text-gray-600">
              Help fellow students by sharing what you learned from your interview
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company & Role */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="inline w-4 h-4 mr-1" />
                    Company *
                  </label>
                  <SelectWithCustom
                    name="company"
                    value={formData.company}
                    customValue={formData.customCompany}
                    onChange={handleChange}
                    onCustomChange={(v) => setFormData(prev => ({ ...prev, customCompany: v }))}
                    options={COMPANIES}
                    placeholder="Select company"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Role *
                  </label>
                  <SelectWithCustom
                    name="role"
                    value={formData.role}
                    customValue={formData.customRole}
                    onChange={handleChange}
                    onCustomChange={(v) => setFormData(prev => ({ ...prev, customRole: v }))}
                    options={ROLES}
                    placeholder="Select role"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Year, Type, Outcome */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="">Select year</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type *
                  </label>
                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="">Select type</option>
                    {INTERVIEW_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle2 className="inline w-4 h-4 mr-1" />
                    Outcome *
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="">Select outcome</option>
                    {OUTCOMES.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty, Rounds, CTC */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="">Select difficulty</option>
                    {DIFFICULTY_LEVELS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rounds
                  </label>
                  <input
                    type="number"
                    name="rounds"
                    value={formData.rounds}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTC Offered (LPA)
                  </label>
                  <input
                    type="text"
                    name="ctcOffered"
                    value={formData.ctcOffered}
                    onChange={handleChange}
                    placeholder="e.g., 12 LPA"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Questions Asked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <HelpCircle className="inline w-4 h-4 mr-1" />
                  Questions Asked
                </label>
                <div className="space-y-3">
                  {formData.questions.map((q, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                        placeholder={`Question ${index + 1}`}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        disabled={loading}
                      />
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          disabled={loading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Question
                  </button>
                </div>
              </div>

              {/* Full Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Interview Experience *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Share your complete interview experience in detail. Include the process, rounds, what was asked, how you prepared, and any other relevant information..."
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-400">
                  {formData.experience.length}/50 characters minimum
                </p>
              </div>

              {/* Tips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lightbulb className="inline w-4 h-4 mr-1" />
                  Tips for Future Candidates
                </label>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleChange}
                  placeholder="What would you advise someone preparing for this company/role?"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  disabled={loading}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Share Experience
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SelectWithCustom({ name, value, customValue, onChange, onCustomChange, options, placeholder, disabled }) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {value === 'Other' && (
        <motion.input
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder={`Enter ${name}`}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          disabled={disabled}
        />
      )}
    </div>
  );
}
