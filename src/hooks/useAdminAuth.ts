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

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthDisabled = (a: unknown): a is { __disabled: true } => {
      return Boolean((a as { __disabled?: boolean })?.__disabled);
    };

    if (isAuthDisabled(auth)) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as unknown as import('firebase/auth').Auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const isAuthDisabled = (a: unknown): a is { __disabled: true } => Boolean((a as { __disabled?: boolean })?.__disabled);
      if (isAuthDisabled(auth)) {
        throw new Error('Authentication not configured');
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