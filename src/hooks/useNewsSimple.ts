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

  // Mock data for testing - no Firebase dependencies
  const mockNews: NewsArticle[] = [
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
      updatedAt: new Date(),
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
      updatedAt: new Date(Date.now() - 86400000),
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
      updatedAt: new Date(Date.now() - 172800000),
      published: true,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      tags: ['partnerships', 'innovation', 'technology']
    }
  ];

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

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