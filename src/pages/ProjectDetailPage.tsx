import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { useProjectsFirestore, type Project } from '../hooks/useProjectsFirestore';
import { buildYouTubeEmbedUrl } from '../lib/youtube';
import { PageLayout } from '../components/PageLayout';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams();
  const { getProjectById, fetchProjectById } = useProjectsFirestore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const imageGalleryRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll buttons visibility
  const checkScrollButtons = useCallback(() => {
    if (imageGalleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = imageGalleryRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Set up scroll listeners when project changes
  useEffect(() => {
    if (!project) return;
    
    const imageUrls = project.imageUrls || (project.featuredImageUrl ? [project.featuredImageUrl] : []);
    if (imageUrls.length === 0) return;

    // Initial check
    setTimeout(() => checkScrollButtons(), 100);

    const gallery = imageGalleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        gallery.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [project?.id, project?.imageUrls, project?.featuredImageUrl, checkScrollButtons]);


  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);
        
        // Try to get from cache first
        const cached = getProjectById(projectId);
        if (cached) {
          if (cached.status !== 'published') {
            setNotFound(true);
          } else {
            setProject(cached);
            document.title = `${cached.title} | Projects`;
          }
          setLoading(false);
          return;
        }

        // Fetch from Firestore
        const remote = await fetchProjectById(projectId);
        
        if (!remote) {
          setNotFound(true);
        } else if (remote.status !== 'published') {
          setNotFound(true);
        } else {
          setProject(remote);
          document.title = `${remote.title} | Projects`;
        }
      } catch (error) {
        console.error('[ProjectDetail] Error loading project:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, getProjectById, fetchProjectById]);

  if (loading) {
    return (
      <PageLayout className="bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00aeef]" />
        </div>
      </PageLayout>
    );
  }

  if (notFound || !project) {
    return (
      <PageLayout className="bg-white">
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center space-y-3">
            <div className="text-3xl font-bold text-[#0f172a]">Project not found</div>
            <p className="text-slate-600">This project is unavailable or unpublished.</p>
            <a
              href="/projects"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#00aeef] text-black font-semibold shadow hover:-translate-y-0.5 transition-transform"
            >
              Back to projects
            </a>
          </div>
        </main>
        <Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-white text-[#0f172a] pt-16">

      <main className="flex-1 w-full">
        <section className="relative px-6 md:px-12 lg:px-16 pt-10 pb-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <a href="/projects" className="text-[#00aeef] font-semibold hover:underline">
                Projects
              </a>
              <span>/</span>
              <span>{project.title}</span>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                {project.category || 'Project'}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {project.title}
              </h1>
              <p className="text-lg text-slate-700 max-w-3xl">{project.shortDescription}</p>
              <div className="flex items-center gap-4 flex-wrap text-sm text-slate-600">
                {project.year && <span>Year: {project.year}</span>}
                {project.location && <span>Location: {project.location}</span>}
                {(project.technologies || []).length > 0 && (
                  <span>Technologies: {(project.technologies || []).join(', ')}</span>
                )}
              </div>
            </div>

            {/* YouTube Video */}
            {project.youtubeVideoId && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    title={project.title}
                    src={buildYouTubeEmbedUrl(project.youtubeVideoId)}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Image Gallery with Manual Scroll Buttons */}
            {project && (() => {
              const imageUrls = project.imageUrls || (project.featuredImageUrl ? [project.featuredImageUrl] : []);
              if (imageUrls.length === 0) return null;

              const scrollLeft = () => {
                if (imageGalleryRef.current) {
                  const scrollAmount = imageGalleryRef.current.clientWidth * 0.8;
                  imageGalleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
              };

              const scrollRight = () => {
                if (imageGalleryRef.current) {
                  const scrollAmount = imageGalleryRef.current.clientWidth * 0.8;
                  imageGalleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              };

              return (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-900">Project Images</h3>
                    {imageUrls.length > 1 && (
                      <div className="text-sm text-slate-500">
                        {imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    {/* Left Scroll Button */}
                    {imageUrls.length > 1 && canScrollLeft && (
                      <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 border border-slate-200"
                        aria-label="Scroll left"
                      >
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-slate-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Image Gallery Container */}
                    <div
                      ref={imageGalleryRef}
                      className="overflow-x-auto pb-4 -mx-4 px-4 project-image-scroll-container snap-x snap-mandatory"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      <div className="flex gap-4" style={{ width: 'max-content', minHeight: '200px' }}>
                        {imageUrls.map((imageUrl, index) => (
                          <div
                            key={`image-${index}-${imageUrl}`}
                            className="flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow snap-start bg-slate-50"
                            style={{ 
                              width: 'min(85vw, 600px)',
                              scrollSnapAlign: 'start',
                              minHeight: '200px'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={`${project.title} - Image ${index + 1}`}
                              className="w-full h-auto object-contain max-h-[60vh] md:max-h-[600px]"
                              loading={index < 3 ? 'eager' : 'lazy'}
                              decoding="async"
                              onLoad={() => {
                                // Trigger scroll button check after image loads
                                setTimeout(() => checkScrollButtons(), 100);
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-sm">Image failed to load</div>';
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Scroll Button */}
                    {imageUrls.length > 1 && canScrollRight && (
                      <button
                        onClick={scrollRight}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 border border-slate-200"
                        aria-label="Scroll right"
                      >
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-slate-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="mt-10 grid lg:grid-cols-[1.4fr_0.6fr] gap-10">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0f172a]">Project Overview</h2>
                <div className="prose max-w-none text-slate-700 leading-relaxed">
                  <p className="whitespace-pre-line">{project.description || 'Details coming soon.'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Highlights</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Published project — visible to website visitors</li>
                    <li>• Inline video playback with YouTube privacy mode</li>
                    <li>• Optimized images with lazy loading</li>
                    <li>• No admin-only fields are exposed</li>
                  </ul>
                </div>

                {(project.technologies || []).length > 0 && (
                  <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageLayout>
  );
};

export default ProjectDetailPage;

