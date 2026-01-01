import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../../components/ui/resizable-navbar';
import Footer from '../../components/Footer';
import { useCSRActivitiesFirestore } from '../../hooks/useCSRActivitiesFirestore';

const categoryColors = {
  education: 'bg-blue-100 text-blue-800 border-blue-200',
  environment: 'bg-green-100 text-green-800 border-green-200',
  community: 'bg-purple-100 text-purple-800 border-purple-200',
  healthcare: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  planned: 'bg-yellow-100 text-yellow-800'
};

const CSRActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { activities, loading, getCSRActivityById } = useCSRActivitiesFirestore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPDF, setShowPDF] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const activity = activityId ? getCSRActivityById(activityId) : null;

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
    if (!loading && activityId && !activity) {
      // Activity not found, redirect back
      navigate('/about/csr-activities');
    }
  }, [activity, activityId, loading, navigate]);

  const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-white pt-16">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24"></div>
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
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
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
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-white pt-16">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24"></div>
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
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
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
      </div>
    );
  }

  const images = activity.imageUrls && activity.imageUrls.length > 0 
    ? activity.imageUrls 
    : (activity.imageUrl ? [activity.imageUrl] : ['/aboutus/2.png']);
  const hasMultipleImages = images.length > 1;

  const parseDate = (value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-gray-50 pt-16">
      {/* Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <div className="flex-1 flex justify-center">
            <NavItems items={navItems} />
          </div>
          <div className="w-24"></div>
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
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
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

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/about/csr-activities')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to CSR Activities
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-black mb-2 break-words">
            {activity.title}
          </h1>
          {activity.impact && (
            <p className="text-base md:text-lg text-gray-600 break-words mb-4">
              {activity.impact}
            </p>
          )}

          {/* Compact details row */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Category</span>
              <span className="font-semibold capitalize">{activity.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold capitalize">{activity.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Year</span>
              <span className="font-semibold">{activity.year}</span>
            </div>
            {activity.impact && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Impact</span>
                <span className="font-semibold break-words">{activity.impact}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold font-heading text-black mb-3">About This Initiative</h2>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line break-words">
              {activity.description}
            </p>
          </motion.div>

          {/* Metrics */}
          {activity.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
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
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold font-heading text-black mb-4">Gallery</h2>
            
            {/* Main Image */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3" style={{ minHeight: '420px' }}>
              <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '420px' }}>
                <img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${activity.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[420px] object-contain transition-opacity duration-300"
                />
                
                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 transition-all shadow-sm hover:shadow-md z-10"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 transition-all shadow-sm hover:shadow-md z-10"
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

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border transition-all ${
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
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold font-heading text-black">CSR Document</h2>
                {!showPDF && (
                  <button
                    onClick={() => setShowPDF(true)}
                    className="px-4 py-2 bg-[#00aeef] text-white rounded-md hover:bg-[#0099d4] transition-colors text-sm font-medium flex items-center gap-2"
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
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide PDF
                  </button>
                )}
              </div>
              {activity.documentSize && (
                <p className="text-sm text-gray-500 mb-3">
                  File size: {(activity.documentSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              {showPDF && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`${activity.documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-[520px]"
                    title="CSR Document PDF Viewer"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CSRActivityDetailPage;

