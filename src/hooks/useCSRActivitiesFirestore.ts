import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  getDoc,
  Query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { deleteImageFromStorage, deletePDFFromStorage } from '../lib/storageUtils';

export type CSRCategory = 'education' | 'environment' | 'community' | 'healthcare' | 'other';
export type CSRStatus = 'active' | 'completed' | 'planned';

export interface CSRMetric {
  label: string;
  value: string;
}

export interface CSRActivity {
  id: string;
  title: string;
  description: string;
  category: CSRCategory;
  impact: string;
  year: string;
  status: CSRStatus;
  published: boolean;
  metrics: CSRMetric[];
  color?: string;
  imageUrl?: string; // Legacy single image (for backward compatibility)
  imageUrls?: string[]; // Multiple images array
  documentUrl?: string; // PDF download URL
  documentSize?: number; // in bytes
  documentUploadedAt?: Date;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCSRActivityData {
  title: string;
  description: string;
  category: CSRCategory;
  impact: string;
  year: string;
  status: CSRStatus;
  published: boolean;
  metrics: CSRMetric[];
  color?: string;
  imageUrl?: string; // Legacy single image
  imageUrls?: string[]; // Multiple images array
  documentUrl?: string;
  documentSize?: number;
  documentUploadedAt?: Date;
  sortOrder?: number;
}

export interface UpdateCSRActivityData extends Partial<CreateCSRActivityData> {
  id: string;
}

const COLLECTION_NAME = 'csrActivities';

const categoryColorMap: Record<CSRCategory | string, string> = {
  education: 'from-blue-500 to-blue-700',
  environment: 'from-green-500 to-green-700',
  community: 'from-purple-500 to-purple-700',
  healthcare: 'from-red-500 to-red-700',
  other: 'from-gray-500 to-gray-700',
};

const sanitizeForFirestore = <T extends Record<string, unknown>>(data: T): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const mapActivity = (docSnap: any): CSRActivity => {
  const data = docSnap.data();
  const category = (data.category as CSRCategory) || 'education';

  return {
    id: docSnap.id,
    title: data.title || '',
    description: data.description || '',
    category,
    impact: data.impact || '',
    year: data.year || '',
    status: (data.status as CSRStatus) || 'active',
    published: data.published ?? true,
    metrics: data.metrics || [],
    color: data.color || categoryColorMap[category] || categoryColorMap.other,
    imageUrl: data.imageUrl,
    imageUrls: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []), // Support both formats
    documentUrl: data.documentUrl,
    documentSize: data.documentSize,
    documentUploadedAt: data.documentUploadedAt?.toDate(),
    sortOrder: data.sortOrder,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const getPublishedCSRActivitiesQuery = (firestoreDb: typeof db): Query | null => {
  if (!firestoreDb) return null;

  const activitiesCollection = collection(firestoreDb, COLLECTION_NAME);
  return query(
    activitiesCollection,
    where('published', '==', true),
    orderBy('sortOrder', 'asc'),
    orderBy('createdAt', 'desc')
  );
};

interface HookOptions {
  includeDrafts?: boolean;
}

export const useCSRActivitiesFirestore = (options: HookOptions = { includeDrafts: false }) => {
  const includeDrafts = options?.includeDrafts ?? false;
  const [activities, setActivities] = useState<CSRActivity[]>([]);
  // Start in loading state to avoid premature redirects before data loads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const activitiesCollection = collection(db, COLLECTION_NAME);
        const baseQuery = includeDrafts
          ? query(activitiesCollection, orderBy('createdAt', 'desc'))
          : query(activitiesCollection, where('published', '==', true), orderBy('createdAt', 'desc'));

        let querySnapshot;
        try {
          querySnapshot = await getDocs(baseQuery);
        } catch (indexError: any) {
          if (indexError?.code === 'failed-precondition') {
            const fallbackQuery = includeDrafts
              ? activitiesCollection
              : query(activitiesCollection, where('published', '==', true));
            querySnapshot = await getDocs(fallbackQuery);
          } else {
            throw indexError;
          }
        }

        const items = querySnapshot.docs.map(mapActivity).sort((a, b) => {
          const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        setActivities(includeDrafts ? items : items.filter((a) => a.published));
      } catch (err: any) {
        console.error('[CSR] Error loading:', err);
        const code = err?.code || 'unknown';
        const message =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow reads on "csrActivities".'
            : `Failed to load CSR activities. Error code: ${code}.`;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [includeDrafts]);

  const createCSRActivity = async (payload: CreateCSRActivityData): Promise<string> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...sanitizeForFirestore(payload as unknown as Record<string, unknown>),
        createdAt: now,
        updatedAt: now,
      } as any);

      const newItem: CSRActivity = {
        id: docRef.id,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setActivities((prev) =>
        [...prev, newItem].sort((a, b) => {
          const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return b.createdAt.getTime() - a.createdAt.getTime();
        })
      );

      return docRef.id;
    } catch (err: any) {
      console.error('[CSR] Create error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow writes on "csrActivities".'
          : `Failed to create CSR activity. Error code: ${code}.`
      );
      throw err;
    }
  };

  const updateCSRActivity = async (payload: UpdateCSRActivityData): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    const { id, ...updateData } = payload;

    try {
      setError(null);
      const activityDoc = doc(db, COLLECTION_NAME, id);
      const current = await getDoc(activityDoc);

      if (current.exists()) {
        const currentData = current.data();
        const oldImages = currentData?.imageUrls || (currentData?.imageUrl ? [currentData.imageUrl] : []);
        const newImages = updateData.imageUrls || (updateData.imageUrl ? [updateData.imageUrl] : []);

        // Delete old images that are no longer in use
        const imagesToDelete = oldImages.filter((img: string) => !newImages.includes(img));
        for (const imgUrl of imagesToDelete) {
          await deleteImageFromStorage(imgUrl, [
            'csr/images/',
            'news/images/',
            'projects/images/',
            'certifications/images/',
          ]);
        }

        const oldDocumentUrl = currentData?.documentUrl;
        const newDocumentUrl = updateData.documentUrl;

        // Delete old PDF if changed
        if (oldDocumentUrl && newDocumentUrl && oldDocumentUrl !== newDocumentUrl) {
          await deletePDFFromStorage(oldDocumentUrl, ['csr/pdfs/', 'annualReturns/pdfs/']);
        }
      }

      const payloadSanitized = sanitizeForFirestore({
        ...updateData,
        updatedAt: Timestamp.now(),
      });

      await updateDoc(activityDoc, payloadSanitized as any);

      setActivities((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updateData,
                updatedAt: new Date(),
              }
            : item
        )
      );
    } catch (err: any) {
      console.error('[CSR] Update error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow writes on "csrActivities".'
          : `Failed to update CSR activity. Error code: ${code}.`
      );
      throw err;
    }
  };

  const deleteCSRActivity = async (id: string): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const activityDoc = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(activityDoc);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const imagesToDelete = data?.imageUrls || (data?.imageUrl ? [data.imageUrl] : []);
        
        console.log('[CSR] Deleting activity:', id);
        console.log('[CSR] Images to delete:', imagesToDelete);
        
        // Delete all images
        for (const imgUrl of imagesToDelete) {
          if (imgUrl) {
            console.log('[CSR] Deleting image:', imgUrl);
            const deleted = await deleteImageFromStorage(imgUrl, [
              'csr/images/',
              'news/images/',
              'projects/images/',
              'certifications/images/',
            ]);
            if (!deleted) {
              console.warn('[CSR] Failed to delete image:', imgUrl);
            } else {
              console.log('[CSR] Successfully deleted image:', imgUrl);
            }
          }
        }
        
        // Delete PDF if exists
        if (data?.documentUrl) {
          console.log('[CSR] Deleting PDF:', data.documentUrl);
          const pdfDeleted = await deletePDFFromStorage(data.documentUrl, ['csr/pdfs/', 'annualReturns/pdfs/']);
          if (!pdfDeleted) {
            console.warn('[CSR] Failed to delete PDF:', data.documentUrl);
          } else {
            console.log('[CSR] Successfully deleted PDF:', data.documentUrl);
          }
        }
      } else {
        console.warn('[CSR] Activity document not found:', id);
      }

      // Delete Firestore document
      await deleteDoc(activityDoc);
      console.log('[CSR] Deleted Firestore document:', id);
      
      setActivities((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('[CSR] Delete error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow deletes on "csrActivities".'
          : `Failed to delete CSR activity. Error code: ${code}.`
      );
      throw err;
    }
  };

  const getPublishedCSRActivities = useCallback(() => activities.filter((a) => a.published), [activities]);

  const getCSRActivityById = useCallback((id: string) => activities.find((a) => a.id === id), [activities]);

  return {
    activities,
    loading,
    error,
    createCSRActivity,
    updateCSRActivity,
    deleteCSRActivity,
    getPublishedCSRActivities,
    getCSRActivityById,
  };
};


