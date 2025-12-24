import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../components/ui/resizable-navbar';
import Footer from '../components/Footer';
import { useProjectsFirestore, type Project } from '../hooks/useProjectsFirestore';
import { buildYouTubeEmbedUrl } from '../lib/youtube';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams();
  const { getProjectById, fetchProjectById } = useProjectsFirestore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  const navItems = [
    { name: 'Home', link: '/' },
    { 
      name: 'About', 
      link: '/about',
      submenu: [
        { title: 'About Us', path: '/about' },
        { title: 'Corporate Beliefs', path: '/about/corporate-beliefs' },
        { title: 'Industry Focus', path: '/about/industry-focus' },
        { title: 'Certifications', path: '/about/certifications' },
        { title: 'History & Milestones', path: '/about/history' },
        { title: 'Annual Returns', path: '/about/annual-returns' },
        { title: 'CSR Activities', path: '/about/csr-activities' },
      ]
    },
    { name: 'Projects', link: '/projects' },
    { name: 'Services', link: '/services' },
    { name: 'Contact', link: '/contact' },
  ];

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

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

      const remote = await fetchProjectById(projectId);
      if (!remote || remote.status !== 'published') {
        setNotFound(true);
      } else {
        setProject(remote);
        document.title = `${remote.title} | Projects`;
      }
      setLoading(false);
    };

    loadProject();
  }, [projectId, getProjectById, fetchProjectById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00aeef]" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24" />
          </NavBody>
        </Navbar>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-[#0f172a] pt-16">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <div className="flex-1 flex justify-center">
            <NavItems items={navItems} />
          </div>
          <div className="w-24" />
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            {!isMobileMenuOpen && (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="space-y-2">
              {navItems.map((item, idx) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isOpen = openMobileDropdown === item.name;
                
                return (
                  <div key={`mobile-link-${idx}`}>
                    <div
                      className="flex items-center justify-between text-[#222222] hover:text-[#333333] transition-colors py-4 px-4 rounded-lg hover:bg-black/5 font-semibold text-lg border-b cursor-pointer"
                      style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}
                      onClick={() => {
                        if (hasSubmenu) {
                          setOpenMobileDropdown(isOpen ? null : item.name);
                        } else {
                          setIsMobileMenuOpen(false);
                          window.location.href = item.link;
                        }
                      }}
                    >
                      <span>{item.name}</span>
                      {hasSubmenu && (
                        <svg 
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    {hasSubmenu && isOpen && (
                      <div className="pl-6 pr-4 pb-2 space-y-1">
                        {item.submenu.map((subItem, subIdx) => (
                          <a
                            key={`mobile-submenu-${idx}-${subIdx}`}
                            href={subItem.path}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                            className="block text-[#666666] hover:text-[#00aeef] transition-colors py-2 px-4 rounded-lg hover:bg-black/5 text-base"
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

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

            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
              {project.youtubeVideoId ? (
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
              ) : project.featuredImageUrl ? (
                <img
                  src={project.featuredImageUrl}
                  alt={project.title}
                  className="w-full h-full max-h-[640px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="h-64 w-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center text-slate-500">
                  No media available
                </div>
              )}
            </div>

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
    </div>
  );
};

export default ProjectDetailPage;

