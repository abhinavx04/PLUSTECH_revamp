import { useEffect, useState, useCallback } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type MilestoneCategory = 'founding' | 'expansion' | 'innovation' | 'achievement';

export interface MilestoneMetric {
  label: string;
  value: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  icon?: string;
  metrics: MilestoneMetric[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMilestoneData {
  year: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  icon?: string;
  metrics?: MilestoneMetric[];
  published: boolean;
}

export interface UpdateMilestoneData extends Partial<CreateMilestoneData> {
  id: string;
}

const COLLECTION_NAME = 'milestones';

const sanitizeForFirestore = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const getYearValue = (year: string) => {
  const val = parseInt(year, 10);
  return Number.isNaN(val) ? 0 : val;
};

export const useMilestonesFirestore = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMilestones = async () => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const colRef = collection(db, COLLECTION_NAME);
        let snapshot;
        try {
          const orderedQuery = query(colRef, orderBy('year', 'asc'));
          snapshot = await getDocs(orderedQuery);
        } catch (indexError: any) {
          // If index missing or orderBy fails, fall back to basic fetch
          snapshot = await getDocs(colRef);
        }

        const items: Milestone[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            year: data.year || '',
            title: data.title || '',
            description: data.description || '',
            category: data.category || 'achievement',
            icon: data.icon,
            metrics: Array.isArray(data.metrics) ? data.metrics : [],
            published: Boolean(data.published),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        // Ensure stable ordering by year then createdAt
        items.sort((a, b) => {
          const aYear = a.year === 'Present' ? Number.MAX_SAFE_INTEGER : parseInt(a.year || '0', 10);
          const bYear = b.year === 'Present' ? Number.MAX_SAFE_INTEGER : parseInt(b.year || '0', 10);
          if (aYear !== bYear) return aYear - bYear;
          return a.createdAt.getTime() - b.createdAt.getTime();
        });

        setMilestones(items);
      } catch (err: any) {
        console.error('[Milestones] Error loading:', err);
        const code = err?.code || 'unknown';
        const msg =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow access to "milestones".'
            : 'Failed to load milestones. Check console for details.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  const createMilestone = useCallback(
    async (data: CreateMilestoneData): Promise<string> => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        throw new Error('Firestore not available');
      }

      try {
        setError(null);
        const colRef = collection(db, COLLECTION_NAME);
        const now = Timestamp.now();
        const payload = sanitizeForFirestore({
          ...data,
          metrics: data.metrics || [],
          createdAt: now,
          updatedAt: now,
        });
        const docRef = await addDoc(colRef, payload);
        const newItem: Milestone = {
          id: docRef.id,
          ...data,
          metrics: data.metrics || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMilestones((prev) =>
          [...prev, newItem].sort((a, b) => getYearValue(a.year) - getYearValue(b.year))
        );
        return docRef.id;
      } catch (err: any) {
        console.error('[Milestones] Error creating:', err);
        const code = err?.code || 'unknown';
        const msg =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow write access to "milestones".'
            : 'Failed to create milestone. Check console for details.';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const updateMilestone = useCallback(
    async (data: UpdateMilestoneData): Promise<void> => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        throw new Error('Firestore not available');
      }

      try {
        setError(null);
        const { id, ...updateData } = data;
        const docRef = doc(db, COLLECTION_NAME, id);
        const payload = sanitizeForFirestore({
          ...updateData,
          updatedAt: Timestamp.now(),
        });
        await updateDoc(docRef, payload);

        setMilestones((prev) =>
          prev
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    ...updateData,
                    metrics: updateData.metrics ?? item.metrics,
                    updatedAt: new Date(),
                  }
                : item
            )
            .sort((a, b) => getYearValue(a.year) - getYearValue(b.year))
        );
      } catch (err: any) {
        console.error('[Milestones] Error updating:', err);
        const code = err?.code || 'unknown';
        const msg =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow write access to "milestones".'
            : 'Failed to update milestone. Check console for details.';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const deleteMilestone = useCallback(
    async (id: string): Promise<void> => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        throw new Error('Firestore not available');
      }

      try {
        setError(null);
        const docRef = doc(db, COLLECTION_NAME, id);
        // Ensure exists
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          throw new Error('Milestone not found');
        }
        await deleteDoc(docRef);
        setMilestones((prev) => prev.filter((item) => item.id !== id));
      } catch (err: any) {
        console.error('[Milestones] Error deleting:', err);
        const code = err?.code || 'unknown';
        const msg =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow delete access to "milestones".'
            : 'Failed to delete milestone. Check console for details.';
        setError(msg);
        throw err;
      }
    },
    []
  );

  const getPublishedMilestones = useCallback(() => milestones.filter((m) => m.published), [milestones]);

  return {
    milestones,
    loading,
    error,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    getPublishedMilestones,
  };
};

