import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
        console.warn('[News] Firestore not available');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const newsCollection = collection(db, 'news');
        const q = query(newsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const newsData: NewsArticle[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
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
            featured: article.featured
          });
        });
        
        setNews(newsData);
        console.log('[News] Loaded', newsData.length, 'articles from Firestore');
      } catch (err) {
        console.error('[News] Error loading news:', err);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const createNews = async (newsData: CreateNewsData): Promise<string> => {
    if (!db) {
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Creating news article:', newsData);
      
      const newsCollection = collection(db, 'news');
      const docRef = await addDoc(newsCollection, {
        ...newsData,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    } catch (err) {
      console.error('[News] Error creating news:', err);
      setError('Failed to create news article');
      throw err;
    }
  };

  const updateNews = async (newsData: UpdateNewsData): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Updating news article:', newsData);
      
      const { id, ...updateData } = newsData;
      const newsDoc = doc(db, 'news', id);
      await updateDoc(newsDoc, {
        ...updateData,
        updatedAt: new Date(),
      });
      
      // Update local state
      setNews(prev => prev.map(article =>
        article.id === id ? { ...article, ...updateData, updatedAt: new Date() } : article
      ));
      
      console.log('[News] Updated article:', id);
    } catch (err) {
      console.error('[News] Error updating news:', err);
      setError('Failed to update news article');
      throw err;
    }
  };

  const deleteNews = async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      console.log('[News] Deleting news article:', id);
      
      const newsDoc = doc(db, 'news', id);
      await deleteDoc(newsDoc);
      
      // Remove from local state
      setNews(prev => prev.filter(article => article.id !== id));
      
      console.log('[News] Deleted article:', id);
    } catch (err) {
      console.error('[News] Error deleting news:', err);
      setError('Failed to delete news article');
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
