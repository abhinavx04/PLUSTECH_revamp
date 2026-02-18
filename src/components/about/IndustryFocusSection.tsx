import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const industries = [
  { label: 'Automotive / Commercial Vehicles', image: '/industry focus/Automotive_Commercial.png' },
  { label: '2-Wheelers & 3-Wheeler Plant Chassis and Parts', image: '/industry focus/2-3_wheeler.png' },
  { label: 'Automotive Plastics', image: '/industry focus/Automotive_parts.png' },
  { label: 'Farm and Construction Machinery', image: '/industry focus/Farm_construction.png' },
  { label: 'Consumer Durables', image: '/industry focus/consumer_durables.png' },
  { label: 'General Industry', image: '/industry focus/General_industry.png' },
];

const IndustrySection: React.FC<{
  label: string;
  image: string;
  index: number;
}> = ({ label, image, index }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const isLast = index === industries.length - 1;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Phase 1: Elements slide in (0.1 → 0.35)
  const headingX = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    [isEven ? -250 : 250, 0]
  );
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const imageX = useTransform(
    scrollYProgress,
    [0.12, 0.37],
    [isEven ? 300 : -300, 0]
  );
  const imageOpacity = useTransform(scrollYProgress, [0.12, 0.32], [0, 1]);

  // Phase 2: Image expands to fill (0.35 → 0.55)
  const imageScale = useTransform(scrollYProgress, [0.35, 0.55], [1, 1.15]);
  const imageWidth = useTransform(scrollYProgress, [0.35, 0.55], ['55%', '100%']);
  const imageHeight = useTransform(scrollYProgress, [0.35, 0.55], ['70%', '100%']);
  const imageBorderRadius = useTransform(scrollYProgress, [0.35, 0.55], [20, 0]);
  const imageLeft = useTransform(
    scrollYProgress,
    [0.35, 0.55],
    isEven ? ['45%', '0%'] : ['0%', '0%']
  );
  const imageRight = useTransform(
    scrollYProgress,
    [0.35, 0.55],
    isEven ? ['auto', '0%'] : ['auto', '0%']
  );

  // Overlay fades in during merge
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0.05, 0.5]);

  // Heading transitions: side-aligned → centered as image fills
  const headingColor = useTransform(
    scrollYProgress,
    [0.35, 0.53],
    ['#111827', '#ffffff']
  );
  const headingTextShadow = useTransform(
    scrollYProgress,
    [0.35, 0.53],
    ['0 0 0 transparent', '0 4px 20px rgba(0,0,0,0.5)']
  );

  // Subtle line accent under heading
  const lineWidth = useTransform(scrollYProgress, [0.25, 0.45], ['0%', '80px']);
  const lineOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const lineColor = useTransform(
    scrollYProgress,
    [0.35, 0.53],
    ['#00aeef', '#ffffff']
  );

  const writeUpOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 0.7]);

  const sectionHeightClass = isLast ? 'h-[calc(100vh-80px)]' : 'h-[120vh]';

  return (
    <div ref={sectionRef} className={`${sectionHeightClass} relative`}>
      <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full overflow-hidden">
        {/* Image container — starts on one side, expands to fill */}
        <motion.div
          className="absolute overflow-hidden"
          style={{
            x: imageX,
            opacity: imageOpacity,
            width: imageWidth,
            height: imageHeight,
            borderRadius: imageBorderRadius,
            left: isEven ? imageLeft : '0%',
            right: isEven ? 'auto' : imageRight,
            top: '50%',
            translateY: '-50%',
          }}
        >
          <motion.img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
            style={{ scale: imageScale }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#1a2a3a]/80 via-[#36454F]/60 to-[#1a2a3a]/80"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        {/* Heading — centered vertically, alternates horizontal side */}
        <div className="absolute inset-0 flex items-center">
          <motion.div
            className={`relative z-10 max-w-xl px-8 md:px-16 ${
              isEven
                ? 'mr-auto ml-[5%] md:ml-[8%] text-left'
                : 'ml-auto mr-[5%] md:mr-[8%] text-right'
            }`}
            style={{
              x: headingX,
              opacity: headingOpacity,
            }}
          >
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{
                color: headingColor,
                textShadow: headingTextShadow,
              }}
            >
              {label}
            </motion.h2>

            <motion.div
              className={`h-1 mt-4 rounded-full ${isEven ? 'mr-auto' : 'ml-auto'}`}
              style={{
                width: lineWidth,
                opacity: lineOpacity,
                backgroundColor: lineColor,
              }}
            />

            <motion.p
              className="mt-4 text-lg md:text-xl leading-relaxed"
              style={{
                color: headingColor,
                opacity: writeUpOpacity,
              }}
            >
              &nbsp;
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const IndustrySectionMobile: React.FC<{
  label: string;
  image: string;
  index: number;
}> = ({ label, image }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0.05, 0.3], [60, 0]);
  const imageOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.05, 0.3], [0.95, 1]);

  const textY = useTransform(scrollYProgress, [0.15, 0.35], [30, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  const lineWidth = useTransform(scrollYProgress, [0.25, 0.45], ['0px', '60px']);

  return (
    <div ref={cardRef} className="px-4 py-6">
      <motion.div
        className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white"
        style={{ y: imageY, opacity: imageOpacity, scale: imageScale }}
      >
        <div className="relative w-full bg-slate-50">
          <img
            src={image}
            alt={label}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>

        <motion.div
          className="px-5 py-5"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            className="h-[3px] rounded-full bg-[#00aeef] mb-3"
            style={{ width: lineWidth }}
          />
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {label}
          </h2>
        </motion.div>
      </motion.div>
    </div>
  );
};

const IndustryFocusSection: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Compact intro header */}
      <div className="pt-8 md:pt-10 pb-8 md:pb-10 flex flex-col items-center text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-black mb-3 md:mb-4">
          Industry Focus
        </h1>
        <p className="text-gray-600 text-base md:text-xl max-w-2xl">
          Core segments we serve across engineering and manufacturing.
        </p>
      </div>

      {/* Industry sections — desktop: parallax, mobile: reveal cards */}
      {industries.map((industry, index) => (
        <React.Fragment key={industry.label}>
          <div className="hidden md:block">
            <IndustrySection
              label={industry.label}
              image={industry.image}
              index={index}
            />
          </div>
          <div className="md:hidden">
            <IndustrySectionMobile
              label={industry.label}
              image={industry.image}
              index={index}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default IndustryFocusSection;

