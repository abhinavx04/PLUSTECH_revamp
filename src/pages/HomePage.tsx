import React, { useState } from 'react';
import Threads from '../components/Threads';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import SimpleNewsSection from '../components/SimpleNewsSection';
import CapabilitiesSection from '../components/CapabilitiesSection';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { PageLayout } from '../components/PageLayout';
import { ImageViewer } from '../components/ui/ImageViewer';

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

      {/* Mobile Hero - Simplified */}
      <div className="md:hidden w-full pt-20 pb-8">
        <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-50">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#00aeef]/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-cyan-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <h1 className="text-black/70 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-heading" style={{ fontWeight: 950 }}>
              DEVELOPING SOLUTIONS<br />DELIVERING QUALITY
            </h1>
            
            {/* Mobile CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button 
                onClick={() => smoothScrollTo('capabilities')}
                className="w-full max-w-xs px-6 py-3 rounded-full bg-[#00aeef] text-black font-semibold shadow-lg shadow-[#00aeef]/30 hover:bg-[#0099d4] transition-all duration-300"
              >
                Get Started
              </button>
              <a 
                href="/about" 
                className="w-full max-w-xs px-6 py-3 rounded-full bg-white text-[#0077a8] font-semibold border-2 border-[#00aeef] transition-all duration-300 text-center"
              >
                Discover Our Company
              </a>
            </div>
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
            At PlusTech, we design, engineer, and deliver precision systems that connect people, processes, and products—so your operations run smarter, faster, and safer.
                </p>
              </div>
            </div>

      {/* News Section – Latest News & Updates */}
      <div className="bg-white">
        <SimpleNewsSection />
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
