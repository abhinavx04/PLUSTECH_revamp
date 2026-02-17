import React, { useState, useEffect } from 'react';
import { useNewsFirestore } from '../hooks/useNewsFirestore';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  /**
   * Logical news date (can be backdated, used for ordering)
   */
  publishedAt?: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

const SimpleNewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { news, loading, error } = useNewsFirestore();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  const publishedNews = news.filter(article => article.published);
  const latestPublished = publishedNews.slice(0, 3); // show only latest few on homepage

  // Show error state
  if (error) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900">
              Latest News & Updates
            </h2>
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Error loading news: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
              Latest News & Updates
            </h2>
            <p className="mt-4 text-lg md:text-xl text-slate-600 font-body">
              Stay informed with our latest announcements and insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="w-full aspect-[16/9] bg-slate-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900">
            Latest News & Updates
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 font-body">
            Stay informed with our latest announcements and insights.
          </p>
        </div>

        {/* Show message when no news articles */}
        {publishedNews.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles yet</h3>
            <p className="text-sm text-slate-600">Check back soon for our latest insights and updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestPublished.map(article => (
              <div
                key={article.id}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col overflow-hidden"
              >
                {article.featured && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 z-10" />
                )}
                <div className="relative w-full aspect-[16/9] min-h-[220px] overflow-hidden bg-white flex items-center justify-center">
                  {article.imageUrl ? (
                    <>
                      <img 
                        src={article.imageUrl} 
                        alt={article.title || 'News image'} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 bg-white"
                        style={{ backgroundColor: 'white' }}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                      <div className="text-slate-300 text-6xl font-light">N</div>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2 tracking-tight">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="uppercase tracking-wide">{article.author}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <time>
                      {(article.publishedAt || article.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  {(article.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(article.tags || []).slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="mt-auto w-full inline-flex items-center justify-center rounded-xl bg-[#00aeef] text-black font-semibold py-3 text-sm shadow-md hover:shadow-lg hover:bg-[#0099d4] hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2"
                  >
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {publishedNews.length > latestPublished.length && (
          <div className="flex justify-center mt-12">
            <a
              href="/news"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-[#00aeef] border border-slate-200 font-semibold shadow-sm hover:shadow-md hover:border-[#00aeef]/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              View all news
            </a>
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex-shrink-0">
              {selectedArticle.imageUrl && (
                <div className="w-full max-h-[40vh] sm:max-h-[50vh] overflow-hidden bg-white flex items-center justify-center">
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-contain max-h-[40vh] sm:max-h-[50vh] bg-white"
                    style={{ backgroundColor: 'white' }}
                    loading="lazy"
                    decoding="async"
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
                  <span>
                    {(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString()}
                  </span>
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
