import React, { useRef, useState } from 'react';
import { useProjectsFirestore, type Project } from '../hooks/useProjectsFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { buildYouTubeEmbedUrl, extractYouTubeId, isValidYouTubeUrl } from '../lib/youtube';

type Status = 'draft' | 'published';

interface ProjectFormState {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  featuredImageUrl: string;
  imageUrls: string; // Comma-separated for form, will be converted to array
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
  featuredImageUrl: '',
  imageUrls: '',
  youtubeUrl: '',
  year: '',
  location: '',
  technologies: '',
  status: 'draft',
};

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeMB = 10;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type`);
        return;
      }

      // Check file size
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

      // Create previews for new files
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

    // Reset input to allow selecting same files again
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
      
      // Get existing image URLs from form
      const existingImageUrls = formData.imageUrls
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

      // Upload new images
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

      // Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];
      
      // For backward compatibility, set featuredImageUrl to first image
      const featuredImageUrl = allImageUrls.length > 0 ? allImageUrls[0] : undefined;

      const payload = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || undefined,
        featuredImageUrl, // Keep for backward compatibility
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

  const renderStatusBadge = (status: Status) => {
    const styles =
      status === 'published'
        ? 'bg-green-500/20 text-green-200 border-green-500/40'
        : 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40';
    return (
      <span className={`px-2 py-1 text-xs rounded border ${styles}`}>
        {status === 'published' ? 'Published' : 'Draft'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 text-red-50">
          <div className="font-semibold mb-1">Firestore error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Projects Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Project' : 'Create Project'}
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
                
                {/* Existing Images Preview */}
                {formData.imageUrls && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-300 mb-2">Existing Images:</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {formData.imageUrls.split(',').filter(Boolean).map((url, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <img
                            src={url.trim()}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-white/20"
                          />
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

                {/* New Images Preview */}
                {(imagePreviews.length > 0 || selectedImageFiles.length > 0) && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-300 mb-2">New Images to Upload:</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedImageFiles.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0">
                          <img
                            src={imagePreviews[index] || URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-white/20"
                          />
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
                    ⚠️ Could not extract video ID from this URL. Please check the format.
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

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
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
          </form>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Projects ({projects.length})</h3>
          {loading && <span className="text-xs text-gray-300">Loading…</span>}
        </div>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-gray-300 text-sm">No projects yet. Add your first project!</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                    {renderStatusBadge(project.status)}
                    {project.category && (
                      <span className="px-2 py-1 text-xs rounded bg-white/10 text-gray-200 border border-white/10">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.shortDescription}</p>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-3 flex-wrap">
                    <span>{project.createdAt.toLocaleDateString()}</span>
                    {project.year && <span>Year: {project.year}</span>}
                    {project.location && <span>Location: {project.location}</span>}
                    {project.youtubeVideoId && <span>Video linked</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/projects/${project.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleStatusToggle(project, project.status === 'published' ? 'draft' : 'published')
                    }
                    className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                  >
                    {project.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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

export default ProjectsManager;

