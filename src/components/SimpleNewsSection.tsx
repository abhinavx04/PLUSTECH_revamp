import React, { useState } from 'react';
import { useNewsFirestore } from '../hooks/useNewsFirestore';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

const SimpleNewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { news, loading } = useNewsFirestore();

  // Now using real data from Firestore via useNewsFirestore hook

  const publishedNews = news.filter(article => article.published);
  const featuredNews = publishedNews.filter(article => article.featured);
  const regularNews = publishedNews.filter(article => !article.featured);

  // Show loading state
  if (loading) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
            Latest News & Updates
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-700 font-body">
            Stay informed with our latest announcements and insights.
          </p>
        </div>

        {/* Show message when no news articles */}
        {publishedNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              <i className="fas fa-newspaper text-4xl mb-4 block"></i>
              <p>No news articles available yet.</p>
              <p className="text-sm mt-2">Check back soon for updates!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedNews.map(article => (
              <div key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-black mb-2">{article.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>By {article.author}</span>
                    <span>{article.createdAt.toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full px-3 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200 font-semibold text-sm"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative">
              {selectedArticle.imageUrl && (
                <div className="h-64 md:h-80 overflow-hidden">
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.createdAt.toLocaleDateString()}</span>
                  {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {selectedArticle.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Featured
                    </span>
                  )}
                  {selectedArticle.published && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Published
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SimpleNewsSection;
