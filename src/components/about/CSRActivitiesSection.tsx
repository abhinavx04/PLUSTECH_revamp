import React, { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCSRActivitiesFirestore } from '../../hooks/useCSRActivitiesFirestore';

const CSRActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const { loading, error, getPublishedCSRActivities } = useCSRActivitiesFirestore();

  const data = useMemo(
    () => getPublishedCSRActivities(),
    [getPublishedCSRActivities]
  );

  const impactMetrics = [
    { label: 'Programs', value: data.length },
    { label: 'Categories', value: new Set(data.map((a) => a.category)).size },
  ];

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
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
          >
            <div className="text-3xl font-bold text-[#00aeef] mb-2">
              {metric.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Uniform Grid Layout */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {loading && data.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]" />
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No CSR activities found. Add new items from the admin dashboard.
          </div>
        ) : (
          data.map((activity) => {
            const descriptionPreview = activity.description.length > 100 
              ? activity.description.substring(0, 100) + '...'
              : activity.description;
            
            // Get images - support both new (imageUrls) and legacy (imageUrl) formats
            const images = activity.imageUrls && activity.imageUrls.length > 0 
              ? activity.imageUrls 
              : (activity.imageUrl ? [activity.imageUrl] : ['/aboutus/2.png']);
            const primaryImage = images[0];
            
            return (
            <motion.div
              key={activity.id}
              variants={cardVariants}
              className="flex flex-col h-full"
            >
              <div 
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 flex flex-col h-full cursor-pointer"
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
                {/* Image Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={activity.title}
                    className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                  />
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {images.length} Photos
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold font-heading text-white mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {descriptionPreview}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Metrics */}
                  {activity.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {activity.metrics.slice(0, 3).map((metric, index) => (
                        <div
                          key={index}
                          className="text-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="text-lg font-bold text-[#00aeef] mb-1">
                            {metric.value}
                          </div>
                          <div className="text-xs text-gray-600">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-auto pt-4">
                    <div className="w-full px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#0099d4] transition-colors text-sm font-medium text-center pointer-events-none">
                      View Details
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

