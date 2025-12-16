import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface SimpleImage {
  src: string;
  title: string;
  description?: string;
}

interface SimpleOfficeGalleryProps {
  images: SimpleImage[];
  title?: string;
  subtitle?: string;
}

/**
 * SIMPLE OFFICE GALLERY
 * Drop-in component - just pass an array of images!
 * 
 * Usage:
 * <SimpleOfficeGallery 
 *   title="Our Office"
 *   images={[
 *     { src: '/office/1.jpg', title: 'Reception' },
 *     { src: '/office/2.jpg', title: 'Production Floor' },
 *   ]}
 * />
 */
export const SimpleOfficeGallery: React.FC<SimpleOfficeGalleryProps> = ({
  images,
  title = 'Our Facility',
  subtitle = 'Explore our workspace',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex]);

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="w-12 h-12 text-blue-400" />
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            {title}
          </h1>
        </div>
        <p className="text-xl text-blue-200">{subtitle}</p>
      </motion.div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative break-inside-avoid cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openLightbox(index)}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              >
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-blue-200 text-sm">
                      {image.description}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 ring-2 ring-blue-500 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={closeLightbox}
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {images[selectedIndex].title}
                </h3>
                {images[selectedIndex].description && (
                  <p className="text-blue-200">
                    {images[selectedIndex].description}
                  </p>
                )}
                <p className="text-blue-400 text-sm mt-2">
                  {selectedIndex + 1} / {images.length}
                </p>
              </motion.div>
            </motion.div>

            {/* Keyboard Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-300 text-sm flex gap-4">
              <span>← → Navigate</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Example usage component
export const OfficeGalleryExample: React.FC = () => {
  // You can easily customize this with your own images
  const officeImages: SimpleImage[] = [
    {
      src: '/public/home/home.png',
      title: 'Reception Area',
      description: 'Modern and welcoming entrance',
    },
    {
      src: '/public/home/home1.png',
      title: 'Production Floor',
      description: 'State-of-the-art manufacturing',
    },
    {
      src: '/public/home/home2.png',
      title: 'Robotics Lab',
      description: 'Innovation in automation',
    },
    // Add more images here
  ];

  return (
    <SimpleOfficeGallery
      title="Our Facility"
      subtitle="Take a tour through our modern workspace"
      images={officeImages}
    />
  );
};

