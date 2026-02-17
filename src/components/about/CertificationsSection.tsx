import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCertificationsFirestore, type Certification } from '../../hooks/useCertificationsFirestore';

const categoryColors: Record<string, string> = {
  quality: 'bg-green-100 text-green-800 border-green-200',
  financial: 'bg-blue-100 text-blue-800 border-blue-200',
  compliance: 'bg-purple-100 text-purple-800 border-purple-200',
  safety: 'bg-orange-100 text-orange-800 border-orange-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  renewed: 'bg-blue-100 text-blue-800'
};

const CertificationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const { loading, error, getPublishedCertifications } = useCertificationsFirestore();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDetailModal]);

  const certificationsData = useMemo(
    () => getPublishedCertifications(),
    [getPublishedCertifications]
  );

  const parseDate = (value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

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
          Certifications
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our certifications demonstrate our commitment to quality management, financial strength, and business reliability, 
          ensuring we meet the highest industry standards.
        </motion.p>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Unable to load live certifications. Showing fallback data. Details: {error}
        </div>
      )}

      {/* Certifications Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {loading && certificationsData.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]" />
          </div>
        ) : certificationsData.length === 0 ? null : (
          certificationsData.map((certification) => {
            const descriptionPreview = certification.description.length > 100 
              ? certification.description.substring(0, 100) + '...'
              : certification.description;
            
            return (
            <motion.div
              key={certification.id}
              variants={cardVariants}
              className="flex flex-col h-full cursor-pointer"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
              onClick={() => {
                setSelectedCertification(certification);
                setShowDetailModal(true);
              }}
            >
              <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <h3 className="text-xl font-bold font-heading text-black mb-2">
                    {certification.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {certification.issuingBody}
                  </p>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-600 leading-relaxed text-sm mb-6">
                    {descriptionPreview}
                  </p>
                  
                  {/* Valid Until */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-1">Valid Until:</div>
                    <div className="text-lg font-semibold text-[#00aeef]">
                      {parseDate(certification.validUntil)?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) || '—'}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-auto pt-4">
                    <button className="w-full px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#0099d4] transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${certification.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Compliance Summary */}
      <motion.div 
        className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold font-heading text-black mb-4">
            Compliance Excellence
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive certification portfolio ensures we maintain the highest standards 
            in quality management, financial transparency, and regulatory compliance across all operations.
          </p>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedCertification && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 md:p-6"
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[selectedCertification.category]}`}>
                      {selectedCertification.category}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedCertification.status]}`}>
                      {selectedCertification.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-black mb-1 sm:mb-2 break-words">
                    {selectedCertification.name}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 break-words">
                    {selectedCertification.issuingBody}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-white hover:bg-gray-100 text-gray-800 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Description</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {selectedCertification.description}
                </p>
              </div>

              {/* Valid Until */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Valid Until:</div>
                <div className="text-xl sm:text-2xl font-semibold text-[#00aeef]">
                  {parseDate(selectedCertification.validUntil)?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) || '—'}
                </div>
              </div>

              {/* Image if available */}
              {selectedCertification.imageUrl && (
                <div className="mb-4 sm:mb-6">
                  <img
                    src={selectedCertification.imageUrl}
                    alt={selectedCertification.name}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
