import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import CountUp from '../components/ui/CountUp';
import { PageLayout } from '../components/PageLayout';

const AboutUsPage: React.FC = () => {
  const location = useLocation();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutUsSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the root /about page (not a sub-page)
  const isRootAboutPage = location.pathname === '/about';
  
  // Auto-scroll to content section when navigating to sub-pages or About Us page
  useEffect(() => {
    // Check if we're on a sub-page (not root /about)
    const isSubPage = location.pathname !== '/about' && location.pathname.startsWith('/about/');
    
    if (isSubPage && contentSectionRef.current) {
      // Scroll to content section for sub-pages
      setTimeout(() => {
        const offset = 80; // Account for navbar height
        const elementPosition = contentSectionRef.current?.getBoundingClientRect().top || 0;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 150);
    } else if (isRootAboutPage && aboutUsSectionRef.current) {
      // Auto-scroll to About Us section after hero section on /about page
      setTimeout(() => {
        const offset = 80; // Account for navbar height
        const elementPosition = aboutUsSectionRef.current?.getBoundingClientRect().top || 0;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 2000); // Delay to show hero section first (2 seconds)
    }
  }, [location.pathname, isRootAboutPage]);

  // Parallax removed to avoid overlay issues with fixed navbar

  return (
    <PageLayout className="bg-white pt-16">

      {/* Timeline sidebar removed to match requested design */}

      {/* Hero Section with Background Image - Only shown on root /about page */}
      {isRootAboutPage && (
        <>
      <motion.section 
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/aboutus/Banner4-1536x1024.webp)' }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-6 md:px-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight font-heading mb-6"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Our Story Through
            <span className="block text-[#00aeef] mt-2">Innovation</span>
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Discover the journey that has shaped PlusTech into a trusted partner 
            in building intelligent solutions for modern manufacturing.
          </motion.p>

          {/* Glass Stats Boxes */}
          <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold">
                <CountUp to={18} durationMs={1400} />
                <span className="ml-1 align-top">+</span>
              </div>
              <div className="mt-1 text-sm md:text-base text-white/80">Years of Excellence</div>
            </motion.div>
            <motion.div
              className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold">
                <CountUp to={50} durationMs={1400} delayMs={120} />
                <span className="ml-1 align-top">+</span>
              </div>
              <div className="mt-1 text-sm md:text-base text-white/80">Blue-chip Clients</div>
            </motion.div>
            <motion.div
              className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold">
                <CountUp to={2} durationMs={1400} delayMs={240} />
                <span className="ml-1 align-top">+</span>
              </div>
              <div className="mt-1 text-sm md:text-base text-white/80">Countries Served</div>
            </motion.div>
          </div>

          
        </motion.div>
      </motion.section>

          {/* About Us Section - Only shown on root /about page */}
          <section ref={aboutUsSectionRef} className="w-full px-6 md:px-12 lg:px-16 py-16 bg-white">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="w-full">
                  <video 
                    className="w-full rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.25)]" 
                    src="/home/aboutvideo.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    preload="metadata"
                  />
                </div>
                <div className="space-y-5">
                  <h3 className="text-3xl md:text-4xl font-heading font-bold text-black">ABOUT US</h3>
                  <div className="text-lg md:text-xl text-gray-800 font-body leading-relaxed space-y-4 text-justify">
                    <p>
                      Plustech Systems and Solutions is a trusted partner in building integrated paintshops for automotive and general industry applications. With expertise spanning design, engineering, procurement, construction, and commissioning, we provide customized solutions tailored to each customer's unique requirements.
                    </p>
                    <p>
                      Our reputation has been built over the years on delivering paintshops that embody consistency, reliability, and robust performance. Whether semi-automatic or fully automatic, every solution reflects our commitment to continuous improvement, innovation, and long-term value for our clients.
                    </p>
                    <p>
                      At Plustech, we don't just build plants—we build partnerships that enable industries to achieve precision, efficiency, and excellence in finishing operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Routed Section Content */}
      <div ref={contentSectionRef} className={`relative px-6 md:px-12 lg:px-16 z-10 ${isRootAboutPage ? 'py-16' : 'pt-8 pb-16'}`}>
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </PageLayout>
  );
};

export default AboutUsPage;
