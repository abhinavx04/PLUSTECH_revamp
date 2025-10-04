import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle, CreateNewsData, UpdateNewsData } from '../types/news';

export const useNewsSafe = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Firestore is available
  const isFirestoreAvailable = () => {
    if (!db) {
      console.warn('[News] Firestore not initialized');
      return false;
    }
    return true;
  };

  // Fetch all news articles
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isFirestoreAvailable()) {
        console.warn('[News] Firestore not available - using empty array');
        setNews([]);
        setLoading(false);
        return;
      }

      console.log('[News] Fetching news from Firestore...');
      const newsCollection = collection(db, 'news');
      const q = query(newsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const newsData: NewsArticle[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as NewsArticle);
      });
      
      console.log('[News] Fetched', newsData.length, 'articles');
      setNews(newsData);
    } catch (err) {
      console.error('[News] Error fetching news:', err);
      setError('Failed to fetch news articles');
      setNews([]); // Set empty array on error to prevent crashes
    } finally {
      setLoading(false);
    }
  };

  // Create a new news article
  const createNews = async (newsData: CreateNewsData): Promise<string> => {
    try {
      setError(null);
      
      if (!isFirestoreAvailable()) {
        throw new Error('Firestore not initialized');
      }

      console.log('[News] Creating news article:', newsData.title);
      const newsCollection = collection(db, 'news');
      const docRef = await addDoc(newsCollection, {
        ...newsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('[News] Created article with ID:', docRef.id);
      // Refresh the news list
      await fetchNews();
      
      return docRef.id;
    } catch (err) {
      console.error('[News] Error creating news:', err);
      setError('Failed to create news article');
      throw err;
    }
  };

  // Update an existing news article
  const updateNews = async (newsData: UpdateNewsData): Promise<void> => {
    try {
      setError(null);
      
      if (!isFirestoreAvailable()) {
        throw new Error('Firestore not initialized');
      }

      const { id, ...updateData } = newsData;
      console.log('[News] Updating article:', id);
      const newsDoc = doc(db, 'news', id);
      
      await updateDoc(newsDoc, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      console.log('[News] Updated article successfully');
      // Refresh the news list
      await fetchNews();
    } catch (err) {
      console.error('[News] Error updating news:', err);
      setError('Failed to update news article');
      throw err;
    }
  };

  // Delete a news article
  const deleteNews = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      if (!isFirestoreAvailable()) {
        throw new Error('Firestore not initialized');
      }

      console.log('[News] Deleting article:', id);
      const newsDoc = doc(db, 'news', id);
      await deleteDoc(newsDoc);

      console.log('[News] Deleted article successfully');
      // Refresh the news list
      await fetchNews();
    } catch (err) {
      console.error('[News] Error deleting news:', err);
      setError('Failed to delete news article');
      throw err;
    }
  };

  // Get published news for homepage
  const getPublishedNews = () => {
    return news.filter(article => article.published);
  };

  // Get featured news
  const getFeaturedNews = () => {
    return news.filter(article => article.published && article.featured);
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    createNews,
    updateNews,
    deleteNews,
    fetchNews,
    getPublishedNews,
    getFeaturedNews,
  };
};
