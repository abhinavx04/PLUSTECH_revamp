// @ts-check
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration for PlusTech project
const firebaseConfig = {
  apiKey: "AIzaSyADxqym8in2Y7gNGNOkc6AtV1ycWvnQul0",
  authDomain: "plustech-revamp.firebaseapp.com",
  projectId: "plustech-revamp",
  storageBucket: "plustech-revamp.firebasestorage.app",
  messagingSenderId: "932191631941",
  appId: "1:932191631941:web:facd0e321ad6879a60412c",
  measurementId: "G-ZS1RHVLDR7"
};

let app = null;
let auth = null;
let db = null;

try {
  // Initialize Firebase with the real configuration
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('[Firebase] Successfully initialized with PlusTech configuration');
} catch (e) {
  console.error('[Firebase] Initialization failed:', e && e.message ? e.message : e);
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
}

export { db, auth };

// Provide basic type declarations for TS when importing from JS file
/**
 * @typedef {import('firebase/auth').Auth} Auth
 * @typedef {import('firebase/firestore').Firestore} Firestore
 */