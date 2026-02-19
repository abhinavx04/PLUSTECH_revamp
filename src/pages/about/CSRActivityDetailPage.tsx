import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../../components/Footer';
import { useCSRActivitiesFirestore } from '../../hooks/useCSRActivitiesFirestore';
import { PageLayout } from '../../components/PageLayout';

const categoryConfig = {
  education: {
    label: 'Education',
  },
  environment: {
    label: 'Environment',
  },
  community: {
    label: 'Community',
  },
  healthcare: {
    label: 'Healthcare',
  },
  other: {
    label: 'Other',
  },
} as const;

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Active' },
  completed: { color: 'bg-blue-500', label: 'Completed' },
  planned: { color: 'bg-yellow-500', label: 'Planned' },
} as const;

const CSRActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { loading, getCSRActivityById } = useCSRActivitiesFirestore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPDF, setShowPDF] = useState(false);

  const activity = activityId ? getCSRActivityById(activityId) : null;

  useEffect(() => {
    if (!loading && activityId && !activity) {
      navigate('/about/csr-activities');
    }
  }, [activity, activityId, loading, navigate]);

  useEffect(() => {
    if (showPDF && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPDF]);

  if (loading) {
    return (
      <PageLayout className="bg-white pt-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]" />
        </div>
      </PageLayout>
    );
  }

  if (!activity) {
    return (
      <PageLayout className="bg-white pt-16">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity Not Found</h1>
            <button
              onClick={() => navigate('/about/csr-activities')}
              className="px-6 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#0099d4] transition-colors"
            >
              Back to CSR Activities
            </button>
          </div>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  const images = activity.imageUrls && activity.imageUrls.length > 0 
    ? activity.imageUrls 
    : (activity.imageUrl ? [activity.imageUrl] : ['/aboutus/2.webp']);
  const hasMultipleImages = images.length > 1;

  return (
    <PageLayout className="bg-gray-50 pt-16">
      <div className="w-full max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/about/csr-activities')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to CSR Activities
          </button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-black mb-2 break-words">
            {activity.title}
          </h1>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            {/* Category badge */}
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {categoryConfig[activity.category as keyof typeof categoryConfig]?.label ?? 'Other'}
            </span>

            {/* Year & status */}
            <div className="flex items-center gap-3 text-gray-600">
              {activity.year && (
                <span className="inline-flex items-center gap-1 text-xs md:text-sm">
                  <span className="text-gray-500">Year</span>
                  <span className="font-semibold">{activity.year}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Status</span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold capitalize`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusConfig[activity.status as keyof typeof statusConfig]?.color ??
                      'bg-green-500'
                    }`}
                  />
                  {statusConfig[activity.status as keyof typeof statusConfig]?.label ??
                    activity.status}
                </span>
              </span>
            </div>
          </div>

          {activity.impact && (
            <p className="mt-3 text-sm md:text-base text-gray-600 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
              {activity.impact}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col gap-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold font-heading text-black mb-3">About This Initiative</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line break-words overflow-wrap-anywhere" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
              {activity.description}
            </p>
          </motion.div>

          {/* Metrics */}
          {activity.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold font-heading text-black mb-4">Impact Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activity.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-[#00aeef] mb-1 break-words">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium break-words">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold font-heading text-black mb-4">Gallery</h2>
            
            {/* Main Image */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3">
              <div className="relative w-full flex items-center justify-center" style={{ minHeight: '200px' }}>
                <img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${activity.title} - Image ${currentImageIndex + 1}`}
                  className="w-full max-h-[50vh] sm:max-h-[420px] object-contain transition-opacity duration-300"
                />
                
                {/* Navigation Arrows — desktop only (overlaid) */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 transition-all shadow-sm hover:shadow-md z-10"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 transition-all shadow-sm hover:shadow-md z-10"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium z-10">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Buttons — below the image */}
            {hasMultipleImages && (
              <div className="flex sm:hidden items-center justify-center gap-4 mb-3">
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="bg-white shadow-md rounded-full p-3 border border-gray-200 transition-all active:scale-95"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500 font-medium">{currentImageIndex + 1} / {images.length}</span>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="bg-white shadow-md rounded-full p-3 border border-gray-200 transition-all active:scale-95"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border transition-all ${
                      idx === currentImageIndex 
                        ? 'border-[#00aeef] shadow-md' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* PDF Document */}
          {activity.documentUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-lg sm:text-xl font-bold font-heading text-black">CSR Document</h2>
                <div className="flex items-center gap-2">
                  {/* Mobile: open in fullscreen modal */}
                  <button
                    onClick={() => setShowPDF(true)}
                    className="sm:hidden px-3 py-2 bg-[#00aeef] text-white rounded-md hover:bg-[#0099d4] transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  {/* Desktop: inline toggle */}
                  {!showPDF && (
                    <button
                      onClick={() => setShowPDF(true)}
                      className="hidden sm:flex px-4 py-2 bg-[#00aeef] text-white rounded-md hover:bg-[#0099d4] transition-colors text-sm font-medium items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View PDF
                    </button>
                  )}
                  {showPDF && (
                    <button
                      onClick={() => setShowPDF(false)}
                      className="hidden sm:flex px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hide PDF
                    </button>
                  )}
                </div>
              </div>
              {activity.documentSize && (
                <p className="text-sm text-gray-500 mb-3">
                  File size: {(activity.documentSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              {/* Desktop: inline iframe */}
              {showPDF && (
                <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`${activity.documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-[520px]"
                    title="CSR Document PDF Viewer"
                    allow="fullscreen"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Mobile PDF Fullscreen Modal */}
          {showPDF && activity.documentUrl && (
            <div className="sm:hidden fixed inset-0 z-[100] bg-black/90 flex flex-col">
              <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-semibold truncate pr-4">CSR Document</h3>
                <button
                  onClick={() => setShowPDF(false)}
                  className="text-white hover:text-gray-300 transition-colors p-1"
                  aria-label="Close viewer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`${activity.documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="CSR Document PDF Viewer"
                  style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                  allow="fullscreen"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      </div>
      {/* Footer */}
      <Footer />
    </PageLayout>
  );
};

export default CSRActivityDetailPage;

