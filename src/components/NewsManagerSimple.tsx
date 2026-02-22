import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useNewsFirestore } from '../hooks/useNewsFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { getFileSizeMB } from '../lib/imageUtils';
import { useFormDraft } from '../hooks/useFormDraft';
import SlidePanel from './SlidePanel';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  /**
   * Logical news date (can be backdated, used for ordering)
   */
  publishedAt?: Date;
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
  /**
   * Logical news date (can be backdated, used for ordering)
   */
  publishedAt?: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}


const NewsManagerSimple: React.FC = () => {
  const { news, loading, error, createNews, updateNews, deleteNews } = useNewsFirestore();
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateNewsData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    publishedAt: undefined,
    published: false,
    featured: false,
    imageUrl: '',
    tags: [],
  });
  const [publishDate, setPublishDate] = useState<string>('');

  const stableSetFormData = useCallback((d: CreateNewsData) => setFormData(d), []);
  const { clearDraft } = useFormDraft({
    key: 'news',
    editingId: editingNews?.id || null,
    formData,
    setFormData: stableSetFormData,
    isOpen: showForm,
    extraState: publishDate,
    setExtraState: setPublishDate,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;
    const q = searchQuery.toLowerCase();
    return news.filter((a) => a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q));
  }, [news, searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError(null);
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadImageToStorage(selectedImageFile, 'news/images');
        } catch (uploadError: any) {
          setUploadingImage(false);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        setUploadingImage(false);
      }

      const publishedAtDate = publishDate ? new Date(`${publishDate}T00:00:00`) : undefined;

      const newsData: CreateNewsData = { 
        ...formData, 
        imageUrl: finalImageUrl || undefined,
        publishedAt: publishedAtDate,
      };
      
      if (editingNews) {
        await updateNews({ ...newsData, id: editingNews.id });
      } else {
        await createNews(newsData);
      }

      clearDraft();
      setShowForm(false);
      setEditingNews(null);
      setSelectedImageFile(null);
      setImagePreview(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        publishedAt: undefined,
        published: false,
        featured: false,
        imageUrl: '',
        tags: [],
      });
      setPublishDate('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error saving news:', err);
      const errorMsg = err?.message || err?.code || 'Failed to save news article. Check console for details.';
      setFormError(errorMsg);
      setUploadingImage(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      publishedAt: article.publishedAt || article.createdAt,
      published: article.published,
      featured: article.featured,
      imageUrl: article.imageUrl || '',
      tags: article.tags,
    });
    const effectiveDate = article.publishedAt || article.createdAt;
    const yyyy = effectiveDate.getFullYear();
    const mm = String(effectiveDate.getMonth() + 1).padStart(2, '0');
    const dd = String(effectiveDate.getDate()).padStart(2, '0');
    setPublishDate(`${yyyy}-${mm}-${dd}`);
    setImagePreview(article.imageUrl || null);
    setSelectedImageFile(null);
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
    clearDraft();
    setShowForm(false);
    setEditingNews(null);
    setFormError(null);
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      publishedAt: undefined,
      published: false,
      featured: false,
      imageUrl: '',
      tags: [],
    });
    setPublishDate('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-red-200 font-bold text-lg mb-2">⚠️ Firestore Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
          {error.includes('permission-denied') && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Solution:</strong> Update your Firestore security rules. 
                See <code className="bg-black/30 px-2 py-1 rounded">FIRESTORE_RULES.md</code> in the project root for instructions.
              </p>
              <p className="text-yellow-200 text-xs mt-2">
                Go to Firebase Console → Firestore Database → Rules, then update the rules to allow authenticated users access to the "news" collection.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">News Management (Demo Mode)</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          + Add New Article
        </button>
      </div>

      {/* SlidePanel Form */}
      <SlidePanel open={showForm} onClose={handleCancel} title={editingNews ? 'Edit Article' : 'Create New Article'}
        footer={
          <div className="flex flex-wrap gap-3">
            <button type="submit" form="news-form" className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200">
              {editingNews ? 'Update Article' : 'Create Article'}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">Cancel</button>
          </div>
        }
      >
        {formError && (<div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3"><p className="text-red-200 text-sm">{formError}</p></div>)}
        {error && (<div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3"><p className="text-red-200 text-sm">{error}</p></div>)}
        <form id="news-form" onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                News Date *
              </label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                min="2006-01-01"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
              />
              <p className="mt-1 text-xs text-gray-300">
                Select the actual date of this news (you can backdate to 2006 for older updates).
              </p>
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
              Article Image
            </label>
            
            {/* Image Preview */}
            {(imagePreview || formData.imageUrl) && (
              <div className="mb-3 relative bg-white/5 rounded-lg border border-white/20 p-3 flex items-center justify-center min-h-[200px] max-h-[400px] overflow-hidden">
                <img
                  src={imagePreview || formData.imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* File Input */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadingImage
                    ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                    : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                }`}
              >
                {uploadingImage ? (
                  <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]"></div>
                    <span>Uploading and compressing image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-white">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">
                      {selectedImageFile
                        ? `Selected: ${selectedImageFile.name} (${getFileSizeMB(selectedImageFile).toFixed(2)}MB)`
                        : 'Click to upload image (JPEG, PNG, WebP)'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Image will be compressed to 1-2MB automatically
                    </span>
                  </div>
                )}
              </label>
            </div>
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
        </form>
      </SlidePanel>

      {/* News List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-semibold text-white">All Articles ({filteredNews.length})</h3>
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, author..."
            className="w-full sm:w-72 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef] text-sm" />
        </div>
        {loading && <span className="text-xs text-gray-300">Loading...</span>}
        <div className="space-y-1">
          {paginatedNews.length === 0 ? (
            <p className="text-gray-300 text-sm py-4">{searchQuery ? 'No articles match your search.' : 'No news articles found. Create your first article!'}</p>
          ) : (
            paginatedNews.map((article) => (
              <div key={article.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${article.published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-white font-medium truncate">{article.title}</span>
                  {article.featured && <span className="hidden sm:inline px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shrink-0">Featured</span>}
                  <span className="hidden sm:inline text-xs text-gray-400 shrink-0">{article.author}</span>
                  <span className="hidden md:inline text-xs text-gray-400 shrink-0">{article.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(article)} className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(article.id)} className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm rounded bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors">Previous</button>
            <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm rounded bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagerSimple;
