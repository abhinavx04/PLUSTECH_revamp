import React, { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCSRActivitiesFirestore } from '../../hooks/useCSRActivitiesFirestore';

const categoryConfig = {
  education: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📚',
    label: 'Education',
  },
  environment: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🌱',
    label: 'Environment',
  },
  community: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🤝',
    label: 'Community',
  },
  healthcare: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '🏥',
    label: 'Healthcare',
  },
  other: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '✨',
    label: 'Other',
  },
} as const;

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Active' },
  completed: { color: 'bg-blue-500', label: 'Completed' },
  planned: { color: 'bg-yellow-500', label: 'Planned' },
} as const;

const CSRActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const { loading, error, getPublishedCSRActivities } = useCSRActivitiesFirestore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const data = useMemo(
    () => getPublishedCSRActivities(),
    [getPublishedCSRActivities]
  );

  const impactMetrics = [
    { label: 'Programs', value: data.length },
    { label: 'Categories', value: new Set(data.map((a) => a.category)).size },
  ];

  const years = useMemo(
    () => Array.from(new Set(data.map((a) => a.year))).sort((a, b) => b.localeCompare(a)),
    [data]
  );

  const filteredData = useMemo(
    () =>
      data.filter((activity) => {
        const categoryMatch =
          selectedCategory === 'all' ? true : activity.category === selectedCategory;
        const yearMatch = selectedYear === 'all' ? true : activity.year === selectedYear;
        return categoryMatch && yearMatch;
      }),
    [data, selectedCategory, selectedYear]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          CSR Activities Dashboard
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our commitment to corporate social responsibility drives us to create positive impact 
          in education, environment, community development, and healthcare sectors.
        </motion.p>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Unable to load live CSR activities. Showing fallback data. Details: {error}
        </div>
      )}

      {/* Impact Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-100"
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
          >
            <div className="text-2xl font-bold text-[#00aeef] mb-0.5">
              {metric.value}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600 mr-1">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {['all', 'education', 'environment', 'community', 'healthcare', 'other'].map(
              (category) => {
                const config =
                  category === 'all'
                    ? { label: 'All', color: 'bg-gray-100 text-gray-800 border-gray-200' }
                    : categoryConfig[category as keyof typeof categoryConfig];
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#00aeef] text-white border-[#00aeef]'
                        : `${config.color} hover:bg-white`
                    }`}
                  >
                    {category !== 'all' && (
                      <span className="mr-1">
                        {categoryConfig[category as keyof typeof categoryConfig].icon}
                      </span>
                    )}
                    {config.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {years.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-gray-300 rounded-full px-3 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[#00aeef] focus:border-[#00aeef]"
            >
              <option value="all">All years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Activity Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {loading && data.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 py-8 text-sm">
            No CSR activities found. Add new items from the admin dashboard.
          </div>
        ) : (
          filteredData.map((activity) => {
            const descriptionPreview = activity.description.length > 100 
              ? activity.description.substring(0, 100) + '...'
              : activity.description;
            
            return (
            <motion.div
              key={activity.id}
              variants={cardVariants}
              className="flex flex-col h-full"
            >
              <div 
                className="relative bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden group border border-gray-200 flex flex-col h-full cursor-pointer transition-all duration-300 hover:border-[#00aeef]"
                onClick={() => {
                  navigate(`/about/csr-activities/${activity.id}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/about/csr-activities/${activity.id}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${activity.title}`}
              >
                {/* Header row with category & status */}
                <div className="flex items-center justify-between p-3 pb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryConfig[activity.category as keyof typeof categoryConfig]?.color ?? 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  >
                    <span className="text-sm">
                      {categoryConfig[activity.category as keyof typeof categoryConfig]?.icon ?? '✨'}
                    </span>
                    {categoryConfig[activity.category as keyof typeof categoryConfig]?.label ?? 'Other'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {activity.year && <span>{activity.year}</span>}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusConfig[activity.status as keyof typeof statusConfig]?.color ??
                        'bg-green-500'
                      }`}
                      title={statusConfig[activity.status as keyof typeof statusConfig]?.label ?? 'Active'}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-3 pb-3 flex flex-col flex-grow">
                  {/* Title & description */}
                  <h3 className="text-base font-bold font-heading text-gray-900 mb-1.5 line-clamp-2 group-hover:text-[#00aeef] transition-colors leading-tight">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2.5 line-clamp-2 flex-grow leading-relaxed">
                    {descriptionPreview}
                  </p>

                  {/* Metrics */}
                  {activity.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {activity.metrics.slice(0, 2).map((metric, index) => (
                        <div
                          key={index}
                          className="flex-1 min-w-[45%] text-center px-2 py-1.5 bg-gray-50 rounded-md border border-gray-100"
                        >
                          <div className="text-xs font-bold text-[#00aeef] leading-tight">
                            {metric.value}
                          </div>
                          <div className="text-[10px] text-gray-600 line-clamp-1 mt-0.5">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-auto pt-1">
                    <div className="w-full px-3 py-1.5 bg-gradient-to-r from-[#00aeef] to-[#0099d4] text-white rounded-md hover:from-[#0099d4] hover:to-[#0088c0] transition-all text-xs font-semibold text-center">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })
        )}
      </motion.div>

      {/* CSR Vision */}
      <motion.div 
        className="mt-16 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.h3 
          className="text-3xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Our CSR Vision
        </motion.h3>
        <motion.p 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          We believe in creating sustainable impact through our corporate social responsibility initiatives. 
          Our commitment extends beyond business success to building stronger communities and a better future for all.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CSRActivitiesSection;

