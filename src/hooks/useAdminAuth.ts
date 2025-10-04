import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

// List of admin emails - can be moved to environment variables later
const ADMIN_EMAILS: string[] = [
  'admin@plustech.com',
  'abhinavpillai92@gmail.com'
];

// For development/testing: Allow any authenticated user to be admin
const ALLOW_ALL_AS_ADMIN = true;

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthDisabled = (a: unknown): a is { __disabled: true } => {
      return Boolean((a as { __disabled?: boolean })?.__disabled);
    };

    if (isAuthDisabled(auth)) {
      console.warn('[Auth] Firebase authentication is disabled - running in demo mode');
      setLoading(false);
      return;
    }

    try {
      console.log('[Auth] Setting up auth state listener...');
      console.log('[Auth] Auth object:', auth);
      
      const unsubscribe = onAuthStateChanged(auth as unknown as import('firebase/auth').Auth, (firebaseUser: User | null) => {
        console.log('[Auth] Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
        
        if (firebaseUser) {
          // Check if user is admin: either in the admin list OR if we're allowing all users as admin (for development)
          const isAdmin = ALLOW_ALL_AS_ADMIN || ADMIN_EMAILS.includes(firebaseUser.email || '');
          console.log('[Auth] User email:', firebaseUser.email);
          console.log('[Auth] Is admin:', isAdmin);
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('[Auth] Error setting up auth state listener:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const isAuthDisabled = (a: unknown): a is { __disabled: true } => Boolean((a as { __disabled?: boolean })?.__disabled);
      if (isAuthDisabled(auth)) {
        throw new Error('Firebase authentication is not configured. Please set up your Firebase credentials in environment variables.');
      }
      await signInWithEmailAndPassword(auth as unknown as import('firebase/auth').Auth, email, password);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Login failed';
      setError(message);
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const isAuthDisabled = (a: unknown): a is { __disabled: true } => Boolean((a as { __disabled?: boolean })?.__disabled);
      if (isAuthDisabled(auth)) {
        console.warn('[Auth] Firebase authentication is disabled - skipping logout');
        setUser(null);
        return;
      }
      await signOut(auth);
      setUser(null);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Logout failed';
      setError(message);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin: user?.isAdmin || false,
    isAuthenticated: !!user,
  };
};