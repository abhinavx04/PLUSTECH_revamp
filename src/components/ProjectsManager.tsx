import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useProjectsFirestore, type Project, PROCESS_OPTIONS, SURFACE_OPTIONS } from '../hooks/useProjectsFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { buildYouTubeEmbedUrl, extractYouTubeId, isValidYouTubeUrl } from '../lib/youtube';
import SlidePanel from './SlidePanel';
import { useFormDraft } from '../hooks/useFormDraft';

type Status = 'draft' | 'published';

interface ProjectFormState {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  processes: string[];
  surfaces: string[];
  featuredImageUrl: string;
  imageUrls: string;
  youtubeUrl: string;
  year: string;
  location: string;
  technologies: string;
  status: Status;
}

const defaultFormState: ProjectFormState = {
  title: '',
  shortDescription: '',
  description: '',
  category: '',
  processes: [],
  surfaces: [],
  featuredImageUrl: '',
  imageUrls: '',
  youtubeUrl: '',
  year: '',
  location: '',
  technologies: '',
  status: 'draft',
};

const ITEMS_PER_PAGE = 15;

const ProjectsManager: React.FC = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjectsFirestore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProjectFormState>(defaultFormState);

  const stableSetFormData = useCallback((d: ProjectFormState) => setFormData(d), []);
  const { clearDraft } = useFormDraft({
    key: 'projects',
    editingId,
    formData,
    setFormData: stableSetFormData,
    isOpen: showForm,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.year?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeMB = 10;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type`);
        return;
      }
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        invalidFiles.push(`${file.name}: File too large (max ${maxSizeMB}MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setFormError(`Some files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setFormError(null);
      const newFiles = [...selectedImageFiles, ...validFiles];
      setSelectedImageFiles(newFiles);

      const newPreviews: string[] = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === validFiles.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = selectedImageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    const currentUrls = formData.imageUrls?.split(',').filter(Boolean) || [];
    const newUrls = currentUrls.filter((url) => url.trim() !== imageUrl.trim());
    setFormData((prev) => ({ ...prev, imageUrls: newUrls.join(',') }));
  };

  const parseTechnologies = (value: string) =>
    value
      .split(',')
      .map((tech) => tech.trim())
      .filter(Boolean);

  const validateForm = () => {
    if (!formData.title.trim()) return 'Project title is required';
    if (!formData.shortDescription.trim()) return 'Short description is required';
    if (formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl)) {
      return 'Please provide a valid YouTube URL (youtube.com/watch?v= or youtu.be/ID)';
    }
    return null;
  };

  const resetForm = () => {
    clearDraft();
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setSelectedImageFiles([]);
    setImagePreviews([]);
    setFormData(defaultFormState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      const videoId = extractYouTubeId(formData.youtubeUrl || '');
      const technologies = parseTechnologies(formData.technologies);

      const existingImageUrls = formData.imageUrls
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

      let uploadedImageUrls: string[] = [];
      if (selectedImageFiles.length > 0) {
        setUploadingImage(true);
        try {
          uploadedImageUrls = await Promise.all(
            selectedImageFiles.map((file) => uploadImageToStorage(file, 'projects/images'))
          );
        } finally {
          setUploadingImage(false);
        }
      }

      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];
      const featuredImageUrl = allImageUrls.length > 0 ? allImageUrls[0] : undefined;

      const payload = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || undefined,
        processes: formData.processes,
        surfaces: formData.surfaces,
        featuredImageUrl,
        imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
        youtubeVideoId: videoId || undefined,
        year: formData.year.trim() || undefined,
        location: formData.location.trim() || undefined,
        technologies,
        status: formData.status,
      };

      if (editingId) {
        await updateProject({ ...payload, id: editingId });
      } else {
        await createProject(payload);
      }

      resetForm();
      setSelectedImageFiles([]);
      setImagePreviews([]);
    } catch (err: any) {
      console.error('[Projects] Error saving project:', err);
      const message = err?.message || 'Failed to save project. Check console for details.';
      setFormError(message);
      setUploadingImage(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    const imageUrls = project.imageUrls || (project.featuredImageUrl ? [project.featuredImageUrl] : []);
    setFormData({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      category: project.category || '',
      processes: project.processes || [],
      surfaces: project.surfaces || [],
      featuredImageUrl: project.featuredImageUrl || '',
      imageUrls: imageUrls.join(','),
      youtubeUrl: project.youtubeVideoId ? `https://youtu.be/${project.youtubeVideoId}` : '',
      year: project.year || '',
      location: project.location || '',
      technologies: (project.technologies || []).join(', '),
      status: project.status,
    });
    setImagePreviews(imageUrls);
    setSelectedImageFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this project? This cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteProject(id);
    } catch (err) {
      console.error('[Projects] Delete failed:', err);
    }
  };

  const handleStatusToggle = async (project: Project, nextStatus: Status) => {
    try {
      await updateProject({ id: project.id, status: nextStatus });
    } catch (err) {
      console.error('[Projects] Status update failed:', err);
    }
  };

  const formFooter = (
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        form="project-form"
        className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
      >
        {editingId ? 'Update Project' : 'Save Project'}
      </button>
      <button
        type="button"
        onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
      >
        Save as Draft
      </button>
      <button
        type="button"
        onClick={resetForm}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 text-red-50">
          <div className="font-semibold mb-1">Firestore error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Projects Management</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          + Add Project
        </button>
      </div>

      {/* Listing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-semibold text-white">Projects ({filteredProjects.length})</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, category, year..."
            className="w-full sm:w-72 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef] text-sm"
          />
        </div>

        {loading && <span className="text-xs text-gray-300">Loading...</span>}

        <div className="space-y-1">
          {paginatedProjects.length === 0 ? (
            <p className="text-gray-300 text-sm py-4">
              {searchQuery ? 'No projects match your search.' : 'No projects yet. Add your first project!'}
            </p>
          ) : (
            paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${project.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-white font-medium truncate">{project.title}</span>
                  {project.category && (
                    <span className="hidden sm:inline px-2 py-0.5 text-xs rounded bg-white/10 text-gray-300 border border-white/10 shrink-0">
                      {project.category}
                    </span>
                  )}
                  {project.year && <span className="hidden md:inline text-xs text-gray-400 shrink-0">{project.year}</span>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`/projects/${project.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusToggle(project, project.status === 'published' ? 'draft' : 'published')}
                    className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                  >
                    {project.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
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
              className="px-3 py-1 text-sm rounded bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Form Panel */}
      <SlidePanel
        open={showForm}
        onClose={resetForm}
        title={editingId ? 'Edit Project' : 'Create Project'}
        footer={formFooter}
      >
        {formError && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-100 text-sm">
            {formError}
          </div>
        )}

        <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Category / Industry</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Automotive, Robotics, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Short Description *</label>
              <textarea
                required
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="One-liner that appears in cards"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Technologies / Tags</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Robotics, PLC, IoT"
              />
              <p className="text-xs text-gray-300 mt-1">Comma separated</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">Processes (select all that apply)</label>
              <div className="max-h-60 overflow-y-auto border border-white/20 rounded-lg p-3 space-y-2">
                {PROCESS_OPTIONS.map((process) => (
                  <label key={process} className="flex items-start gap-2 text-sm text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.processes.includes(process)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          processes: checked
                            ? [...prev.processes, process]
                            : prev.processes.filter((p) => p !== process),
                        }));
                      }}
                      className="mt-1 w-4 h-4 text-[#00aeef] bg-transparent border-white/40 rounded focus:ring-[#00aeef]"
                    />
                    <span>{process}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">Surfaces (select all that apply)</label>
              <div className="border border-white/20 rounded-lg p-3 space-y-2">
                {SURFACE_OPTIONS.map((surface) => (
                  <label key={surface} className="flex items-center gap-2 text-sm text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.surfaces.includes(surface)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          surfaces: checked
                            ? [...prev.surfaces, surface]
                            : prev.surfaces.filter((s) => s !== surface),
                        }));
                      }}
                      className="w-4 h-4 text-[#00aeef] bg-transparent border-white/40 rounded focus:ring-[#00aeef]"
                    />
                    <span>{surface}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Detailed Description</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
              placeholder="What was delivered, outcomes, benefits"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Pune, India"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Project Images (Multiple)</label>

              {formData.imageUrls && (
                <div className="mb-4">
                  <p className="text-xs text-gray-300 mb-2">Existing Images:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {formData.imageUrls.split(',').filter(Boolean).map((url, index) => (
                      <div key={index} className="relative flex-shrink-0 bg-white/5 rounded-lg border border-white/20 p-2 flex items-center justify-center w-24 h-24 overflow-hidden">
                        <img src={url.trim()} alt={`Preview ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(url.trim())}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(imagePreviews.length > 0 || selectedImageFiles.length > 0) && (
                <div className="mb-4">
                  <p className="text-xs text-gray-300 mb-2">New Images to Upload:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedImageFiles.map((file, index) => (
                      <div key={index} className="relative flex-shrink-0 bg-white/5 rounded-lg border border-white/20 p-2 flex items-center justify-center w-24 h-24 overflow-hidden">
                        <img src={imagePreviews[index] || URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 text-center truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="project-image-upload"
                  disabled={uploadingImage}
                  multiple
                />
                <label
                  htmlFor="project-image-upload"
                  className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                      : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]" />
                      <span>Uploading and compressing images...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-white">
                      <span className="text-sm">
                        {selectedImageFiles.length > 0
                          ? `${selectedImageFiles.length} image(s) selected - Click to add more`
                          : 'Click to upload images (JPEG, PNG, WebP) - Multiple selection allowed'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Stored securely in projects/images (auto-compressed)
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">YouTube URL (optional)</label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID"
              />
              <p className="text-xs text-gray-300 mt-1">
                Accepts youtube.com/watch?v= or youtu.be links. We store only the video ID.
              </p>

              {formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl) && (
                <p className="text-xs text-yellow-300 mt-1">
                  Could not extract video ID from this URL. Please check the format.
                </p>
              )}

              {formData.youtubeUrl && isValidYouTubeUrl(formData.youtubeUrl) && (
                <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40">
                  <iframe
                    title="YouTube preview"
                    src={buildYouTubeEmbedUrl(extractYouTubeId(formData.youtubeUrl) || '')}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </SlidePanel>
    </div>
  );
};

export default ProjectsManager;
