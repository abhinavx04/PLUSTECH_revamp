export const db: import('firebase/firestore').Firestore | null;
export const auth: import('firebase/auth').Auth | { 
  __disabled: true; 
  currentUser: import('firebase/auth').User | null; 
  onAuthStateChanged: (callback: (user: import('firebase/auth').User | null) => void) => () => void; 
  signInWithEmailAndPassword: (email: string, password: string) => Promise<import('firebase/auth').UserCredential>; 
  signOut: () => Promise<void>; 
};

