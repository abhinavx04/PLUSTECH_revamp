import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
        
        const annualReturnsCollection = collection(db, 'annualReturns');
        
        // Try to get all documents, sorted by financial year descending
        let querySnapshot;
        try {
          const q = query(annualReturnsCollection, orderBy('financialYear', 'desc'));
          querySnapshot = await getDocs(q);
        } catch (indexError: any) {
          // If index doesn't exist, try without orderBy
          if (indexError?.code === 'failed-precondition') {
            console.warn('[AnnualReturns] OrderBy index missing, loading without sort');
            querySnapshot = await getDocs(annualReturnsCollection);
          } else {
            throw indexError;
          }
        }
        
        console.log('[AnnualReturns] Loaded', querySnapshot.size, 'documents');
        
        const returnsData: AnnualReturnData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
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
            status: data.status || 'draft',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
          returnsData.push(returnData);
        });
        
        // Sort manually if we loaded without orderBy
        returnsData.sort((a, b) => b.financialYear.localeCompare(a.financialYear));
        
        setAnnualReturns(returnsData);
        console.log('[AnnualReturns] Processed', returnsData.length, 'annual returns');
      } catch (err: any) {
        console.error('[AnnualReturns] Error loading:', err);
        const code = err?.code || 'unknown';
        let errorMsg = '';
        
        if (code === 'permission-denied') {
          errorMsg = 'Firestore permission denied. Update security rules to allow read access to "annualReturns" collection.';
        } else {
          errorMsg = `Failed to load annual returns. Error code: ${code}. Check console for details.`;
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

  const getPublishedAnnualReturns = () => {
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

