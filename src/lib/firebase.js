// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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

// Lazy initialization - only initialize when first accessed
let app = null;
let auth = null;
let db = null;
let storage = null;
let initPromise = null;

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

function initializeFirebase() {
  if (initPromise) return initPromise;
  
  initPromise = new Promise((resolve, reject) => {
    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

    if (missingVars.length > 0) {
      console.error('[Firebase] Missing environment variables:', missingVars);
      console.error('[Firebase] Check Vercel environment variables or .env file');
      
      // Create mock auth object as fallback
      auth = {
        __disabled: true,
        currentUser: null,
        onAuthStateChanged: (callback) => {
          setTimeout(() => callback(null), 0);
          return () => {};
        },
        signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase authentication is not configured.')),
        signOut: () => Promise.resolve(),
      };
      resolve();
      return;
    }

    try {
      // Initialize Firebase with the real configuration
      app = initializeApp(firebaseConfig);
      // Initialize auth immediately so it's available when needed
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      resolve();
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
      reject(e);
    }
  });
  
  return initPromise;
}

// Export getters that initialize on first access
export const getFirebaseApp = async () => {
  await initializeFirebase();
  return app;
};

export const getFirestoreDB = async () => {
  await initializeFirebase();
  return db;
};

export const getFirebaseStorage = async () => {
  await initializeFirebase();
  return storage;
};

export const getFirebaseAuth = async () => {
  await initializeFirebase();
  return auth;
};

// For backward compatibility, export direct access (but they'll be null until first use)
// Initialize Firebase on first import (lazy but immediate)
let initialized = false;
if (typeof window !== 'undefined' && !initialized) {
  // Don't block, but start initialization
  initializeFirebase().catch(() => {
    // Silent fail, will be handled when accessed
  });
  initialized = true;
}

export { db, storage, auth };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */