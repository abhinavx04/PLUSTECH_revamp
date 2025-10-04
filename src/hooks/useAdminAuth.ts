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
  'admin@plustech.co.in',
  'abhinavpillai92@gmail.com'
];

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Auth] Setting up auth state listener...');
    
    // Check if auth is disabled
    if (auth && typeof auth === 'object' && '__disabled' in auth) {
      console.warn('[Auth] Firebase authentication is disabled');
      setLoading(false);
      return;
    }

    try {
      // Simple auth state listener without complex type casting
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        console.log('[Auth] Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
        
        if (firebaseUser) {
          // Check if user is admin based on the admin email list
          const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
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

      return () => {
        console.log('[Auth] Cleaning up auth listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('[Auth] Error setting up auth state listener:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log('[Auth] Login attempt:', { email });
      
      // Check if auth is disabled
      if (auth && typeof auth === 'object' && '__disabled' in auth) {
        throw new Error('Firebase authentication is not configured.');
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth] Login successful');
    } catch (err: unknown) {
      console.error('[Auth] Login error:', err);
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Login failed';
      setError(message);
      throw err as Error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Logout attempt');
      
      // Check if auth is disabled
      if (auth && typeof auth === 'object' && '__disabled' in auth) {
        console.warn('[Auth] Firebase authentication is disabled - skipping logout');
        setUser(null);
        return;
      }
      
      await signOut(auth);
      setUser(null);
      console.log('[Auth] Logout successful');
    } catch (err: unknown) {
      console.error('[Auth] Logout error:', err);
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