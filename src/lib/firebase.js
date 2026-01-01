// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for PlusTech project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app = null;
let auth = null;
let db = null;
let storage = null;

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('[Firebase] Missing environment variables:', missingVars);
  console.error('[Firebase] Check Vercel environment variables or .env file');
} else {
  try {
    // Initialize Firebase with the real configuration
    app = initializeApp(firebaseConfig);
    // Auth is lazy-loaded - only initialize when needed (admin pages)
    // This reduces initial bundle size and blocking time
    db = getFirestore(app);
    storage = getStorage(app);
    
  } catch (e) {
    console.error('[Firebase] Initialization failed:', e && e.message ? e.message : e);
    console.error('[Firebase] Error details:', e);
    
    // Create mock auth object as fallback
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
    storage = null;
  }
}

// Export db and storage (always initialized)
export { db, storage };

// Auth is initialized lazily - only when getAuth() is called
// Since useAdminAuth imports from 'firebase/auth' and calls getAuth(),
// auth will only initialize when admin pages (which are lazy-loaded) actually load
// This prevents loading auth iframe (91KB) on public pages
export { auth };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */