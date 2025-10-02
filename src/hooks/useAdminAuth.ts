import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // List of admin emails - you can move this to environment variables later
  const adminEmails = [
    'admin@plustech.com',
    'abhinavpillai92@gmail.com', // Your email
    // Add more admin emails as needed
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const isAdmin = adminEmails.includes(firebaseUser.email || '');
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
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