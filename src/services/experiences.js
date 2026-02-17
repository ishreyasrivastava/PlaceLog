import { supabase } from '../lib/supabase';

export async function createExperience(data, userId, userProfile) {
  const experience = {
    user_id: userId,
    company: data.company,
    role: data.role,
    year: data.year,
    outcome: data.outcome,
    interview_type: data.interviewType,
    difficulty: data.difficulty || null,
    rounds: data.rounds || null,
    questions: data.questions?.filter(q => q.trim()) || [],
    tips: data.tips || null,
    experience: data.experience,
    ctc_offered: data.ctcOffered || null,
    author_name: userProfile?.display_name || 'Anonymous',
    author_college: userProfile?.college || 'Unknown College',
    author_batch: userProfile?.batch || 'Unknown Batch'
  };

  const { data: result, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return mapExperience(result);
}

export async function updateExperience(id, data) {
  const updateData = {
    company: data.company,
    role: data.role,
    year: data.year,
    outcome: data.outcome,
    interview_type: data.interviewType,
    difficulty: data.difficulty || null,
    rounds: data.rounds || null,
    questions: data.questions?.filter(q => q.trim()) || [],
    tips: data.tips || null,
    experience: data.experience,
    ctc_offered: data.ctcOffered || null
  };

  const { error } = await supabase.from('experiences').update(updateData).eq('id', id);
  if (error) throw error;
}

export async function deleteExperience(id) {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
}

export async function getExperience(id) {
  const { data, error } = await supabase.from('experiences').select('*').eq('id', id).single();
  if (error) return null;
  return mapExperience(data);
}

export async function getAllExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapExperience);
}

export async function getUserExperiences(userId) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapExperience);
}

export async function searchExperiences(filters) {
  let query = supabase.from('experiences').select('*').order('created_at', { ascending: false });

  if (filters.company) query = query.ilike('company', `%${filters.company}%`);
  if (filters.role) query = query.ilike('role', `%${filters.role}%`);
  if (filters.year) query = query.eq('year', filters.year);
  if (filters.outcome) query = query.eq('outcome', filters.outcome);
  if (filters.interviewType) query = query.eq('interview_type', filters.interviewType);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapExperience);
}

function mapExperience(exp) {
  if (!exp) return null;
  return {
    id: exp.id,
    userId: exp.user_id,
    company: exp.company,
    role: exp.role,
    year: exp.year,
    outcome: exp.outcome,
    interviewType: exp.interview_type,
    difficulty: exp.difficulty,
    rounds: exp.rounds,
    questions: exp.questions || [],
    tips: exp.tips,
    experience: exp.experience,
    ctcOffered: exp.ctc_offered,
    authorName: exp.author_name,
    authorCollege: exp.author_college,
    authorBatch: exp.author_batch,
    createdAt: exp.created_at,
    updatedAt: exp.updated_at
  };
}

export const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'Accenture',
  'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Deloitte', 'EY', 'KPMG', 'PwC',
  'Adobe', 'Salesforce', 'Oracle', 'SAP', 'IBM',
  'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'Razorpay', 'CRED',
  'Samsung', 'LG', 'Sony', 'Dell', 'HP', 'Lenovo',
  'Other'
];

export const ROLES = [
  'Software Engineer', 'Software Developer', 'Full Stack Developer',
  'Frontend Developer', 'Backend Developer', 'Mobile Developer',
  'Data Analyst', 'Data Scientist', 'Data Engineer',
  'DevOps Engineer', 'Cloud Engineer', 'SRE',
  'Product Manager', 'Business Analyst',
  'Machine Learning Engineer', 'AI Engineer',
  'QA Engineer', 'Test Engineer',
  'Associate', 'Analyst', 'Consultant',
  'Other'
];

export const INTERVIEW_TYPES = ['On-Campus', 'Off-Campus', 'Referral', 'Direct Apply', 'Pool Campus'];
export const OUTCOMES = ['Selected', 'Rejected', 'Waitlisted', 'In Progress'];
export const YEARS = ['2024', '2025', '2026', '2027', '2028'];
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];
