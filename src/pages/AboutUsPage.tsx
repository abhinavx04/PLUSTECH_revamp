import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import CorporateBeliefsSection from '../components/about/CorporateBeliefsSection';
import IndustryFocusSection from '../components/about/IndustryFocusSection';
import CertificationsSection from '../components/about/CertificationsSection';
import HistoryMilestonesSection from '../components/about/HistoryMilestonesSection';
import AnnualReturnsSection from '../components/about/AnnualReturnsSection';
import CSRActivitiesSection from '../components/about/CSRActivitiesSection';

const AboutUsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];


  const sectionTitles = [
    'Corporate Beliefs',
    'Industry Focus',
    'Certifications',
    'History & Milestones',
    'Annual Returns',
    'CSR Activities'
  ];

  // Add section refs
  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current[index] = el;
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const section = sectionsRef.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-white">
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

      {/* Timeline Navigation Sidebar */}
      <motion.div 
        ref={timelineRef}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex flex-col space-y-4">
          {sectionTitles.map((title, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`relative group flex items-center space-x-3 transition-all duration-300 ${
                activeSection === index ? 'text-[#00aeef]' : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Progress Line */}
              <div className="w-12 h-0.5 bg-gray-300 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#00aeef]"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: activeSection >= index ? '100%' : '0%' 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Section Number */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-[#00aeef] text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
              }`}>
                {index + 1}
              </div>
              
              {/* Section Title */}
              <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white px-3 py-1 rounded-lg">
                {title}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Hero Section with Background Image */}
      <motion.section 
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ y: backgroundY }}
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

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="w-1 h-3 bg-white/80 rounded-full mt-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Timeline Sections */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden lg:block absolute left-[4.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00aeef] via-gray-300 to-gray-300 z-0" />
        
        {/* Section 1: Corporate Beliefs */}
        <section 
          ref={(el) => addToRefs(el, 0)}
          id="corporate-beliefs"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-white/95" />
          <div className="relative z-10">
            <CorporateBeliefsSection />
          </div>
        </section>

        {/* Section 2: Industry Focus */}
        <section 
          ref={(el) => addToRefs(el, 1)}
          id="industry-focus"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-white/90" />
          <div className="relative z-10">
            <IndustryFocusSection />
          </div>
        </section>

        {/* Section 3: Certifications */}
        <section 
          ref={(el) => addToRefs(el, 2)}
          id="certifications"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-blue-50/95" />
          <div className="relative z-10">
            <CertificationsSection />
          </div>
        </section>

        {/* Section 4: History & Milestones */}
        <section 
          ref={(el) => addToRefs(el, 3)}
          id="history-milestones"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-white/90" />
          <div className="relative z-10">
            <HistoryMilestonesSection />
          </div>
        </section>

        {/* Section 5: Annual Returns */}
        <section 
          ref={(el) => addToRefs(el, 4)}
          id="annual-returns"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-blue-50/95" />
          <div className="relative z-10">
            <AnnualReturnsSection />
          </div>
        </section>

        {/* Section 6: CSR Activities */}
        <section 
          ref={(el) => addToRefs(el, 5)}
          id="csr-activities"
          className="relative py-20 px-6 md:px-12 lg:px-16"
          style={{ backgroundImage: 'url(/aboutus/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-white/90" />
          <div className="relative z-10">
            <CSRActivitiesSection />
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
