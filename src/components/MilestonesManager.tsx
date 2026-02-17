import React, { useMemo, useRef, useState } from 'react';
import {
  type Milestone,
  type MilestoneCategory,
  type MilestoneMetric,
  useMilestonesFirestore,
} from '../hooks/useMilestonesFirestore';

type FormState = {
  year: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  icon: string;
  metrics: MilestoneMetric[];
  published: boolean;
};

const categoryOptions: MilestoneCategory[] = ['founding', 'expansion', 'innovation', 'achievement'];

const buildYearOptions = () => {
  const start = 2020;
  const end = new Date().getFullYear() + 1; // allow next year planning
  const years: string[] = [];
  for (let y = end; y >= start; y -= 1) {
    years.push(String(y));
  }
  return years;
};

const defaultMetrics: MilestoneMetric[] = [{ label: 'Highlight', value: '' }];

const defaultFormState: FormState = {
  year: '',
  title: '',
  description: '',
  category: 'achievement',
  icon: '',
  metrics: defaultMetrics,
  published: true,
};

const MilestonesManager: React.FC = () => {
  const { milestones, loading, error, createMilestone, updateMilestone, deleteMilestone } =
    useMilestonesFirestore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const formRef = useRef<HTMLDivElement>(null);

  const yearOptions = useMemo(buildYearOptions, []);

  const sortedMilestones = useMemo(
    () =>
      [...milestones]
        .filter((m) => {
          const yearNum = parseInt(m.year, 10);
          return !Number.isNaN(yearNum) && yearNum >= 2020;
        })
        .sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)),
    [milestones]
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setFormData(defaultFormState);
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.year.trim()) return 'Year is required';
    const yearNum = parseInt(formData.year, 10);
    if (Number.isNaN(yearNum) || yearNum < 2020) return 'Year must be 2020 or later';
    if (!categoryOptions.includes(formData.category)) return 'Invalid category';
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

    const metrics = (formData.metrics || [])
      .map((metric) => ({ label: metric.label.trim(), value: metric.value.trim() }))
      .filter((metric) => metric.label && metric.value);

    const payload = {
      year: formData.year.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      icon: formData.icon.trim() || undefined,
      metrics,
      published: formData.published,
    };

    try {
      if (editingId) {
        await updateMilestone({ ...payload, id: editingId });
      } else {
        await createMilestone(payload);
      }
      resetForm();
    } catch (err: any) {
      console.error('[Milestones] Save error:', err);
      setFormError(err?.message || 'Failed to save milestone. Check console for details.');
    }
  };

  const handleEdit = (item: Milestone) => {
    setEditingId(item.id);
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      category: item.category,
      icon: item.icon || '',
      metrics: item.metrics && item.metrics.length > 0 ? item.metrics : defaultMetrics,
      published: item.published,
    });
    setShowForm(true);
    setFormError(null);
    // Scroll to form after state updates
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone(id);
      } catch (err) {
        console.error('[Milestones] Delete error:', err);
      }
    }
  };

  const updateMetric = (index: number, key: 'label' | 'value', value: string) => {
    setFormData((prev) => {
      const nextMetrics = [...prev.metrics];
      nextMetrics[index] = { ...nextMetrics[index], [key]: value };
      return { ...prev, metrics: nextMetrics };
    });
  };

  const addMetric = () => {
    setFormData((prev) => ({ ...prev, metrics: [...prev.metrics, { label: '', value: '' }] }));
  };

  const removeMetric = (index: number) => {
    setFormData((prev) => {
      const nextMetrics = prev.metrics.filter((_, i) => i !== index);
      return { ...prev, metrics: nextMetrics.length > 0 ? nextMetrics : defaultMetrics };
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4">
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Milestones (2020+)</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          Add Milestone
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Milestone' : 'Create Milestone'}
            </h3>
            <button
              onClick={resetForm}
              className="text-sm text-gray-300 hover:text-white underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-100 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef] [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  <option value="" disabled>
                    Select year (2020+)
                  </option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as MilestoneCategory })
                  }
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00aeef] [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Milestone title"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Icon (optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Icon name or URL"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                placeholder="Brief description of the milestone"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white text-sm font-medium">Metrics</label>
                <button
                  type="button"
                  onClick={addMetric}
                  className="text-sm text-[#00aeef] hover:text-white underline-offset-2 hover:underline"
                >
                  Add metric
                </button>
              </div>
              <div className="space-y-3">
                {formData.metrics.map((metric, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                      placeholder="Label (e.g., Client)"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                        placeholder="Value (e.g., Ashok Leyland)"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        aria-label="Remove metric"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-white">Published</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                {editingId ? 'Update Milestone' : 'Create Milestone'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Timeline Items (2020+)</h3>
          {loading && (
            <div className="flex items-center space-x-2 text-white text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00aeef]" />
              <span>Loading...</span>
            </div>
          )}
        </div>

        {sortedMilestones.length === 0 && !loading ? (
          <p className="text-gray-300">No milestones added yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedMilestones.map((item) => (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/5 border border-white/10 rounded-lg p-4 gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#00aeef]/20 text-[#00aeef] border border-[#00aeef]/40">
                      {item.year}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-white/10 border border-white/20 text-white">
                      {item.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.published
                          ? 'bg-green-500/20 text-green-200 border border-green-500/40'
                          : 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/40'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  {item.metrics && item.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.metrics.map((metric, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-white"
                        >
                          <strong className="text-gray-200">{metric.label}:</strong> {metric.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-2 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesManager;

