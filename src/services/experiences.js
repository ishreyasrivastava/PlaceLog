import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'experiences';

export async function createExperience(data, userId, userProfile) {
  const experience = {
    ...data,
    userId,
    authorName: userProfile?.displayName || 'Anonymous',
    authorCollege: userProfile?.college || 'Unknown College',
    authorBatch: userProfile?.batch || 'Unknown Batch',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, COLLECTION), experience);
  return { id: docRef.id, ...experience };
}

export async function updateExperience(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteExperience(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getExperience(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getAllExperiences() {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getUserExperiences(userId) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function searchExperiences(filters) {
  // Start with base query
  let q = query(collection(db, COLLECTION));
  
  // Note: Firestore has limitations on compound queries
  // We'll fetch all and filter client-side for flexibility
  const querySnapshot = await getDocs(q);
  let results = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Client-side filtering
  if (filters.company) {
    results = results.filter(exp => 
      exp.company.toLowerCase().includes(filters.company.toLowerCase())
    );
  }
  
  if (filters.role) {
    results = results.filter(exp => 
      exp.role.toLowerCase().includes(filters.role.toLowerCase())
    );
  }
  
  if (filters.year) {
    results = results.filter(exp => exp.year === filters.year);
  }
  
  if (filters.outcome) {
    results = results.filter(exp => exp.outcome === filters.outcome);
  }
  
  if (filters.interviewType) {
    results = results.filter(exp => exp.interviewType === filters.interviewType);
  }
  
  // Sort by date (newest first)
  results.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB - dateA;
  });
  
  return results;
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

export const INTERVIEW_TYPES = [
  'On-Campus', 'Off-Campus', 'Referral', 'Direct Apply', 'Pool Campus'
];

export const OUTCOMES = [
  'Selected', 'Rejected', 'Waitlisted', 'In Progress'
];

export const YEARS = ['2024', '2025', '2026', '2027', '2028'];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];
