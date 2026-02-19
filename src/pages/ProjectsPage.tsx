import React, { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer';
import ProjectCard from '../components/projects/ProjectCard';
import { useProjectsFirestore, PROCESS_OPTIONS, SURFACE_OPTIONS } from '../hooks/useProjectsFirestore';
import { SEO } from '../components/SEO';
import { PageLayout } from '../components/PageLayout';

/* ── Filter dropdown popover ─────────────────────────────────── */

interface FilterDropdownProps {
  label: string;
  options: readonly string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  projectCounts: Record<string, number>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onToggle,
  projectCounts,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeCount = selectedValues.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[15px] font-bold border-2 transition-all shadow-sm hover:shadow-md ${
          open
            ? 'bg-[#00aeef] border-[#00aeef] text-white shadow-[#00aeef]/25'
            : activeCount > 0
              ? 'bg-[#00aeef]/10 border-[#00aeef]/50 text-[#007bad] shadow-[#00aeef]/10'
              : 'bg-white border-slate-200 text-slate-800 hover:border-[#00aeef]/40 hover:text-[#007bad]'
        }`}
      >
        <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {label}
        {activeCount > 0 && (
          <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
            open ? 'bg-white text-[#00aeef]' : 'bg-[#00aeef] text-white'
          }`}>
            {activeCount}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-3 z-50 w-[min(500px,calc(100vw-3rem))] bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/12 p-2 ring-1 ring-black/5">
          <div className="max-h-80 overflow-y-auto space-y-0.5 p-2">
            {(options as unknown as string[]).map((option) => {
              const isSelected = selectedValues.includes(option);
              const count = projectCounts[option] || 0;
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#00aeef]/10 text-[#0f172a] ring-1 ring-[#00aeef]/20'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(option)}
                    className="w-[18px] h-[18px] text-[#00aeef] border-slate-300 rounded focus:ring-[#00aeef] focus:ring-2 flex-shrink-0"
                  />
                  <span className="flex-1 text-sm leading-snug">{option}</span>
                  <span className="text-xs text-slate-400 font-medium tabular-nums flex-shrink-0">{count}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Horizontal filter bar ───────────────────────────────────── */

interface FilterBarProps {
  selectedProcesses: string[];
  selectedSurfaces: string[];
  onProcessToggle: (process: string) => void;
  onSurfaceToggle: (surface: string) => void;
  onClearFilters: () => void;
  allProjects: { processes?: string[]; surfaces?: string[] }[];
  filteredCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedProcesses,
  selectedSurfaces,
  onProcessToggle,
  onSurfaceToggle,
  onClearFilters,
  allProjects,
  filteredCount,
}) => {
  const processCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of PROCESS_OPTIONS) {
      counts[p] = allProjects.filter((proj) => proj.processes?.includes(p)).length;
    }
    return counts;
  }, [allProjects]);

  const surfaceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of SURFACE_OPTIONS) {
      counts[s] = allProjects.filter((proj) => proj.surfaces?.includes(s)).length;
    }
    return counts;
  }, [allProjects]);

  const hasActive = selectedProcesses.length + selectedSurfaces.length > 0;

  return (
    <div className="mb-10 rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50/60 to-slate-50 border border-slate-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-bold uppercase tracking-widest text-slate-400 mr-1 hidden sm:inline">
          Filter by
        </span>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <FilterDropdown
          label="Process"
          options={PROCESS_OPTIONS}
          selectedValues={selectedProcesses}
          onToggle={onProcessToggle}
          projectCounts={processCounts}
        />
        <FilterDropdown
          label="Surface"
          options={SURFACE_OPTIONS}
          selectedValues={selectedSurfaces}
          onToggle={onSurfaceToggle}
          projectCounts={surfaceCounts}
        />

        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600 tabular-nums">
            {filteredCount} {filteredCount === 1 ? 'project' : 'projects'}
          </span>
          {hasActive && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {hasActive && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200/60">
          {selectedProcesses.map((p) => (
            <button
              key={p}
              onClick={() => onProcessToggle(p)}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#00aeef]/15 text-[#007bad] text-sm font-semibold border border-[#00aeef]/25 hover:bg-[#00aeef]/25 transition-colors"
            >
              <span className="max-w-[280px] truncate">{p}</span>
              <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          {selectedSurfaces.map((s) => (
            <button
              key={s}
              onClick={() => onSurfaceToggle(s)}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold border border-emerald-200 hover:bg-emerald-200 transition-colors"
            >
              <span>{s}</span>
              <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main page ───────────────────────────────────────────────── */

const ProjectsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const { getPublishedProjects, loading, error } = useProjectsFirestore();

  // All published projects (sorted)
  const publishedProjects = useMemo(() => {
    const list = getPublishedProjects();
    return [...list].sort((a, b) => {
      const aYear = Number.parseInt(String(a.year ?? ''), 10);
      const bYear = Number.parseInt(String(b.year ?? ''), 10);
      const aYearValue = Number.isFinite(aYear) ? aYear : -Infinity;
      const bYearValue = Number.isFinite(bYear) ? bYear : -Infinity;
      if (bYearValue !== aYearValue) return bYearValue - aYearValue;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
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
    document.title = 'Projects | Plustech';
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
        <section className="relative isolate overflow-hidden px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-8 md:pb-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-20 w-64 h-64 bg-[#00aeef]/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/10 blur-3xl rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 text-center space-y-5">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Recent Projects
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Explore the projects we&apos;ve delivered—spanning automation, paintshop solutions,
              and smart manufacturing upgrades.
            </p>
          </div>
        </section>

        <section className="relative px-6 md:px-12 lg:px-16 pb-16 md:pb-20">
          <div className="max-w-6xl mx-auto">
            <FilterBar
              selectedProcesses={selectedProcesses}
              selectedSurfaces={selectedSurfaces}
              onProcessToggle={handleProcessToggle}
              onSurfaceToggle={handleSurfaceToggle}
              onClearFilters={handleClearFilters}
              allProjects={publishedProjects}
              filteredCount={filteredProjects.length}
            />

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

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.slice(0, visibleCount).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {visibleCount < filteredProjects.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 rounded-xl bg-[#00aeef] text-white font-semibold shadow-lg shadow-[#00aeef]/30 hover:-translate-y-0.5 transition-transform"
                >
                  Load more projects ({filteredProjects.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      </PageLayout>
    </>
  );
};

export default ProjectsPage;

