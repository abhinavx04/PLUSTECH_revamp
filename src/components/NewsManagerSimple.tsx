import React, { useState } from 'react';
import { useNewsSimple } from '../hooks/useNewsSimple';

const NewsManagerSimple: React.FC = () => {
  const { news, loading, error, createNews, updateNews, deleteNews } = useNewsSimple();
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published: false,
    featured: false,
    imageUrl: '',
    tags: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateNews({ ...formData, id: editingNews.id });
      } else {
        await createNews(formData);
      }
      setShowForm(false);
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        published: false,
        featured: false,
        imageUrl: '',
        tags: [],
      });
    } catch (err) {
      console.error('Error saving news:', err);
    }
  };

  const handleEdit = (article: any) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      published: article.published,
      featured: article.featured,
      imageUrl: article.imageUrl || '',
      tags: article.tags,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteNews(id);
      } catch (err) {
        console.error('Error deleting news:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      published: false,
      featured: false,
      imageUrl: '',
      tags: [],
    });
  };

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">News Management (Demo Mode)</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          Add New Article
        </button>
      </div>

      {/* News Form */}
      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingNews ? 'Edit Article' : 'Create New Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Excerpt *
              </label>
              <textarea
                required
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Brief description of the article"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Content *
              </label>
              <textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Full article content"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="technology, innovation, manufacturing"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-white">Published</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-white">Featured</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                {editingNews ? 'Update Article' : 'Create Article'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">All Articles ({news.length})</h3>
        <div className="space-y-4">
          {news.length === 0 ? (
            <p className="text-gray-300 text-center py-8">No news articles found. Create your first article!</p>
          ) : (
            news.map((article) => (
              <div key={article.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{article.title}</h4>
                      {article.published && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                          Published
                        </span>
                      )}
                      {article.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>By {article.author}</span>
                      <span>{article.createdAt.toLocaleDateString()}</span>
                      {article.tags.length > 0 && (
                        <span>Tags: {article.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsManagerSimple;
