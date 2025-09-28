import React from 'react';
import { motion } from 'framer-motion';
import DarkVeil from './DarkVeil'; // Your existing animation

// The tagline text
const line1 = "Developing Solutions";
const line2 = "Delivering Quality";

// Animation variants for the container to orchestrate the sequence
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // Delay between line 1 and line 2 animations
      delayChildren: 1,     // Initial delay before anything starts
    },
  },
};

// Animation variants for the first line (letter-by-letter)
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
};

// Animation variants for the second line (slide in)
const line2Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ease: 'circOut',
      duration: 1.2,
    },
  },
};

// Animation variants for the "Quality Bar"
const qualityBarVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.2,
      ease: 'circOut',
      delay: 0.5, // Start drawing the bar shortly after the text appears
    },
  },
};

export default function HeroLayout() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black font-sans" style={{ zIndex: 1, fontFamily: 'Poppins, sans-serif' }}>
      {/* 1. The untouched background animation */}
      <div className="absolute inset-0">
        <DarkVeil
          hueShift={10}
          warpAmount={0.2}
          speed={0.3}
          noiseIntensity={0.01}
        />
      </div>

      {/* 2. The new, animated tagline, styled with Tailwind CSS */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] right-[5%] text-white md:left-[8%] md:right-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Line 1: "Developing Solutions" */}
        <motion.h1
          className="m-0 text-[2rem] font-semibold tracking-wide text-white/80 md:text-[2.5rem]"
          aria-label={line1}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {line1.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={letterVariants}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Line 2: "Delivering Quality" with the bar */}
        <motion.div className="mt-4" variants={line2Variants}>
          <h2 className="m-0 text-[1rem] font-light uppercase tracking-[1.5px] text-[#00ddff] md:text-[1.25rem]">
            {line2}
          </h2>
          <motion.div
            className="mt-3 h-[2px] bg-gradient-to-r from-cyan-400/50 to-cyan-400 shadow-[0_0_8px_rgba(0,221,255,0.6)]"
            variants={qualityBarVariants}
            // Ensure the bar originates from the left
            style={{ originX: 0 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
