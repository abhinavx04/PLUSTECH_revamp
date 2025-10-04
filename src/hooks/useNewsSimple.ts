import { useState, useEffect } from 'react';

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

export const useNewsSimple = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start with empty state - no mock data

  const createNews = async (newsData: any): Promise<string> => {
    console.log('Creating news article:', newsData);
    const newArticle = {
      id: Date.now().toString(),
      ...newsData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNews(prev => [newArticle, ...prev]);
    return newArticle.id;
  };

  const updateNews = async (newsData: any): Promise<void> => {
    console.log('Updating news article:', newsData);
    setNews(prev => prev.map(article => 
      article.id === newsData.id ? { ...article, ...newsData, updatedAt: new Date() } : article
    ));
  };

  const deleteNews = async (id: string): Promise<void> => {
    console.log('Deleting news article:', id);
    setNews(prev => prev.filter(article => article.id !== id));
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