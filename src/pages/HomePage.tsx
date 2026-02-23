import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Threads from '../components/Threads';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import CapabilitiesSection from '../components/CapabilitiesSection';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { PageLayout } from '../components/PageLayout';
import { ImageViewer } from '../components/ui/ImageViewer';

const MobileHeroPattern = lazy(() => import('../components/MobileHeroPattern'));

const HomePage: React.FC = () => {
  const [selectedWelcomeImage, setSelectedWelcomeImage] = useState<number | null>(null);
  const welcomeImages = ['/office/entrance/Reception.webp'];

  // Smooth scroll function with dynamic speed based on distance
  const smoothScrollTo = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    // Calculate duration based on distance (min 800ms, max 2000ms)
    // For short distances, use longer duration to make it more visible
    const baseDuration = Math.abs(distance) < 500 ? 1200 : 800;
    const duration = Math.min(2000, Math.max(baseDuration, Math.abs(distance) / 2));
    
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <>
      <SEO 
        title="PLUSTECH - Surface Finishing Solutions & Automation Systems"
        description="At Plustech, we design and build surface finishing plants for automotive and general industries. With expertise in engineering, automation, and commissioning, we deliver customized solutions that combine innovation, efficiency, and quality."
        url="/"
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50 to-white">
      <main>

      {/* Threads Hero - Desktop Only */}
      <div className="hidden md:flex w-full items-center justify-center pt-20 overflow-visible">
        <div className="w-full h-[80vh] relative overflow-visible">
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
            <div className="text-center px-6 lg:px-8 max-w-5xl">
              <h1 className="text-black/60 text-6xl font-extrabold tracking-tight leading-tight font-heading" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontWeight: 950 }}>
                DEVELOPING SOLUTIONS<br />DELIVERING QUALITY
              </h1>
            </div>
          </div>
          <Threads color={[0, 0.8, 1]} amplitude={1.2} distance={0.7} animationSpeed={0.5} enableMouseInteraction={true} />
        </div>
      </div>

      {/* Mobile Hero - Immersive */}
      <div className="md:hidden w-full pt-16">
        <div className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
          {/* Light gradient background matching site aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/80 to-white" />

          {/* Subtle blueprint grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,100,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,180,1) 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }}
          />

          {/* Geometric pattern */}
          <Suspense fallback={null}>
            <MobileHeroPattern />
          </Suspense>

          {/* Content layer */}
          <div className="relative z-10 text-center px-6 py-10 flex flex-col items-center">

            {/* Kinetic heading */}
            <h1 className="font-heading" style={{ fontWeight: 950 }}>
              {['DEVELOPING', 'SOLUTIONS'].map((word, i) => (
                <motion.span
                  key={`l1-${i}`}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-2xl sm:text-3xl tracking-tight text-slate-800 mr-2 last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {['DELIVERING', 'QUALITY'].map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.55 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-2xl sm:text-3xl tracking-tight text-slate-800 mr-2 last:mr-0"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Animated accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-[#00aeef] to-transparent origin-center"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-3 text-xs sm:text-sm text-slate-400 font-body tracking-widest uppercase"
            >
              Engineering precision. Delivering excellence.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col items-center gap-4 w-full"
            >
              <button
                onClick={() => smoothScrollTo('capabilities')}
                className="hero-shimmer w-full max-w-[280px] px-6 py-3.5 rounded-full bg-[#00aeef] text-white font-bold tracking-wide shadow-[0_4px_24px_rgba(0,174,239,0.35)] active:scale-[0.97] transition-transform duration-150"
              >
                Get Started
              </button>

              <a
                href="/about"
                className="w-full max-w-[280px] px-6 py-3.5 rounded-full text-center font-semibold text-[#0077a8] border-2 border-[#00aeef]/50 bg-white/80 backdrop-blur-sm active:scale-[0.97] transition-all duration-200"
              >
                Discover Our Company
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop CTAs */}
      <div className="w-full hidden md:flex items-center justify-center mt-12 md:mt-16">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => smoothScrollTo('capabilities')}
            className="px-8 md:px-10 py-4 rounded-full bg-[#00aeef] text-black font-semibold shadow-[0_8px_24px_rgba(0,174,239,0.3)] hover:bg-[#0099d4] transition-all duration-300 text-lg transform hover:scale-105 cursor-pointer"
          >
            Get Started
          </button>
          <a href="/about" className="px-8 md:px-10 py-4 rounded-full bg-white text-[#0077a8] font-semibold hover:bg-gray-50 transition-all duration-300 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] border-2 border-[#00aeef] transform hover:scale-105">
            Discover Our Company
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
                Welcome to Plustech
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-body leading-relaxed text-justify">
                At Plustech, we design and build surface finishing plants for automotive and general
                industries. With expertise in engineering, automation, and commissioning, we deliver
                customized solutions that combine innovation, efficiency, and quality.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <div 
                className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedWelcomeImage(0)}
              >
                <OptimizedImage
                  src="/office/entrance/Reception.webp"
                  alt="Plustech Entrance"
                  className="w-full h-auto"
                  objectFit="contain"
                  width={800}
                  height={600}
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div id="capabilities" className="bg-white">
        <CapabilitiesSection />
            </div>

      {/* Brand Promise Text moved below capabilities */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-10 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-black/70 text-base md:text-lg font-body leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            At Plustech, we design, engineer, and deliver precision systems that connect people, processes, and products—so your operations run smarter, faster, and safer.
          </p>
        </div>
      </div>

      {/* Company Logos Animation – Trusted by leading companies */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 bg-gradient-to-b from-white via-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

        <Footer />
      </main>
      </PageLayout>

      {/* Welcome Image Viewer */}
      {selectedWelcomeImage !== null && (
        <ImageViewer
          images={welcomeImages}
          currentIndex={selectedWelcomeImage}
          onClose={() => setSelectedWelcomeImage(null)}
          alt="Plustech Entrance"
        />
      )}
    </>
  );
};

export default HomePage;
