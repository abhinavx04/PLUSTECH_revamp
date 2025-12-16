import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, Timestamp, getDoc, Query } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Shared query for published annual returns - matches Firestore security rules
// This ensures queries align with rules: resource.data.status == "published"
export const getPublishedAnnualReturnsQuery = (firestoreDb: typeof db): Query | null => {
  if (!firestoreDb) return null;
  
  const annualReturnsCollection = collection(firestoreDb, 'annualReturns');
  // CRITICAL: Filter by status to match security rules
  // Rules allow: resource.data.status == "published"
  // Query must use: where("status", "==", "published")
  return query(
    annualReturnsCollection,
    where('status', '==', 'published'),
    orderBy('financialYear', 'desc')
  );
};

export interface BusinessActivity {
  name: string;
  percentage: number;
}

export interface AnnualReturnData {
  id?: string;
  financialYear: string; // e.g., "2024-25"
  filingDate: string; // ISO date string
  agmDate: string; // ISO date string
  formType: string; // e.g., "MGT-7"
  cin: string;
  companyName: string;
  companyType: string;
  authorizedCapital: number; // in rupees
  paidUpCapital: number; // in rupees
  turnover: number; // in rupees
  netWorth?: number; // in rupees, optional
  businessActivities: BusinessActivity[];
  promoterHoldingPercent: number;
  totalDirectors: number;
  boardMeetingsHeld: number;
  agmConducted: boolean;
  filedOnTime: boolean;
  noPenalties: boolean;
  statutoryCompliancesMet: boolean;
  documentUrl: string; // PDF download URL
  documentSize?: number; // in bytes
  documentUploadedAt?: Date;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAnnualReturnData {
  financialYear: string;
  filingDate: string;
  agmDate: string;
  formType: string;
  cin: string;
  companyName: string;
  companyType: string;
  authorizedCapital: number;
  paidUpCapital: number;
  turnover: number;
  netWorth?: number;
  businessActivities: BusinessActivity[];
  promoterHoldingPercent: number;
  totalDirectors: number;
  boardMeetingsHeld: number;
  agmConducted: boolean;
  filedOnTime: boolean;
  noPenalties: boolean;
  statutoryCompliancesMet: boolean;
  documentUrl: string;
  documentSize?: number;
  documentUploadedAt?: Date;
  status: 'draft' | 'published';
}

export interface UpdateAnnualReturnData extends Partial<CreateAnnualReturnData> {
  id: string;
}

export const useAnnualReturnsFirestore = () => {
  const [annualReturns, setAnnualReturns] = useState<AnnualReturnData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load annual returns from Firestore
  useEffect(() => {
    const loadAnnualReturns = async () => {
      if (!db) {
        const msg = 'Firestore not configured (check VITE_FIREBASE_* env vars)';
        console.warn('[AnnualReturns] Firestore not available');
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('[AnnualReturns] Loading annual returns from Firestore...');
        console.log('[AnnualReturns] Using query with status filter to match security rules');
        
        // Use shared query that filters by status to match security rules
        const publishedQuery = getPublishedAnnualReturnsQuery(db);
        
        if (!publishedQuery) {
          throw new Error('Firestore not available');
        }
        
        let querySnapshot;
        try {
          // Query with status filter - matches security rules: resource.data.status == "published"
          querySnapshot = await getDocs(publishedQuery);
          console.log('[AnnualReturns] Query executed successfully with status filter');
        } catch (indexError: any) {
          // If index doesn't exist for status + orderBy combination, try with status only
          if (indexError?.code === 'failed-precondition') {
            console.warn('[AnnualReturns] Composite index missing, trying status-only query');
            console.warn('[AnnualReturns] Error details:', indexError.message);
            
            // Fallback: query with status filter only (no orderBy)
            const statusOnlyQuery = query(
              collection(db, 'annualReturns'),
              where('status', '==', 'published')
            );
            querySnapshot = await getDocs(statusOnlyQuery);
            
            console.log('[AnnualReturns] Status-only query succeeded, will sort client-side');
          } else {
            throw indexError;
          }
        }
        
        console.log('[AnnualReturns] Loaded', querySnapshot.size, 'published documents');
        
        if (querySnapshot.empty) {
          console.warn('[AnnualReturns] No published documents found. Check that documents have status="published" (lowercase)');
        }
        
        const returnsData: AnnualReturnData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Validate status field exists and is correct
          const status = data.status || 'draft';
          if (status !== 'published') {
            console.warn(`[AnnualReturns] Document ${doc.id} has status "${status}", expected "published". Skipping.`);
            return; // Skip non-published documents (shouldn't happen with query filter, but safety check)
          }
          
          const returnData: AnnualReturnData = {
            id: doc.id,
            financialYear: data.financialYear || '',
            filingDate: data.filingDate || '',
            agmDate: data.agmDate || '',
            formType: data.formType || 'MGT-7',
            cin: data.cin || '',
            companyName: data.companyName || '',
            companyType: data.companyType || '',
            authorizedCapital: data.authorizedCapital || 0,
            paidUpCapital: data.paidUpCapital || 0,
            turnover: data.turnover || 0,
            netWorth: data.netWorth,
            businessActivities: data.businessActivities || [],
            promoterHoldingPercent: data.promoterHoldingPercent || 0,
            totalDirectors: data.totalDirectors || 0,
            boardMeetingsHeld: data.boardMeetingsHeld || 0,
            agmConducted: data.agmConducted || false,
            filedOnTime: data.filedOnTime || false,
            noPenalties: data.noPenalties || false,
            statutoryCompliancesMet: data.statutoryCompliancesMet || false,
            documentUrl: data.documentUrl || '',
            documentSize: data.documentSize,
            documentUploadedAt: data.documentUploadedAt?.toDate(),
            status: status as 'published',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
          returnsData.push(returnData);
        });
        
        // Sort by financial year descending (if not already sorted by query)
        returnsData.sort((a, b) => b.financialYear.localeCompare(a.financialYear));
        
        setAnnualReturns(returnsData);
        console.log('[AnnualReturns] Processed', returnsData.length, 'published annual returns');
      } catch (err: any) {
        console.error('[AnnualReturns] Error loading:', err);
        console.error('[AnnualReturns] Error code:', err?.code);
        console.error('[AnnualReturns] Error message:', err?.message);
        console.error('[AnnualReturns] Full error:', JSON.stringify(err, null, 2));
        
        const code = err?.code || 'unknown';
        let errorMsg = '';
        
        if (code === 'permission-denied') {
          errorMsg = 'Firestore permission denied. Query must filter by status="published" to match security rules. Ensure documents have status="published" (lowercase) and composite index exists for status + financialYear.';
          console.error('[AnnualReturns] PERMISSION DENIED - Query-Rules mismatch!');
          console.error('[AnnualReturns] Rules require: resource.data.status == "published"');
          console.error('[AnnualReturns] Query must include: where("status", "==", "published")');
          console.error('[AnnualReturns] Check Firebase Console for missing composite index');
        } else if (code === 'unavailable' || code === 'deadline-exceeded') {
          errorMsg = 'Network error. Please check your internet connection and try again.';
          console.error('[AnnualReturns] Network error - may be mobile connectivity issue');
        } else if (code === 'unauthenticated') {
          errorMsg = 'Authentication error. This should not happen for public reads.';
          console.error('[AnnualReturns] Authentication error - check Firebase config');
        } else {
          errorMsg = `Failed to load annual returns. Error code: ${code}. ${err?.message || 'Check console for details.'}`;
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadAnnualReturns();
  }, []);

  const createAnnualReturn = async (returnData: CreateAnnualReturnData): Promise<string> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[AnnualReturns] Creating annual return:', returnData);
      
      const annualReturnsCollection = collection(db, 'annualReturns');
      const now = Timestamp.now();
      const docRef = await addDoc(annualReturnsCollection, {
        ...returnData,
        createdAt: now,
        updatedAt: now,
      });
      
      // Add to local state
      const newReturn: AnnualReturnData = {
        id: docRef.id,
        ...returnData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAnnualReturns(prev => [newReturn, ...prev].sort((a, b) => b.financialYear.localeCompare(a.financialYear)));
      
      console.log('[AnnualReturns] Created annual return with ID:', docRef.id);
      return docRef.id;
    } catch (err: any) {
      console.error('[AnnualReturns] Error creating:', err);
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow write access to "annualReturns" collection.';
      } else {
        errorMsg = `Failed to create annual return. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  const updateAnnualReturn = async (returnData: UpdateAnnualReturnData): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[AnnualReturns] Updating annual return:', returnData);
      
      const { id, ...updateData } = returnData;
      const returnDoc = doc(db, 'annualReturns', id);
      
      // Get current document to check for old PDF
      const currentDoc = await getDoc(returnDoc);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const oldDocumentUrl = currentData?.documentUrl;
        const newDocumentUrl = updateData.documentUrl;
        
        // If PDF is being changed and old PDF exists, delete the old one
        if (oldDocumentUrl && newDocumentUrl && oldDocumentUrl !== newDocumentUrl) {
          console.log('[AnnualReturns] PDF changed, deleting old PDF from Storage...');
          try {
            // Note: We'll need to implement deletePDFFromStorage similar to deleteImageFromStorage
            // For now, we'll just log it
            console.warn('[AnnualReturns] Old PDF deletion not yet implemented');
          } catch (pdfError) {
            console.warn('[AnnualReturns] Failed to delete old PDF, continuing with update:', pdfError);
          }
        }
      }
      
      await updateDoc(returnDoc, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      setAnnualReturns(prev => prev.map(ret =>
        ret.id === id ? { ...ret, ...updateData, updatedAt: new Date() } : ret
      ).sort((a, b) => b.financialYear.localeCompare(a.financialYear)));
      
      console.log('[AnnualReturns] Updated annual return:', id);
    } catch (err: any) {
      console.error('[AnnualReturns] Error updating:', err);
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow write access to "annualReturns" collection.';
      } else {
        errorMsg = `Failed to update annual return. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  const deleteAnnualReturn = async (id: string): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[AnnualReturns] Deleting annual return:', id);
      
      // Get the annual return first to extract PDF URL
      const returnDoc = doc(db, 'annualReturns', id);
      const docSnapshot = await getDoc(returnDoc);
      
      if (!docSnapshot.exists()) {
        throw new Error('Annual return not found');
      }
      
      const returnData = docSnapshot.data();
      const documentUrl = returnData?.documentUrl;
      
      // Delete the PDF from Storage if it exists
      if (documentUrl) {
        console.log('[AnnualReturns] Deleting associated PDF from Storage...');
        // Note: PDF deletion will be implemented separately
        console.warn('[AnnualReturns] PDF deletion not yet implemented');
      }
      
      // Delete the Firestore document
      await deleteDoc(returnDoc);
      
      // Remove from local state
      setAnnualReturns(prev => prev.filter(ret => ret.id !== id));
      
      console.log('[AnnualReturns] Deleted annual return:', id);
    } catch (err: any) {
      console.error('[AnnualReturns] Error deleting:', err);
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow delete access to "annualReturns" collection.';
      } else {
        errorMsg = `Failed to delete annual return. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  // Get published returns - query already filters by status, but this is a safety check
  const getPublishedAnnualReturns = () => {
    // Query already filters to status="published", but filter again as safety check
    return annualReturns.filter(ret => ret.status === 'published');
  };

  const getAnnualReturnByYear = (financialYear: string): AnnualReturnData | undefined => {
    return annualReturns.find(ret => ret.financialYear === financialYear && ret.status === 'published');
  };

  return {
    annualReturns,
    loading,
    error,
    createAnnualReturn,
    updateAnnualReturn,
    deleteAnnualReturn,
    getPublishedAnnualReturns,
    getAnnualReturnByYear,
  };
};

