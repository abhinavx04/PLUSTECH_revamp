import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Camera, Info, MapPin, Users, Zap } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  icon: React.ReactNode;
  images: string[];
  description: string;
  stats: { label: string; value: string }[];
}

const rooms: Room[] = [
  {
    id: 'reception',
    name: 'Reception',
    position: { x: 100, y: 150 },
    size: { width: 150, height: 100 },
    color: '#3B82F6',
    icon: <Users className="w-6 h-6" />,
    images: ['/office/reception/1.jpg'],
    description: 'Main entrance and visitor area',
    stats: [
      { label: 'Capacity', value: '20 people' },
      { label: 'Features', value: 'Smart check-in' },
    ],
  },
  {
    id: 'production',
    name: 'Production Floor',
    position: { x: 300, y: 200 },
    size: { width: 250, height: 200 },
    color: '#8B5CF6',
    icon: <Zap className="w-6 h-6" />,
    images: ['/office/production/1.jpg', '/office/production/2.jpg'],
    description: 'Main manufacturing area',
    stats: [
      { label: 'Area', value: '5000 sq ft' },
      { label: 'Machines', value: '25 units' },
    ],
  },
  {
    id: 'robotics',
    name: 'Robotics Lab',
    position: { x: 600, y: 180 },
    size: { width: 180, height: 150 },
    color: '#EC4899',
    icon: <Camera className="w-6 h-6" />,
    images: ['/office/robotics/1.jpg'],
    description: 'R&D and robotics testing',
    stats: [
      { label: 'Projects', value: '12 active' },
      { label: 'Team', value: '8 engineers' },
    ],
  },
];

export const IsometricOfficeExplorer: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Pan and zoom controls
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev * zoomFactor)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.target.closest('.room-card')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - cameraPosition.x, y: e.clientY - cameraPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCameraPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Convert 2D coordinates to isometric
  const toIsometric = (x: number, y: number) => {
    return {
      x: (x - y) * 0.866,
      y: (x + y) * 0.5,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h1 className="text-4xl font-bold text-white text-center">
          🎮 Interactive Office Explorer
        </h1>
        <p className="text-center text-blue-200 mt-2">
          Click rooms to explore • Drag to pan • Scroll to zoom
        </p>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-24 right-6 z-40 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 pointer-events-auto">
        <div className="space-y-2">
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
            className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Zoom In +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="w-full px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Zoom Out -
          </button>
          <button
            onClick={() => {
              setCameraPosition({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="w-full px-4 py-2 bg-purple-500 rounded-lg text-white font-semibold hover:bg-purple-600 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Isometric Grid */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${cameraPosition.x}px, ${cameraPosition.y}px) scale(${zoom})`,
          transformOrigin: 'center',
        }}
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="30"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(0)"
          >
            <path
              d="M 60 0 L 30 15 L 0 0 M 30 15 L 30 30"
              fill="none"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* 3D Office Map */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          transform: `translate(-50%, -50%) translate(${cameraPosition.x}px, ${cameraPosition.y}px) scale(${zoom})`,
        }}
      >
        {/* Floor Base */}
        <svg width="1000" height="800" className="absolute" style={{ left: '-500px', top: '-400px' }}>
          <polygon
            points="200,400 500,200 800,400 500,600"
            fill="rgba(30, 41, 59, 0.5)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
        </svg>

        {/* Rooms */}
        {rooms.map((room) => {
          const iso = toIsometric(room.position.x, room.position.y);
          const isoSize = toIsometric(room.size.width, room.size.height);

          return (
            <motion.div
              key={room.id}
              className="absolute room-card pointer-events-auto"
              style={{
                left: iso.x,
                top: iso.y,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * rooms.indexOf(room) }}
              whileHover={{ scale: 1.05, z: 50 }}
            >
              {/* Room 3D Block */}
              <svg
                width={Math.abs(isoSize.x) + 100}
                height={Math.abs(isoSize.y) + 150}
                className="cursor-pointer"
                onClick={() => setSelectedRoom(room)}
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
              >
                {/* Top face */}
                <polygon
                  points={`0,50 ${Math.abs(isoSize.x)},${50 - Math.abs(isoSize.y) * 0.5} ${
                    Math.abs(isoSize.x) * 2
                  },50 ${Math.abs(isoSize.x)},${50 + Math.abs(isoSize.y) * 0.5}`}
                  fill={room.color}
                  opacity="0.9"
                  className="transition-all hover:opacity-100"
                />

                {/* Left face */}
                <polygon
                  points={`0,50 ${Math.abs(isoSize.x)},${50 + Math.abs(isoSize.y) * 0.5} ${Math.abs(
                    isoSize.x
                  )},${150} 0,${100}`}
                  fill={room.color}
                  opacity="0.7"
                  className="transition-all hover:opacity-90"
                />

                {/* Right face */}
                <polygon
                  points={`${Math.abs(isoSize.x) * 2},50 ${Math.abs(isoSize.x)},${
                    50 + Math.abs(isoSize.y) * 0.5
                  } ${Math.abs(isoSize.x)},${150} ${Math.abs(isoSize.x) * 2},${100}`}
                  fill={room.color}
                  opacity="0.6"
                  className="transition-all hover:opacity-80"
                />
              </svg>

              {/* Room Label */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="flex items-center gap-2 text-white">
                  {room.icon}
                  <span className="font-semibold">{room.name}</span>
                </div>
              </motion.div>

              {/* Pulsing Indicator */}
              <motion.div
                className="absolute top-1/4 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          );
        })}

        {/* Connection Lines */}
        <svg
          width="1000"
          height="800"
          className="absolute pointer-events-none"
          style={{ left: '-500px', top: '-400px' }}
        >
          {rooms.slice(0, -1).map((room, idx) => {
            const nextRoom = rooms[idx + 1];
            const iso1 = toIsometric(room.position.x, room.position.y);
            const iso2 = toIsometric(nextRoom.position.x, nextRoom.position.y);

            return (
              <motion.line
                key={`line-${idx}`}
                x1={500 + iso1.x}
                y1={400 + iso1.y}
                x2={500 + iso2.x}
                y2={400 + iso2.y}
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: idx * 0.2 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Room Details Panel */}
      {selectedRoom && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-40"
        >
          {/* Header */}
          <div
            className="p-6"
            style={{ background: `linear-gradient(135deg, ${selectedRoom.color}, ${selectedRoom.color}dd)` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  {selectedRoom.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedRoom.name}</h2>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-white/90">{selectedRoom.description}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Images */}
            <div className="grid grid-cols-2 gap-2">
              {selectedRoom.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedRoom.name} ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-2">
              {selectedRoom.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-blue-200">{stat.label}</span>
                  <span className="text-white font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={{ background: selectedRoom.color }}
            >
              View Full Gallery →
            </button>
          </div>
        </motion.div>
      )}

      {/* Mini Map */}
      <div className="absolute bottom-6 right-6 w-48 h-48 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden z-40">
        <div className="p-2">
          <p className="text-white text-xs font-semibold mb-2">Mini Map</p>
          <div className="relative w-full h-36 bg-slate-800 rounded-lg">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform"
                style={{
                  background: room.color,
                  left: `${(room.position.x / 800) * 100}%`,
                  top: `${(room.position.y / 600) * 100}%`,
                }}
                onClick={() => setSelectedRoom(room)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

