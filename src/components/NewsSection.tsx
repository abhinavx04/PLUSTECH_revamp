import React from 'react';
import { useNews } from '../hooks/useNews';

const NewsSection: React.FC = () => {
  const { getPublishedNews, loading, error } = useNews();
  const publishedNews = getPublishedNews();
  const featuredNews = publishedNews.filter(article => article.featured);
  const regularNews = publishedNews.filter(article => !article.featured);

  if (loading) {
    return (
      <section className="w-full px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // Don't show news section if there's an error (Firebase not configured)
    return null;
  }

  if (publishedNews.length === 0) {
    return null; // Don't show news section if no published articles
  }

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-black mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-body max-w-3xl mx-auto">
            Stay informed about our latest projects, innovations, and company developments.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-black mb-6">Featured</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.slice(0, 2).map((article) => (
                <div key={article.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  {article.imageUrl && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#00aeef] text-white text-sm font-semibold rounded-full">
                        Featured
                      </span>
                      <span className="text-sm text-gray-500">
                        {article.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-black mb-3 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {article.author}</span>
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        {regularNews.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">Latest Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.slice(0, 6).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {article.imageUrl && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {article.createdAt.toLocaleDateString()}
                      </span>
                      {article.tags.length > 0 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {article.tags[0]}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-black mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="text-xs text-gray-500">
                      By {article.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All News Button */}
        {publishedNews.length > 6 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
              View All News
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
