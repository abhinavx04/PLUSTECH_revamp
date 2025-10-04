import React, { useState } from 'react';

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

  // Static news data - no hooks, no Firebase
  const news: NewsArticle[] = [
    {
      id: '1',
      title: 'PlusTech Launches Revolutionary Automation Solutions',
      content: `We are excited to announce the launch of our revolutionary automation solutions that are set to transform the manufacturing industry.

Our new suite of automation technologies combines artificial intelligence, machine learning, and advanced robotics to create unprecedented efficiency in production processes. This breakthrough represents years of research and development by our dedicated engineering team.

Key features of our new automation solutions include:
• Intelligent process optimization
• Real-time quality monitoring
• Predictive maintenance capabilities
• Seamless integration with existing systems
• Reduced energy consumption by up to 40%

The implementation of these solutions has already shown remarkable results in our pilot programs, with companies reporting significant improvements in productivity, quality, and cost-effectiveness.

"We believe this technology will revolutionize how manufacturers approach production," said our CEO. "Our goal is to make advanced automation accessible to businesses of all sizes."

The solutions are now available for deployment across various industries including automotive, electronics, pharmaceuticals, and food processing.`,
      excerpt: 'PlusTech introduces groundbreaking automation solutions for modern manufacturing.',
      author: 'Admin User',
      createdAt: new Date(),
      published: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      tags: ['automation', 'manufacturing', 'innovation']
    },
    {
      id: '2',
      title: 'Digital Transformation Initiative Reaches Major Milestone',
      content: `Our comprehensive digital transformation initiative has reached a significant milestone, marking a new era for PlusTech and our clients.

Over the past 18 months, we have successfully migrated over 200 legacy systems to cloud-based infrastructure, resulting in improved scalability, security, and operational efficiency. This transformation has positioned our clients at the forefront of digital innovation.

The initiative encompasses several key areas:
• Cloud infrastructure modernization
• Data analytics and business intelligence
• Cybersecurity enhancements
• Mobile-first application development
• IoT integration capabilities

Our team has worked tirelessly to ensure minimal disruption to ongoing operations while maximizing the benefits of modern technology. The results speak for themselves - our clients have seen an average of 35% improvement in system performance and 50% reduction in maintenance costs.

"We're not just upgrading technology; we're transforming how businesses operate in the digital age," commented our CTO. "This milestone represents our commitment to driving innovation and delivering value to our clients."

The next phase of our digital transformation initiative will focus on AI-powered analytics and machine learning integration, further enhancing our clients' competitive advantage.`,
      excerpt: 'Major milestone achieved in our digital transformation initiative with significant improvements in performance and efficiency.',
      author: 'Tech Team',
      createdAt: new Date(Date.now() - 86400000),
      published: true,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
      tags: ['digital transformation', 'cloud computing', 'innovation']
    },
    {
      id: '3',
      title: 'Strategic Partnerships with Leading Tech Giants Announced',
      content: `PlusTech is proud to announce strategic partnerships with several leading technology companies, marking a significant step forward in our mission to deliver cutting-edge solutions.

These partnerships will enable us to leverage the latest technologies and best practices from industry leaders, ensuring that our clients always have access to the most advanced and reliable solutions available in the market.

The partnerships include collaborations in:
• Artificial Intelligence and Machine Learning
• Cloud Computing and Infrastructure
• Cybersecurity and Data Protection
• Internet of Things (IoT) Solutions
• Advanced Analytics and Business Intelligence

These strategic alliances will allow us to accelerate our innovation roadmap and bring new capabilities to market faster than ever before. Our clients will benefit from enhanced product offerings, improved service quality, and access to cutting-edge technologies.

"We are thrilled to partner with these industry leaders," said our CEO. "These collaborations strengthen our position as a technology innovator and allow us to deliver even greater value to our clients."

The partnerships will also facilitate knowledge sharing, joint research initiatives, and collaborative development projects that will drive innovation across multiple industries.`,
      excerpt: 'Strategic partnerships with leading tech companies to accelerate innovation and enhance client solutions.',
      author: 'Partnership Team',
      createdAt: new Date(Date.now() - 172800000),
      published: true,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      tags: ['partnerships', 'innovation', 'technology']
    }
  ];

  const publishedNews = news.filter(article => article.published);
  const featuredNews = publishedNews.filter(article => article.featured);
  const regularNews = publishedNews.filter(article => !article.featured);

  if (publishedNews.length === 0) {
    return null;
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

        {featuredNews.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold font-heading text-black mb-6">Featured Articles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map(article => (
                <div key={article.id} className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                  {article.imageUrl && (
                    <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
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
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-black mb-2">{article.title}</h4>
                      <p className="text-gray-700 mb-4">{article.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>By {article.author}</span>
                      <span>{article.createdAt.toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200 font-semibold"
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {regularNews.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-black mb-6">More News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map(article => (
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
