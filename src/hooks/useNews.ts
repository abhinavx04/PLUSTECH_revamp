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
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle, CreateNewsData, UpdateNewsData } from '../types/news';

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all news articles
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!db) {
        console.warn('[News] Firestore not initialized - skipping fetch');
        setLoading(false);
        return;
      }

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
      
      setNews(newsData);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news articles');
    } finally {
      setLoading(false);
    }
  };

  // Create a new news article
  const createNews = async (newsData: CreateNewsData): Promise<string> => {
    try {
      setError(null);
      
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const newsCollection = collection(db, 'news');
      const docRef = await addDoc(newsCollection, {
        ...newsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Refresh the news list
      await fetchNews();
      
      return docRef.id;
    } catch (err) {
      console.error('Error creating news:', err);
      setError('Failed to create news article');
      throw err;
    }
  };

  // Update an existing news article
  const updateNews = async (newsData: UpdateNewsData): Promise<void> => {
    try {
      setError(null);
      
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const { id, ...updateData } = newsData;
      const newsDoc = doc(db, 'news', id);
      
      await updateDoc(newsDoc, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      // Refresh the news list
      await fetchNews();
    } catch (err) {
      console.error('Error updating news:', err);
      setError('Failed to update news article');
      throw err;
    }
  };

  // Delete a news article
  const deleteNews = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const newsDoc = doc(db, 'news', id);
      await deleteDoc(newsDoc);

      // Refresh the news list
      await fetchNews();
    } catch (err) {
      console.error('Error deleting news:', err);
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
