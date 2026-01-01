import React, { useState, lazy, Suspense } from 'react';
// Lazy load Threads component (WebGL is heavy)
const Threads = lazy(() => import('../components/Threads'));
import CompanyAnimation from '../components/ui/CompanyAnimation';
import SimpleNewsSection from '../components/SimpleNewsSection';
// Lazy load CapabilitiesSection (contains Framer Motion)
const CapabilitiesSection = lazy(() => import('../components/CapabilitiesSection'));
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { PageLayout } from '../components/PageLayout';
import { ImageViewer } from '../components/ui/ImageViewer';

const HomePage: React.FC = () => {
  const [selectedWelcomeImage, setSelectedWelcomeImage] = useState<number | null>(null);
  const welcomeImages = ['/office/entrance/entrance.jpeg'];

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

      {/* Threads Hero */}
      <div className="w-full flex items-center justify-center pt-20">
        <div className="w-full h-[50vh] md:h-[60vh] relative">
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
            <div className="text-center px-4 md:px-6 lg:px-8 max-w-5xl">
              <h1 className="text-black/60 text-3xl md:text-6xl font-extrabold tracking-tight leading-tight font-heading" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontWeight: 950 }}>
                DEVELOPING SOLUTIONS<br />DELIVERING QUALITY
              </h1>
            </div>
          </div>
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-blue-50 to-blue-100" />}>
            <Threads color={[0, 0.8, 1]} amplitude={1.6} distance={0.7} animationSpeed={0.5} enableMouseInteraction={true} />
          </Suspense>
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full hidden md:flex items-center justify-center mt-8 md:mt-12">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => smoothScrollTo('capabilities')}
            className="px-8 md:px-10 py-4 rounded-full bg-[#00aeef] text-white font-semibold shadow-[0_8px_24px_rgba(0,174,239,0.3)] hover:bg-[#0099d4] transition-all duration-300 text-lg transform hover:scale-105 cursor-pointer"
          >
            Get Started
          </button>
          <a href="/about" className="px-8 md:px-10 py-4 rounded-full bg-white text-[#00aeef] font-semibold hover:bg-gray-50 transition-all duration-300 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-[#00aeef]/20 transform hover:scale-105">
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
                className="w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedWelcomeImage(0)}
              >
                <OptimizedImage
                  src="/office/entrance/entrance.jpeg"
                  alt="Plustech Entrance"
                  className="w-full h-full"
                  objectFit="cover"
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
        <Suspense fallback={
          <div className="w-full py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
          </div>
        }>
          <CapabilitiesSection />
        </Suspense>
      </div>

      {/* Brand Promise Text moved below capabilities */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-10 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-black/70 text-base md:text-lg font-body leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            At PlusTech, we design, engineer, and deliver precision systems that connect people, processes, and products—so your operations run smarter, faster, and safer.
                </p>
              </div>
            </div>

      {/* News Section – Latest News & Updates */}
      <div className="bg-slate-50 border-t border-slate-200">
        <SimpleNewsSection />
        </div>

      {/* Company Logos Animation – Trusted by leading companies */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

        <Footer />
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
