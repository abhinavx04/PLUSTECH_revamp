// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Log configuration for debugging (especially mobile issues)
    try {
      console.log('[Firebase] Successfully initialized');
      console.log('[Firebase] Project ID:', firebaseConfig.projectId || 'MISSING');
      console.log('[Firebase] Auth Domain:', firebaseConfig.authDomain || 'MISSING');
      console.log('[Firebase] API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING');
      console.log('[Firebase] Environment:', import.meta.env.MODE);
      console.log('[Firebase] Build time:', new Date().toISOString());
      
      // Verify config is not using local .env file on production
      if (import.meta.env.MODE === 'production') {
        console.log('[Firebase] Production mode - using Vercel environment variables');
      }
      
      // Log user agent for debugging mobile issues
      if (typeof navigator !== 'undefined') {
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
        console.log('[Firebase] User Agent:', navigator.userAgent);
        console.log('[Firebase] Is Mobile:', isMobile);
        console.log('[Firebase] Platform:', navigator.platform);
      }
      
      // Validate all config values are present
      const configKeys = Object.keys(firebaseConfig);
      const missingConfig = configKeys.filter(key => !firebaseConfig[key] || firebaseConfig[key] === 'undefined');
      if (missingConfig.length > 0) {
        console.warn('[Firebase] Missing config values:', missingConfig);
      } else {
        console.log('[Firebase] All configuration values present');
      }
    } catch (logError) {
      // Ignore logging errors but don't fail initialization
      console.warn('[Firebase] Logging error (non-critical):', logError);
    }
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

export { db, auth, storage };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */