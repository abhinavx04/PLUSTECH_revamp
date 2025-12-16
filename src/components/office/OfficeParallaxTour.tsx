import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface OfficeSection {
  id: string;
  title: string;
  subtitle: string;
  images: {
    background: string;
    midground: string;
    foreground: string;
  };
  description: string;
  highlights: string[];
  color: string;
}

const sections: OfficeSection[] = [
  {
    id: 'entrance',
    title: 'Welcome',
    subtitle: 'Where Innovation Begins',
    images: {
      background: '/office/entrance/bg.jpg',
      midground: '/office/entrance/mid.jpg',
      foreground: '/office/entrance/fg.jpg',
    },
    description: 'Step into the future of manufacturing',
    highlights: ['Modern Design', '24/7 Security', 'Smart Access'],
    color: '#3B82F6',
  },
  {
    id: 'production',
    title: 'Production Floor',
    subtitle: 'Where Magic Happens',
    images: {
      background: '/office/production/bg.jpg',
      midground: '/office/production/mid.jpg',
      foreground: '/office/production/fg.jpg',
    },
    description: 'State-of-the-art manufacturing facility',
    highlights: ['Automated Systems', 'Quality Control', 'Efficiency'],
    color: '#8B5CF6',
  },
  {
    id: 'robotics',
    title: 'Robotics Lab',
    subtitle: 'Future of Automation',
    images: {
      background: '/office/robotics/bg.jpg',
      midground: '/office/robotics/mid.jpg',
      foreground: '/office/robotics/fg.jpg',
    },
    description: 'Advanced robotics research and development',
    highlights: ['AI Integration', 'Custom Solutions', 'Innovation Hub'],
    color: '#EC4899',
  },
  {
    id: 'workspace',
    title: 'Creative Spaces',
    subtitle: 'Where Teams Collaborate',
    images: {
      background: '/office/workspace/bg.jpg',
      midground: '/office/workspace/mid.jpg',
      foreground: '/office/workspace/fg.jpg',
    },
    description: 'Open, collaborative work environment',
    highlights: ['Team Synergy', 'Modern Amenities', 'Comfort First'],
    color: '#10B981',
  },
];

export const OfficeParallaxTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Fixed Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        {sections.map((section, idx) => (
          <motion.button
            key={section.id}
            onClick={() => {
              const element = document.getElementById(section.id);
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative"
            whileHover={{ scale: 1.2 }}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                activeSection === idx
                  ? 'border-white bg-white scale-150'
                  : 'border-white/30 bg-transparent hover:border-white/60'
              }`}
              style={{
                boxShadow:
                  activeSection === idx
                    ? `0 0 20px ${section.color}`
                    : 'none',
              }}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-3 py-1 rounded">
              {section.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <ParallaxSection
          key={section.id}
          section={section}
          index={index}
          onVisible={() => setActiveSection(index)}
        />
      ))}

      {/* Floating Info Cards */}
      <div className="fixed bottom-8 left-8 z-40 max-w-md">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          style={{
            boxShadow: `0 0 40px ${sections[activeSection].color}40`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {sections[activeSection].title}
          </h3>
          <p className="text-blue-200 mb-4">
            {sections[activeSection].description}
          </p>
          <div className="flex flex-wrap gap-2">
            {sections[activeSection].highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
              >
                {highlight}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface ParallaxSectionProps {
  section: OfficeSection;
  index: number;
  onVisible: () => void;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  section,
  index,
  onVisible,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Different parallax speeds for depth effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const midgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '70%']);
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      id={section.id}
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Layers */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div
          className="w-full h-[120%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${section.images.background})`,
            filter: 'brightness(0.7)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10"
        style={{ y: midgroundY, opacity }}
      >
        <div
          className="w-full h-[120%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${section.images.midground})`,
            filter: 'brightness(0.8)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-20"
        style={{ y: foregroundY, opacity }}
      >
        <div
          className="w-full h-[120%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${section.images.foreground})`,
          }}
        />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        className="relative z-30 text-center px-8"
        style={{ opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-7xl md:text-9xl font-black text-white mb-4"
            style={{
              textShadow: `0 0 40px ${section.color}, 0 0 80px ${section.color}`,
            }}
          >
            {section.title}
          </motion.h2>
          <motion.p
            className="text-2xl md:text-4xl text-blue-200 font-light"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {section.subtitle}
          </motion.p>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: section.color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${section.color}20 100%)`,
        }}
      />

      {/* Section Number */}
      <motion.div
        className="absolute top-8 left-8 z-30 text-white/20 text-9xl font-black"
        style={{ opacity }}
      >
        0{index + 1}
      </motion.div>

      {/* Scroll Indicator (only on first section) */}
      {index === 0 && (
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-white text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

