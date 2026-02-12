import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(isFirebaseConfigured);

  async function signup(email, password, displayName, college, batch) {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    
    // Create user profile in Firestore
    const userDoc = {
      uid: result.user.uid,
      email,
      displayName,
      college,
      batch,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', result.user.uid), userDoc);
    setUserProfile(userDoc);
    
    return result;
  }

  function login(email, password) {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (!isFirebaseConfigured) {
      return Promise.resolve();
    }
    return signOut(auth);
  }

  function resetPassword(email) {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    return sendPasswordResetEmail(auth, email);
  }

  async function fetchUserProfile(uid) {
    if (!isFirebaseConfigured || !db) return;
    
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    firebaseReady
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
