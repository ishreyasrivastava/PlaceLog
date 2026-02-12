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
import { db, isFirebaseConfigured } from './firebase';

const COLLECTION = 'experiences';

// Demo data for when Firebase isn't configured
const DEMO_EXPERIENCES = [
  {
    id: 'demo-1',
    company: 'Google',
    role: 'Software Engineer',
    year: '2026',
    outcome: 'Selected',
    interviewType: 'On-Campus',
    difficulty: 'Hard',
    rounds: 5,
    questions: [
      'Design a URL shortener system',
      'Implement LRU Cache',
      'Find the median of two sorted arrays'
    ],
    tips: 'Focus on system design and practice LeetCode hard problems. Communication is key!',
    experience: 'The interview process started with an online coding round with 3 problems. Then there were 2 technical rounds focusing on DSA and system design, followed by a behavioral round.',
    ctcOffered: '45 LPA',
    authorName: 'Demo User',
    authorCollege: 'Demo College',
    authorBatch: '2026',
    userId: 'demo-user',
    createdAt: { toDate: () => new Date('2026-01-15') }
  },
  {
    id: 'demo-2',
    company: 'Microsoft',
    role: 'Software Developer',
    year: '2026',
    outcome: 'Selected',
    interviewType: 'On-Campus',
    difficulty: 'Medium',
    rounds: 4,
    questions: [
      'Reverse a linked list',
      'Design a parking lot system',
      'Binary tree level order traversal'
    ],
    tips: 'Be thorough with your basics. Practice explaining your thought process out loud.',
    experience: 'Great experience overall. The interviewers were friendly and helpful. Focus on problem-solving approach rather than just the solution.',
    ctcOffered: '42 LPA',
    authorName: 'Demo User 2',
    authorCollege: 'Demo College',
    authorBatch: '2026',
    userId: 'demo-user-2',
    createdAt: { toDate: () => new Date('2026-01-20') }
  },
  {
    id: 'demo-3',
    company: 'Amazon',
    role: 'SDE-1',
    year: '2025',
    outcome: 'Rejected',
    interviewType: 'Off-Campus',
    difficulty: 'Hard',
    rounds: 4,
    questions: [
      'Tell me about a time you had a conflict with a teammate',
      'Design a rate limiter',
      'Find all anagrams in a string'
    ],
    tips: 'Amazon focuses heavily on Leadership Principles. Prepare STAR format stories for behavioral questions.',
    experience: 'The behavioral round was challenging. Make sure to prepare specific examples from your projects.',
    ctcOffered: '-',
    authorName: 'Demo User 3',
    authorCollege: 'Demo College',
    authorBatch: '2025',
    userId: 'demo-user-3',
    createdAt: { toDate: () => new Date('2025-12-10') }
  }
];

export async function createExperience(data, userId, userProfile) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Please set up Firebase to create experiences.');
  }

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
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteExperience(id) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getExperience(id) {
  // Return demo experience if not configured
  if (!isFirebaseConfigured || !db) {
    return DEMO_EXPERIENCES.find(exp => exp.id === id) || null;
  }

  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getAllExperiences() {
  // Return demo data if Firebase is not configured
  if (!isFirebaseConfigured || !db) {
    return DEMO_EXPERIENCES;
  }

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
  // Return empty for demo mode
  if (!isFirebaseConfigured || !db) {
    return DEMO_EXPERIENCES.filter(exp => exp.userId === userId);
  }

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
  // Use demo data if not configured
  if (!isFirebaseConfigured || !db) {
    let results = [...DEMO_EXPERIENCES];
    
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
    
    return results;
  }

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
