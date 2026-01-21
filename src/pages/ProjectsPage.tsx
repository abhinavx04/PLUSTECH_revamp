import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import ProjectCard from '../components/projects/ProjectCard';
import { useProjectsFirestore } from '../hooks/useProjectsFirestore';
import ProjectFilters from '../components/projects/ProjectFilters';
import { SEO } from '../components/SEO';
import { PageLayout } from '../components/PageLayout';

const ProjectsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { getPublishedProjects, loading, error } = useProjectsFirestore();

  // All published projects (sorted)
  const publishedProjects = useMemo(() => {
    const list = getPublishedProjects();
    return [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [getPublishedProjects]);

  // Apply filters (client-side)
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      if (selectedProcesses.length > 0) {
        const matchProcess = selectedProcesses.some((p) => project.processes?.includes(p));
        if (!matchProcess) return false;
      }
      if (selectedSurfaces.length > 0) {
        const matchSurface = selectedSurfaces.some((s) => project.surfaces?.includes(s));
        if (!matchSurface) return false;
      }
      return true;
    });
  }, [publishedProjects, selectedProcesses, selectedSurfaces]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedProcesses, selectedSurfaces]);

  const handleProcessToggle = (process: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(process) ? prev.filter((p) => p !== process) : [...prev, process]
    );
  };

  const handleSurfaceToggle = (surface: string) => {
    setSelectedSurfaces((prev) =>
      prev.includes(surface) ? prev.filter((s) => s !== surface) : [...prev, surface]
    );
  };

  const handleClearFilters = () => {
    setSelectedProcesses([]);
    setSelectedSurfaces([]);
  };

  useEffect(() => {
    document.title = 'Projects | PlusTech';
  }, []);

  return (
    <>
      <SEO
        title="Projects - Surface Finishing Solutions & Automation Systems"
        description="Explore PLUSTECH's portfolio of surface finishing projects, paint shop solutions, and industrial automation systems. View our completed projects across various industries."
        url="/projects"
        keywords="surface finishing projects, paint shop projects, automation projects, industrial solutions, completed projects"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">

      <main className="flex-1 w-full overflow-hidden">
        <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 py-14 md:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-20 w-64 h-64 bg-[#00aeef]/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-black/5 shadow-sm backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-[#00aeef]" />
                <span className="text-sm font-semibold text-[#0f172a]">Projects</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Recent Projects
              </h1>
              <p className="text-lg md:text-xl text-slate-700 max-w-3xl">
                Explore the projects we&apos;ve delivered—spanning automation, paintshop solutions,
                and smart manufacturing upgrades. Only published projects appear here.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-white/60 rounded-[28px] blur-xl border border-white/40" />
              <div className="relative rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-white via-[#e0f4ff] to-[#cfe7ff] p-8 space-y-4 text-[#0f172a]">
                <div className="text-sm uppercase tracking-[0.12em] text-slate-500">How to use filters</div>
                <div className="text-2xl font-extrabold">Find Your Desired Projects</div>
                <p className="text-slate-700 leading-relaxed">
                  Use the filter sidebar to narrow down projects based on your specific requirements. You can filter by <strong>Process</strong> (e.g., Painting, Coating, Anodizing) and <strong>Surface</strong> (e.g., Metal, Plastic, Wood) to find exactly what you&apos;re looking for.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-200">
                    <svg className="w-5 h-5 text-[#00aeef] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Select Multiple Filters</div>
                      <div className="text-slate-600">Click on any Process or Surface option to filter. You can select multiple options to refine your search further.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-200">
                    <svg className="w-5 h-5 text-[#00aeef] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">See Project Counts</div>
                      <div className="text-slate-600">Each filter option shows the number of matching projects, helping you understand what&apos;s available.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-200">
                    <svg className="w-5 h-5 text-[#00aeef] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Clear Filters Anytime</div>
                      <div className="text-slate-600">Use the &ldquo;Clear all&rdquo; button to reset filters and view all projects again.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 md:px-12 lg:px-16 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Mobile filters toggle */}
            <div className="md:hidden mb-6 flex items-center justify-between">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(selectedProcesses.length + selectedSurfaces.length) > 0 && (
                  <span className="bg-[#00aeef] text-white text-xs rounded-full px-2 py-0.5">
                    {selectedProcesses.length + selectedSurfaces.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile filter overlay */}
            {showMobileFilters && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setShowMobileFilters(false)}
                />
                <div className="md:hidden">
                  <ProjectFilters
                    selectedProcesses={selectedProcesses}
                    selectedSurfaces={selectedSurfaces}
                    onProcessToggle={handleProcessToggle}
                    onSurfaceToggle={handleSurfaceToggle}
                    onClearFilters={handleClearFilters}
                    allProjects={publishedProjects}
                    filteredCount={filteredProjects.length}
                    isMobile
                    onClose={() => setShowMobileFilters(false)}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                <div className="font-semibold">Error loading projects</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            {loading && filteredProjects.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00aeef]" />
              </div>
            ) : null}

            {!loading && filteredProjects.length === 0 && !error && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-semibold text-slate-800">No projects found</div>
                <p className="text-slate-600 mt-2">
                  {selectedProcesses.length > 0 || selectedSurfaces.length > 0
                    ? 'Try adjusting your filters to see more results.'
                    : 'Published projects will appear here automatically.'}
                </p>
                {(selectedProcesses.length > 0 || selectedSurfaces.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-[#00aeef] hover:text-[#0099d4] font-medium underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-8">
              {/* Desktop filter sidebar */}
              <aside className="hidden md:block w-80 flex-shrink-0">
                <ProjectFilters
                  selectedProcesses={selectedProcesses}
                  selectedSurfaces={selectedSurfaces}
                  onProcessToggle={handleProcessToggle}
                  onSurfaceToggle={handleSurfaceToggle}
                  onClearFilters={handleClearFilters}
                  allProjects={publishedProjects}
                  filteredCount={filteredProjects.length}
                />
              </aside>

              {/* Projects grid */}
              <div className="flex-1 min-w-0">
                <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
                  {filteredProjects.slice(0, visibleCount).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

                {visibleCount < filteredProjects.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 rounded-xl bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                >
                      Load more projects ({filteredProjects.length - visibleCount} remaining)
                </button>
              </div>
            )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      </PageLayout>
    </>
  );
};

export default ProjectsPage;

