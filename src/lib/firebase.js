// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// NOTE: Replace with your actual Firebase config or environment variables.
const firebaseConfig = {
  // Your Firebase config
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... other config
};

let app = null;
try {
  // Basic validation to avoid initializing with clearly missing config
  if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase config missing');
  }
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn('[Firebase] Initialization skipped:', e && e.message ? e.message : e);
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : { __disabled: true };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */