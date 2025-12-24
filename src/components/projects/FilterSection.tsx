import React from 'react';

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  projectCounts: Record<string, number>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onToggle,
  projectCounts,
}) => {
  return (
    <div className="border-b border-white/40 pb-4 mb-4 last:border-b-0 last:mb-0">
      <h3 className="text-sm font-semibold text-[#0f172a] mb-3 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          const count = projectCounts[option] || 0;

          return (
            <label
              key={option}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/60 cursor-pointer group transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option)}
                className="mt-1 w-4 h-4 text-[#00aeef] border-slate-300 rounded focus:ring-[#00aeef] focus:ring-2"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-700 group-hover:text-[#0f172a]">
                  {option}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {count} {count === 1 ? 'project' : 'projects'}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSection;

