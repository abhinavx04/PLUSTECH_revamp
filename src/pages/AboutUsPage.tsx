import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../components/ui/resizable-navbar';
import Footer from '../components/Footer';
import AboutSubNav from '../components/about/AboutSubNav';
import { Outlet } from 'react-router-dom';
import CountUp from '../components/ui/CountUp';

const AboutUsPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax removed to avoid overlay issues with fixed navbar

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];


  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-white pt-16">
      {/* Enhanced Navbar with Timeline Progress */}
      <div className="relative w-full">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24"></div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              <div className="space-y-4">
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-[#00aeef] transition-colors py-4 px-4 rounded-lg hover:bg-white/10 font-semibold text-lg border-b border-white/10 last:border-b-0"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      {/* Timeline sidebar removed to match requested design */}

      {/* Hero Section with Background Image */}
      <motion.section 
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/aboutus/Banner4-1536x1024.jpg)' }}
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

      {/* Sub-Navigation (route-based) placed below hero, non-sticky) */}
      <AboutSubNav />

      {/* Routed Section Content */}
      <div className="relative py-16 px-6 md:px-12 lg:px-16">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
