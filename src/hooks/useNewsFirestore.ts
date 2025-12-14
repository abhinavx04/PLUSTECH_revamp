import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { deleteImageFromStorage } from '../lib/storageUtils';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

interface CreateNewsData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

interface UpdateNewsData extends Partial<CreateNewsData> {
  id: string;
}

export const useNewsFirestore = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load news from Firestore
  useEffect(() => {
    const loadNews = async () => {
      if (!db) {
        const msg = 'Firestore not configured (check VITE_FIREBASE_* env vars)';
        console.warn('[News] Firestore not available');
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('[News] Starting to load news from Firestore...');
        console.log('[News] DB object:', db ? 'exists' : 'null');
        
        // Log project info if available
        if (db && (db as any).app) {
          const projectId = (db as any).app.options?.projectId;
          console.log('[News] Firestore Project ID:', projectId);
        }
        
        const newsCollection = collection(db, 'news');
        console.log('[News] Collection reference created for "news"');
        console.log('[News] Collection path:', newsCollection.path);
        
        // Try simple query first (no orderBy) to avoid index issues and get faster error feedback
        let querySnapshot;
        try {
          console.log('[News] Attempting simple query (no ordering)...');
          querySnapshot = await getDocs(newsCollection);
          console.log('[News] Simple query succeeded, got', querySnapshot.size, 'documents');
          
          // If we got results, try to sort them with orderBy for better performance next time
          if (querySnapshot.size > 0) {
            console.log('[News] Attempting to use orderBy for future queries...');
            try {
              const q = query(newsCollection, orderBy('createdAt', 'desc'));
              await getDocs(q); // Test if index exists
              console.log('[News] OrderBy index exists, will use it next time');
            } catch (indexTestError: any) {
              if (indexTestError?.code === 'failed-precondition') {
                console.warn('[News] OrderBy index missing - using simple query. Create index for better performance.');
              }
            }
          }
        } catch (queryError: any) {
          console.error('[News] Query failed:', queryError);
          console.error('[News] Error code:', queryError?.code);
          console.error('[News] Error message:', queryError?.message);
          console.error('[News] Full error:', queryError);
          
          if (queryError?.code === 'permission-denied') {
            console.error('[News] PERMISSION DENIED - Firestore rules are blocking access!');
            console.error('[News] Update Firestore security rules to allow read access to "news" collection');
          }
          throw queryError;
        }
        
        console.log('[News] Processing', querySnapshot.size, 'documents...');
        const newsData: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('[News] Processing document:', doc.id, 'data keys:', Object.keys(data));
          const article = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as NewsArticle;
          newsData.push(article);
          console.log('[News] Article details:', {
            id: article.id,
            title: article.title,
            published: article.published,
            featured: article.featured,
            createdAt: article.createdAt
          });
        });
        
        // Sort manually if we loaded without orderBy
        newsData.sort((a, b) => {
          const aTime = a.createdAt.getTime();
          const bTime = b.createdAt.getTime();
          return bTime - aTime; // Descending order
        });
        
        setNews(newsData);
        console.log('[News] Loaded', newsData.length, 'articles from Firestore');
        if (newsData.length === 0) {
          console.warn('[News] ⚠️ WARNING: Query returned 0 documents. Check:');
          console.warn('[News] 1. Verify Project ID matches your Firebase console');
          if (db && (db as any).app) {
            const projectId = (db as any).app.options?.projectId;
            console.warn(`[News]    Current Project ID: ${projectId}`);
            console.warn(`[News]    → Go to Firebase Console and verify this matches your project`);
          }
          console.warn('[News] 2. Collection name is exactly "news" (case-sensitive, no spaces)');
          console.warn('[News] 3. Documents exist in the "news" collection in Firebase Console');
          console.warn('[News] 4. Firestore security rules allow read access (query succeeded, so this is OK)');
          console.warn('[News] 💡 TIP: Open Firebase Console → Firestore Database and verify:');
          console.warn('[News]    - You see a collection named "news"');
          console.warn('[News]    - The collection has 2 documents');
          console.warn('[News]    - The project ID matches the one shown above');
        }
      } catch (err: any) {
        console.error('[News] Error loading news:', err);
        console.error('[News] Full error object:', JSON.stringify(err, null, 2));
        const code = err?.code || 'unknown';
        let errorMsg = '';
        
        if (code === 'permission-denied') {
          errorMsg = 'Firestore permission denied. Update security rules to allow read access to "news" collection.';
          console.error('[News] PERMISSION DENIED - Check Firestore security rules!');
        } else if (code === 'failed-precondition') {
          errorMsg = 'Missing Firestore index. Check console for index creation link.';
          if (err?.message) {
            console.error('[News] Index error details:', err.message);
          }
        } else {
          errorMsg = `Failed to load news articles. Error code: ${code}. Check console for details.`;
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const createNews = async (newsData: CreateNewsData): Promise<string> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Creating news article:', newsData);
      
      const newsCollection = collection(db, 'news');
      const now = Timestamp.now();
      const docRef = await addDoc(newsCollection, {
        ...newsData,
        createdAt: now,
        updatedAt: now,
      });
      
      // Add to local state
      const newArticle: NewsArticle = {
        id: docRef.id,
        ...newsData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNews(prev => [newArticle, ...prev]);
      
      console.log('[News] Created article with ID:', docRef.id);
      return docRef.id;
    } catch (err: any) {
      console.error('[News] Error creating news:', err);
      console.error('[News] Full error object:', JSON.stringify(err, null, 2));
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow write access to "news" collection.';
        console.error('[News] PERMISSION DENIED - Check Firestore security rules!');
      } else {
        errorMsg = `Failed to create news article. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  const updateNews = async (newsData: UpdateNewsData): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Updating news article:', newsData);
      
      const { id, ...updateData } = newsData;
      const newsDoc = doc(db, 'news', id);
      
      // Get current article to check for old image
      const currentDoc = await getDoc(newsDoc);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const oldImageUrl = currentData?.imageUrl;
        const newImageUrl = updateData.imageUrl;
        
        // If image is being changed and old image exists, delete the old one
        if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
          console.log('[News] Image changed, deleting old image from Storage...');
          try {
            await deleteImageFromStorage(oldImageUrl);
          } catch (imageError) {
            // Log but don't fail the update if image deletion fails
            console.warn('[News] Failed to delete old image, continuing with update:', imageError);
          }
        }
      }
      
      await updateDoc(newsDoc, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      setNews(prev => prev.map(article =>
        article.id === id ? { ...article, ...updateData, updatedAt: new Date() } : article
      ));
      
      console.log('[News] Updated article:', id);
    } catch (err: any) {
      console.error('[News] Error updating news:', err);
      console.error('[News] Full error object:', JSON.stringify(err, null, 2));
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow write access to "news" collection.';
        console.error('[News] PERMISSION DENIED - Check Firestore security rules!');
      } else {
        errorMsg = `Failed to update news article. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  const deleteNews = async (id: string): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Deleting news article:', id);
      
      // Get the article first to extract image URL
      const newsDoc = doc(db, 'news', id);
      const docSnapshot = await getDoc(newsDoc);
      
      if (!docSnapshot.exists()) {
        throw new Error('Article not found');
      }
      
      const articleData = docSnapshot.data();
      const imageUrl = articleData?.imageUrl;
      
      // Delete the image from Storage if it exists
      if (imageUrl) {
        console.log('[News] Deleting associated image from Storage...');
        try {
          await deleteImageFromStorage(imageUrl);
        } catch (imageError) {
          // Log but don't fail the deletion if image deletion fails
          console.warn('[News] Failed to delete image, continuing with article deletion:', imageError);
        }
      }
      
      // Delete the Firestore document
      await deleteDoc(newsDoc);
      
      // Remove from local state
      setNews(prev => prev.filter(article => article.id !== id));
      
      console.log('[News] Deleted article:', id);
    } catch (err: any) {
      console.error('[News] Error deleting news:', err);
      console.error('[News] Full error object:', JSON.stringify(err, null, 2));
      const code = err?.code || 'unknown';
      let errorMsg = '';
      
      if (code === 'permission-denied') {
        errorMsg = 'Firestore permission denied. Update security rules to allow delete access to "news" collection.';
        console.error('[News] PERMISSION DENIED - Check Firestore security rules!');
      } else {
        errorMsg = `Failed to delete news article. Error code: ${code}. Check console for details.`;
      }
      
      setError(errorMsg);
      throw err;
    }
  };

  const getPublishedNews = () => {
    return news.filter(article => article.published);
  };

  const getFeaturedNews = () => {
    return news.filter(article => article.published && article.featured);
  };

  return {
    news,
    loading,
    error,
    createNews,
    updateNews,
    deleteNews,
    getPublishedNews,
    getFeaturedNews,
  };
};
