import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

// List of admin emails from environment variables
const ADMIN_EMAILS: string[] = import.meta.env.VITE_ADMIN_EMAILS 
  ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((email: string) => email.trim())
  : [];

// Optional fallback: when no admin allowlist is provided, treat any authenticated
// user as admin (useful when all Firebase console users are intended admins).
const ALLOW_ALL_AUTH_USERS_AS_ADMIN = ADMIN_EMAILS.length === 0;

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if auth is disabled
    if (auth && typeof auth === 'object' && '__disabled' in auth) {
      setLoading(false);
      return;
    }

    try {
      // Simple auth state listener without complex type casting
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          const verifyAdmin = async () => {
            try {
              // Prefer explicit admin claims if present; fallback to env email allowlist
              const tokenResult = await getIdTokenResult(firebaseUser);
              const claimAdmin = Boolean(tokenResult?.claims?.admin || tokenResult?.claims?.role === 'admin');
              const emailAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
              const isAdmin = claimAdmin || emailAdmin || ALLOW_ALL_AUTH_USERS_AS_ADMIN;

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                isAdmin,
              });
            } catch (tokenError) {
              console.error('[Auth] Error checking admin claim:', tokenError);
              setError('Unable to verify admin privileges');
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                isAdmin: ADMIN_EMAILS.includes(firebaseUser.email || '') || ALLOW_ALL_AUTH_USERS_AS_ADMIN,
              });
            } finally {
              setLoading(false);
            }
          };

          verifyAdmin();
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      return () => {
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
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Check if auth is disabled
      if (auth && typeof auth === 'object' && '__disabled' in auth) {
        throw new Error('Firebase authentication is not configured.');
      }
      
      await signInWithEmailAndPassword(auth, email, password);
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
      // Check if auth is disabled
      if (auth && typeof auth === 'object' && '__disabled' in auth) {
        setUser(null);
        return;
      }
      
      await signOut(auth);
      setUser(null);
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