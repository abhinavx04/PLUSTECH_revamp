import React, { useRef, useState } from 'react';
import {
  useCSRActivitiesFirestore,
  type CSRActivity,
  type CSRCategory,
  type CSRStatus,
  type CSRMetric,
} from '../hooks/useCSRActivitiesFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { getFileSizeMB } from '../lib/imageUtils';
import { uploadPDFToStorage } from '../lib/pdfUtils';

interface CSRFormState {
  title: string;
  description: string;
  category: CSRCategory;
  impact: string;
  year: string;
  status: CSRStatus;
  color: string;
  imageUrl: string; // Legacy single image
  imageUrls: string[]; // Multiple images
  documentUrl: string;
  sortOrder: string;
  published: boolean;
  metrics: CSRMetric[];
}

const categoryOptions: CSRCategory[] = ['education', 'environment', 'community', 'healthcare', 'other'];
const statusOptions: CSRStatus[] = ['active', 'completed', 'planned'];

const defaultFormState: CSRFormState = {
  title: '',
  description: '',
  category: 'education',
  impact: '',
  year: '',
  status: 'active',
  color: '',
  imageUrl: '',
  imageUrls: [],
  documentUrl: '',
  sortOrder: '',
  published: true,
  metrics: [{ label: 'Impact', value: '' }],
};

