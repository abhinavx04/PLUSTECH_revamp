import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Map } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  images: string[];
  position: { x: number; y: number }; // Position on the floor plan
  icon: string;
}

// Helper function to generate placeholder images - Replace these URLs with real images later
const getPlaceholderImage = (roomName: string, index: number) => {
  // Using placeholder.com service - replace with /office/[room]/[number].jpg when ready
  const colors = ['3B82F6', '8B5CF6', 'EC4899', '10B981', 'F59E0B', 'EF4444', '06B6D4'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/1920x1080/${color}/FFFFFF?text=${encodeURIComponent(roomName)}+${index + 1}`;
};

// Office sections data - Easy to add/remove sections by editing this array
const officeData: Room[] = [
  {
    id: 'entrance',
    name: 'Entrance',
    description: 'Main entrance and reception area',
    images: [
      getPlaceholderImage('Entrance', 0),
      getPlaceholderImage('Entrance', 1),
      getPlaceholderImage('Entrance', 2),
    ],
    position: { x: 20, y: 20 },
    icon: '🚪',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Engineering and technical development workspace',
    images: [
      getPlaceholderImage('Engineering', 0),
      getPlaceholderImage('Engineering', 1),
      getPlaceholderImage('Engineering', 2),
    ],
    position: { x: 40, y: 30 },
    icon: '⚙️',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing and communications department',
    images: [
      getPlaceholderImage('Marketing', 0),
      getPlaceholderImage('Marketing', 1),
      getPlaceholderImage('Marketing', 2),
    ],
    position: { x: 60, y: 25 },
    icon: '📢',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Project management and coordination center',
    images: [
      getPlaceholderImage('Projects', 0),
      getPlaceholderImage('Projects', 1),
      getPlaceholderImage('Projects', 2),
    ],
    position: { x: 25, y: 45 },
    icon: '📋',
  },
  {
    id: 'management',
    name: 'Management',
    description: 'Management and leadership offices',
    images: [
      getPlaceholderImage('Management', 0),
      getPlaceholderImage('Management', 1),
      getPlaceholderImage('Management', 2),
    ],
    position: { x: 50, y: 50 },
    icon: '👔',
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Human Resources department',
    images: [
      getPlaceholderImage('HR', 0),
      getPlaceholderImage('HR', 1),
      getPlaceholderImage('HR', 2),
    ],
    position: { x: 75, y: 45 },
    icon: '👥',
  },
  {
    id: 'managing-director',
    name: 'Managing Director',
    description: 'Managing Director office',
    images: [
      getPlaceholderImage('Managing Director', 0),
      getPlaceholderImage('Managing Director', 1),
      getPlaceholderImage('Managing Director', 2),
    ],
    position: { x: 35, y: 70 },
    icon: '👤',
  },
  {
    id: 'break-room',
    name: 'Break Room',
    description: 'Employee break and relaxation area',
    images: [
      getPlaceholderImage('Break Room', 0),
      getPlaceholderImage('Break Room', 1),
      getPlaceholderImage('Break Room', 2),
    ],
    position: { x: 60, y: 65 },
    icon: '☕',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Office kitchen and dining area',
    images: [
      getPlaceholderImage('Kitchen', 0),
      getPlaceholderImage('Kitchen', 1),
      getPlaceholderImage('Kitchen', 2),
    ],
    position: { x: 80, y: 70 },
    icon: '🍽️',
  },
  {
    id: 'pooja-room',
    name: 'Pooja Room',
    description: 'Prayer and meditation room',
    images: [
      getPlaceholderImage('Pooja Room', 0),
      getPlaceholderImage('Pooja Room', 1),
      getPlaceholderImage('Pooja Room', 2),
    ],
    position: { x: 15, y: 70 },
    icon: '🕉️',
  },
  {
    id: 'directors-room',
    name: 'Directors Room',
    description: 'Board of Directors meeting room',
    images: [
      getPlaceholderImage('Directors Room', 0),
      getPlaceholderImage('Directors Room', 1),
      getPlaceholderImage('Directors Room', 2),
    ],
    position: { x: 70, y: 30 },
    icon: '🏛️',
  },
];

export const OfficeShowcase: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
    setViewMode('gallery');
  };

  const handleClose = () => {
    setSelectedRoom(null);
    setViewMode('map');
  };

  const nextImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prev) => 
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-8 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Explore Our <span className="text-blue-400">Facility</span>
        </h1>
        <p className="text-xl text-blue-200">
          Take an interactive tour through our state-of-the-art office
        </p>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 max-w-7xl mx-auto px-4 pb-20"
          >
            {/* Interactive Floor Plan */}
            <div className="relative w-full h-[600px] bg-slate-800/50 backdrop-blur-sm rounded-3xl border-2 border-blue-500/30 shadow-2xl overflow-hidden">
              {/* Animated Grid Background */}
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px bg-blue-500/10"
                    style={{ top: `${i * 5}%`, width: '100%' }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </div>

              {/* Room Markers */}
              {officeData.map((room, index) => (
                <motion.div
                  key={room.id}
                  className="absolute"
                  style={{
                    left: `${room.position.x}%`,
                    top: `${room.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  onHoverStart={() => setHoveredRoom(room.id)}
                  onHoverEnd={() => setHoveredRoom(null)}
                >
                  {/* Pulsing Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500"
                    animate={{
                      scale: [1, 2, 2],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />

                  {/* Room Button */}
                  <motion.button
                    onClick={() => handleRoomClick(room)}
                    className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mb-1">{room.icon}</span>
                    <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      Click
                    </span>
                  </motion.button>

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredRoom === room.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-slate-900 px-4 py-2 rounded-lg border border-blue-500/50 shadow-xl whitespace-nowrap"
                      >
                        <p className="text-white font-semibold">{room.name}</p>
                        <p className="text-blue-300 text-sm">{room.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Connection Lines - Connecting rooms in logical flow */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Entrance to Engineering */}
                <motion.line
                  x1="20%" y1="20%" x2="40%" y2="30%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Entrance to Marketing */}
                <motion.line
                  x1="20%" y1="20%" x2="60%" y2="25%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                {/* Marketing to Directors Room */}
                <motion.line
                  x1="60%" y1="25%" x2="70%" y2="30%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
                {/* Engineering to Projects */}
                <motion.line
                  x1="40%" y1="30%" x2="25%" y2="45%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                {/* Projects to Management */}
                <motion.line
                  x1="25%" y1="45%" x2="50%" y2="50%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
                {/* Management to HR */}
                <motion.line
                  x1="50%" y1="50%" x2="75%" y2="45%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.0 }}
                />
                {/* Management to Managing Director */}
                <motion.line
                  x1="50%" y1="50%" x2="35%" y2="70%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.1 }}
                />
                {/* Managing Director to Pooja Room */}
                <motion.line
                  x1="35%" y1="70%" x2="15%" y2="70%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
                {/* Managing Director to Break Room */}
                <motion.line
                  x1="35%" y1="70%" x2="60%" y2="65%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.3 }}
                />
                {/* Break Room to Kitchen */}
                <motion.line
                  x1="60%" y1="65%" x2="80%" y2="70%"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                />
              </svg>
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mt-8 text-blue-200"
            >
              <p className="text-lg">
                👆 Click on any room to explore photos and details
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          >
            {selectedRoom && (
              <>
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleClose}
                  className="absolute top-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>

                {/* Back to Map Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleClose}
                  className="absolute top-8 left-8 z-50 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center gap-2 hover:bg-blue-500/30 transition-colors text-white"
                >
                  <Map className="w-5 h-5" />
                  <span>Back to Map</span>
                </motion.button>

                {/* Image Gallery */}
                <div className="flex items-center justify-center h-screen px-20">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative max-w-6xl w-full"
                  >
                    {/* Main Image */}
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <img
                        src={selectedRoom.images[currentImageIndex]}
                        alt={`${selectedRoom.name} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {selectedRoom.name}
                        </h2>
                        <p className="text-blue-200 text-lg">
                          {selectedRoom.description}
                        </p>
                        <div className="flex gap-2 mt-4">
                          {selectedRoom.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? 'bg-blue-500 w-8'
                                  : 'bg-white/30 hover:bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Navigation Buttons */}
                    {selectedRoom.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Thumbnail Preview */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                  {selectedRoom.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden transition-all ${
                        idx === currentImageIndex
                          ? 'ring-4 ring-blue-500 scale-110'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      whileHover={{ scale: idx === currentImageIndex ? 1.1 : 1.05 }}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
};

