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
}

const sections: OfficeSection[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Where Innovation Begins',
    images: {
      background: '/office/entrance/entrance.jpeg',
      midground: '/office/entrance/entrance.jpeg',
      foreground: '/office/entrance/entrance.jpeg',
    },
    description: 'Step into our modern facility and experience excellence',
    highlights: ['Modern Design', 'Welcoming Space', 'Professional Environment'],
  },
  {
    id: 'engineering',
    title: 'Engineering',
    subtitle: 'Where Ideas Take Shape',
    images: {
      background: '/office/engineering/IMG_8093.jpg',
      midground: '/office/engineering/IMG_8093.jpg',
      foreground: '/office/engineering/IMG_8093.jpg',
    },
    description: 'Technical excellence and innovation at the heart of our operations',
    highlights: ['Technical Expertise', 'Innovation Hub', 'Precision Engineering'],
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Delivering Excellence',
    images: {
      background: '/office/Projects/IMG_8073.jpg',
      midground: '/office/Projects/IMG_8073.jpg',
      foreground: '/office/Projects/IMG_8073.jpg',
    },
    description: 'Project management and coordination center driving success',
    highlights: ['Project Excellence', 'Team Collaboration', 'Strategic Planning'],
  },
  {
    id: 'proposals',
    title: 'Proposals',
    subtitle: 'Crafting Solutions',
    images: {
      background: '/office/proposals/IMG_8086.jpg',
      midground: '/office/proposals/IMG_8086.jpg',
      foreground: '/office/proposals/IMG_8086.jpg',
    },
    description: 'Where innovative proposals and solutions come to life',
    highlights: ['Creative Solutions', 'Documentation Excellence', 'Client Focus'],
  },
  {
    id: 'accounts',
    title: 'Accounts',
    subtitle: 'Financial Excellence',
    images: {
      background: '/office/accounts/IMG_8122.jpg',
      midground: '/office/accounts/IMG_8122.jpg',
      foreground: '/office/accounts/IMG_8122.jpg',
    },
    description: 'Accounts and finance department managing financial operations',
    highlights: ['Financial Management', 'Precision', 'Accountability'],
  },
  {
    id: 'admin-hr',
    title: 'Admin & HR',
    subtitle: 'Supporting Our People',
    images: {
      background: '/office/Admin%20and%20HR/IMG_8124.jpg',
      midground: '/office/Admin%20and%20HR/IMG_8124.jpg',
      foreground: '/office/Admin%20and%20HR/IMG_8124.jpg',
    },
    description: 'Administration and Human Resources department',
    highlights: ['People Management', 'Administrative Excellence', 'Team Support'],
  },
  {
    id: 'purchase',
    title: 'Purchase',
    subtitle: 'Strategic Procurement',
    images: {
      background: '/office/purchase/IMG_8115.jpg',
      midground: '/office/purchase/IMG_8115.jpg',
      foreground: '/office/purchase/IMG_8115.jpg',
    },
    description: 'Procurement and purchasing department',
    highlights: ['Strategic Sourcing', 'Efficient Procurement', 'Supply Chain'],
  },
  {
    id: 'chevron',
    title: 'Conference Room',
    subtitle: 'Collaborative Spaces',
    images: {
      background: '/office/chevron/IMG_8109.jpg',
      midground: '/office/chevron/IMG_8109.jpg',
      foreground: '/office/chevron/IMG_8109.jpg',
    },
    description: 'Modern conference room for meetings and presentations',
    highlights: ['Professional Meetings', 'Modern Facilities', 'Collaboration'],
  },
  {
    id: 'md',
    title: 'Managing Director',
    subtitle: 'Strategic Leadership',
    images: {
      background: '/office/MD/IMG_8130.jpg',
      midground: '/office/MD/IMG_8130.jpg',
      foreground: '/office/MD/IMG_8130.jpg',
    },
    description: 'Managing Director office driving strategic vision and growth',
    highlights: ['Strategic Vision', 'Executive Excellence', 'Leadership'],
  },
  {
    id: 'director',
    title: 'Director',
    subtitle: 'Guiding Excellence',
    images: {
      background: '/office/Dir/IMG_8128.jpg',
      midground: '/office/Dir/IMG_8128.jpg',
      foreground: '/office/Dir/IMG_8128.jpg',
    },
    description: 'Director office and executive leadership',
    highlights: ['Executive Leadership', 'Strategic Planning', 'Excellence'],
  },
];

export const OfficeParallaxTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Preload images for better performance
  useEffect(() => {
    const imagePromises = sections.flatMap((section) => [
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = section.images.background;
      }),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = section.images.midground;
      }),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = section.images.foreground;
      }),
    ]);

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => {
        setImagesLoaded(true);
      });
  }, []);

  return (
    <div ref={containerRef} className="relative bg-slate-900">
      {/* Loading overlay */}
      {!imagesLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: imagesLoaded ? 0 : 1 }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-3 border-[#00aeef] border-t-transparent rounded-full"
          />
          <span className="text-slate-600 text-sm">Loading tour...</span>
        </motion.div>
      )}

      {/* Fixed Progress Indicator - Brand cyan */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00aeef] z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Sections */}
      {sections.map((section, index) => (
        <ParallaxSection
          key={section.id}
          section={section}
          index={index}
          onVisible={() => setActiveSection(index)}
        />
      ))}

      {/* Floating Info Card - Elegant light design */}
      <div className="fixed bottom-8 left-8 z-40 max-w-md hidden md:block">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 rounded-full bg-[#00aeef]" />
            <div>
              <span className="text-xs font-medium text-[#00aeef] uppercase tracking-wider">
                {String(activeSection + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {sections[activeSection].title}
              </h3>
            </div>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed pl-5">
            {sections[activeSection].description}
          </p>
          <div className="flex flex-wrap gap-2 pl-5">
            {sections[activeSection].highlights.map((highlight, idx) => (
              <motion.span
                key={highlight}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-700 font-medium"
              >
                {highlight}
              </motion.span>
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

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1.1, 1, 1, 0.95]);

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
      {/* Background Image with subtle scale */}
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${section.images.foreground})`,
          }}
        />
        {/* Elegant overlay - gradient with brand tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
        <div className="absolute inset-0 bg-[#00aeef]/5" />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        className="relative z-30 text-center px-8"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Section number badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
          >
            <span className="text-sm font-medium text-white/80">
              Section {String(index + 1).padStart(2, '0')}
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 leading-tight"
            style={{
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            {section.title}
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-6"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {section.subtitle}
          </motion.p>

          {/* Accent line */}
          <motion.div
            className="w-24 h-1 bg-[#00aeef] mx-auto rounded-full mb-6"
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          {/* Section description - mobile only */}
          <motion.p
            className="text-base md:hidden text-white/80 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {section.description}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Side accent line */}
      <motion.div
        className="absolute top-0 left-0 w-1 z-30 bg-[#00aeef] origin-top"
        style={{
          height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
          opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
        }}
      />
    </div>
  );
};
