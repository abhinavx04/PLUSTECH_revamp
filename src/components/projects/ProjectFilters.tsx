import React from 'react';
import FilterSection from './FilterSection';
import { PROCESS_OPTIONS, SURFACE_OPTIONS } from '../../hooks/useProjectsFirestore';
import type { Project } from '../../hooks/useProjectsFirestore';

interface ProjectFiltersProps {
  selectedProcesses: string[];
  selectedSurfaces: string[];
  onProcessToggle: (process: string) => void;
  onSurfaceToggle: (surface: string) => void;
  onClearFilters: () => void;
  allProjects: Project[];
  filteredCount: number;
  isMobile?: boolean;
  onClose?: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedProcesses,
  selectedSurfaces,
  onProcessToggle,
  onSurfaceToggle,
  onClearFilters,
  allProjects,
  filteredCount,
  isMobile = false,
  onClose,
}) => {
  // Calculate counts for each option
  const processCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    PROCESS_OPTIONS.forEach((process) => {
      counts[process] = allProjects.filter((p) => p.processes?.includes(process)).length;
    });
    return counts;
  }, [allProjects]);

  const surfaceCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    SURFACE_OPTIONS.forEach((surface) => {
      counts[surface] = allProjects.filter((p) => p.surfaces?.includes(surface)).length;
    });
    return counts;
  }, [allProjects]);

  const hasActiveFilters = selectedProcesses.length > 0 || selectedSurfaces.length > 0;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'relative rounded-[28px] border border-white/80 shadow-2xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-white via-[#e0f4ff] to-[#cfe7ff] p-6 sticky top-24'}`}>
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'p-4 overflow-y-auto h-[calc(100vh-64px)] bg-white' : 'text-[#0f172a]'}`}>
        {/* Summary + clear */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`text-sm font-semibold ${isMobile ? 'text-slate-900' : 'text-[#0f172a]'}`}>
              {filteredCount} {filteredCount === 1 ? 'project' : 'projects'}
            </div>
            {hasActiveFilters && (
              <div className={`text-xs mt-1 ${isMobile ? 'text-slate-500' : 'text-slate-600'}`}>
                {selectedProcesses.length + selectedSurfaces.length} filter
                {selectedProcesses.length + selectedSurfaces.length !== 1 ? 's' : ''} active
              </div>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-[#00aeef] hover:text-[#0099d4] font-medium underline"
            >
              Clear all
            </button>
          )}
        </div>

        <FilterSection
          title="Process"
          options={PROCESS_OPTIONS as unknown as string[]}
          selectedValues={selectedProcesses}
          onToggle={onProcessToggle}
          projectCounts={processCounts}
        />

        <FilterSection
          title="Surface"
          options={SURFACE_OPTIONS as unknown as string[]}
          selectedValues={selectedSurfaces}
          onToggle={onSurfaceToggle}
          projectCounts={surfaceCounts}
        />
      </div>
    </div>
  );
};

export default ProjectFilters;

