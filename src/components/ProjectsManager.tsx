import React, { useRef, useState } from 'react';
import { useProjectsFirestore, type Project } from '../hooks/useProjectsFirestore';
import { uploadImageToStorage } from '../lib/storageUtils';
import { getFileSizeMB } from '../lib/imageUtils';
import { buildYouTubeEmbedUrl, extractYouTubeId, isValidYouTubeUrl } from '../lib/youtube';

type Status = 'draft' | 'published';

interface ProjectFormState {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  featuredImageUrl: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectFormState>(defaultFormState);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check file size (max 10MB before compression)
    const maxSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setFormError(`File is too large. Maximum size is ${maxSizeMB}MB before compression.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFormError(null);
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, featuredImageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    setSelectedImageFile(null);
    setImagePreview(null);
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
      let finalImageUrl = formData.featuredImageUrl;
      const videoId = extractYouTubeId(formData.youtubeUrl || '');
      const technologies = parseTechnologies(formData.technologies);

      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadImageToStorage(selectedImageFile, 'projects/images');
        } finally {
          setUploadingImage(false);
        }
      }

      const payload = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || undefined,
        featuredImageUrl: finalImageUrl || undefined,
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
    } catch (err: any) {
      console.error('[Projects] Error saving project:', err);
      const message = err?.message || 'Failed to save project. Check console for details.';
      setFormError(message);
      setUploadingImage(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      category: project.category || '',
      featuredImageUrl: project.featuredImageUrl || '',
      youtubeUrl: project.youtubeVideoId ? `https://youtu.be/${project.youtubeVideoId}` : '',
      year: project.year || '',
      location: project.location || '',
      technologies: (project.technologies || []).join(', '),
      status: project.status,
    });
    setImagePreview(project.featuredImageUrl || null);
    setSelectedImageFile(null);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Featured Image</label>
                {(imagePreview || formData.featuredImageUrl) && (
                  <div className="mb-3 relative">
                    <img
                      src={imagePreview || formData.featuredImageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                    >
                      ✕
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
                    id="project-image-upload"
                    disabled={uploadingImage}
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
                        <span>Uploading and compressing image...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 text-white">
                        <span className="text-sm">
                          {selectedImageFile
                            ? `Selected: ${selectedImageFile.name} (${getFileSizeMB(selectedImageFile).toFixed(2)}MB)`
                            : 'Click to upload image (JPEG, PNG, WebP)'}
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
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Accepts youtube.com/watch?v= or youtu.be links. We store only the video ID.
                </p>

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

