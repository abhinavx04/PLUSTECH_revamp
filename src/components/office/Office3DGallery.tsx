import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Expand, Camera, MapPin, Clock } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
  location: string;
  time: string;
  size: 'small' | 'medium' | 'large';
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/office/reception/1.jpg',
    title: 'Main Reception',
    category: 'Entrance',
    description: 'First impression matters - modern and welcoming',
    location: 'Ground Floor',
    time: 'Morning Light',
    size: 'large',
  },
  {
    id: '2',
    src: '/office/production/1.jpg',
    title: 'Assembly Line A',
    category: 'Production',
    description: 'Automated manufacturing at its finest',
    location: 'Factory Floor 1',
    time: 'Peak Hours',
    size: 'medium',
  },
  {
    id: '3',
    src: '/office/production/2.jpg',
    title: 'Quality Control',
    category: 'Production',
    description: 'Every product meets our standards',
    location: 'Factory Floor 1',
    time: 'Afternoon Shift',
    size: 'small',
  },
  {
    id: '4',
    src: '/office/robotics/1.jpg',
    title: 'Robot Testing Zone',
    category: 'Robotics',
    description: 'Where automation comes to life',
    location: 'R&D Wing',
    time: 'Day Operation',
    size: 'medium',
  },
  {
    id: '5',
    src: '/office/workspace/1.jpg',
    title: 'Open Office',
    category: 'Workspace',
    description: 'Collaborative environment for innovation',
    location: 'Second Floor',
    time: 'Work Hours',
    size: 'large',
  },
  {
    id: '6',
    src: '/office/cafeteria/1.jpg',
    title: 'Team Lounge',
    category: 'Amenities',
    description: 'Recharge and connect with colleagues',
    location: 'Ground Floor',
    time: 'Lunch Time',
    size: 'small',
  },
  {
    id: '7',
    src: '/office/robotics/2.jpg',
    title: 'Innovation Lab',
    category: 'Robotics',
    description: 'Future technologies in development',
    location: 'R&D Wing',
    time: 'Evening Session',
    size: 'medium',
  },
  {
    id: '8',
    src: '/office/workspace/2.jpg',
    title: 'Meeting Rooms',
    category: 'Workspace',
    description: 'Smart spaces for collaboration',
    location: 'Second Floor',
    time: 'Conference Time',
    size: 'small',
  },
];

export const Office3DGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['All', ...new Set(galleryImages.map((img) => img.category))];

  const filteredImages =
    filter === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20 px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Facility</span>
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Experience our state-of-the-art facility through an immersive visual journey
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              filter === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Bento Grid Gallery */}
      <motion.div
        layout
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={index}
              onSelect={setSelectedImage}
              isHovered={hoveredId === image.id}
              onHover={setHoveredId}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, rotateY: -90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateY: 90, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: '2000px' }}
            >
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-video">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-sm font-semibold text-white mb-3">
                        {selectedImage.category}
                      </span>
                      <h2 className="text-4xl font-bold text-white mb-2">
                        {selectedImage.title}
                      </h2>
                      <p className="text-blue-200 text-lg mb-4">
                        {selectedImage.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/70">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedImage.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{selectedImage.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  onSelect: (image: GalleryImage) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  image,
  index,
  onSelect,
  isHovered,
  onHover,
}) => {
  const [flipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    small: 'md:col-span-1 md:row-span-1',
    medium: 'md:col-span-2 md:row-span-1',
    large: 'md:col-span-2 md:row-span-2',
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        delay: index * 0.05,
      }}
      className={`${sizeClasses[image.size]} relative group cursor-pointer`}
      onMouseEnter={() => onHover(image.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(image)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Hover Effects */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            {/* Scan Line Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Corner Brackets */}
            <svg className="absolute inset-0 w-full h-full p-4">
              <motion.rect
                x="0"
                y="0"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.rect
                x="calc(100% - 20)"
                y="0"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.rect
                x="0"
                y="calc(100% - 20)"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.rect
                x="calc(100% - 20)"
                y="calc(100% - 20)"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </svg>
          </motion.div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 transform group-hover:translate-y-0 transition-transform">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <span className="inline-block px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded text-xs font-semibold text-white mb-2">
                {image.category}
              </span>
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                {image.title}
              </h3>
              <p className="text-blue-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {image.description}
              </p>
            </motion.div>
          </div>

          {/* Expand Icon */}
          <motion.div
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <Expand className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        {/* Back Face (Bonus feature - shows on long hover) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 p-6 flex flex-col justify-center items-center text-white backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Camera className="w-12 h-12 mb-4" />
          <h4 className="font-bold text-xl mb-2">{image.title}</h4>
          <p className="text-center text-sm">{image.description}</p>
        </div>
      </motion.div>

      {/* 3D Shadow Effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-blue-500/20 rounded-2xl blur-xl"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
};

