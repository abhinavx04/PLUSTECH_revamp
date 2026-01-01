import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  images: string[];
  bgColor: string;
  textColor: string;
  animationDirection: 'left' | 'right' | 'up';
}

const capabilitiesData: CapabilityItem[] = [
  {
    id: 'turnkey-paintshop',
    title: 'Turnkey Paintshop Solutions for Surface Finishing Plants',
    description: 'End-to-end paintshop delivery—from 3D layout to commissioning—covering process, utilities, automation, safety, quality, and sustainability to meet production and compliance goals.',
    features: [],
    images: [
      '/home/NAHAR_1.webp',
      '/home/NAHAR_2.webp',
      '/home/UNITED.webp'
    ],
    bgColor: 'bg-white',
    textColor: 'text-black',
    animationDirection: 'left'
  },
  {
    id: 'robotic-applications',
    title: 'Robotic Applications',
    description: 'We deliver state-of-the-art, high-precision robotic painting systems designed for blue-chip customers across a wide range of industries.',
    features: [
      'Commercial vehicle cabins — interior and exterior painting, sealer, and underbody coating',
      'Two-wheeler fuel tanks',
      'Plastic components',
      'General industrial parts'
    ],
    images: [
      '/robotic/indoor-painting_and_door_opening.webp',
      '/robotic/2-wheeler-fueltanks_plaSTIC.png',
      '/robotic/scooter-metal_plastic-part.webp',
      '/robotic/sealer_application.png',
      '/robotic/underbody_application.png'
    ],
    bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
    textColor: 'text-black',
    animationDirection: 'right'
  },
  {
    id: 'material-handling',
    title: 'Automated Material Handling',
    description: 'Plustech deploys fully or partially automated handling solutions across various sections and operations of paint shops to boost productivity, efficiency, and optimize the plant footprint.',
    features: [],
    images: [
      '/automated-customised-materialhandling/1.webp',
      '/automated-customised-materialhandling/2.webp',
      '/automated-customised-materialhandling/3.webp'
    ],
    bgColor: 'bg-white',
    textColor: 'text-black',
    animationDirection: 'left'
  },
  {
    id: 'digitization',
    title: 'Digitization & Smart Factory',
    description: 'Empowering industry transformation through advanced digital solutions and Industry 4.0 technologies. Our smart factory implementations deliver real-time insights, optimize processes, and enable data-driven decision making.',
    features: [
      'Advanced process visualization and control systems',
      'Real-time performance analytics and KPI tracking',
      'IoT sensor networks and data collection',
      'Predictive maintenance systems',
      'Machine learning optimization'
    ],
    images: [
      '/digitization-smartfactory/1.webp',
      '/digitization-smartfactory/2.webp'
    ],
    bgColor: 'bg-white',
    textColor: 'text-black',
    animationDirection: 'up'
  }
];

const CapabilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Scroll progress for header - appears when entering viewport from bottom
  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start 0.8", "start 0.3"]
  });
  
  // Calculate opacity: fade in from 0 to 1 as scrolling down, but don't fade out when scrolling back up
  const headerOpacity = useTransform(headerScrollProgress, (latest) => {
    // Use the maximum value reached to prevent fading out
    return Math.min(1, Math.max(0, latest));
  });
  const headerY = useTransform(headerScrollProgress, (latest) => {
    const progress = Math.min(1, Math.max(0, latest));
    return 30 * (1 - progress);
  });

  const getAnimationVariants = (direction: 'left' | 'right' | 'up') => {
    const baseVariants = {
      hidden: { 
        opacity: 0,
        transition: { duration: 0.6, ease: "easeIn" }
      },
      visible: { 
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }
    };

    switch (direction) {
      case 'left':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            x: -100, 
            rotateY: -15 
          },
          visible: { 
            ...baseVariants.visible, 
            x: 0, 
            rotateY: 0 
          }
        };
      case 'right':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            x: 100, 
            rotateY: 15 
          },
          visible: { 
            ...baseVariants.visible, 
            x: 0, 
            rotateY: 0 
          }
        };
      case 'up':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            y: 50, 
            rotateX: 10 
          },
          visible: { 
            ...baseVariants.visible, 
            y: 0, 
            rotateX: 0 
          }
        };
      default:
        return baseVariants;
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.5, ease: "easeIn" }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div ref={sectionRef} id="capabilities" className="w-full relative overflow-hidden">
      {/* Section Header */}
      <motion.div 
        ref={headerRef}
        className="py-12 px-6"
        style={{
          opacity: headerOpacity,
          y: headerY
        }}
      >
        <div className="max-w-7xl mx-auto space-y-3 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-black leading-tight">
            Our Capabilities
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-body max-w-3xl mx-auto">
            Transforming industries through integrated paintshop, robotic, and digital solutions.
          </p>
        </div>
      </motion.div>

      {/* Capability Items */}
      {capabilitiesData.map((capability, index) => (
        <CapabilityItem 
          key={capability.id}
          capability={capability}
          index={index}
        />
      ))}
    </div>
  );
};

