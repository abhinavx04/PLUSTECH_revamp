import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useFormDraft } from '../hooks/useFormDraft';
import {
  useCertificationsFirestore,
  type CertificationCategory,
  type CertificationStatus,
  type Certification,
} from '../hooks/useCertificationsFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { getFileSizeMB } from '../lib/imageUtils';
import SlidePanel from './SlidePanel';

interface CertificationFormState {
  name: string;
  issuingBody: string;
  description: string;
  validUntil: string;
  category: CertificationCategory;
  status: CertificationStatus;
  color: string;
  imageUrl: string;
  sortOrder: string;
  published: boolean;
}

const categoryOptions: CertificationCategory[] = ['quality', 'financial', 'compliance', 'safety', 'other'];
const statusOptions: CertificationStatus[] = ['active', 'pending', 'renewed'];

const defaultFormState: CertificationFormState = {
  name: '',
  issuingBody: '',
  description: '',
  validUntil: '',
  category: 'quality',
  status: 'active',
  color: '',
  imageUrl: '',
  sortOrder: '',
  published: true,
};

const CertificationManager: React.FC = () => {
  const {
    certifications,
    loading,
    error,
    createCertification,
    updateCertification,
    deleteCertification,
  } = useCertificationsFirestore({ includeDrafts: true });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificationFormState>(defaultFormState);
  const stableSetFormData = useCallback((d: CertificationFormState) => setFormData(d), []);
  const { clearDraft } = useFormDraft({
    key: 'certifications',
    editingId,
    formData,
    setFormData: stableSetFormData,
    isOpen: showForm,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const filteredCerts = useMemo(() => {
    if (!searchQuery.trim()) return certifications;
    const q = searchQuery.toLowerCase();
    return certifications.filter((c) => c.name.toLowerCase().includes(q) || c.issuingBody.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [certifications, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCerts.length / ITEMS_PER_PAGE));

  const paginatedCerts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCerts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCerts, currentPage]);

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
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    clearDraft();
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData(defaultFormState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Certification name is required';
    if (!formData.issuingBody.trim()) return 'Issuing body is required';
    if (!formData.validUntil) return 'Valid until date is required';
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
      let finalImageUrl = formData.imageUrl;

      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadImageToStorage(selectedImageFile, 'certifications/images');
        } finally {
          setUploadingImage(false);
        }
      }

      const payload = {
        name: formData.name.trim(),
        issuingBody: formData.issuingBody.trim(),
        description: formData.description.trim(),
        validUntil: formData.validUntil,
        category: formData.category,
        status: formData.status,
        color: formData.color.trim() || undefined,
        imageUrl: finalImageUrl || undefined,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
        published: formData.published,
      };

      if (editingId) {
        await updateCertification({ ...payload, id: editingId });
      } else {
        await createCertification(payload);
      }

      resetForm();
    } catch (err: any) {
      console.error('[Certification] Save error:', err);
      setFormError(err?.message || 'Failed to save certification. Check console for details.');
      setUploadingImage(false);
    }
  };

  const handleEdit = (item: Certification) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      issuingBody: item.issuingBody,
      description: item.description,
      validUntil: item.validUntil,
      category: item.category,
      status: item.status,
      color: item.color || '',
      imageUrl: item.imageUrl || '',
      sortOrder: item.sortOrder?.toString() || '',
      published: item.published,
    });
    setImagePreview(item.imageUrl || null);
    setSelectedImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certification? This cannot be undone.')) return;
    try {
      await deleteCertification(id);
    } catch (err) {
      console.error('[Certification] Delete failed:', err);
    }
  };

  const handlePublishToggle = async (item: Certification) => {
    try {
      await updateCertification({ id: item.id, published: !item.published });
    } catch (err) {
      console.error('[Certification] Publish toggle failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 text-red-50">
          <div className="font-semibold mb-1">Firestore error</div>
          <div className="text-sm whitespace-pre-line">{error}</div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Certifications Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          + Add Certification
        </button>
      </div>

      <SlidePanel
        open={showForm}
        onClose={resetForm}
        title={editingId ? 'Edit Certification' : 'Create Certification'}
        footer={
          <div className="flex flex-wrap gap-3">
            <button type="submit" form="cert-form" className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200">{editingId ? 'Update Certification' : 'Save Certification'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm">Cancel</button>
          </div>
        }
      >
        {formError && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-100 text-sm">
            {formError}
          </div>
        )}

        <form id="cert-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Certification Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="ISO 9001:2015"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Issuing Body *</label>
              <input
                type="text"
                required
                value={formData.issuingBody}
                onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="International Organization for Standardization"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CertificationCategory })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef] [&>option]:bg-gray-900 [&>option]:text-white"
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CertificationStatus })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef] [&>option]:bg-gray-900 [&>option]:text-white"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Valid Until *</label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sort Order (optional)</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="0"
              />
              <p className="text-xs text-gray-300 mt-1">Lower numbers appear first</p>
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
              placeholder="Brief description of the certification and what it covers"
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
                placeholder="from-blue-500 to-blue-700"
              />
              <p className="text-xs text-gray-300 mt-1">Optional Tailwind gradient (uses defaults if empty)</p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-white text-sm">Published</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Certification Image / Badge</label>

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

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                id="certification-image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="certification-image-upload"
                className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploadingImage
                    ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                    : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                }`}
              >
                {uploadingImage ? (
                  <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]" />
                    <span>Uploading image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-white">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">
                      {selectedImageFile
                        ? `Selected: ${selectedImageFile.name} (${getFileSizeMB(selectedImageFile).toFixed(2)}MB)`
                        : 'Click to upload badge/logo (JPEG, PNG, WebP)'}
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </form>
      </SlidePanel>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Certifications ({filteredCerts.length})</h3>
          {loading && <span className="text-xs text-gray-300">Loading…</span>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, issuing body, or category..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
          />
        </div>

        <div className="space-y-1">
          {paginatedCerts.length === 0 ? (
            <p className="text-gray-300 text-sm">No certifications yet. Add your first certification!</p>
          ) : (
            paginatedCerts.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-white font-medium truncate">{item.name}</span>
                  <span className="hidden sm:inline px-2 py-0.5 text-xs rounded bg-white/10 text-gray-300 border border-white/10 capitalize shrink-0">{item.category}</span>
                  <span className="hidden md:inline text-xs text-gray-400 shrink-0">{item.issuingBody}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handlePublishToggle(item)} className={`px-2.5 py-1 text-xs text-white rounded transition-colors ${item.published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>{item.published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => handleEdit(item)} className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationManager;