const CSRManager: React.FC = () => {
  const {
    activities,
    loading,
    error,
    createCSRActivity,
    updateCSRActivity,
    deleteCSRActivity,
  } = useCSRActivitiesFirestore({ includeDrafts: true });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CSRFormState>(defaultFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormError(null);
    setSelectedImageFiles((prev) => [...prev, ...files]);

    // Create previews for new files
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const newImageUrls = [...prev.imageUrls];
      newImageUrls.splice(index, 1);
      return { ...prev, imageUrls: newImageUrls };
    });
  };

  const handleRemoveAllImages = () => {
    setSelectedImageFiles([]);
    setImagePreviews([]);
    setFormData((prev) => ({ ...prev, imageUrl: '', imageUrls: [] }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePDFSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError(null);
    setSelectedPDFFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePDF = () => {
    setSelectedPDFFile(null);
    setPdfPreview(null);
    setFormData((prev) => ({ ...prev, documentUrl: '' }));
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setSelectedImageFiles([]);
    setImagePreviews([]);
    setSelectedPDFFile(null);
    setPdfPreview(null);
    setFormData(defaultFormState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.year.trim()) return 'Year is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      let finalImageUrls = [...formData.imageUrls];
      let finalDocumentUrl = formData.documentUrl;
      let documentSize: number | undefined;
      let documentUploadedAt: Date | undefined;

      if (selectedImageFiles.length > 0) {
        setUploadingImage(true);
        try {
          const uploadPromises = selectedImageFiles.map((file) => 
            uploadImageToStorage(file, 'csr/images')
          );
          const uploadedUrls = await Promise.all(uploadPromises);
          finalImageUrls = [...finalImageUrls, ...uploadedUrls];
        } finally {
          setUploadingImage(false);
        }
      }

      if (selectedPDFFile) {
        setUploadingPDF(true);
        try {
          const pdfResult = await uploadPDFToStorage(selectedPDFFile, 'csr/pdfs');
          finalDocumentUrl = pdfResult.url;
          documentSize = pdfResult.size;
          documentUploadedAt = new Date();
        } finally {
          setUploadingPDF(false);
        }
      }

      const metrics = formData.metrics
        .map((metric) => ({ label: metric.label.trim(), value: metric.value.trim() }))
        .filter((metric) => metric.label && metric.value);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        impact: formData.impact.trim(),
        year: formData.year.trim(),
        status: formData.status,
        color: formData.color.trim() || undefined,
        imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : undefined, // Legacy support
        imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
        documentUrl: finalDocumentUrl || undefined,
        documentSize,
        documentUploadedAt,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
        metrics,
        published: formData.published,
      };

      if (editingId) {
        await updateCSRActivity({ ...payload, id: editingId });
      } else {
        await createCSRActivity(payload);
      }

      resetForm();
    } catch (err: any) {
      console.error('[CSR] Save error:', err);
      setFormError(err?.message || 'Failed to save CSR activity. Check console for details.');
      setUploadingImage(false);
      setUploadingPDF(false);
    }
  };

  const handleEdit = (item: CSRActivity) => {
    setEditingId(item.id);
    const existingImages = item.imageUrls && item.imageUrls.length > 0 
      ? item.imageUrls 
      : (item.imageUrl ? [item.imageUrl] : []);
    
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      impact: item.impact,
      year: item.year,
      status: item.status,
      color: item.color || '',
      imageUrl: existingImages[0] || '',
      imageUrls: existingImages,
      documentUrl: item.documentUrl || '',
      sortOrder: item.sortOrder?.toString() || '',
      metrics: item.metrics && item.metrics.length > 0 ? item.metrics : [{ label: 'Impact', value: '' }],
      published: item.published,
    });
    setImagePreviews(existingImages);
    setSelectedImageFiles([]);
    setSelectedPDFFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this CSR activity? This cannot be undone.')) return;
    try {
      await deleteCSRActivity(id);
    } catch (err) {
      console.error('[CSR] Delete failed:', err);
    }
  };

  const handlePublishToggle = async (item: CSRActivity) => {
    try {
      await updateCSRActivity({ id: item.id, published: !item.published });
    } catch (err) {
      console.error('[CSR] Publish toggle failed:', err);
    }
  };

  const handleMetricChange = (index: number, field: 'label' | 'value', value: string) => {
    setFormData((prev) => {
      const updated = [...prev.metrics];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, metrics: updated };
    });
  };

  const handleAddMetric = () => {
    setFormData((prev) => ({ ...prev, metrics: [...prev.metrics, { label: '', value: '' }] }));
  };

  const handleRemoveMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 text-red-50">
          <div className="font-semibold mb-1">Firestore error</div>
          <div className="text-sm whitespace-pre-line">{error}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">CSR Activities Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          Add CSR Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {editingId ? 'Edit CSR Activity' : 'Create CSR Activity'}
            </h3>
            <button
              onClick={resetForm}
              className="text-sm text-gray-300 hover:text-white"
              type="button"
            >
              Close
            </button>
          </div>

          {formError && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-100 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Green Manufacturing Initiative"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Impact Highlight</label>
                <input
                  type="text"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="30% carbon reduction"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CSRCategory })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CSRStatus })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Year *</label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Explain the CSR program, partners, and outcomes"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Brand Color (gradient)</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="from-green-500 to-green-700"
                />
                <p className="text-xs text-gray-300 mt-1">Optional Tailwind gradient (uses defaults if empty)</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span className="text-white text-sm">Published</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">Impact Metrics</h4>
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="px-3 py-1 bg-[#00aeef] text-black text-sm rounded hover:bg-[#0099d4] transition-colors"
                >
                  Add Metric
                </button>
              </div>
              {formData.metrics.length === 0 ? (
                <p className="text-gray-300 text-sm">No metrics added. Click "Add Metric" to add one.</p>
              ) : (
                <div className="space-y-3">
                  {formData.metrics.map((metric, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        placeholder="Metric label (e.g., Families Supported)"
                      />
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        placeholder="Metric value (e.g., 500+)"
                      />
                      <div className="flex md:justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveMetric(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">PDF Document (Optional)</label>
              
              {(pdfPreview || formData.documentUrl) && (
                <div className="mb-3 relative">
                  <div className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-white text-sm font-medium">PDF Document</p>
                        {formData.documentUrl && (
                          <a
                            href={formData.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00aeef] text-xs hover:underline"
                          >
                            View PDF
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePDF}
                      className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFSelect}
                  className="hidden"
                  id="csr-pdf-upload"
                  disabled={uploadingPDF}
                />
                <label
                  htmlFor="csr-pdf-upload"
                  className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingPDF
                      ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                      : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                  }`}
                >
                  {uploadingPDF ? (
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]" />
                      <span>Uploading PDF...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-white">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm">
                        {selectedPDFFile
                          ? `Selected: ${selectedPDFFile.name} (${(selectedPDFFile.size / (1024 * 1024)).toFixed(2)}MB)`
                          : 'Click to upload PDF document (Max 50MB)'}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Images (Multiple images supported)</label>

              {/* Image Gallery */}
              {(imagePreviews.length > 0 || formData.imageUrls.length > 0) && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(imagePreviews.length > 0 ? imagePreviews : formData.imageUrls).map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length > 0 && (
                <button
                  type="button"
                  onClick={handleRemoveAllImages}
                  className="mb-3 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Remove All Images
                </button>
              )}

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="csr-image-upload"
                  disabled={uploadingImage}
                  multiple
                />
                <label
                  htmlFor="csr-image-upload"
                  className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                      : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]" />
                      <span>Uploading images...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-white">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-center">
                        {selectedImageFiles.length > 0
                          ? `${selectedImageFiles.length} image(s) selected`
                          : 'Click to upload images (JPEG, PNG, WebP) - Multiple selection allowed'}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                {editingId ? 'Update CSR Activity' : 'Save CSR Activity'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">CSR Activities ({activities.length})</h3>
          {loading && <span className="text-xs text-gray-300">Loading…</span>}
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-gray-300 text-sm">No CSR activities yet. Add your first activity!</p>
          ) : (
            activities.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded border ${
                        item.published
                          ? 'bg-green-500/20 text-green-200 border-green-500/40'
                          : 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-white/10 text-gray-200 border border-white/10 capitalize">
                      {item.status}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-white/10 text-gray-200 border border-white/10 capitalize">
                      {item.category}
                    </span>
                    {item.year && <span className="px-2 py-1 text-xs rounded bg-white/10 text-gray-200 border border-white/10">Year: {item.year}</span>}
                  </div>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
                    {item.impact && <span>Impact: {item.impact}</span>}
                    <span>Metrics: {item.metrics.length}</span>
                    {item.documentUrl && (
                      <span className="flex items-center gap-1 text-green-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        PDF Available
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePublishToggle(item)}
                    className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                      item.published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {item.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CSRManager;