interface CapabilityItemProps {
  capability: CapabilityItem;
  index: number;
}

const CapabilityItem: React.FC<CapabilityItemProps> = ({ 
  capability, 
  index
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [maxProgress, setMaxProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Scroll progress tracking - component enters from bottom, exits from top
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 0.85", "start 0.15"]
  });

  // Track maximum scroll progress to determine if we've scrolled past this component
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setMaxProgress(prev => Math.max(prev, latest));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate progress value based on scroll position - used for all transforms
  const progressValue = useTransform(scrollYProgress, (latest) => {
    // If we've scrolled past this component significantly (reached high progress)
    if (maxProgress > 0.6) {
      const disappearThreshold = 0.35 + (index * 0.08);
      
      // Smooth transition: prevents jump at boundary
      if (latest < disappearThreshold) {
        // Fade out: progress goes from 1 to 0 as latest goes from disappearThreshold to 0
        return Math.max(0, latest / disappearThreshold);
      } else if (latest >= disappearThreshold && latest <= 0.5) {
        // Keep fully visible in this range (smooth transition zone prevents flicker)
        return 1;
      } else {
        // Use normal fade-in logic when scrolling down from top
        return Math.min(1, Math.max(0, (latest - 0.1) / 0.4));
      }
    }
    
    // Normal progress when scrolling down (haven't scrolled past yet)
    return Math.min(1, Math.max(0, (latest - 0.1) / 0.4));
  });

  // Calculate opacity: fade in when scrolling down, fade out when scrolling back up past threshold
  const opacity = progressValue;

  const x = useTransform(progressValue, (progress) => {
    const invProgress = 1 - progress;
    
    if (capability.animationDirection === 'left') {
      return -100 * invProgress;
    } else if (capability.animationDirection === 'right') {
      return 100 * invProgress;
    }
    return 0;
  });

  const y = useTransform(progressValue, (progress) => {
    const invProgress = 1 - progress;
    
    if (capability.animationDirection === 'up') {
      return 50 * invProgress;
    }
    return 0;
  });

  const rotateY = useTransform(progressValue, (progress) => {
    const invProgress = 1 - progress;
    
    if (capability.animationDirection === 'left') {
      return -15 * invProgress;
    } else if (capability.animationDirection === 'right') {
      return 15 * invProgress;
    }
    return 0;
  });

  const rotateX = useTransform(progressValue, (progress) => {
    const invProgress = 1 - progress;
    
    if (capability.animationDirection === 'up') {
      return 10 * invProgress;
    }
    return 0;
  });

  // Image opacity and scale
  const imageOpacity = useTransform(scrollYProgress, (latest) => {
    if (maxProgress > 0.6) {
      const disappearThreshold = 0.35 + (index * 0.08);
      
      if (latest < disappearThreshold) {
        return Math.max(0, latest / disappearThreshold);
      } else if (latest >= disappearThreshold && latest <= 0.5) {
        // Keep fully visible in transition zone
        return 1;
      } else {
        return Math.min(1, Math.max(0, (latest - 0.15) / 0.35));
      }
    }
    
    return Math.min(1, Math.max(0, (latest - 0.15) / 0.35));
  });

  const imageScale = useTransform(scrollYProgress, (latest) => {
    if (maxProgress > 0.6) {
      const disappearThreshold = 0.35 + (index * 0.08);
      let progress: number;
      
      if (latest < disappearThreshold) {
        progress = latest / disappearThreshold;
        return 0.8 + (0.2 * progress);
      } else if (latest >= disappearThreshold && latest <= 0.5) {
        // Keep fully visible in transition zone
        return 1;
      } else {
        progress = Math.min(1, Math.max(0, (latest - 0.15) / 0.35));
        return 0.8 + (0.2 * progress);
      }
    }
    
    const progress = Math.min(1, Math.max(0, (latest - 0.15) / 0.35));
    return 0.8 + (0.2 * progress);
  });

  // Reset zoom and pan when image changes
  useEffect(() => {
    if (selectedImage) {
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoomLevel(prev => Math.min(prev + 0.25, 5));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (selectedImage) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(5, prev + delta)));
    }
  };

  return (
    <motion.div
      ref={itemRef}
      className={`w-full py-16 px-6 ${capability.bgColor}`}
      style={{
        opacity,
        x,
        y,
        rotateY,
        rotateX,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Content Section */}
          <div className="text-left max-w-5xl">
            <div className="space-y-6">
              <h3 className={`text-2xl md:text-3xl font-semibold font-heading leading-tight ${capability.textColor}`}>
                {capability.title}
              </h3>
              <p className={`text-lg md:text-xl font-body leading-relaxed ${capability.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>
                {capability.description}
              </p>
            </div>
            
            {capability.features.length > 0 && (
              <div className="mt-12 space-y-6">
                <h4 className={`text-xl font-semibold ${capability.textColor === 'text-white' ? 'text-white' : 'text-gray-800'}`}>
                  Key Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capability.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`flex items-start space-x-4 p-4 rounded-xl ${capability.textColor === 'text-white' ? 'bg-white/10' : 'bg-gray-100'}`}
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${capability.textColor === 'text-white' ? 'bg-blue-400' : 'bg-[#00aeef]'}`} />
                      <span className={`text-base leading-relaxed ${capability.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <motion.div 
            className="relative"
            style={{
              opacity: imageOpacity,
              scale: imageScale,
            }}
          >
            {capability.id === 'turnkey-paintshop' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {capability.images.map((image, idx) => (
                    <div
                      key={image}
                      className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/60 bg-gradient-to-br from-white via-[#e8f4ff] to-[#cfe1ff] group"
                    >
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,174,239,0.25), transparent 35%), radial-gradient(circle at 80% 0%, rgba(79,70,229,0.18), transparent 40%)' }} />
                      <img
                        src={image}
                        alt={`Turnkey paintshop visual ${idx + 1}`}
                        className="relative w-full h-[260px] md:h-[320px] object-contain bg-white/50 cursor-pointer transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onClick={() => setSelectedImage(image)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-semibold text-[#0f172a] shadow pointer-events-none">
                        Plant Visual {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-[#e0f7ff] via-white to-[#d7e9ff] shadow-2xl p-6">
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(0,174,239,0.2), transparent 35%), radial-gradient(circle at 90% 30%, rgba(99,102,241,0.15), transparent 45%)' }} />
                  <div className="relative flex flex-col md:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white/60 shadow-inner flex items-center justify-center text-[#00aeef] font-semibold">
                      ▶
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-[#0f172a]">Feature Video Placeholder</div>
                      <p className="text-sm text-slate-600 mt-1">
                        Upload a walkthrough video of the 3D plant after the visuals—optimized for inline playback.
                      </p>
                    </div>
                    <div className="w-full md:w-64 h-32 rounded-xl border border-dashed border-[#00aeef]/50 bg-white/70 flex items-center justify-center text-[#00aeef] text-sm font-medium">
                      Upload Video
                    </div>
                  </div>
                </div>
              </div>
            ) : capability.id === 'robotic-applications' ? (
              // Robotic applications with carousel (buttons only, no counter)
              <RoboticImageCarousel images={capability.images} />
            ) : capability.id === 'material-handling' ? (
              // 3-column responsive grid for material handling (no horizontal scroll)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {capability.images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative overflow-hidden rounded-2xl shadow-2xl group"
                  >
                    <img 
                      src={image} 
                      alt={`${capability.title} ${imageIndex + 1}`}
                      className="w-full h-[260px] md:h-[320px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              // Large 2-column grid for digitization (2 images)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {capability.images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative overflow-hidden rounded-2xl shadow-2xl group"
                  >
                    <img 
                      src={image} 
                      alt={`${capability.title} ${imageIndex + 1}`}
                      className="w-full h-[400px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                title="Zoom In (+)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                title="Zoom Out (-)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors text-xs font-semibold"
                title="Reset Zoom (0)"
              >
                1:1
              </button>
            </div>

            {/* Zoom Level Display */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium z-10">
              {Math.round(zoomLevel * 100)}%
            </div>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-[95vw] max-h-[95vh] relative"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              style={{ cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Full size plant visual"
                className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                }}
              />
            </motion.div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs flex gap-4 z-10">
              <span>+/- Zoom</span>
              <span>0 Reset</span>
              <span>ESC Close</span>
              {zoomLevel > 1 && <span>Drag to Pan</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RoboticImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToImage = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    
    const imageWidth = 450; // w-[450px] on mobile
    const gap = 24; // gap-6 = 24px
    const scrollPosition = index * (imageWidth + gap);
    
    scroller.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    scrollToImage(prevIndex);
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollerRef}
        className="flex overflow-hidden gap-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {images.map((image, i) => (
          <div key={i} className="flex-none w-[450px] md:w-[550px]">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src={image} 
                alt={`Robotic application ${i + 1}`}
                className="w-full h-[350px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapabilitiesSection;
