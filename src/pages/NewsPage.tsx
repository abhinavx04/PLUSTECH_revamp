import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useNewsFirestore } from '../hooks/useNewsFirestore';
import { SEO } from '../components/SEO';
import { PageLayout } from '../components/PageLayout';

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

const ITEMS_PER_PAGE = 6;

const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const { news, loading, error } = useNewsFirestore();

  const publishedNews = news.filter(article => article.published);
  const visibleNews = publishedNews.slice(0, visibleCount);
  const hasMore = visibleCount < publishedNews.length;
  const remaining = publishedNews.length - visibleCount;

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

  return (
    <>
      <SEO
        title="News & Updates - PLUSTECH"
        description="Stay updated with the latest news, updates, and announcements from PLUSTECH. Read about our latest projects, achievements, and industry insights."
        url="/news"
        keywords="PLUSTECH news, industry updates, company news, surface finishing industry, automation news"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">

      <main className="flex-1 w-full overflow-hidden">
        <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 py-14 md:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-20 w-64 h-64 bg-[#00aeef]/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="space-y-5 text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
                News & Events
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Stay informed with our latest announcements, insights, and company updates.
              </p>
            </div>
          </div>
        </section>

        <section className="relative px-6 md:px-12 lg:px-16 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                <div className="font-semibold">Error loading news</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            {loading && publishedNews.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map(i => (
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
            ) : null}

            {!loading && publishedNews.length === 0 && !error && (
              <div className="max-w-md mx-auto text-center py-16 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles yet</h3>
                <p className="text-sm text-slate-600 mb-4">Check back soon for our latest insights and updates.</p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-[#00aeef] text-black font-semibold shadow-sm hover:shadow-md transition"
                >
                  Back to Home
                </a>
              </div>
            )}

            <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
              {visibleNews.map((article) => (
                <div
                  key={article.id}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col overflow-hidden"
                >
                  {article.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 z-10" />
                  )}
                  <div className="relative w-full h-40 sm:h-44 bg-white flex items-center justify-center overflow-hidden">
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.title || 'News image'} 
                        className="max-h-full max-w-[85%] object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
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

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-[#00aeef] hover:text-[#00aeef] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Load More
                  <span className="text-sm font-normal text-slate-400">
                    ({remaining > 0 ? remaining : 0} remaining)
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* News Detail Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
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
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black bg-opacity-50 text-white rounded-full p-1.5 sm:p-2 hover:bg-opacity-70 transition-all duration-200"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                  <span>By {selectedArticle.author}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <time>
                    {(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedArticle.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      </PageLayout>
    </>
  );
};

export default NewsPage;




