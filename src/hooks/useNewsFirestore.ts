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
  /**
   * The logical date of the news item (can be backdated, e.g. 2006).
   * Used for chronological ordering and display.
   */
  publishedAt?: Date;
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
  /**
   * Logical news date (e.g. actual date of the news/event).
   * Optional; if omitted we fall back to "now".
   */
  publishedAt?: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

interface UpdateNewsData extends Partial<CreateNewsData> {
  id: string;
}

// Firestore does not allow fields with value `undefined`. This helper removes them.
const sanitizeForFirestore = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const useNewsFirestore = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load news from Firestore
  useEffect(() => {
    const loadNews = async () => {
      if (!db) {
        const msg = 'Firestore not configured (check VITE_FIREBASE_* env vars)';
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const newsCollection = collection(db, 'news');
        
        // Try simple query first (no orderBy) to avoid index issues and get faster error feedback
        let querySnapshot;
        try {
          querySnapshot = await getDocs(newsCollection);
          
          // If we got results, try to sort them with orderBy for better performance next time
          if (querySnapshot.size > 0) {
            try {
              const q = query(newsCollection, orderBy('createdAt', 'desc'));
              await getDocs(q); // Test if index exists
            } catch (indexTestError: any) {
              // Index missing, continue with simple query
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
        
        const newsData: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as any;
          const createdAt: Date =
            data.createdAt?.toDate?.() || data.createdAt instanceof Date
              ? data.createdAt.toDate?.() ?? data.createdAt
              : new Date();
          const updatedAt: Date =
            data.updatedAt?.toDate?.() || data.updatedAt instanceof Date
              ? data.updatedAt.toDate?.() ?? data.updatedAt
              : createdAt;
          const publishedAt: Date =
            data.publishedAt?.toDate?.() ||
            (data.publishedAt instanceof Date ? data.publishedAt : createdAt);

          const article: NewsArticle = {
            id: doc.id,
            ...data,
            createdAt,
            updatedAt,
            publishedAt,
          };

          newsData.push(article);
        });
        
        // Sort manually if we loaded without orderBy
        newsData.sort((a, b) => {
          const aTime = (a.publishedAt || a.createdAt).getTime();
          const bTime = (b.publishedAt || b.createdAt).getTime();
          return bTime - aTime; // Descending order (latest news first)
        });
        
        setNews(newsData);
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
      
      const newsCollection = collection(db, 'news');
      const now = Timestamp.now();
      const publishedAtTimestamp =
        newsData.publishedAt ? Timestamp.fromDate(newsData.publishedAt) : now;

      const payload = sanitizeForFirestore({
        ...newsData,
        publishedAt: publishedAtTimestamp,
        createdAt: now,
        updatedAt: now,
      });
      const docRef = await addDoc(newsCollection, payload);
      
      // Add to local state
      const nowDate = new Date();
      const newArticle: NewsArticle = {
        id: docRef.id,
        ...newsData,
        createdAt: nowDate,
        updatedAt: nowDate,
        publishedAt: newsData.publishedAt || nowDate,
      };
      setNews(prev => [newArticle, ...prev]);
      
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
          try {
            await deleteImageFromStorage(oldImageUrl);
          } catch (imageError) {
            // Continue with update if image deletion fails
          }
        }
      }
      
      // Ensure publishedAt (if present) is stored as a Firestore Timestamp
      const updateBase: Record<string, any> = { ...updateData };
      if (updateData.publishedAt) {
        updateBase.publishedAt = Timestamp.fromDate(updateData.publishedAt);
      }

      const payload = sanitizeForFirestore({
        ...updateBase,
        updatedAt: Timestamp.now(),
      });
      await updateDoc(newsDoc, payload);
      
      // Update local state
      const updatedAtDate = new Date();
      setNews(prev =>
        prev.map(article =>
          article.id === id
            ? {
                ...article,
                ...updateData,
                updatedAt: updatedAtDate,
                publishedAt: updateData.publishedAt ?? article.publishedAt ?? article.createdAt,
              }
            : article
        )
      );
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
        try {
          await deleteImageFromStorage(imageUrl);
        } catch (imageError) {
          // Continue with deletion if image deletion fails
        }
      }
      
      // Delete the Firestore document
      await deleteDoc(newsDoc);
      
      // Remove from local state
      setNews(prev => prev.filter(article => article.id !== id));
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
