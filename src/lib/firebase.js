// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// NOTE: Replace with your actual Firebase config or environment variables.
const firebaseConfig = {
  // Your Firebase config
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:demo'
};

let app = null;
let auth = null;
let db = null;

try {
  // Check if we have actual Firebase config (not demo values)
  const hasRealConfig = firebaseConfig.apiKey !== 'demo-key' && 
                       firebaseConfig.projectId !== 'demo-project' &&
                       process.env.REACT_APP_FIREBASE_API_KEY;
  
  if (!hasRealConfig) {
    console.warn('[Firebase] No valid Firebase configuration found. Using demo mode.');
    // Create a mock auth object that won't cause errors
    auth = {
      __disabled: true,
      currentUser: null,
      onAuthStateChanged: (callback) => {
        // Immediately call with null user
        setTimeout(() => callback(null), 0);
        return () => {}; // Return unsubscribe function
      },
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
      signOut: () => Promise.resolve(),
    };
    db = null;
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('[Firebase] Successfully initialized');
  }
} catch (e) {
  console.error('[Firebase] Initialization failed:', e && e.message ? e.message : e);
  // Create mock auth object
  auth = {
    __disabled: true,
    currentUser: null,
    onAuthStateChanged: (callback) => {
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase initialization failed')),
    signOut: () => Promise.resolve(),
  };
  db = null;
}

export { db, auth };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */