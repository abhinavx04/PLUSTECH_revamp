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
import { deleteImageFromStorage } from '../lib/storageUtils';

export type CertificationCategory = 'quality' | 'financial' | 'compliance' | 'safety' | 'other';
export type CertificationStatus = 'active' | 'pending' | 'renewed';

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  description: string;
  validUntil: string;
  category: CertificationCategory;
  status: CertificationStatus;
  published: boolean;
  color?: string;
  imageUrl?: string;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCertificationData {
  name: string;
  issuingBody: string;
  description: string;
  validUntil: string;
  category: CertificationCategory;
  status: CertificationStatus;
  published: boolean;
  color?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateCertificationData extends Partial<CreateCertificationData> {
  id: string;
}

const COLLECTION_NAME = 'certifications';

const categoryColorMap: Record<CertificationCategory | string, string> = {
  quality: 'from-green-500 to-green-700',
  financial: 'from-blue-500 to-blue-700',
  compliance: 'from-purple-500 to-purple-700',
  safety: 'from-orange-500 to-orange-700',
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

const mapCertification = (docSnap: any): Certification => {
  const data = docSnap.data();
  const category = (data.category as CertificationCategory) || 'quality';

  return {
    id: docSnap.id,
    name: data.name || '',
    issuingBody: data.issuingBody || '',
    description: data.description || '',
    validUntil: data.validUntil || '',
    category,
    status: (data.status as CertificationStatus) || 'active',
    published: data.published ?? true,
    color: data.color || categoryColorMap[category] || categoryColorMap.other,
    imageUrl: data.imageUrl,
    sortOrder: data.sortOrder,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const getPublishedCertificationsQuery = (firestoreDb: typeof db): Query | null => {
  if (!firestoreDb) return null;

  const certificationsCollection = collection(firestoreDb, COLLECTION_NAME);
  return query(
    certificationsCollection,
    where('published', '==', true),
    orderBy('sortOrder', 'asc'),
    orderBy('createdAt', 'desc')
  );
};

interface HookOptions {
  includeDrafts?: boolean;
}

export const useCertificationsFirestore = (options: HookOptions = { includeDrafts: false }) => {
  const includeDrafts = options?.includeDrafts ?? false;
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCertifications = async () => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const certificationsCollection = collection(db, COLLECTION_NAME);
        const baseQuery = includeDrafts
          ? query(certificationsCollection, orderBy('createdAt', 'desc'))
          : query(certificationsCollection, where('published', '==', true), orderBy('createdAt', 'desc'));

        let querySnapshot;
        try {
          querySnapshot = await getDocs(baseQuery);
        } catch (indexError: any) {
          if (indexError?.code === 'failed-precondition') {
            // If composite index missing, fallback to simpler query
            const fallbackQuery = includeDrafts
              ? certificationsCollection
              : query(certificationsCollection, where('published', '==', true));
            querySnapshot = await getDocs(fallbackQuery);
          } else {
            throw indexError;
          }
        }

        const items = querySnapshot.docs.map(mapCertification).sort((a, b) => {
          const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        setCertifications(includeDrafts ? items : items.filter((c) => c.published));
      } catch (err: any) {
        console.error('[Certifications] Error loading:', err);
        const code = err?.code || 'unknown';
        const message =
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow reads on "certifications".'
            : `Failed to load certifications. Error code: ${code}.`;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, [includeDrafts]);

  const createCertification = async (payload: CreateCertificationData): Promise<string> => {
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

      const newItem: Certification = {
        id: docRef.id,
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCertifications((prev) =>
        [...prev, newItem].sort((a, b) => {
          const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
          const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return b.createdAt.getTime() - a.createdAt.getTime();
        })
      );

      return docRef.id;
    } catch (err: any) {
      console.error('[Certifications] Create error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow writes on "certifications".'
          : `Failed to create certification. Error code: ${code}.`
      );
      throw err;
    }
  };

  const updateCertification = async (payload: UpdateCertificationData): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    const { id, ...updateData } = payload;

    try {
      setError(null);
      const certificationDoc = doc(db, COLLECTION_NAME, id);
      const current = await getDoc(certificationDoc);

      if (current.exists()) {
        const currentData = current.data();
        const oldImage = currentData?.imageUrl;
        const newImage = updateData.imageUrl;

        if (oldImage && newImage && oldImage !== newImage) {
          await deleteImageFromStorage(oldImage, [
            'certifications/images/',
            'news/images/',
            'projects/images/',
            'csr/images/',
          ]);
        }
      }

      const payloadSanitized = sanitizeForFirestore({
        ...updateData,
        updatedAt: Timestamp.now(),
      });

      await updateDoc(certificationDoc, payloadSanitized as any);

      setCertifications((prev) =>
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
      console.error('[Certifications] Update error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow writes on "certifications".'
          : `Failed to update certification. Error code: ${code}.`
      );
      throw err;
    }
  };

  const deleteCertification = async (id: string): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const certificationDoc = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(certificationDoc);

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.imageUrl) {
          await deleteImageFromStorage(data.imageUrl, [
            'certifications/images/',
            'news/images/',
            'projects/images/',
            'csr/images/',
          ]);
        }
      }

      await deleteDoc(certificationDoc);
      setCertifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('[Certifications] Delete error:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update rules to allow deletes on "certifications".'
          : `Failed to delete certification. Error code: ${code}.`
      );
      throw err;
    }
  };

  const getPublishedCertifications = useCallback(
    () => certifications.filter((c) => c.published),
    [certifications]
  );

  const getCertificationById = useCallback(
    (id: string) => certifications.find((c) => c.id === id),
    [certifications]
  );

  return {
    certifications,
    loading,
    error,
    createCertification,
    updateCertification,
    deleteCertification,
    getPublishedCertifications,
    getCertificationById,
  };
};


